# Tauri 桌面客户端开发文档

## 1. 需求场景

将现有的 DocMan 文档诊断工具从 Web 应用转换为桌面客户端应用，提供更好的用户体验：
- 无需手动启动前后端服务
- 一键安装即用
- 原生系统集成（文件选择、系统通知等）
- 更好的性能和安全性

## 2. 现有架构分析

### 2.1 前端 (web/)
- **技术栈**: React 18 + TypeScript + Ant Design 5 + Vite 5 + React Router 7
- **主要组件**: DocTree, HistoryList, DiagnosePanel, DocPreview, PromptPanel, PromptPreview
- **核心页面**: Home.tsx (883行，包含完整业务逻辑)
- **API调用**: 通过 fetch 调用 `/api/*` 后端接口

### 2.2 后端 (backend/)
- **技术栈**: Node.js + Express + TypeScript
- **端口**: 3001
- **API 接口**:
  - `/api/documents/tree` - 获取文档目录树
  - `/api/documents/content` - 获取文档内容
  - `/api/diagnoses/history` - 获取诊断历史
  - `/api/diagnoses/timeline` - 获取诊断详情
  - `/api/diagnoses/report` - 获取诊断报告
  - `/api/diagnoses/fixed-doc` (GET/POST) - 读写修复后文档
  - `/api/prompt/generate` - 生成诊断 Prompt
  - `/api/prompt/dimensions` - 获取诊断维度列表

### 2.3 核心功能
1. 文档目录树浏览与选择
2. Markdown 文档预览（支持 GFM）
3. 诊断历史查看
4. 诊断报告展示（支持锚点跳转）
5. Diff 对比视图（原始文档 vs 修复后文档）
6. 修复后文档编辑与保存
7. Prompt 生成配置
8. URL 分享跳转

## 3. 技术方案

### 3.1 Tauri 架构设计

```
desktop/
├── src-tauri/              # Rust 后端
│   ├── src/
│   │   ├── main.rs         # 主入口
│   │   ├── lib.rs          # 库入口
│   │   ├── commands/       # Tauri 命令
│   │   │   ├── mod.rs
│   │   │   ├── document.rs # 文档相关命令
│   │   │   ├── diagnose.rs # 诊断相关命令
│   │   │   └── prompt.rs   # Prompt 相关命令
│   │   └── services/       # 业务逻辑
│   │       ├── mod.rs
│   │       ├── file_service.rs
│   │       └── prompt_service.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── icons/
├── src/                    # 前端（从 web/ 复用）
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.ts          # 改为 Tauri invoke 调用
│   └── types/
├── package.json
├── vite.config.ts
└── index.html
```

### 3.2 核心改动点

#### 3.2.1 前端 API 层改造
将 `web/src/services/api.ts` 中的 HTTP 请求改为 Tauri invoke 调用：

```typescript
// 改造前
export const getDocTree = async (): Promise<DocNode[]> => {
  const res = await fetch(`${BASE_URL}/documents/tree`);
  const data = await res.json();
  return data.data;
};

// 改造后
import { invoke } from '@tauri-apps/api/core';

export const getDocTree = async (): Promise<DocNode[]> => {
  return await invoke('get_doc_tree');
};
```

#### 3.2.2 Rust 后端命令实现
将 Express 路由转换为 Tauri 命令：

```rust
// src-tauri/src/commands/document.rs
use tauri::State;
use crate::services::file_service;

#[tauri::command]
pub async fn get_doc_tree() -> Result<Vec<DocNode>, String> {
    file_service::build_doc_tree().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_document_content(path: String) -> Result<String, String> {
    file_service::read_document(&path).map_err(|e| e.to_string())
}
```

#### 3.2.3 文件路径处理
- 工作目录由用户选择或配置
- 使用 Tauri 的 `dialog` API 让用户选择文档目录
- 所有文件操作基于用户选择的工作目录

### 3.3 新增功能

1. **工作目录选择**
   - 首次启动时弹出目录选择对话框
   - 支持在设置中更改工作目录
   - 记住上次选择的工作目录

2. **应用菜单**
   - 文件菜单：打开目录、最近打开的目录
   - 编辑菜单：复制、全选
   - 帮助菜单：关于

3. **系统通知**
   - 诊断完成时发送系统通知

## 4. 受影响文件

