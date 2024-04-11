import {get} from '@/utils/request'
import {ref} from 'vue'
import {useStore} from '@/store'
import {GetPostsUrl, PostStatusType, SearchSortType} from "@/utils/consts";
import type {Post} from "@/utils/type";

const store = useStore()
export const getMyPostList = async(status?: PostStatusType, keyword?: string) => {
    const userId = store.getUserId()
    const postList = ref<Post[]>([])
    const url = ref(`${GetPostsUrl}?onlyUserId=' + ${userId}`)
    url.value = `${GetPostsUrl}?onlyUserId=${userId}`
    if(status) url.value += `&onlyStatus=${status}`
    if(keyword) url.value += `&searchKeyword=${keyword}&searchType=${SearchSortType.Score}`
    console.log(url.value)
    await get(true, url.value)
    .then((res: any) => {
        postList.value = res.posts.map((post: any) => ({
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
    })
    return postList.value
}