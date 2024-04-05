<template>
  <div class="main-box" @click="handleClickTagOutside">
    <header class="header-box">
      <i class="iconfont icon-ffanhui- back"></i>
      <Toolbar
        class="toolbar"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="'default'"
      />
    </header>
    <section class="section-box">
      <div class="section">
        <div class="input">
          <input 
            type="text" 
            placeholder="请输入标题(最多50字)"
            v-model="postTitle"
          >
        </div>
        <Editor
          class="editor"
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          :mode="'default'"
          @onCreated="handleCreated"
        />
        <div class="footer">
          <div class="image-box">
            <div>设置帖子封面</div>
            <div v-if="!isUploadImage" class="add-image">
              <label for="image">
                <div class="label">
                  <div>+ 添加图片</div>
                </div>  
              </label>
              <input 
                @change="uploadCoverImage($event)"
                type="file" 
                id="image"
                style="display: none;"
              >
            </div>
            <div v-if="isUploadImage" class="change-image">
              <label for="changeImage">
                <div>
                  <img :src="coverImage" @mousemove="showOperateImage">
                </div>
                <div 
                  class="operate-image" 
                  v-show="isShowOperate"
                  @mouseleave="showOperateImage"
                >
                  <label for="image">更换</label>
                  <input 
                    @change="uploadCoverImage($event)"
                    type="file" 
                    id="image"
                    style="display: none;"
                  >
                  <button @click="deleteImage">删除</button>
                </div>
              </label>
            </div>
          </div>
          <div class="add-tag-box">
            <div 
              class="tag-contents" 
              :style="{left: tagContentsLeft + 'px'}"
              v-show="isShowSearchTag"
            >
              <div class="search">
                <i class="iconfont icon-sousuo"></i>
                <input 
                  v-model="searchContent"
                  type="text"
                  @keydown="getTagList"
                >
              </div>
              <div class="cur-tag-box">
                <div 
                  class="cur-tag" 
                  v-for="(tag, index) in tagsList"
                  :key="index"
                  @click="selectTag(tag)"
                >{{ tag }}</div>
              </div>
            </div>
            <div style="margin-right: 20px;">添加帖子标签</div>
            <div
              class="tag"
              v-for="(tag, index) in nowTagsList"
              :key="index"
            >
              <div>{{ tag }}</div>
              <i class="iconfont icon-cuowu1" @click="deleteTag(index)"></i>
            </div>
            <i 
              class="iconfont icon-jia add-tag-button" 
              v-if="nowTagsCount < 5"
              @click="addTags($event)"
            ></i>
          </div>
          <div class="operate">
            <button @click="previewPost" :disabled="isOperate">预览</button>
            <button @click="publishPost" :disabled="isOperate">发布</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import SparkMD5 from 'spark-md5'
import { errorMsg, successMsg } from '@/utils/message'
import { debounce } from '@/utils/optimize'
import { cosUploadImage } from '@/utils/public-cos'
import { getTagsList } from './utils'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { onBeforeUnmount, onUpdated, ref, shallowRef } from 'vue'
import { post } from '@/utils/request'
import router from '@/router'
import {CreatePostUrl, StoragePostContent, StoragePostTitle} from "@/utils/consts";

