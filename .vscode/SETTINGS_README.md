# VS Code 工作区设置说明

## 📋 配置分类

### 1️⃣ 基础配置

- **TypeScript SDK**: 使用项目本地 TS 版本（保证版本一致）
- **包管理器**: 强制使用 pnpm
- **Tab 缩进**: 2 个空格
- **换行符**: LF (Linux/Mac 风格)

### 2️⃣ 性能优化

```json
{
  "vue.server.maxOldSpaceSize": 4096, // Vue 服务 4GB 内存
  "vue.server.hybridMode": true, // 混合模式提升性能
  "typescript.tsserver.maxTsServerMemory": 4096 // TS 服务 4GB 内存
}
```

💡 **大型项目保存文件慢时开启**

### 3️⃣ 编辑器增强

- **括号对颜色**: 不同层级的括号显示不同颜色
- **括号对参考线**: 显示括号配对的垂直线
- **Vue 提示**: 显示缺失的 props、自动插入 .value

### 4️⃣ 文件管理

- **搜索排除**: 不搜索 node_modules、dist、日志文件
- **文件隐藏**: 隐藏不常用的文件（index.html、README.md）
- **监视器排除**: 减少文件监视，降低 CPU 占用

### 5️⃣ 代码检查

```json
{
  "eslint.useFlatConfig": true, // ESLint 9.x 新格式
  "stylelint.enable": true, // 启用 Stylelint
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit", // 保存时修复 ESLint
    "source.fixAll.stylelint": "explicit" // 保存时修复 Stylelint
  }
}
```

### 6️⃣ 格式化配置

- **禁用 Prettier**: 使用 ESLint 统一格式化
- **关闭自动格式化**: 通过 codeActionsOnSave 控制
- **Vue 使用 Volar**: Vue 文件专用格式化器

### 7️⃣ TypeScript 内联提示

显示代码中的类型信息（不修改代码）：

- 函数返回类型
- 参数名称和类型
- 变量类型
- 枚举值

### 8️⃣ 文件嵌套

相关配置文件折叠显示：

- `package.json` 下嵌套 `pnpm-lock.yaml`、`.gitignore` 等
- `commitlint.config.mjs` 下嵌套所有 lint 配置
- `vite.config.ts` 下嵌套 `tsconfig.json`、`uno.config.ts`

---

## 🎯 核心功能

### ✅ 保存时自动修复

文件保存时自动执行：

1. ESLint 检查并修复代码问题
2. Stylelint 检查并修复样式问题
3. 不整理导入语句（避免冲突）

### ✅ 全语言支持

ESLint 支持检查的文件类型：

- JavaScript/TypeScript
- Vue/HTML
- JSON/YAML/TOML
- CSS/SCSS/Less
- Markdown
- GraphQL
- Astro

### ✅ 智能提示

- **路径提示**: `@/` 自动映射到 `src/`
- **类型提示**: 显示参数、返回值类型
- **颜色高亮**: CSS 颜色值显示色块

---

## ⚙️ 重要配置解释

### Q: 为什么禁用 Prettier？

A: 使用 ESLint 统一管理代码格式，避免冲突

### Q: 为什么关闭自动格式化？

A: 通过 `codeActionsOnSave` 精确控制格式化时机

### Q: 为什么隐藏样式规则警告？

A: 保持编辑器整洁，错误仍会自动修复

### Q: 为什么禁用 CSS 内置验证？

A: Stylelint 提供更强大的样式检查

### Q: 文件嵌套有什么用？

A: 简化文件树，相关配置折叠在一起

---

## 🔧 自定义配置

### 修改 Tab 大小

```json
{
  "editor.tabSize": 4 // 改为 4 个空格
}
```

### 启用自动整理导入

```json
{
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit"
  }
}
```

### 修改文件嵌套规则

```json
{
  "explorer.fileNesting.patterns": {
    "自定义主文件": "嵌套文件1,嵌套文件2"
  }
}
```

---

## 💡 推荐设置

### VS Code 全局设置

建议在全局 `settings.json` 中添加：

```json
{
  "files.autoSave": "onFocusChange", // 焦点切换时自动保存
  "editor.minimap.enabled": false, // 关闭小地图
  "workbench.tree.indent": 20, // 增大文件树缩进
  "editor.fontSize": 14 // 字体大小
}
```

---

## 📊 配置优先级

1. **工作区设置** (.vscode/settings.json) ← 当前文件
2. **用户设置** (全局 settings.json)
3. **默认设置**

工作区设置会覆盖用户设置！

---

## 🎉 效果展示

### 保存时自动修复

```javascript
// 保存前（有问题）
const a = 1,
  b = 2;
let c = 3;

// 保存后（自动修复）
const a = 1;
const b = 2;
let c = 3;
```

### TypeScript 内联提示

```typescript
// 代码中显示类型提示（灰色文字）
function add(a, b) {
  // (a: number, b: number): number
  return a + b;
}
```

### 文件嵌套效果

```
📦 package.json
  ├── 📄 pnpm-lock.yaml
  ├── 📄 .gitignore
  └── 📄 .npmrc
```

---

**配置已优化，开箱即用！** ✨
