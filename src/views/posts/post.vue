<template>
    <div class="post-box">
        <CHeader></CHeader>
        <section class="section">
            <div class="contents-box">
                <div class="post">
                    <div class="information">
                        <ul>
                            <li @click="likeOrCancelPostDetail(postDetail);">
                                <i class="iconfont icon-a-dianzan2" v-if="!postDetail?.liked"></i>
                                <i class="iconfont icon-a-dianzan2 liked" v-else></i>
                                <div >{{postDetail?.likeCount}}</div>
                            </li>
                            <li>
                                <i class="iconfont icon-a-xiaoxi1"></i>
                                <div>{{ postDetail?.commentCount }}</div>
                            </li>
                            <li @click="collectOrCancelPostDetail(postDetail)">
                                <i class="iconfont icon-shoucang01" v-if="!postDetail?.collected"></i>
                                <i class="iconfont icon-shoucang01 collected" v-else></i>
                                <div>{{ postDetail?.collectCount }}</div>
                            </li>
                            <li @click="sharePostDetail(postDetail)">
                                <i class="iconfont icon-fenxiang"></i>
                                <div>{{ postDetail?.shareCount }}</div>
                            </li>
                        </ul>
                    </div>
                    <article class="article">
                        <h1>{{ postDetail?.title}}</h1>
                        <div class="post-detail">
                            <span>{{ postDetail?.author.name}}</span>
                            <span>{{ turnTime( postDetail?.createTime) }}</span>
                            <span>浏览量: {{ postDetail?.viewCount}}</span>
                        </div>
                        <div class="vditor" id="vditor"></div>
                    </article>
                </div>
                <div class="right">
                    <div class="user-box">
                        <div class="user">
                            <img :src="postDetail?.author.url" alt="" />
                            <div>
                                <router-link :to="`/user/center/${postDetail?.author.userId}/dynamic/default`">{{ postDetail?.author.name}}</router-link>
                                <span>{{postDetail?.author.description}}</span>
                                <span class="user-tags" v-for="(label, index) in postDetail?.author.labels" :key="index">
                                    <span>{{label.value}}</span>
                                </span>
                            </div>
                        </div>
                        <div class="user-infor">
                            <div>
                              <router-link :to="`/user/center/${postDetail?.author.userId}/post/publish`">{{postDetail?.author.postCount}}</router-link>
                                <p>文章</p>
                            </div>
                            <div>
                                <p>{{postDetail?.author.likedCount}}</p>
                                <p>总获赞</p>
                            </div>
                            <div>
                                <router-link :to="`/user/center/${postDetail?.author.userId}/follow/fans`">{{postDetail?.author.followedCount}}</router-link>
                                <p>粉丝</p>
                            </div>
                        </div>
                        <div v-if="postDetail?.author.userId !== store.getUserId()">
                          <button v-if="!postDetail?.author.followed" @click="followAuthor(postDetail?.author)">关注</button>
                          <button v-else @click="unFollowAuthor(postDetail?.author)">已关注</button>
                        </div>
                    </div>
                    <div class="catalogue">
                        <span>目录</span>
                        <ul>
                            <li>目录1</li>
                            <li>目录2</li>
                            <li>目录3</li>
                        </ul>
                    </div>
                    <div class="recommend">
                        <span>推荐</span>
                        <ul v-for="(post,index) in postList" :key="index">
                            <li>
                              <div class="post-title" @click="changePost(post.postId)">{{post.title}}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
import type {Post, PostDetail} from "@/utils/type";
import CHeader from '@/components/header.vue'
import {onMounted, ref} from "vue";
import {getPostDetail, getPostRecommendByPostId, likePost, turnTime, unLikePost} from "@/utils/utils";
import {useStore} from "@/store";
import {enterPost} from "@/views/posts/utils";
import {CreateRelation, DeleteRelation} from "@/utils/api";
import {RelationType, TargetType} from "@/utils/consts";
import Vditor from "vditor";
import 'vditor/dist/index.css'

const postDetail = ref<PostDetail>()
const postList = ref<Post[]>([])
const store = useStore()
const postId = ref('')

onMounted(async () => {
    const urls = location.href.split("/")
    postId.value = urls[urls.length - 1]
    postDetail.value = await getPostDetail(postId.value)
    postList.value = await getPostRecommendByPostId(postId.value)
    renderMarkdown(postDetail?.value?.text)
})



const likeOrCancelPostDetail = (post: PostDetail | undefined) => {
  if (post) {
    if (post.liked) {
      DeleteRelation({
        toId: postId.value,
        toType: TargetType.Post,
        relationType: RelationType.Like,
      }).then(() => {
        post.liked = false
        post.likeCount--
      })
    } else {
      CreateRelation({
        toId: postId.value,
        toType: TargetType.Post,
        relationType: RelationType.Like,
      }).then(() => {
        post.liked = true
        post.likeCount++
      })
    }
  }
}

const collectOrCancelPostDetail = (post: PostDetail | undefined) => {
  if (post) {
    if (post.collected) {
      DeleteRelation({
        toId: postId.value,
        toType: TargetType.Post,
        relationType: RelationType.Collect,
      }).then(() => {
        post.collected = false
        post.collectCount--
      })
    } else {
      CreateRelation({
        toId: postId.value,
        toType: TargetType.Post,
        relationType: RelationType.Collect,
      }).then(() => {
        post.collected = true
        post.collectCount++
      })
    }
  }
}

