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

const store = useStore()

onMounted(() => {
    firstGetUserDetail()
})

const firstGetUserDetail = () => {
    const longToken = store.getUserLongToken()
    const loginType = store.getLoginType()

    if (longToken) {
        if (loginType === 1 && sessionStorage.getItem("HasChecked") === 'false') {
            getUserDetail().then(res => {
                sessionStorage.setItem("HasChecked", 'true')
                sessionStorage.setItem("avatarUrl", res.avatar)
                sessionStorage.setItem("Name", res.name)
                location.reload()
            });
        } 
        else if (loginType === 2 && localStorage.getItem("HasChecked") === 'false') {
            getUserDetail().then(res => {
                localStorage.setItem("HasChecked", 'true')
                localStorage.setItem("avatarUrl", res.avatar)
                localStorage.setItem("Name", res.name)
                location.reload()
            });
        }
    }
}
</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    background-color: rgba(240, 245, 255, 1);

    .cheader{
        height: 70px;
        position: fixed;
        z-index: 2;
    }

    .contents-box {
        padding: 100px;
        display: flex;
        flex-direction: column;

        .contents {
            margin: 0 auto;

            .section-top {
                width: 100%;

                .activity {
                    max-width: 1200px;
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
                /* justify-content: center; */
    
                .recommend {
                    width: 790px;
                    margin-right: 10px;
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
    
            .footer {
                height: 80px; 
                width: 100%; 
                border-top: 0.6px solid rgb(232, 232, 232); 
                margin-top: 50px; display: flex; 
                align-items: center; 
                justify-content: center;
            }
        }

    }
}

@media screen and (max-width: 1000px){

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