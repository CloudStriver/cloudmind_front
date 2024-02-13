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