<template>
    <div class="write-box">
        <Editor 
            class="editor-box"
            :sendOperateType="createPostData"
            @sendEditorContents="getEditorText"
        />
        <div class="setting-box" v-if="isClickSettingButton">
            <ShowSetting 
                :sendPostData="postData"
                @sendSettingContents = "getSettingOperate"
            ></ShowSetting>
        </div>
    </div>
</template>

<script setup lang="ts">
import Editor from './text-editor.vue'
import ShowSetting from './text-setting.vue'
import { ref, onBeforeMount } from 'vue'
import {StoragePostContent, StoragePostId, StoragePostTitle} from "@/utils/consts";

const createPostData = ref('')
const isClickSettingButton = ref(false)
const postData = ref({
    text: '',
    title: '',
    postId: '',
})
onBeforeMount(() => {
    const option = location.href.split('/').pop()
    const type = option === 'write' ? '设置' : option === 'edit' ? '编辑' : ''
    postData.value = {
      text: sessionStorage.getItem(StoragePostContent) as string,
      title:  sessionStorage.getItem(StoragePostTitle) as string,
      postId: ""
    }
    createPostData.value = type
})

const getSettingOperate = (sendSettingContents: any) => {
    if (sendSettingContents === 'close') {
        isClickSettingButton.value = false
    }
}

const getEditorText = (sendEditorContents: any) => {
    isClickSettingButton.value = true
    console.log(sendEditorContents)
    postData.value = {
        text: sendEditorContents.text,
        title: sendEditorContents.title,
        postId: sessionStorage.getItem(StoragePostId) as string,
    }
}

</script>

<style scoped lang="css">
.write-box {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .setting-box {
        position: absolute;
        top: 0;
        left: 0;
        background-color: #00000078;
        z-index: 100;
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }
}
</style>