<template>
    <div class="main-box">
        <div class="preview-box">
            <div class="detail-box">
                <div class="detail">
                    <header class="detail-header">
                        <div class="title">{{ title }}</div>
                        <div class="user">
                            <img :src="avatarUrl">
                            <div>{{ name }}</div>
                        </div>
                    </header>
                    <section class="detail-section">
                        <div style="margin-bottom: 10px;" v-html="content" class="content-html"></div>
                        <div class="time">{{ nowTime() }}</div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount  } from 'vue'
import { useStore } from '@/store/index'

const store = useStore()
const avatarUrl = ref('')
const name = ref('')
const nowTime = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
}

onMounted(() => {
    setAvatarAndName()
})

const title = ref('')
const content = ref('')

const setAvatarAndName = () => {
    if (store.getLoginType() === 1) {
        avatarUrl.value = sessionStorage.getItem("avatarUrl") as string
        name.value = sessionStorage.getItem("Name") as string
    } else {
        avatarUrl.value = localStorage.getItem("avatarUrl") as string
        name.value = localStorage.getItem("Name") as string
    }
    title.value = sessionStorage.getItem("postTitle") as string
    content.value = sessionStorage.getItem("postContent") as string
    console.log(title.value);
    console.log(content.value);
}

onBeforeUnmount(() => {
    sessionStorage.removeItem("postTitle")
    sessionStorage.removeItem("postContent")
})

</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;
    padding: 50px;
    overflow-y: auto;

    .preview-box {
        width: 1000px;
        background-color: #fff;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1) ;
        margin: 0 auto;
        padding: 20px;

        .detail-box {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .detail {
                width: 100%;
                .detail-header {
                    height: 110px;
                    padding-bottom: 20px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #0000001f;
                    display: flex;
                    flex-direction: column;

                    .title {
                        font-size: 25px;
                        font-weight: 600;
                        margin-bottom: 10px;
                    }

                    div {
                        display: flex;
                        align-items: center;

                        div {
                            font-size: 20px;
                            font-weight: 700;
                            margin-right: 10px;
                        }
                    }

                    .user {
                        display: flex;
                        align-items: center;

                        img {
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                            margin-right: 10px;
                        }
                    }
                }

                .detail-section {
                    width: 100%;
                    padding: 0 10px;
                    display: flex;
                    flex-direction: column;

                    .content-html :deep(table) {
                        border: 1px solid black;
                        border-collapse: collapse;
                        padding: 10px;
                    }
                    .content-html :deep(td) {
                        height: 31px;
                        border: 1px solid #ccc;
                        border-collapse: collapse;
                        padding: 10px;
                        line-height: 1.5;
                    }
                    .content-html :deep(th) {
                        height: 31px;
                        background-color: #f5f2f0;
                        border: 1px solid #ccc;
                        border-collapse: collapse;
                    }

                    .content-html :deep(blockquote) {
                        background-color: #f5f2f0;
                        border-left: 8px solid #B4D5FF;
                        display: block;
                        font-size: 100%;
                        line-height: 1.5;
                        margin: 10px 0;
                        padding: 10px;
                    }

                    .content-html :deep(pre) {
                        background-color: #f5f2f0;
                        border: 1px solid #e8e8e8; 
                        border-radius: 5px;
                        box-sizing: border-box;
                        margin: 0;
                        outline: none;
                        padding: 0;
                    }
                    
                    .content-html :deep(code) {   
                        display: block;                     
                        word-wrap: normal;
                        font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
                        -webkit-hyphens: none;
                        hyphens: none;
                        line-height: 1.5;
                        overflow: auto;
                        padding: 1em;
                        -moz-tab-size: 4;
                        -o-tab-size: 4;
                        tab-size: 4;
                        text-align: left;
                        text-shadow: 0 1px #fff;
                        white-space: pre;
                        word-break: normal;
                        word-spacing: normal;
                    }

                    .time {
                        font-size: 14px;
                        color: #8c8c8c;
                        margin-top: 10px;
                    }
                }
            }
        }
    }
}
</style>