# 导入顺序规则说明

## 🤔 问题

为什么 ESLint 要求 `type` 导入必须在特定位置？

---

## 📋 当前配置

项目使用 `@antfu/eslint-config`，它内置了导入顺序规则。

### 查看当前代码

```typescript
// src/utils/performance/performance.ts
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'
import type { CLSMetric, FCPMetric, INPMetric, LCPMetric, Metric, TTFBMetric } from 'web-vitals'
```

---

## ✅ @antfu/eslint-config 的导入顺序规则

`@antfu/eslint-config` 使用了 `eslint-plugin-import` 和 `@typescript-eslint` 的规则，要求：

### 1️⃣ 基本顺序（从上到下）

```typescript
// 1. type-only imports (类型导入)
import type { Type1, Type2 } from 'module'

// 2. 普通 imports (值导入)
import { value1, value2 } from 'module'

// 3. 副作用导入
import 'module'
```

### 2️⃣ 详细分组规则

```typescript
// ==================== 第一组：type imports ====================
import type { Type1 } from 'external-package'     // 外部包的类型
import type { Type2 } from '@/utils/types'        // 内部路径的类型
import type { Type3 } from './local-types'        // 相对路径的类型

// ==================== 第二组：external imports ====================
import React from 'react'                         // 外部包
import { useState } from 'react'

// ==================== 第三组：internal imports ====================
import { helper } from '@/utils/helper'           // 内部路径（@ 别名）
import { config } from '@/config'

// ==================== 第四组：relative imports ====================
import { Component } from './Component'           // 相对路径
import { utils } from '../utils'

// ==================== 第五组：style imports ====================
import './styles.css'                             // 样式文件
```

---

## 🔍 为什么要这样排序？

### 1. **TypeScript 最佳实践**

```typescript
// ✅ 推荐：type imports 在前
import type { User, Config } from './types'
import { fetchUser, saveConfig } from './api'

// 原因：
// 1. 类型在编译时会被擦除，放在前面更清晰
// 2. 明确区分"类型"和"值"
// 3. 避免循环依赖问题
```

### 2. **避免循环依赖**

```typescript
// 文件 A
import type { TypeB } from './fileB'  // ✅ 只导入类型，不会执行 fileB
export const valueA = 1

// 文件 B  
import type { TypeA } from './fileA'  // ✅ 只导入类型，不会执行 fileA
export const valueB = 2

// 如果都是普通导入，可能导致循环依赖错误
```

### 3. **代码可读性**

```typescript
// ✅ 清晰：一眼看出哪些是类型，哪些是值
import type { Props, State, Config } from './types'
import { Component, helper, utils } from './implementations'

// ❌ 混乱：类型和值混在一起
import { Component, Props, helper, State, utils, Config } from './module'
```

---

## 🔧 相关 ESLint 规则

### 1. `import/order`

控制导入语句的整体顺序：

```javascript
{
  'import/order': ['error', {
    'groups': [
      'type',           // type imports 第一组
      'builtin',        // Node.js 内置模块
      'external',       // 外部包
      'internal',       // 内部模块（@ 别名）
      'parent',         // 父级目录
      'sibling',        // 同级目录
      'index'           // index 文件
    ],
    'newlines-between': 'always'  // 组之间需要空行
  }]
}
```

### 2. `@typescript-eslint/consistent-type-imports`

强制使用 `import type` 语法：

```javascript
{
  '@typescript-eslint/consistent-type-imports': ['error', {
    'prefer': 'type-imports',     // 优先使用 type imports
    'fixable': 'code'              // 可以自动修复
  }]
}
```

---

## 📝 正确的导入顺序示例

### 示例 1：Web Vitals 性能监控

```typescript
// ✅ 正确顺序
import type { CLSMetric, FCPMetric, INPMetric } from 'web-vitals'
import { onCLS, onFCP, onINP } from 'web-vitals'

// ❌ 错误顺序（ESLint 会报错）
import { onCLS, onFCP, onINP } from 'web-vitals'
import type { CLSMetric, FCPMetric, INPMetric } from 'web-vitals'
```

### 示例 2：Vue 组件

