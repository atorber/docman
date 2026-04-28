use crate::models::*;
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::State;
use walkdir::WalkDir;

pub type WorkDirState = Mutex<Option<String>>;

/// 获取工作目录
pub fn get_work_dir(work_dir: &State<WorkDirState>) -> Option<PathBuf> {
    let dir = work_dir.lock().ok()?;
    dir.as_ref().map(|d| PathBuf::from(d))
}

/// 获取 raw 目录路径
fn get_raw_path(work_dir: &State<WorkDirState>) -> Option<PathBuf> {
    get_work_dir(work_dir).map(|d| d.join("raw"))
}

/// 获取 timeline 目录路径
fn get_timeline_path(work_dir: &State<WorkDirState>) -> Option<PathBuf> {
    get_work_dir(work_dir).map(|d| d.join("timeline"))
}

/// 安全地将路径转换为字符串
fn path_to_string(path: &PathBuf) -> String {
    path.to_str().unwrap_or("").to_string()
}

/// 安全地将 OsStr 转换为字符串
fn osstr_to_string(s: &std::ffi::OsStr) -> String {
    s.to_str().unwrap_or("").to_string()
}

/// 构建文档目录树
pub fn build_doc_tree(work_dir: &State<WorkDirState>) -> Result<Vec<DocNode>, String> {
    let raw_path = get_raw_path(work_dir).ok_or("工作目录未设置")?;
    
    if !raw_path.exists() {
        return Err(format!("raw 目录不存在: {:?}", raw_path));
    }
    
    Ok(build_doc_tree_recursive(&raw_path, &raw_path, work_dir))
}

fn build_doc_tree_recursive(
    current_path: &PathBuf,
    raw_path: &PathBuf,
    work_dir: &State<WorkDirState>,
) -> Vec<DocNode> {
    let entries = match fs::read_dir(current_path) {
        Ok(entries) => entries,
        Err(_) => return vec![],
    };

    let mut nodes: Vec<DocNode> = entries
        .filter_map(|entry| entry.ok())
        .filter(|entry| {
            let name = entry.file_name();
            name.to_str().map(|s| !s.starts_with('.')).unwrap_or(false)
        })
        .map(|entry| {
            let path = entry.path();
            let relative_path = match path.strip_prefix(raw_path) {
                Ok(p) => p.to_str().unwrap_or("").to_string(),
                Err(_) => "".to_string(),
            };
            let is_dir = path.is_dir();
            
            let name = osstr_to_string(&entry.file_name());
            
            let mut node = DocNode {
                name: name.clone(),
                path: path_to_string(&path),
                relative_path: relative_path.clone(),
                node_type: if is_dir { "directory".to_string() } else { "file".to_string() },
                children: None,
                diagnose_status: None,
                last_diagnose_time: None,
                history: None,
            };

            if is_dir {
                node.children = Some(build_doc_tree_recursive(&path, raw_path, work_dir));
            } else if path.extension().map(|e| e == "md").unwrap_or(false) {
                // 检查诊断历史
                let history = get_diagnose_history(&relative_path, work_dir);
                if !history.is_empty() {
                    node.diagnose_status = Some("has-history".to_string());
                    node.last_diagnose_time = Some(history[0].timestamp.clone());
                } else {
                    node.diagnose_status = Some("none".to_string());
                }
            }

            node
        })
        .collect();

    // 排序：目录在前，然后按名称排序
    nodes.sort_by(|a, b| {
        let a_is_dir = a.node_type == "directory";
        let b_is_dir = b.node_type == "directory";
        if a_is_dir && !b_is_dir {
            std::cmp::Ordering::Less
        } else if !a_is_dir && b_is_dir {
            std::cmp::Ordering::Greater
        } else {
            a.name.cmp(&b.name)
        }
    });

    nodes
}

/// 读取文档内容
pub fn read_document(relative_path: &str, work_dir: &State<WorkDirState>) -> Result<String, String> {
    let raw_path = get_raw_path(work_dir).ok_or("工作目录未设置")?;
    let full_path = raw_path.join(relative_path);
    
    fs::read_to_string(&full_path).map_err(|e| format!("读取文档失败: {}", e))
}

