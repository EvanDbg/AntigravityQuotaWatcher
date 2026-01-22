/**
 * 代理服务 - 提供代理配置管理和 HTTPS Agent 创建
 * 
 * 职责：
 * - 存储代理配置 (enabled, autoDetect, url)
 * - 检测系统代理 (读取环境变量 HTTPS_PROXY, HTTP_PROXY)
 * - 提供 https.Agent 给网络请求使用
 * - 监听代理配置变更
 */

import * as https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import * as vscode from 'vscode';
import { ProxyConfig } from './types';
import { logger } from './logger';

/**
 * 代理服务 - 单例模式
 */
export class ProxyService {
    private static instance: ProxyService;
    private config: ProxyConfig = {
        enabled: false,
        autoDetect: true,
        url: ''
    };
    private cachedAgent: https.Agent | undefined;
    private disposables: vscode.Disposable[] = [];

    private constructor() { }

    /**
     * 获取单例实例
     */
    public static getInstance(): ProxyService {
        if (!ProxyService.instance) {
            ProxyService.instance = new ProxyService();
        }
        return ProxyService.instance;
    }

    /**
     * 初始化服务，加载配置并监听变更
     */
    public initialize(): void {
        this.loadConfig();
        this.watchConfigChanges();
        logger.info('ProxyService', `Initialized: enabled=${this.config.enabled}, autoDetect=${this.config.autoDetect}, url=${this.config.url || '(empty)'}`);
    }

    /**
     * 从 VSCode 配置中加载代理配置
     */
    private loadConfig(): void {
        const vscodeConfig = vscode.workspace.getConfiguration('antigravityQuotaWatcher');
        this.config = {
            enabled: vscodeConfig.get<boolean>('proxyEnabled', false),
            autoDetect: vscodeConfig.get<boolean>('proxyAutoDetect', true),
            url: vscodeConfig.get<string>('proxyUrl', '')
        };
        // 清除缓存的 Agent
        this.cachedAgent = undefined;
    }