const sharePostDetail = (post: PostDetail | undefined) => {
  if (post) {
      CreateRelation({
        toId: postId.value,
        toType: TargetType.Post,
        relationType: RelationType.Share,
      }).then(() => {
        post.shareCount++
      })
    }
}

const followAuthor = (author: any) => {
  CreateRelation({
    toId: author.userId,
    toType: TargetType.User,
    relationType: RelationType.Follow,
  }).then(() => {
    author.followed = true
    author.followedCount++
  })
}

const unFollowAuthor = (author: any) => {
  DeleteRelation({
    toId: author.userId,
    toType: TargetType.User,
    relationType: RelationType.Follow,
  }).then(() => {
    author.followed = false
    author.followedCount--
  })
}


const renderMarkdown = (md: string | undefined) => {
  if(md) {
    Vditor.preview(<HTMLDivElement>document.getElementById('vditor'), md, {
      cdn: "https://cdn.jsdelivr.net/npm/vditor",
      mode: "light",
      theme: {
        current: 'light'
      },
      hljs: {
        style: 'github'
      },
    })
  }
}

const changePost = async (nowPostId: string) => {
  postId.value = nowPostId
  enterPost(nowPostId)
  postDetail.value = await getPostDetail(nowPostId)
  postList.value = await getPostRecommendByPostId(nowPostId)
  renderMarkdown(postDetail?.value?.text)
}

</script>
<style scoped lang="css">
.post-box {
    width: 100%;
    height: 100%;
    background-color: rgba(240, 245, 255, 0.5);
    display: flex;
    flex-direction: column;

    .section {
        width: 100%;
        flex: 1;
        padding-top: 30px;
        overflow-y: auto;

        .contents-box {
            width: 100%;
            display: flex;
            justify-content: center;
            
            .post {
                width: 1000px;
                background-color: #fff;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                margin: 0 30px;
                padding: 20px;

                .information {
                    position: fixed;
                    margin-top: 50px;
                    left: 50%;
                    transform: translate(-780px);

                    ul {
                        list-style: none;

                        li {
                            position: relative;
                            width: 50px;
                            height: 50px;
                            background-color: #fff;
                            border-radius: 50%;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            margin-bottom: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            i {
                                font-size: 30px;
                                line-height: 50px;
                            }

                            div {
                                position: absolute;
                                background-color: #c9c9c9;
                                color: #fff;
                                font-size: 13px;
                                padding: 2px 5px;
                                border-radius: 10px;
                                right: -15px;
                                top: 0;
                            }

                            .liked {
                                color: #6d99ec;
                            }
                            .collected {
                              color: #6d99ec;
                            }
                        }
                    }
                }

                .article {
                    h1 {
                        margin: 0;
                        padding: 0;
                        font-size: 25px;
                        margin-bottom: 10px;
                    }

                    .post-detail {
                        font-size: 13px;
                        color: #989898;
                        margin-bottom: 20px;
                        
                        span {
                            margin-right: 20px;
                        }
                    }

                    .vditor {
                        border: none;
                    }
                }
            }

            .right {
                width: 300px;
                display: flex;
                flex-direction: column;

                .user-box {
                    background-color: #fff;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    margin-bottom: 10px;

                    .user {
                        margin-bottom: 20px;
                        display: flex;
                        align-items: center;

                        img {
                            width: 70px;
                            height: 70px;
                            border-radius: 50%;
                            margin-right: 15px;
                        }

                        div {

                            display: flex;
                            flex-direction: column;

                            span {
                                font-size: 15px;
                                color: #333;
                                margin-bottom: 5px;
                            }

                            span:nth-child(2) {
                                font-size: 13px;
                                color: #666;
                                margin-bottom: 5px;
                            }

                            .user-tags {
                                width: auto;
                                padding: 0;

                                span {
                                    height: 20px;
                                    padding: 0 10px;
                                    margin-right: 5px;
                                    font-size: 13px;
                                    border-radius: 10px;
                                    background-color: #b0d3f8;
                                    color: #fff;
                                }
                            }

                        }
                    }

                    .user-infor {
                        display: flex;
                        justify-content: space-around;
                        margin-bottom: 20px;

                        div {
                            text-align: center;

                            p {
                                font-size: 15px;
                                color: #333;
                                margin-bottom: 5px;
                            }
                        }
                    }

                    button {
                        width: 100%;
                        height: 40px;
                        background-color: #409eff;
                        color: #fff;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                }
                
                .catalogue {
                    background-color: #fff;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    margin-bottom: 10px;

                    span {
                        font-size: 15px;
                        color: #333;
                    }

                    ul {
                        list-style: none;
                        margin: 0;
                        padding: 10px;

                        li {
                            font-size: 15px;
                            color: #666;
                            margin: 10px;
                        }
                    }
                }

                .recommend {
                    background-color: #fff;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                    padding: 20px;

                    span {
                        font-size: 15px;
                        color: #333;
                    }

                    ul {
                        list-style: none;
                        margin: 0;
                        padding: 10px;

                        li {
                            font-size: 15px;
                            color: #666;
                            margin: 10px;

                            div:hover {
                              color: #1890ff;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>