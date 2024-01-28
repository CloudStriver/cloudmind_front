<template>
    <div class="main-box">
        <router-link 
            to="/user"
            class="user"
        >个人信息</router-link>
        <router-link
            to="/login"
            class="login"
            v-if="!isLogin"
        >登录</router-link>
        <button
            class="logout"
            v-if="isLogin"
            @click="logout"
        >退出登录</button>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store/index'
import { onMounted, ref } from 'vue'
import { successMsg } from '@/utils/message';

const store = useStore()
const isLogin = ref(false)

onMounted(() => {
    isLogin.value = store.getUserId() === "" ? false : true
})

const logout = () => {
    store.loginOut()
    isLogin.value = false
    successMsg('退出登录成功')
}
</script>

<style scoped lang="css">
.main-box {
    background: #ffffff;
    box-shadow: 0 0 20px 2px rgba(72, 72, 72, 0.1);
    padding: 8px 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .user,
    .login {
        text-decoration: none;
        font-size: 14px;
        color: rgb(113, 111, 111);
    }

    .logout {
        border: none;
        padding: 0;
        margin: 0;
        font-size: 14px;
        background-color: #fff;
        color: rgb(113, 111, 111);
        cursor: pointer;
    }

    .user:hover,
    .login:hover,
    .logout:hover {
        color: rgb(59, 93, 155);
        font-weight: 600;
    }
}
</style>