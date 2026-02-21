# ADR-001: 技术栈选择

**日期**: 2025 (项目创建)
**状态**: 已采纳

## 上下文

Antigravity Quota Watcher 作为 Antigravity IDE (VS Code Fork) 的扩展插件，需要选择合适的技术栈来实现配额监控功能，同时保持对多平台和多 IDE 的兼容性。

## 决策

| 维度 | 选择 | 备选 | 理由 |
|------|------|------|------|
| **语言** | TypeScript 5.3+ | JavaScript | 类型安全，更好的 IDE 支持和代码可维护性 |
| **运行时** | Node.js (VS Code Extension Host) | — | VS Code 扩展标准运行时，无其他选择 |
| **扩展 API** | VS Code Extension API ^1.85.0 | — | 目标平台的标准 API |
| **构建工具** | tsc (TypeScript Compiler) | webpack, esbuild | 项目结构简单，直接编译即可，无需打包器 |
| **代码规范** | ESLint + @typescript-eslint | Prettier | 强制类型检查和代码风格统一 |
| **HTTP 客户端** | Node.js 内置 https | axios, node-fetch | 减少依赖，内置模块足够使用 |
| **代理支持** | https-proxy-agent ^7.0.6 | 无代理 | 支持在代理环境下正常工作 |
| **数据库读取** | sql.js ^1.10.2 | better-sqlite3 | 纯 JS SQLite 实现，跨平台无需编译原生模块 |
| **国际化** | 自定义 i18n (TypeScript) | i18next, vscode-nls | 轻量实现，仅需 中文/英文 两种语言 |
| **包管理** | npm | yarn, pnpm | VS Code 扩展生态标准选择 |
| **发布工具** | vsce | — | VS Code 扩展标准打包发布工具 |

## 后果

### 正面
- TypeScript 提供了强类型保证，减少运行时错误
- sql.js 作为纯 JS 实现，避免了跨平台编译问题 (Windows ARM64 除外)
- 极少的外部依赖 (仅 3 个 production 依赖)，减小插件体积
- 自定义 i18n 方案简单灵活，易于维护

### 负面
- 未使用打包器 (webpack/esbuild) 可能导致输出文件较多
- 自定义 i18n 方案不支持复杂的多语言场景 (如复数形式等)
- 不支持 Windows ARM64 平台

## 相关需求
- [REQ-060] ~ [REQ-063]: 平台兼容性需求
- [REQ-050] ~ [REQ-052]: 国际化需求
