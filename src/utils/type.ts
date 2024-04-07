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
    tags: Tag[]
    likeCount: number
    commentCount: number
    liked: boolean
    userName: string
}

export type HotPost =  {
    postId: string
    title: string
}

export type Zone =  {
    zoneId: string
    value: string
}


export type Tag = {
    tagId: string,
    zoneId: string,
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