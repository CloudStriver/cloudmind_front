<template>
    <div class="editor-box">
        <div class="header">
            <input type="text" placeholder="输入标题..." />
            <div class="options">
                <button>存入草稿</button>
                <button>设置帖子相关信息</button>
                <img src="../../assets//images/logo.png" alt="">
            </div>
        </div>
        <div id="vditor" name="description"></div> 
    </div>
</template>

<script setup lang="ts">
import Vditor from 'vditor'
import "vditor/dist/index.css"
import { onMounted, ref } from 'vue';

const vditor = ref({})
onMounted(() => {
    vditor.value = new Vditor('vditor', {
        placeholder: '输入...',
        theme: 'classic',
        counter: {
            enable: true,
            type: 'markdown'
        },
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
})
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
        justify-content: space-between;
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

            button {
                padding: 10px 20px;
                border: none;
                outline: none;
                cursor: pointer;
                font-size: 20px;
            }
            button:first-child {
                background-color: #f0f0f0;
                border-radius: 5px;
                color: #adadad;
            }
            button:nth-child(2) {
                background-color: #7ebcff;
                border-radius: 5px;
                color: #ffffff;
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