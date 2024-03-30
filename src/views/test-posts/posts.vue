<template>
    <div class="posts-box">
        <CHeader class="cheader"></CHeader>
        <section class="section">
            <nav class="nav">
                <ul>
                    <li>
                        <input 
                            type="radio"
                            name="nav"
                            id="follow"
                            value="follow"
                            v-model="navSelect"
                            checked
                        >
                        <label for="follow"><i class="iconfont icon-shoucang01"></i>关注</label>
                    </li>
                    <li>
                        <input 
                            type="radio"
                            name="nav"
                            id="all"
                            value="all"
                            v-model="navSelect"
                        >
                        <label for="all"><i class="iconfont icon-fenlei"></i>全部</label>
                    </li>
                    <li>
                        <input 
                            type="radio"
                            name="nav"
                            id="choice"
                            value="choice"
                            v-model="navSelect"
                        >
                        <label for="choice"><i class="iconfont icon-fenlei"></i>选项</label>
                    </li>
                </ul>
            </nav>
            <div class="posts">
                <div class="posts-select">
                    <ul>
                        <li>
                            <input 
                                type="radio"
                                name="posts"
                                id="recommend"
                                checked
                            >
                            <label for="recommend">推荐</label>
                        </li>
                        <li>
                            <input 
                                type="radio"
                                name="posts"
                                id="hot"
                            >
                            <label for="hot">热门</label>
                        </li>
                    </ul>
                </div>
                <div></div>
            </div>
            <div class="rank-create">
                <div class="create-post">
                    <button @click="router.push('/test/editor')">创建帖子</button>
                </div>
                <div class="post-rank">
                    <div class="post-rank-title">
                        <span>
                            <span class="post-rank-span">文章排行榜</span>
                        </span>
                        <span class="refresh-post-rank">
                            <i class="iconfont icon-undo-alt-solid"></i>
                            换一换</span>
                    </div>
                    <div class="posts-rank-contents">
                        <ul>
                            <li>
                                <span>1</span>
                                <span>这是一个标题</span>
                            </li>
                            <li>
                                <span>2</span>
                                <span>这是一个标题</span>
                            </li>
                            <li>
                                <span>3</span>
                                <span>这是一个标题</span>
                            </li>
                            <li>
                                <span>4</span>
                                <span>这是一个标题</span>
                            </li>
                            <li>
                                <span>5</span>
                                <span>这是一个标题</span>
                            </li>
                        </ul>
                    </div>
                    <div class="post-rank-more">查看更多</div>
                </div>
                <div class="author-rank">
                    <div class="author-rank-title">
                        <span>
                            <span class="author-rank-span">作者排行榜</span>
                        </span>
                    </div>
                    <div class="author-rank-contents">
                        <ul>
                            <li>
                                <div class="author">
                                    <div>
                                        <img src="" alt="">
                                    </div>
                                    <div>
                                        <p>作者1</p>
                                        <p>作者简介</p>
                                    </div>
                                </div>
                                <button>关注</button>
                            </li>
                            <li>
                                <div class="author">
                                    <div>
                                        <img src="" alt="">
                                    </div>
                                    <div>
                                        <p>作者1</p>
                                        <p>作者简介</p>
                                    </div>
                                </div>
                                <button>关注</button>
                            </li>
                        </ul>
                    </div>
                    <div class="author-rank-more">查看更多</div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import CHeader from '@/components/header.vue'
import { ref } from 'vue'
import router from '@/router'

const navSelect = ref('follow')
</script>

<style scoped lang="css">
.posts-box {
    width: 100%;
    height: 100%;
    background-color: rgba(240, 245, 255, 0.5);
    display: flex;
    flex-direction: column;

    .cheader {
        width: 100%;
        height: 80px;
    }

    .section {
        width: 100%;
        flex: 1;
        padding: 10px 5% 0;
        overflow-y: auto;
        display: flex;
        justify-content: center;

        .nav {
            width: 200px;
            height: 130px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);
            margin-right: 30px;
            
            ul {
                list-style: none;
                padding: 0;
                margin: 0;

                li {
                    cursor: pointer;
                    display: flex;
                    align-items: center;

                    i {
                        font-size: 20px;
                        margin-right: 10px;
                    }

                    input {
                        display: none;
                    }

                    label {
                        width: 100%;
                        padding: 10px;
                        font-size: 16px;
                    }

                    input:checked + label {
                        color: #1890ff;
                        background-color: #f0f5ff;
                    }
                }
            }
        }

        .posts {
            width: 1000px;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);
            margin-right: 30px;

            .posts-select {
                border-bottom: 1px solid #f0f0f0;
                display: flex;

                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;

                    li {
                        margin-right: 10px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;

                        input {
                            display: none;
                        }

                        label {
                            padding: 10px;
                            font-size: 16px;
                        }

                        input:checked + label {
                            border-bottom: 2px solid #1890ff;
                        }
                    }
                }
            }
        }
        .rank-create {
            width: 250px;

            .create-post {
                width: 100%;
                height: 50px;
                border-radius: 5px;
                margin-bottom: 20px;
                display: flex;
                justify-content: center;
                align-items: center;

                button {
                    width: 100%;
                    height: 80%;
                    background-color: #1890ff;
                    box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);
                    color: #fff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
            }

            .post-rank {
                width: 100%;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);
                padding: 15px;
                margin-bottom: 30px;

                .post-rank-title {
                    padding-bottom: 10px;
                    border-bottom: 1px solid #f0f0f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .post-rank-span {
                        font-size: 16px;
                        font-weight: 600;
                    }

                    .refresh-post-rank {
                        color: rgb(132, 132, 132);
                        font-size: 12px;
                        cursor: pointer;
                        

                        i {
                            font-size: 12px;
                            margin-right: 5px;
                        }
                    }
                }

                .posts-rank-contents {
                    ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;

                        li {
                            display: flex;
                            align-items: center;
                            padding: 10px 0;

                            span {
                                font-size: 16px;
                                margin-right: 20px;
                            }
                        }
                    }
                }

                .post-rank-more {
                    padding: 10px 0 0 0;
                    text-align: center;
                    cursor: pointer;
                    font-size: 13px;
                    color: rgb(132, 132, 132);
                    border-top: 1px solid #f0f0f0;
                }
            }

            .author-rank {
                width: 100%;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px 1px rgba(136, 136, 136, 0.1);
                padding: 15px;

                .author-rank-title {
                    padding-bottom: 10px;
                    border-bottom: 1px solid #f0f0f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .author-rank-span {
                        font-size: 16px;
                        font-weight: 600;
                    }
                }

                .author-rank-contents {
                    ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;

                        li {
                            padding: 15px 0;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;

                            .author {
                                margin-right: 10px;
                                display: flex;
                                align-items: center;

                                img {
                                    width: 40px;
                                    height: 40px;
                                    border-radius: 50%;
                                    margin-right: 10px;
                                }
    
                                p {
                                    margin: 0;
                                }
                                p:first-child {
                                    font-size: 15px;
                                }
                                p:last-child {
                                    font-size: 12px;
                                    color: rgb(132, 132, 132);
                                }
                            }

                            button {
                                width: 60px;
                                height: 30px;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                background-color: #ffede0;
                                color: #a37658;
                            }
                        }
                    }
                }

                .author-rank-more {
                    padding: 10px 0 0 0;
                    text-align: center;
                    cursor: pointer;
                    font-size: 13px;
                    color: rgb(132, 132, 132);
                    border-top: 1px solid #f0f0f0;
                }
            }
        }
    }
}
</style>