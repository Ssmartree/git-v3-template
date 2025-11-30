export class Storage {
  // 设置值
  static set(key: string, value: any): void {
    try {
      let jsonValue: string

      // 检查是否是 Set 类型
      if (value instanceof Set) {
        jsonValue = JSON.stringify({
          type: 'Set',
          value: Array.from(value),
        })
      }
      // 检查是否是 Map 类型
      else if (value instanceof Map) {
        jsonValue = JSON.stringify({
          type: 'Map',
          value: Array.from(value.entries()),
        })
      }
      // 处理其他类型
      else {
        jsonValue = JSON.stringify(value)
      }

      localStorage.setItem(key, jsonValue)
    }
    catch (error) {
      console.error('Setting value in localStorage failed:', error)
    }
  }

  // 获取值
  static get(key: string): any {
    try {
      const jsonValue = localStorage.getItem(key)

      if (!jsonValue)
        return null

      const parsedValue = JSON.parse(jsonValue)

      // 检查是否是 Set 类型
      if (parsedValue.type === 'Set' && Array.isArray(parsedValue.value)) {
        const uniqueValues = new Set(parsedValue.value)
        if (uniqueValues.size === parsedValue.value.length) {
          return uniqueValues // 返回 Set
        }
      }

      // 检查是否是 Map 类型
      if (parsedValue.type === 'Map' && Array.isArray(parsedValue.value)) {
        if (parsedValue.value.every((item: any) => Array.isArray(item) && item.length === 2)) {
          return new Map(parsedValue.value) // 返回 Map
        }
      }

      return parsedValue // 返回其他类型或对象
    }
    catch (error) {
      console.error('Getting value from localStorage failed:', error)
      return null
    }
  }

  // 删除值
  static remove(key: string): void {
    localStorage.removeItem(key)
  }

  // 清除所有值
  static clear(): void {
    localStorage.clear()
  }

  // 检查是否存在
  static has(key: string): boolean {
    return localStorage.getItem(key) !== null
  }
}
