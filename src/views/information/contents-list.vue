<template>
    <div class="list-box">
        <div v-if="isFollow" class="contents">
            <div class="detail">
                <h1>标题</h1>
                <p>内容</p>
                <footer class="detail-footer">
                    <div class="situation">
                        <div 
                            class="like"
                        >
                            <i class="iconfont icon-a-dianzan2"></i>
                            <div>点赞</div>
                        </div>
                        <div 
                            class="liked" 
                        >
                            <i class="iconfont icon-a-dianzan2"></i>
                            <div>已点赞 1k</div>
                        </div>
                        <div class="remark">
                            <i class="iconfont icon-a-xiaoxi1"></i>
                            <div>评论 1k</div>
                        </div>
                        <div 
                            class="collect" 
                        >
                            <i class="iconfont icon-shoucang01"></i>
                            <div>收藏</div>
                        </div>
                        <div 
                            class="collected" 
                        >
                            <i class="iconfont icon-shoucang01"></i>
                            <div>已收藏</div>
                        </div>
                        <div class="share">
                            <i class="iconfont icon-fenxiang"></i>
                            <div>分享</div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
        <div v-if="!isFollow" class="contents">
            <div class="header">
                <ul>
                    <li>
                        <input 
                            type="radio"
                            name="select"
                            id="headerFollow"
                            v-model="select"
                            value="headerFollow"
                        >
                        <label for="headerFollow">关注</label>
                    </li>
                    <li>
                        <input 
                            type="radio"
                            name="select"
                            id="fans"
                            value="fans"
                            v-model="select"
                        >
                        <label for="fans">粉丝</label>
                    </li>
                    <li>
                        <input 
                            type="radio"
                            name="select"
                            id="zone"
                            value="zone"
                            v-model="select"
                            checked
                        >
                        <label for="zone">关注的分区</label>
                    </li>
                </ul>
            </div>
            <div class="detail-follow">
                <div class="image">
                    <img src="" alt="">
                </div>
                <div class="user">
                    <p>admin</p>
                    <p>内容</p>
                </div>
                <div class="button">
                    <button>已关注</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const select = ref('follow')
const isFollow = ref(false)
</script>
<style scoped lang="css">
.list-box {
    .contents {
        padding: 10px;

        .detail {
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 10px;
            margin-bottom: 10px;
            
            h1 {
                font-size: 20px;
                font-weight: 600;
                margin: 0;
            }
            
            .detail-footer {
                position: relative;
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
        
                .situation {
                    display: flex;
        
                    .like, 
                    .liked,
                    .remark,
                    .collect,
                    .collected,
                    .share,
                    .more{
                        display: flex;
                        align-items: center;
                        margin-right: 20px;
                        cursor: pointer;
        
                        i {
                            font-size: 20px;
                            margin-right: 5px;
                        }
                    }
        
                    .liked {
                        color: #6d99ec;
                        font-weight: 600;
                    }
        
                    .collected {
                        color: #ff9d5b;
                        font-weight: 600;
                    }
                }
            }
        }

        .header {
            width: 100%;
            padding-bottom: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;

            ul {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;

                li {
                    margin-right: 20px;

                    input {
                        display: none;
                    }
                    input:checked + label {
                        color: #6d99ec;
                    }

                    label {
                        cursor: pointer;
                        user-select: none
                    }
                }
            }
        }

        .detail-follow {
            position: relative;
            padding-bottom: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            align-items: center;

            .image {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 20px;

                img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }
            }

            .user {
                p {
                    margin: 0;
                }
                p:last-child {
                    color: rgb(99, 99, 99);
                    font-size: 13px;
                    margin-top: 5px;
                }
            }

            .button {
                position: absolute;
                right: 0;

                button {
                    background-color: #fff;
                    border: 1px solid #919191;
                    padding: 2px 15px;
                    border-radius: 10px;
                }
            }
        }
    }
}
</style>