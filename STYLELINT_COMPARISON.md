# Stylelint 配置文件对比

## 📊 两个配置文件说明

### 1. `stylelint.config.mjs` (当前使用 - 已增强)

**特点**：
- ✅ 简洁实用
- ✅ 添加了详细中文注释
- ✅ 已更新 Vue 3 伪类和伪元素规则
- ✅ 适合日常使用

**新增规则**：
```javascript
ignorePseudoClasses: ['deep', 'global']
ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted']
```

---

### 2. `stylelint.config.enhanced.mjs` (增强版 - 教学参考)

**特点**：
- ✅ 超详细注释（每条规则都有说明）
- ✅ 包含使用示例
- ✅ 解释了 CSS 属性排序逻辑
- ✅ 适合学习和参考

**额外内容**：
- CSS 属性排序的详细说明
- 每个规则的使用场景
- 完整的代码示例

---

## 🆕 主要更新内容

### 1. Vue 伪类选择器 (更新)

#### 之前
```javascript
ignorePseudoClasses: ['global', 'deep']
```

#### 现在（两个文件都已更新）
```javascript
ignorePseudoClasses: ['deep', 'global']
```

**使用示例**：
```vue
<style scoped>
/* Vue 3 深度选择器 - 穿透 scoped */
.parent :deep(.child) {
  color: red;
}

/* Vue 全局选择器 - 不受 scoped 限制 */
:global(.global-class) {
  font-size: 14px;
}
</style>
```

---

### 2. Vue 伪元素选择器 (新增)

#### 之前
```javascript
ignorePseudoElements: ['v-deep', ':deep']
```

#### 现在（两个文件都已更新）
```javascript
ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted']
```

**新增支持**：
- `::v-global` - Vue 全局伪元素
- `::v-slotted` - Vue 3 插槽选择器

**使用示例**：
```vue
<style scoped>
/* Vue 2 深度选择器（兼容旧代码） */
::v-deep .child {
  color: red;
}

/* Vue 3 推荐写法 */
:deep(.child) {
  color: red;
}

/* Vue 3 插槽选择器 - 修改插槽内容样式 */
::v-slotted(.slot-content) {
  color: blue;
}

/* Vue 全局伪元素 */
::v-global(.global-class) {
  font-size: 14px;
}
</style>
```

---

## 📋 Vue 深度选择器演变历史

### Vue 2.x

```vue
<style scoped>
/* 方式 1: >>> 操作符（已废弃） */
.parent >>> .child {
  color: red;
}

/* 方式 2: /deep/ 操作符（已废弃） */
.parent /deep/ .child {
  color: red;
}

/* 方式 3: ::v-deep 伪元素（推荐） */
.parent ::v-deep .child {
  color: red;
}
</style>
```

### Vue 3.x

```vue
<style scoped>
/* Vue 3 推荐写法 */
.parent :deep(.child) {
  color: red;
}

/* 也支持伪元素写法（兼容） */
.parent ::v-deep .child {
  color: red;
}
</style>
```

---

## 🎯 各个选择器的使用场景

### 1. `:deep()` - 深度选择器

**使用场景**：修改子组件的样式

```vue
<template>
  <div class="parent">
    <ChildComponent />
  </div>
</template>

<style scoped>
/* 修改子组件内部元素的样式 */
.parent :deep(.child-class) {
  color: red;
}

/* 修改第三方 UI 库的样式 */
.parent :deep(.el-button) {
  background: blue;
}
</style>
```

---

### 2. `:global()` - 全局选择器

**使用场景**：定义全局样式（不受 scoped 限制）

```vue
<style scoped>
/* 只影响当前组件 */
.local-class {
  color: red;
}

/* 全局生效，影响整个应用 */
:global(.global-class) {
  font-size: 14px;
}

/* 混合使用 */
.local :global(.global-child) {
  margin: 10px;
}
</style>
```

---

### 3. `::v-slotted()` - 插槽选择器

**使用场景**：修改插槽内容的样式

```vue
<!-- ParentComponent.vue -->
<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<style scoped>
/* 修改插槽内容的样式 */
::v-slotted(.slot-content) {
  color: blue;
  padding: 10px;
}

/* 也可以使用函数形式 */
:slotted(.slot-content) {
  color: blue;
}
</style>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <ParentComponent>
    <div class="slot-content">
      这段内容会被父组件的样式影响
    </div>
  </ParentComponent>
</template>
```

---

## 🔍 两个配置文件的详细对比

| 特性 | stylelint.config.mjs | stylelint.config.enhanced.mjs |
|------|---------------------|-------------------------------|
| **文件大小** | 178 行 | 500+ 行 |
| **注释详细度** | ⭐⭐⭐ 适中 | ⭐⭐⭐⭐⭐ 非常详细 |
| **规则数量** | 相同 | 相同 |
| **使用示例** | ✅ 有 | ✅ 更多 |
| **CSS 排序说明** | ⚠️  简略 | ✅ 详细讲解 |
| **Vue 规则说明** | ✅ 基础 | ✅ 深入 |
| **适用场景** | 日常开发 | 学习参考 |

