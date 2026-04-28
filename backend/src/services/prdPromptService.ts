import { GeneratePrdPromptRequest, GeneratePromptResponse, PrdDimension } from '../types';

// 所有评审维度定义
const PRD_DIMENSIONS: PrdDimension[] = [
  // A. 产品经理视角
  { id: 'A1', name: '需求完整性', perspective: 'A', perspectiveName: '产品经理视角', description: '业务场景覆盖、功能点完整性、遗漏功能识别', priority: 'high', checkPoints: ['核心功能流程是否完整', '辅助功能是否遗漏', '配置项、权限控制是否完整', '关联功能是否考虑'] },
  { id: 'A2', name: '业务价值清晰度', perspective: 'A', perspectiveName: '产品经理视角', description: '业务目标明确、价值可量化、与公司战略对齐', priority: 'high', checkPoints: ['是否有明确的业务目标陈述', '成功指标是否定义', '预期收益是否有数据支撑'] },
  { id: 'A3', name: '用户场景覆盖', perspective: 'A', perspectiveName: '产品经理视角', description: '正常流程、用户画像、使用场景完整性', priority: 'high', checkPoints: ['用户画像是否清晰', '使用场景描述是否完整', '是否考虑不同用户群体的差异'] },
  { id: 'A4', name: '边界条件定义', perspective: 'A', perspectiveName: '产品经理视角', description: '异常流程、边界场景、错误处理场景', priority: 'high', checkPoints: ['输入字段长度、格式限制', '数值范围限制', '并发限制', '超时处理'] },
  { id: 'A5', name: '验收标准明确性', perspective: 'A', perspectiveName: '产品经理视角', description: '可测试的验收条件、成功/失败标准', priority: 'high', checkPoints: ['每个功能是否有可测试的验收条件', '验收标准是否量化、可测量', '成功/失败标准是否明确'] },
  { id: 'A6', name: '优先级合理性', perspective: 'A', perspectiveName: '产品经理视角', description: 'MoSCoW分级依据、依赖关系、迭代规划', priority: 'medium', checkPoints: ['优先级是否有依据（MoSCoW原则）', '是否考虑功能间依赖关系', '是否符合迭代规划节奏'] },
  { id: 'A7', name: '非功能需求', perspective: 'A', perspectiveName: '产品经理视角', description: '性能指标、可用性要求、安全需求', priority: 'high', checkPoints: ['性能指标是否具体（响应时间、TPS等）', '可用性目标是否明确（SLA）', '安全需求是否完整'] },
  { id: 'A8', name: '竞品/对标分析', perspective: 'A', perspectiveName: '产品经理视角', description: '竞品功能对比、差异化定位', priority: 'low', checkPoints: ['是否有竞品分析', '差异化优势是否清晰', '是否借鉴行业最佳实践'] },
  { id: 'A9', name: '成本收益分析', perspective: 'A', perspectiveName: '产品经理视角', description: 'ROI预估、资源投入评估', priority: 'medium', checkPoints: ['开发工作量预估', '运维成本预估', '收益预估依据'] },
  { id: 'A10', name: '上线风险评估', perspective: 'A', perspectiveName: '产品经理视角', description: '合规风险、运营风险、回滚方案', priority: 'high', checkPoints: ['是否有风险识别', '风险应对措施是否充分', '是否有回滚预案'] },

  // B. 研发工程师视角
  { id: 'B1', name: '技术可行性', perspective: 'B', perspectiveName: '研发工程师视角', description: '现有技术栈支持、技术难点识别、方案可行性', priority: 'high', checkPoints: ['是否需要引入新技术', '技术难点是否有解决方案', '是否有技术验证'] },
  { id: 'B2', name: '实现复杂度评估', perspective: 'B', perspectiveName: '研发工程师视角', description: '工作量预估合理性、技术债务识别', priority: 'medium', checkPoints: ['开发工作量是否可预估', '是否需要重构现有代码', '是否可以复用现有组件'] },
  { id: 'B3', name: '数据模型设计', perspective: 'B', perspectiveName: '研发工程师视角', description: '数据结构合理性、字段完整性、索引设计', priority: 'high', checkPoints: ['数据表设计是否完整', '字段类型是否合理', '是否考虑历史数据处理'] },
  { id: 'B4', name: '接口设计完整性', perspective: 'B', perspectiveName: '研发工程师视角', description: 'API设计规范、参数定义、错误码设计', priority: 'high', checkPoints: ['接口列表是否完整', '请求/响应结构是否定义', '错误处理机制是否完整'] },
  { id: 'B5', name: '性能需求可实现性', perspective: 'B', perspectiveName: '研发工程师视角', description: '性能指标可达成、瓶颈识别、优化方案', priority: 'high', checkPoints: ['性能目标是否可达', '是否有性能测试方案', '是否需要缓存、异步等优化'] },
  { id: 'B6', name: '安全需求完整性', perspective: 'B', perspectiveName: '研发工程师视角', description: '认证授权、数据加密、敏感信息处理', priority: 'high', checkPoints: ['权限控制是否完整', '敏感数据是否加密', '是否有安全审计需求'] },
  { id: 'B7', name: '兼容性要求', perspective: 'B', perspectiveName: '研发工程师视角', description: '系统版本、浏览器、设备兼容性范围', priority: 'medium', checkPoints: ['支持的版本范围', '向后兼容性要求', '接口版本管理'] },
  { id: 'B8', name: '可维护性考量', perspective: 'B', perspectiveName: '研发工程师视角', description: '代码可读性、日志埋点、监控告警', priority: 'medium', checkPoints: ['是否有日志规范要求', '关键指标监控需求', '运维工具需求'] },

  // C. 架构师视角
  { id: 'C1', name: '系统架构影响', perspective: 'C', perspectiveName: '架构师视角', description: '对现有架构的冲击、模块划分合理性', priority: 'high', checkPoints: ['是否影响现有系统架构', '新模块如何融入现有架构', '系统边界是否清晰'] },
  { id: 'C2', name: '扩展性设计', perspective: 'C', perspectiveName: '架构师视角', description: '未来扩展预留、插件化设计、配置化能力', priority: 'medium', checkPoints: ['是否考虑未来扩展场景', '是否有配置化需求', '是否需要插件机制'] },
  { id: 'C3', name: '技术选型合理性', perspective: 'C', perspectiveName: '架构师视角', description: '技术方案选择依据、引入新组件评估', priority: 'high', checkPoints: ['技术选型是否有依据', '是否与现有技术栈一致', '新技术引入的风险评估'] },
  { id: 'C4', name: '数据流设计', perspective: 'C', perspectiveName: '架构师视角', description: '数据流转路径清晰、数据一致性保障', priority: 'high', checkPoints: ['数据流向是否清晰', '是否有数据一致性要求', '跨系统数据同步方案'] },
  { id: 'C5', name: '系统依赖分析', perspective: 'C', perspectiveName: '架构师视角', description: '外部依赖识别、依赖稳定性、降级方案', priority: 'high', checkPoints: ['依赖的外部系统列表', '依赖失败的影响分析', '是否有降级方案'] },
  { id: 'C6', name: '技术风险评估', perspective: 'C', perspectiveName: '架构师视角', description: '技术难点、不确定性因素、备选方案', priority: 'high', checkPoints: ['技术风险点列表', '风险应对方案', '是否有Plan B'] },

  // D. 测试工程师视角
  { id: 'D1', name: '测试点可提取性', perspective: 'D', perspectiveName: '测试工程师视角', description: '功能测试点清晰、可设计测试用例', priority: 'high', checkPoints: ['每个功能是否有明确测试点', '是否可以编写测试用例', '测试范围是否明确'] },
  { id: 'D2', name: '测试数据需求', perspective: 'D', perspectiveName: '测试工程师视角', description: '测试数据准备要求、数据隔离策略', priority: 'medium', checkPoints: ['是否需要特殊测试数据', '数据准备工作量', '数据隔离需求'] },
  { id: 'D3', name: '异常场景覆盖', perspective: 'D', perspectiveName: '测试工程师视角', description: '错误场景、边界值、负面测试场景', priority: 'high', checkPoints: ['错误场景是否完整', '边界值是否定义', '异常处理是否覆盖'] },
  { id: 'D4', name: '回归影响分析', perspective: 'D', perspectiveName: '测试工程师视角', description: '影响范围评估、回归测试范围', priority: 'medium', checkPoints: ['改动影响哪些模块', '回归测试范围', '是否需要新增自动化用例'] },
  { id: 'D5', name: '兼容性测试需求', perspective: 'D', perspectiveName: '测试工程师视角', description: '浏览器/设备/系统版本测试范围', priority: 'medium', checkPoints: ['兼容性测试矩阵', '测试环境需求', '特殊兼容性场景'] },

  // E. 文档质量视角
  { id: 'E1', name: '格式规范性', perspective: 'E', perspectiveName: '文档质量视角', description: '目录结构、标题层级、版本记录', priority: 'low', checkPoints: ['是否有清晰的目录结构', '标题层级是否规范', '是否有版本变更记录'] },
  { id: 'E2', name: '术语一致性', perspective: 'E', perspectiveName: '文档质量视角', description: '专有名词统一、缩写规范', priority: 'medium', checkPoints: ['术语是否前后一致', '缩写是否有说明', '是否有术语表'] },
  { id: 'E3', name: '表述无歧义', perspective: 'E', perspectiveName: '文档质量视角', description: '需求描述清晰、无模糊表述', priority: 'high', checkPoints: ['是否有"适当"、"合理"等模糊词', '逻辑关系是否清晰', '是否有多解表述'] },
];

