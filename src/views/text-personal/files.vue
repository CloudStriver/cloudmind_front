<template>
    <div class="files-main-box" @click=cancelShowOptions($event)>
        <div class="files-box">
            <Option 
                class="option" 
                v-if="isShowOptions"
                :style="{left: optionLeft + 'px', top: optionTop + 'px'}"
                @sendOptions="optionType"
            ></Option>
            <div 
                class="files-contents"
                v-for="(file, item) of nowFilesList.files"
                :key="item"
                @click="toFile(file)"
                @contextmenu="getOptions(file, $event)"
            >
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
import router from '@/router';
import Option from './options.vue'
import { useStore } from '@/store'
import { onBeforeMount, ref, watch } from 'vue'
import { getPersonalFatherId, getPrivateFilesList } from './utils'
import type { responsePrivateFilesList, fileData } from './utils'
import { onBeforeRouteUpdate } from 'vue-router';

const store = useStore()
const optionTop = ref<number>(0)
const optionLeft = ref<number>(0)
const fatherId = ref<string>("")
const fileDetails = ref<fileData>()
const isShowOptions = ref(false)
const emit = defineEmits(['loading', 'sendOptions', 'sendDetails'])
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

onBeforeMount(async() => {
    fatherId.value = getPersonalFatherId()
    nowFilesList.value = await getPrivateFilesList({
        limit: 40,
        offset: 0,
        sortType: 3,
        backward: true,
        onlyFatherId: fatherId.value
    })
    sessionStorage.setItem('PathId', nowFilesList.value.fatherIdPath)
    sessionStorage.setItem('PathName', nowFilesList.value.fatherNamePath)
    emit('loading', true)
    console.log('1');
})

onBeforeRouteUpdate(async(to) => {
    fatherId.value = to.params.fatherId as string
    nowFilesList.value = await getPrivateFilesList({
        limit: 40,
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

const cancelShowOptions = (event: any) => {
    isShowOptions.value = false
    event.preventDefault()
}

const optionType = (sendOptions: string) => {
    if (sendOptions === 'checkDetail') {
        emit('sendOptions', sendOptions)
        emit('sendDetails', fileDetails.value)
    }
    else {
        console.log('其他操作')
    }
}

const getOptions = (file: fileData, event: any) => {
    isShowOptions.value = true
    optionLeft.value = event.clientX
    optionTop.value = event.clientY
    if (event.clientX + 160 > window.innerWidth) {
        optionLeft.value = event.clientX - 160
    }
    if (event.clientY + 220 > window.innerHeight) {
        optionTop.value = event.clientY - 220
    }
    fileDetails.value = file
    event.preventDefault()
}

const toFile = (file: fileData) => {
    if (file.type === '文件夹') {
        fatherId.value = file.fileId
        router.push({name: 'text-personal', params: {fatherId: fatherId.value}})
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
    border-top: 1px solid #e5e5e586;

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
        }
        
        .files-contents {
            width: 150px; 
            height: 180px; 
            margin-right: 10px;
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
    
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