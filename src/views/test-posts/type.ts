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
    tags: string[],
    likeCount: number,
    commentCount: number, 
    liked: boolean,
    userName: string, 
}