<template>
    <div class="personal-main-box">
        <Drawer 
            class="drawer" 
            @sendDrawerOptions="getDrawerOptionType"
            @sendDrawerSelectType="getDrawerSelectType"
            :sendRequest="requestDrawerMessage"
        ></Drawer>
        <div class="contents-box">
            <div class="header">
                <CHeader class="cheader"></CHeader>
                <PathTitle 
                    v-if="isShowFiles && isLoading"
                    @sendPathMsg="getPathMsg"
                    :sendRequest="requestPathMessage"
                ></PathTitle>
                <RecycleTitle v-if="isShowRecycle" @sendRecycleTitleOptions="getRecycleTitleOptions"></RecycleTitle>
            </div>
            <div class="bottom" @contextmenu.stop="showFileOperation">
                <FileOption 
                    v-show="isShowFilePopup" 
                    class="file-options"
                    :style="{left: filePopupLeft + 'px', top: filePopupTop + 'px'}"
                    @sendFilePopupOptions = "getFilePopupOptionType"
                ></FileOption>
                <Files 
                    v-if="isShowFiles"
                    class="files" 
                    @sendOptions="getOptionType"
                    @sendDetails="getDetails"
                    @loading="getLoading"
                    :sendRequest="requestMessage"
                ></Files>
                <Recycle v-if="isShowRecycle" :RecycleMsg="RecycleMsg"></Recycle>
            </div>
        </div>
        <Popup 
            class="popup" 
            v-if="isShowPopup"
            :sendContents="fileContents"
            @sendOperations="getPopupOperations"
        ></Popup>
    </div>
</template>

<script setup lang="ts">
import Popup from './popup.vue'
import Files from './files.vue'
import Drawer from './drawer.vue'
import PathTitle from './path.vue'
import Recycle from './recycle.vue'
import RecycleTitle from './recycle-title.vue'
import CHeader from '@/components/header.vue'
import FileOption from './fileOption.vue'
import router from '@/router'
import { ref } from 'vue'
import {StoragePathId} from "@/utils/consts";
const RecycleMsg = ref({
    option: "",
    message: "",
})
const requestMessage = ref({
    option: "",
    message: ""
})
const requestDrawerMessage = ref({
    option: "", 
})
const fileContents = ref({
    option: "",
    contents: [{
        fileId: "",
        userId: "",
        name: "",
        type: "",
        path: "",
        fatherId: "",
        spaceSize: "",
        createAt: "",
        updateAt: ""
    }]
})

const requestPathMessage = ref({
    option: "",
})
const filePopupLeft = ref(0)
const filePopupTop = ref(0)
const isShowRecycle = ref(location.href.includes('recycle'))
const isLoading = ref(false)
const isShowFilePopup = ref(false)
const isShowPopup = ref(false)
const isClickFile = ref(false)
const isShowFiles = ref(!location.href.includes('recycle'))
let isFirst = false

const getPathMsg = (sendPathMsg: any) => {
    requestMessage.value = {
        option: sendPathMsg.option,
        message: sendPathMsg.message
    }
}

const getFilePopupOptionType = (sendFilePopupOptions: string) => {
    if (sendFilePopupOptions === 'allSelect') {
        requestMessage.value = {
            option: sendFilePopupOptions,
            message: "true"
        }
        requestPathMessage.value = {
            option: sendFilePopupOptions,
        }
    }
    else if (sendFilePopupOptions === 'moveToRecycle') {
        requestMessage.value = {
            option: sendFilePopupOptions,
            message: ""
        }
    }
    else if (sendFilePopupOptions === 'createFolder') {
        requestDrawerMessage.value = {
            option: sendFilePopupOptions
        }
    }
}

const showFileOperation = (e: any) => {
    if (isClickFile.value) {
        isClickFile.value = false
        return
    }
    if (isShowRecycle.value) {
        return 
    }
    e.preventDefault()
    filePopupLeft.value = e.clientX
    filePopupTop.value = e.clientY
    if (filePopupLeft.value + 160 > window.innerWidth) {
        filePopupLeft.value = window.innerWidth - 160
    }
    if (filePopupTop.value + 450 > window.innerHeight) {
        filePopupTop.value = window.innerHeight - 450
    }
    isShowFilePopup.value = true
    const filePopup = document.querySelector('.file-popup') as HTMLElement
    filePopup.style.left = e.clientX + 'px'
    filePopup.style.top = e.clientY + 'px'
    document.addEventListener('click', (e) => {
        const filePopup = document.querySelector('.file-options') as HTMLElement
        if (e.target !== filePopup) {
            isShowFilePopup.value = false
        }
    })
}

const getRecycleTitleOptions = (sendRecycleTitleOptions: string) => {
    if(sendRecycleTitleOptions === 'cleanOutRecycle') {
      RecycleMsg.value = {
        option: sendRecycleTitleOptions,
        message: "",
      }
    }
}
const getDrawerOptionType = (sendDrawerOptions: string) => {
    if (sendDrawerOptions === 'showRecycle') {
        router.push('/personal/recycle')
        isShowRecycle.value = true
        isShowFiles.value = false
    }
    else if (sendDrawerOptions === 'showFiles'){
        const pathList = (sessionStorage.getItem(StoragePathId) as string).split("/")
        router.push('/personal/' + pathList[pathList.length - 1])
        isShowRecycle.value = false
        isShowFiles.value = true
    }
}
const getDrawerSelectType = (sendDrawerSelectType: any) => {
  if(isFirst) {
    requestMessage.value = {
      option: "classifyFiles",
      message: sendDrawerSelectType
    }
  } else {
    isFirst = true
  }
}

const getLoading = (loading: boolean) => {
    isLoading.value = loading
}

const getOptionType = (sendOptions: string) => {
    if (sendOptions === 'cancelFilePopup') {
        isClickFile.value = true
        return
    }
    fileContents.value.option = sendOptions
    isShowPopup.value = true
}
const getDetails = (sendDetails: any) => {
    fileContents.value.contents = sendDetails
}

const getPopupOperations = (sendOperations: any) => {
    if (sendOperations.option === "cancelPopup") {
        isShowPopup.value = false
    }
    if (sendOperations.option === 'refreshFiles') {
        isShowPopup.value = false
        requestMessage.value = {
            option: "refreshFiles",
            message: ""
        }
    }
    if (sendOperations.option === 'updateName') {
        requestMessage.value = {
            option: "updateName",
            message: sendOperations.name
        }
    }
    if (sendOperations.option === 'clearList') {
        requestMessage.value = {
            option: "clearList",
            message: ''
        }
    }
    if (sendOperations.option === 'refreshFilesAndClearList') {
        requestMessage.value = {
            option: "refreshFilesAndClearList",
            message: ''
        }
    }
}

</script>

<style scoped lang="css">
.personal-main-box {
    width: 100%;
    height: 100%;
    display: flex;
    overflow-y: hidden;

    .popup {
        position: absolute;
    }

    .drawer {
        width: 190px;
        height: 100%;
    }

    .contents-box {
        flex: 1;
        display: flex;
        flex-direction: column;

        .header {
            width: 100%;
            display: flex;
            flex-direction: column;
            
            .cheader:deep(.header-box) {
                height: 55px;
                padding: 0;
                background-color: #fff;
                box-shadow: none;
            }
            .cheader:deep(.logo) {
                display: none;
            }
        }

        .bottom {
            flex: 1;
            overflow-y: auto;

            .files {
                margin: 20px;
            }

            .file-options {
                position: absolute;
            }
        }
    }
}
</style>