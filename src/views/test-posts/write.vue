<template>
    <div class="write-box">
        <Editor 
            class="editor-box"
            :sendOperateType="createPostData"
            @sendEditorContents="getEditorText"
        />
        <div class="setting-box" v-if="isClickSettingButton">
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
                        <img :src="coverImageUrl">
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
                    <span class="tags-list">
                        标签1
                        <i class="iconfont icon-cuowu1"></i>
                    </span>
                    <span>
                        <i 
                            class="iconfont icon-jia add-tag-button" 

                        ></i>
                    </span>
                </div>
                <div class="setting-store">
                    <span>设置存储位置</span>
                    <input 
                        type="radio" 
                        name="place" 
                        id="public"
                    >
                    <label for="public">本地</label>
                    <input 
                        type="radio" 
                        name="place" 
                        id="private"
                    >
                    <label for="private">私密</label>
                    <input 
                        type="radio" 
                        name="place" 
                        id="draft"
                    >
                    <label for="draft">草稿箱</label>
                </div>
                <div class="button">
                    <button>取消</button>
                    <button>发布</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Editor from './text-editor.vue'
import { ref, onBeforeMount } from 'vue'

const createPostData = ref('')
const coverImageUrl = ref('')
const isHasUploadImage = ref(false)
const ishowImageOperate = ref(false) 
const isClickSettingButton = ref(false)

onBeforeMount(() => {
    const option = location.href.split('/').pop()
    const type = option === 'write' ? '设置' : option === 'edit' ? '编辑' : ''
    createPostData.value = type
})

const getEditorText = () => {
    isClickSettingButton.value = true
}
const uploadCoverImage = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file == null) return
    isHasUploadImage.value = true
    coverImageUrl.value = URL.createObjectURL(file)
}
</script>

<style scoped lang="css">
.write-box {
    position: relative;
    width: 100%;
    height: 100%;

    .setting-box {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 10px;
        background-color: #00000078;
        top: 0;
        left: 0;
        z-index: 100;
        overflow-y: auto;
        display: flex;
        justify-content: center;

        .setting-panel {
            width: 800px;
            background-color: #fff;
            box-shadow: 0 0 10px 0 #00000078;
            border-radius: 10px;
            margin: auto;
            padding: 20px;

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
                    font-size: 25px;
                    cursor: pointer;
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

            .button {
                width: 100%;
                display: flex;
                justify-content: flex-end;
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
</style>