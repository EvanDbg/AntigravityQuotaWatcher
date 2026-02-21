# 架构概览 - Antigravity Quota Watcher

## 1. 系统全景图

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        Antigravity Quota Watcher                        │
│                         VS Code Extension (v1.0.2)                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Extension   │  │  StatusBar   │  │  Dashboard   │  │  DevTools    │  │
│  │  (入口点)    │──│  (状态栏)    │  │  (Webview)   │  │  (调试)      │  │
│  └──────┬───────┘  └──────────────┘  └──────┬───────┘  └──────────────┘  │
│         │                                    │                            │
│  ┌──────┴───────────────────────────────────┴──────────────────────────┐  │
│  │                         QuotaService (配额服务)                     │  │
│  │   ┌──────────────────┐  ┌──────────────────────────┐               │  │
│  │   │ AntigravityClient│  │ GoogleCloudCodeClient     │               │  │
│  │   │ (本地端口方式)    │  │ (Google API 方式)         │               │  │
│  │   └────────┬─────────┘  └────────────┬─────────────┘               │  │
│  │            │                          │                              │  │
│  │   ┌────────┴──────────┐  ┌───────────┴─────────────┐               │  │
│  │   │PortDetection      │  │ Auth Module              │               │  │
│  │   │  ProcessDetectors │  │  GoogleAuth / TokenSync  │               │  │
│  │   └───────────────────┘  └─────────────────────────┘               │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────┐  ┌────────────────┐  ┌──────────────┐                 │
│  │ ProxyService  │  │ ConfigService  │  │ i18n Module   │                │
│  │ (代理管理)    │  │ (配置管理)     │  │ (国际化)      │                │
│  └───────────────┘  └────────────────┘  └──────────────┘                 │
│                                                                          │
│  ┌───────────────┐  ┌────────────────┐  ┌──────────────┐                 │
│  │ Logger        │  │ PlatformDetect │  │ VersionInfo  │                │
│  │ (日志服务)    │  │ (平台检测)     │  │ (版本信息)   │                │
│  └───────────────┘  └────────────────┘  └──────────────┘                 │
└──────────────────────────────────────────────────────────────────────────┘
          │                        │                       │
          ▼                        ▼                       ▼
┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────┐
│ Antigravity IDE │  │ Google Cloud API │  │ 本地文件系统          │
│ 本地服务端口     │  │ (配额查询)       │  │ (Token/DB 存储)      │
└─────────────────┘  └──────────────────┘  └─────────────────────┘
```

---

## 2. 系统定义

### SYS-001: 扩展入口 (Extension Entry)
| 属性 | 值 |
|------|-----|
| **ID** | SYS-001 |
| **职责** | 插件生命周期管理、命令注册、各模块初始化和编排 |
| **源码目录** | `src/extension.ts` |
| **技术栈** | TypeScript, VS Code Extension API |
| **架构模式** | 入口协调器 (Coordinator) |

### SYS-002: API 客户端 (API Clients)
| 属性 | 值 |
|------|-----|
| **ID** | SYS-002 |
| **职责** | 与不同后端接口通信，获取配额数据 |
| **源码目录** | `src/api/` |
| **技术栈** | TypeScript, Node.js HTTPS, HTTPS Proxy Agent |
| **架构模式** | 策略模式 (Strategy)，支持 GET_USER_STATUS / GOOGLE_API 两种方式切换 |

**核心组件:**
| 组件 | 文件 | 职责 |
|------|------|------|
| AntigravityClient | `antigravityClient.ts` | 通过本地 Antigravity 服务端口获取配额 |
| GoogleCloudCodeClient | `googleCloudCodeClient.ts` | 通过 Google Cloud Code API 获取配额 |
| WeeklyLimitChecker | `weeklyLimitChecker.ts` | 周配额限制检测，发送测试请求判断限制状态 |

### SYS-003: 认证模块 (Auth Module)
| 属性 | 值 |
|------|-----|
| **ID** | SYS-003 |
| **职责** | Google OAuth 认证、Token 管理、本地登录状态同步 |
| **源码目录** | `src/auth/` |
| **技术栈** | TypeScript, OAuth 2.0, sql.js (SQLite) |
| **架构模式** | 服务层模式 |

**核心组件:**
| 组件 | 文件 | 职责 |
|------|------|------|
| GoogleAuthService | `googleAuthService.ts` | Google OAuth 认证流程管理 |
| CallbackServer | `callbackServer.ts` | OAuth 回调本地服务器 |
| TokenStorage | `tokenStorage.ts` | Token 的安全存储 |
| TokenSyncChecker | `tokenSyncChecker.ts` | 本地 IDE 登录状态同步检查 |
| AntigravityTokenExtractor | `antigravityTokenExtractor.ts` | 从 Antigravity 本地数据库提取 Token |
| Constants | `constants.ts` | 认证相关常量 |

### SYS-004: 配额服务 (Quota Service)
| 属性 | 值 |
|------|-----|
| **ID** | SYS-004 |
| **职责** | 配额数据汇总、轮询调度、数据转换 |
| **源码目录** | `src/quotaService.ts` |
| **技术栈** | TypeScript |
| **架构模式** | 服务层 + 调度器 |

### SYS-005: 状态栏模块 (Status Bar)
| 属性 | 值 |
|------|-----|
| **ID** | SYS-005 |
| **职责** | 状态栏 UI 渲染、多种显示模式、Tooltip 生成 |
| **源码目录** | `src/statusBar.ts` |
| **技术栈** | TypeScript, VS Code StatusBarItem API |
| **架构模式** | 视图层 (View) |

### SYS-006: Dashboard 面板 (Webview Panel)
| 属性 | 值 |
|------|-----|
| **ID** | SYS-006 |
| **职责** | Dashboard Web 界面渲染、用户交互处理 |
| **源码目录** | `src/webviewPanel.ts` |
| **技术栈** | TypeScript, VS Code Webview API, HTML/CSS/JS |
| **架构模式** | Webview MVC |

### SYS-007: 端口检测 (Port Detection)
| 属性 | 值 |
|------|-----|
| **ID** | SYS-007 |
| **职责** | 自动检测 Antigravity 服务的本地监听端口 |
| **源码目录** | `src/portDetectionService.ts`, `src/processPortDetector.ts`, `src/unixProcessDetector.ts`, `src/windowsProcessDetector.ts` |
| **技术栈** | TypeScript, 系统命令 (lsof/netstat/ss/PowerShell) |
| **架构模式** | 平台策略模式 |

### SYS-008: 基础设施 (Infrastructure)
| 属性 | 值 |
|------|-----|
| **ID** | SYS-008 |
| **职责** | 日志、代理、配置、平台检测、国际化等横切关注点 |
| **源码目录** | `src/logger.ts`, `src/proxyService.ts`, `src/configService.ts`, `src/platformDetector.ts`, `src/i18n/`, `src/versionInfo.ts`, `src/types.ts` |
| **技术栈** | TypeScript |
| **架构模式** | 工具层 |

---

## 3. 核心组件汇总

| 组件 | 源码文件 | 行数(估) | 系统 | 说明 |
|------|----------|----------|------|------|
| Extension | `extension.ts` | ~1200 | SYS-001 | 插件入口，最大单文件 |
| QuotaService | `quotaService.ts` | ~700 | SYS-004 | 配额业务核心 |
| WebviewPanel | `webviewPanel.ts` | ~700 | SYS-006 | Dashboard UI |
| GoogleAuthService | `auth/googleAuthService.ts` | ~600 | SYS-003 | OAuth 流程 |
| GoogleCloudCodeClient | `api/googleCloudCodeClient.ts` | ~400 | SYS-002 | Google API 客户端 |
| WeeklyLimitChecker | `api/weeklyLimitChecker.ts` | ~600 | SYS-002 | 周限检测 |
| StatusBar | `statusBar.ts` | ~500 | SYS-005 | 状态栏渲染 |
| ProxyService | `proxyService.ts` | ~400 | SYS-008 | 代理管理 |
| TokenSyncChecker | `auth/tokenSyncChecker.ts` | ~400 | SYS-003 | Token 同步 |

---

## 4. 系统间通信

```
Extension ──(初始化)──→ QuotaService ──(调用)──→ API Clients
    │                        │                        │
    │                        │                        ├──→ AntigravityClient ──→ 本地端口
    │                        │                        └──→ GoogleCloudCodeClient ──→ Google API
    │                        │
    ├──(更新)──→ StatusBar ←─(数据)─── QuotaService
    │
    ├──(创建)──→ WebviewPanel ←─(消息)──→ Extension (postMessage)
    │
    ├──(使用)──→ Auth Module ──→ TokenStorage
    │                          ──→ TokenSyncChecker
    │
    └──(使用)──→ ProxyService ──→ ConfigService
