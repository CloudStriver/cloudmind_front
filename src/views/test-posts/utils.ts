import { ref } from 'vue'
import { useStore } from '@/store'
import { errorMsg } from '@/utils/message'
import { get, post } from '@/utils/request'

const store = useStore()

export interface HotUser {
    userId: string
    name: string
    url: string
    description: string
    followed: boolean
}

export interface HotPost {
    postId: string
    title: string
}

export interface Zone {
    zoneId: string
    value: string
}

export interface responseGetOtherPosts {
    posts: {
        postId: string,
        title: string,
        text: string,
        url: string,
        tags: string[],
        likeCount: number,
        commentCount: number,
        liked: boolean,
        userName: string,
    }[]
}

export const getUserRankList = async (limit: number, offset: number)  => {
    const rankList = ref<HotUser[]>([])
    await get('/rank/getHotRanks?targetType=1&limit=' + limit + "&offset=" + offset)
    .then((res: any) => {
        if (res.users) {
            rankList.value =
                res.users.map((user: any) => ({
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

export const getOtherPosts = async () => {
    const postsList = ref<responseGetOtherPosts>({
        posts: []
    })
    await get('/content/getPosts')
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

export const getPostRankList = async (limit: number, offset: number)  => {
    const rankList = ref<HotPost[]>([])
    await get('/rank/getHotRanks?targetType=3&limit=' + limit + "&offset=" + offset)
        .then((res: any) => {
            if (res.posts) {
                rankList.value =
                    res.posts.map((post: any) => ({
                            postId: post.postId,
                            title: post.title,
                        }
                    ))
            }
        })
    return rankList.value
}

export const getZoneList = async (fatherId: string, limit: number, offset: number)  => {
    const rankList = ref<Zone[]>([])
    await get('/content/getZones?fatherId=' + fatherId + '&limit=' + limit + "&offset=" + offset)
        .then((res: any) => {
            console.log(res);
            
            if (res.zones) {
                rankList.value =
                    res.zones.map((zone: any) => ({
                            zoneId: zone.id,
                            value: zone.value,
                        }
                    ))
            }
        })
    return rankList.value
}

export const cancelRelation = (thisPost: any, toType: number, relationType: number) => {
    post('/relation/deleteRelation', {
        toId: thisPost.postId,
        toType,
        relationType,
    })
    .then(() => {
        if (relationType === 1) {
            thisPost.liked = false
            thisPost.likeCount --
        }
        else if (relationType === 3) {
            thisPost.collected = false
        }
    })
}

export const createRelation = (thisPost: any, toType: number, relationType: number) => {
    const longToken = store.getUserLongToken()
    if (!longToken) {
        errorMsg('请先登录')
        return
    }
    post('/relation/createRelation', {
        toId: thisPost.postId,
        toType,
        relationType,
    })
    .then(() => {
        if (relationType === 1) {
            thisPost.liked = true
            thisPost.likeCount ++
        }
        else if (relationType === 3) {
            thisPost.collected = true
        }
    })
}