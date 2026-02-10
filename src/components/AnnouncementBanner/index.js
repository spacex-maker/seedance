import React, { useState, useEffect, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Alert } from 'antd';
import { BulbOutlined } from '@ant-design/icons';

const STORAGE_KEY = 'seedance_announcement_banner_closed';
const EVENT_REOPEN = 'seedance-announcement-reopen';

const BannerWrap = styled.div`
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  .ant-alert {
    border: none;
    border-radius: 12px;
  }
  .ant-alert-message {
    font-weight: 600;
    font-size: 15px;
  }
  .ant-alert-description {
    margin-top: 6px;
    font-size: 13px;
    line-height: 1.5;
    opacity: 0.92;
  }
  .ant-alert-close-icon {
    font-size: 14px;
  }
`;

/**
 * Seedance2 即将发布公告条
 * 可关闭，关闭后可通过 ReopenButton 再次打开
 */
const AnnouncementBanner = () => {
  const theme = useContext(ThemeContext);
  const [closed, setClosed] = useState(true);

  useEffect(() => {
    const sync = () => {
      try {
        setClosed(localStorage.getItem(STORAGE_KEY) === '1');
      } catch {
        setClosed(false);
      }
    };
    sync();
    window.addEventListener(EVENT_REOPEN, sync);
    return () => window.removeEventListener(EVENT_REOPEN, sync);
  }, []);

  const handleClose = () => {
    setClosed(true);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {}
  };

  if (closed) return null;

  const isDark = theme?.mode === 'dark';

  return (
    <BannerWrap>
      <Alert
        type="info"
        icon={<BulbOutlined />}
        message="Seedance2 即将发布"
        description="Seedance2 预计 2026-02-24 18:00:00 后可支持开通 —— 电影级 AI 图生视频，多镜头叙事、自动分镜运镜、音画同步，让创作更专业，敬请期待。"
        closable
        onClose={handleClose}
        showIcon
        style={{
          background: isDark ? 'rgba(22, 119, 255, 0.15)' : 'linear-gradient(135deg, #e6f4ff 0%, #bae0ff 100%)',
          border: isDark ? '1px solid rgba(22, 119, 255, 0.35)' : '1px solid #91caff',
        }}
      />
    </BannerWrap>
  );
};

export default AnnouncementBanner;
