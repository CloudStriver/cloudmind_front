<template>
    <div 
        class="files-main-box" 
        @click=cancelShowOptions($event)
        @dragenter="dragenterFile()"
    >
        <div 
            class="handle-drag" 
            v-if="isDragFile"
            @dragleave="dragleaveFile($event)"
            @drop="dropUploadFile($event)"
            @dragover="allowDrag($event)"

        >
            <div class="handle-drag-contents">
                <i class="iconfont icon-yunshangchuan"></i>
                <p>上传</p>
            </div>
        </div>
        <div class="files-box">
            <Option 
                class="option" 
                v-show="isShowOptions"
                :style="{left: optionLeft + 'px', top: optionTop + 'px'}"
                @sendOptions="optionType"
            ></Option>
            <div 
                class="files-contents"
                v-for="(file, index) of nowFilesList.files"
                :key="index"
                @click="toFile(file)"
                @contextmenu="getOptions(file, $event, index)"
                @mouseenter="textLog(index)"
                @mouseleave="textLog(-1)"
            >
                <div 
                    v-show="mouseFileIndex === index"
                    class="checkbox-choose"
                    style="opacity: calc(0.3);"
                    @click="chooseFile(index)"
                >
                    <i class="iconfont icon-0-58"></i>
                </div>
                <div 
                    v-show="chooseFileList[index] === true"
                    class="checkbox-choose"
                    @click="cancelChooseFile(index)"
                >
                    <i class="iconfont icon-0-58"></i>
                </div>
                <div class="images">
                    <i 
                        v-if="file.type !== '文件夹'"
                        class="iconfont icon-file-alt-solid"
                    ></i>
                    <i 
                        v-if="file.type === '文件夹'"
                        class="iconfont icon-wenjian"
                    ></i>
                </div>
                <div class="name">{{ sliceFileName(file.name) }}</div>
                <div class="time">{{ file.createAt }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import mime from 'mime'
import SparkMD5 from 'spark-md5'
import router from '@/router';
import Option from './options.vue'
import { useStore } from '@/store'
import { cosUploadFile } from '@/utils/cos'
import { onMounted, ref, watch } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router';
import {
  getPersonalFatherId,
  getPrivateFilesList,
  getFileSize,
  postCreateFile,
  postAskDownloadFile,
  getCategory
} from './utils'
import type { responsePrivateFilesList, fileData, requestCreateFile } from './utils'

const store = useStore()
const optionTop = ref<number>(0)
const optionLeft = ref<number>(0)
const fatherId = ref<string>("")
const chooseFileList = ref<boolean[]>([])
const fileDetails = ref<fileData[]>(
    [{
        fileId: "",
        userId: "",
        name: "",
        type: "",
        path: "",
        fatherId: "",
        spaceSize: "",
        isDel: 0,
        zone: "",
        subZone: "",
        description: "",
        updateAt: "",
        createAt: "",
    }]
)
const ctxIndex = ref(-1)
const mouseFileIndex = ref(-1)
const isDragFile = ref(false)
const isShowOptions = ref(false)
const emit = defineEmits(['loading', 'sendOptions', 'sendDetails'])
const props = defineProps<{
    sendRequest: {
        option: string,
        message: any
    }
}>()
//存储页面文件列表
const nowFilesList = ref<responsePrivateFilesList>({
    files: [
        {
            fileId: '',
            userId: '',
            name: '',
            type: '',
            path: '',
            fatherId: '',
            spaceSize: '',
            isDel: 0,
            zone: '',
            subZone: '',
            description: '',
            updateAt: '',
            createAt: '',
        }
    ],
    total: 0,
    token: '',
    fatherIdPath: '',
    fatherNamePath: ''
}) 

onMounted(async() => {
    fatherId.value = getPersonalFatherId()
    if (fatherId.value !== 'recycle') {
        nowFilesList.value = await getPrivateFilesList({
            limit: 100,
            offset: 0,
            sortType: 3,
            backward: true,
            onlyFatherId: fatherId.value
        })
        sessionStorage.setItem('PathId', nowFilesList.value.fatherIdPath)
        sessionStorage.setItem('PathName', nowFilesList.value.fatherNamePath)
        emit('loading', true)
    }
})

onBeforeRouteUpdate(async(to) => {
    fatherId.value = to.params.fatherId as string
    nowFilesList.value = await getPrivateFilesList({
        limit: 100,
        offset: 0,
        sortType: 3,
        backward: true,
        onlyFatherId: fatherId.value
    })
    if (store.pathChange === 'false') {
        store.pathChange = 'true'
    }
    else {
        store.pathChange = 'false'
    }
    sessionStorage.setItem('PathId', nowFilesList.value.fatherIdPath)
    sessionStorage.setItem('PathName', nowFilesList.value.fatherNamePath)
})

watch(() => store.tempFileData, (newVal) => {
    nowFilesList.value.files.unshift(newVal)
})
watch(() => props.sendRequest, async() => {
    if (props.sendRequest.option === 'refreshFiles') {
        nowFilesList.value = await getPrivateFilesList({
            limit: 100,
            offset: 0,
            sortType: 3,
            backward: true,
            onlyFatherId: fatherId.value
        })
    }
    else if (props.sendRequest.option === 'updateName') {
        nowFilesList.value.files[ctxIndex.value].name = sliceFileName(props.sendRequest.message)
    }
    else if (props.sendRequest.option === 'classifyFiles') {
      await classifyFile()
    }
    else if (props.sendRequest.option === 'allSelect') {
        if (props.sendRequest.message === true) {
            chooseFileList.value = Array(nowFilesList.value.files.length).fill(true)
        }
        else {
            chooseFileList.value = Array(nowFilesList.value.files.length).fill(false)
        }        
    }
    else {
        console.log('其他操作')
    }
})

const chooseFile = (index: number) => {
    chooseFileList.value[index] = true
}
const cancelChooseFile = (index: number) => {
    chooseFileList.value[index] = false
}

const dropUploadFile = (event: any) => {
    event.preventDefault()
    //现阶段只允许上传文件
    const file = event.dataTransfer.files[0]
    isDragFile.value = false
    const fileReader = new FileReader()
    const spark = new SparkMD5.ArrayBuffer()
    fileReader.readAsArrayBuffer(file)
    fileReader.onload = (e: any) => {
        spark.append(e.target.result)
        const md5 = spark.end()
        const suffix = '.' + file.name.split('.').pop()
        const type = mime.getExtension(file.type) as string
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
                const tempPath = sessionStorage.getItem('Path') as string
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
            })
        })
    }
}
const dragenterFile = () => {
    isDragFile.value = true
}
const allowDrag = (event: any) => {
    event.preventDefault()
}
const dragleaveFile = (event: any) => {
    event.preventDefault()
    isDragFile.value = false 
}

