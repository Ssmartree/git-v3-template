/**
 * Stylelint 配置文件
 *
 * Stylelint 是一个强大的 CSS 检查工具，用于：
 * 1. 统一 CSS/SCSS 代码风格
 * 2. 自动排序 CSS 属性（提升可读性和性能）
 * 3. 检测 CSS 错误和不规范写法
 * 4. 支持 Vue、React 等框架的样式检查
 *
 * @type {import('stylelint').Config}
 * @see https://stylelint.io
 */
export default {
  // ==================== 继承预设配置 ====================

  /**
   * 继承的配置预设
   *
   * 1. stylelint-config-standard
   *    - Stylelint 官方推荐的标准配置
   *    - 包含所有核心规则
   *    - 基于社区最佳实践
   *
   * 2. stylelint-config-recess-order
   *    - CSS 属性排序规则
   *    - 基于 Recess（Twitter Bootstrap 使用的排序规则）
   *    - 按照：定位 > 盒模型 > 排版 > 视觉 > 其他 的顺序
   *    - 提升代码可读性和浏览器渲染性能
   */
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
  ],

  // ==================== 文件类型特定配置 ====================

  /**
   * 针对不同文件类型的特殊配置
   * 不同的文件格式需要不同的解析器
   */
  overrides: [
    // --- HTML 和 Vue 文件配置 ---
    {
      /**
       * 匹配 CSS、HTML、Vue 文件
       * 注意：Vue 文件中的 <style> 标签需要特殊解析
       */
      files: ['**/*.(css|html|vue)'],

      /**
       * 使用 postcss-html 解析器
       * 专门用于解析 HTML 和 Vue 文件中的样式
       * 可以正确处理 <style> 标签内的 CSS
       */
      customSyntax: 'postcss-html',
    },

    // --- SCSS 文件配置 ---
    {
      /**
       * 匹配所有 SCSS 文件
       */
      files: ['*.scss', '**/*.scss'],

      /**
       * 使用 postcss-scss 解析器
       * 支持 SCSS 语法（变量、嵌套、mixin 等）
       */
      customSyntax: 'postcss-scss',

      /**
       * SCSS 特定规则
       * 关闭某些不适用于 SCSS 的规则
       */
      rule: {
        'scss/percent-placeholder-pattern': null, // 不限制占位符选择器命名
        'scss/at-mixin-pattern': null, // 不限制 mixin 命名
      },
    },
  ],

  // ==================== 规则配置 ====================

  rules: {
    // -------------------- CSS 现代语法支持 --------------------

    /**
     * 媒体查询范围表示法
     * null: 不强制使用特定格式
     *
     * 允许使用：
     * - 传统格式：@media (min-width: 768px) and (max-width: 1024px)
     * - 范围格式：@media (768px <= width <= 1024px)
     */
    'media-feature-range-notation': null,

    /**
     * :not() 选择器表示法
     * null: 不强制使用特定格式
     *
     * 允许使用：
     * - 简单格式：:not(.class)
     * - 复杂格式：:not(.class1, .class2)
     */
    'selector-not-notation': null,

    /**
     * @import 语句表示法
     * null: 不限制 @import 的写法
     *
     * 允许：
     * - @import 'file.css'
     * - @import url('file.css')
     */
    'import-notation': null,

    // -------------------- CSS 函数和选择器 --------------------

    /**
     * 禁止未知函数
     * null: 关闭此规则
     *
     * 原因：某些 CSS-in-JS 库或预处理器会使用自定义函数
     * 例如：theme(), var(), custom-function()
     */
    'function-no-unknown': null,

    /**
     * 选择器类名模式
     * null: 不限制类名命名规则
     *
     * 允许任意命名风格：
     * - BEM: .block__element--modifier
     * - kebab-case: .my-class
     * - camelCase: .myClass
     * - PascalCase: .MyClass
     */
    'selector-class-pattern': null,

    // -------------------- Vue 特定配置 --------------------

    /**
     * 允许的伪类选择器
     *
     * Vue 2.x 和 3.x 的深度选择器：
     * - :deep() - Vue 3 推荐语法，用于穿透 scoped 样式
     * - :global() - 全局样式，不受 scoped 限制
     *
     * 使用场景：
     * <style scoped>
     * .parent :deep(.child) { } // 修改子组件样式
     * :global(.global-class) { } // 定义全局样式
     * </style>
     */
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: [
          'deep', // Vue 3 深度选择器 :deep()
          'global', // Vue 全局选择器 :global()
        ],
      },
    ],

    /**
     * 允许的伪元素选择器
     *
     * Vue 2.x 和 3.x 的特殊伪元素：
     * - ::v-deep - Vue 2 深度选择器（已废弃，但仍需兼容）
     * - ::v-global - Vue 全局伪元素
     * - ::v-slotted - Vue 3 插槽选择器，用于修改插槽内容样式
     * - /deep/ - Vue 2 旧语法（已废弃）
     * - >>> - Vue 2 旧语法（已废弃）
     * - :deep - Vue 3 推荐语法（作为伪元素使用时）
     *
     * 使用示例：
     * <style scoped>
     * // Vue 2 (已废弃，仅兼容)
     * ::v-deep .child { }
     * /deep/ .child { }
     * >>> .child { }
     *
     * // Vue 3 (推荐)
     * :deep(.child) { }
     * ::v-slotted(.slot-content) { }
     * :global(.global-class) { }
     * </style>
     */
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: [
          'v-deep', // Vue 2 深度选择器 ::v-deep
          'v-global', // Vue 全局伪元素 ::v-global
          'v-slotted', // Vue 3 插槽选择器 ::v-slotted
          'deep', // 兼容 :deep 写法
        ],
      },
    ],

    // -------------------- CSS 预处理器支持 --------------------

    /**
     * 未知的 @规则
     *
     * 允许的 @规则列表：
     * - Tailwind CSS: @tailwind, @apply, @variants, @responsive, @screen
     * - SCSS: @function, @if, @each, @include, @mixin, @extend, @use
     * - UnoCSS: 类似 Tailwind 的指令
     *
     * 这些是现代 CSS 框架和预处理器的特殊语法
     */
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          // Tailwind CSS / UnoCSS 指令
          'tailwind', // @tailwind base/components/utilities
          'apply', // @apply flex items-center
          'variants', // @variants hover, focus
          'responsive', // @responsive { ... }
          'screen', // @screen md { ... }

          // SCSS / Sass 指令
          'function', // @function name() { ... }
          'if', // @if condition { ... }
          'each', // @each $item in $list { ... }
          'include', // @include mixin-name
          'mixin', // @mixin name { ... }
          'extend', // @extend .class
          'use', // @use 'module'
        ],
      },
    ],

    // -------------------- 样式验证规则 --------------------

    /**
     * 空源文件
     * null: 允许空的样式文件
     *
     * 某些组件可能暂时没有样式，但保留 <style> 标签
     */
    'no-empty-source': null,

    /**
     * 命名网格区域验证
     * null: 不验证网格区域名称
     *
     * CSS Grid 的 grid-template-areas 语法检查
     */
    'named-grid-areas-no-invalid': null,

    /**
     * 禁止降序的特异性
     * null: 关闭此规则
     *
     * 原因：在某些场景下，后面的选择器特异性更低是合理的
     * 例如：使用 BEM 方法论时
     */
    'no-descending-specificity': null,

    /**
     * 字体族必须有通用族
     * null: 不强制添加通用字体族
     *
     * 允许：font-family: 'Custom Font'
     * 不强制：font-family: 'Custom Font', sans-serif
     */
    'font-family-no-missing-generic-family-keyword': null,

    // -------------------- 代码格式规则 --------------------

    /**
     * 规则前的空行
     * 'never': 规则前不需要空行
     *
     * 示例（强制）：
     * .class1 { }
     * .class2 { }  // 不需要空行
     *
     * 提升代码紧凑度
     */
    'rule-empty-line-before': 'never',

    /**
     * 注释前的空行
     * 'never': 注释前不需要空行
     *
     * 示例（强制）：
     * .class { }
     * / 注释 /  // 不需要空行
     * .another { }
     */
    'comment-empty-line-before': 'never',

    /**
     * 未知单位检查
     * 允许的自定义单位：
     * - rpx: 微信小程序使用的响应式像素单位
     *
     * 其他单位（px, em, rem, vh, vw 等）都是标准单位
     */
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['rpx'], // 允许 rpx 单位
      },
    ],

    // -------------------- CSS 属性排序 --------------------

    /**
     * CSS 内容顺序规则
     *
     * 定义 CSS 规则内不同类型内容的顺序：
     *
     * 1. dollar-variables   - SCSS 变量（$variable）
     * 2. custom-properties  - CSS 自定义属性（--var）
     * 3. at-rules          - @规则（@include, @extend 等）
     * 4. declarations      - CSS 声明（color, margin 等）
     * 5. @supports         - 特性查询
     * 6. @media            - 媒体查询
     * 7. rules             - 嵌套规则
     *
     * 示例：
     * .class {
     *   // 1. SCSS 变量
     *   $local-var: 10px;
     *
     *   // 2. CSS 自定义属性
     *   --custom-color: red;
     *
     *   // 3. @规则
     *   @include mixin-name;
     *
     *   // 4. CSS 声明（按 recess-order 排序）
     *   display: flex;
     *   width: 100%;
     *   color: red;
     *
     *   // 5. @supports
     *   @supports (display: grid) {
     *     display: grid;
     *   }
     *
     *   // 6. @media
     *   @media (min-width: 768px) {
     *     width: 50%;
     *   }
     *
     *   // 7. 嵌套规则
     *   &:hover {
     *     color: blue;
     *   }
     * }
     *
     * 优势：
     * - 提升代码可读性
     * - 统一团队代码风格
     * - 便于维护和查找
     */
    'order/order': [
      [
        'dollar-variables', // $variable
        'custom-properties', // --custom-property
        'at-rules', // @include, @extend
        'declarations', // color: red
        {
          type: 'at-rule',
          name: 'supports', // @supports
        },
        {
          type: 'at-rule',
          name: 'media', // @media
        },
        'rules', // 嵌套规则
      ],
      {
        severity: 'error', // 违反规则时报错
      },
    ],

    // -------------------- CSS 属性排序（详细说明） --------------------

    /**
     * CSS 属性排序规则
     *
     * 由 stylelint-config-recess-order 自动提供
     * 不需要手动配置，但了解排序逻辑很重要
     *
     * 排序逻辑（从上到下）：
     *
     * 1️⃣ 定位（Positioning）
     *    position, top, right, bottom, left, z-index
     *    原因：定位属性影响元素在文档流中的位置，最重要
     *
     * 2️⃣ 盒模型（Box Model）
     *    display, flex, grid, float, width, height, padding, margin, border
     *    原因：决定元素的布局和占据空间
     *
     * 3️⃣ 排版（Typography）
     *    font-family, font-size, line-height, text-align, color
     *    原因：控制文本的显示方式
     *
     * 4️⃣ 视觉（Visual）
     *    background, opacity, box-shadow, transform, animation
     *    原因：控制元素的视觉效果
     *
     * 5️⃣ 其他（Misc）
     *    cursor, pointer-events, user-select
     *    原因：其他杂项属性
     *
     * 示例（自动排序后）：
     * .element {
     *   // 定位
     *   position: absolute;
     *   top: 0;
     *   left: 0;
     *   z-index: 10;
     *
     *   // 盒模型
     *   display: flex;
     *   justify-content: center;
     *   align-items: center;
     *   width: 100px;
     *   height: 100px;
     *   padding: 10px;
     *   margin: 10px;
     *   border: 1px solid #000;
     *   border-radius: 4px;
     *
     *   // 排版
     *   font-size: 14px;
     *   line-height: 1.5;
     *   text-align: center;
     *   color: #333;
     *
     *   // 视觉
     *   background: #fff;
     *   opacity: 1;
     *   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
     *
     *   // 其他
     *   cursor: pointer;
     *   transition: all 0.3s;
     * }
     *
     * 优势：
     * - ✅ 提升代码可读性（一目了然）
     * - ✅ 便于查找和修改
     * - ✅ 减少 Git 冲突（统一顺序）
     * - ✅ 可能提升浏览器渲染性能（理论上）
     */
  },

  // ==================== 忽略文件配置 ====================

  /**
   * 不检查的文件类型
   *
   * Stylelint 专门用于检查样式文件
   * JavaScript/TypeScript 文件中的样式（如 styled-components）
   * 应该由 ESLint 负责检查
   *
   * 忽略：
   * - .js  - JavaScript
   * - .jsx - React JSX
   * - .ts  - TypeScript
   * - .tsx - TypeScript JSX
   */
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
  ],
}
