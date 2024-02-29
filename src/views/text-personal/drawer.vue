<template>
    <div class="main-box">
        <div class="operate">
            <div class="transfer">
                <div class="files-count" v-show="isShowFilesCount">{{ filesCount }}</div>
                <i class="iconfont icon-yunchuanshu"></i>
                <span>传输</span>
            </div>
            <label for="uploadFiles" class="upload">
                <i class="iconfont icon-shangchuanwenjian11"></i>
                <span>上传文件</span>
                <input 
                    type="file"  
                    id="uploadFiles"
                    style="display: none;"
                    multiple
                    @change="uploadFiles($event)"
                >
            </label>
            <label for="uploadFolder" class="upload">
                <i class="iconfont icon-shangchuanwenjianjia"></i>
                <span>上传文件夹</span>
                <input 
                    type="file"  
                    id="uploadFolder"
                    style="display: none;"
                    webkitdirectory
                >
            </label>
            <div class="create">
                <i class="iconfont icon-a-11Hxinjianwenjianjia"></i>
                <span>新建文件夹</span>
            </div>
        </div>
        <div class="classify-box">
            <div class="sort">
                <input 
                    type="radio"
                    name="select"
                    id="sort" 
                >
                <label for="sort">
                    <i class="iconfont icon-fenlei"></i>
                    <span>文件筛选</span>
                </label>
            </div>
            <ul>
                <li class="classify-li">
                    <input 
                        type="radio"
                        name="classify"
                        id="file"
                    >
                    <label for="file">
                        <i class="iconfont icon-file-alt-solid"></i>
                        <span>文档</span>
                    </label>
                </li>
                <li class="classify-li">
                    <input 
                        type="radio"
                        name="classify"
                        id="file"
                    >
                    <label for="file">
                        <i class="iconfont icon-image"></i>
                        <span>图片</span>
                    </label>
                </li>
                <li class="classify-li">
                    <input 
                        type="radio"
                        name="classify"
                        id="file"
                    >
                    <label for="file">
                        <i class="iconfont icon-video-solid"></i>
                        <span>视频</span>
                    </label>
                </li>
                <li class="classify-li">
                    <input 
                        type="radio"
                        name="classify"
                        id="file"
                    >
                    <label for="file">
                        <i class="iconfont icon-music-solid"></i>
                        <span>音乐</span>
                    </label>
                </li>
            </ul>
        </div>
        <div class="recycle">
            <input 
                type="radio"    
                name="select"
                id="recycle"
            >
            <label for="recycle">
                <i class="iconfont icon-lajitong"></i>
                <span>回收站</span>
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import mime from 'mime'
import SparkMD5 from 'spark-md5'
import { ref } from 'vue'
import { useStore } from '@/store/index'
import { getPersonalFatherId, postCreateFile, getFileSize } from './utils'
import type { requestCreateFile } from './utils'
import { cosUploadFile } from '@/utils/cos'

const store = useStore()
const isShowFilesCount = ref<boolean>(false)
const filesCount = ref<number>(0)

const uploadFiles = (event: any) => {
    filesCount.value = event.target.files.length
    if (event.target.files.length > 0) {
        isShowFilesCount.value = true
    }
    for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i]
        const fileReader = new FileReader()
        const spark = new SparkMD5.ArrayBuffer()
        fileReader.readAsArrayBuffer(file)
        fileReader.onload = (e: any) => {
            spark.append(e.target.result)
            const md5 = spark.end()
            const suffix = '.' + file.name.split('.').pop()
            const fatherId = getPersonalFatherId()
            const type = mime.getExtension(file.type) as string
            const data: requestCreateFile = {
                name: file.name,
                type,
                spaceSize: file.size,
                md5: md5,
                fatherId,
            }
            cosUploadFile(file, md5, suffix, () => {
                postCreateFile(data)
                .then(()=> {
                    const tempPath = sessionStorage.getItem('Path') as string
                    store.tempFileData = {
                        files: [
                            {
                                fileId: "",
                                userId: "",
                                name: file.name,
                                type,
                                path: tempPath + '/' + file.name,
                                fatherId,
                                spaceSize: getFileSize(file.size),
                                md5,
                                isDel: 0,
                                zone: "",
                                subZone: "",
                                description: "",
                                createAt: new Date().toLocaleString(),
                                updateAt: new Date().toLocaleString(),
                            }
                        ]
                    }
                    filesCount.value--
                    if (filesCount.value === 0) {
                        isShowFilesCount.value = false
                    }
                })
            })
        }
    }
}
</script>

<style scoped lang="css">
.main-box {
    color: rgb(25, 80, 146);
    background-color: rgba(240, 245, 255, 1);
    padding: 10px 20px;
    display: flex;
    flex-direction: column;

    .operate {
        padding-bottom: 10px;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(25, 79, 146, 0.205);

        .transfer,
        .upload,
        .create {
            width: 100%;
            height: 50px;
            line-height: 50px;
            padding: 0 10px;
            padding-bottom: 30px;
            text-align: start;
            cursor: pointer;
            display: block;
    
            i {
                font-size: 30px;
                margin-right: 10px;
                vertical-align: middle;
            }
        }

        .transfer:hover,
        .upload:hover,
        .create:hover {
            background-color: #dbdbdb4a;
            border-radius: 20px;
        }

        .transfer:active,
        .upload:active,
        .create:active {
            transform: scale(0.95);
        }

        .transfer {
            position: relative;
            .files-count {
                position: absolute;
                width: 20px;
                height: 20px;
                font-size: 10px;
                font-weight: 700;
                line-height: 20px;
                color: #fff;
                background-color: #f74444;
                border-radius: 50%;
                left: 25px;
                top: 8px;
                text-align: center;

            }
        }
    }

    .classify-box {
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(25, 79, 146, 0.205);

        .sort {
            margin-bottom: 10px;
            
            label {
                i {
                    margin-right: 10px;
                    font-size: 20px;
                }
            }
        }

        ul {
            .classify-li {
                width: 100px;
                margin: 25px 0 25px 30px;

                i {
                    font-size: 20px;
                    margin-right: 10px;
                }
            }
        }
    }

    .recycle {
        label {
            color: rgb(206, 112, 112);

            i {
                font-size: 20px;
                margin-right: 10px;
                color: rgb(203, 76, 76);
            }
        }
    }
    
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    input[type="radio"] {
        display: none;
    }


}
</style>