const cancelShowOptions = (event: any) => {
    isShowOptions.value = false
    event.preventDefault()
}

const optionType = (sendOptions: string) => {
    if (sendOptions === 'checkDetail' || sendOptions === 'moveFile' || sendOptions === 'moveToRecycle' || sendOptions === 'cleanOutFile') {
        emit('sendOptions', sendOptions)
        emit('sendDetails', fileDetails.value)
    } 
    else if (sendOptions === 'renameFile') {
        emit('sendOptions', sendOptions)
        emit('sendDetails', fileDetails.value[0])
    }
    else if (sendOptions === 'downloadFile')  {
        const fileIdList = [fileDetails.value[0].fileId]
        const fileNameList = [fileDetails.value[0].name]
        postAskDownloadFile(fileIdList, fileNameList)
    }
    else {
      console.log("其他操作")
    }
}

// 文件筛选
const classifyFile = async () => {
    let category = 0;
    switch (props.sendRequest.message) {
        case "file":
        category = 1
        break;
        case "image":
        category = 2
        break;
        case "video":
        category = 3
        break;
        case "music":
        category = 4
        break;
    }
    if (category !== 0) {
        nowFilesList.value = await getPrivateFilesList({
        limit: 100,
        offset: 0,
        sortType: 3,
        backward: true,
        onlyFatherId: fatherId.value,
        onlyCategory: category,
        })
    }
    else {
        nowFilesList.value = await getPrivateFilesList({
        limit: 100,
        offset: 0,
        sortType: 3,
        backward: true,
        onlyFatherId: fatherId.value,
        })
    }
}

const textLog = (index: number) => {
    mouseFileIndex.value = index
}

const getOptions = (file: fileData, event: any, index: number) => {
    ctxIndex.value = index
    isShowOptions.value = true
    optionLeft.value = event.clientX
    optionTop.value = event.clientY
    if (event.clientX + 160 > window.innerWidth) {
        optionLeft.value = event.clientX - 160
    }
    if (event.clientY + 320 > window.innerHeight) {
        optionTop.value = event.clientY - 320
    }
    fileDetails.value[0] = file
    event.preventDefault()
}

const toFile = (file: fileData) => {
    if (file.type === '文件夹') {
        fatherId.value = file.fileId
        router.push({name: 'personal', params: {fatherId: fatherId.value}})
    }
    else {
        console.log('打开文件:' + file.fileId)
    }
}

const sliceFileName = (name: string) => {
    return name.length < 8 ? name : (name.slice(0, 8) + "...")
}
</script>

<style scoped lang="css">
.files-main-box {
    padding: 10px;

    .handle-drag {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(#bababa78, #00000090);

        .handle-drag-contents {
            position: absolute;
            left: 50%;
            transform: translate(-50%);
            bottom: 30px;
            text-align: center;
            user-select: none;

            i {
                font-size: 120px;
                color: #e1e1e1;
            }

            p {
                color: #e1e1e1;
                font-size: 30px;
                font-weight: 700;
            }
        }
    }

    .files-box {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, 150px);
        grid-template-rows: repeat(auto-fill, 200px);
        grid-row-gap: 10px;
        grid-column-gap: 10px;
        justify-content: space-between;
        align-items: center;

        .option {
            position: absolute;
            z-index: 2000;
        }
        
        .files-contents {
            position: relative;
            width: 150px; 
            height: 180px; 
            margin-right: 10px;
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .checkbox-choose {
                position: absolute;
                width: 18px;
                height: 18px;
                top: 10px;
                left: 10px;
                color: #ffffff;
                font-weight: 700;
                border: 1px solid #fff;
                background-color: #96b0df;
                border-radius: 50%;
                margin-right: 10px;
                text-align: center
            }
    
            .images {
                width: 100px;
                height: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
    
                i {
                    font-size: 100px;
                    color: #96b0df;
                }
    
                .radio {
                    font-size: 80px;
                }
    
                .music {
                    font-size: 85px;
                }
    
                .image {
                    font-size: 75px;
                }
            }
    
    
            .name {
                font-size: 15px;
                color: #252526;
            }
    
            .time {
                font-size: 12px;
                color: #a0a0a0;
                margin-top: 5px;
            }
        }

        .files-contents:hover {
            cursor: pointer;
            border-radius: 20px;
            background-color: #f5f5f58f;
        }
    }
}
</style>