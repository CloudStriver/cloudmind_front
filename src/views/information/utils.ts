import {useStore} from "@/store"
import {get, post} from "@/utils/request"
import {ref} from "vue"
import {GetUserDetailUrl, GetUserUrl, RelationType, StorageAvatarUrl, TargetType, UpdateUserUrl} from "@/utils/consts";
import {GetFromRelation, GetToRelation} from "@/utils/api";
import type {Post, User} from "@/utils/type";

const store = useStore()

//获取个人信息
export const getUserDetail = async() => {
    const detail = ref({
        name: '',
        sex: '',
        description: '',
        avatar: '',
        tags: [],
        fullName: '',
        idCard: '',
    })
    await get(false, GetUserDetailUrl)
    .then((res: any) => {
        detail.value.name = res.name
        detail.value.sex = res.sex === 1 ? '男' : '女'
        detail.value.fullName = res.fullName === '' ? '未填写' : res.fullName
        detail.value.idCard = res.idCard === '' ? '未填写' : res.idCard
        detail.value.description = res.description === '' ? '未填写' : res.description
        detail.value.avatar = res.url
        detail.value.tags = res.tags
        if (store.getLoginType() === 1) {
            sessionStorage.setItem(StorageAvatarUrl, detail.value.avatar)
        }
        else {
            localStorage.setItem(StorageAvatarUrl, detail.value.avatar)
        }
        store.setUserDetail(detail.value.name, detail.value.sex, detail.value.description, detail.value.avatar)
    })
    return detail.value
}

//获取用户信息
export const getUserInfo = async (userId: string) => {
    const detail = ref({
        name: '',
        sex: '',
        description: '',
        avatar: '',
        tags: [],
        followed: false,
        followedCount: 0,
        followCount: 0,
        createTime: 0,
    })
    await get(false, `${GetUserUrl}?userId=${userId}`)
        .then((res: any) => {
            detail.value.name = res.name
            detail.value.sex = res.sex === 1 ? '男' : '女'
            detail.value.description = res.description === '' ? '未填写' : res.description
            detail.value.avatar = res.url
            detail.value.tags = res.tags === '' ? [] : res.tags
            detail.value.followCount = res.followCount
            detail.value.followedCount = res.followedCount
            detail.value.followed = res.followed
            detail.value.createTime = res.createTime
        })
    return detail.value
}
export const updateUser = async (name?: String, fullName?:String, url?:String, sex?:number, idCard?:String,description?:String) => {
    await post(true, UpdateUserUrl, {
        name: name,
        fullName: fullName,
        url: url,
        sex: sex,
        idCard: idCard,
        description: description
    });
}

export const getFollowUserList = async (userId: string) => {
    const followUserList = ref<User[]>([])
    await GetFromRelation({
        fromId: userId,
        fromType: TargetType.User,
        toType: TargetType.User,
        relationType: RelationType.Follow,
    })
    .then((res:any)=>{
            followUserList.value = res.users.map((user: any) => ({
                userId: user.userId,
                name: user.name,
                url: user.url,
                description: user.description,
                followedCount: user.followedCount,
                labels: user.tags,
                followed: user.followed,
            }))
    })
    return followUserList.value
}

export const getFollowedUserList = async (userId: string) => {
    const followedUserList = ref<User[]>([])
    await GetToRelation({
        toId: userId,
        toType: TargetType.User,
        fromType: TargetType.User,
        relationType: RelationType.Follow,
    })
        .then((res:any)=>{
            followedUserList.value = res.users.map((user: any) => ({
                userId: user.userId,
                name: user.name,
                url: user.url,
                description: user.description,
                followedCount: user.followedCount,
                labels: user.tags,
                followed: user.followed,
            }))
        })
    return followedUserList.value
}


export const getPostList = async (userId: string) => {
    const postList = ref<Post[]>([])
    await GetFromRelation({
        fromId: userId,
        fromType: TargetType.User,
        toType: TargetType.Post,
        relationType: RelationType.Publish,
    })
        .then((res:any)=>{
            postList.value = res.posts.map((post: any) => ({
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

export const getCollectPostList = async (userId: string) => {
    const collectPostList = ref<Post[]>([])
    await GetFromRelation({
        fromId: userId,
        fromType: TargetType.User,
        toType: TargetType.Post,
        relationType: RelationType.Collect,
    })
        .then((res:any)=>{
            collectPostList.value = res.posts.map((post: any) => ({
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
    return collectPostList.value
}

export const getLikePostList = async (userId: string) => {
    const likePostList = ref<Post[]>([])
    await GetFromRelation({
        fromId: userId,
        fromType: TargetType.User,
        toType: TargetType.Post,
        relationType: RelationType.Like,
    })
        .then((res:any)=>{
            likePostList.value = res.posts.map((post: any) => ({
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
    return likePostList.value
}