const coverImage = ref('') // 封面图片
const valueHtml = ref('') // 文章内容
const postTitle = ref('') // 文章标题
const searchContent = ref('') 
const nowPostContent = ref('')
const editorRef = shallowRef()
const imageFile = ref()
const isSure = ref(false)
const isOperate = ref(true)
const isShowOperate = ref(false)
const isUploadImage = ref(false)
const isHasKeyWords = ref(false)
const isShowSearchTag = ref(false)
const nowTagsCount = ref(0)
const tagContentsLeft = ref(0)
const createFileType = ref(1)
const tagsList = ref<string[]>([])
const nowTagsList = ref<string[]>([])
const keywordList = ref({
  title: [],
  content: []
})
const editorConfig = { placeholder: '请输入内容...' }
const toolbarConfig = {
  toolbarKeys: [
    // 一些常用的菜单 key
    'undo', // 撤销
    'redo', // 重做
    'clearStyle', // 清除格式
    '|',
    'headerSelect', // 标题
    'blockquote', // 引用
    "codeBlock", // 代码块
    'bold', // 加粗
    'italic', // 斜体
    'through', // 删除线
    'underline', // 下划线
    'divider', // 分割线
    'bulletedList', // 无序列表
    'numberedList', // 有序列表
    'color', // 文字颜色
    "bgColor", // 背景颜色
    'insertLink', // 插入链接
    'fontSize', // 字体大小
    "fontFamily",
    'lineHeight', // 行高
    'uploadImage', // 上传图片
    'uploadVideo',//上传视频
    'delIndent', // 缩进
    'indent', // 增进
    'deleteImage',//删除图片
    'insertTable', // 插入表格
    'justifyCenter', // 居中对齐
    'justifyJustify', // 两端对齐
    'justifyLeft', // 左对齐
    'justifyRight', // 右对齐
  ]
}

onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

onUpdated(() => {
  if (postTitle.value && valueHtml.value !== '<p><br></p>') {
    isOperate.value = false
  } else {
    isOperate.value = true
  }
})

const getTagList = debounce(async() => {
  if (!searchContent.value) {
    return
  }
  tagsList.value = await getTagsList(searchContent.value).then()
}, 500)
const deleteTag = (index: number) => {
  nowTagsCount.value --
  nowTagsList.value.splice(index, 1)
}
const selectTag = (tag: string) => {
  if (nowTagsList.value.includes(tag)) {
    errorMsg('已经添加过该标签了');
    return
  }
  nowTagsCount.value ++
  nowTagsList.value.push(tag)
}
const addTags = (event: Event) => {
  const target = event.target as HTMLElement
  const left = target.offsetLeft
  tagContentsLeft.value = left
  isShowSearchTag.value = true
}
const handleClickTagOutside = (event: Event) => {
  if ((event.target as HTMLElement).closest('.add-tag-button') || (event.target as HTMLElement).closest('.search')) {
    isShowSearchTag.value = true
  }
  else {
    isShowSearchTag.value = false
    searchContent.value = ''
  }
}

const deleteImage = () => {
  coverImage.value = ''
  isUploadImage.value = false
}

const showOperateImage = () => {
  isShowOperate.value = !isShowOperate.value
}

const uploadCoverImage = (event: Event) => {
  
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file == null) return
  imageFile.value = file
  isUploadImage.value = true
  coverImage.value = URL.createObjectURL(file)
}

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const createPost = (url: string) => {
  post(false, CreatePostUrl, {
    title: postTitle.value,
    text: valueHtml.value,
    tags: nowTagsList.value,
    status: createFileType.value,
    url: url,
    isSure: isSure.value
  })
  .then((res: any) => {
    console.log(res)
    if(res.keywords === null) {
      successMsg('发布成功')
      postTitle.value = ''
      valueHtml.value = ''
      coverImage.value = ''
      nowTagsList.value = []
      isOperate.value = true
      sessionStorage.removeItem(StoragePostTitle)
      sessionStorage.removeItem(StoragePostContent)
      router.push('/posts')
    }
    else {
      isHasKeyWords.value = true
      keywordList.value = {
        title: res.keywords[0],
        content: res.keywords[1]
      }
    }
  })
}
const publishPost = () => {
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
        createPost(url.value)
        cosUploadImage(imageFile.value, md5, suffix, async () => {})
    }
  }
  else {
    createPost(url.value)
  }
}
const previewPost = () => {
  const originalText  = editorRef.value.getHtml()
  const withoutFirstP = originalText.slice(3)
  nowPostContent.value = withoutFirstP.slice(0, withoutFirstP.length - 4)
  sessionStorage.setItem(StoragePostTitle, postTitle.value)
  sessionStorage.setItem(StoragePostContent, nowPostContent.value)
  window.open('/write/preview')
}
</script>    

