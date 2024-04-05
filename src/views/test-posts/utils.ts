import { ref } from 'vue'
import { get } from '@/utils/request'
import { 
    type HotUser,
    type HotPost,
    type Post,
    type Zone,
} from './type'

import {
    CategoryType,
    GetHotRanksUrl,
    GetPopularRecommendUrl, GetPostsUrl,
    GetRecommendByUserUrl,
    GetZonesUrl, RelationType,
    TargetType
} from '@/utils/consts'
import {CreateRelation, DeleteRelation} from "@/utils/api";


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
export const getNewPostList = async () => {
    const postsList = ref<Post[]>([])
    await get(false, GetPostsUrl)
    .then((res: any) => {
        postsList.value =  res.posts.map((post: any) => ({
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

// 获取分区列表
export const getZoneList = async (fatherId: string, limit: number, offset: number)  => {
    const rankList = ref<Zone[]>([])
    await get(false, `${GetZonesUrl}?fatherId=${fatherId}&limit=${limit}&offset${offset}`)
        .then((res: any) => {
            if (res.zones) {
                rankList.value = res.zones.map((zone: any) => ({
                            zoneId: zone.id,
                            value: zone.value,
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
                tags: post.tags,
                likeCount: post.likeCount,
                commentCount: post.commentCount,
                liked: post.liked,
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
                tags: post.tags,
                likeCount: post.likeCount,
                commentCount: post.commentCount,
                liked: post.liked,
                userName: post.userName
            }))
        })
    return postList.value
}

export const getFollowPostList = async () => {
    const postList = ref<Post[]>([])
    // await get('/content/getRecommendByUser?category=' + CategoryType.PostCategory)
    //     .then((res: any) => {
    //         postList.value = res.recommends.posts.map((post: any) => ({
    //             postId: post.postId,
    //             title: post.title,
    //             text: post.text,
    //             url: post.url,
    //             tags: post.tags,
    //             likeCount: post.likeCount,
    //             commentCount: post.commentCount,
    //             liked: post.liked,
    //             userName: post.userName
    //         }))
    //     })
    return postList.value
}

export const unLikePost = (post: Post) => {
    DeleteRelation({
        toId: post.postId,
        toType: TargetType.Post,
        relationType: RelationType.Like,
    }).then(() => {
        post.liked = false
        post.likeCount --
    })
}

export const likePost = (post: Post) => {
    CreateRelation({
        toId: post.postId,
        toType: TargetType.Post,
        relationType: RelationType.Like,
    }).then(() => {
        post.liked = true
        post.likeCount ++
    })
}


export const unFollowUser = (user: HotUser) => {
    DeleteRelation({
        toId: user.userId,
        toType: TargetType.User,
        relationType: RelationType.Follow,
    }).then(() => {
        user.followed = false
    })
}

export const followUser = (user: HotUser) => {
    CreateRelation({
        toId: user.userId,
        toType: TargetType.User,
        relationType: RelationType.Follow,
    }).then(() => {
        user.followed = false
    })
}