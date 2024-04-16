<template>
    <div class="center-box">
        <CHeader class="cheader" :avatar="avatar"></CHeader>
        <section class="section">
            <div class="user-information-box">
                <div class="user-background" >
                    <img :src="user.background">
                    <input
                        type="file"
                        style="display: none;"
                        id="fileInput"
                        accept="image/*"
                        @change="uploadBackgroudImage($event)"
                    >
                    <button onclick="document.getElementById('fileInput').click()">点击上传背景图片</button>
                </div>
                <div class="user-information">
                    <div class="avatar">
                        <img :src="user.avatar" alt="头像">
                        <label
                            for="changeAvatar"
                            class="change-avatar" 
                        >
                            <input 
                                type="file" 
                                style="display: none;" 
                                id="changeAvatar"
                                accept="image/*"
                                @change="changeAvatar($event)"
                            >
                            <i class="iconfont icon-xiangji"></i>
                        </label>
                    </div>
                    <div class="information">
                        <div class="name-tags">
                            <div class="name">{{user.name}}</div>
                            <div class="tags">
                              <span
                                  v-for="tag in user.tags"
                                  :key="tag"
                              >{{ tag }}</span>
                            </div>
                        </div>
                        <div class="description">{{user.description}}</div>
                    </div>
                </div>
            </div>
            <div class="user-contents-box">
                <div class="contents-box">
                    <div class="contents-classify">
                        <ul>
