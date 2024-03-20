import { get } from '@/utils/request'
import { ref } from 'vue'

export interface responseGetOtherPosts {
    posts: {
        postId: string,
        title: string,
        text: string,
        url: string,
        tags: string[],
        likeCount: number,
        commentCount: number,
        liked: boolean,
        userName: string,
    }[]
}

export interface responseGetPost {
    title: string,
    text: string,
    url:string,
    author: {
        userId: string,
        name: string,
        url: string,
    }
    tags: string[],
    viewCount: number,
    likeCount: number,
    commentCount: number,
    shareCount: number,
    collectCount: number,
    liked: boolean,
    collected: boolean,
    createTime: number,
    updateTime: number,
}

export const getOtherPosts = async () => {
    const postsList = ref<responseGetOtherPosts>({
        posts: []
    })
    await get('/content/getPosts')
    .then((res: any) => {
        postsList.value = {
            posts: res.posts.map((post: any) => ({
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
        }
    })
    return postsList.value
}

export const getTagsList = async(key: string) =>{
    const url = '/label/getLabels?key=' + key
    const tagsList = ref<string[]>([])
    await get(url).then((res: any) => {
        tagsList.value = res.labels.map((label: any) => label.value)
    })
    return tagsList.value
}