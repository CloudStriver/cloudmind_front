<template>
    <div class="main-box" @click="cancelShowSettingPopup()">
        <CHeader class="cheader"></CHeader>
        <div class="contents">
            <div class="detail-box">
                <div class="detail">
                    <header class="detail-header">
                        <div class="title">{{ postDetail.title }}</div>
                        <div class="other">
                            <div class="time">编写于 {{ turnTime(postDetail.updateTime) }}</div>
                            <div class="tag" v-if="judgeTags">
                                <div>标签:</div>
                                <div 
                                    v-for="tag in postDetail.tags"
                                    :key="tag" 
                                >{{ tag }}</div>
                            </div>
                        </div>
                        <div class="user">
                            <div>
                                <img :src="postDetail.author.url" alt="">
                                <div>{{ postDetail.author.name }}</div>
                            </div>
                            <div
                                class="follow"
                                v-if="!postDetail.author.followed"
                                @click="CreateRelation({
                                          toId: postDetail.author.userId,
                                          toType: TargetType.User,
                                          relationType: RelationType.Follow,
                              })"
                            >
                                <i class="iconfont icon-a-dianzan2"></i>
                                <div>关注</div>
                            </div>
                            <div
                                class="followed"
                                v-if="postDetail.author.followed"
                                @click="DeleteRelation({
                                            toId: postDetail.author.userId,
                                            toType: TargetType.User,
                                            relationType: RelationType.Follow,
                                })"
                            >
                                <i class="iconfont icon-a-dianzan2"></i>
                                <div>已关注</div>
                            </div>
                        </div>
                    </header>
                    <section class="detail-section">
                        <div v-html="postDetail.text"></div>
                    </section>
                    <footer class="detail-footer">
                        <div class="situation">
                            <div 
                                class="like"
                                v-if="!postDetail.liked"
                                @click="CreateRelation({
                                          toId: postDetail.postId,
                                          toType: TargetType.Post,
                                          relationType: RelationType.Like,
                                })"
                            >
                                <i class="iconfont icon-a-dianzan2"></i>
                                <div>点赞 {{ postDetail.likeCount }}</div>
                            </div>
                            <div 
                                class="liked" 
                                v-if="postDetail.liked"
                                @click="DeleteRelation({
                                          toId: postDetail.postId,
                                          toType: TargetType.Post,
                                          relationType: RelationType.Like,
                              })"
                            >
                                <i class="iconfont icon-a-dianzan2"></i>
                                <div>已点赞 {{ postDetail.likeCount }}</div>
                            </div>
                            <div class="remark">
                                <i class="iconfont icon-a-xiaoxi1"></i>
                                <div>评论 {{ postDetail.commentCount }}</div>
                            </div>
                            <div 
                                class="collect" 
                                v-if="!postDetail.collected"
                                @click="CreateRelation({
                                          toId: postDetail.postId,
                                          toType: TargetType.Post,
                                          relationType: RelationType.Collect,
                                })"
                            >
                                <i class="iconfont icon-shoucang01"></i>
                                <div>收藏</div>
                            </div>
                            <div 
                                class="collected" 
                                v-if="postDetail.collected"
                                @click="DeleteRelation({
                                          toId: postDetail.postId,
                                          toType: TargetType.Post,
                                          relationType: RelationType.Collect,
                                })"
                            >
                                <i class="iconfont icon-shoucang01"></i>
                                <div>已收藏</div>
                            </div>
                            <div class="share">
                                <i class="iconfont icon-fenxiang"></i>
                                <div>分享</div>
                            </div>
                            <div class="more">
                                <i class="iconfont icon-gengduo"></i>
                            </div>
                        </div>
                        <div 
                            class="setting" 
                            @click="isShowSetting = true" 
                            v-if="isMyPost"
                        >
                            <i class="iconfont icon-cog-solid"></i>
                            <div>设置</div>
                        </div>
                        <div v-show="isShowSetting" class="setting-popup">
                            <div @click="modifyPost">修改帖子</div>
                            <div @click.stop="deletePost">删除帖子</div>
                        </div>
                    </footer>
                    <div class="delete-post" v-if="isShowDeletePost">
                        <div>执行此操作后，该文章将永久删除，是否继续？</div>
                        <div class="delete-post-button">
                            <button @click="isShowDeletePost = false">取消</button>
                            <button @click="continueDelete">继续</button>
                        </div>
                    </div>
                </div>
            </div>
            <Comment class="comments"></Comment>
        </div>
    </div>
