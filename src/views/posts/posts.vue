<template>
    <div class="main-box">
        <CHeader class="cheader"></CHeader>
        <div class="contents">
            <section class="section">
                <div class="posts-box">
                    <div 
                        class="add-post" 
                        v-if="store.getUserLongToken()"
                        @click="router.push('/write')"
                    >
                        <i class="iconfont icon-jia"></i>
                        <div>发布</div>
                    </div>
                    <div
                        v-for="(post, index) in postsList.posts"
                        :key="index"
                    >
                        <div class="posts">
                            <header 
                                class="posts-header"
                                @click="toPostDetail(post.postId)"
                            >{{ post.title }}</header>
                            <section class="posts-section">
                                <div v-if="post.url !== ''" class="post-image">
                                    <img :src="post.url">
                                </div>
                                <div class="post-content">{{ htmlToText(post.userName + ": " +  post.text) }}</div>
                            </section>
                            <PostDetail
                                :information="post"
                                class="post-detail"
                            ></PostDetail>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import CHeader from '@/components/header.vue'
import PostDetail from './post-information.vue'
import { ref, onMounted } from 'vue'
import { getOtherPosts } from './utils'
import { useStore } from '@/store/index'
import type { responseGetOtherPosts } from './utils'
import router from '@/router'

const store = useStore()
const postsList = ref<responseGetOtherPosts>({
    posts: []
})

onMounted(async () => {
    postsList.value = await getOtherPosts()
})

const htmlToText = (html: string) => {
    const div = document.createElement('div')
    div.innerHTML = html
    if (div.innerText.length > 190) return div.innerText.slice(0, 190) + '...'
    return div.innerText
}

const toPostDetail = (postId: string) => {
    router.push('/post/' + postId)
}

</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .cheader {
        width: 100%;
        height: 70px;
        box-shadow: 0 1px 10px 3px rgba(0, 0, 0, 0.1);
    }

    .contents {
        position: relative;
        background-color: rgba(240, 245, 255, 0.5);
        padding-top: 20px;
        flex: 1;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        
        .section {
            width: 100%;
            padding-left: 10%;
            padding-right: 10%;
            flex: 1;
            overflow-y: auto;
            display: flex;
            justify-content: center;
            
            .posts-box {
                position: absolute;
                width: 850px;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 0 10px 1px #a7a7a71f;
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
                    border-bottom: 1px solid #e5e5e586;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                    display: flex;
                    flex-direction: column;

                    .posts-header {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 10px;
                        cursor: pointer;
                    }
                    .posts-header:hover {
                        color: #6d99ec;
                        text-decoration: underline;
                    }

                    .posts-section {
                        font-size: 16px;
                        display: flex;

                        .post-image {
                            width: 220px;
                            height: 130px;
                            margin-right: 10px;
                            cursor: pointer;

                            img {
                            width: 100%;
                            height: 100%;
                            border-radius: 5px;
                            object-fit: cover; 
                            display: block;
                            }
                        }

                        .post-content {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                        }
                    }
                    
                    .post-detail {
                        width: 100%;
                        margin-top: 10px;
                    }
                }
            }
        }
    }
}
</style>