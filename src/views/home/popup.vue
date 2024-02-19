<template>
    <div class="main-box">
        <router-link 
            to="/user"
            class="user"
            v-if="isLogin"
        >个人信息</router-link>
        <router-link
            to="/login"
            class="login"
            v-if="!isLogin"
        >登录</router-link>
        <router-link
            to="/login"
            class="login"
            v-if="isLogin"
        >切换账号</router-link>
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
import { getUserDetail } from '../information/utils';
import { judgeHasLogin } from '@/utils/judge';

const store = useStore()
const isLogin = ref(false)

onMounted(() => {
    isLogin.value = judgeHasLogin()
})

const logout = () => {
    store.loginOut()
    isLogin.value = false
    getUserDetail()
    successMsg('退出登录成功')
    location.reload()
}
</script>

<style scoped lang="css">
.main-box {
    background: #ffffff;
    box-shadow: 0 0 20px 2px rgba(72, 72, 72, 0.1);
    padding: 10px;
    display: flex;
    flex-direction: column;

    .user,
    .login {
        height: 20px;
        text-decoration: none;
        font-size: 14px;
        color: rgb(113, 111, 111);
        margin: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .logout {
        height: 20px;
        border: none;
        padding: 0;
        margin: 0;
        font-size: 14px;
        color: rgb(113, 111, 111);
        background-color: #fff;
        cursor: pointer;
        margin: 5px;
    }

    .user:hover,
    .login:hover,
    .logout:hover {
        color: rgb(59, 93, 155);
        font-weight: 600;
    }
}
</style>