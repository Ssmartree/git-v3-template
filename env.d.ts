/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 网站标题，应用名称 */
  // readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
