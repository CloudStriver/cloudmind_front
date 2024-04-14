<template>
    <div class="posts-box" @click="cancelShowZonePop($event)">
        <CHeader class="cheader"></CHeader>
        <section class="section">
            <div class="contents-box">
                <div>
                    <nav class="nav">
                        <ul>
                            <li>
                                <label @click="router.push('/posts/hot')" :class="{checked: navSelect === 'hot'}"><i class="iconfont icon-mn_remen"></i>热门</label>
                            </li>
                            <li>
                                <label @click="router.push('/posts/recommend')" :class="{checked: navSelect === 'recommend'}"><i class="iconfont icon-tuijian"></i>推荐</label>
                            </li>
                            <li>
                                <label @click="router.push('/posts/follow')" :class="{checked: navSelect === 'follow'}"><i class="iconfont icon-guanzhu"></i>关注</label>
                            </li>
                            <li>
                                <label @click="router.push('/posts/new')" :class="{checked: navSelect === 'new'}"><i class="iconfont icon-zuixin"></i>最新</label>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="posts">
                    <div class="posts-select" v-if="navSelect === 'new'">
                        <div 
                            class="zone"
                            v-for="(label, index) in firstLabelList"
                            :key="index"
                        >
                            <input 
                                type="radio"
                                name="zone"
                                :id="label.id"
                                :value="label.id"
                                @click.stop="showZonePop($event, label.id)"
                            >
                            <label 
                                :for="label.id"
                            >{{ label.value }}</label>
                        </div>
                        <div 
                            v-if="isShowZonePop"
                            class="zone-pop"
                            :style="{top: zonePopTop + 'px', left: zonePopLeft + 'px'}"
                        >
                            <ul>
                                <li 
                                    v-for="(label, index) in secondLabelList" 
                                    @click="selectLabel(label.id)"
                                    :key="index"
                                >{{ label.value }}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="posts-contents">
                        <div 
                            class="content"
                            v-for="post in postList"
                            :key="post.postId"
                        >
                            <div class="information">
                                <h2 @click="enterPost(post.postId)">{{ post.title }}</h2>
                                <p>{{ splitContents(post.userName + ": " + post.text) }}</p>
                                <PostDetail :PostInfo="post"></PostDetail>
                            </div>
                            <div v-if="post.url !== ''" class="image">
                                <img :src="post.url" alt="图片">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rank-create">
                    <div class="create-post" v-if="store.getUserLongToken()">
                        <button @click="router.push('/write')">创建帖子</button>
                        <button @click="router.push('/manage/post')">管理帖子</button>
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
                                                <router-link :to="`/user/center/${user.userId}/dynamic/default`" class="router-link">
                                                    <p>{{ user.name }}</p>
                                                </router-link>
                                                    <p>{{ splitDescription(user.description) }}</p>
                                            </div>
                                        </div>
                                        <div v-if="user.userId !== store.getUserId()">
                                          <button
                                              v-if="!user.followed"
                                              @click="followHotUser(user)"
                                          >关注</button>
                                          <button v-else
                                                  @click="unFollowHotUser(user)"
                                          >已关注</button>
                                        </div>
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
import {onBeforeMount, onMounted, ref, watch} from 'vue'
import router from '@/router'
import {
  enterPost,
  getFollowPostList,
  getHotPostList,
  getNewPostList,
  getPostRankList,
  getRecommendPostList,
  getUserRankList,
} from "./utils"
import type {HotPost, HotUser, Label, Post} from "@/utils/type";
import {
  followHotUser,
  getLabelList,
  splitContents,
  splitDescription,
  unFollowHotUser
} from "@/utils/utils";
import {useStore} from "@/store";
import {useRoute} from "vue-router";

