/** @type {import("@commitlint/types").UserConfig} */
// 定义提交信息的规则，以便在提交代码时进行验证
export default {
  ignores: [commit => commit.includes('init')], // 忽略提交信息包含 "init" 的提交
  extends: ['@commitlint/config-conventional'], // 继承了 @commitlint/config-conventional 的标准配置。
  rules: {
    'body-leading-blank': [2, 'always'], // 确保提交信息的正文部分前有一个空行。
    'footer-leading-blank': [1, 'always'], // 确保提交信息的页脚前有一个空行。
    'header-max-length': [2, 'always', 108], // 确保提交信息的头部不超过 108 个字符。
    'subject-empty': [2, 'never'], // 确保提交信息的主题不为空。
    'type-empty': [2, 'never'], // 确保提交信息的类型不为空。
    'subject-case': [0], // 不对提交信息的主题大小写进行验证。
    'type-enum': [// 指定提交信息类型必须为以下之一：
      2,
      'always',
      [
        'feat', // 新增功能
        'fix', // 修复缺陷
        'docs', // 文档变更
        'style', // 代码格式（不影响功能，例如空格、分号等格式修正）
        'refactor', // 代码重构（不包括 bug 修复、功能新增）
        'perf', // 性能优化
        'test', // 添加疏漏测试或已有测试改动
        'build', // 构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）
        'ci', // 修改 CI 配置、脚本
        'revert', // 回滚 commit
        'chore', // 对构建过程或辅助工具和库的更改（不影响源文件、测试用例）
      ],
    ],
  },
}