### 4.1 新建文件
| 文件路径 | 说明 |
|---------|------|
| `desktop/package.json` | 前端依赖配置 |
| `desktop/vite.config.ts` | Vite 构建配置 |
| `desktop/index.html` | 入口 HTML |
| `desktop/src-tauri/Cargo.toml` | Rust 依赖配置 |
| `desktop/src-tauri/tauri.conf.json` | Tauri 配置 |
| `desktop/src-tauri/src/main.rs` | Rust 主入口 |
| `desktop/src-tauri/src/lib.rs` | Rust 库入口 |
| `desktop/src-tauri/src/commands/mod.rs` | 命令模块 |
| `desktop/src-tauri/src/commands/document.rs` | 文档命令 |
| `desktop/src-tauri/src/commands/diagnose.rs` | 诊断命令 |
| `desktop/src-tauri/src/commands/prompt.rs` | Prompt 命令 |
| `desktop/src-tauri/src/services/mod.rs` | 服务模块 |
| `desktop/src-tauri/src/services/file_service.rs` | 文件服务 |
| `desktop/src-tauri/src/services/prompt_service.rs` | Prompt 服务 |
| `desktop/src-tauri/src/models/mod.rs` | 数据模型 |
| `desktop/src-tauri/src/models/types.rs` | 类型定义 |

### 4.2 复用文件（从 web/ 复制并修改）
| 源文件 | 目标文件 | 修改内容 |
|--------|---------|---------|
| `web/src/components/*` | `desktop/src/components/*` | 基本无修改 |
| `web/src/pages/Home.tsx` | `desktop/src/pages/Home.tsx` | 移除 URL 相关逻辑 |
| `web/src/App.tsx` | `desktop/src/App.tsx` | 简化路由配置 |
| `web/src/types/index.ts` | `desktop/src/types/index.ts` | 无修改 |
| `web/src/services/api.ts` | `desktop/src/services/api.ts` | HTTP → Tauri invoke |
| `web/index.css` | `desktop/src/index.css` | 无修改 |

## 5. 数据流设计

### 5.1 初始化流程
```
应用启动 → 检查配置 → 有工作目录?
    ↓ 是                    ↓ 否
读取工作目录          弹出目录选择对话框
    ↓                      ↓
加载文档树            用户选择目录 → 保存配置
    ↓                      ↓
渲染主界面 ← ← ← ← ← ← ← ← 
```

### 5.2 文档操作流程
```
用户点击文档 → invoke('get_document_content', {path}) 
                        ↓
              Rust 读取文件内容
                        ↓
              返回给前端渲染
```

### 5.3 诊断流程
```
配置诊断参数 → invoke('generate_prompt', {...})
                        ↓
              Rust 生成 Prompt
                        ↓
              返回给前端展示
                        ↓
用户复制到 Comate 执行诊断 → 结果写入文件
                        ↓
刷新文档树 → 查看诊断结果
```

## 6. 边界条件与异常处理

### 6.1 文件操作异常
- 文件不存在：返回友好错误提示
- 权限不足：提示用户检查权限
- 编码错误：尝试多种编码解析

### 6.2 工作目录异常
- 目录被删除：提示重新选择
- 目录无权限：提示权限问题
- 磁盘空间不足：提示清理空间

### 6.3 配置持久化
- 使用 Tauri 的 `store` 插件保存配置
- 配置文件位置：`~/.docman/config.json`

## 7. 依赖说明

### 7.1 前端依赖
```json
{
  "dependencies": {
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-dialog": "^2.0.0",
    "@tauri-apps/plugin-notification": "^2.0.0",
    "@tauri-apps/plugin-store": "^2.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "antd": "^5.12.0",
    "react-markdown": "^9.0.1",
    "diff": "^9.0.0",
    "react-router-dom": "^7.14.2",
    "remark-gfm": "^4.0.0",
    "rehype-raw": "^7.0.0"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.0.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "@vitejs/plugin-react": "^4.2.1"
  }
}
```

### 7.2 Rust 依赖
```toml
[dependencies]
tauri = { version = "2", features = ["devtools"] }
tauri-plugin-dialog = "2"
tauri-plugin-notification = "2"
tauri-plugin-store = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
walkdir = "2"
chrono = { version = "0.4", features = ["serde"] }
thiserror = "1"
```

## 8. 预期成果

1. 可独立运行的桌面应用（Windows/macOS/Linux）
2. 一键安装，无需手动配置环境
3. 与 Web 版功能完全一致
4. 新增工作目录选择功能
5. 原生系统集成（通知、文件对话框）