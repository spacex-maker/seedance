import React, { useContext } from 'react';
import { Layout, Typography } from 'antd';
import { Helmet } from 'react-helmet';
import styled, { ThemeContext } from 'styled-components';
import { useIntl } from 'react-intl';
import SimpleHeader from 'components/headers/simple';
import SeedanceVideo from 'pages/Workspace/Create/components/SeedanceVideo';
import FooterSection from 'pages/Home/components/FooterSection';
import AnnouncementBanner from 'components/AnnouncementBanner';
import ReopenAnnouncementButton from 'components/AnnouncementBanner/ReopenButton';
import brandConfig from 'config/brand';

const { Content } = Layout;

const BACKGROUND_VIDEO_URL =
  'https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/47w9oml55hsav.mp4';

const VideoBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.theme.mode === 'dark'
      ? 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)'
      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.5) 100%)'};
    z-index: 1;
  }
  
  & video {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.45)'};
  a {
    color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.55)'};
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
        <meta name="description" content={`字节豆包 ${brandConfig.productName} 1.5 图生视频`} />
      </Helmet>
      <VideoBackdrop theme={theme}>
        <video
          src={BACKGROUND_VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
        />
      </VideoBackdrop>
      <PageWrapper>
        <SimpleHeader />
        <ReopenAnnouncementButton />
        <PageContent>
          <AnnouncementBanner />
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
