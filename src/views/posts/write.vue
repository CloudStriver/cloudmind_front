<template>
  <div class="main-box">
    <div class="editor-box">
      <header class="header">
        <i class="iconfont icon-ffanhui- back"></i>
        <Toolbar
          class="toolbar"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        />
      </header>
      <section class="section">
        <div class="input">
          <input 
            type="text" 
            placeholder="请输入标题(最多50字)"
            v-model="postTitle"
          >
        </div>
        <Editor
          class="editor"
          style="min-height: 700px; overflow-y: hidden;"
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
        />
        <div class="footer">
          <div class="add-image">
            <div>设置帖子封面</div>
            <label for="image">
              <div class="label">
                <div>+ 添加图片</div>
              </div>  
            </label>
            <input 
              type="file" 
              id="image"
              style="display: none;"
            >
          </div>
          <div class="add-tag">
            <div>添加帖子标签</div>
            <input type="text">
            <i class="iconfont icon-jia"></i>
          </div>
          <div class="operate">
            <button @click="previewPost">预览</button>
            <button>发布</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
  components: { Editor, Toolbar },
  setup() {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()

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
    const editorConfig = { placeholder: '请输入内容...' }
    const postTitle = ref('') // 文章标题

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor == null) return
        editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    const clickFabu = () => {
      console.log(editorRef.value.getHtml()) // 获取内容
    }

    const previewPost = () => {
      sessionStorage.setItem('postTitle', postTitle.value)
      sessionStorage.setItem('postContent', editorRef.value.getHtml())
      console.log(editorRef.value.getHtml())
      window.open('/write/preview')
    }

    return {
      editorRef,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      postTitle,
      handleCreated,
      clickFabu,
      previewPost
    }; 
  }
}
</script>    

<style scoped lang="css">
.main-box {
  width: 100%;
  background-color: #fff;
  overflow-y: auto;
  display: flex;

  .editor-box {
    width: 100%;
    padding-bottom: 20px;
    margin: 0 auto;
    box-sizing: border-box;
    background-color: #f5f5f5;
    border-radius: 5px;
    border: 1px solid #ccc;

    .header {
      position: fixed;
      width: 100%;
      top: 0px;
      background-color: #fff;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
      margin: 0 auto;
      margin-bottom: 20px;
      z-index: 3;
      display: flex;
      justify-content: center;

      .back {
        position: absolute; 
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

    .section {
      width: 1000px;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      margin: auto;
      margin-top: 80px;
      padding: 20px;
      background-color: #fff;

      .input {
        font-weight: 700;
        background-color: #fff;
  
        input {
          width: 100%;
          font-size: 30px;
          font-weight: 700;
          box-sizing: border-box;
          border-radius: 5px;
          border: none;
          border-bottom: 1px solid #ccc;
          outline: none;
          padding-bottom: 20px;
        }
        input::placeholder {
          font-size: 30px;
          color: #adadad;
        }
      }
  
      .editor {
        background-color: #fff;
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
        color: #fff;
      }

      .footer {
        margin: 0 auto;
        background-color: #fff;

        .add-image {
          margin-bottom: 20px;
          display: flex;
          
          .label {
            width: 200px;
            height: 150px;
            margin-left: 30px;
            border: 1px dashed #ccc;

            div {
              font-size: 20px;
              color: #ccc;
              text-align: center;
              line-height: 150px;
            }
          }
        }

        .add-tag {
          height: 50px;
          display: flex;
          align-items: center;

          input {
            width: 150px;
            height: 30px;
            margin-left: 30px;
            padding-left: 10px;
            border: 1px solid #ccc;
          }

          i {
            font-size: 30px;
            margin-left: 20px;
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
        }
      }
    }
  }
}
</style>
