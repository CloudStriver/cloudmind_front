<template>
    <div class="comment-box">
        <div class="comment-box-header">
            <div class="title-count">
                <span class="title">评论</span>
                <span class="count">888</span>
            </div>
        </div>
        <div class="my-comment">
            <div class="image">
                <img src="" alt="">
            </div>
            <input type="text" placeholder="写下你的评论吧~">
        </div>
        <div class="comment-list">
            <div class="comment-item">
                <div class="image">
                    <img src="" alt="">
                </div>
                <div class="comment-detail">
                    <p class="name">admin</p>
                    <p class="comment">这是一条评论</p>
                    <div class="footer">
                        <span class="time">2024-04-03 17:01</span>
                        <span class="agree">
                            <i class="iconfont icon-appreciate_light"></i>
                            <span>888</span>
                        </span>
                        <span class="disagree">
                            <i class="iconfont icon-oppose_light"></i>
                            <span>888</span>
                        </span>
                        <span>回复</span>
                    </div>
                    <div class="reply-item">
                        <div class="image">
                            <img src="" alt="">
                        </div>
                        <div class="reply-detail">
                            <div class="reply">
                                <span class="name">admin</span>
                                <span class="contents">这是一条回复</span>
                            </div>
                            <div class="footer">
                                <span class="time">2024-04-03 17:01</span>
                                <span class="agree">
                                    <i class="iconfont icon-appreciate_light"></i>
                                    <span>888</span>
                                </span>
                                <span class="disagree">
                                    <i class="iconfont icon-oppose_light"></i>
                                    <span>888</span>
                                </span>
                                <span>回复</span>
                            </div>
                        </div>
                    </div>
                    <div class="reply-item">
                        <div class="image">
                            <img src="" alt="">
                        </div>
                        <div class="reply-detail">
                            <div class="reply">
                                <span class="name">admin</span>
                                <span class="contents">这是一条回复</span>
                            </div>
                            <div class="footer">
                                <span class="time">2024-04-03 17:01</span>
                                <span class="agree">
                                    <i class="iconfont icon-appreciate_light"></i>
                                    <span>888</span>
                                </span>
                                <span class="disagree">
                                    <i class="iconfont icon-oppose_light"></i>
                                    <span>888</span>
                                </span>
                                <span>回复</span>
                            </div>
                        </div>
                    </div>
                    <div class="more-comments">
                        <span>共18条回复,</span>
                        <span class="more">查看更多</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
</script>
<style scoped lang="css">
.comment-box {
    width: 100%;
    background-color: #fff;
    padding: 10px 20px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

    .comment-box-header {
        margin-bottom: 20px;
        display: flex;

        .title-count {
            display: flex;
            align-items: center;

            .title {
                font-size: 20px;
            }
            .count {
                font-size: 15px;
                color: #a0a0a0;
                margin-left: 10px;
            }

            margin-right: 20px;
        }

        .select {
            display: flex;
            align-items: center;

            input {
                display: none;
            }
            label {
                color: #a0a0a0;
                font-size: 15px;
                cursor: pointer;
                margin-right: 10px;
            }

            input:checked + label {
                color: #000000;
            }

            .hot {
                label {
                    padding-right: 10px;
                    border-right: 1px solid #d1d1d1;
                }
            }
        }
    }

    .my-comment {
        display: flex;
        align-items: center;

        .image {
            width: 40px;
            height: 40px;
            margin-right: 20px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        input {
            width: 100%;
            height: 40px;
            border: 1px solid #c7ddff;
            background-color: #e6f0ff2c;
            border-radius: 5px;
            padding: 0 10px;
            outline: none;
        }
    }

    .comment-list {
        width: 100%;
        padding: 0 10px;
        margin-top: 40px;

        .comment-item {
            border-bottom: 1px solid #eeeeee;
            margin-bottom: 20px;
            display: flex;

            .image {
                width: 40px;
                height: 40px;
                margin-right: 20px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }

            .comment-detail {
                display: flex;
                flex-direction: column;

                .name {
                    font-size: 18px;
                    padding: 0;
                    margin-top: 10px;
                    margin-bottom: 0;
                    color: #5c5c5c;
                }
                
                .comment {
                    font-size: 15px;
                    margin-bottom: 8px;
                }

                .footer {
                    color: #a0a0a0;
                    font-size: 13px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;

                    .time,
                    .agree,
                    .disagree {
                        margin-right: 10px;

                        i {
                            margin-right: 3px;
                        }
                    }
                }

                .reply-item {
                    width: 100%;
                    margin-bottom: 10px;
                    display: flex;

                    .image {
                        width: 35px;
                        height: 35px;
                        margin-right: 20px;

                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }

                    .reply-detail {
                        display: flex;
                        flex-direction: column;

                        .reply {
                            margin-bottom: 8px;

                            .name {
                                color: #5c5c5c;
                                margin-right: 10px;
                            }

                            .contents {
                                font-size: 15px;
                            }
                        }
                    }
                }

                .more-comments {
                    margin-top: -15px;
                    margin-bottom: 10px;
                    color: #a0a0a0;
                    font-size: 13px;

                    .more:hover {
                        color: #7baaef;
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>