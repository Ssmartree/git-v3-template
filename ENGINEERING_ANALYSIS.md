# 📦 项目工程化配置分析

这是一个现代化的 **Vue 3 + TypeScript + Vite** 项目，配备了完整的前端工程化工具链。

---

## 🗂️ 配置文件架构图

```
项目工程化体系
├── 📝 代码规范 (Code Quality)
│   ├── eslint.config.mjs         # JavaScript/TypeScript 代码检查
│   ├── stylelint.config.mjs      # CSS/SCSS 样式检查
│   ├── .editorconfig             # 编辑器统一配置
│   └── tsconfig.*.json           # TypeScript 类型检查
│
├── 🔄 Git 工作流 (Git Workflow)
│   ├── commitlint.config.mjs     # Git 提交信息规范
│   ├── lint-staged.config.mjs    # Git 暂存区文件检查
│   ├── .gitignore                # Git 忽略文件
│   └── .husky/                   # Git Hooks 自动化
│
├── 🔧 构建工具 (Build Tools)
│   ├── vite.config.ts            # Vite 构建配置
│   ├── uno.config.ts             # UnoCSS 原子化 CSS
│   └── configs/                  # 自定义构建配置
│
└── 📦 包管理 (Package Management)
    ├── package.json              # 项目依赖和脚本
    ├── .npmrc                    # npm/pnpm 配置
    └── pnpm-lock.yaml            # 依赖锁定文件
```

---

## 📋 配置文件详解

### 1️⃣ commitlint.config.mjs - Git 提交信息规范

**作用**：规范 Git 提交信息格式，确保团队协作时提交历史清晰可读。

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',     // ✨ 新增功能
      'fix',      // 🐛 修复缺陷
      'docs',     // 📝 文档变更
      'style',    // 💄 代码格式（不影响功能）
      'refactor', // ♻️  代码重构
      'perf',     // ⚡ 性能优化
      'test',     // ✅ 测试相关
      'build',    // 📦 构建流程、依赖变更
      'ci',       // 👷 CI 配置
      'revert',   // ⏪ 回滚
      'chore',    // 🔧 其他修改
    ]]
  }
}
```

**配合工具**：
- `@commitlint/cli` - 提交信息检查命令行工具
- `husky` - 在 `commit-msg` 钩子中自动检查

**提交格式示例**：
```bash
feat: 添加用户登录功能
fix: 修复页面空白问题
docs: 更新 README 文档
```

**检查时机**：每次执行 `git commit` 时自动触发

---

### 2️⃣ eslint.config.mjs - JavaScript/TypeScript 代码检查

**作用**：统一代码风格，检测潜在错误，提升代码质量。

```javascript
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,    // 格式化 CSS、HTML
  unocss: true,        // UnoCSS 规则检查
  vue: true,           // Vue 3 规则
  isInEditor: false,   // 不在编辑器中自动删除未使用的导入
})
```

**核心特点**：
1. **使用 @antfu/eslint-config**
   - 由 Vue 核心团队成员 Anthony Fu 维护
   - 开箱即用的 Vue 3 + TypeScript 规范
   - 自动格式化支持

2. **自定义规则**：
   ```javascript
   rules: {
     'no-console': 'off',                          // 允许使用 console
     'vue/html-self-closing': 'off',               // 不强制自闭合标签
     'vue/component-name-in-template-casing': [    // 组件名使用 kebab-case
       'error', 'kebab-case'
     ]
   }
   ```

3. **忽略文件**：
   - `node_modules`、`.husky`、`/public` 等

**运行命令**：
```bash
pnpm lint          # 检查代码
pnpm lint:fix      # 自动修复
```

---

### 3️⃣ stylelint.config.mjs - CSS/SCSS 样式检查

**作用**：规范样式代码，统一 CSS 属性顺序，避免样式冲突。

```javascript
export default {
  extends: [
    'stylelint-config-standard',      // 标准 CSS 规则
    'stylelint-config-recess-order'   // 属性排序规则
  ],
  overrides: [
    {
      files: ['**/*.(css|html|vue)'],
      customSyntax: 'postcss-html'    // Vue 文件解析
    },
    {
      files: ['*.scss', '**/*.scss'],
      customSyntax: 'postcss-scss'    // SCSS 语法支持
    }
  ]
}
```

**核心功能**：

1. **属性排序**：自动按照最佳实践排序 CSS 属性
   ```css
   /* ❌ 错误：顺序混乱 */
   .box {
     color: red;
     display: flex;
     padding: 10px;
     width: 100px;
   }
   
   /* ✅ 正确：自动排序 */
   .box {
     display: flex;
     width: 100px;
     padding: 10px;
     color: red;
   }
   ```

2. **Vue 深度选择器支持**：
   ```javascript
   ignorePseudoClasses: ['global', 'deep']
   ignorePseudoElements: ['v-deep', ':deep']
   ```

3. **忽略特殊语法**：
   - Tailwind CSS: `@tailwind`, `@apply`
   - SCSS: `@mixin`, `@include`, `@extend`

**运行命令**：
```bash
pnpm lint:stylelint  # 检查并修复样式
```

---

### 4️⃣ lint-staged.config.mjs - Git 暂存区文件检查

**作用**：只检查 Git 暂存区（即将提交）的文件，提升检查效率。

```javascript
export default {
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],      // JS/TS 文件
  '*.json': ['eslint --fix'],                  // JSON 文件
  '*.vue': ['eslint --fix'],                   // Vue 文件
  '*.{scss,less,html}': ['stylelint --fix'],   // 样式文件
  '*.md': ['prettier --write']                 // Markdown 文件
}
```

**工作流程**：
```
git add .
    ↓
