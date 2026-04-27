import { Router, Request, Response } from 'express';
import { buildDocTree, readDocument } from '../services/fileService';

const router = Router();

// 获取文档目录树
router.get('/tree', (req: Request, res: Response) => {
  try {
    const tree = buildDocTree();
    res.json({ success: true, data: tree });
  } catch (error) {
    console.error('Failed to build doc tree:', error);
    res.status(500).json({ success: false, error: '获取文档目录树失败' });
  }
});

// 获取文档内容
router.get('/content', (req: Request, res: Response) => {
  try {
    const { path: docPath } = req.query;
    if (!docPath) {
      return res.status(400).json({ success: false, error: '缺少文档路径参数' });
    }

    const content = readDocument(docPath as string);
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to read document:', error);
    res.status(500).json({ success: false, error: '读取文档失败' });
  }
});

export default router;