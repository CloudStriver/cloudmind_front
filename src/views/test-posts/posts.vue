<template>
    <div class="posts-box">
        <CHeader class="cheader"></CHeader>
        <section class="section">
            <div class="contents-box">
                <div>
                    <nav class="nav">
                        <ul>
                            <li>
                                <input
                                    type="radio"
                                    name="nav"
                                    id="all"
                                    value="all"
                                    v-model="navSelect"
                                >
                                <label for="all"><i class="iconfont icon-mn_remen"></i>热门</label>
                            </li>
                            <li>
                                <input 
                                    type="radio"
                                    name="nav"
                                    id="recommend"
                                    value="recommend"
                                    v-model="navSelect"
                                >
                                <label for="recommend"><i class="iconfont icon-tuijian"></i>推荐</label>
                            </li>
                            <li>
                                <input 
                                    type="radio"
                                    name="nav"
                                    id="follow"
                                    value="follow"
                                    v-model="navSelect"
                                >
                                <label for="follow"><i class="iconfont icon-guanzhu"></i>关注</label>
                            </li>
                            <li>
                                <input 
                                    type="radio"
                                    name="nav"
                                    id="new"
                                    value="new"
                                    v-model="navSelect"
                                >
                                <label for="new"><i class="iconfont icon-zuixin"></i>最新</label>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="posts">
                    <el-scrollbar height="100px">
                        <div class="posts-select">
                            <div 
                                class="zone"
                                v-for="(zone) in zoneList"
                                :key="zone.zoneId"
                            >
                                <input 
                                    type="radio"
                                    name="zone"
                                    :id="zone.zoneId"
                                    :value="zone.zoneId"
                                    v-model="zoneFatherId"
                                >
                                <label 
                                    :for="zone.zoneId" 
                                >{{ zone.value }}</label>
                            </div>
                            <div 
                                v-if="isShowZonePop"
                                class="zone-pop"
                                :style="{top: zonePopTop + 'px', left: zonePopLeft + 'px'}"
                                @mouseover="isShowZonePop = true"
                                @mouseout="isShowZonePop = false"
                            >
                                <ul>
                                    <li>二级分区1</li>
                                </ul>
                            </div>
                        </div>
                    </el-scrollbar>
                    <div class="posts-contents">
                        <div 
                            class="content"
                            v-for="post in postsList.posts"
                            :key="post.postId"
                        >
                            <div class="information">
                                <h2>{{ post.title }}</h2>
                                <p>{{ splitContents(post.userName + ": " + post.text) }}</p>
                                <PostDetail :information="post"></PostDetail>
                            </div>
                            <div v-if="post.url !== ''" class="image">
                                <img :src="post.url" alt="图片">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rank-create">
                    <div class="create-post">
                        <button @click="router.push('/test/write')">创建帖子</button>
                    </div>
                    <div class="post-rank">
                        <div class="post-rank-title">
                            <span>
                                <span class="post-rank-span">文章排行榜</span>
                            </span>
                        </div>
                        <div class="posts-rank-contents">
                            <ul>
                                <li 
                                    v-for="(post,index) in postRankList"
                                    :key="post.postId"
                                >
                                    <span>{{index + 1}}</span>
                                    <router-link :to="`/post/${post.postId}`" class="router-link">
                                      <span>{{post.title}}</span>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                        <div class="post-rank-more" @click="loadMorePosts" v-if="!noMorePosts">查看更多</div>
                        <div v-else  class="post-rank-more">没有更多文章了</div>
                    </div>
                    <div class="author-rank">
                        <div class="author-rank-title">
                            <span>
                                <span class="author-rank-span">作者排行榜</span>
                            </span>
                        </div>
                        <div 
                            class="author-rank-contents" 
                            v-for="user in userRankList"
                            :key="user.userId"
                        >
                            <ul>
                                <li>
                                    <div class="author">
                                        <div class="author-information">
                                            <img :src="user.url" alt="头像">
                                            <div class="information">
                                                <router-link :to="`/user/center/${user.userId}`" class="router-link">
                                                    <p>{{ user.name }}</p>
                                                </router-link>
                                                    <p>{{ splitDescription(user.description) }}</p>
                                            </div>
                                        </div>
                                        <button v-if="!user.followed" @click="followUser(user)">关注</button>
                                        <button v-else @click="unfollowerUser(user)">已关注</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="author-rank-more" @click="loadMoreUsers" v-if="!noMoreUsers">查看更多</div>
                        <div v-else  class="author-rank-more">没有更多作者了</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import CHeader from '@/components/header.vue'
