<template>
    <div class="options-main-box">
        <div class="file-popup" >
            <div class="upload-public">上传至社区</div>
            <div class="line"></div>
            <div class="rename" @click="renameFile">重命名</div>
            <div class="detail" @click="checkFileDetail">查看详细信息</div>
            <div class="download" @click="downloadFile">下载</div>
            <div class="move" @click="moveFile">移动</div>
            <div class="line"></div>
            <div class="recycle" @click="moveToRecycle">移至回收站</div>
            <div class="delete" @click="cleanOutFile">彻底删除</div>
        </div>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['sendOptions'])
const checkFileDetail = () => {
    emit('sendOptions', "checkDetail")
}
const moveFile = () => {
    emit('sendOptions', "moveFile")
}

const cleanOutFile = () => {
  emit('sendOptions', "cleanOutFile")
}
const moveToRecycle = () => {
    emit('sendOptions', "moveToRecycle")
}
const renameFile = () => {
    emit('sendOptions', 'renameFile')
}
const downloadFile = () => {
    emit('sendOptions', "downloadFile")
}
</script>

<style scoped lang="css">
.check-detail-box {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #9d55557a;
}

.options-main-box {
    .file-popup {
        width: 160px;
        padding: 5px 0;
        border-radius: 15px;
        z-index: 10;
        background-color: #fff;
        box-shadow: 0 0 10px 1px rgb(214, 214, 214);
    
        div {
            height: 35px;
            margin: 10px;
            padding-left: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
        }
        div:hover {
            background-color: #f5f5f5;
        }
        
        .delete {
            color: #d83b3b;
        }
    
        .line {
            height: 1px;
            background-color: #e5e5e56b;
        }
    }
}
</style>