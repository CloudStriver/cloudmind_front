<template>
    <div class="main-box">
        <Nav class="nav"></Nav>
        <div class="contents">
            <CHeader class="header"></CHeader>
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
                            <header 
                                class="posts-header"
                                @click="toPostDetail(post.postId)"
                            >{{ post.title }}</header>
                            <section class="posts-section">
                                {{ post.userName }}: {{ post.text }}
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
                                        v-for="(tag, index) in post.tags.slice(0, 3)"
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
        flex: 1;
        overflow-x: hidden;

        .header {
            height: 70px;
        }
        
        .section {
            position: relative;
            width: 100%;
            padding-left: 10%;
            padding-right: 10%;
            flex: 1;
            overflow: hidden;
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
                        margin-bottom: 10px;
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