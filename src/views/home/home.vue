<template>
    <div class="main-box">
        <CHeader class="cheader"></CHeader>
        <div class="contents-box">
            <div class="contents">
                <section class="section-top">
                    <activity class="activity"></activity>
                </section>
                <section class="section-bottom">
                    <recommend class="recommend"></recommend>
                    <div class="right">
                        <rank class="rank"></rank>
                        <announced class="announced"></announced>
                    </div>
                </section>
            </div>
            </div>
    </div>
</template>

<script setup lang="ts">
import CHeader from '@/components/header.vue'
import activity from '@/views/home/activity.vue'
import recommend from '@/views/home/recommend.vue'
import rank from '@/views/home/rank.vue'
import announced from '@/views/home/announced.vue'
import { onMounted } from 'vue'
import { useStore } from '@/store/index'
import { getUserDetail } from '../information/utils'
import {StorageAvatarUrl, StorageDoGetUser, StorageName} from "@/utils/consts";

const store = useStore()

onMounted(() => {
    firstGetUserDetail()
})

const firstGetUserDetail = () => {
    const longToken = store.getUserLongToken()
    const loginType = store.getLoginType()

    if (longToken) {
        if (loginType === 1 && sessionStorage.getItem(StorageDoGetUser) === 'false') {
            getUserDetail().then(res => {
                sessionStorage.setItem(StorageDoGetUser, 'true')
                sessionStorage.setItem(StorageAvatarUrl, res.avatar)
                sessionStorage.setItem(StorageName, res.name)
                location.reload()
            });
        }
        else if (loginType === 2 && localStorage.getItem(StorageDoGetUser) === 'false') {
            getUserDetail().then(res => {
                localStorage.setItem(StorageDoGetUser, 'true')
                localStorage.setItem(StorageAvatarUrl, res.avatar)
                localStorage.setItem(StorageName, res.name)
                location.reload()
            });
        }
    }
}
</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    background-color: rgba(240, 245, 255, 0.5);

    .cheader{
        width: 100%;
        height: 70px;
        position: fixed;
        z-index: 2;
    }

    .contents-box {
        padding-top: 100px;
        display: flex;
        flex-direction: column;

        .contents {
            margin: 0 auto;

            .section-top {
                width: 100%;

                .activity {
                    height: 360px;
                    margin-bottom: 10px;
                    background-color: #fff;
                }
    
            }
            .section-bottom {
                width: 100%;
                margin-bottom: 20px;
                display: flex;
                flex-direction: row;
    
                .recommend {
                    width: 790px;
                    min-height: 700px;
                    margin-right: 10px;
                    background-color: #fff;
                }
    
                .right {
                    width: 400px;
                    height: 780px;
                    display: flex;
                    flex-direction: column;
    
                    .rank {
                        max-width: 400px;
                        height: 520px;
                        background-color: #fff;
                        margin-bottom: 10px;
                    }
    
                    .announced {
                        max-width: 400px;
                        height: 250px;
                        background-color: #fff;
                    }
                }
            }
        }

    }
}

@media screen and (min-width: 780px){
    .activity {
        width: 1200px;
    }
    
}
@media screen and (max-width: 780px){
    .activity {
        width: 750px;
    }
    .section-top {
        width: 100%;
    }
    .section-bottom {
        width: 100%;
        padding: 0;
        margin: 0;

        display: flex;
        flex-direction:  column;

        .recommend {
            width: 100%;
            margin-right: 0;
        }

        .rank {
            width: 100%;
        }

        .announced {
            width: 100%;
        }
    }
}
</style>