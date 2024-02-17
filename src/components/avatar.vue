<template>
    <div class="main-box">
        <img :src="getAvatar()" style="border-radius: 50%;">
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store/index'
const store = useStore()

const getAvatar = () => {
    const loginType = store.getLoginType()
    if (loginType === 0) {
        const avatarUrl = store.userAvatar
        return avatarUrl as string
    }
    else if (loginType === 1) {       
        return sessionStorage.getItem("avatarUrl") as string
    }
    else if (loginType === 2) { 
        return localStorage.getItem("avatarUrl") as string
    }
}
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