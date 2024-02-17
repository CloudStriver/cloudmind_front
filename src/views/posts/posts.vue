<template>
    <div class="main-box">
        <Nav class="nav"></Nav>
        <div class="contents">
            <CHeader class="cheader"></CHeader>
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
                            <footer class="posts-footer">
                                <div class="post-detail">
                                    <div 
                                        class="like"
                                        v-if="!post.liked"
                                        @click="likePost(post)"
                                    >
                                        <i class="iconfont icon-a-dianzan2"></i>
                                        <div>点赞 {{ post.likeCount }}</div>
                                    </div>
                                    <div class="liked" v-if="post.liked">
                                        <i class="iconfont icon-a-dianzan2"></i>
                                        <div>已点赞 {{ post.likeCount }}</div>
                                    </div>
                                    <div class="remark">
                                        <i class="iconfont icon-a-xiaoxi1"></i>
                                        <div>评论 {{ post.commentCount }}</div>
                                    </div>
                                    <i class="iconfont icon-gengduo i"></i>
                                </div>
                                <div class="tag-box">
                                    <div
                                        class="tag"
                                        v-for="(tag, index) in post.tags"
                                        :key="index"
                                    >
                                        <button>{{ tag }}</button>
                                    </div>
                                </div>
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
import CHeader from '@/components/header.vue'
import { ref, onMounted } from 'vue'
import { getOtherPosts } from './utils'
import { post } from '@/utils/request'
import { useStore } from '@/store/index'
import type { responseGetOtherPosts } from './utils'
import { errorMsg } from '@/utils/message'
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
    console.log('跳转');
}

const likePost = (thisPost: any) => {
    const longToken = store.getUserLongToken()
    if (!longToken) {
        errorMsg('请先登录')
        return
    }
    post('/relation/createRelation', {
        toId: thisPost.postId,
        toType: 4,
        relationType: 1
    })
    .then(() => {
        thisPost.liked = true
        thisPost.likeCount ++
    })
}

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
        flex: 1;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;

        .cheader {
            height: 70px;
        }
        
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
                background-color: #ffffff61;
                padding: 20px;
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
                    border-radius: 10px;
                    box-shadow: 0 0 10px 2px #0808081f;
                    padding: 20px 30px;
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
                    
                    .posts-footer {
                        margin-top: 10px;
                        color: #494848;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        .post-detail {
                            display: flex;

                            .like,
                            .liked,
                            .remark {
                                margin-right: 20px;
                                display: flex;
    
                                i {
                                    font-size: 20px;
                                    margin-right: 3px;
                                }
                            }
    
                            .i {
                                font-size: 20px;
                                margin-right: 20px;
                            }
    
                            .like:hover,
                            .remark:hover {
                                color: #6d99ec;
                            }
    
                            i:hover {
                                color: #6d99ec;
                            }
    
                            .liked {
                               color: #6d99ec;
                               font-weight: 600;
                            }
                            .liked:hover {
                                color: #494848;
                            }
                        }

                        .tag-box {
                            display: flex;
                            
                            .tag {
                                display: flex;
    
                                button {
                                    background-color: #b0d3f8;
                                    color: #fff;
                                    border: none;
                                    border-radius: 5px;
                                    padding: 5px 10px;
                                    margin-right: 10px;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>