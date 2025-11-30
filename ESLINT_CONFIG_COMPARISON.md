# ESLint 配置对比文档

## 📊 配置格式对比

### 旧配置（传统格式 - CommonJS）

```javascript
module.exports = {
  root: true,
  env: { ... },
  parser: 'vue-eslint-parser',
  extends: [...],
  rules: { ... }
}
```

**特点**：
- ❌ 使用 CommonJS 格式（`module.exports`）
- ❌ 需要手动配置 parser、extends、plugins
- ❌ 配置分散，难以维护
- ❌ 不支持异步配置

### 新配置（Flat Config - ESM）

```javascript
import antfu from '@antfu/eslint-config'

export default antfu({ ... })
```

**特点**：
- ✅ 使用 ES Modules 格式（`export default`）
- ✅ 开箱即用，预设丰富
- ✅ 配置集中，易于维护
- ✅ 支持异步配置
- ✅ 更好的 TypeScript 支持

---

## 🔄 规则迁移对比

### 1️⃣ Console 和 Debugger

#### 旧配置
```javascript
rules: {
  'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
}
```

#### 新配置（增强版）
```javascript
rules: {
  // 当前：完全关闭，方便开发调试
  'no-console': 'off',
  'no-debugger': 'off',
  
  // 可选：区分环境（取消注释使用）
  // 'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  // 'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
}
```

**说明**：
- ✅ 默认关闭，开发更便捷
- 💡 提供了环境区分的注释示例
- 📝 添加了详细的中文注释

---

### 2️⃣ Vue 组件命名

#### 旧配置
```javascript
rules: {
  'vue/multi-word-component-names': 'off', // 允许单词组件名
}
```

#### 新配置（增强版）
```javascript
rules: {
  // 允许单个单词组件名（如 Home.vue）
  'vue/multi-word-component-names': 'off',
  
  // 新增：强制模板中使用 kebab-case
  'vue/component-name-in-template-casing': ['error', 'kebab-case'],
  
  // 新增：强制组件定义使用 kebab-case
  'vue/component-definition-name-casing': ['error', 'kebab-case'],
}
```

**说明**：
- ✅ 保留了原有配置
- ➕ 新增了组件命名风格统一
- 📐 符合 Vue 官方风格指南

**效果**：
```vue
<!-- ✅ 正确 -->
<my-component />
<user-card />

<!-- ❌ 错误 -->
<MyComponent />
<UserCard />
```

---

### 3️⃣ Vue v-html 使用

#### 旧配置
```javascript
rules: {
  'vue/no-v-html': 'off', // 允许使用 v-html
}
```

#### 新配置（增强版）
```javascript
rules: {
  // 允许使用 v-html（注意 XSS 风险）
  'vue/no-v-html': 'off',
}
```

**说明**：
- ✅ 保持一致
- ⚠️  添加了安全提示注释

---

### 4️⃣ TypeScript 类型规则

#### 旧配置
```javascript
rules: {
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
}
```

#### 新配置（增强版）
```javascript
rules: {
  // 允许使用 any 类型（快速开发）
  '@typescript-eslint/no-explicit-any': 'off',
  
  // 允许非空断言（value!）
  '@typescript-eslint/no-non-null-assertion': 'off',
  
  // 新增：不强制函数返回类型
  '@typescript-eslint/explicit-function-return-type': 'off',
  
  // 新增：不强制模块边界返回类型
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  
  // 新增：允许 @ts-ignore 注释
  '@typescript-eslint/ban-ts-comment': 'off',
  
  // 新增：允许使用 {} 等类型
  '@typescript-eslint/ban-types': 'off',
}
```

**说明**：
- ✅ 保留了原有规则
- ➕ 新增了更多 TypeScript 灵活性
- 💡 生产环境建议开启部分规则

---

### 5️⃣ 未使用变量处理

#### 旧配置
```javascript
// 默认使用 ESLint 的 no-unused-vars
rules: {
  // 无特殊配置
}
```

#### 新配置（增强版）
```javascript
rules: {
  // 关闭原生规则
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'off',
  
  // 使用 unused-imports 插件（更智能）
  'unused-imports/no-unused-vars': [
    'warn',
    {
      vars: 'all',
      varsIgnorePattern: '^_',    // 忽略 _xxx
      args: 'after-used',
      argsIgnorePattern: '^_',    // 忽略 _xxx
    },
  ],
}
```

**说明**：
- ✅ 更智能的未使用变量检测
- 💡 支持 `_` 前缀忽略约定
- 🔄 自动清理未使用的导入

**效果**：
```typescript
// ✅ 正确：_ 前缀变量不会报错
const _temp = 123  // 不报错
function test(_unused: string) { ... }  // 不报错

// ❌ 错误：未使用的普通变量
const unused = 123  // ⚠️  警告
```

---

## 🆕 新增功能

### 1. Vue 属性顺序

```javascript
'vue/attributes-order': [
  'warn',
  {
    order: [
      'DEFINITION',      // is, v-is
      'LIST_RENDERING',  // v-for
      'CONDITIONALS',    // v-if, v-else-if, v-else
      'RENDER_MODIFIERS',// v-pre, v-once
      'GLOBAL',          // id
      'UNIQUE',          // ref, key
      'SLOT',            // v-slot
      'TWO_WAY_BINDING', // v-model
      'OTHER_DIRECTIVES',// v-custom
      'OTHER_ATTR',      // 自定义属性
      'EVENTS',          // @click
      'CONTENT',         // v-text, v-html
    ],
  },
],
```

