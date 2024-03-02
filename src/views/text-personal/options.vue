<template>
    <div>
        <div 
            class="file-popup" 
        >
            <div class="upload-public">上传至社区</div>
            <div class="line"></div>
            <div class="detail">查看详细信息</div>
            <div class="download">下载</div>
            <div class="move">移动</div>
            <div class="line"></div>
            <div class="recycle">移至回收站</div>
            <div class="delete">彻底删除</div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="css">
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
</style>