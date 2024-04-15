<template>
    <div class="setting-box" v-show="isShowSetting">
        <div class="tags-box" v-show="isShowAddTags">
            <div class="tags-box-header">
                <h1>设置帖子标签</h1>
            </div>
            <div class="search-box">
                <input 
                    maxlength="10"
                    type="text"
                    placeholder="输入文字搜索"
                >
                <i class="iconfont icon-sousuo"></i>
            </div>
            <div class="tags-select">
                <div class="zone-1">
                    <p>分区</p>
                    <ul>
                        <li
                            v-for="(label, index) in firstLabelList"
                            :key="index"
                            @click="selectFirstLabel(label.id)"
                            :class="{ 'selected': selectFirstLabelId === label.id }"
                        >
                            <label :for="label.id">{{ label.value }}</label>
                        </li>
                    </ul>
                </div>
                <div class="zone-3">
                    <p>添加标签</p>
                    <div class="zone-3-list">
                        <ul>
                            <li
                                v-for="(label, index) in labelList"
                                :key="index"
                            >
                                <label
                                    :for="label.id"
                                    @click="selectLabel(label)"
                                    :class="{ 'selected': isTagSelected(label)}"
                                >
                                    <span>{{ label.value }}</span>
                                </label>   
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="button">
                <button @click="noShowSelectTag()">取消</button>
                <button @click="confirmSelectTag()">确定</button>
            </div>
        </div>
        <div class="setting-panel">
            <h1>设置帖子相关信息</h1>
            <div class="setting-image">
                <span>设置帖子封面</span>
                <div class="add-image-box" v-if="!isHasUploadImage">
                    <label for="addImage" class="add-image">
                        <span>+ 添加图片</span>
                    </label>
                    <input 
                        type="file" 
                        id="addImage"
                        accept="image/*"
                        @change="uploadCoverImage($event)"
                    >
                </div>
                <div 
                    class="operate-image-box" 
                    v-if="isHasUploadImage"
                    @mouseover="ishowImageOperate = true"
                    @mouseleave="ishowImageOperate = false"
                >
                    <img :src="coverImageUrl" alt="">
                    <div class="change-image" v-show="ishowImageOperate">
                        <input 
                            type="file" 
                            id="changeImage"
                            accept="image/*"
                        >
                        <label for="changeImage">更换</label>
                        <label>删除</label>
                    </div>
                </div>
            </div>
            <div class="setting-tags">
                <span>设置帖子标签</span>
                <span 
                    class="tags-list"
                    v-for="(tag, index) in selectLabelList"
                    :key="index"
                    @click="selectLabel(tag)"
                >
                    {{ tag.value }}
                    <i class="iconfont icon-cuowu1"></i>
                </span>
                <i 
                    class="iconfont icon-jia add-tag-button" 
                    @click="addTags"
                ></i>
            </div>
            <div class="setting-store">
                <span>设置存储位置</span>
                <input 
                    type="radio" 
                    name="place" 
                    id="public"
                    v-model="postStatus"
                    value="public"
                    checked
                >
                <label for="public">公开</label>
                <input 
                    type="radio" 
                    name="place" 
                    id="private"
                    value="private"
                    v-model="postStatus"
                >
                <label for="private">私密</label>
                <input 
                    type="radio" 
                    name="place" 
                    id="draft"
                    value="draft"
                    v-model="postStatus"
                >
                <label for="draft">草稿箱</label>
            </div>
            <div class="footer">
                <span>PS: 至少选择一个标签噢</span>
                <div class="button">
                    <button @click="noPublishPost()">取消</button>
                    <button @click="publishPost()">发布</button>
                </div>
            </div>
        </div>
    </div>
    <div class="sure-box" v-show="sureOption">
        <div class="sure-panel">      
            <div class="tags-box-header">
              <div>该文章包含敏感词，是否继续发布</div>
              <div 
                v-for="(keyword, index) in keywords"
                :key="index"
              >{{ keyword }}</div>
    <!--          <div v-if="keywords && keywords.value.length >= 1" v-for="(keyword, index) in keywords.value[0].keywords.value">-->
    <!--            <div v-if="index !== 0">，</div>-->
    <!--            <div>{{keyword}}</div>-->
    <!--          </div>-->
    <!--          <div  v-if="keywords && keywords.value.length === 2" v-for="(keyword, index) in keywords.value[1].keywords.value">-->
    <!--            <div v-if="index !== 0">，</div>-->
    <!--            <div>{{keyword}}</div>-->
    <!--          </div>-->
            </div>
            <div class="button">
              <button @click="noSure()">取消</button>
              <button @click="confirmSure()">确定</button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import type {Label} from "@/utils/type";
