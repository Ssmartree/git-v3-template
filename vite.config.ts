import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, type PluginOption } from 'vite'
import viteCompression from 'vite-plugin-compression'
import vueDevTools from 'vite-plugin-vue-devtools'
import { compress, dropConsole, sourcemap } from './configs/build'

export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd())

  const plugins: PluginOption[] = [
    vue(),
    vueDevTools(),
    UnoCSS(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        'pinia',
        'vue-router',
        { 'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'] },
      ],
      vueTemplate: true,
      dts: 'types/auto-imports.d.ts',
    }),
    Components({ resolvers: [NaiveUiResolver()], dts: 'types/components.d.ts' }),
    visualizer({ // 打包分析
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ]

  // gzip压缩
  if (compress) {
    plugins.push(viteCompression({
      verbose: true, // 是否在控制台中输出压缩结果
      disable: false, // 是否禁用压缩
      threshold: 10240, // 仅压缩大于 10KB 的文件
      algorithm: 'gzip', // 使用 gzip 压缩
      ext: '.gz', // 生成的文件扩展名
      deleteOriginFile: false, // 是否删除原始文件
    }))
  }

  return {
    base: './',
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: { // 用于为 CSS 预处理器（在这个例子中是 SCSS）设置选项
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    esbuild: {
      pure: dropConsole ? ['console.log', 'debugger'] : [], // 移除打包构建时的console.log和debugger
    },
    build: { // build 配置部分用于控制构建过程中的各种选项。
      target: 'es2015', // 终打包输出的 JavaScript 语法版本。
      outDir: 'dist', // 打包输出目录，默认就是 dist。你可以改成 build/ 等自定义路径。
      assetsDir: 'assets', // 打包后静态资源（js、css、图片等）的统一存放目录。打包后会是：dist/assets/...。
      sourcemap, // 是否生成sourcemap
      assetsInlineLimit: 1024 * 10, // 10kb以下，转Base64
      chunkSizeWarningLimit: 1500, // 配置文件大小提醒限制，默认500
      terserOptions: {
        compress: {
          // drop_console: env.VITE_DROP_CONSOLE === 'true',  移除所有 console.* 语句
          // drop_debugger: true, 删除所有 debugger 语句。
        },
      },

      rollupOptions: {
        output: {
          // 每个node_modules模块分成一个js文件
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              return 'vendor' // 第三方依赖合并在一起
              // return id.toString().split('node_modules/.pnpm/')[1].split('/')[0].toString() //第三方依赖抽离成单独的js文件
            }
            return undefined
          },
          // 用于从入口点创建的块的打包输出格式
          // [name]表示原文件名,[hash]表示该文件内容hash值 确保文件内容变化时缓存失效 [ext]表示文件扩展名 （css / png / svg 等）
          entryFileNames: 'assets/js/[name].[hash].js', // 入口文件（如 main.ts）的命名规则 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: 'assets/js/[name].[hash].js', // 拆分出来的代码块（动态 import 的部分）的命名规则 用于输出静态资源的命名，
          assetFileNames: 'assets/[ext]/[name].[hash].[ext]', // 静态资源（CSS、图片、字体等）的命名规则
        },
        external: ['src/utils/ts/**/*.ts'],
      },
    },
    server: {
      proxy: {
        '/brdcontrol-service': {
          target: 'http://192.168.5.213:5555',
        },
      },
    },
  }
})
