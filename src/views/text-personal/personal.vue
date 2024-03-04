<template>
    <div class="personal-main-box">
        <Drawer class="drawer" @sendDrawerOptions="getDrawerOptionType"></Drawer>
        <div class="contents-box">
            <div class="header">
                <CHeader class="cheader"></CHeader>
                <PathTitle v-if="isLoaded && isShowFiles"></PathTitle>
                <RecycleTitle v-else></RecycleTitle>
            </div>
            <div class="bottom">
                <Files 
                    v-if="isShowFiles"
                    class="files" 
                    @loading="judgeLoading"
                    @sendOptions="getOptionType"
                    @sendDetails="getDetails"
                    :sendRequest="requestMessage"
                ></Files>
                <Recycle v-else></Recycle>
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
import { ref } from 'vue'

const requestMessage = ref("")
const fileContents = ref({
    option: "",
    contents: {
        fileId: "",
        userId: "",
        name: "",
        type: "",
        path: "",
        fatherId: "",
        spaceSize: "",
        createAt: "",
        updateAt: ""
    }
})
const isLoaded = ref(false)
const isShowPopup = ref(false)
const isShowFiles = ref(true)

const getDrawerOptionType = (sendDrawerOptions: string) => {
    if (sendDrawerOptions === 'showRecycle') {
        isShowFiles.value = false
    }
}

const judgeLoading = (loading: boolean) => {
    isLoaded.value = loading
}

const getOptionType = (sendOptions: string) => {
    fileContents.value.option = sendOptions
    isShowPopup.value = true
}
const getDetails = (sendDetails: any) => {
    fileContents.value.contents = sendDetails
}

const getPopupOperations = (sendOperations: string) => {
    if (sendOperations === "cancelPopup") {
        isShowPopup.value = false
    }
    if (sendOperations === 'refreshFiles') {
        isShowPopup.value = false
        requestMessage.value = "refreshFiles"
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
                padding: 0 20px 0 0 ;
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
                height: 100%;
                margin: 20px;
            }
        }
    }
}
</style>