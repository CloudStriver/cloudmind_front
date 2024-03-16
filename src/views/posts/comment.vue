<template>
    <div class="comment-box">
        <h4>评论 50</h4>
        <div class="write-comment">
            <input type="text" placeholder="写下你的评论...">
        </div>
        <div class="comments-panel">
            <div class="user-comment">
                <!-- <img src="" alt=""> -->
                <div class="user">
                    <div class="img"></div>
                    <span>admin</span>
                </div>
                <div class="comment">
                    访问首页之后 是spa应用 如果这个时候刷新页面 则会请求服务端 生成页面 这样子 即有了单页的优势，又有多页 seo的优势
                </div>
                <div class="footer">
                    <span>2021-10-10 10:10</span>
                    <span>
                        <i></i>
                        <span>点赞</span>
                    </span>
                    <span>
                        <i></i>
                        <span>70</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="css">
.comment-box {
    background-color: #fff;
    padding: 20px;

    h4 {
        margin: 0;
        margin-bottom: 10px;
    }

    .write-comment {
        width: 100%;
        margin-bottom: 10px;

        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-top: 10px;
        }
        input:focus {
            outline: none;
        }
    }

    .comments-panel {
        width: 100%;
        height: 400px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;

        .user-comment {
            width: 100%;
            display: flex;
            flex-direction: column;

            .user {
                display: flex;
                align-items: center;

                .img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    margin-right: 10px;
                    background-color: #ffe1e1;
                }
                span {
                    font-size: 18px;
                }
            }

            .comment {
                margin-left: 60px;
                margin-bottom: 10px;
            }

            .footer {
                margin-left: 60px;

                span {
                    margin-right: 30px;
                }
            }
        }
    }
}
</style>