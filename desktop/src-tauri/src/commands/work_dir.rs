use std::sync::PoisonError;
use tauri::{AppHandle, State};
use tauri_plugin_store::StoreExt;
use crate::services::file_service::WorkDirState;

/// 获取当前工作目录
#[tauri::command]
pub async fn get_work_directory(work_dir: State<'_, WorkDirState>) -> Result<Option<String>, String> {
    let dir = work_dir.lock()
        .map_err(|e: PoisonError<_>| e.to_string())?;
    Ok(dir.clone())
}

/// 设置工作目录
#[tauri::command]
pub async fn set_work_directory(path: String, work_dir: State<'_, WorkDirState>, app: AppHandle) -> Result<(), String> {
    // Update state
    {
        let mut dir = work_dir.lock()
            .map_err(|e: PoisonError<_>| e.to_string())?;
        *dir = Some(path.clone());
    }
    
    // Persist to store
    let store = app.store("config.json")
        .map_err(|e| e.to_string())?;
    store.set("workDirectory", path);
    store.save().map_err(|e| e.to_string())?;
    
    Ok(())
}