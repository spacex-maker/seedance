/**
 * 品牌配置
 * 统一管理所有品牌相关的名称、URL、邮箱等信息
 * 品牌：Seedance2（seedance2.cn）
 */

const brandConfig = {
  // 品牌名称
  name: 'Seedance2',
  nameLowercase: 'seedance2',
  nameUppercase: 'SEEDANCE2',
  
  // 产品名称
  productName: 'Seedance2',
  productNameFull: 'Seedance2 图生视频',
  
  // 网站信息（本站域名；主站 ai2obj.com）
  siteUrl: 'https://seedance2.cn',
  supportEmail: 'support@seedance.com',
  
  // SEO 默认信息（Seedance2 上线用）
  seo: {
    defaultTitle: 'Seedance2 - AI 图生视频平台 | 字节豆包',
    defaultDescription: 'Seedance2 是一站式 AI 图生视频平台，基于字节豆包模型，提供专业图生视频与文生视频服务。',
    defaultImage: 'https://seedance2.cn/landing.png',
  },
  
  // 版权信息
  copyright: {
    company: 'Seedance2',
    year: new Date().getFullYear(),
  },
  
  // 社交媒体链接（如需更新为 Seedance2 官方账号可在此修改）
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
