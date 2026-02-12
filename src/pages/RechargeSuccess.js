import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import { Button, ConfigProvider, theme } from "antd";
import { motion } from "framer-motion";
import { ArrowRightOutlined, HomeOutlined } from "@ant-design/icons";
import SimpleHeader from "components/headers/simple";
import { Analytics } from "utils/analytics";

// ==========================================
// 1. 样式系统 (Premium Big Tech Style)
// ==========================================

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 60px; /* 避开 Header */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  overflow: hidden;

  /* 背景极光 (Subtle Aurora) */
  &::before {
    content: '';
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    filter: blur(80px);
    z-index: 0;
    pointer-events: none;
  }
`;

const SuccessCard = styled(motion.div)`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  background: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 48px 32px;
  text-align: center;
  box-shadow: 
    0 0 0 1px rgba(0,0,0,1), 
    0 20px 60px -10px rgba(0,0,0,0.6);
  overflow: hidden;

  /* 顶部高光条 (Top Highlight) */
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  }
`;

// 动画 Checkmark SVG
const CheckIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 24px' }}>
    <motion.circle 
      cx="40" cy="40" r="38" 
      stroke="#333" strokeWidth="2" 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
    <motion.circle 
      cx="40" cy="40" r="38" 
      stroke="#fff" strokeWidth="2" 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ strokeDasharray: "0 1" }} // Only partial fill if needed, or full
    />
    <motion.path 
      d="M26 40L36 50L54 30" 
      stroke="#fff" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
    />
  </svg>
);

const Title = styled(motion.h1)`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
`;

const Subtitle = styled(motion.p)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.45);
  margin: 0 0 40px 0;
  line-height: 1.5;
`;

const ReceiptBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
`;

const AmountDisplay = styled.div`
  font-family: 'SF Pro Display', -apple-system, sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
  letter-spacing: -1px;
  
  span {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.4);
    font-weight: 500;
    margin-right: 4px;
  }
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 8px;
  
  span.val { color: rgba(255, 255, 255, 0.6); font-family: 'SF Mono', monospace; }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  .primary-btn {
    height: 48px;
    border-radius: 12px;
    background: #fff;
    color: #000;
    font-weight: 600;
    border: none;
    font-size: 15px;
    box-shadow: 0 4px 12px rgba(255,255,255,0.1);
    
    &:hover {
      background: #eaeaea !important;
      transform: translateY(-1px);
    }
  }

  .secondary-btn {
    height: 48px;
    border-radius: 12px;
    background: transparent;
    color: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 15px;
    
    &:hover {
      color: #fff;
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.02);
    }
  }
`;

// 粒子特效组件
const Confetti = () => {
  const colors = ["#ffffff", "#333333", "#0070f3"];
  return (
    <>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 1, 
            scale: Math.random() * 0.5 + 0.5 
          }}
          animate={{ 
            x: (Math.random() - 0.5) * 400, 
            y: (Math.random() - 0.5) * 400 - 100, 
            opacity: 0,
            rotate: Math.random() * 360 
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            pointerEvents: 'none',
            zIndex: 5
          }}
        />
      ))}
    </>
  );
};

// ==========================================
// 2. 页面逻辑
// ==========================================

export default function RechargeSuccessPage() {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();
  const state = location.state || {};
  const {
    orderNo = 'ORD-' + Math.floor(Math.random() * 1000000),
    amount = '0.00',
    currency = 'CNY',
  } = state;

  // 仅在有真实订单数据时上报 GA4 purchase，用于 Google Ads 转化价值 / ROAS
  const hasFiredPurchase = useRef(false);
  useEffect(() => {
    const orderId = state.orderNo;
    const orderAmount = state.amount != null ? Number(state.amount) : NaN;
    const orderCurrency = state.currency || 'CNY';
    if (orderId && !Number.isNaN(orderAmount) && orderAmount > 0 && !hasFiredPurchase.current) {
      Analytics.trackPurchaseSuccess(orderId, orderAmount, orderCurrency, 'Recharge');
      hasFiredPurchase.current = true;
      if (process.env.NODE_ENV !== 'production') {
        console.log('[GA4] Purchase event sent on success page:', orderAmount, orderCurrency);
      }
    }
  }, [state.orderNo, state.amount, state.currency]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#fff' }
      }}
    >
      <Wrapper>
        {/* 背景 Header (透明) */}
        <SimpleHeader theme="dark" />

        {/* 粒子爆炸 */}
        <Confetti />

        <SuccessCard
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Apple-like spring
        >
          {/* 1. 动态 Icon */}
          <CheckIcon />

          {/* 2. 文本 */}
          <Title
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {intl.formatMessage({ id: 'recharge.success.title', defaultMessage: 'Payment Successful' })}
          </Title>
          <Subtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {intl.formatMessage({ id: 'recharge.success.desc', defaultMessage: 'Your account has been credited successfully.' })}
          </Subtitle>

          {/* 3. 票据卡片 */}
          <ReceiptBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AmountDisplay>
              <span>{currency === 'CNY' ? '¥' : '$'}</span>
              {Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </AmountDisplay>
            <MetaRow>
              <span>{intl.formatMessage({ id: 'recharge.success.orderId', defaultMessage: 'Order ID' })}: <span className="val">{orderNo}</span></span>
              <span>•</span>
              <span className="val">{new Date().toLocaleDateString(intl.locale)}</span>
            </MetaRow>
          </ReceiptBox>

          {/* 4. 按钮组 */}
          <ButtonGroup
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              className="primary-btn" 
              onClick={() => navigate('/')}
              icon={<ArrowRightOutlined />}
            >
              {intl.formatMessage({ id: 'recharge.success.goCreate', defaultMessage: 'Start Creating' })}
            </Button>
            
            <Button 
              className="secondary-btn"
              onClick={() => navigate('/billing')}
              icon={<HomeOutlined />}
            >
              {intl.formatMessage({ id: 'recharge.success.dashboard', defaultMessage: 'Return to Dashboard' })}
            </Button>
          </ButtonGroup>

        </SuccessCard>
      </Wrapper>
    </ConfigProvider>
  );
}