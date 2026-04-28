use crate::models::{DiagnoseRecord, TimelineData};
use crate::services::file_service;
use tauri::State;
use crate::services::file_service::WorkDirState;

/// 获取文档的诊断历史列表
#[tauri::command]
pub async fn get_diagnose_history(path: String, work_dir: State<'_, WorkDirState>) -> Result<Vec<DiagnoseRecord>, String> {
    Ok(file_service::get_diagnose_history(&path, &work_dir))
}

/// 获取 Timeline 详情
#[tauri::command]
pub async fn get_timeline(path: String) -> Result<TimelineData, String> {
    file_service::read_timeline(&path)
}

/// 获取诊断报告
#[tauri::command]
pub async fn get_report(path: String, work_dir: State<'_, WorkDirState>) -> Result<String, String> {
    file_service::read_report(&path, &work_dir)
}

/// 获取修复后的文档
#[tauri::command]
pub async fn get_fixed_doc(path: String, work_dir: State<'_, WorkDirState>) -> Result<String, String> {
    file_service::read_fixed_doc(&path, &work_dir)
}

/// 保存修复后的文档
#[tauri::command]
pub async fn save_fixed_doc(path: String, content: String, work_dir: State<'_, WorkDirState>) -> Result<String, String> {
    file_service::write_fixed_doc(&path, &content, &work_dir)
}