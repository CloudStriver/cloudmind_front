import {
    RelationType,
    TargetType
} from "@/utils/consts";

export type Relation = {
    fromId?: string,
    fromType?: TargetType,
    toId?: string,
    toType?: TargetType,
    relationType: RelationType,
}

export type HotUser =  {
    userId: string
    name: string
    url: string
    description: string
    followed: boolean
}

export  type User = {
    userId: string
    name: string
    url: string
    description: string
    followedCount: number
    labels: string[]
    followed: boolean
}

export type Post = {
    postId: string
    title: string
    text: string
    url: string
    likeCount: number
    commentCount: number
    viewCount: number
    liked: boolean
    labels: Label[]
    userName: string
}

export type PostDetail = {
    title: string,
    text: string,
    status: number,
    url: string,
    author: {
        userId: string,
        name: string,
        url: string
        labels: Label[],
        followed: boolean,
        followedCount: number,
        description: string,
        likedCount: number,
        postCount: number,
    },
    labels: [],
    viewCount: number,
    likeCount: number,
    commentCount: number,
    shareCount: number,
    collectCount: number,
    liked: boolean,
    collected: boolean,
    createTime: number,
    updateTime: number
}

export type HotPost =  {
    postId: string
    title: string
}


export type Label = {
    id: string,
    fatherId: string
    value: string,
}


export type Notification =  {
    fromName: string
    fromId: string
    toName: string
    toId: string
    toUserId: string
    type: number
    createTime: number
}

export type PostInfo = {
    title: string
    text: string
    url: string
    labels: Label[]
    status: number,
    isSure: boolean
}