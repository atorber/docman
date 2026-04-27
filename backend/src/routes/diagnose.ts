import { Router, Request, Response } from 'express';
import { getDiagnoseHistory, readTimeline, readReport, readFixedDoc } from '../services/fileService';

const router = Router();

// 获取文档的诊断历史列表
router.get('/history', (req: Request, res: Response) => {
  try {
    const { path: docPath } = req.query;
    if (!docPath) {
      return res.status(400).json({ success: false, error: '缺少文档路径参数' });
    }

    const history = getDiagnoseHistory(docPath as string);
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Failed to get diagnose history:', error);
    res.status(500).json({ success: false, error: '获取诊断历史失败' });
  }
});

// 获取单次诊断的timeline详情
router.get('/timeline', (req: Request, res: Response) => {
  try {
    const { path: timelinePath } = req.query;
    if (!timelinePath) {
      return res.status(400).json({ success: false, error: '缺少timeline路径参数' });
    }

    const timeline = readTimeline(timelinePath as string);
    if (!timeline) {
      return res.status(404).json({ success: false, error: 'Timeline文件不存在' });
    }

    res.json({ success: true, data: timeline });
  } catch (error) {
    console.error('Failed to read timeline:', error);
    res.status(500).json({ success: false, error: '读取Timeline失败' });
  }
});

// 获取诊断报告内容
router.get('/report', (req: Request, res: Response) => {
  try {
    const { path: reportPath } = req.query;
    if (!reportPath) {
      return res.status(400).json({ success: false, error: '缺少报告路径参数' });
    }

    const content = readReport(reportPath as string);
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to read report:', error);
    res.status(500).json({ success: false, error: '读取报告失败' });
  }
});

// 获取修复后的文档内容
router.get('/fixed-doc', (req: Request, res: Response) => {
  try {
    const { path: fixedDocPath } = req.query;
    if (!fixedDocPath) {
      return res.status(400).json({ success: false, error: '缺少文档路径参数' });
    }

    const content = readFixedDoc(fixedDocPath as string);
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to read fixed doc:', error);
    res.status(500).json({ success: false, error: '读取修复后文档失败' });
  }
});

export default router;