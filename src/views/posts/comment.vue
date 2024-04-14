<template>
    <div class="comment-box">
        <div class="comment-box-header">
            <div class="title-count">
                <span class="title">评论</span>
                <span class="count">{{ commentCount }}</span>
            </div>
        </div>
        <div class="my-comment">
            <div class="image">
                <img :src="store.getUserAvatar()" alt="">
            </div>
            <input
                type="text"
                placeholder="写下你的评论吧~"
                @keyup.enter="submitComment(postId,postId,postId, content, userId, 0)"
                v-model="content"
            >
        </div>
        <div class="comment-list" >
            <div
                class="comment-item"
                v-for="(commentBlock, index) in commentList"
                :key="index"
            >
                <div class="image">
                    <img :src="commentBlock.comment.author.url" alt="">
                </div>
                <div
                    class="comment-detail">
                    <p class="name" @click="enterUser(commentBlock.comment.author.userId)">{{commentBlock.comment.author.name}}</p>
                    <p class="comment">{{commentBlock.comment.content}}</p>
                    <div class="footer">
                        <span class="time">{{turnTime(commentBlock.comment.createTime)}}</span>
                        <span class="agree" v-if="!commentBlock.comment.commentRelation.liked" @click="likeComment(commentBlock.comment)">
                            <i class="iconfont icon-appreciate_light"></i>
                            <span>{{ commentBlock.comment.like }}</span>
                        </span>
                        <span class="agree" v-if="commentBlock.comment.commentRelation.liked" @click="unLikeComment(commentBlock.comment)">
                            <i class="iconfont icon-appreciate_light"></i>
                            <span>{{ commentBlock.comment.like }}</span>
                        </span>
                        <span 
                            class="reply-btn"
                            @click="replyComment(
                                    commentBlock.comment.commentId,
                                    commentBlock.comment.commentId,
                                    commentBlock.comment.author.userId,
                                    commentBlock.comment.author.name
                                  )">回复
                        </span>
                        <span class="delete-reply-btn" @click="deleteComment(commentBlock.comment.commentId)">删除</span>
                    </div>
                    <div class="reply-item" v-for="(reply, index) in commentBlock.replyList.comments" :key="index">
                        <div v-if="index < 3 || commentBlock.isExpand" class="reply-limit">
                            <div class="image">
                                <img :src="reply.author.url" alt="">
                            </div>
                            <div class="reply-detail">
                                <div class="reply">
                                    <span class="name">{{ reply.author.name }}</span>
                                    <span class="contents">{{reply.content}}</span>
                                </div>
                                <div class="footer">
                                    <span class="time">{{turnTime(reply.createTime)}}</span>
                                    <span class="agree">
                                        <i class="iconfont icon-appreciate_light"></i>
                                        <span>{{ reply.like }}</span>
                                    </span>
                                    <span
                                        class="reply-btn"
                                        @click="replyComment(
                                                reply.commentId,
                                                commentBlock.comment.commentId,
                                                reply.author.userId,
                                                reply.author.name
                                            )">回复
                                    </span>
                                    <span class="delete-reply-btn" @click="deleteComment(reply.commentId)">删除</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="more-comments">
                        <div class="pagination-container" v-if="commentBlock.isExpand">
                            <span 
                                v-if="commentBlock.replyList.total > 10"
                            >共 {{ getPages(commentBlock.replyList.total) }} 页</span>
                            <el-pagination
                                layout="prev, pager, next"
                                :total="commentBlock.replyList.total"
                                :hide-on-single-page="true"
                                @update:current-page="handlePageChange($event, commentBlock, index)"
                            />
                        </div>
                        <span v-else>共{{commentBlock.replyList.total}}条回复</span>
                        <span class="more" v-if="commentBlock.replyList.comments.length > 3 && !commentBlock.isExpand" @click="commentBlock.isExpand = true">查看更多</span>
                    </div>
                    <div class="my-comment" v-if="commentBlock.comment.commentId === replyRootId">
                        <div class="image">
                        <img :src="store.getUserAvatar()" alt="">
                        </div>
                        <input
                            type="text"
                            :placeholder="`回复@${replyAtUserName}`"
                            @keyup.enter="submitComment(postId,commentBlock.comment.commentId, replyCommentId, subContent, replyAtUserId, index)"
                            v-model="subContent"
                        >
                    </div>
                </div>
            </div>
            <el-pagination
                class="el-pagination"
                layout="prev, pager, next"
                :total="commentCount"
                :hide-on-single-page="true"
                @update:current-page="handlePageChange($event, commentList[0], 0)"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {useStore} from "@/store";
import {CreateCommentUrl, DeleteCommentUrl, GetCommentBlocksUrl } from "@/utils/consts";
import {get, post} from "@/utils/request";
import type {CommentBlock} from "@/utils/type"
import {enterUser, likeComment, turnTime, unLikeComment} from "@/utils/utils";
import {errorMsg} from "@/utils/message";
const store = useStore()
const commentList = ref<CommentBlock[]>([])
const content = ref<string>('')
const postId = ref<string>('')
const userId = ref<string>('')
const commentCount = ref<number>(0)
const replyCommentId = ref<string>("")
const replyRootId = ref<string>("")
const subContent = ref<string>("")
const replyAtUserId = ref<string>("")
const replyAtUserName = ref<string>("")
const replyPage = ref<number>(1)
const props = defineProps<{
  PostData: {
    PostId: string,
    UserId: string,
    CommentCount: number,
  }
}>()
onMounted(async () => {

})

watch(() => props.PostData.PostId, async () => {
  postId.value = props.PostData.PostId
  userId.value = props.PostData.UserId
  commentCount.value = props.PostData.CommentCount
  commentList.value = await getComments(postId.value, postId.value)
})

