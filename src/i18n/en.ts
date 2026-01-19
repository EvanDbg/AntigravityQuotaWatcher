import { TranslationMap } from './types';

export const en: TranslationMap = {
    // Status Bar
    'status.initializing': '⏳ Initializing...',
    'status.detecting': '🔍 Detecting port...',
    'status.fetching': '$(sync~spin) Fetching quota...',
    'status.retrying': '$(sync~spin) Retrying ({current}/{max})...',
    'status.error': '$(error) Antigravity Quota Watcher: Error',
    'status.refreshing': '$(sync~spin) Refreshing...',
    'status.notLoggedIn': '$(account) Not logged in, click to login',
    'status.loggingIn': '$(sync~spin) Logging in...',
    'status.loginExpired': '$(warning) Login expired, click to re-login',
    'status.stale': '⏸️',

    // Tooltip
    'tooltip.title': '**Antigravity Model Quota**', // Markdown bold
    'tooltip.credits': '💳 Prompt Credits',
    'tooltip.available': 'Available',
    'tooltip.remaining': 'Remaining',
    'tooltip.depleted': '⚠️ **Depleted**',
    'tooltip.resetTime': 'Reset',
    'tooltip.model': 'Model',
    'tooltip.status': 'Status',
    'tooltip.error': 'Error fetching quota information.',
    'tooltip.clickToRetry': 'Click to retry',
    'tooltip.clickToLogin': 'Click to login with Google',
    'tooltip.clickToRelogin': 'Login expired, click to re-login',
    'tooltip.staleWarning': '⚠️ Data may be outdated (network issue or timeout)',

    // Notifications (vscode.window.show*Message)
    'notify.unableToDetectProcess': 'Antigravity Quota Watcher: Unable to detect the Antigravity process.',
    'notify.retry': 'Retry',
    'notify.cancel': 'Cancel',
    'notify.refreshingQuota': '🔄 Refreshing quota...',
    'notify.detectionSuccess': '✅ Detection successful! Port: {port}',
    'notify.unableToDetectPort': '❌ Unable to detect a valid port. Please ensure:',
    'notify.unableToDetectPortHint1': '1. Google account is signed in on Antigravity 2. Antigravity is running',
    'notify.unableToDetectPortHint2': '3. System has permission to run detection commands 4. Network/VPN connection is stable',
    'notify.portDetectionFailed': '❌ Port detection failed: {error}',
    'notify.configUpdated': 'Antigravity Quota Watcher config updated',
    'notify.nonAntigravityDetected': 'Non-Antigravity IDE detected. Recommended to use Google API to fetch quota.',
    'notify.switchToGoogleApi': 'Switch',
    'notify.keepLocalApi': 'Keep current',
    'notify.neverShowAgain': 'Never show again',
    'notify.portCommandRequired': 'Port detection requires lsof, ss, or netstat. Please install one of them',
    'notify.portCommandRequiredDarwin': 'Port detection requires lsof or netstat. Please install one of them',
    'notify.googleApiNoPortDetection': 'Google API method does not require port detection. Please use Google Login instead.',
    'notify.pleaseLoginFirst': 'Please login with Google first',

    // Login errors
    'login.error.serviceNotInitialized': 'Auth service not initialized',
    'login.error.authFailed': 'Authentication failed',

    // Local Token detection
    'notify.localTokenDetected': 'Detected local Antigravity login. Use this account?',
    'notify.useLocalToken': 'Use local token',
    'notify.manualLogin': 'Manual login',

    // Token sync check
    'notify.tokenChanged': 'Antigravity account changed. Sync now?',
    'notify.tokenRemoved': 'Antigravity logged out. Sync logout?',
    'notify.syncToken': 'Sync',
    'notify.keepCurrentToken': 'Keep current',
    'notify.syncLogout': 'Sync logout',
    'notify.keepLogin': 'Keep login',

    // Login success/error messages
    'login.success.google': 'Successfully logged in with Google!',
    'login.success.localToken': 'Successfully logged in with local Antigravity account!',
    'login.error.google': 'Google login failed: {error}',
    'login.error.localToken': 'Login with local token failed: {error}',
    'login.error.localTokenImport': 'Local Antigravity login not detected. Please click the status bar in the bottom right to sign in manually.',
    'logout.success': 'Logged out from Google account',

    // Dev tools
    'devTools.previewComplete': '✅ Notification preview complete',
    'devTools.stop': 'Stop',

    // Dashboard
    'dashboard.title': 'Antigravity Quota Watcher Dashboard',
    'dashboard.comingSoon': 'More features coming soon...',
    'dashboard.comingSoonHint': 'This panel will display Project ID, weekly limit detection, and more.',
    'dashboard.apiMode': 'API Mode & Account',
    'dashboard.currentMethod': 'Current Quota Fetching Method',
    'dashboard.account': 'Account',
    'dashboard.plan': 'Plan',
    'dashboard.localConnection': 'Local Connection',
    'dashboard.pollingStatus': 'Polling Status',
    'dashboard.interval': 'Interval',
    'dashboard.lastUpdate': 'Last Update',
    'dashboard.lastError': 'Last Error',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.refresh': 'Refresh Quota',
    'dashboard.detectPort': 'Detect Port',
    'dashboard.loginOAuth': 'OAuth Login',
    'dashboard.loginLocalToken': 'Local Token Login',
    'dashboard.logout': 'Logout',
    'dashboard.settings': 'Edit Config',
    'dashboard.quotaOverview': 'Quota Overview'
};