执行 lint-staged
    ↓
对暂存文件运行对应的检查工具
    ↓
自动修复问题
    ↓
如果无法自动修复，阻止提交
```

**配合工具**：
- `husky` 的 `pre-commit` 钩子
- 在 `git commit` 之前自动执行

**运行命令**：
```bash
pnpm lint:lint-staged  # 手动运行
```

**优势**：
- ✅ 只检查要提交的文件（不是全项目）
- ✅ 速度快
- ✅ 提交前自动修复代码格式

---

### 5️⃣ .editorconfig - 编辑器统一配置

**作用**：统一不同编辑器的代码格式，确保团队成员的编辑器行为一致。

```ini
[*]
charset = utf-8              # 字符编码
end_of_line = lf             # 换行符（Linux/Mac 风格）
insert_final_newline = true  # 文件末尾插入空行
indent_style = space         # 使用空格缩进
indent_size = 2              # 缩进 2 个空格
max_line_length = 130        # 最大行长度
trim_trailing_whitespace = true  # 删除行尾空格

[*.md]
max_line_length = off        # Markdown 不限制行长度
```

**支持的编辑器**：
- ✅ VS Code（需安装 EditorConfig 插件）
- ✅ WebStorm / IntelliJ IDEA（原生支持）
- ✅ Sublime Text（需插件）
- ✅ Vim / Neovim（需插件）

**作用场景**：
- 团队成员使用不同编辑器时，保证格式一致
- 新成员加入项目，编辑器自动应用项目规范

---

### 6️⃣ vite.config.ts - Vite 构建配置

**作用**：配置项目的构建、开发服务器、插件等。

```typescript
export default defineConfig({
  base: './',                    // 基础路径
  plugins: [                     // 插件列表
    vue(),                       // Vue 3 支持
    vueDevTools(),               // Vue DevTools
    UnoCSS(),                    // 原子化 CSS
    AutoImport({ ... }),         // 自动导入 API
    Components({ ... }),         // 自动导入组件
    visualizer({ ... })          // 打包分析
  ],
  resolve: {
    alias: {
      '@': fileURLToPath('./src') // @ 别名指向 src
    }
  },
  server: {
    proxy: { ... }               // 开发代理
  },
  build: {
    sourcemap: true,             // 生成 sourcemap
    rollupOptions: { ... }       // Rollup 配置
  }
})
```

**核心插件**：

1. **unplugin-auto-import**
   ```typescript
   // 无需手动导入
   const count = ref(0)           // 自动导入 ref
   const router = useRouter()     // 自动导入 useRouter
   ```

2. **unplugin-vue-components**
   ```vue
   <!-- 无需手动导入组件 -->
   <n-button>按钮</n-button>      <!-- 自动导入 NaiveUI 组件 -->
   ```

3. **rollup-plugin-visualizer**
   - 生成打包分析报告（`stats.html`）
   - 可视化依赖大小

4. **vite-plugin-compression**
   - Gzip 压缩
   - 减小部署文件体积

**构建优化**：
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor'  // 第三方库合并
        }
      }
    }
  }
}
```

---

### 7️⃣ uno.config.ts - UnoCSS 原子化 CSS

**作用**：配置原子化 CSS 引擎，按需生成样式。

