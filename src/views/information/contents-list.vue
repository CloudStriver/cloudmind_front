<template>
    <div class="list-box">
      <div v-if="props.SendContentMsg === 'dynamic'" class="contents">
<!--        <div class="detail">-->
<!--          <h1>标题</h1>-->
<!--          <p>内容</p>-->
<!--          <footer class="detail-footer">-->
<!--            <div class="situation">-->
<!--              <div-->
<!--                  class="like"-->
<!--              >-->
<!--                <i class="iconfont icon-a-dianzan2"></i>-->
<!--                <div>点赞</div>-->
<!--              </div>-->
<!--              <div-->
<!--                  class="liked"-->
<!--              >-->
<!--                <i class="iconfont icon-a-dianzan2"></i>-->
<!--                <div>已点赞 1k</div>-->
<!--              </div>-->
<!--              <div class="remark">-->
<!--                <i class="iconfont icon-a-xiaoxi1"></i>-->
<!--                <div>评论 1k</div>-->
<!--              </div>-->
<!--              <div-->
<!--                  class="collect"-->
<!--              >-->
<!--                <i class="iconfont icon-shoucang01"></i>-->
<!--                <div>收藏</div>-->
<!--              </div>-->
<!--              <div-->
<!--                  class="collected"-->
<!--              >-->
<!--                <i class="iconfont icon-shoucang01"></i>-->
<!--                <div>已收藏</div>-->
<!--              </div>-->
<!--              <div class="share">-->
<!--                <i class="iconfont icon-fenxiang"></i>-->
<!--                <div>分享</div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </footer>-->
<!--        </div>-->
      </div>
      <div v-else-if="SendContentMsg === 'follow'" class="contents">
        <div class="header">
          <ul>
            <li>
              <input
                  type="radio"
                  name="select"
                  id="headerFollow"
                  v-model="select"
                  value="headerFollow"
                  checked
              >
              <label for="headerFollow" @click="getFollowUserList(store.getUserId())">关注</label>
            </li>
            <li>
              <input
                  type="radio"
                  name="select"
                  id="fans"
                  value="fans"
                  v-model="select"
              >
              <label for="fans" @click="getFollowedUserList(store.getUserId())">粉丝</label>
            </li>
          </ul>
        </div>
        <div
            v-for="(user, index) in followUserList"
            class="detail-follow"
            :key="index"
        >
          <div class="image">
            <img :src="user.url" alt="">
          </div>
          <div class="user">
            <p>{{ user.name }}</p>
            <p>{{ user.description}}</p>
          </div>
          <div v-if="store.getUserLongToken()">
            <div v-if="user.followed" class="button">
              <button @click="unFollowUser(user)">已关注</button>
            </div>
            <div v-else class="button">
              <button @click="followUser(user)">关注</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="contents">
        <div class="header">
          <ul>
            <li>
              <input
                  type="radio"
                  name="select"
                  id="publish"
                  value="publish"
                  v-model="select"
                  checked
              >
              <label for="publish">发布</label>
            </li>
            <li>
              <input
                  type="radio"
                  name="select"
                  id="like"
                  v-model="select"
                  value="like"
              >
              <label for="like">点赞</label>
            </li>
            <li>
              <input
                  type="radio"
                  name="select"
                  id="collect"
                  value="collect"
                  v-model="select"
              >
              <label for="collect">收藏</label>
            </li>
          </ul>
        </div>

        <div v-if="props.SendContentMsg === 'post'">
          <div class="posts-contents">
            <div 
                class="content"
                v-for="post in postList"
                :key="post.postId"
            >
                <div class="information">
                    <h2 @click="enterPost(post.postId)">{{ post.title }}</h2>
                    <p>{{ splitContents(post.userName + ": " + post.text) }}</p>
                    <PostDetail :PostInfo="post"></PostDetail>
                </div>
                <div v-if="post.url !== ''" class="image">
                    <img :src="post.url" alt="图片">
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
</template>
<script setup lang="ts">
import PostDetail from '../posts/post-information.vue'
import {onMounted, ref, watch} from 'vue'
import {
  getFollowedUserList,
  getFollowUserList,
  getPostList
} from "@/views/information/utils";
import {useStore} from "@/store";
import type {Post, User} from "@/utils/type";
import {followUser, likePost, splitContents, unFollowUser, unLikePost} from "@/utils/utils";
import {enterPost} from "@/views/posts/utils";

const store = useStore()
const followUserList = ref<User[]>([]) // 关注用户列表
const postList = ref<Post[]>([])
// const fileList = ref<File[]>([])
const select = ref('headerFollow')
const props = defineProps<{
  SendContentMsg: string
}>();

onMounted(async () => {
})
watch(()=> props.SendContentMsg, async (newVal) => {
 switch (newVal) {
   case 'follow':
     followUserList.value = await getFollowUserList(getUserId())
     break;
   case 'post':
     postList.value = await getPostList(getUserId())
     break;
   case 'file':
     break;
 }
})

const getUserId = () => {
  const urls = location.href.split("/")
  return urls[urls.length - 1]
}

</script>
<style scoped lang="css">
.list-box {
    .contents {
        padding: 10px;

        .detail {
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 10px;
            margin-bottom: 10px;
            
            h1 {
                font-size: 20px;
                font-weight: 600;
                margin: 0;
            }
            
            .detail-footer {
                position: relative;
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
        
                .situation {
                    display: flex;

                    .like,
                    .liked,
                    .remark,
                    .collect,
                    .collected,
                    .share,
                    .more{
                        display: flex;
                        align-items: center;
                        margin-right: 20px;
                        cursor: pointer;
        
                        i {
                            font-size: 20px;
                            margin-right: 5px;
                        }
                    }
        
                    .liked {
                        color: #6d99ec;
                        font-weight: 600;
                    }
        
                    .collected {
                        color: #ff9d5b;
                        font-weight: 600;
                    }

                    .image {
                      width: 180px;
                      height: 100px;

                      img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 10px;
                      }
                    }
                }
            }
        }

        .header {
            width: 100%;
            padding-bottom: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;

            ul {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;

                li {
                    margin-right: 20px;

                    input {
                        display: none;
                    }
                    input:checked + label {
                        color: #6d99ec;
                    }

                    label {
                        cursor: pointer;
                        user-select: none
                    }
                }
            }
        }

        .posts-contents {
            .content {
                padding: 10px;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .information {
                    flex: 1;
                    margin-right: 10px;

                    h2 {
                        font-size: 20px;
                        margin: 0;
                        padding: 0;
                        cursor: pointer;
                    }
                    h2:hover {
                        color: #1890ff;
                    }

                    p {
                        color: #61666D;
                        font-size: 15px;
                    }
                }


                .image {
                    width: 180px;
                    height: 100px;
                    
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 10px;
                    }
                }
            }
        }

        .detail-follow {
            position: relative;
            padding-bottom: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            align-items: center;

            .image {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 20px;

                img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }
            }

            .user {
                p {
                    margin: 0;
                }
                p:last-child {
                    color: rgb(99, 99, 99);
                    font-size: 13px;
                    margin-top: 5px;
                }
            }

            .button {
                position: absolute;
                right: 0;

                button {
                    background-color: #fff;
                    border: 1px solid #919191;
                    padding: 2px 15px;
                    border-radius: 10px;
                }
            }
        }
    }
}
</style>