import {createPost, getLabelList, getPostStatus, updatePost} from "@/utils/utils";
import {enterPost} from "@/views/posts/utils";
import SparkMD5 from "spark-md5";
import {cosUploadImage} from "@/utils/public-cos";
import {errorMsg} from "@/utils/message";
import {StoragePostContent, StoragePostTitle} from "@/utils/consts";
const isShowSetting = ref(true)
const sureOption = ref(false)
const isHasUploadImage = ref(false)
const ishowImageOperate = ref(false) 
const isShowAddTags = ref(false)
const coverImageUrl = ref('')
const imageFile = ref()
const labelList = ref<Label[]>([])
const selectLabelList = ref<Label[]>([])
const firstLabelList = ref<Label[]>([])
const selectFirstLabelId = ref('')
const postStatus = ref('public')
const isSure = ref(false)
const props = defineProps<{
  sendPostData: {
    text: string,
    title: string,
    postId: string,
  }
}>()
const emit = defineEmits(['sendSettingContents'])
const keywords = ref<string[]>([])

onMounted(async () => {
})

// 选择标签
const selectLabel = (label: Label) => {
  const tagIds = selectLabelList.value.map(item => item.id); // 获取已选标签的 id 列表
  const index = tagIds.indexOf(label.id); // 检查当前标签的 id 是否存在于已选标签的 id 列表中

  if (index !== -1) {
    // 如果已经存在，则移除该标签
    selectLabelList.value.splice(index, 1);
  } else {
    // 否则，将标签添加到已选列表中
    selectLabelList.value.push(label);
  }
}

// 显示添加标签
const addTags = async () => {
  isShowAddTags.value = true
  firstLabelList.value = await getLabelList("root")
}

const isTagSelected = (label:Label ) => {
  const tagIds = selectLabelList.value.map(item => item.id); // 获取已选标签的 id 列表
  const index = tagIds.indexOf(label.id); // 检查当前标签的 id 是否存在于已选标签的 id 列表中
  return index !== -1;
}
// 上传图片
const uploadCoverImage = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file == null) return
    imageFile.value = file
    isHasUploadImage.value = true
    coverImageUrl.value = URL.createObjectURL(file)
}

const noShowSelectTag = () => {
  isShowAddTags.value = false
  selectLabelList.value = []
}

const confirmSelectTag = () => {
  isShowAddTags.value = false
}



const selectFirstLabel = async (labelId: string) => {
  selectFirstLabelId.value = labelId
  labelList.value = await getLabelList(selectFirstLabelId.value)
}

const publishPost = async () => {
  if(selectLabelList.value.length <= 0  && !props.sendPostData.postId) {
    errorMsg("至少选择一个标签")
    return
  }
  if(selectLabelList.value.length > 10) {
    errorMsg("最多选择十个标签")
    return
  }

  if(props.sendPostData.title.length > 20) {
    errorMsg("标题长度不能超过20个字符")
    return
  }

  const url = ref('')
  if(imageFile.value) {
    const fileReader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();
    fileReader.readAsArrayBuffer(imageFile.value);
    fileReader.onload = (e: any) => {
      spark.append(e.target.result);
      const md5 = spark.end();
      const suffix = '.' + imageFile.value.name.split('.').pop();
      url.value = "https://cloudmind.top/users/" + md5 + suffix
      CreatePost(url.value)
      cosUploadImage(imageFile.value, md5, suffix, async () => {})
    }
  }
  else {
    await CreatePost(url.value)
  }
}

const CreatePost = async(url: string) => {
  const labelIds = selectLabelList.value.map(item => item.id)
  if (props.sendPostData.postId && props.sendPostData.postId !== '') {
    await updatePost({
      title: props.sendPostData.title,
      text: props.sendPostData.text,
      url: url,
      labelIds: labelIds,
      status: getPostStatus(postStatus.value),
      isSure: isSure.value,
      postId: props.sendPostData.postId,
    })
        .then((res: any) => {
          sessionStorage.removeItem(StoragePostTitle)
          sessionStorage.removeItem(StoragePostContent)
          if (res.keywords === null) {
            console.log(props.sendPostData.postId)
            enterPost(props.sendPostData.postId)
          } else {
            keywords.value = res.keywords
            sureOption.value = true
            isShowSetting.value = false
          }
        })
  } else {
    await createPost({
      title: props.sendPostData.title,
      text: props.sendPostData.text,
      url: url,
      labelIds: labelIds,
      status: getPostStatus(postStatus.value),
      isSure: isSure.value,
      postId: "",
    })
        .then((res: any) => {
          sessionStorage.removeItem(StoragePostTitle)
          sessionStorage.removeItem(StoragePostContent)
          if (res.keywords === null) {
            enterPost(res.postId)
          } else {
            keywords.value = res.keywords
            sureOption.value = true
            isShowSetting.value = false
          }
        })
  }

}

const noPublishPost = () => {
  isShowSetting.value = false
  emit('sendSettingContents', 'close')
}

const noSure = () => {
  sureOption.value = false
  emit('sendSettingContents', 'close')
}

const confirmSure = () => {
  isSure.value = true
  publishPost()
}