import PostDetail from './post-information.vue'
import {onMounted, ref} from 'vue'
import router from '@/router'
import {
    getPostRankList,
    getUserRankList,
    getZoneList,
    getOtherPosts,
    type HotPost,
    type HotUser,
    type Zone,
    type responseGetOtherPosts
} from "./utils";
import { errorMsg } from "@/utils/message";
import { useStore } from "@/store";
import { post } from '@/utils/request'
import { TargetType, RelationType } from '@/utils/consts'

const store = useStore()
const navSelect = ref('all')
const zoneFatherId = ref('root')
const noMoreUsers = ref(false)
const noMorePosts = ref(false)
const isShowZonePop = ref(false)
const ismouseover = ref<Array<boolean>>([])
const userRankList = ref<HotUser[]>([])
const postRankList = ref<HotPost[]>([])
    const postsList = ref<responseGetOtherPosts>({
    posts: []
})
const zonePopTop = ref(0)
const zonePopLeft = ref(0)
const zoneList = ref<Zone[]>([])
const pageSize = 99999; // 假设每页加载10项
let userPage = 1; // 当前用户列表页码
let postPage = 1; // 当前帖子列表页码

onMounted(async() => {
    userRankList.value = await getUserRankList(pageSize, 0)
    postRankList.value = await getPostRankList(pageSize, 0)
    zoneList.value = await getZoneList(zoneFatherId.value, pageSize, 0)
    postsList.value = await getOtherPosts()
})

const splitDescription = (text: string) => {
    if (text.length > 6) return text.slice(0, 6) + '...'
    return text
}
const splitContents = (content: string) => {
    if (content.length > 80) return content.slice(0, 80) + '...'
    return content
}

// 加载下一页用户
const loadMoreUsers = async () => {
    const nextUsers = await getUserRankList(pageSize, userPage * pageSize);
    if (nextUsers.length === 0) {
        noMoreUsers.value = true;
    } else {
        userRankList.value = [...userRankList.value, ...nextUsers];
        userPage++;
        noMoreUsers.value = false;
    }
};

// 加载下一页的帖子
const loadMorePosts = async () => {
  const nextPosts = await getPostRankList(pageSize, postPage * pageSize);
  if (nextPosts.length === 0) {
    noMorePosts.value = true;
  } else {
    postRankList.value = [...postRankList.value, ...nextPosts];
    postPage++;
    noMorePosts.value = false;
  }
};

// 关注用户
const followUser = (user: any) => {
  const longToken = store.getUserLongToken()
  if (!longToken) {
    errorMsg('请先登录')
    return
  }
  post('/relation/createRelation', {
    toId: user.userId,
    toType:  TargetType.User,
    relationType: RelationType.Follow,
  })
  .then(() => {
    user.followed = true
  })
}

// 取消关注用户
const unfollowerUser = (user: any) => {
  const longToken = store.getUserLongToken()
  if (!longToken) {
    errorMsg('请先登录')
    return
  }
  post('/relation/deleteRelation', {
    toId: user.userId,
    toType:  TargetType.User,
    relationType: RelationType.Follow,
  })
  .then(() => {
    user.followed = false
  })
}

</script>

