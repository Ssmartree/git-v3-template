# NPM Scripts 命令速查表

## 📋 命令总览

| 命令 | 说明 | 使用场景 |
|------|------|----------|
| `pnpm dev` | 启动开发服务器 | 🔥 日常开发 |
| `pnpm build` | 类型检查 + 构建 | 🚀 部署前构建 |
| `pnpm preview` | 预览生产构建 | 👀 验证构建结果 |
| `pnpm lint` | 代码检查 | 🔍 提交前检查 |
| `pnpm lint:fix` | 自动修复代码 | 🔧 快速修复问题 |
| `pnpm lint:stylelint` | 样式检查 | 🎨 修复样式问题 |
| `pnpm type-check` | TypeScript 检查 | 📝 类型验证 |

---

## 🚀 开发命令

### `pnpm dev`

**完整命令**：`vite`

**作用**：启动 Vite 开发服务器

**功能**：
- ⚡ 快速冷启动（ESBuild 预构建）
- 🔥 模块热替换（HMR）
- 📦 按需编译（只编译当前路由）
- 🌐 自动打开浏览器

**输出**：
```bash
VITE v5.3.1  ready in 358 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**使用场景**：
```bash
# 日常开发
pnpm dev

# 指定端口
vite --port 3000

# 暴露到局域网
vite --host
```

---

### `pnpm build`

**完整命令**：`run-p type-check "build-only {@}" --`

**作用**：并行执行类型检查和生产构建

**工作流程**：
```
pnpm build
    ↓
┌───────────┬───────────┐
│ type-check│build-only │  ← 并行执行
└───────────┴───────────┘
    ↓           ↓
检查类型    Vite 构建
    ↓           ↓
  通过 ✅     生成 dist/
    └───────────┘
         ↓
      构建完成 🎉
```

**输出**：
```bash
# Type Check
✓ TypeScript compiled successfully

# Build
vite v5.3.1 building for production...
✓ 156 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-C202IMkg.js   142.35 kB │ gzip: 45.67 kB
✓ built in 3.21s
```

**使用场景**：
```bash
# 生产构建（推荐）
pnpm build

# 只构建（跳过类型检查）
pnpm build-only

# 查看构建分析
pnpm build
# 然后打开 stats.html
```

---

### `pnpm build-only`

**完整命令**：`vite build`

**作用**：仅执行 Vite 构建，不做类型检查

**优势**：
- ⚡ 更快的构建速度
- 🎯 适合快速测试构建结果

**何时使用**：
```bash
# ✅ 已经单独做过类型检查
pnpm type-check
pnpm build-only

# ✅ CI/CD 流水线分步骤
# step 1: type check
# step 2: build only

# ❌ 不推荐：跳过类型检查直接部署
```

---

### `pnpm preview`

**完整命令**：`vite preview`

**作用**：预览生产构建的结果

**前置条件**：必须先执行 `pnpm build`

**使用流程**：
```bash
# 1. 构建
pnpm build

# 2. 预览
pnpm preview

# 输出：
➜  Local:   http://localhost:4173/
➜  Network: use --host to expose
```

**使用场景**：
- ✅ 验证生产构建是否正常
- ✅ 测试路由、静态资源
- ✅ 检查代码压缩、Tree Shaking 效果

**注意事项**：
```bash
# ❌ 错误：未先构建
pnpm preview
# Error: Cannot find dist directory

# ✅ 正确：先构建再预览
pnpm build && pnpm preview
```

---

## 🔍 代码检查命令

### `pnpm lint`

**完整命令**：`eslint .`

**作用**：检查所有文件的 ESLint 规则（不自动修复）

**检查内容**：
- ❌ 语法错误
- ❌ 代码规范违规
- ❌ 潜在的 Bug
- ❌ 不符合最佳实践

**输出示例**：
```bash
D:\project\src\App.vue
  12:7  error  'a' is assigned a value but never used  no-unused-vars
  15:3  error  Missing semicolon                        semi

