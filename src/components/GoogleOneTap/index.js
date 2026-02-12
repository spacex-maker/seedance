import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useIntl } from 'react-intl';
import { auth } from '../../api/auth';
import brandConfig from '../../config/brand';

/**
 * Google One Tap 组件
 * 使用 Google Identity Services 显示原生的 Google 登录提示框
 */
const GoogleOneTap = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const initializedRef = useRef(false);

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem('token');
    if (token) {
      return; // 已登录，不显示
    }

    // 检查是否在登录/注册页面
    if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
      return; // 在登录页面，不显示
    }

    // 检查是否已经初始化过
    if (initializedRef.current) {
      return;
    }

    // 检查用户是否已经关闭过（24小时内不重复显示）
    const dismissedKey = 'googleOneTapDismissed';
    const dismissedTime = localStorage.getItem(dismissedKey);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (dismissedTime && (now - parseInt(dismissedTime)) < oneDay) {
      return; // 24小时内已关闭，不显示
    }

    // 延迟加载 Google Identity Services（给页面时间加载）
    const loadGoogleOneTap = async () => {
      try {
        // 优先使用配置中的 Client ID，如果没有则从后端获取
        let clientId = brandConfig.google?.clientId;
        
        if (!clientId) {
          // 从后端获取 Google Client ID（备用方案）
          const clientIdResult = await auth.getGoogleClientId();
          if (!clientIdResult.success || !clientIdResult.data) {
            console.warn('Failed to get Google Client ID for One Tap');
            return;
          }
          clientId = clientIdResult.data;
        }
        
        // 加载 Google Identity Services 脚本
        if (!window.google) {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = () => {
            initializeOneTap(clientId);
          };
          document.head.appendChild(script);
        } else {
          initializeOneTap(clientId);
        }

        // 初始化 One Tap
        function initializeOneTap(clientId) {
          if (!window.google || !window.google.accounts) {
            console.warn('Google Identity Services not loaded');
            return;
          }

          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false, // 不自动选择账号
            cancel_on_tap_outside: true, // 点击外部区域关闭
            itp_support: true, // 支持 ITP（Intelligent Tracking Prevention）
          });

          // 显示 One Tap 提示
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              // 不显示的原因
              const reasons = notification.getNotDisplayedReason();
              const skippedReasons = notification.getSkippedReason();
              
              if (reasons && (reasons.includes('browser_not_supported') || 
                  reasons.includes('invalid_client'))) {
                console.warn('Google One Tap not supported:', reasons);
              }
              
              if (skippedReasons && skippedReasons.includes('user_cancel')) {
                // 用户取消，记录时间
                localStorage.setItem(dismissedKey, Date.now().toString());
              }
            } else if (notification.isDismissedMoment()) {
              // 用户关闭了提示，记录时间
              localStorage.setItem(dismissedKey, Date.now().toString());
            }
          });

          initializedRef.current = true;
        }

        // 处理登录凭证响应
        function handleCredentialResponse(response) {
          // 这里 response.credential 是 JWT token
          // 需要发送到后端进行验证和登录
          handleGoogleSignIn(response.credential);
        }

      } catch (error) {
        console.error('Error loading Google One Tap:', error);
      }
    };

    // 延迟 2 秒后加载，给页面时间渲染
    const timer = setTimeout(loadGoogleOneTap, 2000);

    return () => {
      clearTimeout(timer);
      // 清理 One Tap（如果已初始化）
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.cancel();
        } catch (e) {
          // 忽略错误
        }
      }
    };
  }, [navigate, intl]);

  // 处理 Google 登录
  const handleGoogleSignIn = async (credential) => {
    try {
      // 发送 credential 到后端进行验证
      // 这里需要后端提供一个接口来验证 Google credential 并返回 token
      const result = await auth.handleGoogleOneTap({ credential });
      
      if (result.success) {
        message.success(intl.formatMessage({ 
          id: 'googleOneTap.loginSuccess', 
          defaultMessage: '登录成功' 
        }));
        // 刷新页面或跳转
        window.location.reload();
      } else {
        message.error(result.message || intl.formatMessage({ 
          id: 'googleOneTap.loginError', 
          defaultMessage: '登录失败' 
        }));
      }
    } catch (error) {
      console.error('Google One Tap login error:', error);
      message.error(intl.formatMessage({ 
        id: 'googleOneTap.loginError', 
        defaultMessage: '登录失败，请稍后重试' 
      }));
    }
  };

  return null; // 这个组件不渲染任何内容
};

export default GoogleOneTap;

