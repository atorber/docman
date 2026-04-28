use crate::models::DocNode;
use crate::services::file_service;
use tauri::State;
use crate::services::file_service::WorkDirState;

/// 获取文档目录树
#[tauri::command]
pub async fn get_doc_tree(work_dir: State<WorkDirState>) -> Result<Vec<DocNode>, String> {
    file_service::build_doc_tree(&work_dir)
}

/// 获取文档内容
#[tauri::command]
pub async fn get_document_content(path: String, work_dir: State<WorkDirState>) -> Result<String, String> {
    file_service::read_document(&path, &work_dir)
}