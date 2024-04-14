<template>
    <div class="main-box">
        <div class="delete-post" v-if="isDeletePost">
            <div>执行此操作后，该文章将永久删除，是否继续？</div>
            <div class="delete-post-button">
                <button @click="isDeletePost = false">取消</button>
                <button @click="continueDelete">继续</button>
            </div>
        </div>
        <CHeader class="cheader"></CHeader>
        <div class="contents-box">
            <div class="contents">
                <header class="header">
                    <div class="select-box" @click="getMyPostList()">
                        <input 
                            type="radio" 
                            id="post" 
                            name="select-type"
                            v-model="selectType"
                            value="post"
                            checked
                        >
                        <label for="post">帖子</label>
                    </div>
                    <div class="select-box" @click="getMyComments">
                        <input 
                            type="radio" 
                            id="comment"
                            name="select-type"
                            v-model="selectType"
                            value="comment"
                        >
                        <label for="comment">评论</label>
                    </div>
                </header>
                <section class="section">
                    <div>
                        <div class="section-header">
                            <div class="section-header-select" v-show="selectType === 'post'">
                                <div class="select-post-box" @click="selectStatus(PostStatusType.None)">
                                    <input 
                                        type="radio"
                                        id="all"
                                        name="select-post"
                                        v-model="onlyStatus"
                                        :value="PostStatusType.None"
                                        checked
                                    >
                                    <label for="all">全部</label>
                                </div>
                                <div class="select-post-box" @click="selectStatus(PostStatusType.Public)">
                                    <input 
                                        type="radio"
                                        id="public"
                                        name="select-post"
                                        v-model="onlyStatus"
                                        :value="PostStatusType.Public"
                                    >
                                    <label for="public">全部可见</label>
                                </div>
                                <div class="select-post-box" @click="selectStatus(PostStatusType.Private)">
                                    <input 
                                        type="radio"
                                        id="onlyMe"
                                        name="select-post"
                                        v-model="onlyStatus"
                                        :value="PostStatusType.Private"
                                    >
                                    <label for="onlyMe">仅我可见</label>
                                </div>
                                <div class="select-post-box" @click="selectStatus(PostStatusType.Draft)">
                                    <input
                                        type="radio"
                                        id="draft"
                                        name="select-post"
                                        v-model="onlyStatus"
                                        :value="PostStatusType.Draft"
                                    >
                                    <label for="draft">草稿</label>
                                </div>
                            </div>
                            <div class="section-header-select" v-show="selectType === 'comment'">
                                <div class="select-post-box">
                                    <input
                                        type="radio"
                                        id="create"
                                        name="select-comment"
                                        v-model="commentStatus"
                                        :value="CommentStatusType.Create"
                                        checked
                                    >
                                    <label for="create" @click="updateCommentStatus(CommentStatusType.Create)">我发表的</label>
                                </div>
                                <div class="select-post-box">
                                    <input
                                        type="radio"
                                        id="replied"
                                        name="select-comment"
                                        v-model="commentStatus"
                                        :value="CommentStatusType.Replied"
                                    >
                                    <label for="replied" @click="updateCommentStatus(CommentStatusType.Replied)">回复我的</label>
                                </div>
                            </div>
                            <div class="section-header-classify" v-if="selectType === 'post'">
                                <input
                                    type="text"
                                    placeholder="请输入关键词"
                                    class="search"
                                    v-model="keyContent"
                                >
                                <button class="filter" @click="searchPostsList">搜索</button>
                            </div>
                        </div>
                        <div class="section-section" v-show="selectType === 'post'">
                            <div 
                                class="detail"
                                v-for="(post, index) in postList"
                                :key="index"
                            >
                                <h3 
                                    @click="enterPost(post)"
                                    class="title"
                                >{{ post.title }}</h3>
                                <div class="detail-data">
                                    <div class="data">
                                        <span>点赞 {{ post.likeCount }}</span>
                                        <span>评论 {{ post.commentCount }}</span>
                                    </div>
                                    <div class="operate">
                                        <span @click="modifyPost(post)">编辑</span>
                                        <span @click.stop="deletePost(post.postId)">删除</span>
                                        <span><i class="iconfont icon-gengduo"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="section-section-comment" v-show="selectType === 'comment'">
                            <div
                                class="comment-create-list"
                                v-for="(comment, index) in commentList"
                                :key="index"
                            >
                                <div class="comment-item"  v-if="commentStatus === CommentStatusType.Replied">
                                    <div class="infor">
                                        <div class="image">
                                            <img :src="comment.author.url" alt="">
                                        </div>
                                        <div class="name">{{ comment.author.name }}</div>
                                        <div class="time">{{ turnTime(comment.createTime) }}</div>
                                        <div class="other">回复了你的文章</div>
                                        <div class="title">文章标题</div>
                                    </div>
                                    <div class="contents">
                                        <span>{{ comment.content }}</span>
                                    </div>
                                </div>
                                <div v-else class="comment-item">
                                    <div class="infor">
                                        <span class="me">我</span>
                                        <span class="time">{{ turnTime(comment.createTime) }}</span>
                                        <span class="other">评论了</span>
                                        <span class="he">name</span>
                                        <span class="other">的文章</span>
                                        <span class="title">文章标题</span>
                                    </div>
                                    <div class="contents-">
                                        <span>{{ comment.content }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <el-pagination
                            class="el-pagination"
                            layout="prev, pager, next"
                            :total="nowTotal"
                            :hide-on-single-page="true"
                            :current-page="nowPage"
                            @update:current-page="handPageChange($event)"
                        />
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CHeader from '@/components/header.vue'
import {onMounted, ref} from 'vue'
import {successMsg} from '@/utils/message'
import router from '@/router';
import {get, post} from '@/utils/request'
import {
  CommentStatusType,
  DeletePostUrl,
  GetCommentsUrl, GetPostsUrl,
  PostStatusType, SearchSortType,
  StoragePostContent,
  StoragePostId,
  StoragePostTitle
} from "@/utils/consts";
import type {Post, Comment} from "@/utils/type";
import {useStore} from "@/store";
import {turnTime} from "@/utils/utils";

const onlyStatus = ref(0)
const keyContent = ref<string>('')
const commentStatus = ref(CommentStatusType.Create)
const selectType = ref('post')
const nowDeletePostId = ref('')
const isDeletePost = ref(false)
const postList = ref<Post[]>([])
const nowPage = ref<number>(1)
const nowTotal = ref<number>(0)
const commentList = ref<Comment[]>([])
const store = useStore()
onMounted(async() => {
  await getMyPostList()
})

const updateCommentStatus = async(nowStatus: CommentStatusType) => {
  nowPage.value = 1
  console.log("change")
  if(nowStatus === CommentStatusType.Create) {
    await getMyComments()
  } else {
    await getReplyMeComments()
  }
}
const handPageChange = async(num: number) => {
  nowPage.value = num
  if(selectType.value === 'post') {
     await getMyPostList(onlyStatus.value, keyContent.value)
  } else {
    if(commentStatus.value === CommentStatusType.Create) {
      await getMyComments()
    } else {
      await getReplyMeComments()
    }
  }
}

const selectStatus = async (status: PostStatusType) => {
    await getMyPostList(status)
}

const continueDelete = () => {
    const postId = nowDeletePostId.value
    const postIds = ref<string[]>([])
    postIds.value.push(postId)
    post(true, DeletePostUrl, {
      postIds: postIds.value
    })
    .then(() => {
        successMsg('删除成功')
         postList.value = postList.value.filter(post => post.postId !== nowDeletePostId.value);
        isDeletePost.value = false
    })
}

const getMyPostList = async(status?: PostStatusType, keyword?: string) => {
  const userId = store.getUserId()
  const url = ref(`${GetPostsUrl}?onlyUserId=' + ${userId}`)
  url.value = `${GetPostsUrl}?onlyUserId=${userId}`
  if(status) url.value += `&onlyStatus=${status}`
  if(keyword) url.value += `&searchKeyword=${keyword}&searchType=${SearchSortType.Score}`
  url.value += `&limit=10&offset=${(nowPage.value - 1) * 10}`
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
        }))
        nowTotal.value = res.total
        commentList.value = []
      })
}

