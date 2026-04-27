// 文档树节点
export interface DocNode {
  name: string;
  path: string;
  relativePath: string;
  type: 'file' | 'directory';
  children?: DocNode[];
  diagnoseStatus?: 'none' | 'has-history';
  lastDiagnoseTime?: string;
}

// 诊断历史记录
export interface DiagnoseRecord {
  timestamp: string;
  documentPath: string;
  documentName: string;
  status: 'completed' | 'failed' | 'partial';
  totalIssues: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  reportPath: string;
  timelinePath: string;
  fixedDocPath: string;
  durationSeconds?: number;
}

// Timeline JSON 结构
export interface TimelineData {
  task_id: string;
  document: {
    name: string;
    path: string;
  };
  target_url?: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  status: 'completed' | 'failed' | 'partial';
  dimensions: DimensionRecord[];
  summary: {
    total_issues: number;
    by_severity: {
      high: number;
      medium: number;
      low: number;
    };
    by_dimension: Record<string, number>;
  };
  outputs: {
    report: string;
    fixed_doc: string;
  };
  errors: TimelineError[];
}

export interface DimensionRecord {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  start_time: string;
  end_time: string;
  duration_ms: number;
  issue_count: number;
  issues: IssueRecord[];
}

export interface IssueRecord {
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  location: string;
}

export interface TimelineError {
  code: string;
  message: string;
  dimension?: string;
}

// 诊断维度
export interface DiagnoseDimension {
  id: number;
  name: string;
  description: string;
}

// Prompt生成请求
export interface GeneratePromptRequest {
  documentPath: string;
  documentContent?: string;
  targetUrl?: string;
  customCheckRequirements?: string;
  focusDimensions?: number[];
}

// Prompt生成响应
export interface GeneratePromptResponse {
  prompt: string;
  documentPath: string;
  documentName: string;
  timestamp: string;
}

// API响应
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}