// 获取所有评审视角
export const getPerspectives = () => [
  { id: 'A', name: '产品经理视角', dimensionCount: 10 },
  { id: 'B', name: '研发工程师视角', dimensionCount: 8 },
  { id: 'C', name: '架构师视角', dimensionCount: 6 },
  { id: 'D', name: '测试工程师视角', dimensionCount: 5 },
  { id: 'E', name: '文档质量视角', dimensionCount: 3 },
];

// 获取所有评审维度列表
export const getPrdDimensions = (): PrdDimension[] => PRD_DIMENSIONS;

// 获取指定视角的维度列表
export const getDimensionsByPerspective = (perspectiveId: string): PrdDimension[] => {
  return PRD_DIMENSIONS.filter(d => d.perspective === perspectiveId);
};

// 生成PRD评审Prompt
export const generatePrdPrompt = (request: GeneratePrdPromptRequest): GeneratePromptResponse => {
  const { documentPath, perspectives, focusDimensions, projectBackground, techStack, customRequirements } = request;

  const docName = documentPath.split('/').pop() || documentPath;
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

  let prompt = `请使用当前工作目录的「prd-reviewer」skill执行以下PRD评审任务。\n\n`;
  prompt += `# PRD评审\n\n`;
  prompt += `## 文档信息\n`;
  prompt += `- 原始文档路径: prd/${documentPath}\n`;
  prompt += `- 文档名称: ${docName}\n\n`;

  prompt += `## 评审配置\n`;

  // 添加评审视角
  if (perspectives && perspectives.length > 0) {
    prompt += `- 评审视角: ${perspectives.join(', ')}\n`;
  } else {
    prompt += `- 评审视角: A, B, C, D, E\n`;
  }

  // 添加维度编号
  if (focusDimensions && focusDimensions.length > 0) {
    prompt += `- 维度编号: ${focusDimensions.join(', ')}\n`;
  } else {
    // 默认全部维度
    const allDimensionIds = PRD_DIMENSIONS.map(d => d.id);
    prompt += `- 维度编号: ${allDimensionIds.join(', ')}\n`;
  }

  // 添加项目背景
  if (projectBackground) {
    prompt += `- 项目背景: ${projectBackground}\n`;
  }

  // 添加技术栈信息
  if (techStack) {
    prompt += `- 技术栈信息: ${techStack}\n`;
  }

  // 添加自定义要求
  if (customRequirements) {
    prompt += `- 自定义要求: ${customRequirements}\n`;
  }

  prompt += `\n`;
  prompt += `## 输出配置\n`;
  prompt += `- 时间戳: ${timestamp}\n\n`;
  prompt += `请按照「prd-reviewer」skill中的「执行流程」完成评审任务。`;

  return {
    prompt,
    documentPath,
    documentName: docName,
    timestamp,
  };
};