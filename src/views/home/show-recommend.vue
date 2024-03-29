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
                <router-link 
                    class="posts-header"
                    :to="'/post/' + post.postId"
                >{{ post.title }}</router-link>
                <section class="posts-section">
                    <img src="" v-if="showPostImage(post.url)">
                    <div class="posts-layout">
                        <div v-if="post.url !== ''" class="post-image">
                            <img :src="post.url">
                        </div>
                        <div class="post-content">{{ htmlToText(post.userName + ": " + post.text) }}</div>
                    </div>
                </section>
                <PostDetail 
                    :information="post"
                    class="footer"
                ></PostDetail>
            </div>
        </div>
        <div class="user-box" v-show="props.classify === 'user'">
            <div 
                class="user"
                v-for="(user, index) in responseDetail.users"
                :key="index"
            >
                <img :src="user.url">
                <div class="user-detail">
                    <div>{{ user.name }}</div>
                    <div>粉丝量：{{ user.followCount }}</div>
                    <div 
                        class="user-tag"
                        v-for="(tag, index) in user.labels"
                        :key="index"
                    >
                        {{ tag }}
                    </div>
                </div>
              <div
                  class="follow"
                  v-if="!user.followed"
                  @click="followUser(user)"
              >
                <i class="iconfont icon-a-dianzan2"></i>
                <div>关注</div>
              </div>
              <div
                  class="followed"
                  v-if="user.followed"
                  @click="unfollowerUser(user)"
              >
                <i class="iconfont icon-a-dianzan2"></i>
                <div>已关注</div>
              </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import PostDetail from '../posts/post-information.vue'
import { get } from '@/utils/request'
import { ref, onMounted, watch } from 'vue'
import { post } from '@/utils/request'
import {errorMsg} from "@/utils/message";
import {useStore} from "@/store";
const store = useStore()

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
        description: string
        followCount: number
        labels: string[]
        followed: boolean
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

onMounted(() => {
    getShow()
})

watch(() => props.mainClassify, () => {
    getShow()
})
watch(() => props.classify, () => {
    getShow()
})

const htmlToText = (html: string) => {
    const div = document.createElement('div')
    div.innerHTML = html
    if (div.innerText.length > 190) return div.innerText.slice(0, 190) + '...'
    return div.innerText
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
    else {
        if (storageContent.value[index].length !== 0) {
            responseDetail.value = {
                users: (storageContent as any).value[index].map((user: any) => ({
                    userId: user.userId,
                    name: user.name,
                    url: user.url,
                    description: user.description,
                    followCount: user.followCount,
                    labels: user.labels
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
                users: res.recommends.users.map((user: any) => ({
                    userId: user.userId,
                    name: user.name,
                    url: user.url,
                    description: user.description,
                    followCount: user.followCount,
                    labels: user.labels
                }))
            };
            storageContent.value[index] = res.recommends.users
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
            return 4
        case 'Posts':
            return 3
    }
}



const followUser = (user: any) => {
  const longToken = store.getUserLongToken()
  if (!longToken) {
    errorMsg('请先登录')
    return
  }
    post('/relation/createRelation', {
      toId: user.userId,
      toType:  1,
      relationType: 2,
    })
    .then(() => {
      user.followed = true
      user.followCount++
    })
}

const unfollowerUser = (user: any) => {
  const longToken = store.getUserLongToken()
  if (!longToken) {
    errorMsg('请先登录')
    return
  }
  post('/relation/deleteRelation', {
    toId: user.userId,
    toType:  1,
    relationType: 2,
  })
    .then(() => {
      user.followed = false
      user.followCount--
    })
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
                color: #000;
                text-decoration: none;
                font-weight: 700;
                cursor: pointer;
            }
            .posts-header:hover {
                color: #275187;
                text-decoration: underline;
            }

            .posts-section {
                width: 100%;
                margin-top: 5px;
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
                margin-top: 10px;
            }
        }
    }

    .user-box {
        width: 100%;

        .user {
            width: 100%;
            height: 90px;
            padding: 10px;
            border-bottom: 1px solid #e5e5e5a1;
            display: flex;
            align-items: center;
            justify-content: space-between;

            img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                margin-right: 20px;
            }

            .user-detail {
                flex: 1;
                
                div:first-child {
                    font-size: 16px;
                    font-weight: 700;
                    margin-bottom: 5px;
                }
                div:nth-child(2) {
                    font-size: 14px;
                    color: #919191;
                    margin-bottom: 5px;
                }
                .user-tag {
                    width: 50px;
                    height: 20px;
                    font-size: 14px;
                    background-color: #b0d3f8;
                    border-radius: 5px;
                    color: #ffffff;
                    text-align: center;
                }
            }

          .follow, .followed {
            width: 70px;
            height: 30px;
            line-height: 30px;
            background-color: #f8d9c5;
            box-shadow: 0 0 5px 1px #ebac82;
            border: none;
            border-radius: 5px;
            color: #fff;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .follow i, .followed i {
            font-size: 17px;
            margin-right: 3px;
          }

          /* 按钮激活（被点击）时的样式 */
          .follow:active, .followed:active {
            box-shadow: none;
          }

        }
    }
}
</style>