import * as fs from 'fs';
import * as path from 'path';
import { DocNode, DiagnoseRecord, TimelineData } from '../types';

const BASE_DIR = path.join(__dirname, '../../..');

// 获取raw目录的根路径
export const getRawPath = (): string => {
  return path.join(BASE_DIR, 'raw');
};

// 获取各输出目录路径
export const getNewPath = (): string => path.join(BASE_DIR, 'new');
export const getReportPath = (): string => path.join(BASE_DIR, 'report');
export const getTimelinePath = (): string => path.join(BASE_DIR, 'timeline');

// 读取文档内容
export const readDocument = (relativePath: string): string => {
  const fullPath = path.join(getRawPath(), relativePath);
  return fs.readFileSync(fullPath, 'utf-8');
};

// 构建文档目录树
export const buildDocTree = (relativePath: string = ''): DocNode[] => {
  const rawRoot = getRawPath();
  const fullPath = path.join(rawRoot, relativePath);

  if (!fs.existsSync(rawRoot)) {
    console.warn('[buildDocTree] raw 目录不存在:', rawRoot);
    return [];
  }

  let items: string[];
  try {
    items = fs.readdirSync(fullPath);
  } catch (e) {
    console.error('[buildDocTree] 无法读取目录:', fullPath, e);
    return [];
  }

  const sortable = items
    .filter((item) => !item.startsWith('.'))
    .map((item) => {
      const itemPath = path.join(fullPath, item);
      try {
        const isDirectory = fs.statSync(itemPath).isDirectory();
        return { item, itemPath, isDirectory };
      } catch (e) {
        console.warn('[buildDocTree] 跳过无法访问的项:', itemPath, e);
        return null;
      }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.item.localeCompare(b.item);
    });

  const nodes: DocNode[] = [];
  for (const { item, itemPath, isDirectory } of sortable) {
    const itemRelativePath = path.join(relativePath, item);

    const node: DocNode = {
      name: item,
      path: itemPath,
      relativePath: itemRelativePath,
      type: isDirectory ? 'directory' : 'file',
    };

    try {
      if (isDirectory) {
        node.children = buildDocTree(itemRelativePath);
      } else {
        const history = getDiagnoseHistory(itemRelativePath);
        node.diagnoseStatus = history.length > 0 ? 'has-history' : 'none';
        if (history.length > 0) {
          node.lastDiagnoseTime = history[0].timestamp;
        }
      }
    } catch (e) {
      console.error('[buildDocTree] 处理节点失败:', itemRelativePath, e);
      if (!isDirectory) {
        node.diagnoseStatus = 'none';
      } else {
        node.children = [];
      }
    }

    nodes.push(node);
  }

  return nodes;
};

// 获取指定文档的诊断历史
export const getDiagnoseHistory = (documentRelativePath: string): DiagnoseRecord[] => {
  const timelineDir = getTimelinePath();

  // 构建可能的timeline文件名模式
  const docName = path.basename(documentRelativePath, '.md');
  const docDir = path.dirname(documentRelativePath);

  if (!fs.existsSync(timelineDir)) {
    return [];
  }

  const records: DiagnoseRecord[] = [];

  // 遍历timeline目录查找匹配的文件
  const traverseDir = (dir: string) => {
    if (!fs.existsSync(dir)) return;

    let items: string[];
    try {
      items = fs.readdirSync(dir);
    } catch (e) {
      console.warn('[getDiagnoseHistory] 无法读取目录:', dir, e);
      return;
    }

    for (const item of items) {
      const itemPath = path.join(dir, item);
      let stat: fs.Stats;
      try {
        stat = fs.statSync(itemPath);
      } catch (e) {
        console.warn('[getDiagnoseHistory] 跳过无法 stat 的项:', itemPath, e);
        continue;
      }

      if (stat.isDirectory()) {
        traverseDir(itemPath);
      } else if (item.endsWith('_timeline.json')) {
        // 检查是否匹配当前文档
        // 文件名格式: xxx_20260427_143052_timeline.json
        // 需要匹配 xxx_日期_时间
        const baseName = item.replace('_timeline.json', '');
        if (baseName.startsWith(docName + '_')) {
          try {
            const content = fs.readFileSync(itemPath, 'utf-8');
            const timeline: TimelineData = JSON.parse(content);
            const summary = timeline.summary;
            const outputs = timeline.outputs;
            if (!summary?.by_severity || !outputs) {
              console.warn('[getDiagnoseHistory] timeline 缺少 summary/outputs，跳过:', itemPath);
              continue;
            }

            const reportPath = outputs.report
              ? path.join(BASE_DIR, outputs.report)
              : '';
            const fixedDocPath = outputs.fixed_doc
              ? path.join(BASE_DIR, outputs.fixed_doc)
              : '';

            records.push({
              timestamp: (timeline.start_time || '').replace('T', ' ').split('.')[0],
              documentPath: documentRelativePath,
              documentName: path.basename(documentRelativePath),
              status: timeline.status,
              totalIssues: summary.total_issues ?? 0,
              highPriority: summary.by_severity.high ?? 0,
              mediumPriority: summary.by_severity.medium ?? 0,
              lowPriority: summary.by_severity.low ?? 0,
              reportPath,
              timelinePath: itemPath,
              fixedDocPath,
              durationSeconds: timeline.duration_seconds,
            });
          } catch (e) {
            console.error('Failed to parse timeline:', itemPath, e);
          }
        }
      }
    }
  };

  // 先在对应子目录下查找
  const targetDir = path.join(timelineDir, docDir);
  traverseDir(targetDir);

  // 如果没找到，遍历整个timeline目录
  if (records.length === 0) {
    traverseDir(timelineDir);
  }

  // 按时间倒序排列
  return records.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
};

// 读取timeline文件
export const readTimeline = (timelinePath: string): TimelineData | null => {
  try {
    const content = fs.readFileSync(timelinePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to read timeline:', timelinePath, e);
    return null;
  }
};

// 读取报告文件
export const readReport = (reportPath: string): string => {
  try {
    // 如果是相对路径（不以/开头），则转换为绝对路径
    let fullPath = reportPath;
    if (!reportPath.startsWith('/')) {
      fullPath = path.join(BASE_DIR, reportPath);
    }

    if (!fs.existsSync(fullPath)) {
      return '报告文件不存在';
    }
    return fs.readFileSync(fullPath, 'utf-8');
  } catch (e) {
    return '报告文件不存在';
  }
};

// 读取修复后的文档
export const readFixedDoc = (fixedDocPath: string): string => {
  try {
    // 如果是相对路径（不以/开头），则转换为绝对路径
    let fullPath = fixedDocPath;
    if (!fixedDocPath.startsWith('/')) {
      fullPath = path.join(BASE_DIR, fixedDocPath);
    }

    if (!fs.existsSync(fullPath)) {
      return '修复后的文档不存在';
    }
    return fs.readFileSync(fullPath, 'utf-8');
  } catch (e) {
    return '修复后的文档不存在';
  }
};

// 确保目录存在
export const ensureDir = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// 保存修复后的文档
export const writeFixedDoc = (fixedDocPath: string, content: string): void => {
  let fullPath = fixedDocPath;
  if (!fixedDocPath.startsWith('/')) {
    fullPath = path.join(BASE_DIR, fixedDocPath);
  }
  const dir = path.dirname(fullPath);
  ensureDir(dir);
  fs.writeFileSync(fullPath, content, 'utf-8');
};