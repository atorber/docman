import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { buildDocTree, buildFinanceDocTree, buildResearchDocTree, readDocumentParsed, readFinanceDocumentParsed, readResearchDocumentParsed, getFinanceReportsPath, getResearchReportsPath } from '../services/fileService';

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

// 获取财报目录树（finance_reports）
router.get('/finance-tree', (req: Request, res: Response) => {
  try {
    const tree = buildFinanceDocTree();
    res.json({ success: true, data: tree });
  } catch (error) {
    console.error('Failed to build finance doc tree:', error);
    res.status(500).json({ success: false, error: '获取财报目录树失败' });
  }
});

// 获取研报目录树（research_reports）
router.get('/research-tree', (req: Request, res: Response) => {
  try {
    const tree = buildResearchDocTree();
    res.json({ success: true, data: tree });
  } catch (error) {
    console.error('Failed to build research doc tree:', error);
    res.status(500).json({ success: false, error: '获取研报目录树失败' });
  }
});

// 获取文档内容
router.get('/content', async (req: Request, res: Response) => {
  try {
    const { path: docPath } = req.query;
    if (!docPath) {
      return res.status(400).json({ success: false, error: '缺少文档路径参数' });
    }

    const content = await readDocumentParsed(docPath as string);
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to read document:', error);
    res.status(500).json({ success: false, error: '读取文档失败' });
  }
});

// 获取财报文档内容（finance_reports 下相对路径）
router.get('/finance-content', async (req: Request, res: Response) => {
  try {
    const { path: docPath } = req.query;
    if (!docPath) {
      return res.status(400).json({ success: false, error: '缺少财报文档路径参数' });
    }

    const content = await readFinanceDocumentParsed(docPath as string);
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to read finance document:', error);
    res.status(500).json({ success: false, error: '读取财报文档失败' });
  }
});

// 获取研报文档内容（research_reports 下相对路径）
router.get('/research-content', async (req: Request, res: Response) => {
  try {
    const { path: docPath } = req.query;
    if (!docPath) {
      return res.status(400).json({ success: false, error: '缺少研报文档路径参数' });
    }

    const content = await readResearchDocumentParsed(docPath as string);
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to read research document:', error);
    res.status(500).json({ success: false, error: '读取研报文档失败' });
  }
});

// 获取财报原始文件（用于前端按原格式预览，如 PDF）
router.get('/finance-file', (req: Request, res: Response) => {
  try {
    const { path: docPath } = req.query;
    if (!docPath) {
      return res.status(400).json({ success: false, error: '缺少财报文档路径参数' });
    }

    const financeRoot = getFinanceReportsPath();
    const normalizedPath = String(docPath).replace(/\\/g, '/');
    const resolvedPath = path.resolve(financeRoot, normalizedPath);
    const rootWithSep = financeRoot.endsWith(path.sep) ? financeRoot : `${financeRoot}${path.sep}`;
    if (!(resolvedPath === financeRoot || resolvedPath.startsWith(rootWithSep))) {
      return res.status(400).json({ success: false, error: '非法文件路径' });
    }
    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({ success: false, error: '文件不存在' });
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    if (ext === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
    res.sendFile(resolvedPath);
  } catch (error) {
    console.error('Failed to read finance file:', error);
    res.status(500).json({ success: false, error: '读取财报文件失败' });
  }
});

// 获取研报原始文件（用于前端按原格式预览，如 PDF）
router.get('/research-file', (req: Request, res: Response) => {
  try {
    const { path: docPath } = req.query;
    if (!docPath) {
      return res.status(400).json({ success: false, error: '缺少研报文档路径参数' });
    }

    const researchRoot = getResearchReportsPath();
    const normalizedPath = String(docPath).replace(/\\/g, '/');
    const resolvedPath = path.resolve(researchRoot, normalizedPath);
    const rootWithSep = researchRoot.endsWith(path.sep) ? researchRoot : `${researchRoot}${path.sep}`;
    if (!(resolvedPath === researchRoot || resolvedPath.startsWith(rootWithSep))) {
      return res.status(400).json({ success: false, error: '非法文件路径' });
    }
    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({ success: false, error: '文件不存在' });
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    if (ext === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
    res.sendFile(resolvedPath);
  } catch (error) {
    console.error('Failed to read research file:', error);
    res.status(500).json({ success: false, error: '读取研报文件失败' });
  }
});

export default router;