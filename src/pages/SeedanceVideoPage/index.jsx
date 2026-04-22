import React, { useContext } from 'react';
import { Layout, Typography } from 'antd';
import { Helmet } from 'react-helmet';
import styled, { ThemeContext } from 'styled-components';
import { useIntl } from 'react-intl';
import SimpleHeader from 'components/headers/simple';
import SeedanceVideo from 'pages/Workspace/Create/components/SeedanceVideo';
import FooterSection from 'pages/Home/components/FooterSection';
import brandConfig from 'config/brand';

const { Content } = Layout;

/** 科幻炫彩背景：纯 CSS；明亮模式为浅色极光 + 高可读性 */
const SciFiBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: ${props => (props.theme.mode === 'dark' ? '#030712' : '#e8edf5')};

  @keyframes sciGradientDrift {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    50% {
      transform: translate(-3%, 2%) scale(1.05);
      opacity: 0.92;
    }
    100% {
      transform: translate(2%, -2%) scale(1.02);
      opacity: 1;
    }
  }

  @keyframes sciHuePulseDark {
    0% {
      filter: hue-rotate(0deg);
    }
    100% {
      filter: hue-rotate(25deg);
    }
  }

  @keyframes sciHuePulseLight {
    0% {
      filter: hue-rotate(0deg) saturate(1.05);
    }
    100% {
      filter: hue-rotate(12deg) saturate(1.12);
    }
  }

  /* 主光晕层 */
  &::before {
    content: '';
    position: absolute;
    inset: -15%;
    animation: sciGradientDrift 22s ease-in-out infinite alternate,
      ${props => (props.theme.mode === 'dark' ? 'sciHuePulseDark' : 'sciHuePulseLight')} 28s ease-in-out
        infinite alternate;
    background: ${props =>
      props.theme.mode === 'dark'
        ? `
      radial-gradient(ellipse 100% 80% at 15% 20%, rgba(56, 189, 248, 0.45), transparent 55%),
      radial-gradient(ellipse 90% 70% at 85% 15%, rgba(168, 85, 247, 0.42), transparent 50%),
      radial-gradient(ellipse 70% 90% at 50% 100%, rgba(236, 72, 153, 0.28), transparent 55%),
      radial-gradient(ellipse 50% 40% at 70% 60%, rgba(34, 211, 238, 0.2), transparent 45%),
      linear-gradient(
        160deg,
        #0f172a 0%,
        #1e1b4b 22%,
        #312e81 42%,
        #0c4a6e 58%,
        #134e4a 78%,
        #0f172a 100%
      )
    `
        : `
      radial-gradient(ellipse 100% 80% at 12% 18%, rgba(56, 189, 248, 0.22), transparent 58%),
      radial-gradient(ellipse 90% 72% at 88% 12%, rgba(167, 139, 250, 0.2), transparent 52%),
      radial-gradient(ellipse 72% 88% at 50% 96%, rgba(244, 114, 182, 0.12), transparent 58%),
      radial-gradient(ellipse 55% 45% at 72% 58%, rgba(45, 212, 191, 0.1), transparent 48%),
      linear-gradient(
        165deg,
        #f8fafc 0%,
        #eef2ff 26%,
        #faf5ff 50%,
        #ecfeff 74%,
        #f1f5f9 100%
      )
    `};
    background-size: 120% 120%;
    background-position: 40% 30%;
  }

  /* 网格 + 暗角 / 亮角，保证前景可读 */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background:
      linear-gradient(
        180deg,
        ${props =>
          props.theme.mode === 'dark'
            ? 'rgba(3, 7, 18, 0.15) 0%, rgba(3, 7, 18, 0.55) 100%'
            : 'rgba(255, 255, 255, 0.42) 0%, rgba(248, 250, 252, 0.2) 100%'}
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 47px,
        ${props =>
          props.theme.mode === 'dark'
            ? 'rgba(148, 163, 184, 0.04) 47px, rgba(148, 163, 184, 0.04) 48px'
            : 'rgba(100, 116, 139, 0.055) 47px, rgba(100, 116, 139, 0.055) 48px'}
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 47px,
        ${props =>
          props.theme.mode === 'dark'
            ? 'rgba(148, 163, 184, 0.03) 47px, rgba(148, 163, 184, 0.03) 48px'
            : 'rgba(100, 116, 139, 0.04) 47px, rgba(100, 116, 139, 0.04) 48px'}
      ),
      radial-gradient(
        ellipse 85% 65% at 50% 50%,
        transparent 42%,
        ${props =>
          props.theme.mode === 'dark' ? 'rgba(3, 7, 18, 0.5) 100%' : 'rgba(148, 163, 184, 0.14) 100%'}
      );
  }
`;

const PageContent = styled(Content)`
  position: relative;
  z-index: 1;
  margin-top: 72px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 40px;
  max-width: 1400px;
  width: calc(100% - 48px);
  min-height: calc(100vh - 72px - 40px);
  overflow: visible;
  padding: 32px;
  padding-bottom: 40px;
  background: transparent;

  /* 响应式设计 */
  @media (max-width: 1200px) {
    max-width: 100%;
    width: calc(100% - 32px);
    padding: 24px;
    padding-bottom: 32px;
  }

  @media (max-width: 768px) {
    width: calc(100% - 24px);
    margin-top: 72px;
    margin-bottom: 24px;
    padding: 20px;
    padding-bottom: 24px;
  }

  @media (max-width: 480px) {
    width: calc(100% - 16px);
    padding: 16px;
    padding-bottom: 20px;
  }

  /* 确保内容区域不会溢出 */
  & > * {
    max-width: 100%;
  }
`;

const PageWrapper = styled(Layout)`
  min-height: 100vh;
  background: transparent;
  position: relative;
  z-index: 1;
`;

const PoweredByWrap = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding: 8px 12px;
  font-size: 13px;
  color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(15, 23, 42, 0.55)'};
  .ant-typography {
    color: inherit !important;
  }
  a {
    color: ${props =>
      props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(37, 99, 235, 0.92)'};
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

/**
 * Seedance 图生视频 - 独立整页，无侧栏
 * 路由：/seedance-video
 */
const SeedanceVideoPage = () => {
  const theme = useContext(ThemeContext);
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>{brandConfig.productNameFull} - {brandConfig.name}</title>
        <meta name="description" content={`${brandConfig.productNameFull} · AI 图生视频`} />
      </Helmet>
      <SciFiBackdrop theme={theme} aria-hidden />
      <PageWrapper>
        <SimpleHeader />
        <PageContent>
          <PoweredByWrap theme={theme}>
            <Typography.Text type="secondary">
              Powered by{' '}
              <a href="https://www.volcengine.com" target="_blank" rel="noopener noreferrer">Volcano Engine</a>
              {' — '}
              {intl.formatMessage(
                { id: 'home.poweredBy', defaultMessage: '本站视频生成核心技术由 火山引擎 (Volcano Engine) 提供强力驱动' }
              )}
            </Typography.Text>
          </PoweredByWrap>
          <SeedanceVideo />
        </PageContent>
        <FooterSection />
      </PageWrapper>
    </>
  );
};

export default SeedanceVideoPage;
