import { Router, Request, Response } from 'express';
import { generatePrompt, getDimensions, generateDocPrompt, getDocTypes, getTargetAudiences, generatePrdGenPrompt, getRequirementTypes } from '../services/promptService';
import { GeneratePromptRequest, GenerateDocPromptRequest, GeneratePrdGenPromptRequest } from '../types';

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

// 生成帮助文档生成prompt
router.post('/generate-doc', (req: Request, res: Response) => {
  try {
    const request: GenerateDocPromptRequest = req.body;

    if (!request.prdPath) {
      return res.status(400).json({ success: false, error: '缺少PRD文档路径' });
    }

    if (!request.consoleUrl) {
      return res.status(400).json({ success: false, error: '缺少控制台URL' });
    }

    const result = generateDocPrompt(request);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to generate doc prompt:', error);
    res.status(500).json({ success: false, error: '生成帮助文档Prompt失败' });
  }
});

// 获取文档类型选项
router.get('/doc-types', (req: Request, res: Response) => {
  try {
    const docTypes = getDocTypes();
    res.json({ success: true, data: docTypes });
  } catch (error) {
    console.error('Failed to get doc types:', error);
    res.status(500).json({ success: false, error: '获取文档类型失败' });
  }
});

// 获取目标受众选项
router.get('/target-audiences', (req: Request, res: Response) => {
  try {
    const audiences = getTargetAudiences();
    res.json({ success: true, data: audiences });
  } catch (error) {
    console.error('Failed to get target audiences:', error);
    res.status(500).json({ success: false, error: '获取目标受众失败' });
  }
});

// 生成PRD生成prompt
router.post('/generate-prd', (req: Request, res: Response) => {
  try {
    const request: GeneratePrdGenPromptRequest = req.body;

    if (!request.type) {
      return res.status(400).json({ success: false, error: '缺少需求类型' });
    }

    if (!request.title) {
      return res.status(400).json({ success: false, error: '缺少需求标题' });
    }

    if (!request.description) {
      return res.status(400).json({ success: false, error: '缺少需求描述' });
    }

    const result = generatePrdGenPrompt(request);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to generate PRD prompt:', error);
    res.status(500).json({ success: false, error: '生成PRD Prompt失败' });
  }
});

// 获取需求类型选项
router.get('/requirement-types', (req: Request, res: Response) => {
  try {
    const types = getRequirementTypes();
    res.json({ success: true, data: types });
  } catch (error) {
    console.error('Failed to get requirement types:', error);
    res.status(500).json({ success: false, error: '获取需求类型失败' });
  }
});

export default router;