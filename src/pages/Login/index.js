import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../api/auth";
import { base } from "../../api/base";
import { message } from "antd";
import { ThemeContext } from "styled-components";
import { useLocale } from 'contexts/LocaleContext';
import { useIntl } from 'react-intl';
import SEO, { SEOConfigs } from 'components/SEO';
import SimpleHeader from 'components/headers/simple';
import FooterSection from 'pages/Home/components/FooterSection';

import { PageContainer } from './styles';
import { RightSection } from './components/RightSection';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = React.useContext(ThemeContext);
  const { locale, changeLocale } = useLocale();
  const intl = useIntl();
  const [languages, setLanguages] = useState([]);

  // 获取支持的语言列表
  useEffect(() => {
    const fetchLanguages = async () => {
      const result = await base.getEnabledLanguages();
      if (result.success) {
        const sortedLanguages = result.data.sort((a, b) => b.usageCount - a.usageCount);
        setLanguages(sortedLanguages);
      }
    };
    fetchLanguages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await auth.login({ email, password });
      if (result.success) {
        message.success("登录成功");
        navigate("/");
      } else {
        setError(result.message || "登录失败");
      }
    } catch (error) {
      setError("登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 处理移动端虚拟键盘
  useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      );
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <>
      <SEO {...SEOConfigs.login}>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </SEO>
      <SimpleHeader />
      <PageContainer>
        <RightSection 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          handleSubmit={handleSubmit}
          intl={intl}
          locale={locale}
        />
      </PageContainer>
      <FooterSection />
    </>
  );
};

export default LoginPage;
