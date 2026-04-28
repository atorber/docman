// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod commands;
mod models;
mod services;

use tauri::Manager;
use tauri_plugin_store::StoreExt;

// 默认工作目录 - 项目根目录
const DEFAULT_WORK_DIR: &str = "/Users/luyuchao/Downloads/aihc-master-3200cb5c78dfb8b61d67c8325643a67919756219";

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .setup(|app| {
            // Initialize work directory state
            let work_dir = std::sync::Mutex::new(None::<String>);
            app.manage(work_dir);
            
            // Try to load saved work directory from store
            let mut loaded_from_store = false;
            if let Ok(store) = app.store("config.json") {
                if let Some(saved_path) = store.get("workDirectory") {
                    if let Some(path_str) = saved_path.as_str() {
                        let work_dir_state = app.state::<std::sync::Mutex<Option<String>>>();
                        if let Ok(mut dir) = work_dir_state.lock() {
                            *dir = Some(path_str.to_string());
                            loaded_from_store = true;
                        };
                    }
                }
            }
            
            // If not loaded from store, use default work directory
            if !loaded_from_store {
                let work_dir_state = app.state::<std::sync::Mutex<Option<String>>>();
                if let Ok(mut dir) = work_dir_state.lock() {
                    *dir = Some(DEFAULT_WORK_DIR.to_string());
                    println!("[INFO] Using default work directory: {}", DEFAULT_WORK_DIR);
                };
            }
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Document commands
            commands::document::get_doc_tree,
            commands::document::get_document_content,
            // Diagnose commands
            commands::diagnose::get_diagnose_history,
            commands::diagnose::get_timeline,
            commands::diagnose::get_report,
            commands::diagnose::get_fixed_doc,
            commands::diagnose::save_fixed_doc,
            // Prompt commands
            commands::prompt::generate_prompt,
            commands::prompt::get_dimensions,
            // Work directory commands
            commands::work_dir::get_work_directory,
            commands::work_dir::set_work_directory,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}