<style scoped lang="css">
.main-box {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;

  .header-box {
    background-color: #fff;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    z-index: 3;
    display: flex;

    .back {
      top: 0;
      left: 10px;
      font-size: 35px;
      margin-left: 10px;
      cursor: pointer;
      color: #b9b9b9;
    }
    .back:hover {
      color: #000;
    }
  }

  .section-box {
    width: 100%;
    height: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex; 
    justify-content: center;
    overflow-y: auto;

    .section {
      width: 1000px;

      .input {
        font-weight: 700;
        background-color: #fff;
  
        input {
          width: 980px;
          font-size: 30px;
          font-weight: 700;
          border: none;
          border-bottom: 1px solid #cccccc41;
          outline: none;
          padding: 20px 0;
          margin: 0 10px;
        }
        input::placeholder {
          font-size: 30px;
          color: #adadad;
        }
      }

      .footer {
        padding: 10px;
        background-color: #fff;
  
        .image-box {
          border-top: 1px solid #cccccc41;
          padding-top: 20px;
          margin-bottom: 20px;
          display: flex;
  
          .change-image {
            label {
              position: relative;
              cursor: pointer;
  
              .operate-image {
                position: absolute;
                width: 220px;
                height: 130px;
                top: 0;
                background-color: #7f7f7f4d;
                display: flex;
                justify-content: center;
                align-items: center;
  
                button {
                  width: 50px;
                  height: 30px;
                  background-color: #000000;
                  color: #fff;
                  font-size: 14px;
                  border: none;
                  margin: 1px;
                  cursor: pointer;
                }
                label {
                  width: 50px;
                  height: 30px;
                  background-color: #000000;
                  color: #fff;
                  font-size: 14px;
                  border: none;
                  margin: 1px;
                  cursor: pointer;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                
              }
  
              div {
                width: 220px;
                height: 130px;
                margin-left: 30px;
                cursor: pointer;
  
                img {
                  width: 100%;
                  height: 100%;
                  border-radius: 5px;
                  object-fit: cover; 
                  display: block;
                }
              }
            }
          }
          
          .add-image {
            .label {
              width: 220px;
              height: 130px;
              margin-left: 30px;
              border: 1px dashed #ccc;
              cursor: pointer;
              display: flex;
              justify-content: center;
              align-items: center;
  
              div {
                font-size: 20px;
                color: #ccc;
                text-align: center;
                line-height: 150px;
              }
            }
          }
        }
  
        .add-tag-box {
          position: relative;
          height: 50px;
          display: flex;
          align-items: center;
  
          .tag-contents {
            position: absolute;
            width: 250px;
            bottom: 50px;
            padding: 10px;
            border-radius: 5px;
            background-color: #fff;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  
            .search {
              width: 100%;
              height: 40px;
              border: 1px solid #ccc;
              border-radius: 60px;
              padding-left: 10px;
              margin-top: 10px;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
  
              i {
                font-size: 20px;
                font-weight: 700;
                color: #2e4482;
                margin-right: 10px;
              }
  
              input {
                width: 80%;
                height: 30px;
                border: none;
                outline: none;
              }
            }
  
            .cur-tag-box {
              width: 100%;
              max-height: 250px;
              overflow-y: auto;
  
              .cur-tag {
                width: 100%;
                height: 40px;
                padding-left: 10px;
                line-height: 40px;
                color: #000;
                cursor: pointer;
              }
              .cur-tag:hover {
                background-color: #f5f5f5;
              }
            }
          }
  
          .tag {
            height: 35px;
            padding: 8px 15px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            border: 1px solid #ccc;
            border-radius: 20px;
            color: #3b5393;
  
            i {
              font-size: 20px;
              color: #ccc;
              cursor: pointer;
            }
          }
  
  
          i {
            margin-left: 5px;
            font-size: 25px;
            color: #ccc;
            cursor: pointer;
          }
        }
  
        .operate {
          display: flex;
          justify-content: flex-end;
  
          button {
            width: 100px;
            height: 40px;
            font-size: 20px;
            margin-left: 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
  
          button:nth-child(1) {
            background-color: #cccccc8b;
            color: #4e4c4c93;
          }
          button:nth-child(2) {
            background-color: #5383dd;
            color: #fff;
          }
  
          button:disabled {
            opacity: 0.5;
          }
        }
      }
    }
  }
}
</style>
