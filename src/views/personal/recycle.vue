<template>
    <div class="recycle-box" @click="cancelShowPop($event)">
        <div 
            class="options"
            v-show="isShowOptions"
            :style="{left: optionsLeft + 'px', top: optionsTop + 'px'}"
        >
            <button @click="recoverFiles">恢复</button>
            <button @click="deleteFiles">删除</button>
        </div>
        <div 
            class="recycle-file-content"
            v-for="(file, index) of recycleFilesList.files"
            :key="index"
            @click="chooseFile(file)"
            @contextmenu="openRecycleOptions($event, index)"
        >
            <div class="name-box">
                <div class="checkbox" v-if="!file.isChoose"></div>
                <div class="checkbox-choose" v-else>
                    <i class="iconfont icon-0-58"></i>
                </div>
                <i 
                    v-if="file.type !== '文件夹'"
                    class="iconfont icon-file-alt-solid"
                ></i>
                <i 
                    v-if="file.type === '文件夹'"
                    class="iconfont icon-wenjian"
                ></i>
                <div>{{ file.name }}</div>
            </div>
            <div class="detail">
                <div>{{ file.spaceSize }}</div>
                <div>{{ file.updateAt }}</div>
                <div >10天</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import { getRecycleFilesList } from './utils'
import type { responseRecycleFilesList } from './utils'
import { post } from '@/utils/request'
const props = defineProps<{
  RecycleMsg: {
    option: string,
    message: any
  }
}>()
const ctxIndex = ref(-1)
const optionsTop = ref(0)
const optionsLeft = ref(0)
const ctxTarget = ref()
const isShowOptions = ref(false)
const recycleFilesList = ref<responseRecycleFilesList>({
    files: [],
    total: 0,
    token: ""
})

onMounted(async() => {
    recycleFilesList.value = await getRecycleFilesList({
        limit: 100,
        backward: true,
        offset: 0
    })
})

const cancelShowPop = (e: MouseEvent) => {
    isShowOptions.value = false
    const target = e.target as HTMLElement
    console.log(target, ctxTarget)
    if (target.className !== ctxTarget.value.className && ctxTarget.value) {
        ctxIndex.value = -1
        ctxTarget.value = null
    }
}

watch(() => props.RecycleMsg, () => {
  if(props.RecycleMsg.option == "cleanOutRecycle") {
    recycleFilesList.value.files = [];
  }
})



const deleteFiles = () => {
    const fileIds = getFilesId()
    post('/content/deleteFile', {
        fileIds,
        deleteType: 3
    })
    .then(async() => {
        recycleFilesList.value = await getRecycleFilesList({
            limit: 100,
            backward: true,
            offset: 0
        })
    })
}
const recoverFiles = () => {
    const fileIds = getFilesId()
    post('/content/recoverRecycleBinFile', {
        fileIds
    })
    .then(async() => {
        recycleFilesList.value = await getRecycleFilesList({
            limit: 100,
            backward: true,
            offset: 0
        })
    })
}

const getFilesId = () => {
    let fileId: string[] = []
    recycleFilesList.value.files.forEach(file => {
        if (file.isChoose) {
            fileId.push(file.fileId)
        }
    })
    if (ctxIndex.value !== -1) {
        fileId.push(recycleFilesList.value.files[ctxIndex.value].fileId)
    }
    return fileId
}

const openRecycleOptions = (e: MouseEvent, index: number) => {
    e.preventDefault()
    isShowOptions.value = true
    optionsLeft.value = e.clientX
    optionsTop.value = e.clientY
    if (!recycleFilesList.value.files[index].isChoose) {
        ctxIndex.value = index
        ctxTarget.value = e.target
    }
}
const chooseFile = (file: any) => {
    file.isChoose = !file.isChoose
}
</script>

<style scoped lang="css">
.recycle-box {
    width: 100%;
    height: 100%;
    padding: 10px 10px;

    .options {
        position: absolute;
        width: 120px;
        height: 60px;
        background-color: #fff;
        box-shadow: 0 0 10px 1px rgb(214, 214, 214);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        button {
            width: 100%;
            height: 30px;
            background-color: #fff;
            border: none;
            cursor: pointer;
            text-align: center;
        }
        button:hover {
            background-color: #f5f5f5;
        }
        button:last-child {
            color: red;
        }
    }

    .recycle-file-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #e5e5e5;
        cursor: pointer;

        .name-box {
            width: 77%;
            display: flex;
            align-items: center;

            .checkbox {
                width: 15px;
                height: 15px;
                border: 1px solid #e5e5e5;
                border-radius: 50%;
                margin-right: 10px;
            }
            .checkbox-choose {
                width: 15px;
                height: 15px;
                border: 1px solid #e5e5e5;
                border-radius: 50%;
                margin-right: 10px;
                background-color: #96b0df;
                display: flex;
                justify-content: center;
                align-items: center;   

                i {
                    margin: 10px;
                    color: #fff;
                    font-size: 20px;
                    font-weight: 700;

                }
            }

            i {
                font-size: 30px;
                margin-right: 10px;
                color: #96b0df;
            }
        }

        .detail {
            width: 23%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>