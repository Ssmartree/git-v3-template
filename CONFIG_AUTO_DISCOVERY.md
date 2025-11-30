# 配置文件自动发现机制分析

## 🤔 问题

你发现项目中有 `lint-staged.config.mjs` 和 `commitlint.config.mjs`，但代码中没有看到显式的 `import` 或 `require`，它们是如何被自动找到并使用的？

---

## ✅ 答案：配置文件自动发现（Cosmiconfig）

这些工具都使用了 **Cosmiconfig** 库来自动搜索和加载配置文件。

---

## 🔍 完整的工作流程

### 1️⃣ Git Hooks 触发

```
开发者执行命令
    ↓
Git 命令触发
    ↓
Husky 拦截 Git Hooks
    ↓
执行配置的脚本
    ↓
工具自动搜索配置文件
    ↓
加载并执行
```

---

## 📂 文件关系图

```
项目根目录
├── .husky/                          # Git Hooks 配置
│   ├── pre-commit                   # 提交前钩子
│   └── commit-msg                   # 提交信息钩子
│
├── package.json                     # NPM 脚本
│   └── scripts
│       ├── lint:lint-staged         # lint-staged 命令
│       └── prepare                  # husky install
│
├── lint-staged.config.mjs           # ← 自动发现
├── commitlint.config.mjs            # ← 自动发现
├── eslint.config.mjs                # ← 自动发现
└── stylelint.config.mjs             # ← 自动发现
```

---

## 🚀 详细流程解析

### Lint-staged 的自动发现

#### 1. Git Commit 触发流程

```bash
# 开发者执行
git add .
git commit -m "feat: 新功能"

# ↓ 触发 pre-commit Hook
```

#### 2. Husky 拦截并执行脚本

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm run lint:lint-staged --allow-empty
```

#### 3. 执行 package.json 中的脚本

```json
// package.json
{
  "scripts": {
    "lint:lint-staged": "lint-staged"  // ← 执行 lint-staged 命令
  }
}
```

#### 4. Lint-staged 自动搜索配置文件

**搜索顺序**（从上到下）：

```
1. package.json 中的 "lint-staged" 字段
2. .lintstagedrc 文件
3. .lintstagedrc.json
4. .lintstagedrc.yaml / .lintstagedrc.yml
5. .lintstagedrc.mjs / .lintstagedrc.cjs
6. lint-staged.config.mjs / lint-staged.config.cjs  ← 找到了！
7. lint-staged.config.js
```

**找到文件后**：
```javascript
// lint-staged 内部执行（伪代码）
const config = await import('./lint-staged.config.mjs')
// 然后根据配置执行相应的命令
```

---

### Commitlint 的自动发现

#### 1. Git Commit 触发流程

```bash
git commit -m "feat: 新功能"

# ↓ 提交信息写入后，触发 commit-msg Hook
```

#### 2. Husky 拦截并执行脚本

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit
```

**参数说明**：
- `npx --no`: 使用本地安装的 commitlint（不从远程下载）
- `--edit`: 读取 Git 临时文件中的提交信息（`.git/COMMIT_EDITMSG`）

#### 3. Commitlint 自动搜索配置文件

**搜索顺序**（从上到下）：

```
1. package.json 中的 "commitlint" 字段
2. .commitlintrc 文件
3. .commitlintrc.json
4. .commitlintrc.yaml / .commitlintrc.yml
5. .commitlintrc.js
6. .commitlintrc.cjs
7. commitlint.config.mjs  ← 找到了！
8. commitlint.config.cjs
9. commitlint.config.js
```

**找到文件后**：
```javascript
// commitlint 内部执行（伪代码）
const config = await import('./commitlint.config.mjs')
// 验证提交信息是否符合规则
```

---

## 🔧 其他配置文件的自动发现

### ESLint

**触发方式**：
```bash
# 手动执行
pnpm lint

# 或保存文件时（如果配置了 VS Code）
```

**搜索顺序**：
```
1. eslint.config.js
2. eslint.config.mjs  ← 找到了！
3. eslint.config.cjs
4. .eslintrc.js
5. .eslintrc.cjs
6. .eslintrc.yaml / .eslintrc.yml
7. .eslintrc.json
8. package.json 中的 "eslintConfig" 字段
```

