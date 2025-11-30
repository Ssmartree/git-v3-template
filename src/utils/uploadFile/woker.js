/* eslint-env worker */
/* eslint-disable no-restricted-globals */

/**
 * 文件上传下载 Worker
 *
 * 功能说明：
 * 1. 在 Web Worker 后台线程中处理文件上传/下载，避免阻塞主线程 UI
 * 2. 支持大文件分片上传/下载
 * 3. 使用流式计算 MD5，避免内存溢出
 * 4. 实时向主线程报告进度
 *
 * 工作流程：
 * - 上传：计算 MD5 -> 分片 -> 逐片上传 -> 报告进度 -> 完成
 * - 下载：分片下载 -> 报告进度 -> 完成
 *
 * 消息格式：
 * 接收：{ action: 'upload'|'download', file?, url, chunkSize }
 * 发送：{ action: 'progress'|'complete'|'error', progress?, result?, error? }
 *
 * 注意：在 Web Worker 环境中使用 self 是标准做法，self 指向 WorkerGlobalScope
 */

import SparkMD5 from 'spark-md5'

/**
 * 流式计算文件 MD5 哈希值
 * 采用流式处理避免一次性加载大文件到内存
 * @param {File} file - 要计算哈希的文件对象
 * @returns {Promise<string>} - 文件的 MD5 哈希值（十六进制字符串）
 */
async function calculateMD5(file) {
  const chunkSize = 2 * 1024 * 1024 // 2MB 分块大小，用于 MD5 计算
  const spark = new SparkMD5.ArrayBuffer()
  let offset = 0

  // 分块读取文件并累加计算 MD5
  while (offset < file.size) {
    const chunk = await file.slice(offset, offset + chunkSize).arrayBuffer()
    spark.append(chunk)
    offset += chunkSize
  }

  return spark.end() // 返回最终的 MD5 哈希值
}

/**
 * 获取服务器已上传的分片信息
 * @param {string} url - 上传接口地址（不含 status 路径）
 * @param {string} fileHash - 文件 MD5 哈希
 * @returns {Promise<Set<number>>}
 */
async function getUploadedChunks(url, fileHash) {
  const res = await fetch(`${url}/status?hash=${fileHash}`)
  if (!res.ok)
    return new Set()
  const data = await res.json()
  return new Set(data.uploadedChunks || [])
}

/**
 * 上传文件（分片上传，支持断点续传）
 * @param {File} file - 要上传的文件对象
 * @param {string} url - 上传的目标服务器 URL
 * @param {number} chunkSize - 每个分片的大小（字节）
 * @param {boolean} enableResume - 是否启用断点续传
 */
async function uploadFile(file, url, chunkSize) {
  const totalSize = file.size
  const fileHash = await calculateMD5(file)

  // 获取已上传分片列表
  const uploadedChunks = await getUploadedChunks(url, fileHash)

  let chunkIndex = 0
  let offset = 0

  const totalChunks = Math.ceil(totalSize / chunkSize)

  const uploadChunk = async () => {
    // 上传结束
    if (chunkIndex >= totalChunks) {
      self.postMessage({
        action: 'complete',
        result: { fileHash, totalSize },
      })
      return
    }

    // 如果该分片已上传，跳过
    if (uploadedChunks.has(chunkIndex)) {
      offset += chunkSize
      chunkIndex++
      const progress = Math.min((offset / totalSize) * 100, 100)
      self.postMessage({ action: 'progress', progress })
      await uploadChunk()
      return
    }

    // 上传当前分片
    const start = chunkIndex * chunkSize
    const end = Math.min(start + chunkSize, totalSize)
    const chunk = file.slice(start, end)

    const formData = new FormData()
    formData.append('hash', fileHash)
    formData.append('chunkIndex', chunkIndex)
    formData.append('totalSize', totalSize)
    formData.append('chunk', chunk)

    try {
      await fetch(url, { method: 'POST', body: formData })
      offset += chunk.size
      const progress = Math.min((offset / totalSize) * 100, 100)
      self.postMessage({ action: 'progress', progress })
      chunkIndex++
      await uploadChunk()
    }
    catch (error) {
      self.postMessage({ action: 'error', error: error.message })
    }
  }

  await uploadChunk()
}

/**
 * 下载文件（分片下载，支持断点续传）
 * @param {string} url - 下载的目标服务器 URL
 * @param {number} chunkSize - 每个分片的大小（字节）
 * @param {object} resumeData - 断点续传数据（可选）
 */
