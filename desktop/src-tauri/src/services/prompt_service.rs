use crate::models::{DiagnoseDimension, GeneratePromptRequest, GeneratePromptResponse};
use chrono::Local;

/// 生成诊断 Prompt
pub fn generate_prompt(request: GeneratePromptRequest) -> GeneratePromptResponse {
    let GeneratePromptRequest {
        document_path,
        target_url,
        custom_check_requirements,
        focus_dimensions,
        use_logged_in_browser,
        show_browser_ui,
        ..
    } = request;

    let doc_name = document_path
        .split('/')
        .last()
        .unwrap_or(&document_path)
        .to_string();

    let now = Local::now();
    let timestamp = now.format("%Y%m%d_%H%M%S").to_string();

    let mut prompt = String::new();
    prompt.push_str("请使用当前工作目录的「doc-consistency-verifier」skill执行以下文档诊断任务。\n\n");
    prompt.push_str("# 文档诊断\n\n");
    prompt.push_str("## 文档信息\n");
    prompt.push_str(&format!("- 原始文档路径: raw/{}\n", document_path));
    prompt.push_str(&format!("- 文档名称: {}\n\n", doc_name));

    prompt.push_str("## 诊断配置\n");

    // 添加诊断维度编号
    if let Some(ref dims) = focus_dimensions {
        if !dims.is_empty() {
            let dims_str: Vec<String> = dims.iter().map(|d| d.to_string()).collect();
            prompt.push_str(&format!("- 维度编号: {}\n", dims_str.join(", ")));
        }
    } else {
        // 默认全选所有维度 (1-18)
        let all_dims: Vec<String> = (1..=18).map(|i| i.to_string()).collect();
        prompt.push_str(&format!("- 维度编号: {}\n", all_dims.join(", ")));
    }

    if let Some(ref url) = target_url {
        prompt.push_str(&format!("- 目标URL: {}\n", url));
    }

    if let Some(ref requirements) = custom_check_requirements {
        prompt.push_str(&format!("- 自定义要求: {}\n", requirements));
    }

    // 添加浏览器配置
    if target_url.is_some() && use_logged_in_browser.unwrap_or(false) {
        prompt.push_str("- 使用已登录浏览器: 是\n");
        prompt.push_str("- 浏览器模式: 保持窗口（reuse-existing-window）\n");
    }

    if target_url.is_some() && show_browser_ui.unwrap_or(false) {
        prompt.push_str("- 显示浏览器界面: 是\n");
    }

    prompt.push_str("\n## 输出配置\n");
    prompt.push_str(&format!("- 时间戳: {}\n\n", timestamp));
    prompt.push_str("请按照「doc-consistency-verifier」skill中的「执行流程」完成诊断任务。");

    GeneratePromptResponse {
        prompt,
        document_path,
        document_name: doc_name,
        timestamp,
    }
}

/// 获取所有诊断维度列表
pub fn get_dimensions() -> Vec<DiagnoseDimension> {
    vec![
        DiagnoseDimension {
            id: 1,
            name: "文档与系统一致性".to_string(),
            description: "双向一致性检查：文档描述在系统中是否存在、系统存在的是否在文档中有描述、文案严格比对（逐字核对）、操作选项完整性、状态与反馈一致性".to_string(),
        },
        DiagnoseDimension {
            id: 2,
            name: "语法错误".to_string(),
            description: "句子结构、标点符号、语法规范".to_string(),
        },
        DiagnoseDimension {
            id: 3,
            name: "错别字".to_string(),
            description: "错别字、同音字错误、形近字错误".to_string(),
        },
        DiagnoseDimension {
            id: 4,
            name: "与常识违背".to_string(),
            description: "技术参数合理性、客观事实符合性".to_string(),
        },
        DiagnoseDimension {
            id: 5,
            name: "前后文冲突".to_string(),
            description: "术语统一性、描述一致性".to_string(),
        },
        DiagnoseDimension {
            id: 6,
            name: "过时信息".to_string(),
            description: "废弃功能/接口、过期版本号".to_string(),
        },
        DiagnoseDimension {
            id: 7,
            name: "缺失步骤".to_string(),
            description: "操作步骤完整性、关键步骤遗漏".to_string(),
        },
        DiagnoseDimension {
            id: 8,
            name: "敏感信息泄露".to_string(),
            description: "密码、密钥、Token等凭证信息".to_string(),
        },
        DiagnoseDimension {
            id: 9,
            name: "失效链接/图片".to_string(),
            description: "超链接有效性、图片可显示性".to_string(),
        },
        DiagnoseDimension {
            id: 10,
            name: "格式不一致".to_string(),
            description: "标题层级、列表样式、代码块格式".to_string(),
        },
        DiagnoseDimension {
            id: 11,
            name: "描述不清晰/有歧义".to_string(),
            description: "模糊表述、歧义性表述".to_string(),
        },
        DiagnoseDimension {
            id: 12,
            name: "代码示例错误".to_string(),
            description: "代码语法、API调用、依赖说明".to_string(),
        },
        DiagnoseDimension {
            id: 13,
            name: "截图缺失".to_string(),
            description: "关键步骤配图、截图清晰度".to_string(),
        },
        DiagnoseDimension {
            id: 14,
            name: "版本兼容性".to_string(),
            description: "功能版本适用性、版本号准确性".to_string(),
        },
        DiagnoseDimension {
            id: 15,
            name: "冗余内容".to_string(),
            description: "重复描述、过时说明".to_string(),
        },
        DiagnoseDimension {
            id: 16,
            name: "缺少提示/警告/注意".to_string(),
            description: "风险操作警告、重要提示".to_string(),
        },
        DiagnoseDimension {
            id: 17,
            name: "命名不规范".to_string(),
            description: "文件名规范、标题命名一致".to_string(),
        },
        DiagnoseDimension {
            id: 18,
            name: "文档完整性".to_string(),
            description: "必要章节、目录结构".to_string(),
        },
    ]
}