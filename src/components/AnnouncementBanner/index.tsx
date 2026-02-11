import React, { useState, useContext, useEffect } from 'react';
import { Alert, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';

// 全局事件，用于从外部重新打开公告
export const announcementEvents = {
  open: () => {
    window.dispatchEvent(new CustomEvent('openAnnouncement'));
  },
};

const AnnouncementContainer = styled.div<{ $isDark: boolean }>`
  position: relative;
  margin-bottom: 24px;
  z-index: 10;
  
  .ant-alert {
    border-radius: 12px;
    border: none;
    box-shadow: ${props => props.$isDark 
      ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
      : '0 4px 12px rgba(0, 0, 0, 0.08)'};
    background: ${props => props.$isDark
      ? 'linear-gradient(135deg, rgba(24, 144, 255, 0.15) 0%, rgba(24, 144, 255, 0.25) 100%)'
      : 'linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.15) 100%)'};
    backdrop-filter: blur(10px);
    
    .ant-alert-message {
      font-weight: 500;
      color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)'};
    }
    
    .ant-alert-description {
      color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.65)'};
      margin-top: 4px;
    }
  }
  
  .close-button {
    position: absolute;
    top: 12px;
    right: 12px;
    color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'};
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
    
    &:hover {
      color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
      background: ${props => props.$isDark 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.06)'};
    }
  }
`;

interface AnnouncementBannerProps {
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭后的回调 */
  onClose?: () => void;
}

/**
 * 新模型发布提示横幅
 * 用于提醒用户即将上线的新模型
 */
const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ 
  closable = true,
  onClose 
}) => {
  const theme = useContext(ThemeContext);
  const intl = useIntl();
  const [visible, setVisible] = useState(() => {
    // 检查本地存储，如果用户已关闭则不显示
    const closed = localStorage.getItem('seedance-v2-announcement-closed');
    return !closed;
  });

  const isDark = theme?.mode === 'dark';

  // 监听重新打开事件
  useEffect(() => {
    const handleOpenAnnouncement = () => {
      setVisible(true);
      localStorage.removeItem('seedance-v2-announcement-closed');
    };

    window.addEventListener('openAnnouncement', handleOpenAnnouncement);
    return () => {
      window.removeEventListener('openAnnouncement', handleOpenAnnouncement);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem('seedance-v2-announcement-closed', 'true');
    // 触发关闭事件，通知 ReopenButton
    window.dispatchEvent(new CustomEvent('closeAnnouncement'));
    onClose?.();
  };

  if (!visible) {
    return null;
  }

  return (
    <AnnouncementContainer $isDark={isDark}>
      <Alert
        message={
          <FormattedMessage 
            id="announcement.seedanceV2.title" 
            defaultMessage="🎉 重磅消息：SeedanceV2 即将上线！" 
          />
        }
        description={
          <div>
            <FormattedMessage 
              id="announcement.seedanceV2.description" 
              defaultMessage="字节跳动旗下全新 SeedanceV2 模型将于 3 月正式发布，带来更强大的视频生成能力和更精细的画面控制。敬请期待！" 
            />
            <div style={{ 
              marginTop: 8,
              fontSize: 13,
              opacity: 0.8
            }}>
              <FormattedMessage 
                id="announcement.seedanceV2.date" 
                defaultMessage="预计发布时间：2025年3月" 
              />
            </div>
          </div>
        }
        type="info"
        showIcon={false}
        closable={false}
        style={{
          paddingRight: closable ? '40px' : '16px',
        }}
      />
      {closable && (
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleClose}
          className="close-button"
          size="small"
        />
      )}
    </AnnouncementContainer>
  );
};

export default AnnouncementBanner;
