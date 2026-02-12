import React, { useState, useEffect } from "react";
import 'antd/dist/reset.css';
import GlobalStyles from './styles/GlobalStyles';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConfigProvider, theme, message } from 'antd';
import { ThemeProvider } from 'styled-components';
import { LocaleProvider } from './contexts/LocaleContext';
import { Helmet } from 'react-helmet';
import SeedanceVideoPage from './pages/SeedanceVideoPage';
import brandConfig from './config/brand';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';
import PrivacyPreferencesPage from './pages/PrivacyPreferences';
import BillingPage from './pages/Billing';
import OrdersPage from './pages/Orders';
import WorksPage from './pages/Works';
import NotificationsPage from './pages/Notifications';
import InvitePage from './pages/Invite';
import FeedbackPage from './pages/Feedback';
import HelpPage from './pages/Help';
import PrivacyPolicyPage from './pages/PrivacyPolicy';
import TermsOfServicePage from './pages/TermsOfService';
import RechargePage from './pages/Recharge';
import RechargeAgreementPage from './pages/RechargeAgreement';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import GoogleCallback from './pages/GoogleCallback';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import jaJP from 'antd/locale/ja_JP';
import koKR from 'antd/locale/ko_KR';

// 语言配置映射
const localeMap = {
  zh_CN: zhCN,
  en_US: enUS,
  ja_JP: jaJP,
  ko_KR: koKR,
};

// 路由守卫组件
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// 百度统计路由跟踪组件
const BaiduAnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // 确保百度统计已加载
    if (typeof window !== 'undefined' && window._hmt) {
      // 跟踪页面浏览
      window._hmt.push(['_trackPageview', location.pathname + location.search]);
    }
  }, [location]);

  return null;
};

