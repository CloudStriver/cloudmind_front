<template>
    <div class="information-box">
        <div class="detial-box">
            <span 
                class="row"
                v-if="!props.information.liked"
                @click="likePost(props.information)"
            >
                <i class="iconfont icon-a-dianzan2"></i>
                <div>点赞 {{ props.information.likeCount }}</div>
            </span>
            <span
                class="row liked"
                v-else
                @click="cancelLikePost(props.information)"
            >
                <i class="iconfont icon-a-dianzan2"></i>
                <div>已点赞 {{ props.information.likeCount }}</div>
            </span>
            <span
                class="row"
            >
                <i class="iconfont icon-a-xiaoxi1"></i>
                <div>评论 {{ props.information.commentCount }}</div>
            </span>
            <span class="row">
                <i class="iconfont icon-gengduo"></i>
            </span>
        </div>
        <div class="tag-box">
            <div
                class="tag"
                v-for="(tag, index) in props.information.tags"
                :key="index"
            >
                <button>{{ tag }}</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { post } from '@/utils/request'
import { errorMsg } from '@/utils/message'

const store = useStore()
const props = defineProps<{
    information: {
        postId: string;
        title: string;
        text: string;
        url: string;
        userName: string;
        likeCount: number;
        liked: boolean;
        commentCount: number;
        tags: string[];
    }
}>();

const cancelLikePost = (thisPost: any) => {
    post('/relation/deleteRelation', {
        toId: thisPost.postId,
        toType: 4,
        relationType: 1
    })
    .then(() => {
        thisPost.liked = false
        thisPost.likeCount --
    })
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
.information-box {
    display: flex;
    justify-content: space-between;

    .detial-box {
        display: flex;

        .row {
            display: flex;
            align-items: center;
            margin-right: 15px;
            cursor: pointer;

            i {
                font-size: 20px;
                margin-right: 5px;
            }
        }

        .liked {
            color: #6d99ec;
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
            }
        }
    }
}
</style>