/**
 * ESLint 配置文件 (Flat Config 格式)
 *
 * 基于 @antfu/eslint-config 并扩展了常用规则
 *
 * 特点：
 * 1. 使用现代化的 Flat Config 格式（ESLint 9.x）
 * 2. 开箱即用的 Vue 3 + TypeScript 支持
 * 3. 自动格式化 CSS、HTML、Markdown
 * 4. UnoCSS 原子化 CSS 支持
 * 5. 智能的环境区分（开发/生产）
 */

import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // ==================== 基础配置 ====================

    /**
     * Vue 3 支持
     * 自动应用 Vue 3 相关的 ESLint 规则
     */
    vue: true,

    /**
     * TypeScript 支持
     * 自动进行类型检查和 TS 规则验证
     */
    typescript: true,

    /**
     * 格式化工具集成
     * 自动格式化 CSS、HTML、Markdown 等非 JS 文件
     * 使用 prettier 作为底层格式化引擎
     */
    formatters: {
      css: true, // 格式化 CSS/SCSS/Less
      html: true, // 格式化 HTML
      markdown: true, // 格式化 Markdown
    },

    /**
     * UnoCSS 支持
     * 检查和格式化 UnoCSS 原子化 CSS 类名
     */
    unocss: true,

    /**
     * 编辑器集成
     * false: 不在编辑器中自动删除未使用的导入
     * true:  保存时自动删除（可能导致误删）
     */
    isInEditor: false,

    // ==================== 忽略文件配置 ====================

    /**
     * 忽略的文件和目录
     * 这些文件不会被 ESLint 检查
     */
    ignores: [
      // 脚本文件
      '*.sh',

      // 依赖目录
      'node_modules',
      '**/node_modules/**',

      // 构建产物
      'dist',
      'dist-ssr',
      '*.local',

      // 文档和资源
      '*.md',
      '*.woff',
      '*.woff2',
      '*.ttf',

      // 编辑器配置
      '.idea',
      '.vscode',
      '*.suo',
      '*.ntvs*',
      '*.njsproj',
      '*.sln',
      '*.sw?',

      // 其他配置目录
      '/public',
      '/docs',
      '.husky',
      '/bin',

      // Docker
      'Dockerfile',

      // 打包分析
      'stats.html',

      // TypeScript 构建缓存
      '*.tsbuildinfo',

      // 测试覆盖率
      'coverage',

      // 日志文件
      'logs',
      '*.log',
      'npm-debug.log*',
      'pnpm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',

      // 缓存文件
      '.eslintcache',
      '.stylelintcache',
    ],
  },

  // ==================== 自定义规则配置 ====================
  {
    rules: {
      // -------------------- 通用规则 --------------------

      /**
       * Console 使用规则
       * 'off': 允许使用 console（开发环境）
       * 'warn': 警告使用 console（生产环境）
       *
       * 当前设置：完全关闭检查，方便调试
       * 生产环境建议改为: process.env.NODE_ENV === 'production' ? 'warn' : 'off'
       */
      'no-console': 'off',

      /**
       * Debugger 使用规则
       * 'off': 允许使用 debugger（开发环境）
       * 'warn': 警告使用 debugger（生产环境）
       *
       * 当前设置：完全关闭检查，方便调试
       * 生产环境建议改为: process.env.NODE_ENV === 'production' ? 'warn' : 'off'
       */
      'no-debugger': 'off',

      /**
       * 未使用变量警告
       * 'off': 关闭检查
       * 'warn': 警告
       * 'error': 报错
       *
       * 注意：设置为 'warn' 可能导致格式化时出现问题
       */
      'no-unused-vars': 'off',

      /**
       * 未使用导入警告（由 unused-imports 插件提供）
       * 可以配置忽略以 _ 开头的变量
       */
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_', // 忽略 _xxx 变量
          args: 'after-used',
          argsIgnorePattern: '^_', // 忽略 _xxx 参数
        },
      ],

      // -------------------- Vue 规则 --------------------

      /**
       * Vue 组件命名规则（模板中）
       * 'PascalCase': 大驼峰（MyComponent）
       * 'kebab-case': 短横线（my-component）
       *
       * 当前设置：强制使用 kebab-case
       * 符合 Vue 官方风格指南推荐
       */
      'vue/component-name-in-template-casing': [
        'error',
        'kebab-case',
        {
          registeredComponentsOnly: false, // 所有组件都检查，不仅注册的
          ignores: [], // 忽略的组件名
        },
      ],

      /**
       * Vue 组件定义命名规则
       * 'PascalCase': 大驼峰
       * 'kebab-case': 短横线
       *
       * 当前设置：强制使用 kebab-case
       */
      'vue/component-definition-name-casing': ['error', 'kebab-case'],

      /**
       * Vue 组件名必须多个单词
       * 'off': 关闭检查，允许单个单词组件名
       *
       * 例如：允许 <Home /> 而不是强制 <HomePage />
       * Vue 官方建议使用多个单词避免与 HTML 元素冲突
       */
      'vue/multi-word-component-names': 'off',

      /**
       * Vue HTML 自闭合标签规则
       * 'off': 不强制自闭合
       *
       * 例如：<div></div> 和 <div /> 都可以
       */
      'vue/html-self-closing': 'off',

      /**
       * Vue v-html 指令使用
       * 'off': 允许使用 v-html
       *
       * 注意：v-html 有 XSS 风险，请确保内容可信
       */
      'vue/no-v-html': 'off',

      /**
       * Vue 属性顺序
       * 规范 Vue 组件属性的书写顺序
       */
      'vue/attributes-order': [
        'warn',
        {
          order: [
            'DEFINITION', // is, v-is
            'LIST_RENDERING', // v-for
            'CONDITIONALS', // v-if, v-else-if, v-else, v-show, v-cloak
            'RENDER_MODIFIERS', // v-pre, v-once
            'GLOBAL', // id
            'UNIQUE', // ref, key
            'SLOT', // v-slot, slot
            'TWO_WAY_BINDING', // v-model
            'OTHER_DIRECTIVES', // v-custom-directive
            'OTHER_ATTR', // 自定义属性
            'EVENTS', // @click, v-on
            'CONTENT', // v-text, v-html
          ],
          alphabetical: false, // 不按字母排序
        },
      ],

      /**
       * Vue 单文件组件顶级元素顺序
       * 规范 <template>、<script>、<style> 的顺序
       */
      'vue/component-tags-order': [
        'warn',
        {
          order: ['template', 'script', 'style'],
        },
      ],

      // -------------------- TypeScript 规则 --------------------

      /**
       * TypeScript 禁止使用 any 类型
       * 'off': 允许使用 any
       *
       * 当前设置：关闭检查，方便快速开发
       * 生产环境建议开启，提升类型安全
       */
      '@typescript-eslint/no-explicit-any': 'off',

      /**
       * TypeScript 非空断言
       * 'off': 允许使用 ! 非空断言
       *
       * 例如：value! 表示 value 一定不为 null/undefined
       */
      '@typescript-eslint/no-non-null-assertion': 'off',

      /**
       * TypeScript 未使用变量
       * 由 unused-imports 插件统一处理
       */
      '@typescript-eslint/no-unused-vars': 'off',

      /**
       * TypeScript 函数返回类型
       * 'off': 不强制显式声明返回类型
       *
       * TypeScript 可以自动推断大部分返回类型
       */
      '@typescript-eslint/explicit-function-return-type': 'off',

      /**
       * TypeScript 模块边界返回类型
       * 'off': 不强制导出函数声明返回类型
       */
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      /**
       * TypeScript ban-ts-comment
       * 'off': 允许使用 @ts-ignore 等注释
       *
       * 当前设置：允许，方便临时禁用类型检查
       * 建议谨慎使用
       */
      '@typescript-eslint/ban-ts-comment': 'off',

      /**
       * TypeScript ban-types
       * 'off': 允许使用某些被认为不好的类型
       *
       * 例如：允许使用 {} 类型
       */
      '@typescript-eslint/ban-types': 'off',

      // -------------------- Node.js 规则 --------------------

      /**
       * Node.js 全局 process 使用偏好
       * 'off': 不强制使用全局 process
       *
       * 在某些环境下 process 可能未定义
       */
      'node/prefer-global/process': 'off',

      /**
       * Node.js 全局 Buffer 使用偏好
       * 'off': 不强制使用全局 Buffer
       */
      'node/prefer-global/buffer': 'off',

      // -------------------- Import 规则 --------------------

      /**
       * Import 顺序
       * 'off': 不强制 import 语句的顺序
       *
       * @antfu/eslint-config 有自己的排序逻辑
       */
      'import/order': 'off',

      /**
       * Import 扩展名
       * 'off': 不强制 import 时包含文件扩展名
       *
       * Vite 和现代打包工具可以自动处理
       */
      'import/extensions': 'off',

      /**
       * Import 默认导出偏好
       * 'off': 不强制使用 default export
       *
       * 具名导出更利于 Tree Shaking
       */
      'import/prefer-default-export': 'off',

      /**
       * Import 导出顺序
       * 'off': 不强制 export 的顺序
       */
      'import/exports-last': 'off',

      // -------------------- UnoCSS 规则 --------------------

      /**
       * UnoCSS 类名顺序
       * 'warn': 警告类名顺序不规范
       *
       * 自动排序 UnoCSS 类名，提升可读性
       */
      'unocss/order': 'warn',

      /**
       * UnoCSS 类名属性值顺序
       * 'warn': 警告属性值顺序不规范
       */
      'unocss/order-attributify': 'warn',

      // -------------------- 代码风格规则 --------------------

      /**
       * 缩进规则
       * 使用 2 个空格缩进
       */
      'indent': ['error', 2, { SwitchCase: 1 }],

      /**
       * 引号规则
       * 'single': 使用单引号
       * 'double': 使用双引号
       */
      'quotes': ['error', 'single', { avoidEscape: true }],

      /**
       * 分号规则
       * 'never': 不使用分号（推荐）
       * 'always': 始终使用分号
       */
      'semi': ['error', 'never'],

      /**
       * 逗号悬挂
       * 'always-multiline': 多行时最后一项加逗号
       */
      'comma-dangle': ['error', 'always-multiline'],

      /**
       * 箭头函数参数括号
       * 'as-needed': 需要时才加括号
       * 'always': 始终加括号
       */
      'arrow-parens': ['error', 'as-needed'],

      /**
       * 对象花括号内间距
       * true: { foo: 'bar' }
       * false: {foo: 'bar'}
       */
      'object-curly-spacing': ['error', 'always'],

      /**
       * 数组方括号内间距
       * false: [1, 2, 3]
       * true: [ 1, 2, 3 ]
       */
      'array-bracket-spacing': ['error', 'never'],

      /**
       * 花括号风格
       * '1tbs': 一行开始
       * 'stroustrup': 下一行开始
       */
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],

      /**
       * 代码块前空格
       * true: if (x) { ... }
       * false: if (x){ ... }
       */
      'space-before-blocks': ['error', 'always'],

      /**
       * 关键字前后空格
       * true: if (x) { ... }
       * false: if(x){ ... }
       */
      'keyword-spacing': ['error', { before: true, after: true }],

      /**
       * 函数括号前空格
       * anonymous: 匿名函数
       * named: 具名函数
       * asyncArrow: async 箭头函数
       */
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        },
      ],

      /**
       * 操作符周围空格
       * true: a + b
       * false: a+b
       */
      'space-infix-ops': 'error',

      /**
       * 一元操作符空格
       * words: new, delete, typeof, void, yield
       * nonwords: -, +, --, ++, !, !!
       */
      'space-unary-ops': ['error', { words: true, nonwords: false }],

      /**
       * 注释前空格
       * true: // comment
       * false: //comment
       */
      'spaced-comment': [
        'error',
        'always',
        {
          line: { markers: ['/'], exceptions: ['-', '+'] },
          block: { markers: ['!'], exceptions: ['*'], balanced: true },
        },
      ],

      /**
       * 多行注释风格
       * 'starred-block': 每行前加 *
       */
      'multiline-comment-style': ['off'],

      /**
       * 最大行长度
       * 'off': 不限制行长度
       *
       * 由 .editorconfig 控制
       */
      'max-len': 'off',

      /**
       * 每行最多语句数
       * 'off': 不限制
       */
      'max-statements-per-line': 'off',

      /**
       * 对象属性换行
       * 'off': 不强制换行
       */
      'object-property-newline': 'off',

      /**
       * 对象花括号换行
       * 'off': 不强制换行
       */
      'object-curly-newline': 'off',

      // -------------------- 最佳实践规则 --------------------

      /**
       * 要求使用 === 和 !==
       * 'error': 强制使用严格相等
       * 'warn': 警告
       * 'off': 关闭
       */
      'eqeqeq': ['warn', 'always', { null: 'ignore' }],

      /**
       * 禁止重复的 case 标签
       */
      'no-duplicate-case': 'error',

      /**
       * 禁止不必要的布尔类型转换
       * 例如：!!value 在已经是布尔值的情况下
       */
      'no-extra-boolean-cast': 'warn',

      /**
       * 禁止在 return 语句中使用赋值
       */
      'no-return-assign': 'warn',

      /**
       * 禁止不必要的 catch
       */
      'no-useless-catch': 'warn',

      /**
       * 优先使用 const
       * 如果变量不会被重新赋值，使用 const
       */
      'prefer-const': [
        'warn',
        {
          destructuring: 'all', // 解构时全部使用 const
          ignoreReadBeforeAssign: false,
        },
      ],

      /**
       * 优先使用模板字符串
       * 'warn': 建议使用 `hello ${name}` 而不是 'hello ' + name
       */
      'prefer-template': 'warn',

      /**
       * 优先使用 rest 参数
       * 使用 ...args 而不是 arguments
       */
      'prefer-rest-params': 'warn',

      /**
       * 优先使用解构
       * 'off': 不强制使用解构
       */
      'prefer-destructuring': 'off',

      /**
       * 禁止使用 var
       * 使用 let 和 const 代替
       */
      'no-var': 'error',

      /**
       * 对象简写
       * 'warn': 建议使用 { x } 而不是 { x: x }
       */
      'object-shorthand': ['warn', 'always'],

      /**
       * 箭头函数体样式
       * 'as-needed': 需要时才加花括号和 return
       */
      'arrow-body-style': ['warn', 'as-needed'],

      /**
       * 禁止不必要的 return await
       */
      'no-return-await': 'off', // TypeScript 已处理

      /**
       * 要求或禁止命名函数表达式
       * 'off': 不强制
       */
      'func-names': 'off',

      /**
       * 一致的 return 语句
       * 'off': 不强制函数始终返回值
       */
      'consistent-return': 'off',
    },
  },
)
