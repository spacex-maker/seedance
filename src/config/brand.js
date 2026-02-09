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
  siteUrl: 'https://seedance.com',
  supportEmail: 'support@seedance.com',
  
  // SEO 默认信息
  seo: {
    defaultTitle: 'Seedance - AI 图生视频平台',
    defaultDescription: 'Seedance 是一站式 AI 图生视频平台，提供专业的视频生成服务。',
    defaultImage: 'https://seedance.com/landing.png',
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
};

export default brandConfig;
