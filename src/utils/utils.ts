
import {CreateRelation, DeleteRelation} from "@/utils/api";
import {
    CreatePostUrl,
    GetLatestRecommendUrl,
    GetPopularRecommendUrl, GetPostUrl, GetRecommendByItemUrl,
    GetRecommendByUserUrl, GetTagListUrl, PostStatusType,
    RelationType,
    TargetType, UpdatePostUrl
} from "@/utils/consts";
import type {HotUser, Label, Post, PostDetail, PostInfo, User, Comment} from "@/utils/type";
import {get, post} from "@/utils/request";
import {ref} from "vue";
import router from "@/router";

export const turnTime = (time: number | undefined) => {
    if (time) {
        const date = new Date(time);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    } else {
        return ""
    }
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
    console.log("!!!")
    console.log(mainClassify, classifyNum)
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

export const enterUser = (userId: string) => {
    router.push(`/user/center/${userId}/post/publish`)
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

export const getPostDetail = async (postId: string) => {
    const postDetail = ref<PostDetail>()
    await get(false, `${GetPostUrl}?postId=${postId}`, )
        .then((res:any) => {
            postDetail.value = {
                title: res.title,
                text: res.text,
                status: res.status,
                url: res.url,
                author: {
                    userId: res.author.userId,
                    name: res.author.name,
                    url: res.author.url,
                    labels: res.author.labels,
                    followed: res.author.followed,
                    followedCount: res.author.followedCount,
                    description: res.author.description,
                    likedCount: res.author.likedCount,
                    postCount: res.author.postCount,
                },
                labels: res.labels,
                viewCount: res.viewCount,
                likeCount: res.likeCount,
                commentCount: res.commentCount,
                shareCount: res.shareCount,
                collectCount: res.collectCount,
                liked: res.liked,
                collected: res.collected,
                createTime: res.createTime,
                updateTime: res.updateTime
            }
        })
    return postDetail.value
}

export const getPostRecommendByPostId = async (postId: string) => {
    const postList = ref<Post[]>([])
    await get(false, `${GetRecommendByItemUrl}?itemId=${postId}&category=${TargetType.Post}`)
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



export const getLabelList = async(fatherId: string, key?: string) =>{
    const labelList = ref<Label[]>([])
    if(!key) key = ""
    await get(false,  `${GetTagListUrl}?fatherId=${fatherId}&key=${key}`).then((res: any) => {
        labelList.value = res.labels.map((label: any) => ({
            id: label.id,
            value: label.value
        }))
    })
    console.log(labelList.value)
    return labelList.value
}

export const createPost = async (postInfo: PostInfo): Promise<any> => {
    return await post(true, CreatePostUrl, {
        title: postInfo.title,
        text: postInfo.text,
        url: postInfo.url,
        labelIds: postInfo.labelIds,
        status: postInfo.status,
        isSure: postInfo.isSure
    })
}

export const updatePost = async (postInfo: PostInfo): Promise<any> => {
    return await post(true, UpdatePostUrl, {
        title: postInfo.title,
        text: postInfo.text,
        url: postInfo.url,
        labelIds: postInfo.labelIds,
        status: postInfo.status,
        isSure: postInfo.isSure,
        postId: postInfo.postId
    })
}


export const getPostStatus = (status: string) => {
    console.log(status)
    switch (status) {
        case 'public':
            return PostStatusType.Public
        case 'private':
            return PostStatusType.Private
        case 'draft':
            return PostStatusType.Draft
        default:
            return 0
    }
}


export const splitDescription = (text: string) => {
    if (text.length > 6) return text.slice(0, 6) + '...'
    return text
}

export const splitContents = (content: string) => {
    if (content.length > 80) return content.slice(0, 80) + '...'
    return content
}


export const likeComment = async (comment: Comment) => {
    await CreateRelation({
        toId: comment.commentId,
        toType: TargetType.Comment,
        relationType: RelationType.Like,
    }).then(() => {
        comment.commentRelation.liked = true
        if(comment.commentRelation.hated) {
            unHateComment(comment)
            comment.commentRelation.hated = false
        }
        comment.like++
    })
}

export const unLikeComment = async (comment: Comment) => {
    await DeleteRelation({
        toId: comment.commentId,
        toType: TargetType.Comment,
        relationType: RelationType.Like,
    }).then(() => {
        comment.commentRelation.liked = false
        comment.like--
    })
}

export const hateComment = async(comment: Comment) => {
    await CreateRelation({
        toId: comment.commentId,
        toType: TargetType.Comment,
        relationType: RelationType.Hate,
    }).then(async () => {
        comment.commentRelation.hated = true
        if (comment.commentRelation.liked) {
            await unLikeComment(comment)
            comment.commentRelation.liked = false
        }
    })
}


export const unHateComment = async(comment: Comment) => {
    await DeleteRelation({
        toId: comment.commentId,
        toType: TargetType.Comment,
        relationType: RelationType.Hate,
    }).then(() => {
        comment.commentRelation.hated = false
    })
}