async function downloadFile(url, chunkSize, resumeData = null) {
  let offset = 0 // 当前下载的偏移量
  let totalSize = 0 // 文件总大小（第一次请求时从服务器获取）
  const chunks = [] // 存储所有下载的分片数据
  const downloadedIndexes = new Set() // 已下载的分片索引

  // 如果有断点续传数据，恢复之前的进度
  if (resumeData && resumeData.chunks && resumeData.totalSize) {
    totalSize = resumeData.totalSize
    offset = resumeData.offset || 0

    // 恢复已下载的分片
    if (resumeData.chunks.length > 0) {
      chunks.push(...resumeData.chunks)
      resumeData.chunks.forEach((_, index) => {
        downloadedIndexes.add(index)
      })
    }
  }

  /**
   * 递归下载分片
   * 每次下载一个分片，成功后递归调用自己下载下一个分片
   */
  const downloadChunk = async () => {
    try {
      const chunkIndex = Math.floor(offset / chunkSize)

      // 跳过已下载的分片
      if (downloadedIndexes.has(chunkIndex)) {
        offset += chunkSize
        const progress = Math.min((offset / totalSize) * 100, 100)

        self.postMessage({
          action: 'progress',
          progress,
        })

        if (offset < totalSize) {
          await downloadChunk()
        }
        return
      }

      // 请求指定范围的分片数据
      // 使用 HTTP Range 请求头进行分片下载
      const response = await fetch(url, {
        headers: {
          Range: `bytes=${offset}-${offset + chunkSize - 1}`,
        },
      })

      // 第一次请求时获取文件总大小
      if (totalSize === 0) {
        const contentRange = response.headers.get('Content-Range')
        if (contentRange) {
          // Content-Range 格式: "bytes 0-1023/5000"
          totalSize = Number.parseInt(contentRange.split('/')[1])
        }
        else {
          // 如果服务器不支持 Range，获取 Content-Length
          totalSize = Number.parseInt(response.headers.get('Content-Length') || '0')
        }
      }

      // 获取分片数据
      const chunkBlob = await response.blob()
      chunks[chunkIndex] = chunkBlob // 按索引保存分片，支持乱序下载
      downloadedIndexes.add(chunkIndex)

      // 更新偏移量和进度
      offset += chunkBlob.size
      const progress = Math.min((offset / totalSize) * 100, 100)

      // 向主线程报告进度，并附带断点续传信息
      self.postMessage({
        action: 'progress',
        progress,
        chunkIndex,
        resumeData: {
          offset,
          totalSize,
          downloadedIndexes: Array.from(downloadedIndexes),
          url,
          chunkSize,
        },
      })

      // 判断是否还有剩余分片需要下载
      if (offset < totalSize) {
        // 递归下载下一个分片
        await downloadChunk()
      }
      else {
        // 所有分片下载完成，拼接成完整文件
        const completeFile = new Blob(chunks)

        // 发送完整的文件数据给主线程
        self.postMessage({
          action: 'complete',
          result: {
            file: completeFile,
            totalSize,
            fileName: getFileNameFromUrl(url),
          },
        })
      }
    }
    catch (error) {
      // 下载失败，保存断点续传信息
      self.postMessage({
        action: 'error',
        error: error.message,
        resumeData: {
          offset,
          totalSize,
          chunks, // 保存已下载的分片
          downloadedIndexes: Array.from(downloadedIndexes),
          url,
          chunkSize,
        },
      })
    }
  }

  // 开始下载
  await downloadChunk()
}

/**
 * 从 URL 中提取文件名
 * @param {string} url - 文件 URL
 * @returns {string} - 文件名
 */
function getFileNameFromUrl(url) {
  try {
    const urlObj = new URL(url, self.location.href)
    const pathname = urlObj.pathname
    return pathname.substring(pathname.lastIndexOf('/') + 1) || 'download'
  }
  catch {
    return 'download'
  }
}

/**
 * 监听主线程发送的消息
 * Worker 的消息处理入口
 */
self.onmessage = async (event) => {
  const { action, file, url, chunkSize, enableResume, resumeData } = event.data

  try {
    if (action === 'upload') {
      // 执行上传任务（支持断点续传）
      await uploadFile(file, url, chunkSize, enableResume)
    }
    else if (action === 'download') {
      // 执行下载任务（支持断点续传）
      await downloadFile(url, chunkSize, resumeData)
    }
  }
  catch (error) {
    // 捕获未处理的错误，通知主线程
    self.postMessage({
      action: 'error',
      error: error.message,
    })
  }
}