```typescript
export default defineConfig({
  shortcuts: [
    ['center', 'flex justify-center items-center'],  // 快捷方式
    [/^size(\d+)$/, ([, c]) => `w${c} h${c}`]       // 动态规则
  ],
  rules: [
    [/^flex-([.\d]+)$/, ([_, num]) => ({ flex: num })] // 自定义规则
  ],
  presets: [
    presetUno(),                          // 默认预设
    presetIcons(),                        // 图标预设
    presetRemToPx({ baseFontSize: 4 })   // rem 转 px
  ]
})
```

**使用示例**：
```vue
<template>
  <!-- 传统方式 -->
  <div class="flex justify-center items-center"></div>
  
  <!-- 使用 shortcuts -->
  <div class="center"></div>
  
  <!-- 动态规则 -->
  <div class="size100"></div>  <!-- w100 h100 -->
  <div class="flex-1.5"></div> <!-- flex: 1.5 -->
</template>
```

**优势**：
- ✅ 按需生成，体积小
- ✅ 比 Tailwind CSS 更灵活
- ✅ 支持自定义规则

---

### 8️⃣ .npmrc - npm/pnpm 配置

**作用**：配置包管理器行为。

```ini
registry = https://registry.npmmirror.com  # 使用淘宝镜像
strict-peer-dependencies=false             # 不严格检查 peer 依赖
auto-install-peers=true                    # 自动安装 peer 依赖
shamefully-hoist=true                      # 提升依赖到根目录
```

**为什么使用 pnpm**：
1. **节省磁盘空间**：所有版本的包只存一份
2. **安装速度快**：比 npm/yarn 快 2-3 倍
3. **更严格**：避免幽灵依赖问题

**shamefully-hoist 的作用**：
- 解决某些包无法找到依赖的问题
- 将依赖提升到 `node_modules` 根目录

---

### 9️⃣ tsconfig.json - TypeScript 配置

**作用**：TypeScript 项目配置（采用 Project References 架构）。

```json
{
  "references": [
    { "path": "./tsconfig.node.json" },  // Node.js 环境（Vite 配置）
    { "path": "./tsconfig.app.json" }    // 应用代码环境
  ]
}
```

**分层架构**：
- `tsconfig.json` - 根配置
- `tsconfig.app.json` - 应用代码配置（`src/`）
- `tsconfig.node.json` - 构建工具配置（Vite 等）

**优势**：
- ✅ 分离应用代码和构建工具的类型定义
- ✅ 更精确的类型检查
- ✅ 编译性能更好

---

### 🔟 package.json - 项目元数据和脚本

**核心脚本**：

```json
{
  "scripts": {
    "dev": "vite",                         // 🚀 开发服务器
    "build": "run-p type-check \"build-only {@}\" --",  // 🏗️  构建
    "preview": "vite preview",             // 👁️  预览构建结果
    
    "preinstall": "npx only-allow pnpm",   // 🔒 强制使用 pnpm
    "prepare": "git init && husky install",// ⚙️  初始化 Git Hooks
    
    "type-check": "vue-tsc --build --force", // 🔍 TypeScript 类型检查
    "lint": "eslint .",                    // 🔧 代码检查
    "lint:fix": "eslint . --fix",          // 🛠️  自动修复
    "lint:stylelint": "stylelint ... --fix", // 💄 样式检查
    "lint:lint-staged": "lint-staged"      // 📝 暂存文件检查
  }
}
```

**关键配置**：
```json
{
  "type": "module",  // 使用 ES Modules
  "private": true    // 不发布到 npm
}
```

---

## 🔄 工作流程图

### Git 提交工作流

```
开发者编写代码
    ↓
git add .
    ↓
触发 pre-commit Hook (husky)
    ↓
执行 lint-staged
    ├─ eslint --fix      (JS/TS/Vue)
    ├─ stylelint --fix   (CSS/SCSS)
    └─ prettier --write  (Markdown)
    ↓
修复成功 → 继续
修复失败 → 阻止提交
    ↓
git commit -m "feat: 新功能"
    ↓
触发 commit-msg Hook
    ↓
执行 commitlint
    ↓
格式正确 → 提交成功 ✅
格式错误 → 阻止提交 ❌
```

### 开发流程

```
pnpm dev
    ↓
启动 Vite 开发服务器
    ↓
自动应用配置：
├─ .editorconfig   (编辑器格式)
├─ eslint          (实时代码检查)
├─ UnoCSS          (实时生成样式)
└─ Hot Module Replacement (热更新)
    ↓
保存文件
    ↓
自动格式化 (VS Code + ESLint)
    ↓
浏览器自动刷新
```