const getMyComments = async () => {
  commentStatus.value = CommentStatusType.Create
  const userId = store.getUserId()
  await get(true, `${GetCommentsUrl}?onlyUserId=${userId}&limit=10&offset=${(nowPage.value - 1) * 10}`)
      .then((res:any) => {
          commentList.value = res.comments
          nowTotal.value = res.total
          postList.value = []
      })
}

const getReplyMeComments = async () => {
  commentStatus.value = CommentStatusType.Replied
  const userId = store.getUserId()
  await get(true, `${GetCommentsUrl}?onlyAtUserId=${userId}&limit=10&offset=${(nowPage.value - 1) * 10}`)
      .then((res:any) => {
        commentList.value = res.comments
        nowTotal.value = res.total
        postList.value = []
      })
}


// const cancelDeletePost = () => {
//     const deletePost = document.querySelector('.delete-post') as HTMLElement
//     document.addEventListener('click', (event) => {
//         if (event.target !== deletePost && !deletePost.contains(event.target as Node)) {
//             isDeletePost.value = false
//         }
//     })
// }

const enterPost = (post: any) => {
    router.push('/post/' + post.postId)
}

const deletePost = (id: any) => {
    isDeletePost.value = true
    nowDeletePostId.value = id
}

const modifyPost = (post: Post) => {
    sessionStorage.setItem(StoragePostTitle, post.title)
    sessionStorage.setItem(StoragePostContent, post.text)
    sessionStorage.setItem(StoragePostId, post.postId)
    router.push(`/edit`)
}

