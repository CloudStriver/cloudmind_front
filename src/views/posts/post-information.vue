<template>
    <div class="information-box">
        <div class="detial-box">
            <span 
                class="row"
                v-if="!props.information.liked"
                @click="CreateRelation({
                    toId: props.information.postId,
                    toType: TargetType.Post,
                    relationType: RelationType.Like,
                })"
            >
                <i class="iconfont icon-a-dianzan2"></i>
                <div>点赞 {{ props.information.likeCount }}</div>
            </span>
            <span
                class="row liked"
                v-else
                @click="DeleteRelation({
                    toId: props.information.postId,
                    toType: TargetType.Post,
                    relationType: RelationType.Like,
                })"
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
                <button>{{ tag.value }}</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import {RelationType, TargetType} from "@/utils/consts";
import {CreateRelation, DeleteRelation} from "@/utils/api";
import type {Tag} from "@/utils/type";

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
        tags: Tag[];
    }
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