<template>
    <div class="post-box">
        <CHeader></CHeader>
        <section class="section">
            <div class="contents-box">
                <div class="post">
                    <div class="information">
                        <ul>
                            <li @click="CreateRelation({
                                  toId: postId,
                                  toType: TargetType.Post,
                                  relationType: RelationType.Like,
                                })">
                                <i class="iconfont icon-a-dianzan2"></i>
                                <div >{{postDetail?.likeCount}}</div>
                            </li>
                            <li>
                                <i class="iconfont icon-a-xiaoxi1"></i>
                                <div>{{ postDetail?.commentCount }}</div>
                            </li>
                            <li @click="CreateRelation({
                                  toId: postId,
                                  toType: TargetType.Post,
                                  relationType: RelationType.Collect,
                                })">
                                <i class="iconfont icon-shoucang01"></i>
                                <div>{{ postDetail?.collectCount }}</div>
                            </li>
                            <li @click="CreateRelation({
                                  toId: postId,
                                  toType: TargetType.Post,
                                  relationType: RelationType.Share,
                                })">
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
                            <span>浏览量: 8k</span>
                        </div>
                        <div class="vditor" id="vditor"></div>
                    </article>
                </div>
                <div class="right">
                    <div class="user-box">
                        <div class="user">
                            <img :src="postDetail?.author.url" alt="" />
                            <div>
                                <span>{{ postDetail?.author.name}}</span>
                                <span>个性签名</span>
                                <span>tag</span>
                            </div>
                        </div>
                        <div class="user-infor">
                            <div>
                                <p>31</p>
                                <p>文章</p>
                            </div>
                            <div>
                                <p>1k</p>
                                <p>阅读</p>
                            </div>
                            <div>
                                <p>1k</p>
                                <p>粉丝</p>
                            </div>
                        </div>
                        <div v-if="postDetail?.author.userId !== store.getUserId()">
                          <button>关注</button>
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
import {getPostDetail, getPostRecommendByPostId, turnTime} from "@/utils/utils";
import {useStore} from "@/store";
import {enterPost} from "@/views/posts/utils";
import {CreateRelation} from "@/utils/api";
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
                            width: 50px;
                            height: 50px;
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
                            span:nth-child(3) {
                                display: block;
                                width: auto;
                                padding: 0;
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