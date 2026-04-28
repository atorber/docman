# Tauri 桌面客户端开发任务计划

## 任务概览

将 web + backend 现有功能迁移到 Tauri 桌面客户端，包含 11 个主要任务。

---

- [x] Task 1: 初始化 Tauri 项目结构
    - 1.1: 创建 desktop 目录结构
    - 1.2: 初始化前端项目 (package.json, vite.config.ts, index.html)
    - 1.3: 初始化 Tauri Rust 项目 (Cargo.toml, tauri.conf.json)
    - 1.4: 配置应用图标和基本信息

- [x] Task 2: 定义 Rust 数据模型
    - 2.1: 创建 models/mod.rs 和 models/types.rs
    - 2.2: 定义 DocNode 结构体
    - 2.3: 定义 DiagnoseRecord, TimelineData 结构体
    - 2.4: 定义 GeneratePromptRequest/Response 结构体
    - 2.5: 定义 DiagnoseDimension 结构体

- [x] Task 3: 实现文件服务 (file_service.rs)
    - 3.1: 实现工作目录管理 (get/set work directory)
    - 3.2: 实现 build_doc_tree 文档树构建
    - 3.3: 实现 read_document 文档读取
    - 3.4: 实现诊断历史查询 (get_diagnose_history)
    - 3.5: 实现 timeline/report/fixed-doc 读取
    - 3.6: 实现 write_fixed_doc 保存修复文档

- [x] Task 4: 实现 Prompt 服务 (prompt_service.rs)
    - 4.1: 实现 generate_prompt 函数
    - 4.2: 实现 get_dimensions 维度列表

- [x] Task 5: 实现 Tauri 命令层
    - 5.1: 创建 commands/mod.rs
    - 5.2: 实现 document.rs 命令 (get_doc_tree, get_document_content)
    - 5.3: 实现 diagnose.rs 命令 (get_history, get_timeline, get_report, get_fixed_doc, save_fixed_doc)
    - 5.4: 实现 prompt.rs 命令 (generate_prompt, get_dimensions)
    - 5.5: 在 lib.rs 中注册所有命令

- [x] Task 6: 复用前端组件代码
    - 6.1: 复制 web/src/components 到 desktop/src/components
    - 6.2: 复制 web/src/types 到 desktop/src/types
    - 6.3: 复制 web/src/index.css 到 desktop/src/index.css

- [x] Task 7: 改造前端 API 层
    - 7.1: 创建 desktop/src/services/api.ts
    - 7.2: 将所有 fetch 调用改为 Tauri invoke
    - 7.3: 添加错误处理和类型转换

- [x] Task 8: 改造主页面组件
    - 8.1: 复制 Home.tsx 并移除 URL 相关逻辑
    - 8.2: 移除 react-router-dom 依赖，改为状态管理
    - 8.3: 简化 App.tsx 路由配置

- [x] Task 9: 添加工作目录选择功能
    - 9.1: 创建 WorkDirSelector 组件
    - 9.2: 实现首次启动检测和目录选择
    - 9.3: 添加 Rust 端的工作目录管理命令
    - 9.4: 使用 tauri-plugin-store 持久化配置

- [x] Task 10: 配置 Tauri 插件和权限
    - 10.1: 配置 tauri-plugin-dialog
    - 10.2: 配置 tauri-plugin-notification
    - 10.3: 配置 tauri-plugin-store
    - 10.4: 配置 tauri.conf.json 权限和窗口设置

- [x] Task 11: 测试和构建验证
    - 11.1: 验证开发模式运行 (npm run tauri dev)
    - 11.2: 验证生产构建 (npm run tauri build)
    - 11.3: 功能测试：文档浏览、诊断历史、Prompt生成
    - 11.4: 修复发现的问题
