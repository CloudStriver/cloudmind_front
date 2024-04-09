<template>
    <div class="drawer-main-box">
        <div class="create-folder-box" v-if="isShowCreateFolder">
            <div class="folder-box">
                <h5>新建文件夹</h5>
                <div style="text-align: center;">
                    <i class="iconfont icon-wenjian"></i>
                    <p><input 
                            type="text" 
                            placeholder="请输入文件夹名称" 
                            v-model="newFolderName"
                            maxlength="15"
                        ></p>
                </div>
                <p class="button">
                    <button @click="cancelCreateFolder">取消</button>
                    <button 
                        ref="folder"
                        @click="createFolder" 
                        style="background-color: #96b0df;"
                        :disabled="!isCreateFolderName"
                    >确定</button>
                </p>
            </div>
        </div>
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
            <div class="create" @click="isShowCreateFolder = true">
                <i class="iconfont icon-a-11Hxinjianwenjianjia"></i>
                <span>新建文件夹</span>
            </div>
        </div>
        <div class="classify-box">
            <div class="sort">
                <i class="iconfont icon-fenlei"></i>
                <span>文件筛选</span>
            </div>
            <ul>
                <li class="classify-li">
                    <input 
                        type="radio"
                        name="classify"
                        id="all"
                        value="all"
                        v-model="selectType"
                    >
                    <label for="all">
                        <i class="iconfont icon-gengduo-2"></i>
                        <span>全部</span>
                    </label>
                </li>
                <li class="classify-li">
                    <input 
                        type="radio"
                        name="classify"
                        id="file"
                        value="file"
                        v-model="selectType"
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
                        id="image"
                        value="image"
                        v-model="selectType"
                    >
                    <label for="image">
                        <i class="iconfont icon-image"></i>
                        <span>图片</span>
                    </label>
                </li>
                <li class="classify-li">
                    <input 
                        type="radio"
                        name="classify"
                        id="video"
                        value="video"
                        v-model="selectType"
                    >
                    <label for="video">
                        <i class="iconfont icon-video-solid"></i>
                        <span>视频</span>
                    </label>
                </li>
                <li class="classify-li">
                    <input 
                        type="radio"
                        name="classify"
                        id="music"
                        value="music"
                        v-model="selectType"
                    >
                    <label for="music">
                        <i class="iconfont icon-music-solid"></i>
                        <span>音乐</span>
                    </label>
                </li>
            </ul>
        </div>
        <div class="recycle">
            <input 
                type="radio"
                name="classify"
                id="recycle"
                value="recycle"
                v-model="selectType"
            >
            <label for="recycle">
                <i class="iconfont icon-lajitong"></i>
                <span>回收站</span>
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
// import mime from 'mime'
import SparkMD5 from 'spark-md5'
import { ref, onBeforeUpdate, watch, onMounted } from 'vue'
import { useStore } from '@/store/index'
import { cosUploadFile } from '@/utils/cos'
import {postCreateFile, getFileSize, getPersonalFatherId, getCategory} from './utils'
import type { requestCreateFile } from './utils'
import router from "@/router";
import {StoragePath, StoragePathId} from "@/utils/consts";

const folder = ref()
const store = useStore()
const fatherId = ref("")
const selectType = ref("")
// const recycleTurnSort = ref(false)
const newFolderName = ref<string>("新建文件夹")
const isShowFilesCount = ref<boolean>(false)
const isCreateFolderName = ref<boolean>(true)
const isShowCreateFolder = ref<boolean>(false)
const filesCount = ref<number>(0)
const emit = defineEmits(['sendDrawerOptions', 'sendDrawerSelectType'])
const props = defineProps<{
    sendRequest: {
        option: string
    }
}>()

onMounted(() => {
    selectType.value = getSelectType()
})

onBeforeUpdate(() => {
    if (newFolderName.value.length === 0) {
        isCreateFolderName.value = false
        folder.value.style.backgroundColor = '#96b0dfaf'        
    }
    else {
        isCreateFolderName.value = true
        if (folder.value) {
            folder.value.style.backgroundColor = '#96b0df'
        }
    }
})

watch(selectType, (newVal) => {
    if (newVal === 'recycle') {
        emit('sendDrawerOptions', 'showRecycle')
    }
    else {
        const pathList = (sessionStorage.getItem(StoragePathId) as string).split("/")
        router.push('/personal/' + pathList[pathList.length - 1])
        emit('sendDrawerOptions', 'showFiles')
        emit('sendDrawerSelectType', newVal)
    }
})

watch(() => props.sendRequest, () => {
    if (props.sendRequest.option === 'createFolder') {
        isShowCreateFolder.value = true
    }
})

const getSelectType = () => {
    if (location.href.includes('recycle')) {
        return 'recycle'
    }
    return 'all'
}

