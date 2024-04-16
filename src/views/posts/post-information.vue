<template>
    <div class="information-box">
        <div class="detial-box">
            <span 
                class="row"
                v-if="!props.PostInfo.liked"
                @click="likePost(props.PostInfo)"
            >
                <i class="iconfont icon-a-dianzan2"></i>
                <div>点赞 {{ props.PostInfo.likeCount }}</div>
            </span>
            <span
                class="row liked"
                v-else
                @click="unLikePost(props.PostInfo)"
            >
                <i class="iconfont icon-a-dianzan2"></i>
                <div>已点赞 {{ props.PostInfo.likeCount }}</div>
            </span>
            <span
                class="row"
            >
                <i class="iconfont icon-a-xiaoxi1"></i>
                <div>评论 {{ props.PostInfo.commentCount }}</div>
            </span>
            <span class="row">
                <i class="iconfont icon-liulanliang"></i>
                <div>浏览量 {{ props.PostInfo.viewCount }}</div>
            </span>
<!--            <span class="row">-->
<!--                <i class="iconfont icon-fenxiang"></i>-->
<!--            </span>-->
        </div>
        <div class="tag-box">
            <div
                class="tag"
                v-for="(label, index) in props.PostInfo.labels"
                :key="index"
            >
                <button @click="router.push(`/search/${label.value}/post/${SearchSortType.Synthesis}/${SearchPeriodType.None}`)">{{ label.value }}</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {Post} from "@/utils/type";
import {likePost, unLikePost} from "@/utils/utils";
import router from "@/router";
import {SearchPeriodType, SearchSortType} from "@/utils/consts";

const props = defineProps<{
  PostInfo: Post
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
                cursor: pointer;
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