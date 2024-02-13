<template>
    <div class="main-box">
        <img :src="store.userAvatar" style="border-radius: 50%;">
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store/index'

const store = useStore()
</script>

<style scoped lang="css">
.main-box {
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-radius: 50%;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
    }
}
</style>