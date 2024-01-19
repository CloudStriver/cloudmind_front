<template>
    <div class="track">
        <div class="typeface">向右拖动滑块</div>
        <div class="slider">
            <i class="iconfont icon-youjian"
               style="color: rgb(129, 129, 129);"></i>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="css">
.track {
    position: relative;
    width: 220px;
    height: 30px;
    background-color: #f4f9ff;
    box-shadow: inset 0 0 2px #c9c9c9;
    display: flex;
    align-items: center;

    .typeface {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 11px;
        color: rgb(114, 114, 114);
        user-select: none;
    }

    .slider {
        width: 30px;
        height: 30px;
        background-color: #ffffff;
        border: 0.1px solid #ffffff;
        box-shadow: 0 0 2px 0.6px #c9c9c9;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .slider:hover {
        box-shadow: 0 0 3px 0.6px #9f9f9f;
    }
}
</style>