</template>

<script setup lang="ts">
import CHeader from '@/components/header.vue'
import Comment from './comment.vue'
import { get, post } from '@/utils/request'
import { useStore } from '@/store'
import { ref, onMounted, computed } from 'vue'
import type { responseGetPost } from './utils'
import router from '@/router'
import { successMsg} from '@/utils/message'
import {turnTime} from "@/utils/utils";
import {
  DeletePostUrl,
  GetPostUrl,
  RelationType,
  StoragePostContent,
  StoragePostTitle, StoragePostUrl, StorageUserId,
  TargetType
} from "@/utils/consts";
import {CreateRelation, DeleteRelation} from "@/utils/api";

const store = useStore()
const myUserId = ref('')
const isShowSetting = ref(false)
const isShowDeletePost = ref(false)
const postId = location.href.split('/').pop()
const postDetail = ref<responseGetPost>({
    postId: '',
    title: '',
    text: '',
    url: '',
    author: {
        userId: '',
        name: '',
        url: '',
        followed: false,
    },
    tags: [],
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    collectCount: 0,
    liked: false,
    collected: false,
    createTime: 0,
    updateTime: 0,
})

onMounted(() => {
    getPost()
})

const judgeTags = computed(() => {
    if (postDetail.value.tags !== null) {
        return true
    }
    return false
})

const deletePost = () => {
    isShowDeletePost.value = true
    isShowSetting.value = false
}
const continueDelete = () => {
    post(true, DeletePostUrl, { postId })
    .then(() => {
        successMsg('删除成功')
        router.push('/posts')
    })
}

const modifyPost = () => {
    sessionStorage.setItem(StoragePostTitle, postDetail.value.title)
    sessionStorage.setItem(StoragePostContent, postDetail.value.text)
    if (postDetail.value.url) {
        sessionStorage.setItem(StoragePostUrl, postDetail.value.url)
    }
    else {
        sessionStorage.setItem(StoragePostUrl, '')
    }
    router.push('/write/modify/' + postId)
}

const isMyPost = computed(() => {
    console.log(myUserId.value, postDetail.value.author.userId);
    return myUserId.value === postDetail.value.author.userId
})

const cancelShowSettingPopup = () => {
    document.addEventListener('click', (event) => {
        const settingPopup = document.querySelector('.setting-popup') as HTMLElement;
        const setting = document.querySelector('.setting') as HTMLElement;
        if (!settingPopup.contains(event.target as Node) && !setting.contains(event.target as Node)) {
            isShowSetting.value = false;
        }
        settingPopup.addEventListener('click', () => {
            isShowSetting.value = false;
        })
    });
    if (isShowDeletePost.value) {
        const deletePost = document.querySelector('.delete-post') as HTMLElement;
        document.addEventListener('click', (event) => {
            if (!deletePost.contains(event.target as Node) && event.target !== deletePost) {
                isShowDeletePost.value = false;
            }
        });
    }
}

const getMyUserId = () => {
    const type = store.getLoginType()
    if (type === 1) {
        myUserId.value = sessionStorage.getItem(StorageUserId) as string
    }
    else if (type === 2) {
        myUserId.value = localStorage.getItem(StorageUserId) as string
    }
    else {
        myUserId.value = ''
    }
}

