import { get } from '@/utils/request'
import { ref } from 'vue'

export interface responseGetOtherPosts {
    posts: {
        postId: string,
        title: string,
        text: string,
        url: string,
        likeCount: number,
        author: {
            name: string,
        }
    }[]
}

export const getOtherPosts = async () => {
    const postsList = ref<responseGetOtherPosts>({
        posts: []
    })
    await get('/content/getOtherPosts')
    .then((res: any) => {
        postsList.value = {
            posts: res.posts.map((post: any) => ({
                postId: post.postId,
                title: post.title,
                text: post.text,
                url: post.url,
                likeCount: post.likeCount,
                author: {
                    name: post.author.name,
                }
            }))
        }
    })

    return postsList.value
}