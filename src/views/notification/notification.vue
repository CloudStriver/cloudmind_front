<template>
    <div class="main-box">
        <Nav class="nav"></Nav>
        <div class="contents">
            <header class="header">
                <div class="header-layout">
                    <search class="search"></search>
                    <div class="header-right">
                        <i class="iconfont icon-calendar-check-solid"></i>
                        <i class="iconfont icon-bell"></i>
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
            <section class="section">
                <div class="notification-box">
                    <div class="section-top">
                        <div class="notifications">
                            <div style="font-size: 22px; font-weight: 700;">通知中心</div>
                            <div class="notifications-count">126</div>
                        </div>
                        <label for="">
                            <input type="radio" name="select">
                        </label>
                        <label for="">
                            <input type="radio" name="select">
                        </label>
                        <label for="">
                            <input type="radio" name="select">
                        </label>
                        <label for="">
                            <input type="radio" name="select">
                        </label>
                        <label for="">
                            <input type="radio" name="select">
                        </label>
                    </div>
                    <div class="section-bottom">
                        <div class="notification"></div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import Nav from '@/components/navigation.vue'
import search from '@/components/search.vue'
import avatar from '@/components/avatar.vue'
import popup from '@/views/home/popup.vue'
import { ref } from 'vue'

const isPopup = ref(false)
const mouseoverPopup = () => { isPopup.value = true } 
const mouseleavePopup = () => { isPopup.value = false }
</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    height: 100%;
    display: flex;

    .nav {
        position: fixed;
        height: 100%;
        width: 80px;
        float: left;
    }

    .contents {
        position: relative;
        background-color: rgba(240, 245, 255, 1);
        margin-left: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        
        .header {
            position: absolute;
            width: 100%;
            height: 70px;
            background-color: rgba(240, 245, 255, 1);
            padding: 0 2% 0;
            margin: auto;

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

        .section {
            position: relative;
            width: 100%;
            flex: 1;
            padding: 0 28% 0;
            margin: 0 10% 130px 10%;
            top: 100px;
            overflow-y: auto;
            display: flex;

            .notification-box {
                flex: 1;
                display: flex;
                flex-direction: column;

                .section-top {
                    height: 100px;
                    background-color: #fff;
                    margin-bottom: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;

                    .notifications {
                        position: relative;

                        .notifications-count {
                            position: absolute;
                            height: 30px;
                            padding: 0 5px;
                            color: #fff;
                            background-color: #de3032;
                            border-radius: 50%;
                            right: -30px;
                            top: -15px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }
                }

                .section-bottom {
                    width: 100%;
                    flex: 1;
                    background-color: #fff;

                    .notification {
                        width: 100%;
                        background-color: #762222;
                    }
                }
            }
        }

    }
}
</style>