const getPost = () => {
    get(false,  `${GetPostUrl}?postId=${postId}`)
    .then((res: any) => {
        getMyUserId()
        postDetail.value = res as responseGetPost
        postDetail.value.postId = postId as string
    })
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
    }
        
    .contents {
        position: relative;
        background-color: rgba(240, 245, 255, 1);
        width: 100%;
        padding-top: 20px;
        padding-bottom: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        overflow-x: hidden;

        .detail-box {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;


            .detail {
                position: relative;
                min-width: 700px;
                max-width: 1000px;
                background-color: #fff;
                padding: 20px 30px;

                .delete-post {
                    position: absolute;
                    width: 280px;
                    height: 120px;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 11px;
                    border-radius: 10px;
                    background-color: #fff;
                    box-shadow: 0 0 10px 1px #00000070;

                    .delete-post-button {
                        width: 100%;
                        text-align: end;
                        margin-top: 30px;

                        button {
                            width: 80px;
                            height: 25px;
                            border: none;
                            margin-left: 20px;
                        }

                        button:last-child {
                            background-color: #f5533a;
                            color: #fff;
                            border-radius: 5px;
                        }
                    }
                }

                .detail-header {
                    width: 100%;
                    height: 130px;
                    padding-bottom: 20px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #0000001f;
                    display: flex;
                    flex-direction: column;

                    .title {
                        font-size: 25px;
                        font-weight: 600;
                        margin-bottom:10px;
                    }

                    .other {
                        display: flex;
                        justify-content: space-between;

                        .time {
                            font-size: 14px;
                            color: #8c8c8c;
                            margin-bottom: 10px;
                        }

                        .tag {
                            display: flex;
                            font-size: 13px;
                            padding: 5px 10px;
                            color: #8c8c8c;
                            user-select: none;

                            div {
                                margin-left: 10px;
                            }
                        }
                    }

                    .user {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        img {
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                            margin-right: 10px;
                        }

                        div {
                            display: flex;
                            align-items: center;

                            div {
                                font-size: 18px;
                                font-weight: 700;
                                margin-right: 10px;
                                cursor: pointer;
                            }
                        }
                    }

                    .attention {
                        width: 70px;
                        height: 30px;
                        border-radius: 20px;
                        font-size: 16px;
                        font-weight: 700;
                        color: #fff;
                        background-color: #f8d9c5;
                        box-shadow: 0 0 5px 1px #ebac82;
                        border: none;
                        outline: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .attention:active {
                        box-shadow: none;
                    }
                }

                .detail-section {
                    display: flex;
                    flex-direction: column;
                }

                .detail-footer {
                    position: relative;
                    margin-top: 10px;
                    display: flex;
                    justify-content: space-between;

                    .setting {
                        cursor: pointer;
                        display: flex;
                        align-items: center;

                        i {
                            font-size: 20px;
                            margin-right: 5px;
                        }
                    }

                    .setting-popup {
                        position: absolute;
                        width: 150px;
                        right: 0;
                        bottom: 30px;
                        padding: 10px;
                        background-color: #fff;
                        box-shadow: 0 0 5px 1px #0000001f;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;

                        div {
                            width: 100%;
                            height: 30px;
                            line-height: 30px;
                            padding-left: 10px;
                            cursor: pointer;
                            vertical-align: middle;
                            user-select: none;
                        }
                        div:hover {
                            background-color: #f5f5f5;
                        }
                    }

                    .situation {
                        display: flex;

                        .like, 
                        .liked,
                        .remark,
                        .collect,
                        .collected,
                        .share,
                        .more{
                            display: flex;
                            align-items: center;
                            margin-right: 20px;
                            cursor: pointer;

                            i {
                                font-size: 20px;
                                margin-right: 5px;
                            }
                        }

                        .liked {
                            color: #6d99ec;
                            font-weight: 600;
                        }

                        .collected {
                            color: #ff9d5b;
                            font-weight: 600;
                        }
                    }
                }
            }
        }

        .comments {
            min-width: 700px;
            max-width: 1000px;
            margin-top: 10px;
        }
    }
}
</style>