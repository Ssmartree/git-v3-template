# 断点续传使用示例

## 功能特性

✅ **上传断点续传**

- 自动检测服务器已上传的分片
- 支持秒传（文件已存在时）
- 上传失败自动保存进度
- 可手动暂停/恢复上传

✅ **下载断点续传**

- 使用 HTTP Range 进行分片下载
- 下载失败自动保存进度
- 支持暂停/恢复下载
- 按索引保存分片，支持乱序下载

✅ **进度管理**

- localStorage 自动保存进度
- 支持查看所有未完成任务
- 自动清理过期数据（7天）

---

## 上传示例

### 基础上传（自动启用断点续传）

```javascript
import { FileSystem } from "./fileSystem.js";

const fs = new FileSystem();
const file = document.querySelector("input[type=file]").files[0];

fs.uploadFile(
  {
    file,
    url: "/api/upload",
    chunkSize: 5 * 1024 * 1024, // 5MB 分片
    enableResume: true, // 默认为 true
  },
  // 进度回调
  (progress, chunkIndex) => {
    console.log(`上传进度: ${progress}%，当前分片: ${chunkIndex}`);
  },
  // 完成回调
  (result) => {
    if (result.isInstantUpload) {
      console.log("秒传成功！文件已存在");
    } else {
      console.log("上传完成", result);
    }
    fs.stopWorker();
  },
  // 错误回调
  (error, resumeInfo) => {
    console.error("上传失败:", error);
    console.log("断点续传信息:", resumeInfo);
    // 进度已自动保存到 localStorage
  },
);
```

### 手动暂停和恢复上传

```javascript
const fs = new FileSystem();
const file = document.querySelector("input[type=file]").files[0];
let taskId;

// 开始上传
taskId = fs.uploadFile(
  {
    file,
    url: "/api/upload",
    chunkSize: 5 * 1024 * 1024,
    taskId: "my-upload-task", // 自定义任务 ID
  },
  (progress) => console.log(`进度: ${progress}%`),
  (result) => console.log("完成", result),
  (error, resumeInfo) => console.error("失败", error),
);

// 暂停上传
document.querySelector("#pauseBtn").onclick = () => {
  fs.pause();
  console.log("已暂停上传");
};

// 恢复上传
document.querySelector("#resumeBtn").onclick = () => {
  fs.resumeUpload(
    "my-upload-task",
    file,
    (progress) => console.log(`恢复后进度: ${progress}%`),
    (result) => console.log("完成", result),
    (error) => console.error("失败", error),
  );
};
```

### 查看和恢复未完成的上传

```javascript
const fs = new FileSystem();

// 获取所有未完成的任务
const tasks = fs.getAllResumeTasks();
console.log("未完成任务:", tasks);

// 显示在 UI 上让用户选择恢复
tasks.forEach((task) => {
  console.log(`
    任务 ID: ${task.taskId}
    文件哈希: ${task.fileHash}
    进度: ${(task.offset / task.totalSize) * 100}%
    创建时间: ${new Date(task.timestamp).toLocaleString()}
  `);
});

// 恢复某个任务
const taskToResume = tasks[0];
if (taskToResume) {
  // 需要用户重新选择文件（因为 File 对象无法序列化）
  const fileInput = document.querySelector("input[type=file]");
  fileInput.onchange = () => {
    const file = fileInput.files[0];
    fs.resumeUpload(
      taskToResume.taskId,
      file,
      (progress) => console.log(`进度: ${progress}%`),
      (result) => console.log("完成", result),
      (error) => console.error("失败", error),
    );
  };
}
```

---

## 下载示例

### 基础下载（支持断点续传）

```javascript
import { FileSystem } from "./fileSystem.js";

const fs = new FileSystem();

fs.downloadFile(
  {
    url: "https://example.com/large-file.zip",
    chunkSize: 5 * 1024 * 1024, // 5MB 分片
    autoSave: true, // 下载完成自动保存
  },
  // 进度回调
  (progress, chunkIndex) => {
    console.log(`下载进度: ${progress}%，当前分片: ${chunkIndex}`);
  },
  // 完成回调
  (result) => {
    console.log("下载完成", result);
    // 如果 autoSave=true，文件已自动保存
    // 否则可以手动保存: fs.saveFile(result.file, result.fileName)
  },
  // 错误回调
  (error, resumeData) => {
    console.error("下载失败:", error);
    console.log("断点续传信息:", resumeData);
    // 进度已自动保存
  },
);
```

### 暂停和恢复下载

```javascript
const fs = new FileSystem();

// 开始下载
fs.downloadFile(
  {
    url: "https://example.com/large-file.zip",
    chunkSize: 5 * 1024 * 1024,
    taskId: "my-download-task",
  },
  (progress) => console.log(`进度: ${progress}%`),
  (result) => console.log("完成", result),
  (error) => console.error("失败", error),
);

// 暂停下载
document.querySelector("#pauseBtn").onclick = () => {
  fs.pause();
};

// 恢复下载
document.querySelector("#resumeBtn").onclick = () => {
  fs.resumeDownload(
    "my-download-task",
    (progress) => console.log(`恢复后进度: ${progress}%`),
    (result) => console.log("完成", result),
    (error) => console.error("失败", error),
  );
};
```

