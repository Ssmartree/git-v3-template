// JS 执行异常
window.onerror = function (msg, url, line, col, error) {
  console.log('JS Error:', { msg, url, line, col, error })
}

// Promise 错误
window.addEventListener('unhandledrejection', (event) => {
  console.log('Promise Error:', event.reason)
})

// 静态资源加载错误（你的）
window.addEventListener('error', (event) => {
  const target = event.target as HTMLElement | null
  if (target && (target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
    const element = target as HTMLScriptElement | HTMLLinkElement
    console.log('Resource Fail:', 'src' in element ? element.src : element.href)
  }
}, true) // 必须捕获阶段
