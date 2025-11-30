# 配置文件自动发现 - 快速参考

## ❓ 问题

**Q**: `lint-staged.config.mjs` 和 `commitlint.config.mjs` 没有被 import，它们怎么被使用的？

**A**: 🎯 **自动搜索机制** - 工具启动时会自动在项目目录中查找特定名称的配置文件！

---

## 🚀 工作流程（超简化）

```
git commit
    ↓
Husky 拦截
    ↓
执行 lint-staged 命令
    ↓
自动搜索 → lint-staged.config.mjs ✅ 找到了！
    ↓
执行检查
    ↓
执行 commitlint 命令
    ↓
自动搜索 → commitlint.config.mjs ✅ 找到了！
    ↓
验证提交信息
```

---

## 📂 关键文件

### 1. Husky 钩子触发

```bash
# .husky/pre-commit
pnpm run lint:lint-staged  # ← 触发 lint-staged

# .husky/commit-msg
npx commitlint --edit      # ← 触发 commitlint
```

### 2. 配置文件自动被找到

```
项目根目录/
├── lint-staged.config.mjs    ← lint-staged 自动找到
├── commitlint.config.mjs     ← commitlint 自动找到
├── eslint.config.mjs         ← eslint 自动找到
└── stylelint.config.mjs      ← stylelint 自动找到
```

---

## 🔍 搜索顺序（简化版）

### Lint-staged 搜索

```
1. package.json 的 "lint-staged" 字段
2. .lintstagedrc.json
3. .lintstagedrc.js
4. lint-staged.config.mjs  ← 在这里找到！
```

### Commitlint 搜索

```
1. package.json 的 "commitlint" 字段
2. .commitlintrc.json
3. .commitlintrc.js
4. commitlint.config.mjs  ← 在这里找到！
```

### ESLint 搜索

```
1. eslint.config.js
2. eslint.config.mjs  ← 在这里找到！
3. .eslintrc.json
```

### Stylelint 搜索

```
1. .stylelintrc.json
2. .stylelintrc.js
3. stylelint.config.mjs  ← 在这里找到！
```

---

## 💡 核心原理：Cosmiconfig

所有现代前端工具都使用 **Cosmiconfig** 库来自动搜索配置文件。

```javascript
// 工具内部的伪代码
async function loadConfig() {
  // 自动搜索配置文件
  const config = await cosmiconfig('lint-staged').search()
  
  if (config) {
    return config.config  // 找到了，加载配置
  }
  
  throw new Error('No config found')  // 没找到，报错
}
```

---

## 📊 完整流程图

```
开发者 → git commit
           ↓
    Husky 拦截 Git Hooks
           ↓
   ┌───────┴───────┐
   ↓               ↓
pre-commit      commit-msg
   ↓               ↓
lint-staged    commitlint
   ↓               ↓
自动搜索        自动搜索
配置文件        配置文件
   ↓               ↓
找到并加载      找到并加载
   ↓               ↓
执行检查        验证格式
   ↓               ↓
通过 ✅         通过 ✅
   ↓               ↓
    └───────┬───────┘
            ↓
       提交成功 🎉
```

---

## 🎯 验证方法

### 测试 Lint-staged

```bash
# 1. 修改文件
echo "test" >> src/test.js

# 2. 暂存
git add .

# 3. 提交（会自动触发）
git commit -m "test"

# 4. 观察输出
# ✅ 看到 "✔ Preparing lint-staged..."
# ✅ 看到 eslint、stylelint 运行日志
```

### 测试 Commitlint

```bash
# 1. 错误格式
git commit -m "wrong"
# ❌ type may not be empty

# 2. 正确格式
git commit -m "feat: test"
# ✅ 提交成功
```

---

## 🔑 关键知识点

### 1. 无需手动 import

```javascript
// ❌ 不需要这样做
import config from './lint-staged.config.mjs'

// ✅ 工具会自动搜索和加载
```

### 2. 文件名很重要

```
✅ lint-staged.config.mjs   - 标准命名，会被找到
❌ lint-staged-config.mjs   - 错误命名，不会被找到
❌ my-lint-staged.config.mjs - 错误命名，不会被找到
```

### 3. 位置很重要

```
✅ 项目根目录/lint-staged.config.mjs  - 正确位置
❌ src/lint-staged.config.mjs         - 错误位置
```

### 4. 扩展名的选择

```
✅ .mjs  - 明确表示 ES Modules（推荐）
✅ .cjs  - 明确表示 CommonJS
✅ .js   - 取决于 package.json 的 "type" 字段
```

---

## 📋 常见问题

### Q1: 为什么我的配置文件没被找到？

**检查清单**：
- [ ] 文件名拼写正确？
- [ ] 文件在项目根目录？
- [ ] 文件扩展名正确（.mjs/.js/.json）？
- [ ] 文件有语法错误？

### Q2: 可以在 package.json 中配置吗？

**可以！但不推荐**：

```json
// package.json
{
  "lint-staged": {
    "*.js": ["eslint --fix"]
  },
  "commitlint": {
    "extends": ["@commitlint/config-conventional"]
  }
}
```

**为什么不推荐**：
- ❌ package.json 会很臃肿
- ❌ 难以维护复杂配置
- ✅ 独立文件更清晰

### Q3: 多个配置文件存在怎么办？

**优先级规则**：
- 找到第一个就停止搜索
- package.json 通常优先级最高
- 独立配置文件次之

---

## 🛠️ 调试技巧

### 查看配置是否加载

```bash
# Lint-staged
DEBUG=lint-staged* lint-staged

# Commitlint
commitlint --verbose

# ESLint
eslint --debug src/

# Stylelint
stylelint --print-config src/App.vue
```

### 手动指定配置文件

```bash
# 如果自动搜索有问题，可以手动指定
lint-staged --config lint-staged.config.mjs
commitlint --config commitlint.config.mjs
eslint --config eslint.config.mjs
```

---

## 🎉 总结

### 核心概念

1. **自动搜索**：工具使用 Cosmiconfig 自动查找配置
2. **命名规范**：必须使用工具指定的文件名格式
3. **位置固定**：必须在项目根目录
4. **优先级明确**：多个配置文件时有优先级

### 工具链串联

```
Husky → Lint-staged → ESLint/Stylelint
    → Commitlint
```

每个工具都会**自动搜索**自己的配置文件，**无需手动导入**！

---

## 📚 相关文档

- 详细版：`CONFIG_AUTO_DISCOVERY.md`
- Husky 文档：https://typicode.github.io/husky/
- Lint-staged 文档：https://github.com/okonet/lint-staged
- Commitlint 文档：https://commitlint.js.org/
- Cosmiconfig 文档：https://github.com/cosmiconfig/cosmiconfig

---

**记住：这些配置文件会被自动找到，无需手动 import！** ✨

