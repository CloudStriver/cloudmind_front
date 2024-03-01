<template>
    <div class="files-main-box">
        <div class="files-box">
            <div 
                class="files-contents"
                v-for="(file, item) of nowFilesList.files"
                :key="item"
                @click="toFile(file)"
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
import { useStore } from '@/store'
import { onMounted, ref, watch } from 'vue'
import { getPersonalFatherId, getPrivateFilesList } from './utils'
import type { responsePrivateFilesList, fileData } from './utils'
import { onBeforeRouteUpdate } from 'vue-router';

const store = useStore()
const fatherId = ref<string>("")
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
    nowFilesList.value = await getPrivateFilesList({
        limit: 40,
        offset: 0,
        sortType: 3,
        backward: true,
        onlyFatherId: fatherId.value
    })
    sessionStorage.setItem('PathId', nowFilesList.value.fatherIdPath)
    sessionStorage.setItem('PathName', nowFilesList.value.fatherNamePath)
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