    /**
     * 监听配置变更
     */
    private watchConfigChanges(): void {
        const disposable = vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('antigravityQuotaWatcher.proxyEnabled') ||
                event.affectsConfiguration('antigravityQuotaWatcher.proxyAutoDetect') ||
                event.affectsConfiguration('antigravityQuotaWatcher.proxyUrl')) {
                logger.info('ProxyService', 'Proxy configuration changed, reloading...');
                this.loadConfig();
            }
        });
        this.disposables.push(disposable);
    }

    /**
     * 获取当前代理配置
     */
    public getConfig(): ProxyConfig {
        return { ...this.config };
    }

    /**
     * 检测系统代理
     * 优先读取环境变量 HTTPS_PROXY / HTTP_PROXY
     * 
     * @returns 检测到的代理 URL，如果没有检测到返回 undefined
     */
    public detectSystemProxy(): string | undefined {
        // 优先检测 HTTPS_PROXY
        const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;
        if (httpsProxy) {
            logger.info('ProxyService', `Detected system proxy from HTTPS_PROXY: ${httpsProxy}`);
            return httpsProxy;
        }

        // 其次检测 HTTP_PROXY
        const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy;
        if (httpProxy) {
            logger.info('ProxyService', `Detected system proxy from HTTP_PROXY: ${httpProxy}`);
            return httpProxy;
        }

        // 检测 ALL_PROXY (通用代理)
        const allProxy = process.env.ALL_PROXY || process.env.all_proxy;
        if (allProxy) {
            logger.info('ProxyService', `Detected system proxy from ALL_PROXY: ${allProxy}`);
            return allProxy;
        }

        logger.debug('ProxyService', 'No system proxy detected from environment variables');
        return undefined;
    }

    /**
     * 获取有效的代理 URL
     * 如果开启了自动检测，会尝试检测系统代理
     * 
     * @returns 代理 URL，如果没有代理返回 undefined
     */
    public getEffectiveProxyUrl(): string | undefined {
        if (!this.config.enabled) {
            return undefined;
        }

        // 如果手动配置了代理 URL，优先使用
        if (this.config.url && this.config.url.trim() !== '') {
            return this.config.url.trim();
        }

        // 如果开启了自动检测，尝试检测系统代理
        if (this.config.autoDetect) {
            return this.detectSystemProxy();
        }

        return undefined;
    }

    /**
     * 获取 HTTPS Agent
     * 如果代理未启用或无有效代理 URL，返回 undefined
     * 
     * @returns https.Agent 或 undefined
     */
    public getHttpsAgent(): https.Agent | undefined {
        const proxyUrl = this.getEffectiveProxyUrl();

        if (!proxyUrl) {
            logger.debug('ProxyService', 'No proxy URL, returning undefined agent');
            return undefined;
        }

        // 如果代理 URL 没变，返回缓存的 Agent
        if (this.cachedAgent && (this.cachedAgent as any)._proxyUrl === proxyUrl) {
            return this.cachedAgent;
        }

        try {
            logger.info('ProxyService', `Creating proxy agent for: ${proxyUrl}`);
            const agent = new HttpsProxyAgent(proxyUrl);
            // 标记代理 URL 用于缓存判断
            (agent as any)._proxyUrl = proxyUrl;
            this.cachedAgent = agent;
            return agent;
        } catch (error: any) {
            logger.error('ProxyService', `Failed to create proxy agent: ${error.message}`);
            return undefined;
        }
    }

    /**
     * 测试代理连接
     * 通过访问 Google API 测试代理是否可用
     * 
     * @returns Promise<boolean> 代理是否可用
     */
    public async testProxyConnection(): Promise<{ success: boolean; message: string }> {
        const proxyUrl = this.getEffectiveProxyUrl();

        if (!proxyUrl) {
            return { success: false, message: '未配置代理或代理未启用' };
        }

        return new Promise((resolve) => {
            const agent = this.getHttpsAgent();
            if (!agent) {
                resolve({ success: false, message: '创建代理 Agent 失败' });
                return;
            }

            const options: https.RequestOptions = {
                hostname: 'www.googleapis.com',
                port: 443,
                path: '/oauth2/v2/tokeninfo?access_token=test',
                method: 'GET',
                agent: agent,
                timeout: 10000
            };

            const req = https.request(options, (res) => {
                // 只要能收到响应（即使是错误响应），说明代理连接正常
                logger.info('ProxyService', `Proxy test response: ${res.statusCode}`);
                resolve({
                    success: true,
                    message: `代理连接成功 (HTTP ${res.statusCode})`
                });
            });

            req.on('error', (error) => {
                logger.error('ProxyService', `Proxy test failed: ${error.message}`);
                resolve({
                    success: false,
                    message: `代理连接失败: ${error.message}`
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    success: false,
                    message: '代理连接超时'
                });
            });

            req.end();
        });
    }

    /**
     * 判断请求是否应该绕过代理
     * localhost 和 127.0.0.1 的请求应该绕过代理
     * 
     * @param hostname 目标主机名
     * @returns 是否应该绕过代理
     */
    public shouldBypassProxy(hostname: string): boolean {
        const host = hostname.toLowerCase();
        return host === 'localhost' ||
            host === '127.0.0.1' ||
            host === '::1' ||
            host.endsWith('.local');
    }

    /**
     * 获取请求的 Agent，自动判断是否应该使用代理
     * 
     * @param hostname 目标主机名
     * @returns https.Agent 或 undefined
     */
    public getAgentForHost(hostname: string): https.Agent | undefined {
        if (this.shouldBypassProxy(hostname)) {
            logger.debug('ProxyService', `Bypassing proxy for local host: ${hostname}`);
            return undefined;
        }
        return this.getHttpsAgent();
    }

    /**
     * 释放资源
     */
    public dispose(): void {
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
        this.cachedAgent = undefined;
    }
}
