<template>
    <div class="main-box">
        <header class="header">
            <div class="select-box">
                <div class="option">
                    <input 
                        type="radio" 
                        id="hot" 
                        name="select" 
                        v-model="selectMain"
                        value="hot"
                        checked
                    >  
                    <label for="hot">热门</label>
                </div>
                <div class="option">
                    <input 
                        type="radio" 
                        id="new" 
                        name="select"
                        v-model="selectMain"
                        value="new"
                    >
                    <label for="new">最新</label>
                </div>
                <div class="option">
                    <input 
                        type="radio" 
                        id="recommend" 
                        name="select"
                        v-model="selectMain"
                        value="recommend"
                    >
                    <label for="recommend">猜你喜欢</label>
                </div>
            </div>
            <div class="more">
                <i 
                    class="iconfont icon-gengduo-2"
                    @mouseover="() => { isShowClassify = true }"
                    @mouseleave="mouseleaveClassifyPop"
                ></i>
                <div class="more-box" v-show="isShowClassify">
                    <div>
                        <input 
                            id="file"
                            type="radio" 
                            name="select-classify"
                            v-model="selectClassify"
                            value="file"
                        >
                        <label for="file">文件</label>
                    </div>
                    <div>
                        <input 
                            id="posts"
                            type="radio"
                            name="select-classify"
                            v-model="selectClassify"
                            value="posts"
                            checked
                        >
                        <label for="posts">帖子</label>
                    </div>
                    <div>
                        <input 
                            id="user"
                            type="radio"
                            name="select-classify"
                            v-model="selectClassify"
                            value="user"
                        >
                        <label for="user">用户</label>
                    </div>
                </div>
            </div>
        </header>
        <section class="section">
            <ShowRecommend 
                class="show-recommend" 
                :classify="selectClassify"
                :mainClassify="selectMain"
            ></ShowRecommend>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ShowRecommend from './show-recommend.vue'

const isShowClassify = ref(false)
const selectMain = ref('hot')
const selectClassify = ref('posts')

const mouseleaveClassifyPop = () => {
    const popup = document.querySelector('.more-box') as Element
    popup.addEventListener('mouseleave', () => {
        isShowClassify.value = false
    })
    const more = document.querySelector('.more') as Element
    more.addEventListener('mouseleave', () => {
        isShowClassify.value = false
    })
}
</script>

<style scoped lang="css">
.main-box {
    width: 790px;
    background-color: #fff;
    display: flex;
    flex-direction: column;

    .header {
        width: 100%;
        height: 50px;
        padding: 0 10px;
        border-bottom: 1px solid #e5e5e583;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .select-box {
            display: flex;

            .option {
                label {
                    margin-right: 20px;
                    user-select: none;
                    cursor: pointer;
                }
                
                input {
                    display: none;
                }
                input:checked + label {
                    color: #275187;
                    font-weight: 700;
                }
            }

        }

        .more {
            i {
                font-size: 20px;
                cursor: pointer;
            }

            .more-box {
                position: absolute;
                width: 120px;
                height: 120px;
                border-radius: 10px;
                background-color: #fff;
                box-shadow: 0 0 15px 1px #dadada;
                padding: 5px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;

                div {
                    width: 100%;
                    height: 30px;
                    cursor: pointer;
                    user-select: none;
                    padding-left: 10px;
                    display: flex;
                    align-items: center;

                    input {
                        display: none;
                    }
                    
                    input:checked + label {
                        color: rgb(139, 165, 199);
                        font-weight: 700;
                    }
                }
                div:hover {
                    background-color: #d7d7d736;
                }
            }
        }
    }

    .section {
        width: 100%;

        .show-recommend {
            width: 100%;
        }   
    }
}
</style>