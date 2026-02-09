# Seedance 前端项目

这是一个基于 React 的前端项目，使用了 protx-soramv 项目的基础架构。

## 技术栈

- **前端框架**: React 18.3.1
- **UI 组件库**: Ant Design 5.23.2
- **样式解决方案**: Styled Components 5.3.11
- **路由**: React Router DOM 6.3.0
- **国际化**: React Intl 7.1.6
- **网络请求**: Axios 1.7.9
- **状态管理**: React Hooks, Redux Toolkit, Zustand
- **构建工具**: Create React App (react-scripts 5.0.1)

## 项目结构

```
seedance/
├── public/              # 静态资源文件
│   ├── index.html      # HTML 模板
│   ├── manifest.json   # PWA 配置
│   └── ...
├── src/
│   ├── api/            # API 接口
│   │   └── axios.js    # Axios 实例配置
│   ├── contexts/       # React Context
│   │   └── LocaleContext.js  # 国际化上下文
│   ├── locales/        # 国际化文件
│   │   ├── zh_CN.js    # 简体中文
│   │   ├── en_US.js    # 英文
│   │   └── ...         # 其他语言
│   ├── styles/         # 全局样式
│   │   └── GlobalStyles.js
│   ├── utils/          # 工具函数
│   │   └── crypto.js   # 加密工具
│   ├── App.js          # 根组件
│   ├── index.js        # 入口文件
│   └── tailwind.config.js  # Tailwind 配置
├── package.json        # 项目依赖
├── tsconfig.json       # TypeScript 配置
└── babel-plugin-macros.config.js  # Babel 宏配置
```

## 安装依赖

```bash
# 使用 yarn（推荐）
yarn install

# 或使用 npm
npm install
```

## 启动开发服务器

```bash
yarn start
# 或
npm start
```

应用将在 http://localhost:3000 启动

## 构建生产版本

```bash
yarn build
# 或
npm run build
```

## 功能特性

### 已配置的基础功能

- ✅ 路由系统（React Router）
- ✅ 国际化支持（11种语言）
- ✅ 主题切换（深色/浅色模式）
- ✅ Ant Design 全局配置
- ✅ Axios 请求拦截器
- ✅ 文件加密工具（CryptoJS）
- ✅ 全局样式配置
- ✅ TypeScript 支持

### 国际化支持

项目支持以下语言：
- 简体中文 (zh_CN)
- 英文 (en_US)
- 日文 (ja_JP)
- 韩文 (ko_KR)
- 法文 (fr_FR)
- 德文 (de_DE)
- 西班牙文 (es_ES)
- 意大利文 (it_IT)
- 葡萄牙文 (pt_PT)
- 俄文 (ru_RU)
- 阿拉伯文 (ar_SA)

## 环境变量

创建 `.env` 文件并配置：

```env
REACT_APP_API_URL=http://localhost:8080
```

## 开发规范

- 组件命名使用 PascalCase
- 文件命名使用 PascalCase（组件）或 camelCase（工具函数）
- 函数和变量命名使用 camelCase
- 常量命名使用 UPPER_SNAKE_CASE
- 响应式布局使用 Bootstrap 栅格系统
- 样式优先使用 styled-components 或 Ant Design 样式系统

## 注意事项

- 本项目基于 protx-soramv 的基础架构创建
- 所有业务逻辑需要根据实际需求进行开发
- 请遵循项目的开发规范和最佳实践

## 许可证

© 2024 Seedance Team. All rights reserved.
