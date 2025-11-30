# ESLint 配置快速参考

## 🆚 核心差异对比

| 维度 | 当前配置 | 增强配置 |
|------|---------|----------|
| **格式** | @antfu 简化版 | @antfu 增强版 |
| **规则数** | ~10 条 | ~60+ 条 |
| **注释** | 英文简略 | 中文详细 |
| **代码风格** | ❌ 未配置 | ✅ 完整配置 |
| **Vue 规则** | ⚠️  基础 | ✅ 完善 |
| **TS 规则** | ⚠️  基础 | ✅ 完善 |

---

## 📦 两个文件说明

### 1. `eslint.config.mjs` (当前使用)
```javascript
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
  vue: true,
  isInEditor: false,
  ignores: [...],
  rules: {
    'no-console': 'off',
    'vue/html-self-closing': 'off',
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/component-definition-name-casing': ['error', 'kebab-case'],
    'node/prefer-global/process': 'off',
    'no-unused-vars': 'warnwarn', // ← 有错误
  },
})
```

**特点**：
- ✅ 轻量简洁
- ❌ 规则较少
- ❌ 注释不全
- ⚠️  有一个配置错误（'warnwarn'）

---

### 2. `eslint.config.enhanced.mjs` (增强版本)
```javascript
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    formatters: { css: true, html: true, markdown: true },
    unocss: true,
    isInEditor: false,
    ignores: [/* 60+ 项详细忽略规则 */],
  },
  {
    rules: {
      // 60+ 条规则，每条都有详细中文注释
      // 包含：通用规则、Vue规则、TS规则、代码风格、最佳实践
    }
  }
)
```

**特点**：
- ✅ 规则完善（60+ 条）
- ✅ 详细中文注释
- ✅ 代码风格统一
- ✅ 最佳实践集成
- ✅ 环境区分示例

---

## 🔍 增强版新增内容

### 1. Vue 组件规则 (新增 4 条)

```javascript
'vue/multi-word-component-names': 'off',           // 允许单词组件名
'vue/no-v-html': 'off',                            // 允许 v-html
'vue/attributes-order': ['warn', {...}],           // ← 新增：属性排序
'vue/component-tags-order': ['warn', {...}],       // ← 新增：标签顺序
```

### 2. TypeScript 规则 (新增 4 条)

```javascript
'@typescript-eslint/no-explicit-any': 'off',
'@typescript-eslint/no-non-null-assertion': 'off',
'@typescript-eslint/explicit-function-return-type': 'off',    // ← 新增
'@typescript-eslint/explicit-module-boundary-types': 'off',   // ← 新增
'@typescript-eslint/ban-ts-comment': 'off',                   // ← 新增
'@typescript-eslint/ban-types': 'off',                        // ← 新增
```

### 3. 未使用变量 (智能处理)

```javascript
'no-unused-vars': 'off',
'@typescript-eslint/no-unused-vars': 'off',
'unused-imports/no-unused-vars': [           // ← 新增：智能检测
  'warn',
  {
    varsIgnorePattern: '^_',  // 忽略 _xxx
    argsIgnorePattern: '^_',  // 忽略 _xxx 参数
  },
],
```

### 4. 代码风格 (新增 20+ 条)

```javascript
'indent': ['error', 2],                      // 缩进
'quotes': ['error', 'single'],               // 引号
'semi': ['error', 'never'],                  // 分号
'comma-dangle': ['error', 'always-multiline'], // 尾逗号
'object-curly-spacing': ['error', 'always'], // 对象空格
'arrow-parens': ['error', 'as-needed'],      // 箭头函数括号
// ... 更多
```

### 5. 最佳实践 (新增 15+ 条)

```javascript
'eqeqeq': ['warn', 'always'],                // 使用 ===
'prefer-const': 'warn',                      // 优先 const
'prefer-template': 'warn',                   // 模板字符串
'no-var': 'error',                           // 禁止 var
'object-shorthand': ['warn', 'always'],      // 对象简写
// ... 更多
```

### 6. 忽略文件 (更全面)

```javascript
ignores: [
  // 当前配置：约 15 项
  '*.sh', 'node_modules', '*.md', ...
  
  // 增强配置：约 60+ 项
  '*.sh', 'node_modules', '**/node_modules/**',
  'dist', 'dist-ssr', '*.local',
  '.idea', '.vscode', '*.suo',
  'logs', '*.log', 'coverage',
  '.eslintcache', '.stylelintcache',
  // ... 更多
]
```

