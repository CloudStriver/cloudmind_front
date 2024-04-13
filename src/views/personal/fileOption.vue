<template>
    <div class="file-option-box">
        <div class="create-folder" @click="createFolder" v-if="!props.AllSelect">新建文件夹</div>
        <div class="upload-file" @click="uploadFile" v-if="!props.AllSelect">上传文件</div>
        <div class="upload-folder" v-if="!props.AllSelect">上传文件夹</div>
        <div class="line"></div>
        <div class="all-select" @click="allSelect">全选</div>
        <div class="download">下载</div>
        <div class="recycle" @click="moveToRecycle">移至回收站</div>
        <div class="delete" @click="cleanOut">彻底删除</div>
        <div class="line"></div>
        <div class="refresh" @click="flashPage">刷新页面</div>
    </div>
</template>
<script setup lang="ts">
import {ref, watch} from 'vue'

const emit = defineEmits(['sendFilePopupOptions'])
const props = defineProps<{
  AllSelect: boolean,
}>()
const allSelect = () => {
    emit('sendFilePopupOptions', 'allSelect')
}
const moveToRecycle = () => {
    emit('sendFilePopupOptions', "moveToRecycle")
}
const createFolder = () => {
    emit('sendFilePopupOptions', "createFolder")
}

const flashPage = () => {
  emit('sendFilePopupOptions', "flashPage")
}

const uploadFile = () => {
  emit('sendFilePopupOptions', "uploadFile")
}

const cleanOut = () => {
  emit('sendFilePopupOptions', "cleanOutFile")
}

</script>
<style scoped lang="css">
.file-option-box {
    width: 160px;
    padding: 10px 20px;
    background-color: #fff;
    box-shadow: 0 0 10px 1px rgb(214, 214, 214);
    z-index: 10;
    border-radius: 20px;

    div {
        width: 100%;
        height: 35px;
        margin: 10px 0;
        padding-left: 10px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
    }

    div:hover {
        background-color: #f5f5f5;
    }

    .line {
        width: 100%;
        height: 1px;
        margin: 0;
        background-color: #e5e5e56b;
    }
}
</style>