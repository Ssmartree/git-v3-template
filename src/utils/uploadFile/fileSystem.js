/**
 * 文件系统类 - 基于 Web Worker 的文件上传下载管理器
 * 使用 Worker 在后台线程处理文件操作，避免阻塞主线程 UI
 * 支持断点续传功能
 */
export class FileSystem {
  constructor() {
    this.worker = null // Worker 实例，用于后台处理文件操作
    this.isPaused = false // 是否暂停
    this.currentTask = null // 当前任务信息
    this.resumeData = null // 断点续传数据
  }

  /**
   * 启动 Worker
   * 懒加载模式，只在需要时创建 Worker 实例
   */
  startWorker() {
    if (!this.worker) {
      this.worker = new Worker(new URL('./woker.js', import.meta.url))
    }
  }

  /**
   * 停止 Worker
   * 终止 Worker 线程并释放资源
   */
  stopWorker() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }

  /**
   * 上传文件（分片上传，支持断点续传）
   * @param {object} options - 上传配置
   * @param {File} options.file - 要上传的文件对象
   * @param {string} options.url - 上传的目标 URL
   * @param {number} options.chunkSize - 分片大小（字节）
   * @param {boolean} [options.enableResume] - 是否启用断点续传（默认 true）
   * @param {string} [options.taskId] - 任务 ID，用于保存和恢复进度
   * @param {Function} onProgress - 进度回调函数 (progress: number) => void
   * @param {Function} onComplete - 完成回调函数 (result: {fileHash, totalSize}) => void
   * @param {Function} onError - 错误回调函数 (error: string, resumeInfo: object) => void
   */
  uploadFile({ file, url, chunkSize, enableResume = true, taskId }, onProgress, onComplete, onError) {
    this.startWorker()
    this.isPaused = false

    // 保存当前任务信息
    this.currentTask = {
      type: 'upload',
      file,
      url,
      chunkSize,
      enableResume,
      taskId: taskId || this.generateTaskId(file.name, file.size),
    }

    // 向 Worker 发送上传任务
    this.worker.postMessage({
      action: 'upload',
      file,
      url,
      chunkSize,
      enableResume,
    })

    // 监听 Worker 返回的消息
    this.worker.onmessage = (event) => {
      const { action, progress, result, error, resumeInfo, chunkIndex } = event.data

      if (action === 'progress') {
        // 进度更新
        onProgress?.(progress, chunkIndex)
      }
      else if (action === 'complete') {
        // 上传完成，清除断点续传数据
        if (this.currentTask?.taskId) {
          this.clearResumeData(this.currentTask.taskId)
        }
        onComplete?.(result)
      }
      else if (action === 'error') {
        // 上传失败，保存断点续传信息
        if (resumeInfo && this.currentTask?.taskId) {
          this.saveResumeData(this.currentTask.taskId, resumeInfo)
        }
        onError?.(error, resumeInfo)
      }
    }
  }

  /**
   * 恢复上传任务
   * @param {string} taskId - 任务 ID
   * @param {File} file - 文件对象
   * @param {Function} onProgress - 进度回调
   * @param {Function} onComplete - 完成回调
   * @param {Function} onError - 错误回调
   */
  resumeUpload(taskId, file, onProgress, onComplete, onError) {
    const resumeInfo = this.getResumeData(taskId)
    if (!resumeInfo) {
      onError?.('未找到断点续传数据')
      return
    }

    // 使用保存的配置重新上传
    this.uploadFile(
      {
        file,
        url: resumeInfo.url || '',
        chunkSize: resumeInfo.chunkSize,
        enableResume: true,
        taskId,
      },
      onProgress,
      onComplete,
      onError,
    )
  }

  /**
   * 下载文件（分片下载，支持断点续传）
   * @param {object} options - 下载配置
   * @param {string} options.url - 下载的目标 URL
   * @param {number} options.chunkSize - 分片大小（字节）
   * @param {boolean} [options.autoSave] - 是否自动保存文件到本地
   * @param {string} [options.taskId] - 任务 ID，用于保存和恢复进度
   * @param {object} [options.resumeData] - 断点续传数据
   * @param {Function} onProgress - 进度回调函数 (progress: number) => void
   * @param {Function} onComplete - 完成回调函数 (result: {file, totalSize, fileName}) => void
   * @param {Function} onError - 错误回调函数
   */
  downloadFile({ url, chunkSize, autoSave = true, taskId, resumeData }, onProgress, onComplete, onError) {
    this.startWorker()
    this.isPaused = false

    // 保存当前任务信息
    this.currentTask = {
      type: 'download',
      url,
      chunkSize,
      autoSave,
      taskId: taskId || this.generateTaskId(url, 0),
    }

    // 向 Worker 发送下载任务
    this.worker.postMessage({
      action: 'download',
      url,
      chunkSize,
      resumeData,
    })

    // 监听 Worker 返回的消息
    this.worker.onmessage = (event) => {
      const { action, progress, result, error, resumeData: newResumeData, chunkIndex } = event.data

      if (action === 'progress') {
        // 进度更新，保存断点续传数据
        if (newResumeData && this.currentTask?.taskId) {
          this.saveResumeData(this.currentTask.taskId, newResumeData)
        }
        onProgress?.(progress, chunkIndex)
      }
      else if (action === 'complete') {
        // 下载完成，清除断点续传数据
        if (this.currentTask?.taskId) {
          this.clearResumeData(this.currentTask.taskId)
        }

        // 如果需要自动保存
        if (autoSave && result.file) {
          this.saveFile(result.file, result.fileName)
        }

        onComplete?.(result)
      }
      else if (action === 'error') {
        // 下载失败，保存断点续传信息
        if (newResumeData && this.currentTask?.taskId) {
          this.saveResumeData(this.currentTask.taskId, newResumeData)
        }
        onError?.(error, newResumeData)
      }
    }
  }

  /**
   * 恢复下载任务
   * @param {string} taskId - 任务 ID
   * @param {Function} onProgress - 进度回调
   * @param {Function} onComplete - 完成回调
   * @param {Function} onError - 错误回调
   */
  resumeDownload(taskId, onProgress, onComplete, onError) {
    const resumeData = this.getResumeData(taskId)
    if (!resumeData) {
      onError?.('未找到断点续传数据')
      return
    }

    // 使用保存的配置重新下载
    this.downloadFile(
      {
        url: resumeData.url,
        chunkSize: resumeData.chunkSize,
        autoSave: true,
        taskId,
        resumeData,
      },
      onProgress,
      onComplete,
      onError,
    )
  }

  /**
   * 暂停当前任务
   */
  pause() {
    this.isPaused = true
    this.stopWorker()
  }

  /**
   * 恢复暂停的任务
   * @param {object} options - 任务参数
   * @param {Function} onProgress - 进度回调
   * @param {Function} onComplete - 完成回调
   * @param {Function} onError - 错误回调
   */
  resume(options, onProgress, onComplete, onError) {
    if (!this.currentTask) {
      onError?.('没有可恢复的任务')
      return
    }

    if (this.currentTask.type === 'upload') {
      this.resumeUpload(this.currentTask.taskId, options.file, onProgress, onComplete, onError)
    }
    else if (this.currentTask.type === 'download') {
      this.resumeDownload(this.currentTask.taskId, onProgress, onComplete, onError)
    }
  }

  /**
   * 保存文件到本地
   * @param {Blob} blob - 文件 Blob 对象
   * @param {string} fileName - 文件名
   */
  saveFile(blob, fileName) {
    // 创建一个临时的下载链接
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.style.display = 'none'

    // 触发下载
    document.body.appendChild(a)
    a.click()

    // 清理
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * 生成任务 ID
   * @param {string} identifier - 标识符（文件名或 URL）
   * @param {number} size - 文件大小
   * @returns {string} - 任务 ID
   */
  generateTaskId(identifier, size) {
    return `task_${identifier}_${size}_${Date.now()}`
  }

  /**
   * 保存断点续传数据到 localStorage
   * @param {string} taskId - 任务 ID
   * @param {object} data - 断点续传数据
   */
  saveResumeData(taskId, data) {
    try {
      const key = `resume_${taskId}`
      // 注意：Blob 对象不能直接序列化，需要特殊处理
      const saveData = {
        ...data,
        timestamp: Date.now(),
      }
      // 移除不能序列化的 chunks
      if (saveData.chunks) {
        delete saveData.chunks
      }
      localStorage.setItem(key, JSON.stringify(saveData))
    }
    catch (error) {
      console.warn('保存断点续传数据失败', error)
    }
  }

  /**
   * 从 localStorage 获取断点续传数据
   * @param {string} taskId - 任务 ID
   * @returns {object|null} - 断点续传数据
   */
  getResumeData(taskId) {
    try {
      const key = `resume_${taskId}`
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    }
    catch (error) {
      console.warn('获取断点续传数据失败', error)
      return null
    }
  }

  /**
   * 清除断点续传数据
   * @param {string} taskId - 任务 ID
   */
  clearResumeData(taskId) {
    try {
      const key = `resume_${taskId}`
      localStorage.removeItem(key)
    }
    catch (error) {
      console.warn('清除断点续传数据失败', error)
    }
  }

  /**
   * 获取所有断点续传任务
   * @returns {Array} - 任务列表
   */
  getAllResumeTasks() {
    const tasks = []
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('resume_')) {
          const data = localStorage.getItem(key)
          if (data) {
            tasks.push({
              taskId: key.replace('resume_', ''),
              ...JSON.parse(data),
            })
          }
        }
      }
    }
    catch (error) {
      console.warn('获取断点续传任务失败', error)
    }
    return tasks
  }

  /**
   * 清理过期的断点续传数据（超过7天）
   */
  cleanExpiredResumeData() {
    const expireTime = 7 * 24 * 60 * 60 * 1000 // 7天
    const now = Date.now()

    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key && key.startsWith('resume_')) {
          const data = localStorage.getItem(key)
          if (data) {
            const parsed = JSON.parse(data)
            if (parsed.timestamp && now - parsed.timestamp > expireTime) {
              localStorage.removeItem(key)
            }
          }
        }
      }
    }
    catch (error) {
      console.warn('清理过期断点续传数据失败', error)
    }
  }
}
