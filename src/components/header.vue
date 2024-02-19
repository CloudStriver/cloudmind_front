<template>
    <div class="main-box">
        <div class="header-box">
            <search class="search"></search>
            <div class="header-right">
                <i class="iconfont icon-calendar-check-solid"></i>
                <router-link 
                    v-if="isLogin"
                    to="/notification" 
                    style="text-decoration: none;"
                    @click="hasNotification = false"
                >
                    <div class="notifications-count" v-if="hasNotification"></div>
                    <i class="iconfont icon-bell"></i>
                </router-link>
                <i class="iconfont icon-cog-solid"></i>
                <avatar 
                    class="avatar" 
                    @mouseover="mouseoverPopup"
                    @mouseleave="mouseleavePopup"
                ></avatar>
                <popup 
                    class="popup"
                    v-show="isPopup"
                    @mouseover="mouseoverPopup"
                    @mouseleave="mouseleavePopup"
                ></popup>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { judgeHasLogin } from '@/utils/judge'
import { getAllNotificationCount } from '@/utils/public' 
import Search from '@/components/search.vue'
import Avatar from '@/components/avatar.vue'
import popup from '@/views/home/popup.vue'

const isLogin = ref(false)
const isPopup = ref(false)
const hasNotification = ref(false)

onMounted(() => {
    isLogin.value = judgeHasLogin()
    if (isLogin.value) {
        timingGetNotificationCount()
    }
})

const mouseoverPopup = () => { isPopup.value = true } 
const mouseleavePopup = () => { isPopup.value = false }
const timingGetNotificationCount = () => {
    if (!hasNotification.value) {
        getAllNotificationCount(() => {
        }).then((res) => {
            hasNotification.value = res
            setTimeout(() => {
                timingGetNotificationCount()
            }, 30000)
        })
    }
}
</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    height: 70px;
    padding: 0 2% 0;
    margin-bottom: 20px;

    .header-box {
        width: 100%;
        height: 70px;
        background-color: rgba(207, 227, 252, 0.6);
        padding: 0 60px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .search {
            width: 300px;
            height: 32px;
            padding: 0;
            margin: 0;
        }

        .header-right {
            display: flex;
            align-items: center;
            position: relative;

            .notifications-count {
                position: absolute;
                width: 13px;
                height: 13px;
                color: #fff;
                background-color: #de3032;
                border: 3px solid rgba(207, 227, 252, 1);
                border-radius: 50%;
                right: 128px;
                top: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            i {
                font-size: 20px;
                margin-right: 30px;
                cursor: pointer;
                color: #494848;
            }

            .avatar {
                width: 50px;
                height: 50px;
                margin: 0;
                padding: 0;
            }

            .popup {
                position: absolute;
                width: 150px;
                height: auto;
                right: -55px;
                top: 50px;
                z-index: 10;
            }
        }
    }
}
</style>