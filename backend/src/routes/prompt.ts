import { Router, Request, Response } from 'express';
import { generatePrompt, getDimensions } from '../services/promptService';
import { GeneratePromptRequest } from '../types';

const router = Router();

// 生成诊断prompt
router.post('/generate', (req: Request, res: Response) => {
  try {
    const request: GeneratePromptRequest = req.body;

    if (!request.documentPath) {
      return res.status(400).json({ success: false, error: '缺少文档路径' });
    }

    const result = generatePrompt(request);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to generate prompt:', error);
    res.status(500).json({ success: false, error: '生成Prompt失败' });
  }
});

// 获取诊断维度列表
router.get('/dimensions', (req: Request, res: Response) => {
  try {
    const dimensions = getDimensions();
    res.json({ success: true, data: dimensions });
  } catch (error) {
    console.error('Failed to get dimensions:', error);
    res.status(500).json({ success: false, error: '获取诊断维度失败' });
  }
});

export default router;