<template>
    <div class="main-box">
        <input 
            type="text"
            placeholder="搜索"
        >
        <i class="iconfont icon-sistrix"></i>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="css">
.main-box {
    width: 300px;
    height: 32px;
    border-radius: 25px;
    border: 2px solid rgb(107, 167, 232);
    padding-left: 15px;
    background-color: #ffffff;
    display: flex;
    align-items: center;

    input {
        width: 250px;
        height: 96%;
        border: none;
        outline: none;
    }
    input::placeholder {
        color: rgb(165, 165, 165);
    }

    i {
        font-size: 20px;
        color: rgb(107, 167, 232);
    }
}
</style>