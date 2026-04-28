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
    timeline: string;
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
}

// PRD评审Timeline结构
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

// 视角记录
export interface PerspectiveRecord {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  dimensions: DimensionIssue[];
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

// 维度问题记录
export interface DimensionIssue {
  id: string;
  name: string;
  status: 'completed' | 'failed';
  issue_count: number;
  issues: IssueItem[];
}

export interface IssueItem {
  severity: 'high' | 'medium' | 'low';
  description: string;
  location: string;
}

// PRD评审Prompt生成请求
export interface GeneratePrdPromptRequest {
  documentPath: string;
  documentContent?: string;
  perspectives?: string[];
  focusDimensions?: string[];
  projectBackground?: string;
  techStack?: string;
  customRequirements?: string;
}

// PRD评审维度定义
export interface PrdDimension {
  id: string;
  name: string;
  perspective: string;
  perspectiveName: string;
  description: string;
  checkPoints: string[];
  priority: 'high' | 'medium' | 'low';
}

// ========== 帮助文档生成相关类型 ==========

// 帮助文档生成请求
export interface GenerateDocPromptRequest {
  prdPath: string;                  // PRD文档路径
  outputPath?: string;              // 生成文档输出路径（raw 相对路径）
  consoleUrl: string;               // 控制台URL
  productName?: string;              // 产品名称
  docType?: '快速入门' | '操作指南' | '功能说明';  // 文档类型
  targetAudience?: '开发者' | '运维人员' | '普通用户';  // 目标受众
  outputFormat?: 'Markdown' | 'HTML';  // 输出格式
  useLoggedInBrowser?: boolean;     // 使用已登录浏览器
  showBrowserUI?: boolean;          // 显示浏览器界面
}

// 帮助文档生成响应
export interface GenerateDocPromptResponse {
  prompt: string;
  prdPath: string;
  outputPath?: string;
  prdName: string;
  productName?: string;
  timestamp: string;
}

// 帮助文档生成历史记录
export interface DocGenRecord {
  timestamp: string;
  prdPath: string;
  prdName: string;
  productName: string;
  consoleUrl: string;
  docType: string;
  status: 'completed' | 'failed' | 'partial';
  outputPath: string;
  screenshotCount: number;
  durationSeconds?: number;
}

// 帮助文档生成Timeline结构
export interface DocGenTimelineData {
  task_id: string;
  prd: {
    name: string;
    path: string;
  };
  console_url: string;
  product_name: string;
  doc_type: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  status: 'completed' | 'failed' | 'partial';
  phases: DocGenPhase[];
  summary: {
    feature_count: number;
    screenshot_count: number;
    sections: string[];
  };
  outputs: {
    document: string;
    metadata: string;
  };
  errors: TimelineError[];
}

// 帮助文档生成阶段
export interface DocGenPhase {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  start_time: string;
  end_time: string;
  duration_ms: number;
  details: Record<string, unknown>;
}

// 文档类型选项
export const DOC_TYPES = [
  { value: '快速入门', label: '快速入门', description: '简洁的入门指南，帮助用户快速上手核心功能' },
  { value: '操作指南', label: '操作指南', description: '详细的操作步骤说明，涵盖所有功能模块' },
  { value: '功能说明', label: '功能说明', description: '功能详细介绍，包含参数说明和最佳实践' },
] as const;

// 目标受众选项
export const TARGET_AUDIENCES = [
  { value: '普通用户', label: '普通用户', description: '非技术背景的用户，需要详细的步骤说明' },
  { value: '开发者', label: '开发者', description: '技术人员，可以使用技术术语' },
  { value: '运维人员', label: '运维人员', description: '运维工程师，关注配置和部署' },
] as const;

// ========== PRD生成相关类型 ==========

// PRD生成请求
export interface GeneratePrdGenPromptRequest {
  type: '新功能' | '功能优化' | '重构' | '修复';  // 需求类型
  productName: string;                              // 产品名称
  title: string;                                     // 需求标题
  initialPrdPath?: string;                           // 初始PRD路径（可选）
  description: string;                               // 需求描述
  userPersona?: string;                             // 用户画像（可选）
  competitiveLinks?: string[];                       // 竞品链接（可选）
  referenceDocs?: string[];                          // 参考文档（可选）
  outputPath: string;                               // 输出路径（必填）
}

// PRD生成响应
export interface GeneratePrdGenPromptResponse {
  prompt: string;
  productName: string;
  title: string;
  timestamp: string;
}

// 需求类型选项
export const REQUIREMENT_TYPES = [
  { value: '新功能', label: '新功能', description: '全新的功能需求' },
  { value: '功能优化', label: '功能优化', description: '对现有功能进行改进和优化' },
  { value: '重构', label: '重构', description: '系统重构需求' },
  { value: '修复', label: '修复', description: '缺陷修复需求' },
] as const;

// PRD生成历史记录
export interface PrdGenRecord {
  timestamp: string;
  productName: string;
  title: string;
  type: string;
  outputPath: string;
  status: 'completed' | 'failed' | 'partial';
  featureCount: number;
  durationSeconds?: number;
}

// PRD生成Timeline结构
export interface PrdGenTimelineData {
  task_id: string;
  requirement: {
    title: string;
    type: string;
    product: string;
  };
  start_time: string;
  end_time: string;
  duration_seconds: number;
  status: 'completed' | 'failed' | 'partial';
  phases: PrdGenPhase[];
  summary: {
    total_sections: number;
    feature_count: number;
    acceptance_criteria_count: number;
    user_confirmations: number;
    quality_metrics: {
      completeness: string;
      clarity: string;
      testability: string;
      consistency: string;
    };
  };
  outputs: {
    prd_document: string;
    metadata: string;
    references: string;
  };
  errors: TimelineError[];
}

// PRD生成阶段
export interface PrdGenPhase {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  start_time: string;
  end_time: string;
  duration_ms: number;
  details: Record<string, unknown>;
}

// 最近记录（统一聚合）
export interface RecentRecordItem {
  id: string;
  source: 'diagnose' | 'docgen' | 'prdgen' | 'prdreview';
  sourceLabel: '帮助文档诊断' | '帮助文档生成' | 'PRD生成' | 'PRD评审';
  name: string;
  path: string;
  timestamp: string;
  status?: string;
  docPath?: string;
  timelinePath: string;
}