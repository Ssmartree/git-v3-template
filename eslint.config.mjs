import antfu from '@antfu/eslint-config'

export default antfu({
  // 使用prettier 格式化css html 等
  formatters: true,
  // unocss 检测&格式化
  unocss: true,
  // vue的eslint配置
  vue: true,
  // 保存删除未引入的代码
  isInEditor: false,
  // 9x版本 忽略文件这种配置方式 废弃掉eslintignore
  ignores: [
    '*.sh',
    'node_modules',
    '*.md',
    '*.woff',
    '*.ttf',
    '.idea',
    '/public',
    '/docs',
    '.husky',
    '.local',
    '/bin',
    'Dockerfile',
  ],
  rules: {
    'no-console': 'off', // 关闭对 console 的检测。
    'vue/html-self-closing': 'off', // 关闭对 Vue 组件自动闭合标签的强制。
    'vue/component-name-in-template-casing': ['error', 'kebab-case', {
      registeredComponentsOnly: false, // 强制使用 kebab-case 方式命名组件。
    }],
    // 强制使用 kebab-case 方式定义组件。
    'vue/component-definition-name-casing': ['error', 'kebab-case'],
    // 关闭对全局 process 使用的偏好
    'node/prefer-global/process': 'off',
    // 'no-unused-vars': 'off', // 将未使用变量的报错改为警告 "off", 0, "warn", 1, "error", or 2.
    'unused-imports/no-unused-vars': [
      'warn', // 将未使用变量的报错改为警告 "off", 0, "warn", 1, "error", or 2.
      {
        vars: 'all', // 检查所有变量
        varsIgnorePattern: '^_', // 忽略 _ 开头的变量
        args: 'after-used', // 只检查最后一个使用过的参数之后的未使用参数
        argsIgnorePattern: '^_', // 忽略 _ 开头的参数
      },
    ],
    'unused-imports/no-unused-imports': 'warn', // 将未使用导入的报错改为警告
  },
})
