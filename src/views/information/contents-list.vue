<template>
    <div class="list-box">
      <div v-if="props.SendContentMsg.selectFirst === 'dynamic'" class="contents">
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
      <div v-else-if="SendContentMsg.selectFirst === 'follow'" class="contents">
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
                  @click="getFollows(store.getUserId())"
              >
              <label for="headerFollow">关注</label>
            </li>
            <li>
              <input
                  type="radio"
                  name="select"
                  id="fans"
                  value="fans"
                  v-model="select"
                  @click="getFans(store.getUserId())"
              >
              <label for="fans">粉丝</label>
            </li>
          </ul>
        </div>
        <div class="users-list">
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
                <button @click="followUser(user)">+ 关注</button>
              </div>
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
                  @click="getPublish()"
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
                  @click="getLike()"
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
                  @click="getCollect()"
              >
              <label for="collect">收藏</label>
            </li>
          </ul>
        </div>

        <div v-if="props.SendContentMsg.selectFirst === 'post'" class="posts-box">
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
        <div v-if="props.SendContentMsg.selectFirst === 'file'">
          <div class="file-contents">
            <div 
                class="content"
                v-for="file in fileList"
                :key="file.fileId"
            >
                <div class="information">
                    <h2>标题</h2>
                    <p>内容</p>
                    <PostDetail :PostInfo="file"></PostDetail>
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
  getCollectPostList,
  getFollowedUserList,
  getFollowUserList, getLikePostList,
  getPostList
} from "@/views/information/utils";
import {useStore} from "@/store";
import type {Post, User} from "@/utils/type";
import {followUser, splitContents, unFollowUser} from "@/utils/utils";
import {enterPost} from "@/views/posts/utils";
import router from "@/router";

const store = useStore()
const followUserList = ref<User[]>([]) // 关注用户列表
const postList = ref<Post[]>([])
const fileList = ref<any[]>([])
// const fileList = ref<File[]>([])
const select = ref('headerFollow')
const props = defineProps<{
  SendContentMsg: {
    selectFirst: string,
    selectSecond: string,
    userId: string,
  }
}>();

onMounted(async () => {
  // const route = useRoute()
  // const userId = route.params.userId as string
  // const selectFirst = route.params.selectFirst as string
  // const selectSecond = route.params.selectSecond as string
  //
  // switch (selectFirst) {
  //   case 'follow':
  //     if (selectSecond == 'headerFollow')
  //       followUserList.value = await getFollowUserList(userId)
  //     else followUserList.value = await getFollowedUserList(userId)
  //     break;
  //   case 'post':
  //     if (selectSecond == 'publish')
  //       postList.value = await getPostList(userId)
  //     else if(selectSecond == 'like')
  //       postList.value = await getLikePostList(userId)
  //     else postList.value = await getCollectPostList(userId)
  //     break;
  //   case 'file':
  //     break;
  // }
})
watch(()=> props.SendContentMsg, async (newVal) => {
  select.value = props.SendContentMsg.selectSecond
 switch (newVal.selectFirst) {
   case 'follow':
     if (newVal.selectSecond == 'headerFollow')
       followUserList.value = await getFollowUserList(props.SendContentMsg.userId)
     else followUserList.value = await getFollowedUserList(props.SendContentMsg.userId)
     break;
   case 'post':
     if (newVal.selectSecond == 'publish')
     postList.value = await getPostList(props.SendContentMsg.userId)
     else if(newVal.selectSecond == 'like')
     postList.value = await getLikePostList(props.SendContentMsg.userId)
     else postList.value = await getCollectPostList(props.SendContentMsg.userId)
     break;
   case 'file':
     break;
 }
})

const getPublish = async () => {
  await router.push(`/user/center/${props.SendContentMsg.userId}/${props.SendContentMsg.selectFirst}/publish`)
  switch (props.SendContentMsg.selectFirst) {
    case 'post':
      postList.value = await getPostList(props.SendContentMsg.userId)
      break;
    case 'file':
      break;
  }
}

const getLike = async () => {
  await router.push(`/user/center/${props.SendContentMsg.userId}/${props.SendContentMsg.selectFirst}/like`)
  switch (props.SendContentMsg.selectFirst) {
    case 'post':
      console.log("获取点赞")
      postList.value = await getLikePostList(props.SendContentMsg.userId)
      break;
    case 'file':
      break;
  }
}

const getCollect = async () => {
  await router.push(`/user/center/${props.SendContentMsg.userId}/${props.SendContentMsg.selectFirst}/collect`)
  switch (props.SendContentMsg.selectFirst) {
    case 'post':
      postList.value = await getCollectPostList(props.SendContentMsg.userId)
      break;
    case 'file':
      break;
  }
}

const getFollows = async(userId: string) => {
  await router.push(`/user/center/${props.SendContentMsg.userId}/${props.SendContentMsg.selectFirst}/headerFollow`)
  followUserList.value = await getFollowUserList(userId)
}

const getFans = async(userId: string) => {
  await router.push(`/user/center/${props.SendContentMsg.userId}/${props.SendContentMsg.selectFirst}/fans`)
  followUserList.value = await getFollowedUserList(userId)
}
</script>
<style scoped lang="css">
.list-box {
    .contents {
        padding: 10px;
        display: flex;
        flex-direction: column;

        .detail {
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

        .users-list {
            .detail-follow {
                padding: 10px;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .image {
                    width: 60px;
                    height: 60px;
                    margin-right: 10px;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 50%;
                    }
                }

                .user {
                    flex: 1;
                    margin-right: 10px;

                    p {
                        margin: 0;
                        padding: 0;
                    }
                }

                .button {
                    button {
                        padding: 5px 10px;
                        border-radius: 5px;
                        border: none;
                        background-color: #fff;
                        color: #6d99ec;
                        cursor: pointer;
                    }
                }
            }
        }

        .posts-box {
          width: 100%;
          .posts-contents {
            width: 100%;
              .content {
                  width: 100%;
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
        }


        .file-contents {
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
            }
        }
      }
}
</style>