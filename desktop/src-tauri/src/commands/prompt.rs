use crate::models::{DiagnoseDimension, GeneratePromptRequest, GeneratePromptResponse};
use crate::services::prompt_service;

/// 生成诊断 Prompt
#[tauri::command]
pub async fn generate_prompt(request: GeneratePromptRequest) -> Result<GeneratePromptResponse, String> {
    Ok(prompt_service::generate_prompt(request))
}

/// 获取诊断维度列表
#[tauri::command]
pub async fn get_dimensions() -> Result<Vec<DiagnoseDimension>, String> {
    Ok(prompt_service::get_dimensions())
}