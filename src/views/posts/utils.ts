import { ref } from 'vue'
import { get } from '@/utils/request'
import {
    CategoryType,
    GetHotRanksUrl,
    GetPopularRecommendUrl, GetPostsUrl,
    GetRecommendByUserUrl, GetRelationPathsUrl,
     RelationType,
    TargetType
} from '@/utils/consts'
import type {HotPost, HotUser, Post} from "@/utils/type";
import router from "@/router";


// 获取作者排行榜
export const getUserRankList = async (limit: number, offset: number)  => {
    const rankList = ref<HotUser[]>([])
    await get(false, `${GetHotRanksUrl}?targetType=${TargetType.User}&limit=${limit}&offset=${offset}`)
    .then((res: any) => {
        if (res.users) {
            rankList.value = res.users.map((user: any) => ({
                        userId: user.userId,
                        name: user.name,
                        url: user.url,
                        description: user.description,
                        followed: user.followed,
                    }
                )) 
        }
    })
    return rankList.value
}

// 获取最新的帖子列表
export const getNewPostList = async (onlyLabelId?: string) => {
    const postsList = ref<Post[]>([])
    const url = ref(GetPostsUrl)
    if(onlyLabelId) url.value += `?onlyLabelId=${onlyLabelId}`
    await get(false, url.value)
    .then((res: any) => {
        postsList.value =  res.posts.map((post: any) => ({
                postId: post.postId,
                title: post.title,
                text: post.text,
                url: post.url,
                likeCount: post.likeCount,
                labels: post.labels,
                commentCount: post.commentCount,
                viewCount: post.viewCount,
                liked: post.liked,
                userName: post.userName
            })) 
    })
    return postsList.value
}

// 获取文章排行榜
export const getPostRankList = async (limit: number, offset: number)  => {
    const rankList = ref<HotPost[]>([])
    await get(false, `${GetHotRanksUrl}?targetType=${TargetType.Post}&limit=${limit}&offset=${offset}`)
        .then((res: any) => {
            if (res.posts) {
                rankList.value = res.posts.map((post: any) => ({
                            postId: post.postId,
                            title: post.title,
                }))
            }
        })
    return rankList.value
}





export const getHotPostList = async () => {
    const postList = ref<Post[]>([]) // 帖子列表
    await get(false, `${GetPopularRecommendUrl}?category=${CategoryType.PostCategory}`)
    .then((res: any) => {
        postList.value = res.recommends.posts.map((post: any) => ({
                postId: post.postId,
                title: post.title,
                text: post.text,
                url: post.url,
                labels: post.labels,
                likeCount: post.likeCount,
                commentCount: post.commentCount,
                liked: post.liked,
                viewCount: post.viewCount,
                userName: post.userName
        }))
    })
    return postList.value
}

export const getRecommendPostList = async () => {
    const postList = ref<Post[]>([])
    await get(false, `${GetRecommendByUserUrl}?category=${CategoryType.PostCategory}`)
        .then((res: any) => {
            postList.value = res.recommends.posts.map((post: any) => ({
                postId: post.postId,
                title: post.title,
                text: post.text,
                url: post.url,
                labels: post.labels,
                likeCount: post.likeCount,
                commentCount: post.commentCount,
                viewCount: post.viewCount,
                liked: post.liked,
                userName: post.userName
            }))
        })
    return postList.value
}

export const getFollowPostList = async (limit: number, offset: number) => {
    const postList = ref<Post[]>([])
    await get(true, `${GetRelationPathsUrl}?relationType=${RelationType.Publish}&limit=${limit}&offset=${offset}`)
        .then((res: any) => {
            postList.value = res.posts.map((post: any) => ({
                postId: post.postId,
                title: post.title,
                text: post.text,
                url: post.url,
                labels: post.labels,
                likeCount: post.likeCount,
                commentCount: post.commentCount,
                viewCount: post.viewCount,
                liked: post.liked,
                userName: post.userName
            }))
        })
    return postList.value
}

export const enterPost = (id: string) => {
    router.push('/post/' + id)
}