<template>
    <div class="main-box">
        <CHeader class="cheader"></CHeader>
        <div class="contents">
            <section class="section">
                <div class="notification-box">
                    <div class="section-top">
                        <div class="notifications">
                            <div style="font-size: 22px; font-weight: 700;">通知中心</div>
                            <div class="notification"></div>
                        </div>
                        <div class="classify">
                            <div>
                                <input 
                                    type="radio" 
                                    name="select"
                                    id="all"
                                    v-model="select"
                                    value="all"
                                    checked
                                >
                                <label for="all">全部</label>
                            </div>
                            <div>
                                <input 
                                    type="radio" 
                                    name="select"
                                    id="like"
                                    v-model="select"
                                    value="like"
                                >
                                <label for="like">点赞</label>
                            </div>
                            <div>
                                <input 
                                    type="radio" 
                                    name="select"
                                    id="follow"
                                    v-model="select"
                                    value="follow"
                                >
                                <label for="follow">关注</label>
                            </div>
                            <div>
                                <input 
                                    type="radio" 
                                    name="select"
                                    id="collect"
                                    v-model="select"
                                    value="collect"
                                >
                                <label for="collect">收藏</label>
                            </div>
                            <div>
                                <input 
                                    type="radio" 
                                    name="select"
                                    id="comment"
                                    v-model="select"
                                    value="comment"
                                >
                                <label for="comment">评论</label>
                            </div>
                            <div>
                                <input 
                                    type="radio" 
                                    name="select"
                                    id="share"
                                    v-model="select"
                                    value="share"
                                >
                                <label for="share">分享</label>
                            </div>
                        </div>
                    </div>
                    <div class="section-bottom">
                        <div
                            v-for="(item, index) in storageNotificationList[select]"
                            :key="index"
                        >
                            <div class="notification-detail" v-if="item.type === 1">
                                <div class="svg-like">
                                    <i class="iconfont icon-a-dianzan2"></i>
                                </div>
                                <div class="content">
                                    <div class="content-top">
                                        <div class="user">{{ item.fromName }}</div>
                                        <div>赞了</div>
                                        <div>你的</div>
                                        <div>帖子</div>
                                    </div>
                                    <router-link 
                                        to="/post/1"
                                        class="content-section"
                                    >{{ item.toName }}</router-link>
                                    <div class="content-bottom">{{ turnTime(item.createTime) }}</div>
                                </div>
                            </div>
                            <div class="notification-detail" v-if="item.type === 5">
                                <div class="svg-comment">
                                    <i class="iconfont icon-a-xiaoxi1"></i>
                                </div>
                                <div class="content">
                                    <div class="content-top">
                                        <div class="user">{{ item.fromName }}</div>
                                        <div>评论了</div>
                                        <div>你的</div>
                                        <div>帖子</div>
                                    </div>
                                    <router-link 
                                        to="/post/1"
                                        class="content-section"
                                    >{{ item.toName }}</router-link>
                                    <div class="content-bottom">{{ turnTime(item.createTime) }}</div>
                                </div>
                            </div>
                            <div class="notification-detail" v-if="item.type === 3">
                                <div class="svg-collect">
                                    <i class="iconfont icon-shoucang01"></i>
                                </div>
                                <div class="content">
                                    <div class="content-top">
                                        <div class="user">{{ item.fromName }}</div>
                                        <div>收藏了</div>
                                        <div>你的</div>
                                        <div>帖子</div>
                                    </div>
                                    <router-link 
                                        to="/post/1"
                                        class="content-section"
                                    >{{ item.toName }}</router-link>
                                    <div class="content-bottom">{{ turnTime(item.createTime) }}</div>
                                </div>
                            </div>
                            <div class="notification-detail" v-if="item.type === 4">
                                <div class="svg-share">
                                    <i class="iconfont icon-fenxiang"></i>
                                </div>
                                <div class="content">
                                    <div class="content-top">
                                        <div class="user">{{ item.fromName }}</div>
                                        <div>分享了</div>
                                        <div>你的</div>
                                        <div>帖子</div>
                                    </div>
                                    <router-link 
                                        to="/post/1"
                                        class="content-section"
                                    >{{ item.toName }}</router-link>
                                    <div class="content-bottom">{{ turnTime(item.createTime) }}</div>
                                </div>
                            </div>
                            <div class="notification-detail" v-if="item.type === 2">
                                <div class="svg-follow">
                                    <i class="iconfont icon-guanzhu"></i>
                                </div>
                                <div class="content">
                                    <div class="content-top">
                                        <div class="user">{{ item.fromName }}</div>
                                        <div>关注了</div>
                                        <div>你</div>
                                    </div>
                                    <div class="content-bottom">{{ turnTime(item.createTime) }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="hint">暂无更多</div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import CHeader from '@/components/header.vue'
import { ref, onMounted, watch } from 'vue'
import { turnTime } from '@/utils/public'
import { getNotifications } from './utils'
import type { ResponseGetNotification } from './utils'

const select = ref<string>('all')
const notificationList = ref<any>([])
const storageNotificationList = ref<any>({
    all: ref<ResponseGetNotification[]>([]),
    like: ref<ResponseGetNotification[]>([]),
    follow: ref<ResponseGetNotification[]>([]),
    collect: ref<ResponseGetNotification[]>([]),
    comment: ref<ResponseGetNotification[]>([]),
    share: ref<ResponseGetNotification[]>([])
})

onMounted(async() => {
    getNotificationList()
})

watch(select, (newVal) => {
    console.log(newVal);
    getNotificationList()
})

const getNotificationList = async() => {
    const type = turnNotificationType(select.value)
    if (storageNotificationList.value[select.value].length === 0) {
        notificationList.value = []
        notificationList.value.push(await getNotifications(type))
        storageNotificationList.value[select.value].push(...notificationList.value[0])
    }
    else {
        notificationList.value = []
        notificationList.value.push(storageNotificationList.value[select.value])
    }
}

const turnNotificationType = (type: string): number => {
    switch (type) {
        case 'like':
            return 1
        case 'follow':
            return 2
        case 'collect':
            return 3
        case 'share':
            return 4
        case 'comment':
            return 5
        default: 
            return 0
    }
}
</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .cheader {
        height: 80px;
    }

    .contents {
        height: 100%;
        padding-top: 10px;
        background-color: rgba(240, 245, 255, 1);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;

        .section {
            width: 100%;
            padding-left: 20%;
            padding-right: 20%;
            padding-bottom: 20px;
            flex: 1;
            display: flex;
            justify-content: center;

            .notification-box {
                width: 100%;
                display: flex;
                flex-direction: column;

                .section-top {
                    height: 80px;
                    background-color: #fff;
                    box-shadow: 0 0 10px 0 #0000001a;
                    padding: 0 20px 0;
                    margin-bottom: 3px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .classify {
                        display: flex;

                        div {
                            margin-right: 20px;

                            label {
                                cursor: pointer;
                                user-select: none;
                            }
                            label:hover {
                                color: #d6e0ed;
                            }

                            input {
                                display: none;
                            }
                            input:checked + label {
                                color: #8eaedc;
                                font-weight: 700;
                            }
                        }
                    }

                    .notifications {
                        position: relative;
                        display: flex;
                        align-items: center;

                        .notification {
                            background-color: #762222;
                        }
                    }
                }

                .section-bottom {
                    width: 100%;
                    flex: 1;
                    background-color: #fff;
                    box-shadow: 0 0 10px 0 #0000001a;
                    padding: 0 20px;

                    .notification-detail {
                        width: 100%;
                        height: 100px;
                        border-bottom: 1px solid #f0f0f0;
                        display: flex;
                        align-items: center;

                        .svg-like {
                            width: 55px;
                            height: 55px;
                            background-color: #fff;
                            margin-right: 20px;
                            border-radius: 50%;
                            box-shadow: 2px 2px 1px 1px #fcc4c43c;
                            background-color: #fcc4c4a8;
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            i {
                                font-size: 20px;
                                color: #0000006f;
                                font-weight: 700;
                            }
                        }
                        .svg-comment {
                            width: 55px;
                            height: 55px;
                            background-color: #95c5ff86;
                            margin-right: 20px;
                            border-radius: 50%;
                            box-shadow: 2px 2px 1px 1px #95c5ff3a;
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            i {
                                font-size: 20px;
                                color: #0000006f;
                                font-weight: 700;
                            }
                        }

                        .svg-collect {
                            width: 55px;
                            height: 55px;
                            background-color: #fbc97a86;
                            margin-right: 20px;
                            border-radius: 50%;
                            box-shadow: 2px 2px 1px 1px #fbc97a3c;
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            i {
                                font-size: 20px;
                                color: #0000006f;
                                font-weight: 700;
                            }
                        }

                        .svg-share {
                            width: 55px;
                            height: 55px;
                            background-color: #8eaedc86;
                            margin-right: 20px;
                            border-radius: 50%;
                            box-shadow: 2px 2px 1px 1px #8eaedc3c;
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            i {
                                font-size: 20px;
                                color: #0000006f;
                                font-weight: 700;
                            }
                        }

                        .svg-follow {
                            width: 55px;
                            height: 55px;
                            background-color: #fbba52bf;
                            margin-right: 20px;
                            border-radius: 50%;
                            box-shadow: 2px 2px 1px 1px #fbc97a3c;
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            i {
                                font-size: 18px;
                                color: #0000006f;
                                font-weight: 700;
                            }
                        }

                        .content {
                            display: flex;
                            flex-direction: column;

                            .content-top {
                                display: flex;
                                color: #929292;
                                font-size: 13px;
                                margin-bottom: 5px;

                                .user {
                                    color: #000;
                                    margin-right: 5px;
                                    cursor: pointer;
                                }
                            }

                            .content-section {
                                text-decoration: none;
                                color: #000;
                                font-size: 15px;
                                font-weight: 700;
                                margin-bottom: 5px;
                                cursor: pointer;
                            }
                            .content-section:hover {
                                color: #8eaedc;
                            }

                            .content-bottom {
                                font-size: 12px;
                                color: #929292;
                            }
                        }
                    }

                    .hint {
                        width: 100%;
                        margin: 20px 0;
                        color: #929292;
                        text-align: center;
                    }
                }
            }
        }

    }
}
</style>