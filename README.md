# Luxmind Luxmind — 公司官网

> 在AI时代帮更多人把产品做明白

纯静态公司官网，HTML + CSS + JS，零框架依赖。

## 预览

在浏览器中打开 `index.html` 即可本地预览。

## 技术栈

- HTML5
- CSS3（CSS Variables、Grid、Flexbox、Animation）
- Vanilla JS（Intersection Observer、Scroll effects）
- Google Fonts（Inter + Noto Sans SC）

## 目录结构

```
company-website/
├── index.html    # 主页面
├── styles.css    # 样式表
├── main.js       # 交互脚本
└── README.md     # 说明文档
```

## 部署到 GitHub Pages

### 方法一：使用 `gh-pages` 分支（推荐）

```bash
# 1. 进入项目目录
cd projects/company-website

# 2. 初始化 Git（如果还没有）
git init
git add .
git commit -m "feat: Luxmind公司官网初版"

# 3. 创建 GitHub 仓库
gh repo create luxmind-website --public --source=. --push

# 4. 部署到 gh-pages 分支
git checkout -b gh-pages
git push origin gh-pages

# 5. 在 GitHub 仓库 Settings → Pages 中确认：
#    Source: Deploy from a branch
#    Branch: gh-pages → / (root)
```

部署后访问：`https://<your-username>.github.io/luxmind-website/`

### 方法二：使用 GitHub Actions（自动部署）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./projects/company-website
```

### 自定义域名

1. 在项目根目录添加 `CNAME` 文件，内容为你的域名（如 `luxmind.com`）
2. 在 DNS 服务商添加 CNAME 记录指向 `<username>.github.io`
3. 在 GitHub Pages Settings 中启用 HTTPS

## 设计说明

- **品牌色系**：深蓝紫（#6366f1 / #8b5cf6）、金（#f59e0b）、红（#ef4444）
- **设计风格**：暗色主题，Stripe/Linear 风格 — 简约、干净、科技感
- **响应式**：适配桌面端、平板、手机

## 内容板块

1. **Hero** — 品牌标语 + 行动号召
2. **产品矩阵** — 四款产品卡片 + 产品链路图
3. **关于** — 公司介绍 + 数据卡片
4. **团队** — Lucian + 3 AI Agent
5. **品牌理念** — 四个核心价值观
6. **CTA** — 底部行动号召
7. **Footer** — 导航 + 版权
