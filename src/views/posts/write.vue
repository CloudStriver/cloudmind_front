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
          >
        </div>
        <Editor
          class="editor"
          style="height: 500px; overflow-y: hidden;"
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
            <button>预览</button>
            <button>发布</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
  components: { Editor, Toolbar },
  setup() {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()

    const toolbarConfig = {}
    const editorConfig = { placeholder: '请输入内容...' }

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

    return {
      editorRef,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      clickFabu
    }; 
  }
}
</script>    

<style scoped lang="css">
.main-box {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow-y: hidden;
  display: flex;

  .editor-box {
    width: 100%;
    padding-bottom: 20px;
    margin: 0 auto;
    box-sizing: border-box;
    background-color: #f5f5f5;
    border-radius: 5px;
    border: 1px solid #ccc;
    overflow-y: auto;

    .header {
      width: 100%;
      background-color: #fff;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      z-index: 10;
      display: flex;

      .back {
        font-size: 35px;
        margin-left: 10px;
        cursor: pointer;
        color: #b9b9b9;
      }
      .back:hover {
        color: #000;
      }

      .toolbar {
        margin: 0 auto;
      }
    }

    .section {
      width: 60%;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      margin: auto;
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
          color: #727272;
        }
      }
  
      .editor {
        background-color: #fff;
        overflow-y: hidden;
        border-bottom: 1px solid #ccc;
        background-color: #833636;
        margin-bottom: 20px;
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
            background-color: #ccc;
            color: #4e4c4c;
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
