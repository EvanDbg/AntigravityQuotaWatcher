# 任务清单 - Genesis v1

## Phase 0: 基础架构 ✅

| ID | 任务 | 状态 | 工时 | 说明 |
|----|------|------|------|------|
| TASK-001 | 插件脚手架搭建 | [x] | 2h | package.json, tsconfig, eslint 配置 |
| TASK-002 | 日志系统实现 | [x] | 2h | 分级日志 (ERROR/WARNING/INFO/DEBUG) |
| TASK-003 | 配置服务实现 | [x] | 1h | VS Code 配置项读取封装 |
| TASK-004 | 平台检测器 | [x] | 2h | Windows/macOS/Linux 平台判断 |
| TASK-005 | 类型定义 | [x] | 1h | 核心数据类型接口定义 |
| TASK-006 | 国际化框架 | [x] | 3h | 中英文双语支持，自动/手动切换 |

## Phase 1: 核心功能 ✅

| ID | 任务 | 状态 | 工时 | 说明 |
|----|------|------|------|------|
| TASK-010 | 端口检测 - Unix | [x] | 4h | lsof/netstat/ss 多策略检测 |
| TASK-011 | 端口检测 - Windows | [x] | 4h | netstat/PowerShell 检测 |
| TASK-012 | 端口检测服务 | [x] | 2h | 统一端口检测协调层 |
| TASK-013 | Antigravity 本地 API 客户端 | [x] | 3h | GET_USER_STATUS 方式实现 |
| TASK-014 | 配额服务核心 | [x] | 6h | 配额轮询、数据转换、状态管理 |
| TASK-015 | 状态栏实现 | [x] | 4h | 三种显示模式、颜色预警、Tooltip |

## Phase 2: Google API 集成 ✅

| ID | 任务 | 状态 | 工时 | 说明 |
|----|------|------|------|------|
| TASK-020 | Google OAuth 服务 | [x] | 6h | OAuth 2.0 完整流程 |
| TASK-021 | 本地回调服务器 | [x] | 3h | OAuth 回调接收 |
| TASK-022 | Token 存储管理 | [x] | 2h | globalState + 安全存储 |
| TASK-023 | Google Cloud Code 客户端 | [x] | 5h | 通过 Google API 获取配额 |
| TASK-024 | Token 同步检查器 | [x] | 4h | 自动检测本地 IDE 登录状态 |
| TASK-025 | Antigravity Token 提取器 | [x] | 3h | 从本地 SQLite 数据库提取 Token |

## Phase 3: Dashboard & 高级功能 ✅

| ID | 任务 | 状态 | 工时 | 说明 |
|----|------|------|------|------|
| TASK-030 | Webview Dashboard | [x] | 8h | 配额概览、连接状态、账号信息 |
| TASK-031 | 代理服务 | [x] | 4h | IDE 代理继承、独立代理、环境变量代理 |
| TASK-032 | 周限检测 | [x] | 5h | 三模型池周限判断逻辑 |
| TASK-033 | 版本信息 | [x] | 2h | 版本检查、更新提示 |
| TASK-034 | 开发调试工具 | [x] | 2h | 预览通知/状态栏/Tooltip |

## Phase 4: 发布与维护 ✅

| ID | 任务 | 状态 | 工时 | 说明 |
|----|------|------|------|------|
| TASK-040 | 构建脚本 | [x] | 2h | build.sh / build.ps1 |
| TASK-041 | 发布到插件市场 | [x] | 1h | OpenVSX 发布 |
| TASK-042 | 文档编写 | [x] | 3h | README (中/英)、CONFIG (中/英) |

## Phase 5: 待规划任务 🔲

| ID | 任务 | 状态 | 工时 | 说明 |
|----|------|------|------|------|
| TASK-050 | extension.ts 拆分重构 | [ ] | 8h | 入口文件过大 (~1200行)，需拆分为独立模块 |
| TASK-051 | 单元测试 | [ ] | 8h | 核心模块单元测试覆盖 |
| TASK-052 | webpack/esbuild 打包 | [ ] | 4h | 减小扩展体积、加快加载速度 |
| TASK-053 | Windows ARM64 支持 | [ ] | 4h | 解决 sql.js 在 ARM64 上的兼容性 |

---

## 统计

| 阶段 | 任务数 | 已完成 | 未完成 | 预估总工时 |
|------|--------|--------|--------|-----------|
| Phase 0 | 6 | 6 | 0 | 11h |
| Phase 1 | 6 | 6 | 0 | 23h |
| Phase 2 | 6 | 6 | 0 | 23h |
| Phase 3 | 5 | 5 | 0 | 21h |
| Phase 4 | 3 | 3 | 0 | 6h |
| Phase 5 | 4 | 0 | 4 | 24h |
| **合计** | **30** | **26** | **4** | **108h** |
