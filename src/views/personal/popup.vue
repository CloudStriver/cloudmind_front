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
        <div class="create-folder">
            <i class="iconfont icon-folder-add-line"></i>
            <div>创建文件夹</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import SparkMD5 from 'spark-md5'
import mime from 'mime'
import { ref } from 'vue'
import { useStore } from '@/store/index'
import { post, put } from '@/utils/request'
import { getTypeFromSuffix, getFatherIdFromHerf } from './utils'
import type { createFiles } from './utils'

const store = useStore();

const uploadToTX = (res: any, suffix: string) => {
    // put(res.url, {
    //     headers: {
    //         'Content-Type': mime.getType(suffix),
    //         'x-cos-security-token': res.sessionToken
    //     },
    //     data: res.data
    // })
    // .then((response: any) => {
    //     console.log(response);
    // })
}

const applySignedUrl = (md5: string, suffix: string) => {
    // post('/sts/applySignedUrl', {
    //     md5, 
    //     suffix
    // })
    // .then((res: any) => {
    //     uploadToTX(res, suffix)
    // })
}

const createFilesUrl = (data: Object) => {
    // post('/content/createFile', data)
    // .then((res: any) => {
    //     console.log(res);
    // })
}

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
            applySignedUrl(md5, suffix)

            const userId = store.getUserId();
            const type = getTypeFromSuffix(suffix)
            const fatherId = getFatherIdFromHerf() || userId
            const createFilesUrlData = ref<createFiles>({
                file: {
                    userId,
                    name: file.name,
                    type,
                    fatherId,
                    spaceSize: file.size,
                    md5,
                    isDel: 1
                }
            })
            createFilesUrl(createFilesUrlData)
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
    }
    .upload-files:hover,
    .upload-folder:hover,
    .create-folder:hover{
        cursor: pointer;
        background: #f5f5f5;
    }
}
</style>