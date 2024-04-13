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
    labelIds: string[]
    status: number,
    isSure: boolean
    postId: string
}


export type SearchOption = {
    searchKeyword: string,
    searchType: number
    searchTimerType: number
}

export type Slider = {
    sliderId: string,
    imageUrl: string,
    linkUrl: string
}

export type SimpleUser =  {
    userId: string,
    name: string,
    url: string,
}
export type Comment =  {
    commentId: string,
    subjectId: string,
    rootId: string,
    fatherId: string,
    count: number,
    state: number,
    attrs: number,
    labels: string[],
    author: SimpleUser,
    atUserId: string,
    content: string,
    meta: string,
    createTime: 0,
    like: 0,
    commentRelation: {
        liked: boolean,
        hated: boolean
    }
}

export type CommentBlock = {
    comment: Comment,
    replyList: {
        comments: Comment[],
        total: number
        token: string
    }
}

// 文件信息
export type File =  {
    fileId: string;
    userId: string;
    name: string;
    type: string;
    path: string;
    fatherId: string;
    spaceSize: string;
    isDel: number;
    description: string;
    updateAt: string;
    createAt: string;
    isChoose: boolean;
}

