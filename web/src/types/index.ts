// 文档树节点
export interface DocNode {
  name: string;
  path: string;
  relativePath: string;
  type: 'file' | 'directory';
  children?: DocNode[];
  diagnoseStatus?: 'none' | 'has-history';
  lastDiagnoseTime?: string;
  history?: DiagnoseRecord[];
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
  // 关联的文档节点（用于URL跳转）
  doc?: DocNode;
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
  useLoggedInBrowser?: boolean;
  showBrowserUI?: boolean;
}

// Prompt生成响应
export interface GeneratePromptResponse {
  prompt: string;
  documentPath: string;
  documentName: string;
  timestamp: string;
}

export interface GenerateFinancePromptRequest {
  documentPath?: string;
  documentText?: string;
  focusPreference?: string;
  externalDataPriority?: string;
}

export interface GenerateResearchPromptRequest {
  documentPath?: string;
  documentText?: string;
  reportType?: '个股研究' | '行业板块研究';
  analysisPreference?: string;
  externalDataPriority?: string;
}

// API响应
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ========== PRD评审相关类型 ==========

// PRD文档树节点
export interface PrdDocNode {
  name: string;
  path: string;
  relativePath: string;
  type: 'file' | 'directory';
  children?: PrdDocNode[];
  reviewStatus?: 'none' | 'has-history';
  lastReviewTime?: string;
  history?: PrdReviewRecord[];
}

// PRD评审历史记录
export interface PrdReviewRecord {
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
  conclusion: '通过' | '有条件通过' | '不通过';
  durationSeconds?: number;
  doc?: PrdDocNode;
}

// PRD评审维度
export interface PrdDimension {
  id: string;
  name: string;
  perspective: string;
  perspectiveName: string;
  description: string;
  checkPoints: string[];
  priority: 'high' | 'medium' | 'low';
}

// PRD评审视角
export interface PrdPerspective {
  id: string;
  name: string;
  dimensionCount: number;
}

// PRD评审Timeline
export interface PrdTimelineData {
  task_id: string;
  document: {
    name: string;
    path: string;
  };
  start_time: string;
  end_time: string;
  duration_seconds: number;
  status: 'completed' | 'failed' | 'partial';
  perspectives: PerspectiveRecord[];
  summary: {
    total_issues: number;
    by_severity: {
      high: number;
      medium: number;
      low: number;
    };
    by_perspective: Record<string, number>;
    conclusion: '通过' | '有条件通过' | '不通过';
    blockers: number;
    important: number;
    minor: number;
  };
  outputs: {
    report: string;
    timeline: string;
  };
  errors: TimelineError[];
}

export interface PerspectiveRecord {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  dimensions: DimensionIssueRecord[];
  summary: {
    total_issues: number;
    by_severity: {
      high: number;
      medium: number;
      low: number;
    };
    status: string;
  };
}

export interface DimensionIssueRecord {
  id: string;
  name: string;
  status: 'completed' | 'failed';
  issue_count: number;
  issues: IssueItemRecord[];
}

export interface IssueItemRecord {
  severity: 'high' | 'medium' | 'low';
  description: string;
  location: string;
}

// PRD评审Prompt请求
export interface GeneratePrdPromptRequest {
  documentPath: string;
  perspectives?: string[];
  focusDimensions?: string[];
  projectBackground?: string;
  techStack?: string;
  customRequirements?: string;
}

// ========== 帮助文档生成相关类型 ==========

// 帮助文档生成Prompt请求
export interface GenerateDocPromptRequest {
  prdPath: string;
  outputPath?: string;
  consoleUrl: string;
  productName?: string;
  docType?: '快速入门' | '操作指南' | '功能说明';
  targetAudience?: '开发者' | '运维人员' | '普通用户';
  outputFormat?: 'Markdown' | 'HTML';
  useLoggedInBrowser?: boolean;
  showBrowserUI?: boolean;
  screenshotMode?: 'fullpage' | 'viewport';
}

// 帮助文档生成Prompt响应
export interface GenerateDocPromptResponse {
  prompt: string;
  prdPath: string;
  outputPath?: string;
  prdName: string;
  productName?: string;
  timestamp: string;
}

// 文档类型选项
export interface DocTypeOption {
  value: string;
  label: string;
  description: string;
}

// 目标受众选项
export interface TargetAudienceOption {
  value: string;
  label: string;
  description: string;
}

// ========== PRD生成相关类型 ==========

// PRD生成Prompt请求
export interface GeneratePrdGenPromptRequest {
  type: '新功能' | '功能优化' | '重构' | '修复';
  productName: string;
  title: string;
  initialPrdPath?: string;
  description: string;
  userPersona?: string;
  competitiveLinks?: string[];
  referenceDocs?: string[];
  outputPath: string;
}

// PRD生成Prompt响应
export interface GeneratePrdGenPromptResponse {
  prompt: string;
  productName: string;
  title: string;
  timestamp: string;
}

// 需求类型选项
export interface RequirementTypeOption {
  value: string;
  label: string;
  description: string;
}

// 最近记录（统一聚合）
export interface RecentRecordItem {
  id: string;
  source: 'diagnose' | 'docgen' | 'prdgen' | 'prdreview' | 'finance';
  sourceLabel: '帮助文档诊断' | '帮助文档生成' | 'PRD生成' | 'PRD评审' | '财报分析';
  name: string;
  path: string;
  timestamp: string;
  status?: string;
  docPath?: string;
  timelinePath: string;
}