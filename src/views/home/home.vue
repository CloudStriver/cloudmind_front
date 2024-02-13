<template>
    <div class="main-box">
        <Nav class="nav"></Nav>
        <div class="contents">
            <header class="header">
                <div class="header-layout">
                    <search class="search"></search>
                    <div class="header-right">
                        <i class="iconfont icon-calendar-check-solid"></i>
                        <router-link to="/notification" style="text-decoration: none;">
                            <div class="notifications-count"></div>
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
            </header>
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
            <footer class="footer"> 
                <a href="https://beian.miit.gov.cn/" target="_blank">湘ICP备2023015545号</a>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import Nav from '@/components/navigation.vue'
import search from '@/components/search.vue'
import avatar from '@/components/avatar.vue'
import activity from '@/views/home/activity.vue'
import recommend from '@/views/home/recommend.vue'
import rank from '@/views/home/rank.vue'
import announced from '@/views/home/announced.vue'
import popup from '@/views/home/popup.vue'
import { ref, onMounted } from 'vue'
import { getUserDetail } from '../information/utils'

const isPopup = ref(false)
const mouseoverPopup = () => { isPopup.value = true } 
const mouseleavePopup = () => { isPopup.value = false }

onMounted(() => {
    getUserDetail()
})
</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    display: flex;
    
    .nav {
        position: fixed;
        height: 100%;
        width: 80px;
        float: left;
    }

    .contents {
        background-color: rgba(240, 245, 255, 1);
        margin-left: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;

        .header {
            width: 100%;
            height: 70px;
            background-color: rgba(240, 245, 255, 1);
            padding: 0 2% 0;
            margin-bottom: 20px;

            .header-layout {
                width: 100%;
                height: 100%;
                background-color: rgba(207, 227, 252, 0.6);
                padding: 0 60px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                
                .search {
                    width: 300px;
                    height: 32px;
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
                    }

                    .popup {
                        position: absolute;
                        width: 160px;
                        height: 80px;
                        right: 40px;
                        top: 60px;
                        z-index: 10;
                    }
                }
            }
        }

        .section-top {
            width: 100%;
            padding: 0 2% 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            .activity {
                max-width: 1200px;
                height: 360px;
                margin-bottom: 10px;
            }

        }
        .section-bottom {
            width: 100%;
            padding: 0 2% 0;
            margin-bottom: 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            .recommend {
                width: 790px;
                height: 780px;
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