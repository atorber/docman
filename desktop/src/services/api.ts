import { invoke } from '@tauri-apps/api/core';
import { 
  DocNode, 
  DiagnoseRecord, 
  TimelineData, 
  DiagnoseDimension, 
  GeneratePromptRequest, 
  GeneratePromptResponse 
} from '../types';

// 获取文档目录树
export const getDocTree = async (): Promise<DocNode[]> => {
  return await invoke<DocNode[]>('get_doc_tree');
};

// 获取文档内容
export const getDocumentContent = async (path: string): Promise<string> => {
  return await invoke<string>('get_document_content', { path });
};

// 获取诊断历史
export const getDiagnoseHistory = async (path: string): Promise<DiagnoseRecord[]> => {
  return await invoke<DiagnoseRecord[]>('get_diagnose_history', { path });
};

// 获取Timeline详情
export const getTimeline = async (path: string): Promise<TimelineData> => {
  return await invoke<TimelineData>('get_timeline', { path });
};

// 获取诊断报告
export const getReport = async (path: string): Promise<string> => {
  return await invoke<string>('get_report', { path });
};

// 获取修复后的文档
export const getFixedDoc = async (path: string): Promise<string> => {
  return await invoke<string>('get_fixed_doc', { path });
};

// 保存修复后的文档
export const saveFixedDoc = async (path: string, content: string): Promise<string> => {
  return await invoke<string>('save_fixed_doc', { path, content });
};

// 生成诊断Prompt
export const generatePrompt = async (request: GeneratePromptRequest): Promise<GeneratePromptResponse> => {
  return await invoke<GeneratePromptResponse>('generate_prompt', { request });
};

// 获取诊断维度列表
export const getDimensions = async (): Promise<DiagnoseDimension[]> => {
  return await invoke<DiagnoseDimension[]>('get_dimensions');
};

// 工作目录相关
export const getWorkDirectory = async (): Promise<string | null> => {
  return await invoke<string | null>('get_work_directory');
};

export const setWorkDirectory = async (path: string): Promise<void> => {
  return await invoke<void>('set_work_directory', { path });
};