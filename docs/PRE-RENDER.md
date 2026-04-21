# 预渲染说明（react-snap）

本站使用 **react-snap** 在构建阶段对部分路由做预渲染，让爬虫和首屏直接拿到带正确 `<title>`、`<meta>` 的 HTML，有利于 SEO。

## 已配置内容

1. **依赖**：`devDependencies` 中的 `react-snap`（构建后执行）。
2. **脚本**：`yarn build` 会先执行 `react-scripts build`，再自动执行 `postbuild` 即 `react-snap`。
3. **入口**：`src/index.js` 在检测到 `#root` 已有子节点时使用 `hydrateRoot`（React 18），否则使用 `createRoot().render()`。
4. **预渲染路由**（在 `package.json` 的 `reactSnap.include` 中）：
   - `/` 首页
   - `/login` `/signup`
   - `/help` `/feedback`
   - `/terms-of-service` `/privacy-policy` `/recharge-agreement`

## 使用方式

```bash
yarn build
```

构建完成后，`build/` 下会有：

- `index.html`：被替换为预渲染后的首页 HTML
- `login/index.html`、`signup/index.html` 等：对应路径的预渲染 HTML

部署时照常部署 `build/` 目录（如 Netlify 的 `publish = "build/"`）。

**Netlify**：已在 `netlify.toml` 中配置 `netlify-plugin-chromium`，构建时会安装 Chromium，供 react-snap（Puppeteer）使用。首次安装会多约 20–30 秒构建时间。  
用户或爬虫直接访问 `https://seedance2.cn/login` 时，会得到预渲染好的 HTML；随后前端脚本加载后会对该 DOM 做 hydrate，不会整页重刷。

## 可选：增加/减少预渲染路由

编辑 `package.json` 里的 `reactSnap.include` 数组，增加或删除路径即可。只写需要 SEO 或首屏体验的**公开**路径，登录后才能看的页面可不放进去。

## 若不想用预渲染

- 去掉 `scripts.postbuild`（删除 `"postbuild": "react-snap"`）。
- `src/index.js` 保留当前逻辑无害（有子节点就 hydrate，没有就 render）；若想恢复成只 render，可改回仅用 `createRoot(container).render(<App />)`。

## 和 SSR 的区别

| 方式       | 说明 |
|------------|------|
| **预渲染** | 构建时用无头浏览器跑一遍指定路由，生成静态 HTML 放到 `build/`，部署后仍是静态站，无需 Node 服务器。 |
| **SSR**    | 每次请求由服务器实时渲染 HTML（如 Next.js、Remix），需要运行 Node 或兼容的运行时。 |

当前方案是预渲染，无需改服务器或托管方式。
