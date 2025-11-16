# 风景探索墙 - 风景照片分享平台

一个基于 Next.js 和 TypeScript 的风景照片分享平台，用户可以上传、浏览、搜索和收藏美丽的风景照片。

## ✨ 功能特性

### 📸 照片管理
- **拖拽上传**: 支持拖拽上传 JPG、PNG、WebP 格式照片
- **实时预览**: 上传前可预览照片效果
- **照片信息**: 添加标题、地点、描述和标签
- **图片压缩**: 自动压缩上传的图片，优化加载速度

### 🏞️ 浏览体验
- **Masonry 瀑布流**: 采用 Pinterest 风格的瀑布流布局
- **懒加载**: 图片懒加载，提升页面性能
- **响应式设计**: 完美适配移动端、平板和桌面设备
- **无限滚动**: 流畅的无限滚动体验

### 🔍 搜索发现
- **智能搜索**: 支持按标题和地点搜索照片
- **分类筛选**: 按最新上传和最受欢迎排序
- **标签系统**: 通过标签发现相关照片

### 👥 社交互动
- **用户系统**: 注册、登录、个人资料管理
- **点赞收藏**: 点赞和收藏喜欢的照片
- **评论互动**: 在照片下发表评论
- **用户主页**: 查看用户的所有照片和资料

### 📱 移动端优化
- **PWA 支持**: 支持添加到主屏幕和离线访问
- **底部导航**: 移动端友好的底部导航栏
- **触摸优化**: 优化的触摸交互体验
- **性能优化**: 针对移动端进行性能优化

## 🛠️ 技术栈

- **前端框架**: Next.js 15 + React 18
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: React Hooks + Context
- **数据存储**: localStorage (开发阶段)
- **图片处理**: Canvas API (图片压缩)
- **UI 组件**: 自定义组件库

## 📦 安装和运行

### 环境要求
- Node.js 18.0.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/landscape-app.git
cd landscape-app
```

2. **安装依赖**
```bash
npm install
```

3. **开发环境运行**
```bash
npm run dev
```

4. **构建生产版本**
```bash
npm run build
npm start
```

## 🚀 使用说明

### 上传照片
1. 点击导航栏的"上传"按钮
2. 拖拽或点击选择照片文件
3. 填写照片信息（标题、地点、描述、标签）
4. 点击"发布照片"完成上传

### 浏览照片
1. 在首页浏览所有照片
2. 使用搜索功能查找特定照片
3. 点击照片查看详情
4. 可以点赞、收藏和评论

### 用户功能
1. 注册新账户或登录现有账户
2. 编辑个人资料和头像
3. 查看个人主页和上传的照片
4. 管理收藏的照片

## 📁 项目结构

```
landscape-app/
├── public/                    # 静态资源
│   ├── manifest.json         # PWA 配置文件
│   └── ...
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # 首页
│   │   ├── upload/           # 上传页面
│   │   ├── photo/            # 照片详情页
│   │   ├── user/             # 用户主页
│   │   ├── login/            # 登录页面
│   │   ├── search/           # 搜索页面
│   │   └── favorites/        # 收藏页面
│   ├── components/           # React 组件
│   │   ├── Navigation.tsx    # 导航栏
│   │   ├── PhotoCard.tsx     # 照片卡片
│   │   ├── MasonryGrid.tsx   # 瀑布流布局
│   │   ├── LazyImage.tsx     # 懒加载图片
│   │   ├── LoadingSpinner.tsx # 加载组件
│   │   └── ErrorBoundary.tsx # 错误边界
│   ├── lib/                  # 工具库
│   │   └── storage.ts        # 本地存储管理
│   ├── utils/                # 工具函数
│   │   └── index.ts          # 通用工具函数
│   ├── types/                # TypeScript 类型定义
│   │   └── index.ts          # 类型定义文件
│   └── styles/               # 样式文件
│       └── mobile.css        # 移动端样式
└── ...
```

## 🎨 设计特色

### 色彩方案
- 主色调：蓝色 (#2563eb) - 代表天空和海洋
- 辅助色：绿色 (#10b981) - 代表自然和生命
- 中性色：灰色系 - 提供良好的视觉层次

### 用户体验
- **简洁直观**: 清晰的界面布局和操作流程
- **响应迅速**: 优化的加载速度和交互响应
- **无障碍**: 支持键盘导航和屏幕阅读器
- **国际化**: 支持中文界面

## 🔧 开发计划

### 近期功能
- [ ] 图片上传到云端存储（Supabase）
- [ ] 用户头像上传功能
- [ ] 照片分类和标签管理
- [ ] 批量上传功能

### 中期规划
- [ ] 实时通知系统
- [ ] 照片编辑功能（滤镜、裁剪）
- [ ] 社交分享功能
- [ ] 多语言支持

### 长期目标
- [ ] AI 智能标签和描述
- [ ] 地图展示照片位置
- [ ] 摄影技巧分享社区
- [ ] 移动端 App 开发

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目维护者：[Your Name]
- 邮箱：your.email@example.com
- 项目主页：https://github.com/your-username/landscape-app

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
