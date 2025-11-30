/**
 * Lint-staged 配置文件
 *
 * 作用：对 Git 暂存区（staged）的文件执行 lint 检查
 * 触发时机：git commit 时，由 Husky pre-commit 钩子自动调用
 * 优势：只检查修改的文件，提升检查速度
 *
 * 工作流程：
 * 1. git add .               - 添加文件到暂存区
 * 2. git commit              - 尝试提交
 * 3. Husky 拦截 pre-commit   - 触发钩子
 * 4. 执行 lint-staged        - 读取此配置
 * 5. 匹配文件类型            - 按规则执行命令
 * 6. 检查通过 → 提交成功     - 检查失败 → 中止提交
 *
 * @type {import('lint-staged').Config}
 */
export default {
  // JavaScript/TypeScript 文件：ESLint 检查并自动修复
  // 检查：语法错误、代码规范、最佳实践
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],

  // JSON 文件：ESLint 检查并自动修复
  // 检查：JSON 格式、语法错误
  '*.json': ['eslint --fix'],

  // Vue 单文件组件：ESLint 检查并自动修复
  // 检查：<template>、<script>、<style> 三部分
  '*.vue': ['eslint --fix'],

  // 样式文件：Stylelint 检查并自动修复
  // 检查：CSS 规范、属性排序、现代语法
  // --allow-empty-input：允许空文件，不报错
  '*.{scss,less,html}': ['stylelint --fix --allow-empty-input'],

  // Markdown 文档：Prettier 格式化
  // 格式化：统一代码块、表格、列表格式
  '*.md': ['prettier --write'],
}
