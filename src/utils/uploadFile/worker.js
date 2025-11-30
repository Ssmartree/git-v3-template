/* eslint-env worker */
/* eslint-disable no-restricted-globals */

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
 * 上传文件（断点续传版本）
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
    formData.append('chunk', chunk)
    formData.append('hash', fileHash)
    formData.append('chunkIndex', chunkIndex)
    formData.append('totalSize', totalSize)

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
