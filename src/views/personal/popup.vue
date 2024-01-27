<template>
    <div class="main-box">
        <label class="upload-files" for="file">
            <i class="iconfont icon-file-upload-line"></i>
            <div>上传文件</div>
            <input 
                type="file" 
                style="display: none;" 
                id="file"
                multiple
            >
        </label>
        <label class="upload-folder" for="folder">
            <i class="iconfont icon-folder-upload-line"></i>
            <div>上传文件夹</div>
            <input 
                type="file" 
                id="folder"
                webkitdirectory
                style="display: none;"
            >
        </label>
        <div class="create-folder">
            <i class="iconfont icon-folder-add-line"></i>
            <div>创建文件夹</div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="css">
.main-box {
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 0 20px 2px rgba(72, 72, 72, 0.1);
    padding: 8px 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .upload-files,
    .upload-folder,
    .create-folder{
        height: 40px;
        padding-left: 10px;
        display: flex;
        align-items: center;
    }
    .upload-files:hover,
    .upload-folder:hover,
    .create-folder:hover{
        cursor: pointer;
        background: #f5f5f5;
    }
}
</style>