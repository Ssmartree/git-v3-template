<!-- <script setup>
import { ref } from 'vue'
import { downloadFile, uploadFile } from './fileSystem' // 引入外部文件系统功能

// 创建响应式变量
const uploadProgress = ref(0)
const downloadProgress = ref(0)

// 外部定义的回调函数
function handleUploadProgress(progress) {
  uploadProgress.value = progress
}

function handleUploadComplete(result) {
  console.log(`Upload complete: ${result}`)
}

function handleDownloadProgress(progress) {
  downloadProgress.value = progress
  const { action, result } = e.data

  worker.onmessage = function (e) {
    const { action, result } = e.data

    if (action === 'complete') {
      const { file, fileName } = result

      // 创建 Blob URL
      const blobUrl = URL.createObjectURL(file)

      // 创建隐藏下载链接
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = fileName || 'download.bin'
      a.click()

      // 释放 URL
      URL.revokeObjectURL(blobUrl)
    }
  }

}

function handleDownloadComplete(result) {
  console.log(`Download complete: ${result}`)
}

// 选择文件后的回调
function onFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    // 上传文件时的回调函数
    uploadFile({ file, uploadUrl: 'https://your-upload-api.com/upload', chunkSize: 1024 * 1024 }, handleUploadProgress, handleUploadComplete)
  }
  else {
    // alert('Please select a file to upload.')
  }
}

// 上传文件
function uploadFileHandler() {
  const fileInput = document.getElementById('fileInput')
  const file = fileInput.files[0]
  if (file) {
    uploadFile({
      file,
      uploadUrl: 'https://your-upload-api.com/upload',
      chunkSize: 1024 * 1024,
    }, handleUploadProgress, handleUploadComplete)
  }
}
console.log('🚀 ~ uploadFileHandler', uploadFileHandler)

// 下载文件
function downloadFileHandler() {
  downloadFile({
    url: 'https://your-download-api.com/file',
    chunkSize: 1024 * 1024,
  }, handleDownloadProgress, handleDownloadComplete)
}
console.log('🚀 ~ downloadFileHandler', downloadFileHandler)
</script>

<template>
  <div>
    <h1>File Upload and Download Example</h1>

    <div>
      <h2>Upload File</h2>
      <input type="file" @change="onFileChange" />
      <button @click="uploadFile">
        Upload
      </button>
      <progress v-if="uploadProgress" :value="uploadProgress" max="100"></progress>
    </div>

    <div>
      <h2>Download File</h2>
      <button @click="downloadFile">
        Download
      </button>
      <progress v-if="downloadProgress" :value="downloadProgress" max="100"></progress>
    </div>
  </div>
</template> -->
