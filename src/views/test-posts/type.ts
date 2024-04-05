export type HotUser =  {
    userId: string
    name: string
    url: string
    description: string
    followed: boolean
}

export type HotPost =  {
    postId: string
    title: string
}

export type Zone =  {
    zoneId: string
    value: string
}

export type Post = {
    postId: string,
    title: string,
    text: string,
    url: string,
    tags: Tag[],
    likeCount: number,
    commentCount: number, 
    liked: boolean,
    userName: string, 
}

export type Tag = {
    tagId: string,
    zoneId: string,
    value: string,
}