---

### Stylelint

**触发方式**：
```bash
# 手动执行
pnpm lint:stylelint

# 或通过 lint-staged（提交时）
```

**搜索顺序**：
```
1. package.json 中的 "stylelint" 字段
2. .stylelintrc
3. .stylelintrc.json
4. .stylelintrc.yaml / .stylelintrc.yml
5. .stylelintrc.js
6. .stylelintrc.cjs
7. stylelint.config.mjs  ← 找到了！
8. stylelint.config.cjs
9. stylelint.config.js
```

---

## 📋 完整的提交流程示例

```bash
# 1. 开发者修改代码
vim src/App.vue

# 2. 添加到暂存区
git add src/App.vue

# 3. 提交
git commit -m "feat: 添加新功能"

# ==================== 自动执行流程 ====================

# 4. Husky 拦截 pre-commit Hook
# 执行：pnpm run lint:lint-staged

# 5. Lint-staged 自动查找配置文件
# 找到：lint-staged.config.mjs

# 6. 读取配置并执行
export default {
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],  # ← ESLint 自动找 eslint.config.mjs
  '*.vue': ['eslint --fix'],              # ← ESLint 自动找 eslint.config.mjs
  '*.{scss,less,html}': ['stylelint --fix'], # ← Stylelint 自动找 stylelint.config.mjs
}

# 7. 如果检查通过，继续提交
# 写入提交信息到 .git/COMMIT_EDITMSG

# 8. Husky 拦截 commit-msg Hook
# 执行：npx commitlint --edit

# 9. Commitlint 自动查找配置文件
# 找到：commitlint.config.mjs

# 10. 验证提交信息格式
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', ...]]
  }
}

# 11. 如果格式正确，提交成功 ✅
# 如果格式错误，提交被阻止 ❌
```

---

## 🛠️ Cosmiconfig 工作原理

所有这些工具都使用了 **Cosmiconfig** 库来搜索配置文件。

### Cosmiconfig 特点

1. **自动搜索**：从当前目录开始，向上递归搜索
2. **支持多种格式**：JS, JSON, YAML, TypeScript
3. **灵活配置**：可以在多个地方定义配置
4. **缓存优化**：搜索结果会被缓存

### 内部实现（简化）

```javascript
// Cosmiconfig 内部逻辑（伪代码）
async function searchConfig(moduleName) {
  const searchPlaces = [
    'package.json',
    `.${moduleName}rc`,
    `.${moduleName}rc.json`,
    `.${moduleName}rc.js`,
    `.${moduleName}rc.mjs`,
    `.${moduleName}rc.cjs`,
    `${moduleName}.config.js`,
    `${moduleName}.config.mjs`,
    `${moduleName}.config.cjs`,
  ]

  for (const place of searchPlaces) {
    const config = await tryLoadConfig(place)
    if (config) {
      return config  // 找到就返回，停止搜索
    }
  }

  return null  // 未找到配置
}
```

---

## 🔍 验证配置文件是否被找到

### 方法 1：使用调试参数

```bash
# Lint-staged 调试
DEBUG=lint-staged* lint-staged

# Commitlint 调试
commitlint --config commitlint.config.mjs --from HEAD~1 --to HEAD --verbose

# ESLint 调试
eslint --debug src/

# Stylelint 调试
stylelint --print-config src/App.vue
```

### 方法 2：查看工具输出

```bash
# 如果配置文件不存在，工具会报错：
# ❌ No configuration found for commitlint
# ❌ No ESLint configuration found

# 如果找到配置文件：
# ✅ 正常执行检查
```

---

## 📊 配置文件优先级总结

| 工具 | 最高优先级 | 推荐使用 | 原因 |
|------|-----------|---------|------|
| **lint-staged** | package.json | ✅ `lint-staged.config.mjs` | 独立文件，易于管理 |
| **commitlint** | package.json | ✅ `commitlint.config.mjs` | 支持复杂配置 |
| **eslint** | CLI 参数 | ✅ `eslint.config.mjs` | ESLint 9.x 推荐格式 |
| **stylelint** | package.json | ✅ `stylelint.config.mjs` | 支持 ES Modules |

---

## 💡 为什么使用 .mjs 扩展名？

