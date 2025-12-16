# VS Code 推荐插件说明

## 📦 插件列表

| 插件                       | 作用                                 | 必需    |
| -------------------------- | ------------------------------------ | ------- |
| **Code Spell Checker**     | 拼写检查，检测代码中的单词拼写错误   | ⭐ 推荐 |
| **Image preview**          | 图片预览，在代码行号旁显示图片缩略图 | 可选    |
| **JSON to TS**             | JSON 转 TypeScript 类型定义          | 可选    |
| **Stylelint**              | CSS/SCSS 代码检查和自动修复          | ✅ 必需 |
| **EditorConfig**           | 统一编辑器配置（缩进、换行等）       | ✅ 必需 |
| **Color Highlight**        | 颜色高亮，在代码中显示颜色值         | 推荐    |
| **Prettier**               | 代码格式化工具                       | 可选    |
| **ESLint**                 | JavaScript/TypeScript 代码检查       | ✅ 必需 |
| **PostCSS**                | PostCSS 语法支持                     | 推荐    |
| **Iconify IntelliSense**   | Iconify 图标智能提示                 | 推荐    |
| **UnoCSS**                 | UnoCSS 智能提示和预览                | ✅ 必需 |
| **Vue - Official (Volar)** | Vue 3 官方语言支持                   | ✅ 必需 |

---

## 🚀 快速安装

打开项目后，VS Code 会自动提示安装推荐插件：

```
点击右下角弹窗 "Install All" 按钮
```

或手动安装：

```
Ctrl+Shift+P → Extensions: Show Recommended Extensions
```

---

## 💡 核心插件说明

### Vue - Official (Volar)

- Vue 3 官方语言服务
- 提供 TypeScript 类型检查
- 智能提示、自动补全
- 语法高亮、错误提示

### ESLint

- JavaScript/TypeScript 代码检查
- 自动修复代码问题
- 保存时自动格式化

### Stylelint

- CSS/SCSS/Vue 样式检查
- 自动排序 CSS 属性
- 保存时自动修复

### UnoCSS

- 原子化 CSS 智能提示
- 类名悬停预览
- 颜色高亮显示

### EditorConfig

- 统一团队编辑器配置
- 自动应用缩进、换行规则

---

## ⚙️ 配置说明

所有插件配置已在 `.vscode/settings.json` 中完成，无需额外配置。

### 关键配置

```json
{
  // 保存时自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.fixAll.stylelint": "explicit"
  },

  // ESLint 使用新版 Flat Config
  "eslint.useFlatConfig": true,

  // Stylelint 启用
  "stylelint.enable": true
}
```

---

## 🔍 插件作用展示

### 1. 拼写检查

```javascript
// ❌ 拼写错误会有波浪线提示
const mesage = "hello"; // message 拼写错误

// ✅ 正确拼写
const message = "hello";
```

### 2. 颜色高亮

```css
.class {
  color: #ff0000; /* 显示红色色块 */
  background: blue; /* 显示蓝色色块 */
}
```

### 3. 图标智能提示

```vue
<template>
  <!-- 输入 i-carbon: 会显示所有 Carbon 图标 -->
  <div class="i-carbon-user" />
</template>
```

### 4. UnoCSS 预览

```vue
<template>
  <!-- 悬停在类名上会显示生成的 CSS -->
  <div class="flex items-center justify-center" />
</template>
```

---

## 📝 推荐的 VS Code 设置

```json
{
  // 启用括号对颜色
  "editor.bracketPairColorization.enabled": true,

  // 启用括号对指南
  "editor.guides.bracketPairs": true,

  // 设置 Tab 大小为 2
  "editor.tabSize": 2,

  // 文件末尾自动换行
  "files.insertFinalNewline": true,

  // 使用 LF 换行符
  "files.eol": "\n"
}
```

---

## ❓ 常见问题

### Q: 插件装了但不生效？

A: 检查 `.vscode/settings.json` 中对应插件是否启用

### Q: ESLint 报错但保存不自动修复？

A: 确保 `editor.codeActionsOnSave` 配置正确

### Q: Volar 和 Vetur 冲突？

A: 卸载 Vetur，Vue 3 使用 Volar

### Q: UnoCSS 没有智能提示？

A: 确保安装了 `antfu.unocss` 插件

---

**首次打开项目时，请安装所有推荐插件！** ✨