//取消新建文件夹
const cancelCreateFolder = () => {
    isShowCreateFolder.value = false
    newFolderName.value = '新建文件夹'
}
//新建文件夹
const createFolder = () => {
    fatherId.value = getPersonalFatherId()
    const data: requestCreateFile = {
        name: newFolderName.value,
        type: '文件夹',
        spaceSize: -1,
        md5: "",
        fatherId: fatherId.value,
        category: 1,
    }

    postCreateFile(data)
    .then((res) => {        
        const tempPath = sessionStorage.getItem(StoragePath) as string
        store.tempFileData = {
            fileId: res,
            userId: "",
            name: data.name,
            type: data.type,
            path: tempPath + '/' + data.name,
            fatherId: fatherId.value,
            spaceSize: getFileSize(data.spaceSize),
            md5: data.md5,
            isDel: 0,
            zone: "",
            subZone: "",
            description: "",
            createAt: new Date().toLocaleString(),
            updateAt: new Date().toLocaleString(),
        }
        isShowCreateFolder.value = false
        // newFolderName.value = res.name
    })
}

//上传文件
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
          // const type = mime.getExtension(file.type) as string
          const type = file.type
            const data: requestCreateFile = {
                name: file.name,
                type,
                spaceSize: file.size,
                md5: md5,
                fatherId: getPersonalFatherId(),
                category: getCategory(file.type),
            }
            cosUploadFile(file, md5, suffix, () => {
                postCreateFile(data)
                .then((res)=> {
                    const tempPath = sessionStorage.getItem(StoragePath) as string
                    store.tempFileData = {
                        fileId: res,
                        userId: "",
                        name: file.name,
                        type,
                        path: tempPath + '/' + file.name,
                        fatherId: fatherId.value,
                        spaceSize: getFileSize(file.size),
                        md5,
                        isDel: 0,
                        zone: "",
                        subZone: "",
                        description: "",
                        createAt: new Date().toLocaleString(),
                        updateAt: new Date().toLocaleString(),
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
.create-folder-box {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #00000078;
    top: 0;
    left: 0;
    padding: 20px 20px;
    z-index: 2;
    transition: all 0.3s;
    overflow-y: auto;
    display: flex;
    align-items: center;

    .folder-box {
        width: 300px;
        height: 320px;
        background-color: #fff;
        box-shadow: 0 0 10px 1px #0000001a;
        border-radius: 10px;
        margin: auto;
        padding: 20px;

        h5 {
            margin: 0;
            margin-bottom: 20px;
            font-weight: 500;
            color: #3f3f3f;
        }

        i {
            color: #96b0df;
            font-size: 110px;
        }

        input {
            width: 250px;
            height: 35px;
            padding: 10px;
            margin-bottom: 30px;
            border: none;
            border-radius: 5px;
            background-color: #96b0df14;
            color: #3964b4;
        }
        input:focus {
            outline: none;
            border: 1px solid #96b0df;
        }

        .button {
            text-align: end;

            button {
                width: 70px;
                height: 35px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-left: 20px;
            }
            button:last-child {
                color: #fff;
            }
        }
    }
}
.drawer-main-box {
    width: 100%;
    background-color: rgba(240, 245, 255, 1);
    border-right: 1px solid #c4c4c42b;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;

    .operate {
        width: 100%;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(25, 79, 146, 0.205);
        color: rgb(25, 80, 146);


        .transfer,
        .upload,
        .create {
            padding: 0 10px;
            margin: 20px 0;
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
                top: 0px;
                text-align: center;

            }
        }
    }

    .classify-box {
        color: rgb(25, 80, 146);
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(25, 79, 146, 0.205);

        .sort {
            margin-bottom: 10px;
            
            i {
                margin-right: 10px;
                font-size: 20px;
            }
        }

        ul {
            .classify-li {
                margin: 20px 25px;
                padding-left: 10px;
                height: 30px;
                cursor: pointer;
                display: flex;
                align-items: center;
                color: #96b0df;

                i {
                    font-size: 20px;
                    margin-right: 10px;
                }

                .all-i {
                    font-size: 22px;
                }

                input:checked + label {
                    color: rgb(25, 80, 146);
                }
            }

            .classify-li:hover {
                background-color: #dbdbdb4a;
                border-radius: 20px;
            }
        }
    }

    .recycle {
        width: 100%;
        height: 30px;
        padding: 1px 10px;
        cursor: pointer;
        color: rgb(211, 136, 136);

        i {
            font-size: 20px;
            margin-right: 10px;
            color: rgb(211, 136, 136);
        }

        input:checked + label {
            color: rgb(203, 76, 76);
            i {
                color: rgb(203, 76, 76);
            }
        }
    }
    .recycle:hover {
        background-color: #dbdbdb4a;
        border-radius: 20px;
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