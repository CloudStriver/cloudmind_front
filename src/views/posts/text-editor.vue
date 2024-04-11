<template>
    <div class="editor-box">
        <div class="header">
            <input type="text" placeholder="输入标题..." v-model="title"/>
            <div class="options">
                <button class="button-setting" @click="sendEditorMsg">{{ operateType }}帖子相关信息</button>
                <img src="../../assets/images/logo.png" alt="">
            </div>
        </div>
        <div id="vditor" name="description"></div> 
    </div>
</template>

<script setup lang="ts">
import Vditor from 'vditor'
import "vditor/dist/index.css"
import { onMounted, ref } from 'vue';
import {errorMsg} from "@/utils/message";
import {StoragePostContent, StoragePostId, StoragePostTitle} from "@/utils/consts";

const props = defineProps<{
    sendOperateType: string
}>()
const vditor = ref()
const title = ref<string>(sessionStorage.getItem(StoragePostTitle) as string)
const operateType = ref<string>('')
const emit = defineEmits(['sendEditorContents'])

onMounted(() => {
    vditor.value = new Vditor('vditor', {
        placeholder: '输入...',
        theme: 'classic',
        counter: {
            enable: true,
            type: 'markdown'
        },
        value: sessionStorage.getItem(StoragePostContent) as string,
        preview: {
        delay: 0,
        hljs: {
            style: 'monokai',
            lineNumber: true
        }
        },
        tab: '\t',
        typewriterMode: true,
        toolbarConfig: {
            pin: true
        },
        cache: {
            enable: false
        },
        mode: 'sv',
        toolbar: [
            'undo',
            'redo',
            '|',
            'emoji',
            'headings',
            'bold',
            'italic',
            'strike',
            'link',
            '|',
            'list',
            'ordered-list',
            'check',
            'outdent',
            'indent',
            '|',
            'quote',
            'line',
            'code',
            'inline-code',
            'insert-before',
            'insert-after',
            '|',
            'table',
            'edit-mode',
            'code-theme',
            {
                name: 'more',
                toolbar: [
                    'fullscreen',
                    'both',
                    'preview',
                    'info',
                    'help',
                ],
            }
        ],
    })
    if (props.sendOperateType !== '') {
        operateType.value = props.sendOperateType
    }
})

const sendEditorMsg = () => {
    const text = vditor.value.getValue()
    if(title.value === "") {
      errorMsg("标题不能为空！")
      return
    }
  if(text === '\n') {
    errorMsg("内容不能为空")
    return
  }
    emit('sendEditorContents', {
        title: title.value,
        text: text,
    })
}
</script>

<style scoped lang="css">
.editor-box {
    width: 100%;
    height: 100%;
    background-color: #fafbfc;
    display: flex;
    flex-direction: column;

    .header {
        display: flex;
        align-items: center;

        input {
            height: 60px;
            flex: 1;
            border: none;
            outline: none;
            font-size: 30px;
            padding: 0 20px;
            margin-right: 10px;
            background-color: #ffffff00;
        }
        input::placeholder {
            color: #c0c4cc;
        }

        .options {
            display: flex;
            align-items: center;
            gap: 20px;

            .button-setting {
                padding: 10px 20px;
                border: none;
                outline: none;
                cursor: pointer;
                font-size: 20px;
                background-color: #7ebcff;
                border-radius: 5px;
                color: #ffffff;
            }
            .button-setting:hover {
                background-color: #5e9bfc;
            }
            .button-setting:active {
                background-color: #4d8af9;
            }

            img {
                transform: scale(0.6);
            }
        }
    }

    #vditor {
        flex: 1;
    }
}

</style>