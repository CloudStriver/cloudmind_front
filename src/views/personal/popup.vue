<template>
    <div class="main-box">
        <label class="upload-files" for="file">
            <i class="iconfont icon-file-upload-line"></i>
            <div>上传文件</div>
            <input 
                type="file" 
                style="display: none;" 
                id="file"
                multiple
                @change="uploadFiles($event)"
            >
        </label>
        <label class="upload-folder" for="folder">
            <i class="iconfont icon-folder-upload-line"></i>
            <div>上传文件夹</div>
            <input 
                type="file" 
                id="folder"
                webkitdirectory
                style="display: none;"
            >
        </label>
        <div class="create-folder" @click="sendMessage">
            <i class="iconfont icon-folder-add-line"></i>
            <div>创建文件夹</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import SparkMD5 from 'spark-md5'
import mime from 'mime'
import { ref, watch } from 'vue'
import { useStore } from '@/store/index'
import { post } from '@/utils/request'
import { cosUploadFile } from '@/utils/cos'
import type { createFiles } from './utils'

const store = useStore();
const props = defineProps(['createFolderData'])
const emit = defineEmits(['update'])
const createFilesUrl = (data: createFiles, isSuccess: boolean) => {
    post('/content/createFile', data)
    .then(() => {
        if (isSuccess) {
            emit('update', [true, false])
        }
    })
}

const sendMessage = () => {
    emit('update', [true, true])
    createFolder()
}

const createFolder = watch(() => props.createFolderData, (newVal) => {
    if (newVal) {
        createFilesUrl(newVal, true)
    }
})

const uploadFiles = (event: any) => {
    for (let i = 0; i < event.target.files.length; i ++) {
        const file = event.target.files[i];
        const fileReader = new FileReader();
        const spark = new SparkMD5.ArrayBuffer();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e: any) => {
            spark.append(e.target.result);
            const md5 = spark.end();
            const suffix = '.' + file.name.split('.').pop();
            const userId = store.getUserId();
            const type = mime.getExtension(file.type) as string;
            const fatherId =  userId
            const createFilesUrlData = ref<createFiles>({
                name: file.name,
                type,
                fatherId,
                spaceSize: file.size,
                md5,
            })
            if (i === event.target.files.length - 1) {
                createFilesUrl(createFilesUrlData.value, true)
            }
            else {
                createFilesUrl(createFilesUrlData.value, false)
            }
            cosUploadFile(file, md5, suffix)
        }
    }
}
</script>

<style scoped lang="css">
.main-box {
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 0 20px 2px rgba(72, 72, 72, 0.1);
    padding: 8px 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .upload-files,
    .upload-folder,
    .create-folder{
        height: 40px;
        padding-left: 10px;
        display: flex;
        align-items: center;

        i {
            margin-right: 5px;
        }
    }
    .upload-files:hover,
    .upload-folder:hover,
    .create-folder:hover{
        cursor: pointer;
        background: #f5f5f5;
    }
}
</style>