/// 获取诊断历史
pub fn get_diagnose_history(
    document_relative_path: &str,
    work_dir: &State<WorkDirState>,
) -> Vec<DiagnoseRecord> {
    let timeline_path = match get_timeline_path(work_dir) {
        Some(p) if p.exists() => p,
        _ => return vec![],
    };

    let doc_name = PathBuf::from(document_relative_path)
        .file_stem()
        .map(|s| s.to_str().unwrap_or(""))
        .unwrap_or("")
        .to_string();

    let mut records: Vec<DiagnoseRecord> = vec![];

    // 查找匹配的 timeline 文件
    for entry in WalkDir::new(&timeline_path)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| {
            e.file_name()
                .to_str()
                .map(|s| s.ends_with("_timeline.json"))
                .unwrap_or(false)
        })
    {
        let file_name = osstr_to_string(entry.file_name());
        let base_name = file_name.replace("_timeline.json", "");
        
        // 检查是否匹配当前文档
        let pattern = format!("{}_", doc_name);
        if base_name.starts_with(&pattern) {
            if let Ok(content) = fs::read_to_string(entry.path()) {
                if let Ok(timeline) = serde_json::from_str::<TimelineData>(&content) {
                    let base_dir = get_work_dir(work_dir);
                    let report_path = base_dir.as_ref()
                        .map(|d| {
                            d.join(&timeline.outputs.report)
                                .to_str()
                                .unwrap_or("")
                                .to_string()
                        })
                        .unwrap_or_default();
                    let fixed_doc_path = base_dir.as_ref()
                        .map(|d| {
                            d.join(&timeline.outputs.fixed_doc)
                                .to_str()
                                .unwrap_or("")
                                .to_string()
                        })
                        .unwrap_or_default();

                    records.push(DiagnoseRecord {
                        timestamp: timeline.start_time.split('.').next().unwrap_or(&timeline.start_time).replace('T', " "),
                        document_path: document_relative_path.to_string(),
                        document_name: PathBuf::from(document_relative_path)
                            .file_name()
                            .map(|s| s.to_str().unwrap_or(""))
                            .unwrap_or("")
                            .to_string(),
                        status: timeline.status,
                        total_issues: timeline.summary.total_issues,
                        high_priority: timeline.summary.by_severity.high,
                        medium_priority: timeline.summary.by_severity.medium,
                        low_priority: timeline.summary.by_severity.low,
                        report_path,
                        timeline_path: entry.path().to_str().unwrap_or("").to_string(),
                        fixed_doc_path,
                        duration_seconds: Some(timeline.duration_seconds),
                    });
                }
            }
        }
    }

    // 按时间倒序排列
    records.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    records
}

/// 读取 Timeline 文件
pub fn read_timeline(timeline_path: &str) -> Result<TimelineData, String> {
    let content = fs::read_to_string(timeline_path)
        .map_err(|e| format!("读取 Timeline 失败: {}", e))?;
    
    serde_json::from_str(&content).map_err(|e| format!("解析 Timeline 失败: {}", e))
}

/// 读取报告文件
pub fn read_report(report_path: &str, work_dir: &State<WorkDirState>) -> Result<String, String> {
    let base_dir = get_work_dir(work_dir).ok_or("工作目录未设置")?;
    
    let full_path = if report_path.starts_with('/') {
        PathBuf::from(report_path)
    } else {
        base_dir.join(report_path)
    };

    if !full_path.exists() {
        return Ok("报告文件不存在".to_string());
    }

    fs::read_to_string(&full_path).map_err(|e| format!("读取报告失败: {}", e))
}

/// 读取修复后的文档
pub fn read_fixed_doc(fixed_doc_path: &str, work_dir: &State<WorkDirState>) -> Result<String, String> {
    let base_dir = get_work_dir(work_dir).ok_or("工作目录未设置")?;
    
    let full_path = if fixed_doc_path.starts_with('/') {
        PathBuf::from(fixed_doc_path)
    } else {
        base_dir.join(fixed_doc_path)
    };

    if !full_path.exists() {
        return Ok("修复后的文档不存在".to_string());
    }

    fs::read_to_string(&full_path).map_err(|e| format!("读取修复后文档失败: {}", e))
}

/// 保存修复后的文档
pub fn write_fixed_doc(fixed_doc_path: &str, content: &str, work_dir: &State<WorkDirState>) -> Result<String, String> {
    let base_dir = get_work_dir(work_dir).ok_or("工作目录未设置")?;
    
    let full_path = if fixed_doc_path.starts_with('/') {
        PathBuf::from(fixed_doc_path)
    } else {
        base_dir.join(fixed_doc_path)
    };

    // 确保目录存在
    if let Some(parent) = full_path.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("创建目录失败: {}", e))?;
    }

    fs::write(&full_path, content).map_err(|e| format!("保存文件失败: {}", e))?;
    
    Ok("保存成功".to_string())
}