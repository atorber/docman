import { Router, Request, Response } from 'express';
import { getFinanceHistory, readTimeline, readReport } from '../services/fileService';

const router = Router();

// 获取财报分析历史
router.get('/history', (req: Request, res: Response) => {
  try {
    const { path: docPath } = req.query;
    if (!docPath) {
      return res.status(400).json({ success: false, error: '缺少财报文档路径参数' });
    }

    const decodedPath = decodeURIComponent(docPath as string);
    const history = getFinanceHistory(decodedPath);
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Failed to get finance history:', error);
    res.status(500).json({ success: false, error: '获取财报分析历史失败' });
  }
});

// 获取财报分析 timeline
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
    console.error('Failed to read finance timeline:', error);
    res.status(500).json({ success: false, error: '读取财报Timeline失败' });
  }
});

// 获取财报分析报告
router.get('/report', (req: Request, res: Response) => {
  try {
    const { path: reportPath } = req.query;
    if (!reportPath) {
      return res.status(400).json({ success: false, error: '缺少报告路径参数' });
    }

    const content = readReport(reportPath as string);
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to read finance report:', error);
    res.status(500).json({ success: false, error: '读取财报分析报告失败' });
  }
});

export default router;