✖ 2 problems (2 errors, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

**使用场景**：
```bash
# 检查所有文件
pnpm lint

# 检查特定文件
eslint src/App.vue

# 检查特定目录
eslint src/components/
```

---

### `pnpm lint:fix`

**完整命令**：`eslint . --fix`

**作用**：检查并**自动修复** ESLint 问题

**能修复的问题**：
- ✅ 缺失的分号
- ✅ 单引号 vs 双引号
- ✅ 缩进问题
- ✅ 多余的空格
- ✅ 导入语句排序

**不能修复的问题**：
- ❌ 逻辑错误
- ❌ 未使用的变量（需要手动删除）
- ❌ 复杂的代码规范问题

**输出示例**：
```bash
D:\project\src\App.vue
  12:7  error  'a' is assigned a value but never used  no-unused-vars

✖ 1 problem (1 error, 0 warnings)

# 其他问题已自动修复 ✅
```

**使用场景**：
```bash
# 修复所有文件
pnpm lint:fix

# 提交前快速修复
pnpm lint:fix
git add .
git commit

# VS Code 保存时自动修复
# 配置 .vscode/settings.json:
# "editor.codeActionsOnSave": {
#   "source.fixAll.eslint": true
# }
```

---

### `pnpm lint:stylelint`

**完整命令**：`stylelint "**/*.{css,scss,less,vue,html}" --fix`

**作用**：检查并自动修复样式文件

**检查内容**：
- 🎨 CSS 语法错误
- 🎨 属性排序（定位 → 盒模型 → 排版 → 视觉）
- 🎨 命名规范
- 🎨 现代 CSS 语法
- 🎨 Vue 深度选择器（:deep）

**能修复的问题**：
- ✅ 属性自动排序
- ✅ 缺失的分号
- ✅ 颜色格式统一
- ✅ 空行、缩进

**输出示例**：
```bash
src/App.vue
 25:3  ✖  Expected "color" to come before "margin"  order/properties-order

✖ 1 problem (1 error, 0 warnings)
  1 error potentially fixable with the `--fix` option.

# 执行 --fix 后自动修复 ✅
```

**使用场景**：
```bash
# 修复所有样式文件
pnpm lint:stylelint

# 检查特定文件
stylelint src/App.vue --fix

# 检查 SCSS 文件
stylelint "src/**/*.scss" --fix
```

**自动排序效果**：
```scss
// ❌ 修复前（属性顺序混乱）
.element {
  color: red;
  position: absolute;
  margin: 10px;
  top: 0;
}

// ✅ 修复后（自动排序）
.element {
  position: absolute;  // 1. 定位
  top: 0;              // 1. 定位
  margin: 10px;        // 2. 盒模型
  color: red;          // 3. 排版
}
```

---

### `pnpm type-check`

**完整命令**：`vue-tsc --build --force`

**作用**：TypeScript 类型检查

**参数说明**：
- `--build`：增量构建模式（更快）
- `--force`：强制重新检查所有文件

**检查内容**：
- 📝 类型错误
- 📝 类型不匹配
- 📝 缺失的类型声明
- 📝 any 类型使用

**输出示例**：
```bash
# ✅ 检查通过
src/App.vue:12:7 - error TS2322: Type 'string' is not assignable to type 'number'.

12   const count: number = "hello"
         ~~~~~

Found 1 error in src/App.vue:12

# ❌ 检查失败
```

**使用场景**：
```bash
# 构建前检查
pnpm type-check

# 持续监听（开发模式）
vue-tsc --watch

# CI/CD 流水线
pnpm type-check || exit 1
```

---

### `pnpm lint:lint-staged`

**完整命令**：`lint-staged`

**作用**：对 Git 暂存区的文件执行 lint 检查

**触发时机**：
```bash
git add .
git commit  # ← 自动触发 lint-staged
```

**工作流程**：
```
git commit
    ↓
Husky pre-commit
    ↓
lint-staged
    ↓
读取 lint-staged.config.mjs
    ↓
匹配暂存文件
    ↓
┌──────────┬──────────┬──────────┐
│ .js 文件 │ .vue 文件│ .scss 文件│
│ eslint   │ eslint   │stylelint │
└──────────┴──────────┴──────────┘
    ↓
检查通过 ✅ → 提交成功
检查失败 ❌ → 中止提交
```

**优势**：
- ⚡ 只检查修改的文件（速度快）
- 🎯 避免提交有问题的代码
- 🔒 强制代码质量

**使用场景**：
```bash
# 手动触发（调试用）
pnpm lint:lint-staged

# 通常由 Git Hooks 自动触发
git add src/App.vue
git commit -m "feat: 新功能"
# ↑ 自动执行 lint-staged
```

---

## 🔧 自动执行的命令

### `preinstall`

**完整命令**：`npx only-allow pnpm`

**作用**：强制使用 pnpm 安装依赖

**执行时机**：任何 `npm install` / `yarn install` 之前

**行为**：
```bash
# ❌ 使用 npm
npm install
# Error: This repository requires using pnpm

# ❌ 使用 yarn
yarn install
# Error: This repository requires using pnpm

# ✅ 使用 pnpm
pnpm install
# 正常安装
```

**为什么需要**：
- ✅ 统一团队包管理器
- ✅ 避免 lock 文件冲突
- ✅ 利用 pnpm 的高效存储

---

### `prepare`

**完整命令**：`git init && husky install`

**作用**：初始化 Git 仓库并安装 Husky 钩子

**执行时机**：`pnpm install` 之后自动执行

**工作流程**：
```bash
pnpm install
    ↓
安装依赖完成
    ↓
自动执行 prepare
    ↓
git init           # 初始化 Git（如果还没有）
    ↓
husky install      # 安装 Git Hooks
    ↓
创建 .husky/ 目录
    ↓
链接 .git/hooks/
    ↓
完成 ✅
```

**生成的文件**：
```
.husky/
├── _/
│   └── husky.sh
├── pre-commit     # 提交前钩子
└── commit-msg     # 提交信息钩子
```

---

## 📊 命令依赖关系

```
开发命令
├── pnpm dev                     # 独立命令
├── pnpm build
│   ├── pnpm type-check         # 并行执行
│   └── pnpm build-only         # 并行执行
└── pnpm preview                # 依赖 build

检查命令
├── pnpm lint                   # 独立命令
├── pnpm lint:fix               # 独立命令
├── pnpm lint:stylelint         # 独立命令
├── pnpm type-check             # 独立命令
└── pnpm lint:lint-staged       # 由 Git Hooks 调用
    ├── eslint --fix           # 针对 JS/TS/Vue
    ├── stylelint --fix        # 针对 CSS/SCSS
    └── prettier --write       # 针对 MD
```

---

## 🎯 常用场景

### 场景 1：开始开发

```bash
# 1. 克隆项目
git clone <repository>

# 2. 安装依赖
pnpm install
# ↑ 自动执行 prepare，安装 Husky

# 3. 启动开发服务器
pnpm dev
```

### 场景 2：提交代码

```bash
# 1. 修改代码
vim src/App.vue

# 2. 添加到暂存区
git add .

# 3. 提交（自动触发检查）
git commit -m "feat: 新功能"
# ↓ 自动执行：
# - lint-staged（检查修改的文件）
# - commitlint（验证提交信息格式）

# ✅ 检查通过 → 提交成功
# ❌ 检查失败 → 修复后重新提交
```

### 场景 3：手动检查

```bash
# 1. 检查代码
pnpm lint

# 2. 自动修复
pnpm lint:fix

# 3. 检查样式
pnpm lint:stylelint

# 4. 类型检查
pnpm type-check
```

### 场景 4：构建部署

```bash
# 1. 完整构建（类型检查 + 构建）
pnpm build

# 2. 本地预览
pnpm preview

# 3. 部署 dist/ 目录
```

---

## 🔥 快捷命令推荐

### 提交前完整检查

```bash
# 方式 1：一步到位（并行执行）
pnpm lint:fix && pnpm lint:stylelint && pnpm type-check

# 方式 2：分步检查
pnpm lint:fix           # 修复代码
pnpm lint:stylelint     # 修复样式
pnpm type-check         # 类型检查
```

### 开发 + 类型检查（双终端）

```bash
# 终端 1：开发服务器
pnpm dev

# 终端 2：类型检查（监听模式）
vue-tsc --watch
```

### 构建 + 预览（一条命令）

```bash
pnpm build && pnpm preview
```

---

## 📝 别名配置（可选）

在 `package.json` 中添加更多快捷命令：

```json
{
  "scripts": {
    "check": "run-p lint type-check",
    "check:fix": "run-p lint:fix lint:stylelint",
    "build:preview": "pnpm build && pnpm preview",
    "clean": "rm -rf dist node_modules"
  }
}
```

---

## 🎉 总结

### 日常开发

```bash
pnpm dev              # 启动开发
pnpm lint:fix         # 修复代码
git commit            # 自动检查
```

### 部署上线

```bash
pnpm build            # 类型检查 + 构建
pnpm preview          # 本地预览
# 部署 dist/
```

### 团队协作

- ✅ 所有人使用 `pnpm`（preinstall 强制）
- ✅ 提交前自动检查（Husky + lint-staged）
- ✅ 提交信息规范（commitlint）

---

**相关文档**：
- 完整配置说明：`ENGINEERING_ANALYSIS.md`
- 自动发现机制：`CONFIG_AUTO_DISCOVERY.md`
- 快速参考：`ENGINEERING_CHEATSHEET.md`