<!--                            <li>-->
<!--                                <input-->
<!--                                    type="radio"-->
<!--                                    name="classify"-->
<!--                                    id="dynamic"-->
<!--                                    value="dynamic"-->
<!--                                    v-model="classify"-->
<!--                                    checked-->
<!--                                >-->
<!--                                <label for="dynamic">动态</label>-->
<!--                            </li>-->
<!--                            <li>-->
<!--                                <input-->
<!--                                    type="radio"-->
<!--                                    name="classify"-->
<!--                                    id="file"-->
<!--                                    value="file"-->
<!--                                    v-model="classify"-->
<!--                                >-->
<!--                                <label for="file">文件</label>-->
<!--                            </li>-->
                            <li>
                                <input
                                    type="radio"
                                    name="classify"
                                    id="post"
                                    value="post"
                                    v-model="classify"
                                    checked
                                >
                                <label for="post">帖子</label>
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    name="classify"
                                    id="follow"
                                    value="follow"
                                    v-model="classify"
                                >
                                <label for="follow">关注</label>
                            </li>
                        </ul>
                        <div class="contents"></div>
                    </div>
                    <div class="show-contents">
                        <List :SendContentMsg="selectInfo"></List>
                    </div>
                </div>
                <div>
                    <div class="user-other-information">
                        <div class="follow-star">
                            <div class="follow">
                                <p>关注了</p>
                                <p>{{user.followCount}}</p>
                            </div>
                            <div class="star">
                                <p>关注者</p>
                                <p>{{user.followedCount}}</p>
                            </div>
                        </div>
                        <div class="other">
                            <ul>
                                <li>
                                    <span>加入于</span>
                                    <span>{{turnTime(user.createTime)}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="author-rank">
                        <div class="author-rank-title">
                            <span>
                                <span class="author-rank-span">可能认识的人</span>
                            </span>
                        </div>
                        <div 
                            class="author-rank-contents" 
                            v-for="(recommendUser,index) in recommendUserList"
                            :key="index"
                        >
                            <ul>
                                <li>
                                    <div class="author">
                                        <div class="author-information">
                                            <img :src="recommendUser.url" alt="头像">
                                            <div class="information">
                                                <router-link :to="`/user/center/${recommendUser.userId}/post/publish`" class="router-link">
                                                    <p>{{ recommendUser.name }}</p>
                                                </router-link>
                                                    <p>{{ splitDescription(recommendUser.description) }}</p>
                                            </div>
                                        </div>
                                        <div v-if="recommendUser.userId !== store.getUserId()">
                                            <button
                                                v-if="!recommendUser.followed"
                                                @click="followHotUser(recommendUser)"
                                            >关注</button>
                                            <button v-else
                                                    @click="unFollowHotUser(recommendUser)"
                                            >已关注</button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import CHeader from '@/components/header.vue'
import List from './contents-list.vue'
import {ref, onMounted, watch} from 'vue'
import {getUserInfo, updateUser} from "@/views/information/utils";
import {followHotUser, getUserRecommend, splitDescription, turnTime, unFollowHotUser} from "@/utils/utils";
import {useRoute} from "vue-router";
import router from "@/router";
import SparkMD5 from "spark-md5";
import {cosUploadImage} from "@/utils/public-cos";
import {CategoryType, UserAvatarUrl} from "@/utils/consts";
import {useStore} from "@/store";
import type {HotUser} from "@/utils/type";

const recommendUserList = ref<HotUser[]>([])

const uploadBackgroudImage = (event: any) => {
  const file = event.target.files![0]
  if(file.type.indexOf('image') === -1) {
    alert('请上传图片')
    return
  }
  const fileReader = new FileReader();
  const spark = new SparkMD5.ArrayBuffer();
  fileReader.readAsArrayBuffer(file);
  fileReader.onload = (e: any) => {
    spark.append(e.target.result);
    const md5 = spark.end();
    const suffix = '.' + file.name.split('.').pop();
    cosUploadImage(file, md5, suffix, async () => {
      await updateUser("", "", "", 0,"","", UserAvatarUrl + md5 + suffix)
      user.value.backgroud = UserAvatarUrl + md5 + suffix
    })
  }
}
const store = useStore()
const classify = ref('post')
const user = ref({
  name: '',
  sex: '',
  description: '',
  avatar: '',
  tags: [],
  followed: false,
  followedCount: 0,
  followCount: 0,
  createTime: 0,
  background: ''
})

const selectInfo = ref({
  selectFirst : "",
  selectSecond: "",
  userId: ""
})

const avatar = ref(store.getUserAvatar())
const changeAvatar = async(event: any) => {
  const file = event.target.files![0]
  if(file.type.indexOf('image') === -1) {
    alert('请上传图片')
    return
  }
  const fileReader = new FileReader();
  const spark = new SparkMD5.ArrayBuffer();
  fileReader.readAsArrayBuffer(file);
  fileReader.onload = (e: any) => {
    spark.append(e.target.result);
    const md5 = spark.end();
    const suffix = '.' + file.name.split('.').pop();
    cosUploadImage(file, md5, suffix, async () => {
      await updateUser("","", UserAvatarUrl + md5 + suffix, 0,"","")
      store.setAvatar(UserAvatarUrl + md5 + suffix)
      user.value.avatar = UserAvatarUrl + md5 + suffix
    })
  }
}

const loading = ref(true) // Step 1: Initialize loading state

onMounted (async () => {
  const route = useRoute()
  const userId = route.params.userId as string
  classify.value = route.params.selectFirst as string
  const selectSecond = route.params.selectSecond as string
  selectInfo.value = {
    selectFirst: classify.value,
    selectSecond: selectSecond,
    userId: userId,
  }
  user.value =  await getUserInfo(userId)
  console.log(user.value.background)
  loading.value = false
  recommendUserList.value = await getUserRecommend("recommend", CategoryType.UserCategory)
})

watch(() => classify.value, async (newVal) => {
  if (loading.value) return // Step 3: Check if still loading
  const newSecond = ref('')
  switch (newVal) {
    case 'dynamic':
      await router.push(`/user/center/${selectInfo.value.userId}/${newVal}/default`)
      newSecond.value = 'default'
          break
    case 'file':
      await router.push(`/user/center/${selectInfo.value.userId}/${newVal}/publish`)
      newSecond.value = 'publish'
      break
    case 'post':
      await router.push(`/user/center/${selectInfo.value.userId}/${newVal}/publish`)
      newSecond.value = 'publish'
      break
    case 'follow':
      await router.push(`/user/center/${selectInfo.value.userId}/${newVal}/headerFollow`)
      newSecond.value = 'headerFollow'
          break
  }
  selectInfo.value = {
    selectFirst: newVal,
    selectSecond: newSecond.value,
    userId: selectInfo.value.userId,
  }
})

</script>

<style scoped lang="css">
.center-box {
    width: 100%;
    height: 100%;
    background-color: rgba(240, 245, 255, 0.5);
    display: flex;
    flex-direction: column;

    .cheader {
        width: 100%;
        height: 80px;
    }
    
    .section {
        width: 100%;
        flex: 1;
        padding: 0 30px 20px;
        overflow-y: auto;

        .user-information-box {
            max-width: 1200px;
            background-color: #fff;
            margin: auto;
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;

            .user-background {
                position: relative;
                height: 245.28px;
                background: linear-gradient(90deg, rgba(180, 203, 224, 1) 12.5%, rgba(198, 223, 247, 0) 100%);

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;

                }

                button {
                    position: absolute;
                    right: 10px;
                    bottom: 10px;
                    padding: 5px 10px;
                    font-size: 11px;
                    color: #686868;
                    background-color: #ffffff00;
                    border-radius: 510px;
                    border: 0.5px solid rgba(0, 0, 0, 0.3);
                    cursor: pointer;
                }
            }
            
            .user-information {
                position: relative;
                height: 159.6px;
                padding: 0 50px;
                border-radius: 5px;
                box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);

                .avatar {
                    position: absolute;
                    width: 180px;
                    height: 180px;
                    border-radius: 50%;
                    background-color: #ffffff;
                    top: -90px;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }

                    .change-avatar {
                        position: absolute;
                        right: -15px;
                        bottom: -15px;
                        width: 60px;
                        height: 60px;
                        background-color: #d7d7d738;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;

                        i {
                            font-size: 30px;
                        }
                    }
                }

                .information {
                    height: 70px;
                    margin-top: 45px;
                    margin-left: 230px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    .name-tags {
                        display: flex;
                        align-items: center;

                        .name {
                            font-size: 30px;
                            font-weight: bold;
                            margin-right: 30px;
                        }

                        .tags {

                            span {
                                padding: 5px 15px;
                                margin: 5px;
                                font-size: 12px;
                                color: rgba(42, 130, 228, 1);
                                background: #ffe9d0;
                                border-radius: 50px;
                            }
                        }
                    }
                }
            }
        }

        .user-contents-box {
            max-width: 1200px;
            margin: auto;
            display: flex;
            justify-content: space-between;

            .contents-box {
                width: 900px;
                box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
                background-color: #fff;
    
                .contents-classify {
    
                    ul {
                        height: 50px;
                        margin: 0;
                        padding: 10px;
                        list-style: none;
                        background: rgba(230, 239, 250, 0.49);
                        display: flex;
                        align-items: center;
    
                        li {
                            margin-right: 20px;
                            font-size: 16px;
    
                            input {
                                display: none;
                            }
                            input:checked + label {
                                border-bottom: 2px solid rgba(42, 130, 228, 1);
                            }
                        }
                    }
                }
    
                .show-contents {
                    min-height: 700px;
                    background-color: #fff;
                }
            }

            .user-other-information {
                width: 280px;
                margin-bottom: 30px;
                display: flex;
                flex-direction: column;

                .follow-star {
                    height: 80px;
                    line-height: 30px;
                    box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;

                    .follow,
                    .star {
                        height: 100%;
                        width: 50%;
                        background-color: #fff;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        p {
                            margin: 0;
                        }
                    }

                    .follow {
                        border-right: 1px solid #e0e0e0;
                    }
                }

                .other {
                    width: 100%;
                    border-top: 1px solid #e0e0e0;
                    
                    ul {
                        width: 100%;
                        list-style: none;
                        padding: 0;
                        margin: 0;
                        display: flex;
                        flex-direction: column;

                        li {
                            display: flex;
                            justify-content: space-between;
                            padding: 10px 20px;
                            font-size: 14px;
                            border-bottom: 1px solid #e0e0e0;
                        }
                    }
                }
            }

            .author-rank {
                width: 100%;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);
                padding: 15px;

                .author-rank-title {
                    padding-bottom: 10px;
                    border-bottom: 1px solid #f0f0f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .author-rank-span {
                        font-size: 16px;
                        font-weight: 600;
                    }
                }

                .author-rank-contents {
                    ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;

                        li {
                            padding: 15px 0;
                            border-bottom: 1px solid #f0f0f0;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;

                            .author {
                                width: 100%;
                                margin-right: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;

                                .author-information {
                                    flex: 1;
                                    display: flex;

                                    img {
                                        width: 40px;
                                        height: 40px;
                                        border-radius: 50%;
                                        margin-right: 10px;
                                    }
        
                                    .information {
                                        p {
                                            margin: 0;
                                        }
                                        p:first-child {
                                            font-size: 15px;
                                            color: black
                                        }
                                        p:nth-child(2) {
                                            font-size: 12px;
                                            color: rgb(132, 132, 132);
                                        }

                                        .router-link {
                                            text-decoration: none;
                                        }
                                    }
                                }

                                button {
                                    width: 60px;
                                    height: 30px;
                                    border: none;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    background-color: #ffede0;
                                    color: #a37658;
                                }
                            }
                        }
                    }
                }

                .author-rank-more {
                    padding: 10px 0 0 0;
                    text-align: center;
                    cursor: pointer;
                    font-size: 13px;
                    color: rgb(132, 132, 132);
                    border-top: 1px solid #f0f0f0;
                }
            }
        }
    }
}
</style>