export default function App() {
  const [isDark, setIsDark] = React.useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });
  
  const [isThemeLoaded, setIsThemeLoaded] = React.useState(false);
  const [locale, setLocale] = useState('zh_CN');

  // 设置 message 全局配置
  message.config({
    top: 60,
    duration: 2,
    maxCount: 3,
  });

  const themeConfig = React.useMemo(() => ({
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      // 主色调
      colorPrimary: '#3b82f6',
      colorPrimaryBg: isDark ? '#1d2b53' : '#eff6ff',
      colorPrimaryBgHover: isDark ? '#1e3a8a' : '#dbeafe',
      colorPrimaryBorder: isDark ? '#2563eb' : '#93c5fd',
      colorPrimaryHover: isDark ? '#60a5fa' : '#2563eb',
      colorPrimaryActive: isDark ? '#3b82f6' : '#1d4ed8',
      colorPrimaryTextHover: isDark ? '#60a5fa' : '#2563eb',
      colorPrimaryText: isDark ? '#3b82f6' : '#1d4ed8',
      colorPrimaryTextActive: isDark ? '#2563eb' : '#1e40af',

      // 成功色
      colorSuccess: '#10b981',
      colorSuccessBg: isDark ? '#064e3b' : '#ecfdf5',
      colorSuccessBorder: isDark ? '#059669' : '#6ee7b7',
      colorSuccessHover: isDark ? '#34d399' : '#059669',
      colorSuccessActive: isDark ? '#10b981' : '#047857',
      colorSuccessText: isDark ? '#10b981' : '#047857',
      colorSuccessTextHover: isDark ? '#34d399' : '#059669',
      colorSuccessTextActive: isDark ? '#059669' : '#065f46',

      // 警告色
      colorWarning: '#f59e0b',
      colorWarningBg: isDark ? '#783c00' : '#fffbeb',
      colorWarningBorder: isDark ? '#d97706' : '#fcd34d',
      colorWarningHover: isDark ? '#fbbf24' : '#d97706',
      colorWarningActive: isDark ? '#f59e0b' : '#b45309',
      colorWarningText: isDark ? '#f59e0b' : '#b45309',
      colorWarningTextHover: isDark ? '#fbbf24' : '#d97706',
      colorWarningTextActive: isDark ? '#d97706' : '#92400e',

      // 错误色
      colorError: '#ef4444',
      colorErrorBg: isDark ? '#7f1d1d' : '#fef2f2',
      colorErrorBorder: isDark ? '#dc2626' : '#fca5a5',
      colorErrorHover: isDark ? '#f87171' : '#dc2626',
      colorErrorActive: isDark ? '#ef4444' : '#b91c1c',
      colorErrorText: isDark ? '#ef4444' : '#b91c1c',
      colorErrorTextHover: isDark ? '#f87171' : '#dc2626',
      colorErrorTextActive: isDark ? '#dc2626' : '#991b1b',

      // 信息色
      colorInfo: '#3b82f6',
      colorInfoBg: isDark ? '#1e3a8a' : '#eff6ff',
      colorInfoBorder: isDark ? '#2563eb' : '#93c5fd',
      colorInfoHover: isDark ? '#60a5fa' : '#2563eb',
      colorInfoActive: isDark ? '#3b82f6' : '#1d4ed8',
      colorInfoText: isDark ? '#3b82f6' : '#1d4ed8',
      colorInfoTextHover: isDark ? '#60a5fa' : '#2563eb',
      colorInfoTextActive: isDark ? '#2563eb' : '#1e40af',

      // 中性色
      colorTextBase: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
      colorBgBase: isDark ? '#141414' : '#ffffff',
      
      // 其他基础配置
      borderRadius: 4,
      fontSize: 14,
      fontSizeSM: 12,
      fontSizeLG: 16,
      fontSizeXL: 20,
      lineHeight: 1.5715,
      
      // 背景色系统
      colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
      colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
      colorBgLayout: isDark ? '#141414' : '#f0f2f5',
      colorBgSpotlight: isDark ? '#1f1f1f' : '#ffffff',
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      
      // 文字颜色系统
      colorText: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
      colorTextSecondary: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
      colorTextTertiary: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
      colorTextQuaternary: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
      
      // 边框颜色系统
      colorBorder: isDark ? '#303030' : '#d9d9d9',
      colorBorderSecondary: isDark ? '#303030' : '#f0f0f0',
      colorSplit: isDark ? '#303030' : '#f0f0f0',
    },
    components: {
      Button: {
        borderRadius: 20,
        controlHeight: 36,
        paddingContentHorizontal: 20,
      },
      Input: {
        borderRadius: 20,
        controlHeight: 36,
      },
      Select: {
        borderRadius: 4,
      },
      Pagination: {
        borderRadius: 4,
      },
      Checkbox: {
        borderRadius: 4,
      },
      Modal: {
        borderRadius: 20,
        contentBorderRadius: 20,
        headerBg: 'var(--ant-color-bg-container)',
      },
      Drawer: {
        borderRadius: 20,
      },
      Dropdown: {
        borderRadius: 20,
      },
      Popover: {
        borderRadius: 20,
      },
      Tooltip: {
        borderRadius: 20,
      },
      Message: {
        zIndex: 1050,
      },
      Card: {
        borderRadius: 8,
      },
    },
  }), [isDark]);

  // 主题切换处理函数
  const handleThemeChange = React.useCallback((dark) => {
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  React.useEffect(() => {
    setIsThemeLoaded(true);
  }, []);

  React.useEffect(() => {
    if (isThemeLoaded) {
      handleThemeChange(isDark);
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
          handleThemeChange(e.matches);
        }
      };

      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [handleThemeChange, isDark, isThemeLoaded]);

  // Manually set CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    const textColor = isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)';
    root.style.setProperty('--ant-color-text', textColor);
  }, [isDark]);

  return (
    <LocaleProvider>
      <Helmet>
        <meta name="application-name" content={brandConfig.name} />
        <meta name="apple-mobile-web-app-title" content={brandConfig.name} />
      </Helmet>
      <ThemeProvider theme={{ 
        mode: isDark ? 'dark' : 'light',
        setTheme: handleThemeChange 
      }}>
        <ConfigProvider
          locale={localeMap[locale]}
          theme={themeConfig}
        >
          <GlobalStyles />
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <BaiduAnalyticsTracker />
            <Routes>
              <Route path="/" element={<SeedanceVideoPage />} />
              {/* 认证页面 */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/auth/google/callback" element={<GoogleCallback />} />
              {/* 账户设置 */}
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              } />
              <Route path="/privacy-preferences" element={
                <PrivateRoute>
                  <PrivacyPreferencesPage />
                </PrivateRoute>
              } />
              {/* 资产与订单 */}
              <Route path="/billing" element={
                <PrivateRoute>
                  <BillingPage />
                </PrivateRoute>
              } />
              <Route path="/orders" element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              } />
              <Route path="/recharge" element={
                <PrivateRoute>
                  <RechargePage />
                </PrivateRoute>
              } />
              <Route path="/recharge-agreement" element={<RechargeAgreementPage />} />
              {/* 工作台 */}
              <Route path="/works" element={
                <PrivateRoute>
                  <WorksPage />
                </PrivateRoute>
              } />
              <Route path="/notifications" element={
                <PrivateRoute>
                  <NotificationsPage />
                </PrivateRoute>
              } />
              {/* 支持 */}
              <Route path="/help" element={<HelpPage />} />
              <Route path="/invite" element={
                <PrivateRoute>
                  <InvitePage />
                </PrivateRoute>
              } />
              <Route path="/feedback" element={<FeedbackPage />} />
              {/* 法律页面 */}
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            </Routes>
          </Router>
        </ConfigProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
