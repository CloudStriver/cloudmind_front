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
            if (res.zones) {
                rankList.value =
                    res.zones.map((zone: any) => ({
                            zoneId: zone.zoneId,
                            value: zone.value,
                        }
                    ))
            }
        })
    return rankList.value
}