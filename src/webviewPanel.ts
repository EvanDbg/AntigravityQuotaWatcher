/**
 * WebView Panel - Dashboard for additional features
 * 
 * This panel will provide:
 * - Project ID display
 * - Weekly limit detection
 * - And more features to be added...
 */

import * as vscode from 'vscode';
import { LocalizationService } from './i18n/localizationService';
import { logger } from './logger';

export class WebviewPanelService {
    public static currentPanel: WebviewPanelService | undefined;
    private readonly panel: vscode.WebviewPanel;
    private readonly extensionUri: vscode.Uri;
    private disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.panel = panel;
        this.extensionUri = extensionUri;

        // Set the webview's initial html content
        this.updateContent();

        // Listen for when the panel is disposed
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        // Handle messages from the webview
        this.panel.webview.onDidReceiveMessage(
            (message) => {
                this.handleMessage(message);
            },
            null,
            this.disposables
        );
    }

    /**
     * Create or show the webview panel
     */
    public static createOrShow(extensionUri: vscode.Uri): void {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it
        if (WebviewPanelService.currentPanel) {
            WebviewPanelService.currentPanel.panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel
        const localizationService = LocalizationService.getInstance();
        const panel = vscode.window.createWebviewPanel(
            'antigravityDashboard',
            localizationService.t('dashboard.title'),
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [extensionUri]
            }
        );

        WebviewPanelService.currentPanel = new WebviewPanelService(panel, extensionUri);
        logger.info('WebviewPanel', 'Dashboard panel created');
    }

    /**
     * Update the webview content
     */
    private updateContent(): void {
        this.panel.webview.html = this.getHtmlContent();
    }

    /**
     * Handle messages from the webview
     */
    private handleMessage(message: any): void {
        logger.debug('WebviewPanel', 'Received message:', message);

        switch (message.command) {
            case 'refresh':
                // TODO: Handle refresh command
                break;
            default:
                logger.warn('WebviewPanel', 'Unknown message command:', message.command);
        }
    }

    /**
     * Generate the HTML content for the webview
     */
    private getHtmlContent(): string {
        const localizationService = LocalizationService.getInstance();
        const nonce = this.getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <title>${localizationService.t('dashboard.title')}</title>
    <style>
        :root {
            --vscode-font-family: var(--vscode-editor-font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            min-height: 100vh;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--vscode-widget-border, #454545);
        }
        
        .header-icon {
            font-size: 32px;
        }
        
        .header-title {
            font-size: 24px;
            font-weight: 600;
            color: var(--vscode-foreground);
        }
        
        .placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
            background-color: var(--vscode-editor-inactiveSelectionBackground, rgba(255,255,255,0.05));
            border-radius: 8px;
            border: 1px dashed var(--vscode-widget-border, #454545);
        }
        
        .placeholder-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.6;
        }
        
        .placeholder-text {
            font-size: 16px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
        }
        
        .placeholder-hint {
            font-size: 13px;
            color: var(--vscode-descriptionForeground);
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="header-icon">📊</span>
            <h1 class="header-title">${localizationService.t('dashboard.title')}</h1>
        </div>
        
        <div class="placeholder">
            <span class="placeholder-icon">🚧</span>
            <p class="placeholder-text">${localizationService.t('dashboard.comingSoon')}</p>
            <p class="placeholder-hint">${localizationService.t('dashboard.comingSoonHint')}</p>
        </div>
    </div>
    
    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        
        // Message handler for communication with extension
        window.addEventListener('message', event => {
            const message = event.data;
            // Handle messages from extension
            console.log('Received message from extension:', message);
        });
        
        // Example: Send a message to extension
        // vscode.postMessage({ command: 'refresh' });
    </script>
</body>
</html>`;
    }

    /**
     * Generate a nonce for Content Security Policy
     */
    private getNonce(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
     * Send a message to the webview
     */
    public postMessage(message: any): void {
        this.panel.webview.postMessage(message);
    }

    /**
     * Dispose the panel
     */
    public dispose(): void {
        WebviewPanelService.currentPanel = undefined;

        // Clean up resources
        this.panel.dispose();

        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }

        logger.info('WebviewPanel', 'Dashboard panel disposed');
    }
}