---

## 🎯 推荐使用场景

### 使用当前配置（简化版）

适合：
- ✅ 个人小项目
- ✅ 快速原型开发
- ✅ 学习阶段
- ✅ 不需要太多约束

### 使用增强配置

适合：
- ✅ 团队协作项目
- ✅ 生产级应用
- ✅ 需要代码规范统一
- ✅ 需要详细的规则说明
- ✅ 需要自定义规则

---

## 🚀 切换到增强配置

### 方式 1：直接替换

```bash
# 1. 备份当前配置
cp eslint.config.mjs eslint.config.backup.mjs

# 2. 使用增强配置
cp eslint.config.enhanced.mjs eslint.config.mjs

# 3. 测试
pnpm lint
```

### 方式 2：并行使用

```bash
# 保留两个文件，根据需要切换
eslint.config.mjs          # 默认配置
eslint.config.enhanced.mjs # 增强配置

# 使用增强配置
mv eslint.config.mjs eslint.config.simple.mjs
mv eslint.config.enhanced.mjs eslint.config.mjs
```

### 方式 3：按需合并

从增强配置中挑选需要的规则，添加到当前配置：

```javascript
// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  // ... 现有配置
  rules: {
    // ... 现有规则
    
    // 从增强配置中添加需要的规则
    'vue/attributes-order': ['warn', {...}],
    'prefer-const': 'warn',
    'no-var': 'error',
  }
})
```

---

## 🔧 常见问题

### Q1: 当前配置的 'warnwarn' 是什么？

```javascript
'no-unused-vars': 'warnwarn', // ❌ 错误配置
```

**应该改为**：
```javascript
'no-unused-vars': 'warn',     // ✅ 正确
// 或
'no-unused-vars': 'off',      // ✅ 关闭
```

---

### Q2: 为什么增强配置这么多规则？

**答**：
- 📐 **代码风格统一**：团队成员代码风格一致
- 🐛 **减少错误**：提前发现潜在问题
- 📚 **最佳实践**：集成了 Vue/TS/JS 最佳实践
- 📖 **学习资源**：每条规则都是学习材料

**可以根据需要关闭不需要的规则**。

---

### Q3: 会影响性能吗？

**答**：影响很小
- ✅ ESLint 9.x Flat Config 本身更快
- ✅ @antfu/eslint-config 已优化性能
- ✅ 规则只在检查时执行，不影响运行时
- ✅ 可以使用 `--cache` 参数加速

```bash
# 使用缓存加速
pnpm eslint . --cache
```

---

### Q4: 如何禁用某条规则？

**方式 1：全局禁用**
```javascript
// eslint.config.mjs
rules: {
  'rule-name': 'off',
}
```

**方式 2：文件级禁用**
```javascript
/* eslint-disable rule-name */
// 整个文件禁用
```

**方式 3：行级禁用**
```javascript
// eslint-disable-next-line rule-name
const x = 1
```

---

## 📊 规则统计

| 类别 | 当前配置 | 增强配置 |
|------|---------|----------|
| **通用规则** | 2 条 | 8 条 |
| **Vue 规则** | 3 条 | 8 条 |
| **TypeScript** | 0 条 | 8 条 |
| **代码风格** | 0 条 | 20 条 |
| **最佳实践** | 0 条 | 15 条 |
| **其他规则** | 1 条 | 6 条 |
| **总计** | **6 条** | **65 条** |

---

## 💡 建议

### 初学者 / 小项目
```
使用当前配置 ✅
- 简单快速
- 规则较少
- 容易上手
```

### 团队 / 生产项目
```
使用增强配置 ✅
- 规则完善
- 代码统一
- 注释详细
- 便于维护
```

### 过渡方案
```
1. 先使用当前配置
2. 熟悉后逐步添加增强配置的规则
3. 最终切换到增强配置
```

---

## 📚 相关文档

- **详细分析**：`ESLINT_CONFIG_COMPARISON.md`
- **规则速查**：查看增强配置文件内的注释
- **官方文档**：[@antfu/eslint-config](https://github.com/antfu/eslint-config)

---

**选择适合你的配置，开始高效开发！** 🚀

