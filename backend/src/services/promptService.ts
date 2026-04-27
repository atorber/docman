import { GeneratePromptRequest, GeneratePromptResponse } from '../types';

// 生成调用skill的诊断指令
export const generatePrompt = (request: GeneratePromptRequest): GeneratePromptResponse => {
  const { documentPath, targetUrl, customCheckRequirements, focusDimensions, useLoggedInBrowser, showBrowserUI } = request;

  const docName = documentPath.split('/').pop() || documentPath;
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

  // 构建调用skill的指令（精简版，只包含动态参数）
  let prompt = `请使用「doc-consistency-verifier」skill执行以下文档诊断任务。\n\n`;
  prompt += `# 文档诊断\n\n`;
  prompt += `## 文档信息\n`;
  prompt += `- 原始文档路径: raw/${documentPath}\n`;
  prompt += `- 文档名称: ${docName}\n\n`;

  prompt += `## 诊断配置\n`;

  // 添加诊断维度编号
  if (focusDimensions && focusDimensions.length > 0) {
    prompt += `- 维度编号: ${focusDimensions.join(', ')}\n`;
  } else if (!focusDimensions) {
    // focusDimensions 为 undefined 时，默认全选所有维度（1-18）
    prompt += `- 维度编号: ${Array.from({length: 18}, (_, i) => i + 1).join(', ')}\n`;
  }

  if (targetUrl) {
    prompt += `- 目标URL: ${targetUrl}\n`;
  }

  if (customCheckRequirements) {
    prompt += `- 自定义要求: ${customCheckRequirements}\n`;
  }

  // 添加浏览器配置
  if (targetUrl && useLoggedInBrowser) {
    prompt += `- 使用已登录浏览器: 是\n`;
    prompt += `- 浏览器模式: 保持窗口（reuse-existing-window）\n`;
  }

  if (targetUrl && showBrowserUI) {
    prompt += `- 显示浏览器界面: 是\n`;
  }

  prompt += `\n`;
  prompt += `## 输出配置\n`;
  prompt += `- 时间戳: ${timestamp}\n\n`;
  prompt += `请按照「doc-consistency-verifier」skill中的「执行流程」完成诊断任务。`;

  return {
    prompt,
    documentPath,
    documentName: docName,
    timestamp,
  };
};

// 获取所有诊断维度列表
export const getDimensions = () => [
  { id: 1, name: '文档与系统一致性', description: '双向一致性检查：文档描述在系统中是否存在、系统存在的是否在文档中有描述、文案严格比对（逐字核对）、操作选项完整性、状态与反馈一致性' },
  { id: 2, name: '语法错误', description: '句子结构、标点符号、语法规范' },
  { id: 3, name: '错别字', description: '错别字、同音字错误、形近字错误' },
  { id: 4, name: '与常识违背', description: '技术参数合理性、客观事实符合性' },
  { id: 5, name: '前后文冲突', description: '术语统一性、描述一致性' },
  { id: 6, name: '过时信息', description: '废弃功能/接口、过期版本号' },
  { id: 7, name: '缺失步骤', description: '操作步骤完整性、关键步骤遗漏' },
  { id: 8, name: '敏感信息泄露', description: '密码、密钥、Token等凭证信息' },
  { id: 9, name: '失效链接/图片', description: '超链接有效性、图片可显示性' },
  { id: 10, name: '格式不一致', description: '标题层级、列表样式、代码块格式' },
  { id: 11, name: '描述不清晰/有歧义', description: '模糊表述、歧义性表述' },
  { id: 12, name: '代码示例错误', description: '代码语法、API调用、依赖说明' },
  { id: 13, name: '截图缺失', description: '关键步骤配图、截图清晰度' },
  { id: 14, name: '版本兼容性', description: '功能版本适用性、版本号准确性' },
  { id: 15, name: '冗余内容', description: '重复描述、过时说明' },
  { id: 16, name: '缺少提示/警告/注意', description: '风险操作警告、重要提示' },
  { id: 17, name: '命名不规范', description: '文件名规范、标题命名一致' },
  { id: 18, name: '文档完整性', description: '必要章节、目录结构' },
];