const store = useStore()
const navSelect = ref('all') // 选项
const selectLabelId = ref('root') // 当前选择分区的父分区ID
const NowLabelId = ref('')
const noMoreUsers = ref(false) // 没有更多作者了
const noMorePosts = ref(false) // 没有更多文章了
const isShowZonePop = ref(false) 
const userRankList = ref<HotUser[]>([]) // 作者排行榜
const postRankList = ref<HotPost[]>([]) // 文章排行榜
const postList = ref<Post[]>([]) // 帖子列表
const zonePopTop = ref(0)
const zonePopLeft = ref(0)
const firstLabelList = ref<Label[]>([])
const secondLabelList = ref<Label[]>([])
const pageSize = 10; // 假设每页加载10项
let userRankPage = 1; // 当前用户列表页码
let postRankPage = 1; // 当前帖子列表页码
let postPage = 1;
const route = useRoute()
onMounted(async() => {
    navSelect.value = route.params.select as string
    userRankList.value = await getUserRankList(pageSize, 0)
    postRankList.value = await getPostRankList(pageSize, 0)
    firstLabelList.value = await getLabelList(selectLabelId.value)
    await getPosts()
})

onBeforeMount(() => {
  router.beforeEach(async (to, from, next) => {
    navSelect.value = to.params.select as string
    await getPosts()
    next();
  });
});

const getPosts = async () => {
  switch (navSelect.value) {
    case 'hot':
      postList.value = await getHotPostList()
      break
    case 'recommend':
      postList.value = await getRecommendPostList()
      break
    case 'follow':
      postList.value = await getFollowPostList(pageSize, (postPage - 1) * pageSize)
      break
    case 'new':
      postList.value = await getNewPostList(NowLabelId.value)
      break
  }
}
// 取消显示二级分区
const cancelShowZonePop = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
        if (e.target.className !== 'zone-pop') {
            console.log("取消")
            isShowZonePop.value = false
            secondLabelList.value = []
        }
    }
}

const selectLabel = async (labelId: string) => {
  if (NowLabelId.value == labelId) {
    NowLabelId.value = ''
  } else {
    NowLabelId.value = labelId
  }
  await getPosts()
}

// 显示二级分区
const showZonePop = async (e: MouseEvent, labelId: string) => {
  selectLabelId.value = labelId
  console.log(labelId)
  isShowZonePop.value = false
  zonePopLeft.value = e.clientX
  zonePopTop.value = e.clientY - 90
  isShowZonePop.value = true

  secondLabelList.value = await getLabelList(selectLabelId.value)
}

// 加载下一页用户
const loadMoreUsers = async () => {
    const nextUsers = await getUserRankList(pageSize, userRankPage * pageSize);
    if (nextUsers.length === 0) {
        noMoreUsers.value = true;
    } else {
        userRankList.value = [...userRankList.value, ...nextUsers];
        userRankPage++;
        noMoreUsers.value = false;
    }
};

// 加载下一页的帖子
const loadMorePosts = async () => {
  const nextPosts = await getPostRankList(pageSize, postRankPage * pageSize);
  if (nextPosts.length === 0) {
    noMorePosts.value = true;
  } else {
    postRankList.value = [...postRankList.value, ...nextPosts];
    postRankPage++;
    noMorePosts.value = false;
  }
};



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
        padding-top: 20px;
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
                    width: 100%;
                    max-height: 100px;
                    overflow-y: auto;
                    display: flex;
                    flex-wrap: wrap;

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
                        padding: 10px;
                        border-radius: 10px;
                        background-color: #fff;
                        box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);

                        ul {
                            list-style: none;
                            padding: 0;
                            margin: 0;

                            li {
                                padding: 10px 20px;
                                cursor: pointer;
                                font-size: 14px;
                            }
                            li:hover {
                                background-color: #f4f4f4;
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
                                cursor: pointer;
                            }
                            h2:hover {
                                color: #1890ff;
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
                    border-radius: 5px;
                    margin-bottom: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
    
                    button {
                        width: 100%;
                        height: 40px;
                        background-color: #1890ff;
                        box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);
                        color: #fff;
                        border: none;
                        border-radius: 5px;
                        margin-bottom: 20px;
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

.checked {
  color: #1890ff; /* 蓝色 */
}

</style>