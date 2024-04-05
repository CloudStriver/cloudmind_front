import type {Tag} from "@/views/test-posts/type";
import {RelationType, TargetType} from "@/utils/consts";
import {CreateRelation, DeleteRelation} from "@/utils/api";

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


export const judgeType = (type: string) => {
    switch (type) {
        case 'user':
            return 'Users'
        case 'file':
            return 'Files'
        case 'goods':
            return 'Goods'
        case 'posts':
            return 'Posts'
    }
}
export const trunNum = (type: string) => {
    switch (type) {
        case 'Users':
            return 1
        case 'Files':
            return 2
        case 'Goods':
            return 4
        case 'Posts':
            return 3
    }
}

export const followUser = (user: User) => {
    CreateRelation({
        toId: user.userId,
        toType: TargetType.User,
        relationType: RelationType.Follow,
    })
        .then(() => {
            user.followed = true
            user.followedCount ++
        })
}

export const unFollowUser = (user: User) => {
    DeleteRelation({
        toId: user.userId,
        toType: TargetType.User,
        relationType: RelationType.Follow,
    })
        .then(() => {
            user.followed = false
            user.followedCount --
        })
}