use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// 文档树节点
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DocNode {
    pub name: String,
    pub path: String,
    pub relative_path: String,
    #[serde(rename = "type")]
    pub node_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub children: Option<Vec<DocNode>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub diagnose_status: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_diagnose_time: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub history: Option<Vec<DiagnoseRecord>>,
}

/// 诊断历史记录
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagnoseRecord {
    pub timestamp: String,
    pub document_path: String,
    pub document_name: String,
    pub status: String,
    pub total_issues: i32,
    pub high_priority: i32,
    pub medium_priority: i32,
    pub low_priority: i32,
    pub report_path: String,
    pub timeline_path: String,
    pub fixed_doc_path: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration_seconds: Option<i32>,
}

/// Timeline JSON 结构
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TimelineData {
    pub task_id: String,
    pub document: DocumentInfo,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub target_url: Option<String>,
    pub start_time: String,
    pub end_time: String,
    pub duration_seconds: i32,
    pub status: String,
    pub dimensions: Vec<DimensionRecord>,
    pub summary: Summary,
    pub outputs: Outputs,
    pub errors: Vec<TimelineError>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocumentInfo {
    pub name: String,
    pub path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DimensionRecord {
    pub id: i32,
    pub name: String,
    pub status: String,
    pub start_time: String,
    pub end_time: String,
    pub duration_ms: i32,
    pub issue_count: i32,
    pub issues: Vec<IssueRecord>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IssueRecord {
    #[serde(rename = "type")]
    pub issue_type: String,
    pub severity: String,
    pub description: String,
    pub location: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Summary {
    pub total_issues: i32,
    pub by_severity: BySeverity,
    pub by_dimension: HashMap<String, i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BySeverity {
    pub high: i32,
    pub medium: i32,
    pub low: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Outputs {
    pub report: String,
    pub fixed_doc: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimelineError {
    pub code: String,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dimension: Option<String>,
}

/// 诊断维度
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagnoseDimension {
    pub id: i32,
    pub name: String,
    pub description: String,
}

/// Prompt 生成请求
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GeneratePromptRequest {
    pub document_path: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub document_content: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub target_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub custom_check_requirements: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub focus_dimensions: Option<Vec<i32>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub use_logged_in_browser: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub show_browser_ui: Option<bool>,
}

/// Prompt 生成响应
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GeneratePromptResponse {
    pub prompt: String,
    pub document_path: String,
    pub document_name: String,
    pub timestamp: String,
}