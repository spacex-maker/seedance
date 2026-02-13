import React, { useState, useEffect, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Alert } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';

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
  const intl = useIntl();
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
              defaultMessage="字节跳动旗下全新 SeedanceV2 模型预计 2026-02-24 18:00:00 后可支持开通，带来更强大的视频生成能力和更精细的画面控制。敬请期待！" 
            />
            <div style={{ 
              marginTop: 10,
              paddingTop: 8,
              paddingBottom: 8,
              borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)',
              fontSize: 13,
              fontWeight: 500,
              color: isDark ? 'rgba(255, 215, 0, 0.95)' : '#d48806',
              lineHeight: 1.6
            }}>
              <FormattedMessage 
                id="announcement.recharge.promo" 
                defaultMessage="🎁 限时活动：2月24日前充值99美金，将会获得 Seedance 2.0 内测资格，并有资格进入高级会员群组！" 
              />
            </div>
          </div>
        }
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