---

## 服务端 API 要求

### 上传接口

#### 1. 检查已上传分片 `POST /api/upload/check`

```json
请求：
{
  "hash": "file-md5-hash",
  "totalSize": 102400
}

响应：
{
  "exists": false,           // 文件是否已完全上传（秒传）
  "uploadedChunks": [0, 1, 3] // 已上传的分片索引列表
}
```

#### 2. 上传分片 `POST /api/upload`

```
FormData:
- chunk: Blob           // 分片数据
- hash: string          // 文件 MD5
- chunkIndex: number    // 分片索引
- totalSize: number     // 文件总大小
```

#### 3. 合并分片 `POST /api/upload/merge`

```json
请求：
{
  "hash": "file-md5-hash",
  "totalSize": 102400,
  "chunkSize": 5242880
}

响应：
{
  "success": true,
  "fileUrl": "/files/xxx.zip"
}
```

### 下载接口

支持 HTTP Range 请求：

```
请求头：
Range: bytes=0-5242879

响应头：
Content-Range: bytes 0-5242879/102400000
Content-Length: 5242880
Accept-Ranges: bytes
```

---

## 工具方法

### 清理过期数据

```javascript
const fs = new FileSystem();

// 清理超过 7 天的断点续传数据
fs.cleanExpiredResumeData();
```

### 获取所有任务

```javascript
const fs = new FileSystem();

// 获取所有未完成的任务
const tasks = fs.getAllResumeTasks();
console.log("未完成任务数:", tasks.length);
```

### 手动清除任务

```javascript
const fs = new FileSystem();

// 清除指定任务的断点续传数据
fs.clearResumeData("my-upload-task");
```

---

## 注意事项

⚠️ **文件对象无法序列化**

- 上传恢复时需要用户重新选择相同文件
- 建议在 UI 上提示用户选择之前上传的文件

⚠️ **localStorage 容量限制**

- 通常为 5-10MB
- 仅保存元数据，不保存文件内容
- 下载时已下载的 Blob 会在恢复时重新下载

⚠️ **服务端支持要求**

- 上传需要服务端实现分片检查和合并接口
- 下载需要服务端支持 HTTP Range 请求

⚠️ **跨域问题**

- 确保服务端设置正确的 CORS 头
- Range 请求需要服务端支持

---

## 完整示例（Vue 组件）

```vue
<script setup>
import { onMounted, ref } from "vue";
import { FileSystem } from "./fileSystem.js";

const fs = new FileSystem();
const file = ref(null);
const progress = ref(0);
const error = ref("");
const resumeTasks = ref([]);
const taskId = ref("");

function handleFileSelect(e) {
  file.value = e.target.files[0];
}

function startUpload() {
  if (!file.value) return;

  error.value = "";
  taskId.value = `upload_${file.value.name}_${file.value.size}`;

  fs.uploadFile(
    {
      file: file.value,
      url: "/api/upload",
      chunkSize: 5 * 1024 * 1024,
      taskId: taskId.value,
    },
    (prog) => {
      progress.value = Math.round(prog);
    },
    (result) => {
      console.log("上传完成", result);
      progress.value = 100;
    },
    (err, resumeInfo) => {
      error.value = err;
      console.error("上传失败", err, resumeInfo);
    },
  );
}

function pauseUpload() {
  fs.pause();
}

function resumeUpload() {
  if (!file.value || !taskId.value) return;

  fs.resumeUpload(
    taskId.value,
    file.value,
    (prog) => {
      progress.value = Math.round(prog);
    },
    (result) => {
      console.log("上传完成", result);
      progress.value = 100;
      loadResumeTasks();
    },
    (err) => {
      error.value = err;
    },
  );
}

function loadResumeTasks() {
  resumeTasks.value = fs.getAllResumeTasks();
}

function continueTask(task) {
  taskId.value = task.taskId;
  // 提示用户选择文件
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = (e) => {
    file.value = e.target.files[0];
    resumeUpload();
  };
  input.click();
}

onMounted(() => {
  loadResumeTasks();
  fs.cleanExpiredResumeData();
});
</script>

<template>
  <div>
    <input type="file" @change="handleFileSelect" />
    <button @click="startUpload">开始上传</button>
    <button @click="pauseUpload">暂停</button>
    <button @click="resumeUpload">恢复</button>

    <div>进度: {{ progress }}%</div>
    <div v-if="error">错误: {{ error }}</div>

    <div v-if="resumeTasks.length > 0">
      <h3>未完成任务:</h3>
      <ul>
        <li v-for="task in resumeTasks" :key="task.taskId">
          {{ task.taskId }} - {{ Math.round((task.offset / task.totalSize) * 100) }}%
          <button @click="continueTask(task)">继续</button>
        </li>
      </ul>
    </div>
  </div>
</template>
```

---

## 总结

这个断点续传系统提供了完整的上传/下载恢复功能：

1. **自动化**: 失败时自动保存进度
2. **手动控制**: 支持暂停/恢复操作
3. **秒传**: 上传时自动检测已存在文件
4. **持久化**: 使用 localStorage 保存进度
5. **清理机制**: 自动清理过期数据

配合服务端支持，可以实现生产级别的大文件传输方案！🚀
