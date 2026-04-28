// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod commands;
mod models;
mod services;

use tauri::Manager;
use tauri_plugin_store::StoreExt;

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
            let store = app.store("config.json");
            if let Ok(store) = store {
                if let Some(saved_path) = store.get("workDirectory") {
                    if let Some(path_str) = saved_path.as_str() {
                        let work_dir_state = app.state::<std::sync::Mutex<Option<String>>>();
                        if let Ok(mut dir) = work_dir_state.lock() {
                            *dir = Some(path_str.to_string());
                        }
                    }
                }
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