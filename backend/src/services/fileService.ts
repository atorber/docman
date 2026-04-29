import * as fs from 'fs';
import * as path from 'path';
import { DocNode, DiagnoseRecord, TimelineData } from '../types';

const BASE_DIR = path.join(__dirname, '../../..');

// 获取raw目录的根路径
export const getRawPath = (): string => {
  return path.join(BASE_DIR, 'raw');
};

// 获取财报目录根路径
export const getFinanceReportsPath = (): string => {
  return path.join(BASE_DIR, 'finance_reports');
};

// 获取研报目录根路径
export const getResearchReportsPath = (): string => {
  return path.join(BASE_DIR, 'research_reports');
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

// 读取财报文档内容（finance_reports 下相对路径）
export const readFinanceDocument = (relativePath: string): string => {
  const fullPath = path.join(getFinanceReportsPath(), relativePath);
  return fs.readFileSync(fullPath, 'utf-8');
};
// 按文件后缀解析文档内容，避免二进制文件按 utf-8 读取导致乱码
const parseDocumentByExt = async (fullPath: string): Promise<string> => {
  const ext = path.extname(fullPath).toLowerCase();
  const textExts = new Set(['.md', '.markdown', '.txt', '.json', '.html', '.htm', '.csv', '.yaml', '.yml']);

  if (textExts.has(ext)) {
    return fs.readFileSync(fullPath, 'utf-8');
  }

  if (ext === '.pdf') {
    const pdfModule = await import('pdf-parse');
    const pdfParse = (pdfModule as any).default || (pdfModule as any);
    const buffer = fs.readFileSync(fullPath);
    const parsed = await pdfParse(buffer);
    return parsed?.text || '';
  }

  // 未知后缀默认按文本读取；若失败则给出可读提示，避免直接显示乱码
  try {
    return fs.readFileSync(fullPath, 'utf-8');
  } catch {
    return `暂不支持预览该文件类型：${ext || 'unknown'}`;
  }
};

export const readDocumentParsed = async (relativePath: string): Promise<string> => {
  const fullPath = path.join(getRawPath(), relativePath);
  return parseDocumentByExt(fullPath);
};

export const readFinanceDocumentParsed = async (relativePath: string): Promise<string> => {
  const fullPath = path.join(getFinanceReportsPath(), relativePath);
  return parseDocumentByExt(fullPath);
};

export const readResearchDocumentParsed = async (relativePath: string): Promise<string> => {
  const fullPath = path.join(getResearchReportsPath(), relativePath);
  return parseDocumentByExt(fullPath);
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

// 构建 finance_reports 目录树（不附带诊断历史）
export const buildFinanceDocTree = (relativePath: string = ''): DocNode[] => {
  const financeRoot = getFinanceReportsPath();
  const fullPath = path.join(financeRoot, relativePath);

  if (!fs.existsSync(financeRoot)) {
    return [];
  }

  let items: string[];
  try {
    items = fs.readdirSync(fullPath);
  } catch (e) {
    console.error('[buildFinanceDocTree] 无法读取目录:', fullPath, e);
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
        console.warn('[buildFinanceDocTree] 跳过无法访问的项:', itemPath, e);
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
    if (isDirectory) {
      node.children = buildFinanceDocTree(itemRelativePath);
    }
    nodes.push(node);
  }

  return nodes;
};

// 构建 research_reports 目录树（不附带诊断历史）
export const buildResearchDocTree = (relativePath: string = ''): DocNode[] => {
  const researchRoot = getResearchReportsPath();
  const fullPath = path.join(researchRoot, relativePath);

  if (!fs.existsSync(researchRoot)) {
    return [];
  }

  let items: string[];
  try {
    items = fs.readdirSync(fullPath);
  } catch (e) {
    console.error('[buildResearchDocTree] 无法读取目录:', fullPath, e);
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
        console.warn('[buildResearchDocTree] 跳过无法访问的项:', itemPath, e);
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
    if (isDirectory) {
      node.children = buildResearchDocTree(itemRelativePath);
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

// 获取指定财报文档的分析历史（timeline/finance）
export const getFinanceHistory = (documentRelativePath: string): DiagnoseRecord[] => {
  const financeTimelineDir = path.join(getTimelinePath(), 'finance');
  const fileName = path.basename(documentRelativePath);
  const fileNameNoExt = path.basename(documentRelativePath, path.extname(documentRelativePath));
  const expectedDocPath = `finance_reports/${documentRelativePath}`.replace(/\\/g, '/');
  const records: DiagnoseRecord[] = [];

  const walkTimeline = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        walkTimeline(itemPath);
        continue;
      }
      if (!item.endsWith('_timeline.json')) {
        continue;
      }

      try {
        const content = fs.readFileSync(itemPath, 'utf-8');
        const timeline: TimelineData = JSON.parse(content);
        const timelineDocPath = (timeline.document?.path || '').replace(/\\/g, '/');
        const summary = timeline.summary;
        const outputs = timeline.outputs;
        if (!summary?.by_severity || !outputs) {
          continue;
        }

        const matchedByDocPath =
          timelineDocPath === expectedDocPath ||
          timelineDocPath.endsWith(`/${documentRelativePath.replace(/\\/g, '/')}`) ||
          timelineDocPath.endsWith(`/${fileName}`) ||
          timelineDocPath === documentRelativePath.replace(/\\/g, '/');
        const matchedByTimelineName = item.startsWith(`${fileNameNoExt}_`);
        if (!matchedByDocPath && !matchedByTimelineName) {
          continue;
        }

        const reportPath = outputs.report ? path.join(BASE_DIR, outputs.report) : '';
        const fixedDocPath = outputs.fixed_doc ? path.join(BASE_DIR, outputs.fixed_doc) : '';

        records.push({
          timestamp: (timeline.start_time || '').replace('T', ' ').split('.')[0],
          documentPath: documentRelativePath,
          documentName: fileName,
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
        console.error('Failed to parse finance timeline:', itemPath, e);
      }
    }
  };

  const collectFromReports = (): DiagnoseRecord[] => {
    const reportRoot = path.join(getReportPath(), 'finance', 'cn-a-share', 'risk-opportunity');
    if (!fs.existsSync(reportRoot)) return [];

    const fallbackRecords: DiagnoseRecord[] = [];
    const walkReport = (dir: string) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          walkReport(itemPath);
          continue;
        }
        if (!item.endsWith('_report.md')) continue;

        try {
          const content = fs.readFileSync(itemPath, 'utf-8');
          const normalizedContent = content.replace(/\\/g, '/');
          const targetA = `finance_reports/${documentRelativePath.replace(/\\/g, '/')}`;
          const targetB = `\`${targetA}\``;
          if (!normalizedContent.includes(targetA) && !normalizedContent.includes(targetB)) {
            continue;
          }

          const timestampMatch = item.match(/_(\d{8}_\d{6})_report\.md$/);
          const rawTs = timestampMatch?.[1] || '';
          const timestamp = rawTs
            ? `${rawTs.slice(0, 4)}-${rawTs.slice(4, 6)}-${rawTs.slice(6, 8)} ${rawTs.slice(9, 11)}:${rawTs.slice(11, 13)}:${rawTs.slice(13, 15)}`
            : '';

          fallbackRecords.push({
            timestamp,
            documentPath: documentRelativePath,
            documentName: fileName,
            status: 'completed',
            totalIssues: 0,
            highPriority: 0,
            mediumPriority: 0,
            lowPriority: 0,
            reportPath: itemPath,
            timelinePath: '',
            fixedDocPath: '',
          });
        } catch (e) {
          console.error('Failed to parse finance report for history fallback:', itemPath, e);
        }
      }
    };

    walkReport(reportRoot);
    return fallbackRecords;
  };

  if (fs.existsSync(financeTimelineDir)) {
    walkTimeline(financeTimelineDir);
  }

  if (records.length === 0) {
    records.push(...collectFromReports());
  }

  return records.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
};

// 获取指定研报文档的分析历史（timeline/research）
export const getResearchHistory = (documentRelativePath: string): DiagnoseRecord[] => {
  const researchTimelineDir = path.join(getTimelinePath(), 'research');
  const fileName = path.basename(documentRelativePath);
  const fileNameNoExt = path.basename(documentRelativePath, path.extname(documentRelativePath));
  const expectedDocPath = `research_reports/${documentRelativePath}`.replace(/\\/g, '/');
  const records: DiagnoseRecord[] = [];

  const walkTimeline = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        walkTimeline(itemPath);
        continue;
      }
      if (!item.endsWith('_timeline.json')) {
        continue;
      }

      try {
        const content = fs.readFileSync(itemPath, 'utf-8');
        const timeline: TimelineData = JSON.parse(content);
        const timelineDocPath = (timeline.document?.path || '').replace(/\\/g, '/');
        const summary = timeline.summary;
        const outputs = timeline.outputs;
        if (!summary?.by_severity || !outputs) {
          continue;
        }

        const matchedByDocPath =
          timelineDocPath === expectedDocPath ||
          timelineDocPath.endsWith(`/${documentRelativePath.replace(/\\/g, '/')}`) ||
          timelineDocPath.endsWith(`/${fileName}`) ||
          timelineDocPath === documentRelativePath.replace(/\\/g, '/');
        const matchedByTimelineName = item.startsWith(`${fileNameNoExt}_`);
        if (!matchedByDocPath && !matchedByTimelineName) {
          continue;
        }

        const reportPath = outputs.report ? path.join(BASE_DIR, outputs.report) : '';
        const fixedDocPath = outputs.fixed_doc ? path.join(BASE_DIR, outputs.fixed_doc) : '';

        records.push({
          timestamp: (timeline.start_time || '').replace('T', ' ').split('.')[0],
          documentPath: documentRelativePath,
          documentName: fileName,
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
        console.error('Failed to parse research timeline:', itemPath, e);
      }
    }
  };

  const collectFromReports = (): DiagnoseRecord[] => {
    const reportRoot = path.join(getReportPath(), 'research', 'cn-a-share');
    if (!fs.existsSync(reportRoot)) return [];

    const fallbackRecords: DiagnoseRecord[] = [];
    const walkReport = (dir: string) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          walkReport(itemPath);
          continue;
        }
        if (!item.endsWith('_report.md')) continue;

        try {
          const content = fs.readFileSync(itemPath, 'utf-8');
          const normalizedContent = content.replace(/\\/g, '/');
          const targetA = `research_reports/${documentRelativePath.replace(/\\/g, '/')}`;
          const targetB = `\`${targetA}\``;
          if (!normalizedContent.includes(targetA) && !normalizedContent.includes(targetB)) {
            continue;
          }

          const timestampMatch = item.match(/_(\d{8}_\d{6})_report\.md$/);
          const rawTs = timestampMatch?.[1] || '';
          const timestamp = rawTs
            ? `${rawTs.slice(0, 4)}-${rawTs.slice(4, 6)}-${rawTs.slice(6, 8)} ${rawTs.slice(9, 11)}:${rawTs.slice(11, 13)}:${rawTs.slice(13, 15)}`
            : '';

          fallbackRecords.push({
            timestamp,
            documentPath: documentRelativePath,
            documentName: fileName,
            status: 'completed',
            totalIssues: 0,
            highPriority: 0,
            mediumPriority: 0,
            lowPriority: 0,
            reportPath: itemPath,
            timelinePath: '',
            fixedDocPath: '',
          });
        } catch (e) {
          console.error('Failed to parse research report for history fallback:', itemPath, e);
        }
      }
    };

    walkReport(reportRoot);
    return fallbackRecords;
  };

  if (fs.existsSync(researchTimelineDir)) {
    walkTimeline(researchTimelineDir);
  }

  if (records.length === 0) {
    records.push(...collectFromReports());
  }

  return records.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
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