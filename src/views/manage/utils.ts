import { get } from '@/utils/request'
import { ref } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const getMyUserId = () => {
    if (store.getLoginType() === 1) {
        return sessionStorage.getItem('UserId')
    }
    else {
        return localStorage.getItem('UserId')
    }
}

export interface responseGetMyPostList {
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
        total: number
    }[],
}

export const getMyPostList = async(params: any) => {
    const postsList = ref<responseGetMyPostList>({
        posts: []
    })
    const url = ref('/content/getPosts?onlyUserId=' + getMyUserId())
    if (params !== '&allFieldsKey=') {
        url.value = '/content/getPosts?onlyUserId=' + getMyUserId() + params
    }
    await get(url.value)
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
                userName: post.userName,
                total: res.total
            }))
        }
    })
    return postsList.value
}