# 📚 项目文档索引

项目所有配置和工程化文档的导航目录。

---

## 🎯 快速开始

刚接触项目？从这里开始：

1. 📖 **[NPM Scripts 命令速查表](SCRIPTS_REFERENCE.md)** ⭐ 推荐首读
   - 所有 npm 命令的详细说明
   - 使用场景和示例
   - 常见开发流程

2. 🔧 **[工程化配置速查表](ENGINEERING_CHEATSHEET.md)**
   - 一页纸看懂所有配置
   - 常用命令和规则
   - FAQ 快速解答

---

## 📂 配置文件说明

### 核心配置

| 文件 | 说明 | 详细文档 |
|------|------|----------|
| **package.json** | NPM 包配置、脚本命令 | ✅ 已添加注释 |
| **vite.config.ts** | Vite 构建配置 | [工程化分析](ENGINEERING_ANALYSIS.md#4-vite-构建配置) |
| **tsconfig.json** | TypeScript 编译配置 | [工程化分析](ENGINEERING_ANALYSIS.md) |

### 代码检查

| 文件 | 说明 | 详细文档 |
|------|------|----------|
| **eslint.config.mjs** | ESLint 代码检查 | [ESLint 对比](ESLINT_CONFIG_COMPARISON.md) |
| **eslint.config.enhanced.mjs** | ESLint 增强版（备选） | [ESLint 对比](ESLINT_CONFIG_COMPARISON.md) |
| **stylelint.config.mjs** | Stylelint 样式检查 | [Stylelint 对比](STYLELINT_COMPARISON.md) |
| **stylelint.config.enhanced.mjs** | Stylelint 增强版（备选） | [Stylelint 对比](STYLELINT_COMPARISON.md) |

### Git 工作流

| 文件 | 说明 | 详细文档 |
|------|------|----------|
| **lint-staged.config.mjs** | Git 暂存区文件检查 | ✅ 已添加注释 |
| **commitlint.config.mjs** | Git 提交信息规范 | [工程化分析](ENGINEERING_ANALYSIS.md#2-提交信息规范) |
| **.husky/** | Git Hooks 配置 | [自动发现机制](CONFIG_AUTO_DISCOVERY.md) |

### 样式相关

| 文件 | 说明 | 详细文档 |
|------|------|----------|
| **uno.config.ts** | UnoCSS 原子化 CSS | [工程化分析](ENGINEERING_ANALYSIS.md#5-unocss-原子化-css-配置) |
| **.editorconfig** | 编辑器统一配置 | [工程化分析](ENGINEERING_ANALYSIS.md#6-编辑器配置) |

### VS Code 配置

| 文件 | 说明 | 详细文档 |
|------|------|----------|
| **.vscode/extensions.json** | 推荐插件列表 | ✅ 已添加注释 + [插件说明](.vscode/EXTENSIONS_README.md) |
| **.vscode/settings.json** | 工作区设置 | ✅ 已添加注释 + [设置说明](.vscode/SETTINGS_README.md) |

---

## 📖 专题文档

### 1. 工程化配置

| 文档 | 内容 | 适合人群 |
|------|------|----------|
| **[ENGINEERING_ANALYSIS.md](ENGINEERING_ANALYSIS.md)** | 完整的工程化配置分析 | 🎯 想深入了解配置的开发者 |
| **[ENGINEERING_CHEATSHEET.md](ENGINEERING_CHEATSHEET.md)** | 工程化配置速查表 | ⚡ 快速查阅配置的开发者 |

**包含内容**：
- 架构设计
- 所有配置文件详解
- 工作流程
- 优先级规则
- 最佳实践
- 快速开始指南

---

### 2. ESLint 配置

| 文档 | 内容 | 适合人群 |
|------|------|----------|
| **[ESLINT_CONFIG_COMPARISON.md](ESLINT_CONFIG_COMPARISON.md)** | ESLint 配置对比分析 | 🔍 需要选择配置方案 |
| **[ESLINT_QUICK_REFERENCE.md](ESLINT_QUICK_REFERENCE.md)** | ESLint 快速参考 | ⚡ 快速了解差异 |

**包含内容**：
- 原版 vs 增强版对比
- 新增规则详解
- 迁移步骤
- 使用建议

---

### 3. Stylelint 配置

| 文档 | 内容 | 适合人群 |
|------|------|----------|
| **[STYLELINT_COMPARISON.md](STYLELINT_COMPARISON.md)** | Stylelint 配置对比分析 | 🔍 需要选择配置方案 |

**包含内容**：
- 原版 vs 增强版对比
- CSS 属性排序逻辑
- Vue 特殊语法支持
- 迁移指南

---

### 4. 配置文件自动发现

| 文档 | 内容 | 适合人群 |
|------|------|----------|
| **[CONFIG_AUTO_DISCOVERY.md](CONFIG_AUTO_DISCOVERY.md)** | 配置文件自动发现详解 | 📚 想了解底层原理 |
| **[CONFIG_DISCOVERY_QUICK.md](CONFIG_DISCOVERY_QUICK.md)** | 自动发现快速参考 | ⚡ 快速了解机制 |
| **[CONFIG_FLOW_DIAGRAM.md](CONFIG_FLOW_DIAGRAM.md)** | 自动发现流程图 | 📊 喜欢看图的开发者 |

**解答问题**：
- ❓ 为什么配置文件没有被 import 却能生效？
- ❓ Cosmiconfig 是什么？
- ❓ 配置文件的搜索顺序是什么？
- ❓ Husky、lint-staged、commitlint 如何协作？

---

### 5. NPM Scripts 命令

| 文档 | 内容 | 适合人群 |
|------|------|----------|
| **[SCRIPTS_REFERENCE.md](SCRIPTS_REFERENCE.md)** | NPM Scripts 完整参考 | ⭐ 所有开发者 |

**包含内容**：
- 所有命令详解
- 参数说明
- 使用场景
- 输出示例
- 常见问题

---

## 🔄 文档关系图

```
快速入门
    ↓
SCRIPTS_REFERENCE.md （命令速查）
    ↓
ENGINEERING_CHEATSHEET.md （配置速查）
    ↓
┌─────────────────┬─────────────────┬─────────────────┐
↓                 ↓                 ↓                 ↓
详细分析         ESLint           Stylelint        自动发现
    ↓                ↓                 ↓                 ↓
ENGINEERING_      ESLINT_          STYLELINT_       CONFIG_AUTO_
ANALYSIS.md       CONFIG_          COMPARISON.md    DISCOVERY.md
                  COMPARISON.md
                      ↓                                  ↓
                  ESLINT_QUICK_                    CONFIG_DISCOVERY_
                  REFERENCE.md                     QUICK.md
                                                         ↓
                                                   CONFIG_FLOW_
                                                   DIAGRAM.md
```

---

## 🎯 根据需求选择文档

### 我是新人，想快速上手

```
1. 📖 SCRIPTS_REFERENCE.md       - 了解所有命令
2. 🔧 ENGINEERING_CHEATSHEET.md  - 速查配置规则
3. 🚀 开始开发！
```

### 我想了解工程化配置

```
1. 🔧 ENGINEERING_CHEATSHEET.md  - 快速浏览
2. 📚 ENGINEERING_ANALYSIS.md    - 深入学习
3. 🔍 具体配置文件（按需查阅）
```

### 我想优化 ESLint 配置

```
1. 📊 ESLINT_CONFIG_COMPARISON.md - 对比两个版本
2. ⚡ ESLINT_QUICK_REFERENCE.md   - 快速决策
3. ✅ 选择并应用配置
```

### 我想了解配置文件如何被加载

```
1. ⚡ CONFIG_DISCOVERY_QUICK.md   - 快速了解
2. 📊 CONFIG_FLOW_DIAGRAM.md      - 看流程图
3. 📚 CONFIG_AUTO_DISCOVERY.md    - 深入原理
```

### 我在使用命令时遇到问题

```
1. 📖 SCRIPTS_REFERENCE.md        - 查找对应命令
2. 查看命令说明、参数、输出
3. 查看常见问题和使用场景
```

---

## 📂 文档列表（按字母排序）

- [CONFIG_AUTO_DISCOVERY.md](CONFIG_AUTO_DISCOVERY.md) - 配置文件自动发现详解
- [CONFIG_DISCOVERY_QUICK.md](CONFIG_DISCOVERY_QUICK.md) - 配置文件自动发现快速参考
- [CONFIG_FLOW_DIAGRAM.md](CONFIG_FLOW_DIAGRAM.md) - 配置文件自动发现流程图
- [ENGINEERING_ANALYSIS.md](ENGINEERING_ANALYSIS.md) - 工程化配置完整分析
- [ENGINEERING_CHEATSHEET.md](ENGINEERING_CHEATSHEET.md) - 工程化配置速查表
- [ESLINT_CONFIG_COMPARISON.md](ESLINT_CONFIG_COMPARISON.md) - ESLint 配置对比
- [ESLINT_QUICK_REFERENCE.md](ESLINT_QUICK_REFERENCE.md) - ESLint 快速参考
- [SCRIPTS_REFERENCE.md](SCRIPTS_REFERENCE.md) - NPM Scripts 完整参考
- [STYLELINT_COMPARISON.md](STYLELINT_COMPARISON.md) - Stylelint 配置对比

---

## 🔖 配置文件速查

### 所有配置文件位置

```
项目根目录/
├── .editorconfig              # 编辑器配置
├── .gitignore                 # Git 忽略文件
├── .npmrc                     # NPM 配置
├── commitlint.config.mjs      # 提交信息规范
├── eslint.config.mjs          # ESLint 配置
├── eslint.config.enhanced.mjs # ESLint 增强版（备选）
├── lint-staged.config.mjs     # Git 暂存区检查
├── package.json               # NPM 包配置
├── stylelint.config.mjs       # Stylelint 配置
├── stylelint.config.enhanced.mjs # Stylelint 增强版（备选）
├── tsconfig.json              # TypeScript 主配置
├── tsconfig.app.json          # TypeScript 应用配置
├── tsconfig.node.json         # TypeScript Node 配置
├── uno.config.ts              # UnoCSS 配置
├── vite.config.ts             # Vite 构建配置
└── .husky/                    # Git Hooks
    ├── pre-commit             # 提交前钩子
    └── commit-msg             # 提交信息钩子
```

---

## 💡 推荐阅读顺序

### 第一天：快速上手

```
✅ SCRIPTS_REFERENCE.md          - 30分钟
✅ ENGINEERING_CHEATSHEET.md     - 15分钟
✅ 实践：运行项目，尝试各种命令
```

### 第二天：理解配置

```
✅ ENGINEERING_ANALYSIS.md       - 1小时
✅ CONFIG_DISCOVERY_QUICK.md     - 15分钟
✅ 实践：修改配置，观察效果
```

### 第三天：优化配置

```
✅ ESLINT_CONFIG_COMPARISON.md   - 30分钟
✅ STYLELINT_COMPARISON.md       - 30分钟
✅ 实践：选择并应用增强配置
```

### 随时查阅

```
📌 遇到命令问题         → SCRIPTS_REFERENCE.md
📌 忘记配置规则         → ENGINEERING_CHEATSHEET.md
📌 不理解自动加载       → CONFIG_FLOW_DIAGRAM.md
📌 想深入了解某个配置   → ENGINEERING_ANALYSIS.md
```

---

## 🔍 搜索技巧

### 在文档中查找内容

```bash
# 在所有文档中搜索关键词
grep -r "关键词" *.md

# 查找某个命令的说明
grep -A 10 "pnpm dev" SCRIPTS_REFERENCE.md

# 查找某个配置项
grep -r "eslint" ENGINEERING_*.md
```

---

## ❓ 常见问题快速定位

| 问题 | 查看文档 |
|------|----------|
| 如何启动项目？ | [SCRIPTS_REFERENCE.md](SCRIPTS_REFERENCE.md#pnpm-dev) |
| 如何修复代码错误？ | [SCRIPTS_REFERENCE.md](SCRIPTS_REFERENCE.md#pnpm-lintfix) |
| 提交时报错？ | [CONFIG_AUTO_DISCOVERY.md](CONFIG_AUTO_DISCOVERY.md) |
| 如何修改 ESLint 规则？ | [ESLINT_CONFIG_COMPARISON.md](ESLINT_CONFIG_COMPARISON.md) |
| 样式检查报错？ | [STYLELINT_COMPARISON.md](STYLELINT_COMPARISON.md) |
| 配置文件如何生效？ | [CONFIG_DISCOVERY_QUICK.md](CONFIG_DISCOVERY_QUICK.md) |
| 提交信息格式？ | [ENGINEERING_CHEATSHEET.md](ENGINEERING_CHEATSHEET.md#3-提交信息规范) |

---

## 📝 文档维护

### 文档更新记录

- 2025-11-03：添加 NPM Scripts 命令注释
- 2025-11-03：添加 lint-staged 配置注释
- 2025-11-03：创建配置自动发现文档
- 2025-11-03：创建工程化配置分析文档
- 2025-11-03：创建 ESLint/Stylelint 对比文档
- 2025-11-03：创建文档索引

### 贡献指南

如果您发现文档有误或需要补充，欢迎：
1. 直接修改对应的 Markdown 文件
2. 更新此索引文档
3. 提交 PR

---

## 🎉 总结

### 核心文档（必读）

⭐ **[SCRIPTS_REFERENCE.md](SCRIPTS_REFERENCE.md)** - 命令速查，日常开发必备
⭐ **[ENGINEERING_CHEATSHEET.md](ENGINEERING_CHEATSHEET.md)** - 配置速查，一页搞定

### 深度文档（推荐）

📚 **[ENGINEERING_ANALYSIS.md](ENGINEERING_ANALYSIS.md)** - 工程化配置完整解析
📚 **[CONFIG_AUTO_DISCOVERY.md](CONFIG_AUTO_DISCOVERY.md)** - 配置加载原理

### 对比文档（选择性阅读）

🔍 **[ESLINT_CONFIG_COMPARISON.md](ESLINT_CONFIG_COMPARISON.md)** - 需要优化 ESLint 时
🔍 **[STYLELINT_COMPARISON.md](STYLELINT_COMPARISON.md)** - 需要优化 Stylelint 时

---

**祝您开发愉快！** 🚀

