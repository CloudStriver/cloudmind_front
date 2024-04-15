<template>
    <div class="main-box">
        <img :src="url" style="border-radius: 50%;">
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { StorageAvatarUrl} from "@/utils/consts";
import {onMounted, ref, watch} from "vue";
const store = useStore()
const url = ref<string>('')
const props = defineProps<{
  avatar: string
}>()
onMounted(() => {
    url.value = getAvatar() as string
})

watch(() => props.avatar, () => {
    url.value = props.avatar
})

const getAvatar = () => {
    const loginType = store.getLoginType()
    if (loginType === 0) {
        const avatarUrl = store.userAvatar
        return avatarUrl as string
    }
    else if (loginType === 1) {       
        return sessionStorage.getItem(StorageAvatarUrl) as string
    }
    else if (loginType === 2) { 
        return localStorage.getItem(StorageAvatarUrl) as string
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