### 构建流程

```
pnpm build
    ↓
1. 运行 type-check (TypeScript 检查)
    ↓
2. 运行 build-only (Vite 构建)
    ├─ 编译 Vue 组件
    ├─ 编译 TypeScript
    ├─ 处理样式 (SCSS → CSS)
    ├─ 压缩代码 (esbuild)
    ├─ 代码分割 (Rollup)
    └─ Gzip 压缩
    ↓
3. 生成 dist/ 目录
    ├─ index.html
    ├─ assets/js/   (JavaScript)
    ├─ assets/css/  (样式)
    └─ assets/...   (其他资源)
    ↓
4. 生成 stats.html (打包分析)
```

---

## ⚙️ Husky Git Hooks

虽然项目中没有直接显示 `.husky/` 目录内容，但根据配置可以推断：

**pre-commit**：提交前检查
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint:lint-staged
```

**commit-msg**：提交信息检查
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

---

## 📊 配置文件优先级

当多个配置文件存在冲突时，优先级如下：

### ESLint
```
1. 命令行参数
2. 代码注释 (/* eslint-disable */)
3. eslint.config.mjs
```

### Stylelint
```
1. 命令行参数
2. /* stylelint-disable */
3. stylelint.config.mjs
```

### 编辑器配置
```
1. 项目 .editorconfig
2. 用户编辑器配置
3. 编辑器默认配置
```

---

## 🎯 最佳实践建议

### 1. 提交前检查

```bash
# 手动运行所有检查
pnpm lint              # ESLint
pnpm lint:stylelint    # Stylelint
pnpm type-check        # TypeScript

# 或者依赖 Git Hooks 自动检查
git commit -m "feat: ..."
```

### 2. 编辑器配置

**VS Code 推荐插件**：
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",           // ESLint
    "stylelint.vscode-stylelint",       // Stylelint
    "editorconfig.editorconfig",        // EditorConfig
    "vue.volar",                        // Vue 语言支持
    "antfu.unocss"                      // UnoCSS 智能提示
  ]
}
```

**VS Code settings.json**：
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.fixAll.stylelint": "explicit"
  },
  "editor.formatOnSave": true
}
```

### 3. 提交信息规范

```bash
# ✅ 推荐
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复页面白屏问题"
git commit -m "docs: 更新 README"

# ❌ 不推荐
git commit -m "update"
git commit -m "fix bug"
git commit -m "优化代码"
```

### 4. 依赖管理

```bash
# ✅ 使用 pnpm
pnpm install
pnpm add axios

# ❌ 不要混用
npm install   # 会被 preinstall 脚本阻止
yarn add xxx  # 会被 preinstall 脚本阻止
```

---

## 🚀 快速开始

### 初始化项目

```bash
# 1. 克隆项目
git clone <repo-url>

# 2. 安装依赖（必须使用 pnpm）
pnpm install

# 3. 初始化 Git Hooks
pnpm prepare

# 4. 启动开发服务器
pnpm dev
```

### 日常开发

```bash
# 开发
pnpm dev

# 检查代码
pnpm lint

# 修复代码
pnpm lint:fix

# 类型检查
pnpm type-check

# 构建
pnpm build

# 预览构建结果
pnpm preview
```

---

## 📖 总结

这个项目采用了现代化的前端工程化方案：

### 代码质量保障
- ✅ **ESLint** - JavaScript/TypeScript 代码检查
- ✅ **Stylelint** - CSS/SCSS 样式检查
- ✅ **TypeScript** - 类型安全
- ✅ **EditorConfig** - 编辑器统一

### 团队协作规范
- ✅ **Commitlint** - 提交信息规范
- ✅ **Lint-staged** - 提交前代码检查
- ✅ **Husky** - Git Hooks 自动化
- ✅ **只允许 pnpm** - 统一包管理器

### 开发效率提升
- ✅ **Auto Import** - 自动导入 API 和组件
- ✅ **UnoCSS** - 原子化 CSS，按需生成
- ✅ **Vite** - 快速的开发服务器和构建工具
- ✅ **Vue DevTools** - 调试工具

### 构建优化
- ✅ **代码分割** - 第三方库独立打包
- ✅ **Gzip 压缩** - 减小部署体积
- ✅ **Tree Shaking** - 移除未使用代码
- ✅ **打包分析** - 可视化依赖大小

这是一个**生产级别**的项目模板，适合中大型 Vue 3 项目开发！ 🎉

