<template>
    <div class="main-box" @click="cancelDeletePost">
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
                    <div class="select-box">
                        <input 
                            type="radio" 
                            id="post" 
                            name="select-type"
                            checked
                        >
                        <label for="post">帖子</label>
                    </div>
                    <div class="select-box"> 
                        <input 
                            type="radio" 
                            id="comment"
                            name="select-type"
                        >
                        <label for="comment">评论</label>
                    </div>
                </header>
                <section class="section">
                    <div>
                        <div class="section-header">
                            <div class="section-header-select">
                                <div class="select-post-box" @click="selectStatus('')">
                                    <input 
                                        type="radio"
                                        id="all"
                                        name="select-post"
                                        checked
                                    >
                                    <label for="all">全部 ({{ postsList.posts.length }})</label>
                                </div>
                                <div class="select-post-box" @click="selectStatus('&onlyStatus=1')">
                                    <input 
                                        type="radio"
                                        id="public"
                                        name="select-post"
                                    >
                                    <label for="public">全部可见</label>
                                </div>
                                <div class="select-post-box" @click="selectStatus('&onlyStatus=2')">
                                    <input 
                                        type="radio"
                                        id="onlyMe"
                                        name="select-post"
                                    >
                                    <label for="onlyMe">仅我可见</label>
                                </div>
                                <div class="select-post-box" @click="selectStatus('&onlyStatus=3')">
                                    <input
                                        type="radio"
                                        id="draft"
                                        name="select-post"
                                    >
                                    <label for="draft">草稿</label>
                                </div>
                            </div>
                            <div class="section-header-classify">
                                <div class="type-list">
                                    <input 
                                        type="text"
                                        list="typeList"
                                        placeholder="文章类型"
                                    >
                                    <datalist id="typeList">
                                        <option value="前端"></option>
                                        <option value="后端"></option>
                                        <option value="数据库"></option>
                                        <option value="运维"></option>
                                        <option value="产品"></option>
                                        <option value="设计"></option>
                                        <option value="职场"></option>
                                        <option value="其他"></option>
                                    </datalist>
                                </div>
                                <div class="column-list"> 
                                    <input 
                                        type="text"
                                        list="columnList"
                                        placeholder="分类专栏"
                                    >
                                    <datalist id="columnList">
                                        <option value="前端"></option>
                                        <option value="后端"></option>
                                        <option value="数据库"></option>
                                        <option value="运维"></option>
                                        <option value="产品"></option>
                                        <option value="设计"></option>
                                        <option value="职场"></option>
                                        <option value="其他"></option>
                                    </datalist>
                                </div>
                                <input 
                                    type="text"
                                    placeholder="请输入关键词"
                                    class="search"
                                    v-model="keyContent"
                                >
                                <button class="filter" @click="searchPostsList">搜索</button>
                            </div>
                        </div>
                        <div class="section-section">
                            <div 
                                class="detail"
                                v-for="(post, index) in postsList.posts"
                                :key="index"
                            >
                                <h3 
                                    @click="enterPost(post)"
                                    class="title"
                                >{{ post.title }}</h3>
                                <div>
                                    <div class="type">原创</div>
                                </div>
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
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CHeader from '@/components/header.vue'
import { onMounted, ref } from 'vue'
import { getMyPostList } from './utils'
import type { responseGetMyPostList } from './utils'
import { successMsg } from '@/utils/message'
import router from '@/router';
import { post } from '@/utils/request'
import {DeletePostUrl, StoragePostContent, StoragePostTitle} from "@/utils/consts";

const keyContent = ref<string>('')
const nowDeletePostId = ref('')
const isDeletePost = ref(false)
const postsList = ref<responseGetMyPostList>({
    posts: []
})

onMounted(async() => {
    postsList.value = await getMyPostList('')
})

const selectStatus = async (url: String) => {
  postsList.value = await getMyPostList(url)
}
const continueDelete = () => {
    const postId = nowDeletePostId.value
    
    post(true, DeletePostUrl, { postId })
    .then(() => {
        successMsg('删除成功')
        location.reload()
    })
}

const cancelDeletePost = () => {
    const deletePost = document.querySelector('.delete-post') as HTMLElement
    document.addEventListener('click', (event) => {
        if (event.target !== deletePost && !deletePost.contains(event.target as Node)) {
            isDeletePost.value = false 
        }
    })
}

const enterPost = (post: any) => {
    router.push('/post/' + post.postId)
}

const deletePost = (id: any) => {
    isDeletePost.value = true
    nowDeletePostId.value = id
}

const modifyPost = (post: any) => {
    sessionStorage.setItem(StoragePostTitle, post.title)
    sessionStorage.setItem(StoragePostContent, post.text)
    router.push('/write/modify/' + post.postId)
}

const searchPostsList = async() => {
    const key = '&allFieldsKey=' + keyContent.value
    postsList.value = await getMyPostList(key)
}
</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    height: auto;

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
        position: fixed;
    }

    .contents-box {
        width: 100%;
        padding: 100px 20px; 
        background-color: rgba(240, 245, 255, 1);
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
            }
        }
    }
}
</style>