<template>
    <div class="search-box">
        <CHeader></CHeader>
        <nav class="nav">
            <ul>
<!--                <li>-->
<!--                    <input -->
<!--                        type="radio"-->
<!--                        name="select"-->
<!--                        id="synthesis"-->
<!--                        value="synthesis"-->
<!--                        v-model="selectContent"-->
<!--                        checked-->
<!--                    >-->
<!--                    <label for="synthesis">综合</label>-->
<!--                </li>-->
                <li>
                    <input 
                        type="radio"
                        name="select"
                        id="post"
                        value="post"
                        v-model="selectContent"
                        :class="{ 'checked': selectContent === 'post'}"
                        @click="changeContent('post')"
                    >
                    <label for="post">帖子</label>
                </li>
                <li>
                    <input 
                        type="radio" 
                        name="select"
                        id="files"
                        value="file"
                        v-model="selectContent"
                        :class="{ 'checked': selectContent === 'file'}"
                        @click="changeContent('file')"
                    >
                    <label for="files">文件</label>
                </li>
                <li>
                    <input 
                        type="radio"
                        name="select"
                        id="users"
                        value="user"
                        v-model="selectContent"
                        :class="{ 'checked': selectContent === 'user'}"
                        @click="changeContent('user')"
                    >
                    <label for="users">用户</label>
                </li>
            </ul>
        </nav>
        <section class="section">
            <div class="contents-box">
                <div class="header">
                    <ul>
                        <li>
                            <input 
                                type="radio"
                                name="selectSecond"
                                id="synthesis_2"
                                :value="`${SearchSortType.Synthesis}`"
                                v-model="selectSort"
                                :class="{ 'checked': selectSort === 3}"
                                @click="changeSort(SearchSortType.Synthesis)"
                            >
                            <label for="synthesis_2">综合排序</label>
                        </li>
                        <li>
                            <input 
                                type="radio"
                                name="selectSecond"
                                id="new"
                                :value="`${SearchSortType.CreateTime}`"
                                v-model="selectSort"
                                :class="{ 'checked': selectSort === 2}"
                                @click="changeSort(SearchSortType.CreateTime)"
                            >
                            <label for="new">最新优先</label>
                        </li>
                        <li>
                            <input 
                                type="radio"
                                name="selectSecond"
                                id="hot"
                                :value="`${SearchSortType.Score}`"
                                v-model="selectSort"
                                :class="{ 'checked': selectSort === 1}"
                                @click="changeSort(SearchSortType.Score)"
                            >
                            <label for="hot">相关性优先</label>
                        </li>
                    </ul>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                        时间不限
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                        </span>
                        <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="changeTimer(SearchPeriodType.None)">时间不限</el-dropdown-item>
                            <el-dropdown-item @click="changeTimer(SearchPeriodType.Day)">最近一天</el-dropdown-item>
                            <el-dropdown-item @click="changeTimer(SearchPeriodType.Week)">最近一周</el-dropdown-item>
                            <el-dropdown-item @click="changeTimer(SearchPeriodType.Month)">最近一月</el-dropdown-item>
                            <el-dropdown-item @click="changeTimer(SearchPeriodType.Year)">最近一年</el-dropdown-item>
                        </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="contents">
                    <div class="content-file-box" v-if="selectContent === 'file'">
                        <h1 class="title">标题</h1>
                        <p class="content">内容</p>
                        <p>admin·2024-04-07·tags</p>
                        <div>
                            <div>
                                <i class="iconfont icon-a-dianzan2"></i>
                                <span>1k</span>
                            </div>
                            <div class="information">
                                <i class="iconfont icon-a-xiaoxi1"></i>
                                <span>1k</span>
                            </div>
                        </div>
                    </div>
                    <div class="content-post-box" v-if="selectContent === 'post'"> <!-- v-if="帖子" -->
                        <div class="content" v-for="(post, index) in postList">
                            <div class="information">
                                <h2 @click="enterPost(post.postId)">{{post.title}}</h2>
                                <p>{{post.text}}</p>
                                 <PostDetail :PostInfo="post"></PostDetail>
                            </div>
                            <div v-if="post.url !== ''" class="image">
                                <img :src="post.url" alt="图片">
                            </div>
                        </div>
                    </div>
                    <div class="content-user-box" v-if="selectContent === 'user'"> <!-- v-if="用户" -->
                        <div class="user-box" v-for="(user, index) in userList">
                            <div class="user-info">
                                <div class="image">
                                    <img :src="user.url" alt="">
                                </div>
                                <div class="infor">
                                    <p class="name" @click="enterUser(user.userId)">{{user.name}}</p>
                                    <p class="fans">粉丝量：{{user.followedCount}}</p>
                                    <div class="user-tag" v-for="(label, index) in user.labels">
                                        <span>{{label}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="follow-button" v-if="user.userId !== store.getUserId()">
                              <button v-if="!user.followed" @click="followUser(user)">+ 关注</button>
                              <button v-else @click="unFollowUser(user)">已关注</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
import CHeader from '@/components/header.vue'
import PostDetail from '@/views/posts/post-information.vue'
import {onBeforeMount, onMounted, ref} from 'vue';
import {useRoute} from "vue-router";
import type {Post, User} from "@/utils/type";
import { SearchPost, SearchUser} from "@/utils/api";
import {SearchPeriodType, SearchSortType} from "@/utils/consts";
import router from "@/router";
import {enterPost} from "@/views/posts/utils";
import {useStore} from "@/store";
import {enterUser, followUser, unFollowUser} from "@/utils/utils";

const keyword = ref('')
const selectContent = ref('')
const selectSort = ref(0)
const selectPeriod = ref(0)
const postList = ref<Post[]>([])
const userList = ref<User[]>([])
const store = useStore()
onMounted(async () => {
  const route = useRoute()
  keyword.value = route.params.keyword as string
  selectContent.value = route.params.type as string
  selectSort.value = parseInt(route.params.sort as string)
  selectPeriod.value = parseInt(route.params.period as string)
  await search()
})


onBeforeMount(() => {
  router.beforeEach(async (to, from, next) => {
    keyword.value = to.params.keyword as string
    selectContent.value = to.params.type as string
    selectSort.value = parseInt(to.params.sort as string)
    selectPeriod.value = parseInt(to.params.period as string)
    await search()
    next();
  });
});


const search = async () => {
  switch (selectContent.value) {
    case 'post':
      postList.value = await searchPost(keyword.value, selectSort.value, selectPeriod.value)
      break
    case 'files':
    case 'user':
      userList.value = await searchUser(keyword.value, selectSort.value, selectPeriod.value)
  }
}

const changeContent = (content: string) => {
  router.push(`/search/${keyword.value}/${content}/${selectSort.value}/${selectPeriod.value}`)
}

const changeSort = (sort: SearchSortType) =>  {
  router.push(`/search/${keyword.value}/${selectContent.value}/${sort}/${selectPeriod.value}`)
}

const changeTimer = (timer: SearchPeriodType) => {
  router.push(`/search/${keyword.value}/${selectContent.value}/${selectSort.value}/${timer}`)
}

const searchPost = async (key: string, sort: number, period: number) => {
  const postList = ref<Post[]>([])
  await SearchPost({
    searchKeyword: key,
    searchType: sort,
    searchTimerType: period
  }).then((res: any) => {
    postList.value = res.posts.map((post: any) => ({
      postId: post.postId,
      title: post.title,
      text: post.text,
      url: post.url,
      likeCount: post.likeCount,
      Labels: post.labels,
      commentCount: post.commentCount,
      viewCount: post.viewCount,
      liked: post.liked,
      userName: post.userName
    }))
  })
  return postList.value
}

const searchUser = async (key: string, sort: number, period: number) => {
  const userList = ref<User[]>([])
  await SearchUser({
    searchKeyword: key,
    searchType: sort,
    searchTimerType: period
  }).then((res: any) => {
    userList.value = res.users.map((user: any) => ({
      userId: user.userId,
      name: user.name,
      url: user.url,
      description: user.description,
      followedCount: user.followedCount,
      labels: user.tags,
      followed: user.followed,
    }))
  })
  return userList.value
}




</script>
<style scoped lang="css">
.search-box {
    width: 100%;
    height: 100%;
    background-color: rgba(240, 245, 255, 0.5);
    display: flex;
    flex-direction: column;

    .nav {
        width: 100%;
        background-color: #fff;
        box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
        z-index: 1;

        ul {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;

            li {
                margin-right: 100px;
                display: flex;
                justify-content: center;
                align-items: center;

                input {
                    display: none;
                }

                label {
                    display: block;
                    width: 100%;
                    height: 100%;
                    line-height: 50px;
                    text-align: center;
                    cursor: pointer;
                    color: #333;
                    transition: all 0.3s;

                    &:hover {
                        color: #1890ff;
                    }

                    .checked {
                        color: #1890ff;
                    }
                }

                input:checked + label {
                    color: #1890ff;
                }
            }
        }
    }

    .section {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding-top: 20px;
        padding-bottom: 20px;

        .contents-box {
            width: 1000px;
            min-height: 800px;
            background-color: #fff;
            margin: auto;
            box-shadow: 0 0 10px rgba(26, 26, 26, 0.1);
            padding: 20px;

            .header {
                width: 100%;
                padding-bottom: 10px;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                justify-content: space-between;
                align-items: center;

                ul {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    li {
                        margin-right: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        input {
                            display: none;
                        }

                        label {
                            display: block;
                            width: 100%;
                            height: 100%;
                            text-align: center;
                            cursor: pointer;
                            color: #333;
                            transition: all 0.3s;

                            .checked {
                                color: #1890ff;
                            }
                        }

                        input:checked + label {
                            color: #1890ff;
                        }
                    }
                }
            }

            .contents {
                .content-file-box {
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #f0f0f0;

                    .title {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }

                    .content {
                        font-size: 16px;
                        color: #666;
                        margin-bottom: 10px;
                    }

                    p {
                        margin: 0;
                        font-size: 14px;
                        color: #999;
                        margin-bottom: 10px;
                    }

                    div {
                        display: flex;
                        align-items: center;

                        div {
                            margin-right: 20px;
                            display: flex;
                            align-items: center;

                            i {
                                font-size: 20px;
                                margin-right: 5px;
                            }

                            span {
                                font-size: 14px;
                                color: #999;
                            }
                        }

                        .information {
                            display: flex;
                            align-items: center;

                            i {
                                font-size: 20px;
                                margin-right: 5px;
                            }

                            span {
                                font-size: 14px;
                                color: #999;
                            }
                        }
                    }
                }

                .content-post-box {
                    .content {
                        padding: 10px;
                        margin-bottom: 10px;
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

                .content-user-box {
                    .user-box {
                        margin-top: 10px;
                        border-bottom: 1px solid #f0f0f0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .user-info {
                            padding-bottom: 10px;
                            margin-bottom: 10px;
                            display: flex;
                            .image {
                                width: 60px;
                                height: 60px;
                                border-radius: 50%;
                                margin-right: 20px;
                                background-color: #625252;
                            }
    
                            .infor {
                                display: flex;
                                flex-direction: column;
    
                                p {
                                    margin: 0;
                                    font-size: 16px;
                                }
                                .name {
                                    font-weight: bold;
                                }
                                .fans {
                                    font-size: 14px;
                                    margin-bottom: 3px;
                                    color: #999;
                                }
                                .user-tag {
                                    display: flex;
    
                                    span {
                                        padding: 0 10px;
                                        font-size: 13px;
                                        background-color: #b0d3f8;
                                        color: #fff;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        border-radius: 5px;
                                    }
                                }
                            }
                        }
    
                        .follow-button {
                            button {
                                padding: 5px 10px;
                                color: #1890ff;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                background-color: #fff;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>