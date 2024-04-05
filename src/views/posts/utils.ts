import { ref } from 'vue'
import { get } from '@/utils/request'
import {GetPostsUrl} from "@/utils/consts";
import type {Tag} from "@/views/test-posts/type";

export interface responseGetOtherPosts {
    posts: {
        postId: string;
        title: string;
        text: string;
        url: string;
        userName: string;
        likeCount: number;
        liked: boolean;
        commentCount: number;
        tags: Tag[];
    }[]
}

export interface responseGetPost {
    postId: string,
    title: string,
    text: string,
    url:string,
    author: {
        userId: string,
        name: string,
        url: string,
        followed: boolean
    }
    tags: string[],
    viewCount: number,
    likeCount: number,
    commentCount: number,
    shareCount: number,
    collectCount: number,
    liked: boolean,
    collected: boolean,
    createTime: number,
    updateTime: number,
}

export const getOtherPosts = async () => {
    const postsList = ref<responseGetOtherPosts>({
        posts: []
    })
    await get(false, GetPostsUrl)
    .then((res: any) => {
        postsList.value = {
            posts: res.posts.map((post: any) => ({
                postId: post.postId,
                title: post.title,
                text: post.text,
                url: post.url,
                tags: post.tags,
                likeCount: post.likeCount,
                commentCount: post.commentCount,
                liked: post.liked,
                userName: post.userName
            }))
        }
    })
    return postsList.value
}

export const getTagsList = async(key: string) =>{
    const url = '/label/getLabels?key=' + key
    const tagsList = ref<string[]>([])
    await get(false, url).then((res: any) => {
        tagsList.value = res.labels.map((label: any) => label.value)
    })
    return tagsList.value
}

// export const cancelRelation = (thisPost: any, toType: number, relationType: number) => {
//     post('/relation/deleteRelation', {
//         toId: thisPost.postId,
//         toType,
//         relationType,
//     })
//     .then(() => {
//         if (relationType === 1) {
//             thisPost.liked = false
//             thisPost.likeCount --
//         }
//         else if (relationType === 3) {
//             thisPost.collected = false
//         }
//     })
// }
//
// export const createRelation = (thisPost: any, toType: number, relationType: number) => {
//     const longToken = store.getUserLongToken()
//     if (!longToken) {
//         errorMsg('请先登录')
//         return
//     }
//     post('/relation/createRelation', {
//         toId: thisPost.postId,
//         toType,
//         relationType,
//     })
//     .then(() => {
//         if (relationType === 1) {
//             thisPost.liked = true
//             thisPost.likeCount ++
//         }
//         else if (relationType === 3) {
//             thisPost.collected = true
//         }
//     })
// }