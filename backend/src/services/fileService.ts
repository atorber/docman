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
  const fullPath = path.join(getRawPath(), relativePath);
  const items = fs.readdirSync(fullPath);

  return items
    .filter(item => !item.startsWith('.'))
    .sort((a, b) => {
      const aIsDir = fs.statSync(path.join(fullPath, a)).isDirectory();
      const bIsDir = fs.statSync(path.join(fullPath, b)).isDirectory();
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    })
    .map(item => {
      const itemPath = path.join(fullPath, item);
      const itemRelativePath = path.join(relativePath, item);
      const isDirectory = fs.statSync(itemPath).isDirectory();

      const node: DocNode = {
        name: item,
        path: itemPath,
        relativePath: itemRelativePath,
        type: isDirectory ? 'directory' : 'file',
      };

      if (isDirectory) {
        node.children = buildDocTree(itemRelativePath);
      } else {
        // 检查是否有诊断历史
        const history = getDiagnoseHistory(itemRelativePath);
        node.diagnoseStatus = history.length > 0 ? 'has-history' : 'none';
        if (history.length > 0) {
          node.lastDiagnoseTime = history[0].timestamp;
        }
      }

      return node;
    });
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

    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

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

            records.push({
              timestamp: timeline.start_time.replace('T', ' ').split('.')[0],
              documentPath: documentRelativePath,
              documentName: path.basename(documentRelativePath),
              status: timeline.status,
              totalIssues: timeline.summary.total_issues,
              highPriority: timeline.summary.by_severity.high,
              mediumPriority: timeline.summary.by_severity.medium,
              lowPriority: timeline.summary.by_severity.low,
              reportPath: timeline.outputs.report,
              timelinePath: itemPath,
              fixedDocPath: timeline.outputs.fixed_doc,
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
    return fs.readFileSync(reportPath, 'utf-8');
  } catch (e) {
    return '报告文件不存在';
  }
};

// 读取修复后的文档
export const readFixedDoc = (fixedDocPath: string): string => {
  try {
    return fs.readFileSync(fixedDocPath, 'utf-8');
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