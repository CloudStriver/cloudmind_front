import { ref } from 'vue'
import { get } from '@/utils/request'
import {
    GetHotRanksUrl,
    TargetType
} from '@/utils/consts'
import type {HotComment, HotPost, HotUser} from "@/utils/type";
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

export const getCommentRankList = async(limit: number, offset: number) => {
    const rankList = ref<HotComment[]>([])
    await get(false, `${GetHotRanksUrl}?targetType=${TargetType.Comment}&limit=${limit}&offset=${offset}`)
        .then((res: any) => {
            if (res.comments) {
                rankList.value = res.comments
            }
        })
    return rankList.value
}

export const enterPost = async (id: string) => {
    await router.push('/post/' + id)
}