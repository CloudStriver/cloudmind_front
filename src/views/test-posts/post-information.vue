<template>
    <div class="information-box">
        <div class="detial-box">
            <span 
                class="row"
                v-if="!Post.liked"
                @click="likePost(Post)"
            >
                <i class="iconfont icon-a-dianzan2"></i>
                <div>点赞 {{ Post.likeCount }}</div>
            </span>
            <span
                class="row liked"
                v-else
                @click="unLikePost(Post)"
            >
                <i class="iconfont icon-a-dianzan2"></i>
                <div>已点赞 {{ Post.likeCount }}</div>
            </span>
            <span
                class="row"
            >
                <i class="iconfont icon-a-xiaoxi1"></i>
                <div>评论 {{ Post.commentCount }}</div>
            </span>
            <span class="row">
                <i class="iconfont icon-gengduo"></i>
            </span>
        </div>
        <div class="tag-box">
            <div
                class="tag"
                v-for="(tag, index) in Post.tags"
                :key="index"
            >
                <button>{{ tag.value }}</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {Post, Tag} from "@/views/test-posts/type";
import {likePost, unLikePost} from "@/views/test-posts/utils";

const props = defineProps<{
  Post: Post
}>();
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