</script>
<style scoped lang="css">
.setting-box {
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;

    .tags-box {
        position: absolute;
        padding: 10px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 0 10px 0 #00000078;
        left: 50%;
        transform: translate(-50%);
        z-index: 100;

        .tags-box-header {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            h1 {
                margin: 0;
                padding: 0;
                margin-right: 10px;
                font-size: 18px;
            }
        }

        .search-box {
            width: 100%;
            height: 30px;
            border-radius: 10px;
            padding: 0 10px;
            border: 1px solid #00000046;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;

            input {
                border: none;
                outline: none;
                flex: 1;
            }
        }

        .tags-select {
            max-height: 800px;
            overflow-y: auto;
            display: flex;

            .zone-1,
            .zone-2 {
                width: 150px;

                ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;

                    li {
                        height: 30px;
                        font-size: 13px;
                        cursor: pointer;
                        user-select: none;

                    }
                  .selected {
                    color: #7ebcff;
                  }
                }
            }

            .zone-3 {
                width: 250px;
                display: flex;
                flex-direction: column;

                .zone-3-list {
                    ul {
                        list-style: none;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        flex-wrap: wrap;

                        li {
                            margin: 5px;
                            label {
                                height: 30px;
                                padding: 5px 10px;
                                background-color: #aec8e06f;
                                margin: 5px;
                                font-size: 13px;
                                border-radius: 5px;
                                cursor: pointer;
                                user-select: none;
                            }
                            .selected {
                              height: 30px;
                              padding: 5px 10px;
                              margin: 5px;
                              font-size: 13px;
                              border-radius: 5px;
                              cursor: pointer;
                              user-select: none;
                              background-color: #7ebcff71;
                            }
                        }
                    }
                }
            }
        }

        .button {
            width: 100%;
            display: flex;
            justify-content: flex-end;

            button {
                width: 60px;
                margin-left: 10px;
                border: none;
                padding: 5px 10px;
                border-radius: 5px;
            }
            button:last-child {
                background-color: #7ebcff;
                color: #fff;
            }
        }
    }
    
    .setting-panel {
        width: 800px;
        background-color: #fff;
        box-shadow: 0 0 10px 0 #00000078;
        border-radius: 10px;
        padding: 20px;
        margin: auto;

        h1 {
            font-size: 25px;
            margin: 0;
            margin-bottom: 20px;
            padding: 0;
        }

        .setting-image {
            width: 100%;
            margin-bottom: 20px;
            display: flex;
            z-index: 1;

            .add-image-box {
                width: 220px;
                height: 130px;
                margin-left: 30px;
                border: 1px dashed #ccc;

                .add-image {
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    span {
                        font-size: 18px;
                        color: #ccc;
                    }
                }

                input {
                    display: none;
                }
            }

            .operate-image-box {
                position: relative;
                width: 220px;
                height: 130px;
                margin-left: 30px;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 10px;
                    cursor: pointer;
                    z-index: 1;
                }

                .change-image {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    label {
                        cursor: pointer;
                        background-color: #0000007d;
                        color: #fffffff4;
                        padding: 5px 10px;
                        border-radius: 5px;
                        margin: 0 2px;
                    }
                    
                    input {
                        display: none;
                    }
                }
                .change-image:hover {
                    background-color: #00000078;
                    border-radius: 10px;
                }
            }
        }

        .setting-tags {
            width: 100%;
            margin-bottom: 20px;
            display: flex;
            align-items: center;

            .tags-list {
                height: 20px;
                border: 1px solid #fdcc91;
                color: #bc843f;
                font-size: 13px;
                padding: 0 10px;
                border-radius: 10px;
                user-select: none;
                display: block;
                gap: 10px;
                margin-right: 10px;

                i {
                    cursor: pointer;
                    font-size: 13px;
                    color: #ccc;
                    font-weight: 600;
                }
            }

            span {
                margin-right: 30px;
            }
            span:last-child {
                color: #ccc;
            }

            .add-tag-button {
                font-size: 20px;
                cursor: pointer;
                color: #ccc;
            }
        }

        .setting-store {
            width: 100%;
            margin-bottom: 20px;
            display: flex;
            align-items: center;

            span {
                margin-right: 30px;
            }

            input {
                margin-right: 3px;
            }

            label {
                font-size: 15px;
                margin-right: 20px;
                cursor: pointer;
            }
        }

        .footer {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
                font-size: 12px;
                color: #aaa;
            }

            .button {
                display: flex;
                gap: 20px;

                button {
                    padding: 5px 20px;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    font-size: 20px;
                    background-color: #7ebcff;
                    border-radius: 5px;
                    color: #ffffff;
                }
                button:first-child {
                    background-color: #ccc;
                }
                button:first-child:hover {
                    background-color: #aaa;
                }
                button:first-child:active {
                    background-color: #999;
                }
                button:last-child:hover {
                    background-color: #5e9bfc;
                }
                button:last-child:active {
                    background-color: #4d8af9;
                }
            }
        }
    }
}
.sure-box {
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;

    .sure-panel {
        width: 400px;
        background-color: #fff;
        box-shadow: 0 0 10px 0 #00000078;
        border-radius: 10px;
        padding: 10px;
        margin: auto;

        .button {
            width: 100%;
            margin-top: 10px;
            display: flex;
            justify-content: flex-end;
    
            button {
            width: 60px;
            margin-left: 10px;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            }
            button:last-child {
            background-color: #7ebcff;
            color: #fff;
            }
        }
    }
}
</style>