**效果**：
```vue
<!-- ✅ 正确：属性按顺序排列 -->
<div
  v-if="show"
  ref="myRef"
  :key="id"
  v-model="value"
  @click="handleClick"
  class="container"
>
  内容
</div>
```

---

### 2. Vue 单文件组件顺序

```javascript
'vue/component-tags-order': [
  'warn',
  {
    order: ['template', 'script', 'style'],
  },
],
```

**效果**：
```vue
<!-- ✅ 正确 -->
<template>...</template>
<script>...</script>
<style>...</style>

<!-- ❌ 错误 -->
<script>...</script>
<template>...</template>
<style>...</style>
```

---

### 3. 代码风格统一

新增了完整的代码风格规则：

```javascript
rules: {
  'indent': ['error', 2],                    // 2 空格缩进
  'quotes': ['error', 'single'],             // 单引号
  'semi': ['error', 'never'],                // 不使用分号
  'comma-dangle': ['error', 'always-multiline'], // 多行尾逗号
  'object-curly-spacing': ['error', 'always'],   // { foo }
  'arrow-parens': ['error', 'as-needed'],        // 箭头函数括号
}
```

---

### 4. 最佳实践规则

```javascript
rules: {
  'eqeqeq': ['warn', 'always'],          // 使用 === 
  'prefer-const': 'warn',                // 优先使用 const
  'prefer-template': 'warn',             // 使用模板字符串
  'no-var': 'error',                     // 禁止 var
  'object-shorthand': ['warn', 'always'], // 对象简写
}
```

---

### 5. UnoCSS 支持

```javascript
rules: {
  'unocss/order': 'warn',              // 自动排序类名
  'unocss/order-attributify': 'warn',  // 属性值排序
}
```

**效果**：
```vue
<!-- ✅ 自动排序 -->
<div class="flex items-center justify-center p-4 m-2">
```

---

## 📈 配置对比表

| 特性 | 旧配置 | 新配置（增强版） |
|------|--------|------------------|
| **配置格式** | CommonJS | ES Modules |
| **预设** | 手动配置 | @antfu/eslint-config |
| **Vue 3 支持** | ⚠️  需手动配置 | ✅ 开箱即用 |
| **TypeScript** | ⚠️  需手动配置 | ✅ 开箱即用 |
| **格式化工具** | ❌ 依赖 Prettier | ✅ 内置格式化 |
| **UnoCSS** | ❌ 不支持 | ✅ 原生支持 |
| **自动导入** | ❌ 不支持 | ✅ 智能识别 |
| **代码风格** | ⚠️  部分规则 | ✅ 完整规则 |
| **最佳实践** | ⚠️  基础规则 | ✅ 丰富规则 |
| **注释说明** | ❌ 无注释 | ✅ 详细中文注释 |
| **环境区分** | ✅ 支持 | ✅ 支持（更灵活） |
| **忽略文件** | .eslintignore | ✅ 配置内集成 |
| **性能** | ⚠️  较慢 | ✅ 更快 |

---

## 🚀 升级步骤

### 1. 备份旧配置

```bash
# 备份现有配置
mv eslint.config.mjs eslint.config.old.mjs
```

### 2. 使用新配置

```bash
# 复制新配置
cp eslint.config.enhanced.mjs eslint.config.mjs
```

### 3. 测试运行

```bash
# 检查代码
pnpm lint

# 自动修复
pnpm lint:fix
```

### 4. 调整规则

根据项目需求，在新配置中调整规则：

```javascript
// 例如：生产环境禁用 console
rules: {
  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
}
```

---

## 💡 推荐配置

### 开发环境（宽松）

```javascript
rules: {
  'no-console': 'off',
  'no-debugger': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
}
```

### 生产环境（严格）

```javascript
rules: {
  'no-console': 'error',        // 禁止 console
  'no-debugger': 'error',       // 禁止 debugger
  '@typescript-eslint/no-explicit-any': 'warn', // 警告 any
}
```

### 团队协作（平衡）

```javascript
rules: {
  'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  '@typescript-eslint/no-explicit-any': 'warn',
}
```

---

## 📝 迁移清单

- [ ] 备份旧配置文件
- [ ] 复制新配置文件
- [ ] 运行 `pnpm lint` 测试
- [ ] 根据项目需求调整规则
- [ ] 修复所有 linter 错误
- [ ] 更新 CI/CD 配置
- [ ] 团队成员同步配置
- [ ] 更新项目文档

---

## 🎯 总结

### 新配置的优势

1. **✅ 开箱即用**：无需复杂配置
2. **✅ 功能更强**：Vue 3 + TS + UnoCSS 全支持
3. **✅ 性能更好**：Flat Config 格式更快
4. **✅ 维护简单**：集中式配置，易于管理
5. **✅ 注释完善**：每条规则都有中文说明
6. **✅ 最佳实践**：集成了现代前端开发规范

### 使用建议

1. **开发阶段**：使用宽松配置，专注功能开发
2. **提交前**：运行 `pnpm lint:fix` 自动修复
3. **Code Review**：关注 ESLint 警告
4. **生产构建**：启用严格模式
5. **团队协作**：定期同步和更新规则

---

**开始使用新配置，享受更好的开发体验！** 🎉

