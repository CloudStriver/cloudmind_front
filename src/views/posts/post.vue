<template>
    <div class="main-box" @click="cancelShowSettingPopup()">
        <Nav class="nav"></Nav>
        <div class="contents">
            <CHeader class="cheader"></CHeader>
            <div class="detail-box">
                <div class="detail">
                    <header class="detail-header">
                        <div class="title">{{ postDetail.title }}</div>
                        <div class="other">
                            <div class="time">编写于 {{ turnTime(postDetail.updateTime) }}</div>
                            <div class="tag" v-if="postDetail.tags.length != 1">
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
                            <button class="attention" v-if="!isMyPost">关注</button>
                        </div>
                    </header>
                    <section class="detail-section">
                        <div v-html="postDetail.text"></div>
                    </section>
                    <footer class="detail-footer">
                        <div class="situation">
                            <div class="like">
                                <i class="iconfont icon-a-dianzan2"></i>
                                <div>点赞 {{ postDetail.likeCount }}</div>
                            </div>
                            <div class="remark">
                                <i class="iconfont icon-a-xiaoxi1"></i>
                                <div>评论 {{ postDetail.commentCount }}</div>
                            </div>
                            <div class="collect">
                                <i class="iconfont icon-xihuan02"></i>
                                <div>收藏</div>
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
                            <div @click="modifyPost()">修改帖子</div>
                            <div>删除帖子</div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Nav from '@/components/navigation.vue'
import CHeader from '@/components/header.vue'
import { get } from '@/utils/request'
import { useStore } from '@/store'
import { turnTime } from '@/utils/public'
import { ref, onMounted, computed } from 'vue'
import type { responseGetPost } from './utils'
import router from '@/router'

const store = useStore()
const myUserId = ref('')
const isShowSetting = ref(false)
const postDetail = ref<responseGetPost>({
    title: '',
    text: '',
    author: {
        userId: '',
        name: '',
        url: '',
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

const modifyPost = () => {
    const postId = location.href.split('/').pop()
    sessionStorage.setItem('postTitle', postDetail.value.title)
    sessionStorage.setItem('postContent', postDetail.value.text)
    router.push('/write/modify/' + postId)
}

const isMyPost = computed(() => {
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
}

const getMyUserId = () => {
    const type = store.getLoginType()
    if (type === 1) {
        myUserId.value = sessionStorage.getItem('UserId') as string
    }
    else if (type === 2) {
        myUserId.value = localStorage.getItem('UserId') as string
    }
    else {
        myUserId.value = ''
    }
}

const getPost = () => {
    const postId = location.href.split('/').pop()
    const url = '/content/getPost?postId=' + postId
    get(url)
    .then((res: any) => {
        getMyUserId()
        postDetail.value = res as responseGetPost
        console.log(postDetail.value);
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
        width: 100%;
        margin-left: 80px;
        padding-bottom: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        overflow-x: hidden;

        .cheader {
            width: 100%;
            height: 70px;
        }

        .detail-box {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .detail {
                min-width: 700px;
                max-width: 1000px;
                background-color: #fff;
                padding: 20px 30px;

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
                        .remark,
                        .collect,
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
                    }
                }
            }
        }
    }
}
</style>