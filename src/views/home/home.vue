<template>
    <div class="main-box">
        <Nav class="nav"></Nav>
        <div class="contents">
            <CHeader></CHeader>
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
import CHeader from '@/components/header.vue'
import activity from '@/views/home/activity.vue'
import recommend from '@/views/home/recommend.vue'
import rank from '@/views/home/rank.vue'
import announced from '@/views/home/announced.vue'
import { onMounted } from 'vue'
import { getUserDetail } from '../information/utils'

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