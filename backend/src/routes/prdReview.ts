import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { generatePrdPrompt, getPrdDimensions, getPerspectives } from '../services/prdPromptService';
import { PrdDocNode, PrdReviewRecord, PrdTimelineData } from '../types';

const router = Router();

const BASE_DIR = path.join(__dirname, '../../../..');

// 获取prd目录的根路径
const getPrdPath = (): string => {
  return path.join(BASE_DIR, 'prd');
};

// 获取PRD评审报告目录
const getPrdReportPath = (): string => path.join(BASE_DIR, 'report/prd');
const getPrdTimelinePath = (): string => path.join(BASE_DIR, 'timeline/prd');

// 构建PRD文档目录树
const buildPrdDocTree = (relativePath: string = ''): PrdDocNode[] => {
  const prdPath = getPrdPath();
  const fullPath = path.join(prdPath, relativePath);

  if (!fs.existsSync(prdPath)) {
    return [];
  }

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

      const node: PrdDocNode = {
        name: item,
        path: itemPath,
        relativePath: itemRelativePath,
        type: isDirectory ? 'directory' : 'file',
      };

      if (isDirectory) {
        node.children = buildPrdDocTree(itemRelativePath);
      } else {
        // 检查是否有评审历史
        const history = getPrdReviewHistory(itemRelativePath);
        node.reviewStatus = history.length > 0 ? 'has-history' : 'none';
        if (history.length > 0) {
          node.lastReviewTime = history[0].timestamp;
        }
      }

      return node;
    });
};

// 获取指定PRD文档的评审历史
const getPrdReviewHistory = (documentRelativePath: string): PrdReviewRecord[] => {
  const timelineDir = getPrdTimelinePath();

  const docName = path.basename(documentRelativePath, '.md');
  const docDir = path.dirname(documentRelativePath);

  if (!fs.existsSync(timelineDir)) {
    return [];
  }

  const records: PrdReviewRecord[] = [];

  const traverseDir = (dir: string) => {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        traverseDir(itemPath);
      } else if (item.endsWith('_timeline.json')) {
        const baseName = item.replace('_timeline.json', '');
        if (baseName.startsWith(docName + '_')) {
          try {
            const content = fs.readFileSync(itemPath, 'utf-8');
            const timeline: PrdTimelineData = JSON.parse(content);

            const reportPath = timeline.outputs.report
              ? path.join(BASE_DIR, timeline.outputs.report)
              : '';

            records.push({
              timestamp: timeline.start_time.replace('T', ' ').split('.')[0],
              documentPath: documentRelativePath,
              documentName: path.basename(documentRelativePath),
              status: timeline.status,
              totalIssues: timeline.summary.total_issues,
              highPriority: timeline.summary.by_severity.high,
              mediumPriority: timeline.summary.by_severity.medium,
              lowPriority: timeline.summary.by_severity.low,
              reportPath,
              timelinePath: itemPath,
              conclusion: timeline.summary.conclusion,
              durationSeconds: timeline.duration_seconds,
            });
          } catch (e) {
            console.error('Failed to parse PRD timeline:', itemPath, e);
          }
        }
      }
    }
  };

  // 先在对应子目录下查找
  const targetDir = path.join(timelineDir, docDir);
  traverseDir(targetDir);

  // 如果没找到，遍历整个timeline/prd目录
  if (records.length === 0) {
    traverseDir(timelineDir);
  }

  // 按时间倒序排列
  return records.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
};

// 获取PRD文档目录树
router.get('/tree', (req: Request, res: Response) => {
  try {
    const tree = buildPrdDocTree();
    res.json({ success: true, data: tree });
  } catch (error) {
    console.error('Failed to build PRD doc tree:', error);
    res.status(500).json({ success: false, error: '获取PRD文档目录树失败' });
  }
});

// 获取PRD文档内容
router.get('/content', (req: Request, res: Response) => {
  try {
    const { path: docPath } = req.query;
    if (!docPath) {
      return res.status(400).json({ success: false, error: '缺少文档路径参数' });
    }

    const fullPath = path.join(getPrdPath(), docPath as string);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, error: '文档不存在' });
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to read PRD document:', error);
    res.status(500).json({ success: false, error: '读取PRD文档失败' });
  }
});

// 获取PRD评审历史
router.get('/history', (req: Request, res: Response) => {
  try {
    const { path: docPath } = req.query;
    if (!docPath) {
      return res.status(400).json({ success: false, error: '缺少文档路径参数' });
    }

    const history = getPrdReviewHistory(docPath as string);
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Failed to get PRD review history:', error);
    res.status(500).json({ success: false, error: '获取评审历史失败' });
  }
});

// 获取评审视角列表
router.get('/perspectives', (req: Request, res: Response) => {
  try {
    const perspectives = getPerspectives();
    res.json({ success: true, data: perspectives });
  } catch (error) {
    console.error('Failed to get perspectives:', error);
    res.status(500).json({ success: false, error: '获取评审视角失败' });
  }
});

// 获取评审维度列表
router.get('/dimensions', (req: Request, res: Response) => {
  try {
    const { perspective } = req.query;
    let dimensions;

    if (perspective) {
      const { getDimensionsByPerspective } = require('../services/prdPromptService');
      dimensions = getDimensionsByPerspective(perspective as string);
    } else {
      dimensions = getPrdDimensions();
    }

    res.json({ success: true, data: dimensions });
  } catch (error) {
    console.error('Failed to get dimensions:', error);
    res.status(500).json({ success: false, error: '获取评审维度失败' });
  }
});

// 生成评审Prompt
router.post('/prompt', (req: Request, res: Response) => {
  try {
    const { documentPath, perspectives, focusDimensions, projectBackground, techStack, customRequirements } = req.body;

    if (!documentPath) {
      return res.status(400).json({ success: false, error: '缺少文档路径参数' });
    }

    const result = generatePrdPrompt({
      documentPath,
      perspectives,
      focusDimensions,
      projectBackground,
      techStack,
      customRequirements,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to generate PRD prompt:', error);
    res.status(500).json({ success: false, error: '生成评审Prompt失败' });
  }
});

// 读取评审报告
router.get('/report', (req: Request, res: Response) => {
  try {
    const { path: reportPath } = req.query;
    if (!reportPath) {
      return res.status(400).json({ success: false, error: '缺少报告路径参数' });
    }

    let fullPath = reportPath as string;
    if (!reportPath.toString().startsWith('/')) {
      fullPath = path.join(BASE_DIR, reportPath as string);
    }

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, error: '报告文件不存在' });
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to read report:', error);
    res.status(500).json({ success: false, error: '读取报告失败' });
  }
});

// 读取Timeline
router.get('/timeline', (req: Request, res: Response) => {
  try {
    const { path: timelinePath } = req.query;
    if (!timelinePath) {
      return res.status(400).json({ success: false, error: '缺少Timeline路径参数' });
    }

    let fullPath = timelinePath as string;
    if (!timelinePath.toString().startsWith('/')) {
      fullPath = path.join(BASE_DIR, timelinePath as string);
    }

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, error: 'Timeline文件不存在' });
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const data = JSON.parse(content);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Failed to read timeline:', error);
    res.status(500).json({ success: false, error: '读取Timeline失败' });
  }
});

export default router;