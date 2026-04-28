# DocMan Desktop

DocMan 桌面客户端 - 文档诊断工具

## 简介

DocMan Desktop 是一个基于 Tauri 2 构建的桌面应用，用于对产品帮助文档进行智能诊断，帮助发现文档中的各种质量问题。

## 功能特性

- **18维度全面诊断** - 文档与系统一致性、语法错误、错别字、失效链接等
- **可视化诊断历史** - 完整的历史记录，支持查看每次诊断的详细信息
- **Diff 对比视图** - 原始文档与修复后文档的对比展示
- **一键生成诊断 Prompt** - 配置参数后自动生成可在 Comate 中执行的 Prompt
- **工作目录管理** - 支持选择和切换工作目录，配置自动保存

## 环境要求

- Node.js >= 18.0
- Rust >= 1.70
- 系统支持：Windows / macOS / Linux

## 安装与运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run tauri:dev
```

### 生产构建

```bash
npm run tauri:build
```

构建产物位于 `src-tauri/target/release/bundle/` 目录。

## 项目结构

```
desktop/
├── src/                        # 前端代码
│   ├── components/             # React 组件
│   ├── pages/                  # 页面组件
│   ├── services/               # API 服务层
│   └── types/                  # TypeScript 类型定义
├── src-tauri/                  # Rust 后端
│   ├── src/
│   │   ├── commands/           # Tauri 命令
│   │   ├── models/             # 数据模型
│   │   └── services/           # 业务服务
│   └── tauri.conf.json         # Tauri 配置
├── package.json
└── vite.config.ts
```

## 使用流程

1. **启动应用** - 首次启动会弹出工作目录选择对话框
2. **选择工作目录** - 选择包含 `raw/` 目录的工作空间
3. **选择文档** - 在左侧文档树中选择需要诊断的文档
4. **生成诊断 Prompt** - 配置参数后生成 Prompt
5. **执行诊断** - 在 Comate 中执行生成的 Prompt
6. **查看结果** - 刷新后查看诊断报告和修复后文档

## 工作目录结构

```
workspace/
├── raw/           # 原始文档目录
├── new/           # 修复后的文档
├── report/        # 诊断报告
├── timeline/      # 诊断过程记录
└── screenshots/   # 诊断截图
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Ant Design 5 + Vite 5 |
| 后端 | Rust + Tauri 2 |
| 插件 | dialog, notification, store |

## 开发说明

### 前端开发

前端代码位于 `src/` 目录，使用 React + TypeScript 开发。API 调用通过 `@tauri-apps/api/core` 的 `invoke` 函数与 Rust 后端通信。

```typescript
import { invoke } from '@tauri-apps/api/core';

// 调用后端命令
const docTree = await invoke('get_doc_tree');
```

### 后端开发

Rust 后端代码位于 `src-tauri/src/` 目录。Tauri 命令使用 `#[tauri::command]` 宏定义。

```rust
#[tauri::command]
pub async fn get_doc_tree(work_dir: State<WorkDirState>) -> Result<Vec<DocNode>, String> {
    file_service::build_doc_tree(&work_dir)
}
```

## 与 Web 版的区别

| 特性 | Web 版 | Desktop 版 |
|------|--------|-----------|
| 后端服务 | Node.js + Express | Rust + Tauri |
| 启动方式 | 需分别启动前后端 | 单应用启动 |
| URL 路由 | react-router-dom | 无（状态管理） |
| 文件访问 | HTTP API | 本地文件系统 |
| 配置存储 | 无 | tauri-plugin-store |

## 许可证

MIT