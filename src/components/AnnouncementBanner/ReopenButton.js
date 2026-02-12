import React, { useState, useEffect, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

const STORAGE_KEY = 'seedance_announcement_banner_closed';

const EVENT_REOPEN = 'seedance-announcement-reopen';

const FloatButton = styled(Button)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  height: 40px;
  padding: 0 16px;
  font-size: 13px;

  @media (max-width: 768px) {
    bottom: 16px;
    right: 16px;
    height: 36px;
    padding: 0 12px;
    font-size: 12px;
  }
`;

/**
 * 当用户关闭公告条后显示此按钮，点击可再次展开公告
 */
const ReopenButton = () => {
  const theme = useContext(ThemeContext);
  const intl = useIntl();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        setVisible(localStorage.getItem(STORAGE_KEY) === '1');
      } catch {
        setVisible(false);
      }
    };
    check();
    window.addEventListener(EVENT_REOPEN, check);
    window.addEventListener('storage', check);
    return () => {
      window.removeEventListener(EVENT_REOPEN, check);
      window.removeEventListener('storage', check);
    };
  }, []);

  const handleClick = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    window.dispatchEvent(new CustomEvent(EVENT_REOPEN));
    setVisible(false);
  };

  if (!visible) return null;

  const isDark = theme?.mode === 'dark';

  return (
    <FloatButton
      type="primary"
      icon={<BellOutlined />}
      onClick={handleClick}
      style={{
        background: isDark ? 'rgba(22, 119, 255, 0.9)' : '#1677ff',
        border: 'none',
      }}
    >
      {intl.formatMessage({
        id: 'announcement.reopen.viewAnnouncement',
        defaultMessage: '查看 Seedance2 公告',
      })}
    </FloatButton>
  );
};

export default ReopenButton;