```typescript
// ✅ 正确顺序
import type { Ref, ComputedRef } from 'vue'
import { ref, computed, onMounted } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { useRouter, useRoute } from 'vue-router'
import type { UserInfo } from '@/types/user'
import { getUserInfo } from '@/api/user'
import type { Props } from './types'
import { helper } from './utils'
```

### 示例 3：完整的导入结构

```typescript
// ==================== Type Imports ====================
import type { ReactNode } from 'react'
import type { User, Post } from '@/types'
import type { LocalConfig } from './types'

// ==================== External Packages ====================
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

// ==================== Internal Modules ====================
import { API_BASE_URL } from '@/config'
import { useAuth } from '@/hooks/useAuth'
import { formatUser } from '@/utils/format'

// ==================== Relative Imports ====================
import { Component } from './Component'
import { helper } from '../utils/helper'

// ==================== Styles ====================
import './styles.css'
```

---

## 🛠️ 如何修复导入顺序问题？

### 方法 1：自动修复（推荐）

```bash
# ESLint 自动修复
pnpm lint:fix

# 或在 VS Code 中保存时自动修复
# (已配置 editor.codeActionsOnSave)
```

### 方法 2：手动调整

将 `import type` 移到对应模块的普通导入之前：

```typescript
// 之前
import { onCLS } from 'web-vitals'
import type { CLSMetric } from 'web-vitals'

// 之后
import type { CLSMetric } from 'web-vitals'
import { onCLS } from 'web-vitals'
```

### 方法 3：VS Code 快速修复

1. 鼠标悬停在错误的导入上
2. 点击 💡 "Quick Fix"
3. 选择 "Sort imports"

---

## 📊 @antfu/eslint-config 的默认行为

### 自动修复的内容

保存文件时会自动：
1. ✅ 将 `import type` 移到最前面
2. ✅ 按模块类型分组（external, internal, relative）
3. ✅ 在不同组之间添加空行
4. ✅ 同一模块的 type 和 value 导入会合并处理

### 示例：自动修复前后对比

```typescript
// ❌ 保存前（混乱）
import { helper } from './utils'
import React from 'react'
import type { User } from '@/types'
import { useState } from 'react'
import type { Props } from './types'
import { api } from '@/api'

// ✅ 保存后（自动排序）
import type { User } from '@/types'
import type { Props } from './types'

import React, { useState } from 'react'

import { api } from '@/api'

import { helper } from './utils'
```

---

## ⚙️ 自定义导入顺序规则

如果需要修改规则，在 `eslint.config.mjs` 中添加：

```javascript
export default antfu({
  // ... 其他配置
  rules: {
    // 关闭导入顺序检查
    'import/order': 'off',
    
    // 或自定义顺序
    'import/order': ['error', {
      'groups': [
        'type',
        ['builtin', 'external'],
        'internal',
        ['parent', 'sibling', 'index']
      ],
      'newlines-between': 'always',
      'alphabetize': {
        'order': 'asc',          // 字母升序
        'caseInsensitive': true  // 忽略大小写
      }
    }]
  }
})
```

---

## 🎯 最佳实践建议

### 1. 保持一致的导入风格

```typescript
// ✅ 好：统一使用 type imports
import type { User } from './types'

// ❌ 差：混用 type 和普通导入
import { type User } from './types'
```

### 2. 利用 VS Code 自动修复

在 `.vscode/settings.json` 中已配置：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"  // 保存时自动修复导入顺序
  }
}
```

### 3. 团队规范

- ✅ 让 ESLint 自动处理导入顺序
- ✅ 不要手动调整，避免出错
- ✅ 保存文件前检查 ESLint 提示

---

## 🔗 相关文档

- [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- [TypeScript: Type-Only Imports](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)
- [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import)

---

## 📌 总结

### 核心要点

1. ✅ **`import type` 必须在普通 `import` 之前**
2. ✅ **保存时会自动修复** (已配置)
3. ✅ **这是 TypeScript 和 ESLint 的最佳实践**
4. ✅ **不需要手动调整，让工具自动处理**

### 记住口诀

```
类型在前，值在后
外部在前，内部在后
父级在前，同级在后
```

**如果遇到导入顺序错误，直接保存文件即可自动修复！** ✨


