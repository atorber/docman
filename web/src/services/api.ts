import { ApiResponse, DocNode, DiagnoseRecord, TimelineData, DiagnoseDimension, GeneratePromptRequest, GeneratePromptResponse, PrdDocNode, PrdReviewRecord, PrdTimelineData, PrdDimension, PrdPerspective, GeneratePrdPromptRequest, GenerateDocPromptRequest, GenerateDocPromptResponse, DocTypeOption, TargetAudienceOption, GeneratePrdGenPromptRequest, GeneratePrdGenPromptResponse, GenerateFinancePromptRequest, GenerateResearchPromptRequest, RequirementTypeOption, RecentRecordItem } from '../types';

const BASE_URL = '/api';

// 获取文档目录树
export const getDocTree = async (): Promise<DocNode[]> => {
  const res = await fetch(`${BASE_URL}/documents/tree`);
  const data: ApiResponse<DocNode[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取财报目录树（finance_reports）
export const getFinanceDocTree = async (): Promise<DocNode[]> => {
  const res = await fetch(`${BASE_URL}/documents/finance-tree`);
  const data: ApiResponse<DocNode[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取研报目录树（research_reports）
export const getResearchDocTree = async (): Promise<DocNode[]> => {
  const res = await fetch(`${BASE_URL}/documents/research-tree`);
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

// 获取财报文档内容（finance_reports）
export const getFinanceDocumentContent = async (path: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/documents/finance-content?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<string> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取研报文档内容（research_reports）
export const getResearchDocumentContent = async (path: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/documents/research-content?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<string> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取财报原始文件预览地址（如 PDF）
export const getFinanceDocumentFileUrl = (path: string): string =>
  `${BASE_URL}/documents/finance-file?path=${encodeURIComponent(path)}`;

// 获取研报原始文件预览地址（如 PDF）
export const getResearchDocumentFileUrl = (path: string): string =>
  `${BASE_URL}/documents/research-file?path=${encodeURIComponent(path)}`;

// 获取诊断历史
export const getDiagnoseHistory = async (path: string): Promise<DiagnoseRecord[]> => {
  const res = await fetch(`${BASE_URL}/diagnoses/history?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<DiagnoseRecord[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取财报分析历史
export const getFinanceHistory = async (path: string): Promise<DiagnoseRecord[]> => {
  const res = await fetch(`${BASE_URL}/finance/history?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<DiagnoseRecord[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取研报分析历史
export const getResearchHistory = async (path: string): Promise<DiagnoseRecord[]> => {
  const res = await fetch(`${BASE_URL}/research/history?path=${encodeURIComponent(path)}`);
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

// 获取财报分析 Timeline
export const getFinanceTimeline = async (path: string): Promise<TimelineData> => {
  const res = await fetch(`${BASE_URL}/finance/timeline?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<TimelineData> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取研报分析 Timeline
export const getResearchTimeline = async (path: string): Promise<TimelineData> => {
  const res = await fetch(`${BASE_URL}/research/timeline?path=${encodeURIComponent(path)}`);
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

// 获取财报分析报告
export const getFinanceReport = async (path: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/finance/report?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<string> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取研报分析报告
export const getResearchReport = async (path: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/research/report?path=${encodeURIComponent(path)}`);
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

// 保存修复后的文档
export const saveFixedDoc = async (path: string, content: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/diagnoses/fixed-doc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content }),
  });
  const data: ApiResponse<string> = await res.json();
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

// ========== PRD评审相关API ==========

// 获取PRD文档目录树
export const getPrdDocTree = async (): Promise<PrdDocNode[]> => {
  const res = await fetch(`${BASE_URL}/prd-review/tree`);
  const data: ApiResponse<PrdDocNode[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取PRD文档内容
export const getPrdDocumentContent = async (path: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/prd-review/content?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<string> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取PRD评审历史
export const getPrdReviewHistory = async (path: string): Promise<PrdReviewRecord[]> => {
  const res = await fetch(`${BASE_URL}/prd-review/history?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<PrdReviewRecord[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取PRD评审Timeline
export const getPrdTimeline = async (path: string): Promise<PrdTimelineData> => {
  const res = await fetch(`${BASE_URL}/prd-review/timeline?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<PrdTimelineData> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取PRD评审报告
export const getPrdReport = async (path: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/prd-review/report?path=${encodeURIComponent(path)}`);
  const data: ApiResponse<string> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取PRD评审视角列表
export const getPrdPerspectives = async (): Promise<PrdPerspective[]> => {
  const res = await fetch(`${BASE_URL}/prd-review/perspectives`);
  const data: ApiResponse<PrdPerspective[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取PRD评审维度列表
export const getPrdDimensions = async (perspective?: string): Promise<PrdDimension[]> => {
  const url = perspective
    ? `${BASE_URL}/prd-review/dimensions?perspective=${perspective}`
    : `${BASE_URL}/prd-review/dimensions`;
  const res = await fetch(url);
  const data: ApiResponse<PrdDimension[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 生成PRD评审Prompt
export const generatePrdPrompt = async (request: GeneratePrdPromptRequest): Promise<GeneratePromptResponse> => {
  const res = await fetch(`${BASE_URL}/prd-review/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const data: ApiResponse<GeneratePromptResponse> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// ========== 帮助文档生成相关API ==========

// 获取文档类型选项
export const getDocTypes = async (): Promise<DocTypeOption[]> => {
  const res = await fetch(`${BASE_URL}/prompt/doc-types`);
  const data: ApiResponse<DocTypeOption[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取目标受众选项
export const getTargetAudiences = async (): Promise<TargetAudienceOption[]> => {
  const res = await fetch(`${BASE_URL}/prompt/target-audiences`);
  const data: ApiResponse<TargetAudienceOption[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 生成帮助文档Prompt
export const generateDocPrompt = async (request: GenerateDocPromptRequest): Promise<GenerateDocPromptResponse> => {
  const res = await fetch(`${BASE_URL}/prompt/generate-doc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const data: ApiResponse<GenerateDocPromptResponse> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// ========== PRD生成相关API ==========

// 获取需求类型选项
export const getRequirementTypes = async (): Promise<RequirementTypeOption[]> => {
  const res = await fetch(`${BASE_URL}/prompt/requirement-types`);
  const data: ApiResponse<RequirementTypeOption[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 生成PRD生成Prompt
export const generatePrdGenPrompt = async (request: GeneratePrdGenPromptRequest): Promise<GeneratePrdGenPromptResponse> => {
  const res = await fetch(`${BASE_URL}/prompt/generate-prd`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const data: ApiResponse<GeneratePrdGenPromptResponse> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 生成财报分析Prompt
export const generateFinancePrompt = async (request: GenerateFinancePromptRequest): Promise<GeneratePromptResponse> => {
  const res = await fetch(`${BASE_URL}/prompt/generate-finance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const data: ApiResponse<GeneratePromptResponse> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 生成研报分析Prompt
export const generateResearchPrompt = async (request: GenerateResearchPromptRequest): Promise<GeneratePromptResponse> => {
  const res = await fetch(`${BASE_URL}/prompt/generate-research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const data: ApiResponse<GeneratePromptResponse> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

// 获取最近记录（统一）
export const getRecentRecords = async (): Promise<RecentRecordItem[]> => {
  const res = await fetch(`${BASE_URL}/records/recent`);
  const data: ApiResponse<RecentRecordItem[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};