const searchPostsList = async() => {
    await getMyPostList(onlyStatus.value,keyContent.value)
}
</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    height: 100%;
    background-color: rgba(240, 245, 255, 0.5);
    display: flex;
    flex-direction: column;

    .delete-post {
        position: absolute;
        width: 280px;
        height: 120px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 11px;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0 0 10px 1px #00000070;

        .delete-post-button {
            width: 100%;
            text-align: end;
            margin-top: 30px;

            button {
                width: 80px;
                height: 25px;
                border: none;
                margin-left: 20px;
            }

            button:last-child {
                background-color: #f5533a;
                color: #fff;
                border-radius: 5px;
            }
        }
    }

    .cheader {
        width: 100%;
        height: 70px;
        z-index: 100;
    }

    .contents-box {
        width: 100%;
        padding: 20px;
        overflow: auto;
        display: flex;
        justify-content: center;

        .contents {
            width: 1000px;
            height: 100%;

            .header {
                width: 100%;
                height: 50px;
                padding-left: 20px;
                margin-bottom: 10px;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                
                .select-box {
                    label {
                        color: #c7c7c7;
                        margin-right: 20px;
                        cursor: pointer;
                    }

                    input {
                        display: none;
                    }
                    input:checked + label {
                        color: #000;
                    }

                }
            }

            .section {
                width: 100%;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

                .section-header {
                    padding: 10px 20px;
                    background-color: #fff;

                    .section-header-select {
                        margin-bottom: 20px;
                        display: flex;

                        .select-post-box {
                            label {
                                color: #c7c7c7;
                                margin-right: 20px;
                                cursor: pointer;
                            }

                            input {
                                display: none;
                            }
                            input:checked + label {
                                color: #000;
                            }
                        }
                    }

                    .section-header-classify {
                        display: flex;

                        .type-list,
                        .column-list {
                            input {
                                width: 150px;
                                height: 28px;
                                margin-right: 20px;
                                padding: 0 10px;
                                border: 1px solid #c7c7c7;
                                border-radius: 5px;
                            }
                            input:hover {
                                border: 1px solid #333333;
                            }
                            input:focus {
                                outline: none;
                                border: 1px solid #333333;
                            }
                        }

                        .search {
                            width: 200px;
                            height: 28px;
                            margin-right: 20px;
                            padding: 0 10px;
                            border: 1px solid #c7c7c7;
                            border-radius: 5px;
                        }
                        .search:focus {
                            border: 1px solid #333333;
                            outline: none;
                        }

                        .filter {
                            width: 60px;
                            height: 28px;
                            color: #fff;
                            background-color: #9ec6ff;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                        }
                        .filter:hover {
                            background-color: #7db3ff
                        }
                        .filter:active {
                            transform: scale(0.95);
                        }
                    }
                }
                
                .section-section {
                    padding: 20px;
                    background-color: #fff;

                    .detail {
                        padding-bottom: 20px;
                        margin-bottom: 10px;
                        border-bottom: 0.5px solid #c7c7c758;

                        .title {
                            margin: 0;
                            margin-bottom: 10px;
                            cursor: pointer;
                        }
                        .title:hover {
                            color: #6d99ec;
                            text-decoration: underline;
                        }

                        .type {
                            width: 40px;
                            padding: 1px;
                            margin-bottom: 10px;
                            color: #ff6a2f;
                            background-color: #ffdddd;
                            text-align: center;
                        }


                        .detail-data {
                            display: flex;
                            justify-content: space-between;

                            .data {
                                span {
                                    margin-right: 20px;
                                    color: #a4a4a4;
                                }
                            }

                            .operate {
                                span {
                                    margin-right: 20px;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                }

                .section-section-comment {
                    padding: 20px;
                    background-color: #fff;
                    display: block;

                    .comment-create-list {
                        display: flex;
                        flex-direction: column;

                        .comment-item {
                            padding-bottom: 10px;
                            margin-bottom: 10px;
                            border-bottom: 1px solid #f1f1f1;
                            display: flex;
                            flex-direction: column;
                            
                            .infor {
                                display: flex;
                                align-items: center;
                                
                                .image {
                                    width: 40px;
                                    height: 40px;
                                    border-radius: 50%;
                                    margin-right: 15px;
    
                                    img {
                                        width: 40px;
                                        height: 40px;
                                        border-radius: 50%;
                                    }
                                }

                                .name {
                                    font-size: 16px;
                                    margin-right: 8px;
                                    cursor: pointer;
                                }

                                .me, 
                                .he {
                                    margin-right: 8px;
                                }
                                
                                .time,
                                .other {
                                    color: #a4a4a4;
                                    margin-right: 8px;
                                }
                                .title {
                                    color: #4da1e6;
                                    cursor: pointer;
                                }
                            }

                            .contents {
                                padding-left: 70px;
                            }
                            .contents- {
                                padding-left: 25px;
                            }
                        }
                    }
                }

                .el-pagination {
                    height: 50px;
                    margin-top: -25px;
                    background-color: #fff;
                    display: flex;
                    justify-content: center;
                }
            }
        }
    }
}
</style>