<style scoped lang="css">
.posts-box {
    width: 100%;
    height: 100%;
    background-color: rgba(240, 245, 255, 0.5);
    display: flex;
    flex-direction: column;

    .cheader {
        width: 100%;
        height: 70px;
        z-index: 1000;
    }

    .section {
        width: 100%;
        flex: 1;
        overflow-y: auto;

        .contents-box {
            position: relative;
            width: 100%;
            padding: 0 5% 0;
            margin: auto;
            display: flex;
            justify-content: center;


            .nav {
                width: 200px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);
                margin-right: 30px;
                margin-top: 10px;
    
    
                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
    
                    li {
                        cursor: pointer;
                        display: flex;
                        align-items: center;
    
                        i {
                            font-size: 20px;
                            margin-right: 20px;
                        }
    
                        input {
                            display: none;
                        }
    
                        label {
                            width: 100%;
                            padding: 10px;
                            font-size: 16px;
                        }
    
                        input:checked + label {
                            color: #1890ff;
                            background-color: #f0f5ff;
                        }
                    }
                }
            }
    
            .posts {
                width: 1000px;
                margin-right: 30px;
                padding: 10px;
                margin-top: 10px;
                background-color: #fff;
                box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);
                display: flex;
                flex-direction: column;
    
                .posts-select {
                    max-height: 100px;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, 1fr);
                    grid-template-rows: repeat(auto-fill, 50px);
    
                    .zone {
                        height: 25px;
                        padding: 0 10px;
                        font-size: 14px;
                        margin: 10px;
                        border-radius: 5px;
                        color: #61666D;
                        display: flex;
                        align-items: center;
    
                        input {
                            display: none;
                        }
                        input:checked + label {
                            color: #1890ff;
                        }

                        label {
                            cursor: pointer;
                        }
                        label:hover {
                            border-bottom: 1px solid #1890ff;
                        }
                    }

                    .zone-pop {
                        position: absolute;
                        width: 100px;
                        background-color: #fff;
                        box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);

                        ul {
                            list-style: none;
                            padding: 0;
                            margin: 0;

                            li {
                                padding: 10px;
                                cursor: pointer;
                                font-size: 14px;
                            }
                        
                        }
                    }
                }
    
                .posts-contents {
                    border-top: 1px solid #f0f0f0;
                    .content {
                        padding: 10px;
                        border-bottom: 1px solid #f0f0f0;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        .information {
                            flex: 1;
                            margin-right: 10px;

                            h2 {
                                font-size: 20px;
                                margin: 0;
                                padding: 0;
                            }

                            p {
                                color: #61666D;
                                font-size: 15px;
                            }
                        }
    
    
                        .image {
                            width: 180px;
                            height: 100px;
                            
                            img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                border-radius: 10px;
                            }
                        }
                    }
                }
            }
    
            .rank-create {
                margin-top: 10px;
                width: 250px;
    
                .create-post {
                    width: 100%;
                    height: 50px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
    
                    button {
                        width: 100%;
                        height: 80%;
                        background-color: #1890ff;
                        box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);
                        color: #fff;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                }
    
                .post-rank {
                    width: 100%;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);
                    padding: 15px;
                    margin-bottom: 30px;
    
                    .post-rank-title {
                        padding-bottom: 10px;
                        border-bottom: 1px solid #f0f0f0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
    
                        .post-rank-span {
                            font-size: 16px;
                            font-weight: 600;
                        }
    
                        .refresh-post-rank {
                            color: rgb(132, 132, 132);
                            font-size: 12px;
                            cursor: pointer;
                            
    
                            i {
                                font-size: 12px;
                                margin-right: 5px;
                            }
                        }
                    }
    
                    .posts-rank-contents {
                        ul {
                            list-style: none;
                            padding: 0;
                            margin: 0;
    
                            li {
                                display: flex;
                                align-items: center;
                                padding: 10px 0;
                                color: #61666D;
    
                                span {
                                    width: 30px;
                                    font-size: 16px;
                                }

                                .router-link {
                                    text-decoration: none;
                                    color: rgb(63, 63, 63);
                                    font-size: 13px;
                                }
                            }
                            li:nth-child(1) {
                                color: #ff4d4f;
                                font-weight: 600;
                            }
                            li:nth-child(2) {
                                color: #fa8c16;
                                font-weight: 600;
                            }
                            li:nth-child(3) {
                                color: #e7c943;
                                font-weight: 600;
                            }
                        }
                    }
    
                    .post-rank-more {
                        padding: 10px 0 0 0;
                        text-align: center;
                        cursor: pointer;
                        font-size: 13px;
                        color: rgb(132, 132, 132);
                        border-top: 1px solid #f0f0f0;
                    }
                }
    
                .author-rank {
                    width: 100%;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);
                    padding: 15px;
    
                    .author-rank-title {
                        padding-bottom: 10px;
                        border-bottom: 1px solid #f0f0f0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
    
                        .author-rank-span {
                            font-size: 16px;
                            font-weight: 600;
                        }
                    }
    
                    .author-rank-contents {
                        ul {
                            list-style: none;
                            padding: 0;
                            margin: 0;
    
                            li {
                                padding: 15px 0;
                                border-bottom: 1px solid #f0f0f0;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
    
                                .author {
                                    width: 100%;
                                    margin-right: 10px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: space-between;

                                    .author-information {
                                        flex: 1;
                                        display: flex;

                                        img {
                                            width: 40px;
                                            height: 40px;
                                            border-radius: 50%;
                                            margin-right: 10px;
                                        }
            
                                        .information {
                                            p {
                                                margin: 0;
                                            }
                                            p:first-child {
                                                font-size: 15px;
                                                color: black
                                            }
                                            p:nth-child(2) {
                                                font-size: 12px;
                                                color: rgb(132, 132, 132);
                                            }

                                            .router-link {
                                                text-decoration: none;
                                            }
                                        }
                                    }
    
                                    button {
                                        width: 60px;
                                        height: 30px;
                                        border: none;
                                        border-radius: 5px;
                                        cursor: pointer;
                                        background-color: #ffede0;
                                        color: #a37658;
                                    }
                                }
                            }
                        }
                    }
    
                    .author-rank-more {
                        padding: 10px 0 0 0;
                        text-align: center;
                        cursor: pointer;
                        font-size: 13px;
                        color: rgb(132, 132, 132);
                        border-top: 1px solid #f0f0f0;
                    }
                }
            }
        }
    }
}
</style>