---

## 💡 推荐使用方式

### 日常开发

使用 `stylelint.config.mjs`（当前配置）：

```bash
# 已经是默认配置，直接使用
pnpm lint:stylelint
```

**优势**：
- ✅ 简洁够用
- ✅ 注释适中
- ✅ 不影响性能

---

### 学习参考

查看 `stylelint.config.enhanced.mjs`：

**用途**：
- 📚 学习 Stylelint 规则
- 📖 理解 CSS 属性排序
- 💡 了解最佳实践
- 🎓 团队培训材料

---

## 🚀 CSS 属性排序详解

两个配置文件都使用 `stylelint-config-recess-order` 进行属性排序。

### 排序逻辑

```css
.element {
  /* 1️⃣ 定位 (Positioning) */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  
  /* 2️⃣ 盒模型 (Box Model) */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  padding: 10px;
  margin: 10px;
  border: 1px solid #000;
  
  /* 3️⃣ 排版 (Typography) */
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  color: #333;
  
  /* 4️⃣ 视觉 (Visual) */
  background: #fff;
  opacity: 1;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  /* 5️⃣ 其他 (Misc) */
  cursor: pointer;
  transition: all 0.3s;
}
```

### 为什么这样排序？

1. **定位最重要**：决定元素在文档流中的位置
2. **盒模型其次**：决定元素的布局和大小
3. **排版第三**：控制文本显示
4. **视觉第四**：美化效果
5. **其他最后**：杂项属性

**优势**：
- ✅ 提升代码可读性
- ✅ 便于查找和修改
- ✅ 减少 Git 冲突
- ✅ 可能提升渲染性能

---

## 📝 使用建议

### 1. 使用当前配置进行开发

```bash
# 检查样式
pnpm lint:stylelint

# 自动修复
pnpm lint:stylelint --fix
```

---

### 2. 参考增强配置学习

```bash
# 查看增强配置
cat stylelint.config.enhanced.mjs

# 或在编辑器中打开
code stylelint.config.enhanced.mjs
```

---

### 3. VS Code 集成

安装 Stylelint 插件后，保存时自动格式化：

```json
// .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": "explicit"
  },
  "stylelint.validate": [
    "css",
    "scss",
    "vue"
  ]
}
```

---

## 🎓 学习资源

### 官方文档

- [Stylelint 官网](https://stylelint.io/)
- [规则列表](https://stylelint.io/user-guide/rules/)
- [配置指南](https://stylelint.io/user-guide/configure/)

### Vue 文档

- [Vue 3 Scoped CSS](https://cn.vuejs.org/api/sfc-css-features.html#scoped-css)
- [深度选择器](https://cn.vuejs.org/api/sfc-css-features.html#deep-selectors)
- [插槽选择器](https://cn.vuejs.org/api/sfc-css-features.html#slotted-selectors)

---

## 🔧 常见问题

### Q1: 为什么需要深度选择器？

**A**: 因为 Vue 的 `scoped` 样式是隔离的，默认无法影响子组件。

```vue
<style scoped>
/* ❌ 无法生效 */
.parent .child-component-class {
  color: red;
}

/* ✅ 使用深度选择器才能生效 */
.parent :deep(.child-component-class) {
  color: red;
}
</style>
```

---

### Q2: `:deep()` 和 `::v-deep` 有什么区别？

**A**: 只是写法不同，效果相同。

- `:deep()` - Vue 3 推荐，函数式写法
- `::v-deep` - Vue 2/3 兼容，伪元素写法

推荐使用 `:deep()`，更符合 CSS 规范。

---

### Q3: 为什么配置中需要添加这些伪类？

**A**: 否则 Stylelint 会报错：

```
Unexpected unknown pseudo-class selector ":deep" (selector-pseudo-class-no-unknown)
```

添加到忽略列表后，Stylelint 就知道这些是 Vue 的特殊语法。

---

### Q4: CSS 属性顺序必须严格遵守吗？

**A**: 是的，Stylelint 会自动调整顺序。

```css
/* ❌ 保存前（顺序混乱） */
.class {
  color: red;
  display: flex;
  position: absolute;
}

/* ✅ 保存后（自动排序） */
.class {
  position: absolute;
  display: flex;
  color: red;
}
```

---

## 🎉 总结

### 当前配置（已更新）

✅ **已添加新规则**
- `ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted']`

✅ **已添加详细注释**
- 每个规则都有说明
- 包含使用示例
- 适合日常使用

✅ **完全可用**
- 无需额外修改
- 开箱即用

### 增强配置（参考）

✅ **超详细说明**
- 500+ 行注释
- 完整使用示例
- CSS 排序详解

✅ **学习资源**
- 适合团队培训
- 理解最佳实践
- 深入学习 Stylelint

---

**两个配置文件功能相同，选择适合你的使用方式！** 🚀

