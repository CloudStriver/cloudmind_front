<template>
    <div class="main-box">
        <div class="goods-box" v-show="props.classify === 'goods'">
            <div 
                class="goods" 

            >
                <header>
                    
                </header>
                <section>

                </section>
            </div>
        </div>
        <div class="posts-box" v-show="props.classify === 'posts'">
            <div 
                class="posts" 
                v-for="(post, index) in responseDetail.posts"
                :key="index"
            >
                <header class="posts-header">{{ post.title }}</header>
                <section class="posts-section">
                    <img src="" v-if="showPostImage(post.url)">
                    <div class="posts-layout">
                        <div v-if="post.url !== ''" class="post-image">
                            <img :src="post.url">
                        </div>
                        <div class="post-content">{{ htmlToText(post.userName + ": " + post.text) }}</div>
                    </div>
                </section>
                <footer class="footer">
                    <div class="show-situation">
                        <div
                            v-if="!post.liked"
                            class="i-div" 
                            @click="clickLike(post)"
                        >
                            <i class="iconfont icon-a-dianzan2"></i>
                            <div>点赞 {{ post.likeCount }}</div>
                        </div>
                        <div class="liked i-div" v-if="post.liked">
                            <i class="iconfont icon-a-dianzan2"></i>
                            <div>已点赞 {{ post.likeCount }}</div>
                        </div>
                        <div class="i-div">
                            <i class="iconfont icon-a-xiaoxi1"></i>
                            <div>评论 {{ post.commentCount }}</div>
                        </div>
                        <div  class="i-div">
                            <i class="iconfont icon-gengduo i"></i>
                        </div>
                    </div>
                    <div style="display: flex;">
                        <div 
                            class="tags"
                            v-for="(tag, index) in post.tags"
                            :key="index"
                        >
                            <button>{{ tag }}</button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
        <div class="user-box" v-show="props.classify === 'user'">
            <div></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { get, post } from '@/utils/request'
import { useStore } from '@/store/index'
import { ref, onMounted, watch } from 'vue'
import { errorMsg } from '@/utils/message';
import { truncate } from 'fs';
import { calendarEmits } from 'element-plus';

const storageContent = ref<any>({
    hotGoods: [],
    newGoods: [],
    recommendGoods: [],
    hotFiles: [],
    newFiles: [],
    recommendFiles: [],
    hotPosts: [],
    newPosts: [],
    recommendPosts: [],
    hotUsers: [],
    newUsers: [],
    recommendUsers: [],
})
const props = defineProps<{
    classify: string,
    mainClassify: string
}>()
interface ResponseDetail {
    users?: {
        userId: string
        name: string
        url: string
    }[],
    posts?: {
        postId: string
        title: string
        text: string
        url: string
        tags: string[]
        likeCount: number
        commentCount: number
        liked: boolean
        userName: string
    }[],
}
const responseDetail = ref<ResponseDetail>({
    users: [],
    posts: [],
})
const store = useStore()

onMounted(() => {
    getShow()
})

watch(() => props.mainClassify, () => {
    getShow()
})

const htmlToText = (html: string) => {
    const div = document.createElement('div')
    div.innerHTML = html
    if (div.innerText.length > 190) return div.innerText.slice(0, 190) + '...'
    return div.innerText
}

const clickLike = (thisPost: any) => {
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

const showPostImage = (url: string) => {
    return url !== ''
}

const getShow = () => {
    const mainClassify = props.mainClassify
    const classify = judgeType(props.classify) as string
    const classifyNum = trunNum(classify) as number
    const index = mainClassify + classify as any
    
    if (classify !== 'Users') {
        if (storageContent.value[index].length !== 0) {
            responseDetail.value = {
                posts: (storageContent as any).value[index].map((post: any) => ({
                    postId: post.postId,
                    title: post.title,
                    text: post.text,
                    url: post.url,
                    tags: post.tags,
                    likeCount: post.likeCount,
                    commentCount: post.commentCount,
                    liked: post.liked,
                    userName: post.userName
                }))
            }
            return 
        }
        
        const url = ref('')
        if (mainClassify === 'hot') {
            url.value = '/content/getPopularRecommend?category=' + classifyNum
        }
        else if (mainClassify === 'new') {
            url.value = '/content/getLatestRecommend?category=' + classifyNum
        }
        else {
            url.value = '/content/getRecommendByUser?category=' + classifyNum
        }
        
        get(url.value)
        .then((res: any) => {
            responseDetail.value = {
                posts: res.recommends.posts.map((post: any) => ({
                    postId: post.postId,
                    title: post.title,
                    text: post.text,
                    url: post.url,
                    tags: post.tags,
                    likeCount: post.likeCount,
                    commentCount: post.commentCount,
                    liked: post.liked,
                    userName: post.userName
                }))
            };
            storageContent.value[index] = res.recommends.posts
        })
    }
}
const judgeType = (type: string) => {
    switch (type) {
        case 'user':
            return 'Users'
        case 'file':
            return 'Files'
        case 'goods':
            return 'Goods'
        case 'posts':
            return 'Posts'
    }
}
const trunNum = (type: string) => {
    switch (type) {
        case 'Users':
            return 1
        case 'Files':
            return 2
        case 'Goods':
            return 3
        case 'Posts':
            return 4
    }
}
</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    padding: 5px 15px;    
    .goods-box {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, 150px);
        grid-template-rows: repeat(auto-fill, 200px);
        grid-column-gap: 5px;
        grid-row-gap: 10px;
        justify-content: space-around;
        align-items: center;

        .goods {
            width: 150px;
            height: 200px;
            background-color: #ffffff;
            box-shadow: 0 0 10px 1px #dadada7f;
        }
    }

    .posts-box {
        width: 100%;

        .posts {
            width: 100%;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e5e5e583;

            .posts-header {
                font-weight: 700;
                margin-bottom: 10px;
                cursor: pointer;
            }
            .posts-header:hover {
                color: #275187;
                text-decoration: underline;
            }

            .posts-section {
                width: 100%;
                display: flex;

                .posts-layout {
                    width: 100%;
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
                    }
                }
            }
            
            .footer {
                width: 100%;
                height: 30px;
                margin-top: 10px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .show-situation {
                    width: 400px;
                    display: flex;

                    .i-div {
                        margin-right: 25px;
                        display: flex;
                        align-items: center;
                        
                        i {
                            margin-right: 5px;
                        }
                    }

                    .liked {
                        color: #6d99ec;
                        font-weight: 600;
                    }
                }

                .tags {
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
</style>