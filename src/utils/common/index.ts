/**
 * 深度克隆对象
 * @param obj 需要克隆的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T
  }

  if (obj instanceof Object) {
    const copy = {} as Record<string, any>
    Object.keys(obj).forEach((key) => {
      copy[key] = deepClone((obj as Record<string, any>)[key])
    })
    return copy as T
  }

  return obj
}

/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间(ms)
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300): (...args: Parameters<T>) => void {
  let timer: number | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = window.setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流函数
 * @param fn 需要节流的函数
 * @param delay 延迟时间(ms)
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, delay = 300): (...args: Parameters<T>) => void {
  let lastTime = 0

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()

    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式
 */
export function formatDate(date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)

  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()

  const padZero = (num: number) => num.toString().padStart(2, '0')

  return format
    .replace(/YYYY/g, year.toString())
    .replace(/MM/g, padZero(month))
    .replace(/DD/g, padZero(day))
    .replace(/HH/g, padZero(hour))
    .replace(/mm/g, padZero(minute))
    .replace(/ss/g, padZero(second))
}

/**
 * 文件大小格式化
 * @param size 文件大小(字节)
 */
export function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`
  }
  else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`
  }
  else if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }
  else {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }
}
