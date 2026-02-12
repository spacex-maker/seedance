import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { useLocale } from 'contexts/LocaleContext';
import { auth } from '../../api/auth';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleGIcon from '../../pages/Login/components/RightSection/GoogleGIcon';

// 动画定义
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// 样式组件
const LoginPromptContainer = styled(motion.div)`
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  max-width: 360px;
  width: calc(100vw - 40px);
  
  @media (max-width: 768px) {
    top: 70px;
    right: 10px;
    max-width: calc(100vw - 20px);
  }
`;

const PromptCard = styled.div`
  background: ${props => props.$isDark 
    ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.95) 100%)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  position: relative;
  animation: ${props => props.$isVisible ? slideIn : slideOut} 0.3s ease-out;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border: none;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
    color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
    transform: rotate(90deg);
  }
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
`;

const Description = styled.p`
  margin: 0 0 16px 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'};
`;

const GoogleButton = styled(Button)`
  width: 100%;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'};
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : '#fff'};
  color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
  
  &:hover {
    border-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.25)'};
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : '#f5f5f5'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LoginPrompt = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { locale } = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  // 监听主题变化
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // 检查是否应该显示提示
  useEffect(() => {
    // 检查用户是否已登录
    const token = localStorage.getItem('token');
    if (token) {
      return; // 已登录，不显示
    }

    // 检查是否在登录/注册页面
    if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
      return; // 在登录页面，不显示
    }

    // 检查用户是否已经关闭过提示（24小时内不重复显示）
    const dismissedKey = 'loginPromptDismissed';
    const dismissedTime = localStorage.getItem(dismissedKey);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (dismissedTime && (now - parseInt(dismissedTime)) < oneDay) {
      return; // 24小时内已关闭，不显示
    }

    // 延迟显示（3秒后显示，给用户时间浏览页面）
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 处理关闭
  const handleClose = () => {
    setIsVisible(false);
    // 记录关闭时间
    localStorage.setItem('loginPromptDismissed', Date.now().toString());
  };

  // 处理谷歌登录
  const handleGoogleLogin = async () => {
    try {
      const targetUrl = window.location.origin + '/auth/google/callback';
      const result = await auth.getGoogleAuthUrl(targetUrl);
      if (result.success && result.data) {
        window.location.href = result.data;
      } else {
        message.error(result.message || intl.formatMessage({ 
          id: 'loginPrompt.googleLoginError', 
          defaultMessage: '获取谷歌授权链接失败' 
        }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ 
        id: 'loginPrompt.googleLoginError', 
        defaultMessage: '登录失败，请稍后重试' 
      }));
    }
  };

  // 处理跳转到登录页
  const handleGoToLogin = () => {
    navigate('/login');
    handleClose();
  };

  if (!isVisible) {
    return null;
  }

  const isZh = locale && String(locale).toLowerCase().startsWith('zh');

  return (
    <AnimatePresence>
      {isVisible && (
        <LoginPromptContainer
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <PromptCard $isDark={isDark} $isVisible={isVisible}>
            <CloseButton $isDark={isDark} onClick={handleClose}>
              <CloseOutlined style={{ fontSize: 14 }} />
            </CloseButton>
            
            <Title $isDark={isDark}>
              {isZh 
                ? intl.formatMessage({ 
                    id: 'loginPrompt.title', 
                    defaultMessage: '快速登录' 
                  })
                : intl.formatMessage({ 
                    id: 'loginPrompt.title', 
                    defaultMessage: 'Quick Login' 
                  })
              }
            </Title>
            
            <Description $isDark={isDark}>
              {isZh
                ? intl.formatMessage({ 
                    id: 'loginPrompt.description', 
                    defaultMessage: '使用 Google 账号快速登录，享受更多功能' 
                  })
                : intl.formatMessage({ 
                    id: 'loginPrompt.description', 
                    defaultMessage: 'Sign in with Google to access more features' 
                  })
              }
            </Description>
            
            <GoogleButton 
              $isDark={isDark}
              onClick={handleGoogleLogin}
              icon={<GoogleGIcon size={20} />}
            >
              {isZh
                ? intl.formatMessage({ 
                    id: 'loginPrompt.googleButton', 
                    defaultMessage: '使用 Google 登录' 
                  })
                : intl.formatMessage({ 
                    id: 'loginPrompt.googleButton', 
                    defaultMessage: 'Sign in with Google' 
                  })
              }
            </GoogleButton>
            
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <Button 
                type="link" 
                size="small"
                onClick={handleGoToLogin}
                style={{ 
                  color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
                  fontSize: 12,
                  padding: 0,
                  height: 'auto'
                }}
              >
                {isZh
                  ? intl.formatMessage({ 
                      id: 'loginPrompt.otherLogin', 
                      defaultMessage: '其他登录方式' 
                    })
                  : intl.formatMessage({ 
                      id: 'loginPrompt.otherLogin', 
                      defaultMessage: 'Other login methods' 
                    })
                }
              </Button>
            </div>
          </PromptCard>
        </LoginPromptContainer>
      )}
    </AnimatePresence>
  );
};

export default LoginPrompt;