### 1. 明确 ES Modules

```javascript
// ✅ .mjs 文件
export default { ... }  // ES Modules 语法

// ❌ .js 文件（如果 package.json 没有 "type": "module"）
module.exports = { ... }  // CommonJS 语法
```

### 2. 项目已配置 ES Modules

```json
// package.json
{
  "type": "module"  // ← 整个项目使用 ES Modules
}
```

所以可以直接使用 `.js` 扩展名，但 `.mjs` 更加明确。

---

## 🎯 实际验证

### 验证 Lint-staged

```bash
# 1. 修改一个文件
echo "console.log('test')" >> src/test.js

# 2. 添加到暂存区
git add src/test.js

# 3. 尝试提交
git commit -m "test"

# 4. 观察输出
# ✅ 会看到 lint-staged 执行日志
# ✅ 会看到 eslint 检查日志
```

### 验证 Commitlint

```bash
# 1. 尝试错误的提交格式
git commit -m "wrong format"

# 2. 观察输出
# ❌ subject may not be empty [subject-empty]
# ❌ type may not be empty [type-empty]

# 3. 使用正确格式
git commit -m "feat: 正确格式"

# 4. 观察输出
# ✅ 提交成功
```

---

## 📚 配置文件命名规范

### 推荐命名

```
✅ eslint.config.mjs          # ESLint 9.x 推荐
✅ stylelint.config.mjs       # Stylelint 推荐
✅ commitlint.config.mjs      # Commitlint 推荐
✅ lint-staged.config.mjs     # Lint-staged 推荐
```

### 为什么不用 .js？

虽然 `package.json` 中有 `"type": "module"`，但：

1. `.mjs` **更加明确**：一看就知道是 ES Modules
2. **跨平台兼容**：某些工具可能不读取 package.json
3. **团队规范**：明确告诉团队使用 ES Modules

---

## 🔄 完整的工具链

```
┌─────────────────────────────────────────────────────┐
│                  开发者执行 Git 命令                   │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                    Husky (Git Hooks)                 │
│  - pre-commit: 提交前检查                             │
│  - commit-msg: 提交信息检查                           │
└─────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴─────────────────┐
        ↓                                   ↓
┌──────────────────┐              ┌──────────────────┐
│   Lint-staged    │              │   Commitlint     │
│   自动搜索配置    │              │   自动搜索配置    │
└──────────────────┘              └──────────────────┘
        ↓                                   ↓
┌──────────────────┐              ┌──────────────────┐
│ lint-staged      │              │ commitlint       │
│ .config.mjs      │              │ .config.mjs      │
└──────────────────┘              └──────────────────┘
        ↓                                   ↓
┌──────────────────┐              ┌──────────────────┐
│  执行检查命令     │              │  验证提交信息     │
│  - ESLint        │              │  - type 是否有效  │
│  - Stylelint     │              │  - format 正确    │
│  - Prettier      │              └──────────────────┘
└──────────────────┘
        ↓
┌──────────────────┐
│   ESLint/        │
│   Stylelint      │
│   自动搜索配置    │
└──────────────────┘
        ↓
┌──────────────────┐
│ eslint.config    │
│ .mjs /           │
│ stylelint.config │
│ .mjs             │
└──────────────────┘
```

---

## 🎉 总结

### 关键点

1. ✅ **不需要手动 import**：工具会自动搜索配置文件
2. ✅ **搜索顺序固定**：按照预定义的文件名列表搜索
3. ✅ **找到即停止**：找到第一个匹配的配置文件就停止搜索
4. ✅ **使用 Cosmiconfig**：现代前端工具的标准做法

### Husky 的作用

1. **拦截 Git Hooks**：在 Git 命令执行的关键节点拦截
2. **执行自定义脚本**：运行 `pnpm run lint:lint-staged` 等命令
3. **集成工具链**：将多个工具串联起来

### 配置文件的作用

1. **定义规则**：告诉工具如何检查代码
2. **自动被找到**：工具启动时自动搜索并加载
3. **独立管理**：每个工具一个文件，清晰明了

---

**所以答案是：是的，这些配置文件会被自动找到！** ✅

工具使用 Cosmiconfig 库，启动时自动在项目目录中搜索特定命名的配置文件。