```

**通信协议:**
- Extension ↔ Webview: VS Code `postMessage` / `onDidReceiveMessage` API
- Extension → API: Node.js HTTPS 请求
- Extension → 系统: 命令行子进程 (端口检测)
- Auth Module → 本地存储: VS Code `globalState` + 文件系统 (SQLite)

---

## 5. 项目目录结构

```
AntigravityQuotaWatcher/
├── .agent/                    # AI 工作流框架
│   ├── rules/agents.md        # AI 锚点文件
│   ├── workflows/             # 8 个工作流
│   └── skills/                # 11 个可复用技能
├── genesis/                   # 版本化架构文档
│   └── v1/                    # 当前版本
├── src/                       # 源代码
│   ├── api/                   # API 客户端
│   │   ├── antigravityClient.ts
│   │   ├── googleCloudCodeClient.ts
│   │   ├── weeklyLimitChecker.ts
│   │   └── index.ts
│   ├── auth/                  # 认证模块
│   │   ├── googleAuthService.ts
│   │   ├── callbackServer.ts
│   │   ├── tokenStorage.ts
│   │   ├── tokenSyncChecker.ts
│   │   ├── antigravityTokenExtractor.ts
│   │   ├── constants.ts
│   │   └── index.ts
│   ├── i18n/                  # 国际化
│   │   ├── en.ts
│   │   ├── zh-cn.ts
│   │   ├── localizationService.ts
│   │   └── types.ts
│   ├── utils/                 # 工具函数
│   ├── extension.ts           # 插件入口
│   ├── quotaService.ts        # 配额服务
│   ├── statusBar.ts           # 状态栏
│   ├── webviewPanel.ts        # Dashboard
│   ├── proxyService.ts        # 代理服务
│   ├── configService.ts       # 配置服务
│   ├── platformDetector.ts    # 平台检测
│   ├── portDetectionService.ts # 端口检测服务
│   ├── processPortDetector.ts # 进程端口检测
│   ├── unixProcessDetector.ts # Unix 进程检测
│   ├── windowsProcessDetector.ts # Windows 进程检测
│   ├── logger.ts              # 日志服务
│   ├── versionInfo.ts         # 版本信息
│   ├── devTools.ts            # 开发工具
│   └── types.ts               # 类型定义
├── images/                    # 图片资源
├── llmdoc/                    # LLM 相关文档
├── package.json               # 插件配置清单
├── tsconfig.json              # TypeScript 配置
├── build.sh / build.ps1       # 构建脚本
├── README.md / README.en.md   # 项目说明
├── CONFIG.md / CONFIG.en.md   # 配置说明
└── RELEASE_v1.0.0.md          # 发布说明
```
