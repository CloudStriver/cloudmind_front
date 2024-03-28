<template>
    <div class="personal-main-box">
        <Drawer 
            class="drawer" 
            @sendDrawerOptions="getDrawerOptionType"
            @sendDrawerSelectType="getDrawerSelectType"
        ></Drawer>
        <div class="contents-box">
            <div class="header">
                <CHeader class="cheader"></CHeader>
                <PathTitle v-if="isShowFiles && isLoading"></PathTitle>
                <RecycleTitle v-if="isShowRecycle"></RecycleTitle>
            </div>
            <div class="bottom">
                <Files 
                    v-if="isShowFiles"
                    class="files" 
                    @sendOptions="getOptionType"
                    @sendDetails="getDetails"
                    @loading="getLoading"
                    :sendRequest="requestMessage"
                ></Files>
                <Recycle v-if="isShowRecycle"></Recycle>
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
import router from '@/router'
import { ref } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const requestMessage = ref({
    option: "",
    message: ""
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
const isShowRecycle = ref(location.href.includes('recycle'))
const isLoading = ref(false)
const isShowPopup = ref(false)
const isShowFiles = ref(!location.href.includes('recycle'))
const getDrawerOptionType = (sendDrawerOptions: string) => {
    if (sendDrawerOptions === 'showRecycle') {
        router.push('/personal/recycle')
        isShowRecycle.value = true
        isShowFiles.value = false
    }
    else {
        const userId = store.getUserId()
        router.push('/personal/' + userId)
        isShowRecycle.value = false
        isShowFiles.value = true
    }
}
const getDrawerSelectType = (sendDrawerSelectType: any) => {
    requestMessage.value = {
        option: "classifyFiles",
        message: sendDrawerSelectType
    }
}

const getLoading = (loading: boolean) => {
    isLoading.value = loading
}

const getOptionType = (sendOptions: string) => {
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
                height: 100%;
                margin: 20px;
            }
        }
    }
}
</style>