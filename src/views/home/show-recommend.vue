<template>
    <div class="main-box">
        <div class="goods-box" v-show="props.classify === 'goods'">
            <div class="goods">
                <header>
                </header>
                <section>
                </section>
            </div>
        </div>
        <div class="posts-box" v-show="props.classify === 'posts'">
            <div 
                class="posts" 
                v-for="(post, index) in postList"
                :key="index"
            >
                <router-link 
                    class="posts-header"
                    :to="'/post/' + post.postId"
                >{{ post.title }}</router-link>
                <section class="posts-section">
                    <img src="" v-if="showPostImage(post.url)" alt="">
                    <div class="posts-layout">
                        <div v-if="post.url !== ''" class="post-image">
                            <img :src="post.url" alt="">
                        </div>
                        <div class="post-content">{{ htmlToText(post.userName + ": " + post.text) }}</div>
                    </div>
                </section>
                <PostDetail 
                    :information="post"
                    class="footer"
                ></PostDetail>
            </div>
        </div>
        <div class="user-box" v-show="props.classify === 'user'">
            <div 
                class="user"
                v-for="(user, index) in userList"
                :key="index"
            >
                <img :src="user.url">
                <div class="user-detail">
                  <router-link
                      :to="`/user/center/${user.userId}`"
                  >{{ user.name }}</router-link>
                    <div>粉丝量：{{ user.followedCount }}</div>
                    <div 
                        class="user-tag"
                        v-for="(tag, index) in user.labels"
                        :key="index"
                    >
                        {{ tag }}
                    </div>
                </div>
                <div v-if="user.userId !== store.getUserId()">
                  <div
                      class="follow"
                      v-if="!user.followed"
                      @click="followUser(user)"
                  >
                    <i class="iconfont icon-a-dianzan2"></i>
                    <div>关注</div>
                  </div>
                  <div
                      class="followed"
                      v-else
                      @click="unFollowUser(user)"
                  >
                    <i class="iconfont icon-a-dianzan2"></i>
                    <div>已关注</div>
                  </div>
                </div>
              </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import PostDetail from '../posts/post-information.vue'
import {onMounted, ref, watch} from 'vue'
import type {Post, User} from "@/utils/type";
import {followUser, getPostRecommend, getUserRecommend, unFollowUser} from "@/utils/utils";
import {TargetType} from "@/utils/consts";
import {useStore} from "@/store";

const store = useStore()
const props = defineProps<{
    classify: string,
    mainClassify: string
}>()
const userList = ref<User[]>([])
const postList = ref<Post[]>([])
onMounted(() => {
  getShow()
})

watch(() => props.mainClassify, () => {
  getShow()
})
watch(() => props.classify, () => {
  getShow()
})

const htmlToText = (html: string) => {
  const div = document.createElement('div')
  div.innerHTML = html
  if (div.innerText.length > 190) return div.innerText.slice(0, 190) + '...'
  return div.innerText
}

const showPostImage = (url: string) => {
  return url !== ''
}

const getShow = async () => {
  switch (props.classify) {
    case "user":
      userList.value = await getUserRecommend(props.mainClassify, TargetType.User)
      break;
    case "files":
      break;
    case "post":
      postList.value = await getPostRecommend(props.mainClassify, TargetType.Post)
      break;
  }
}


</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    padding: 5px 15px;  

    .goods-box {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, 150px);
        grid-template-rows: repeat(auto-fill, 200px);
        grid-column-gap: 5px;
        grid-row-gap: 10px;
        justify-content: space-around;
        align-items: center;

        .goods {
            width: 150px;
            height: 200px;
            background-color: #ffffff;
            box-shadow: 0 0 10px 1px #dadada7f;
        }
    }

    .posts-box {
        width: 100%;

        .posts {
            width: 100%;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e5e5e583;

            .posts-header {
                color: #000;
                text-decoration: none;
                font-weight: 700;
                cursor: pointer;
            }
            .posts-header:hover {
                color: #275187;
                text-decoration: underline;
            }

            .posts-section {
                width: 100%;
                margin-top: 5px;
                display: flex;

                .posts-layout {
                    width: 100%;
                    font-size: 16px;
                    display: flex;

                    .post-image {
                        width: 220px;
                        height: 130px;
                        margin-right: 10px;
                        cursor: pointer;

                        img {
                        width: 100%;
                        height: 100%;
                        border-radius: 5px;
                        object-fit: cover; 
                        display: block;
                        }
                    }

                    .post-content {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                    }
                }
            }
            
            .footer {
                width: 100%;
                margin-top: 10px;
            }
        }
    }

    .user-box {
        width: 100%;

        .user {
            width: 100%;
            height: 90px;
            padding: 10px;
            border-bottom: 1px solid #e5e5e5a1;
            display: flex;
            align-items: center;
            justify-content: space-between;

            img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                margin-right: 20px;
            }

            .user-detail {
                flex: 1;
                
                div:first-child {
                    font-size: 16px;
                    font-weight: 700;
                    margin-bottom: 5px;
                }
                div:nth-child(2) {
                    font-size: 14px;
                    color: #919191;
                    margin-bottom: 5px;
                }
                .user-tag {
                    width: 50px;
                    height: 20px;
                    font-size: 14px;
                    background-color: #b0d3f8;
                    border-radius: 5px;
                    color: #ffffff;
                    text-align: center;
                }
            }

          .follow, .followed {
            width: 70px;
            height: 30px;
            line-height: 30px;
            background-color: #f8d9c5;
            box-shadow: 0 0 5px 1px #ebac82;
            border: none;
            border-radius: 5px;
            color: #fff;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .follow i, .followed i {
            font-size: 17px;
            margin-right: 3px;
          }

          /* 按钮激活（被点击）时的样式 */
          .follow:active, .followed:active {
            box-shadow: none;
          }

        }
    }
}
</style>