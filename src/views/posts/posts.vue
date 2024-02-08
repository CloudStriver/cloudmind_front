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
                <div class="posts-box">
                    <div class="add-post">
                        <i class="iconfont icon-jia"></i>
                        <div>发布</div>
                    </div>
                    <div
                        v-for="(post, index) in postsList.posts"
                        :key="index"
                    >
                        <div class="posts">
                            <header class="posts-header">{{ post.title }}</header>
                            <section class="posts-section">
                                {{ post.author.name }}: {{ post.text }}
                            </section>
                            <footer class="posts-footer">
                                <div class="like">
                                    <i class="iconfont icon-a-dianzan2"></i>
                                    <div>点赞 {{ post.likeCount }}</div>
                                </div>
                                <i class="iconfont icon-a-buhao2 i"></i>
                                <i class="iconfont icon-gengduo i"></i>
                            </footer>
                        </div>
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
import { ref, onMounted } from 'vue'
import { getOtherPosts } from './utils'
import type { responseGetOtherPosts } from './utils'

const isPopup = ref(false)
const postsList = ref<responseGetOtherPosts>({
    posts: []
})

onMounted(async () => {
    postsList.value = await getOtherPosts()
})

const mouseoverPopup = () => { isPopup.value = true } 
const mouseleavePopup = () => { isPopup.value = false }

</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;

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
        
        .header {
            position: absolute;
            width: 100%;
            height: 70px;
            background-color: rgba(240, 245, 255, 1);
            padding: 0 2% 0;
            margin: auto;
            z-index: 5;

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
            height: 100%;
            padding-left: 10%;
            padding-right: 10%;
            margin-bottom: 10px;
            overflow: hidden;
            overflow-y: auto;
            display: flex;
            justify-content: center;
            
            .posts-box {
                position: absolute;
                width: 850px;
                background-color: #ffffff61;
                padding: 20px 0;
                margin-top: 80px;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;

                .add-post {
                    position: absolute;
                    width: 150px;
                    height: 50px;
                    background-color: #fff;
                    left: -180px;
                    border-radius: 20px;
                    box-shadow: 0 0 10px 2px #01030a1f;
                    cursor: pointer;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    
                    i {
                        font-size: 30px;
                        margin-right: 20px;
                        color: #6d99ec;
                    }
                }
                .add-post:hover {
                    background-color: #e4e4e42f;
                }

                .posts {
                    width: 800px;
                    background-color: #fff;
                    border-radius: 50px;
                    box-shadow: 0 0 10px 2px #0808081f;
                    padding: 20px 30px;
                    margin-bottom: 50px;
                    display: flex;
                    flex-direction: column;

                    .posts-header {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 10px;
                    }

                    .posts-section {
                        font-size: 16px;
                        margin-bottom: 10px;
                    }
                    
                    .posts-footer {
                        margin-top: 10px;
                        color: #494848;
                        display: flex;
                        align-items: center;

                        .like {
                            margin-right: 20px;
                            font-weight: 600;
                            color: #29529e;
                            display: flex;

                            i {
                                font-size: 20px;
                                margin-right: 3px;
                            }
                        }

                        .i {
                            font-size: 20px;
                            margin-right: 20px;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
}
</style>