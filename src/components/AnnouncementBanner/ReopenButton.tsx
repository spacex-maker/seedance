import React, { useContext, useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import { announcementEvents } from './index';

const ReopenButtonContainer = styled.div<{ $isDark: boolean }>`
  position: fixed;
  top: 88px;
  right: 24px;
  z-index: 100;
  
  @media (max-width: 768px) {
    top: 88px;
    right: 16px;
  }
  
  .ant-btn {
    border-radius: 20px;
    box-shadow: ${props => props.$isDark 
      ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
      : '0 4px 12px rgba(0, 0, 0, 0.1)'};
    background: ${props => props.$isDark
      ? 'rgba(24, 144, 255, 0.15)'
      : 'rgba(24, 144, 255, 0.08)'};
    border: 1px solid ${props => props.$isDark
      ? 'rgba(24, 144, 255, 0.3)'
      : 'rgba(24, 144, 255, 0.2)'};
    color: ${props => props.$isDark ? '#60a5fa' : '#1890ff'};
    backdrop-filter: blur(10px);
    
    &:hover {
      background: ${props => props.$isDark
        ? 'rgba(24, 144, 255, 0.25)'
        : 'rgba(24, 144, 255, 0.15)'};
      border-color: ${props => props.$isDark
        ? 'rgba(24, 144, 255, 0.5)'
        : 'rgba(24, 144, 255, 0.4)'};
      color: ${props => props.$isDark ? '#93c5fd' : '#40a9ff'};
      transform: translateY(-2px);
      box-shadow: ${props => props.$isDark 
        ? '0 6px 16px rgba(0, 0, 0, 0.4)' 
        : '0 6px 16px rgba(0, 0, 0, 0.15)'};
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

/**
 * 重新打开公告的浮动按钮
 * 当用户关闭公告后显示，点击可重新打开
 */
const ReopenAnnouncementButton: React.FC = () => {
  const theme = useContext(ThemeContext);
  const isDark = theme?.mode === 'dark';
  const [isClosed, setIsClosed] = useState(() => {
    return localStorage.getItem('seedance-v2-announcement-closed') === 'true';
  });

  // 监听公告打开/关闭事件
  useEffect(() => {
    const handleOpenAnnouncement = () => {
      setIsClosed(false);
    };

    const handleCloseAnnouncement = () => {
      setIsClosed(true);
    };

    // 监听打开事件
    window.addEventListener('openAnnouncement', handleOpenAnnouncement);
    // 监听关闭事件（从 AnnouncementBanner 触发）
    window.addEventListener('closeAnnouncement', handleCloseAnnouncement);

    // 定期检查 localStorage 变化（作为备用方案）
    const interval = setInterval(() => {
      const closed = localStorage.getItem('seedance-v2-announcement-closed') === 'true';
      setIsClosed(closed);
    }, 500);

    return () => {
      window.removeEventListener('openAnnouncement', handleOpenAnnouncement);
      window.removeEventListener('closeAnnouncement', handleCloseAnnouncement);
      clearInterval(interval);
    };
  }, []);

  if (!isClosed) {
    return null; // 如果公告未关闭，不显示按钮
  }

  const handleClick = () => {
    announcementEvents.open();
  };

  return (
    <ReopenButtonContainer $isDark={isDark}>
      <Tooltip 
        title={<FormattedMessage 
          id="announcement.reopen.tooltip" 
          defaultMessage="查看新模型公告" 
        />}
        placement="left"
      >
        <Button
          type="default"
          icon={<BellOutlined />}
          onClick={handleClick}
          size="small"
          shape="round"
        >
          <FormattedMessage 
            id="announcement.reopen.button" 
            defaultMessage="新模型" 
          />
        </Button>
      </Tooltip>
    </ReopenButtonContainer>
  );
};

export default ReopenAnnouncementButton;
