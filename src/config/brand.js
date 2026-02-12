/**
 * 品牌配置
 * 统一管理所有品牌相关的名称、URL、邮箱等信息
 */

const brandConfig = {
  // 品牌名称
  name: 'Seedance',
  nameLowercase: 'seedance',
  nameUppercase: 'SEEDANCE',
  
  // 产品名称
  productName: 'Seedance',
  productNameFull: 'Seedance 图生视频',
  
  // 网站信息
  siteUrl: 'https://ai2obj.com',
  supportEmail: 'support@seedance.com',
  
  // SEO 默认信息
  seo: {
    defaultTitle: 'Seedance - AI 图生视频平台',
    defaultDescription: 'Seedance 是一站式 AI 图生视频平台，提供专业的视频生成服务。',
    defaultImage: 'https://ai2obj.com/landing.png',
  },
  
  // 版权信息
  copyright: {
    company: 'Seedance',
    year: new Date().getFullYear(),
  },
  
  // 社交媒体链接（如果需要）
  social: {
    github: 'https://github.com/seedance',
    twitter: 'https://twitter.com/seedance',
    discord: 'https://discord.gg/seedance',
  },

  // Google OAuth 配置
  google: {
    // Google Client ID（公开的，可以写在前端）
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '930272221836-5tnebscahg9gkdolh9aeqltuf52gek7l.apps.googleusercontent.com',
  },
};

export default brandConfig;
