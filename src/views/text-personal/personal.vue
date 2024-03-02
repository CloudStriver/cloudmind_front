<template>
    <div class="personal-main-box">
        <Drawer class="drawer"></Drawer>
        <div class="contents-box">
            <div class="header">
                <CHeader class="cheader"></CHeader>
                <PathTitle v-if="isLoaded"></PathTitle>
            </div>
            <div class="bottom">
                <Files 
                    class="files" 
                    @loading="judgeLoading"
                    @sendOptions="getOptionType"
                    @sendDetails="getDetails"
                ></Files>
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
import CHeader from '@/components/header.vue'
import { ref } from 'vue'

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
const isShowPopup = ref(false)
const isLoaded = ref(false)

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
            padding: 20px;
            overflow-y: auto;

            .files {
                height: 100%;
            }
        }
    }
}
</style>