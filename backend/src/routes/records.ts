import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { RecentRecordItem } from '../types';

const router = Router();
const BASE_DIR = path.join(__dirname, '../../..');
const TIMELINE_DIR = path.join(BASE_DIR, 'timeline');

type TimelineLike = {
  start_time?: string;
  status?: string;
  document?: { name?: string; path?: string };
  prd?: { name?: string; path?: string };
  requirement?: { title?: string };
  perspectives?: unknown[];
  dimensions?: unknown[];
  outputs?: {
    prd_document?: string;
  };
};

const toAbsPath = (filePath: string): string =>
  path.isAbsolute(filePath) ? filePath : path.join(BASE_DIR, filePath);

const walkTimelineFiles = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return [];

  const result: string[] = [];
  const walk = (current: string) => {
    const items = fs.readdirSync(current);
    for (const item of items) {
      const full = path.join(current, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (item.endsWith('_timeline.json')) {
        result.push(full);
      }
    }
  };

  walk(dir);
  return result;
};

const inferSource = (data: TimelineLike): RecentRecordItem['source'] => {
  if (Array.isArray(data.perspectives)) return 'prdreview';
  if (data.prd && data.requirement) return 'prdgen';
  if (data.prd) return 'docgen';
  return 'diagnose';
};

const sourceLabelMap: Record<RecentRecordItem['source'], RecentRecordItem['sourceLabel']> = {
  diagnose: '帮助文档诊断',
  docgen: '帮助文档生成',
  prdgen: 'PRD生成',
  prdreview: 'PRD评审',
};

const buildRecentRecord = (timelinePath: string, data: TimelineLike): RecentRecordItem => {
  const source = inferSource(data);
  const sourceLabel = sourceLabelMap[source];

  if (source === 'prdreview') {
    return {
      id: timelinePath,
      source,
      sourceLabel,
      name: data.document?.name || path.basename(timelinePath),
      path: data.document?.path || '-',
      timestamp: data.start_time || '',
      status: data.status,
      docPath: data.document?.path,
      timelinePath: toAbsPath(timelinePath),
    };
  }

  if (source === 'docgen') {
    return {
      id: timelinePath,
      source,
      sourceLabel,
      name: data.prd?.name || path.basename(timelinePath),
      path: data.outputs?.prd_document || data.prd?.path || '-',
      timestamp: data.start_time || '',
      status: data.status,
      docPath: data.prd?.path,
      timelinePath: toAbsPath(timelinePath),
    };
  }

  if (source === 'prdgen') {
    return {
      id: timelinePath,
      source,
      sourceLabel,
      name: data.requirement?.title || path.basename(timelinePath),
      path: data.outputs?.prd_document || '-',
      timestamp: data.start_time || '',
      status: data.status,
      docPath: data.outputs?.prd_document,
      timelinePath: toAbsPath(timelinePath),
    };
  }

  return {
    id: timelinePath,
    source,
    sourceLabel,
    name: data.document?.name || path.basename(timelinePath),
    path: data.document?.path || '-',
    timestamp: data.start_time || '',
    status: data.status,
    docPath: data.document?.path,
    timelinePath: toAbsPath(timelinePath),
  };
};

router.get('/recent', (req: Request, res: Response) => {
  try {
    const files = walkTimelineFiles(TIMELINE_DIR);
    const records: RecentRecordItem[] = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const data = JSON.parse(content) as TimelineLike;
        records.push(buildRecentRecord(file, data));
      } catch (e) {
        console.warn('Skip invalid timeline file:', file);
      }
    }

    records.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
    res.json({ success: true, data: records });
  } catch (error) {
    console.error('Failed to load recent records:', error);
    res.status(500).json({ success: false, error: '获取最近记录失败' });
  }
});

export default router;
