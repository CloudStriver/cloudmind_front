<template>
    <div class="setting-box">
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
                    <p>一级分区</p>
                    <ul>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                    </ul>
                </div>
                <div class="zone-2">
                    <p>二级分区</p>
                    <ul>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                    </ul>
                </div>
                <div class="zone-3">
                    <p>添加标签</p>
                    <div class="zone-3-button">
                        <button>标签1</button>
                        <button>标签1</button>
                        <button>标签1</button>
                        <button>标签1</button>
                        <button>标签1</button>
                    </div>
                </div>
            </div>
            <div class="button">
                <button>取消</button>
                <button>确定</button>
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
                <span 
                    class="tags-list"
                    v-for="(tag, index) in tagsList"
                    :key="index"
                >
                    {{ tag }}
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
                    checked
                >
                <label for="public">公开</label>
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
            <div class="footer">
                <span>PS: 至少选择一个标签噢</span>
                <div class="button">
                    <button>取消</button>
                    <button>发布</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const isHasUploadImage = ref(false)
const ishowImageOperate = ref(false) 
const isShowAddTags = ref(false)
const coverImageUrl = ref('')
const tagsList = ref([])

const addTags = () => {
    isShowAddTags.value = true
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
                    }
                }
            }

            .zone-3 {
                width: 250px;
                display: flex;
                flex-direction: column;

                .zone-3-button {
                    display: flex;
                    flex-wrap: wrap;

                    button {
                        width: auto;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 5px;
                        background-color: #aec8e06f;
                        color: #707f8e;
                        margin: 5px;
                        cursor: pointer;
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
</style>