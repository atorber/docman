import { ApiResponse, DocNode, DiagnoseRecord, TimelineData, DiagnoseDimension, GeneratePromptRequest, GeneratePromptResponse } from '../types';

const BASE_URL = '/api';

// 获取文档目录树
export const getDocTree = async (): Promise<DocNode[]> => {
  const res = await fetch(`${BASE_URL}/documents/tree`);
  const data: ApiResponse<DocNode[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取文档内容
export const getDocumentContent = async (path: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/documents/content?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<string> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取诊断历史
export const getDiagnoseHistory = async (path: string): Promise<DiagnoseRecord[]> => {
  const res = await fetch(`${BASE_URL}/diagnoses/history?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<DiagnoseRecord[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取Timeline详情
export const getTimeline = async (path: string): Promise<TimelineData> => {
  const res = await fetch(`${BASE_URL}/diagnoses/timeline?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<TimelineData> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取诊断报告
export const getReport = async (path: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/diagnoses/report?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<string> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取修复后的文档
export const getFixedDoc = async (path: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/diagnoses/fixed-doc?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<string> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 生成诊断Prompt
export const generatePrompt = async (request: GeneratePromptRequest): Promise<GeneratePromptResponse> => {
  const res = await fetch(`${BASE_URL}/prompt/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const data: ApiResponse<GeneratePromptResponse> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取诊断维度列表
export const getDimensions = async (): Promise<DiagnoseDimension[]> => {
  const res = await fetch(`${BASE_URL}/prompt/dimensions`);
  const data: ApiResponse<DiagnoseDimension[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};