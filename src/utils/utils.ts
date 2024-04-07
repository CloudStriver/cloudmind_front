
import {CreateRelation, DeleteRelation} from "@/utils/api";
import {
    GetLatestRecommendUrl,
    GetPopularRecommendUrl,
    GetRecommendByUserUrl,
    RelationType,
    TargetType
} from "@/utils/consts";
import type {HotUser, Post, User} from "@/utils/type";
import {get} from "@/utils/request";
import {ref} from "vue";

export const turnTime = (time: number) => {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export const unFollowHotUser = (user: HotUser) => {
    DeleteRelation({
        toId: user.userId,
        toType: TargetType.User,
        relationType: RelationType.Follow,
    }).then(() => {
        user.followed = false
    })
}

export const followHotUser = (user: HotUser) => {
    CreateRelation({
        toId: user.userId,
        toType: TargetType.User,
        relationType: RelationType.Follow,
    }).then(() => {
        user.followed = true
    })
}

export const unFollowUser = (user: User) => {
    DeleteRelation({
        toId: user.userId,
        toType: TargetType.User,
        relationType: RelationType.Follow,
    }).then(() => {
        user.followed = false
        user.followedCount --
    })
}

export const followUser = (user: User) => {
    CreateRelation({
        toId: user.userId,
        toType: TargetType.User,
        relationType: RelationType.Follow,
    }).then(() => {
        user.followed = true
        user.followedCount ++
    })
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

export const unCollectPost = (post: Post) => {
    DeleteRelation({
        toId: post.postId,
        toType: TargetType.Post,
        relationType: RelationType.Collect,
    }).then(() => {
        // post.liked = false
        // post.likeCount --
    })
}

export const collectPost = (post: Post) => {
    CreateRelation({
        toId: post.postId,
        toType: TargetType.Post,
        relationType: RelationType.Collect,
    }).then(() => {
        // post.liked = true
        // post.likeCount ++
    })
}

export const getPostRecommend = async (mainClassify: string, classifyNum: TargetType) => {
    const postList = ref<Post[]>([])
    await get(false, getRecommendUrl(mainClassify, classifyNum))
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


export const getUserRecommend = async (mainClassify: string, classifyNum: number) => {
    const userList = ref<User[]>([])
    await get(false, getRecommendUrl(mainClassify, classifyNum))
        .then((res: any) => {
            userList.value = res.recommends.users.map((user: any) => ({
                userId: user.userId,
                name: user.name,
                url: user.url,
                description: user.description,
                followedCount: user.followedCount,
                labels: user.labels,
                followed: user.followed
            }))
        })
    return userList.value
}


const getRecommendUrl = (mainClassify: string, classifyNum: number) => {
    const url = ref('')
    if (mainClassify === 'hot') {
        url.value = `${GetPopularRecommendUrl}?category=${classifyNum}`
    }
    else if (mainClassify === 'new') {
        url.value = `${GetLatestRecommendUrl}?category=${classifyNum}`
    }
    else {
        url.value = `${GetRecommendByUserUrl}?category=${classifyNum}`
    }
    return url.value
}