const handlePageChange = async (number: any, commentBlock: CommentBlock, index: number) => {
  replyPage.value = number
  await getComments(commentBlock.comment.commentId, postId.value)
      .then((res:any) => {
        commentList.value[index].replyList = res[0].replyList
      })
};

const getPages = (total: number) => {
  return Math.ceil(total / 10)
}

const deleteComment = async(commentId: string) => {
  await post(false, DeleteCommentUrl, {
        commentId: commentId
  })
      .then(async() => {
        commentCount.value = props.PostData.CommentCount
        commentList.value =  await getComments(postId.value, postId.value)
      })
}
const replyComment = (replyId: string, rootId: string, atUserId: string, AtUserName: string) => {
  if(replyCommentId.value !== replyId) {
    replyCommentId.value = replyId
    replyRootId.value = rootId
    replyAtUserId.value = atUserId
    replyAtUserName.value = AtUserName
  } else {
    replyCommentId.value = ''
    replyRootId.value = ''
    replyAtUserId.value = ''
    replyAtUserName.value = ''
  }
}

const getComments = async(rootId: string, subjectId: string) => {
  const comments = ref<CommentBlock[]>([])
  await get(false, `${GetCommentBlocksUrl}?rootId=${rootId}&subjectId=${subjectId}&limit=10&offset=${10 * (replyPage.value - 1)}`)
      .then((res: any) => {
        comments.value =  res.commentBlocks.map((commentBlock:any) => ({
          comment: commentBlock.rootComment,
          replyList: commentBlock.replyList,
          isExpand: false,
        }))
      })
  return comments.value
}


const submitComment = async (subjectId: string,rootId: string, fatherId: string, cnt: string, atUserId: string, index: number) => {
  if(cnt === '') {
    errorMsg('评论内容不能为空')
    return
  }
  await post(true, `${CreateCommentUrl}`, {
      subjectId: subjectId,
      rootId: rootId,
      fatherId: fatherId,
      content: cnt,
      atUserId: atUserId,
  })
      .then(async () => {
        content.value = '';
        commentCount.value ++;
        if(subjectId === rootId && rootId === fatherId) {
          commentList.value = await getComments(subjectId, subjectId)
        } else {
          await getComments(rootId, subjectId)
              .then((res:any) => {
                commentList.value[index].replyList = res[0].replyList
                content.value = ""
                subContent.value = ""
              })
        }
      })
}
</script>
<style scoped lang="css">
.comment-box {
    width: 100%;
    background-color: #fff;
    padding: 10px 20px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

    .comment-box-header {
        margin-bottom: 20px;
        display: flex;

        .title-count {
            display: flex;
            align-items: center;

            .title {
                font-size: 20px;
            }
            .count {
                font-size: 15px;
                color: #a0a0a0;
                margin-left: 10px;
            }

            margin-right: 20px;
        }

        .select {
            display: flex;
            align-items: center;

            input {
                display: none;
            }
            label {
                color: #a0a0a0;
                font-size: 15px;
                cursor: pointer;
                margin-right: 10px;
            }

            input:checked + label {
                color: #000000;
            }

            .hot {
                label {
                    padding-right: 10px;
                    border-right: 1px solid #d1d1d1;
                }
            }
        }
    }

    .my-comment {
        display: flex;
        align-items: center;

        .image {
            width: 40px;
            height: 40px;
            margin-right: 20px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        input {
            width: 100%;
            height: 40px;
            border: 1px solid #c7ddff;
            background-color: #e6f0ff2c;
            border-radius: 5px;
            padding: 0 10px;
            outline: none;
        }
    }

    .comment-list {
        width: 100%;
        padding: 0 10px;
        margin-top: 40px;

        .comment-item {
            border-bottom: 1px solid #eeeeee;
            margin-bottom: 20px;
            display: flex;

            .image {
                width: 40px;
                height: 40px;
                margin-right: 20px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }

            .comment-detail {
                display: flex;
                flex-direction: column;

                .name {
                    font-size: 18px;
                    padding: 0;
                    margin-top: 10px;
                    margin-bottom: 0;
                    color: #5c5c5c;
                }
                
                .comment {
                    font-size: 15px;
                    margin-bottom: 8px;
                }

                .footer {
                    color: #a0a0a0;
                    font-size: 13px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;

                    .time,
                    .agree,
                    .disagree,
                    .reply-btn,
                    .delete-reply-btn {
                        margin-right: 10px;
                        cursor: pointer;

                        i {
                            margin-right: 3px;
                        }
                    }
                }

                .reply-item {
                    width: 100%;

                    .reply-limit {
                        display: flex;
                        .image {
                            width: 35px;
                            height: 35px;
                            margin-right: 20px;
    
                            img {
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            }
                        }
    
                        .reply-detail {
                            display: flex;
                            flex-direction: column;
    
                            .reply {
                                margin-bottom: 8px;
    
                                .name {
                                    color: #5c5c5c;
                                    margin-right: 10px;
                                }
    
                                .contents {
                                    font-size: 15px;
                                }
                            }
                        }
                    }
                }

                .more-comments {
                    margin-bottom: 10px;
                    color: #a0a0a0;
                    font-size: 13px;

                    .more:hover {
                        color: #7baaef;
                        cursor: pointer;
                    }
                }
            }

            .more-comment {
                height: 100px;
            }
        }

        .el-pagination {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
    }
}

.pagination-container {
  display: flex;
  align-items: center; /* 垂直居中 */
  width: 100%; /* 或根据实际需要调整宽度 */
}

.pagination-container span {
  margin-right: 20px; /* 为页数信息添加一些右边距 */
}
</style>