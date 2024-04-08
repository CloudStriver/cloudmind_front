<template>
    <div class="search-box">
        <CHeader></CHeader>
        <nav class="nav">
            <ul>
                <li>
                    <input 
                        type="radio"
                        name="select"
                        id="synthesis"
                        value="synthesis"
                    >
                    <label for="synthesis">综合</label>
                </li>
                <li>
                    <input 
                        type="radio"
                        name="select"
                        id="post"
                        value="post"
                    >
                    <label for="post">帖子</label>
                </li>
                <li>
                    <input 
                        type="radio" 
                        name="select"
                        id="files"
                        value="files"
                    >
                    <label for="files">文件</label>
                </li>
                <li>
                    <input 
                        type="radio"
                        name="select"
                        id="users"
                        value="users"
                    >
                    <label for="users">用户</label>
                </li>
            </ul>
        </nav>
        <section class="section">
            <div class="contents-box">
                <div class="header">
                    <ul>
                        <li>
                            <input 
                                type="radio"
                                name="selectSecond"
                                id="synthesis_2"
                                value="synthesis_2"
                            >
                            <label for="synthesis_2">综合排序</label>
                        </li>
                        <li>
                            <input 
                                type="radio"
                                name="selectSecond"
                                id="new"
                                value="new"
                            >
                            <label for="new">最新优先</label>
                        </li>
                        <li>
                            <input 
                                type="radio"
                                name="selectSecond"
                                id="hot"
                                value="hot"
                            >
                            <label for="hot">热度优先</label>
                        </li>
                    </ul>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                        时间不限
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                        </span>
                        <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>时间不限</el-dropdown-item>
                            <el-dropdown-item>最近一天</el-dropdown-item>
                            <el-dropdown-item>最近一周</el-dropdown-item>
                            <el-dropdown-item>最近三月</el-dropdown-item>
                        </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="contents">
                    <div class="content-box">
                        <h1 class="title">标题</h1>
                        <p class="content">内容</p>
                        <p>admin·2024-04-07·tags</p>
                        <div>
                            <div>
                                <i class="iconfont icon-a-dianzan2"></i>
                                <span>1k</span>
                            </div>
                            <div class="information">
                                <i class="iconfont icon-a-xiaoxi1"></i>
                                <span>1k</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
import CHeader from '@/components/header.vue'
import { onMounted } from 'vue';
import { ref } from 'vue';
const keyword = ref('')

onMounted(() => {
    keyword.value = location.href.split('/').pop() as string 
    console.log(keyword.value)
})


</script>
<style scoped lang="css">
.search-box {
    width: 100%;
    height: 100%;
    background-color: rgba(240, 245, 255, 0.5);
    display: flex;
    flex-direction: column;

    .nav {
        width: 100%;
        background-color: #fff;
        box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
        z-index: 1;

        ul {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;

            li {
                margin-right: 100px;
                display: flex;
                justify-content: center;
                align-items: center;

                input {
                    display: none;
                }

                label {
                    display: block;
                    width: 100%;
                    height: 100%;
                    line-height: 50px;
                    text-align: center;
                    cursor: pointer;
                    color: #333;
                    transition: all 0.3s;

                    &:hover {
                        color: #1890ff;
                    }
                }

                input:checked + label {
                    color: #1890ff;
                }
            }
        }
    }

    .section {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding-top: 20px;
        padding-bottom: 20px;

        .contents-box {
            width: 1000px;
            min-height: 800px;
            background-color: #fff;
            margin: auto;
            box-shadow: 0 0 10px rgba(26, 26, 26, 0.1);
            padding: 20px;

            .header {
                width: 100%;
                padding-bottom: 10px;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                justify-content: space-between;
                align-items: center;

                ul {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    li {
                        margin-right: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        input {
                            display: none;
                        }

                        label {
                            display: block;
                            width: 100%;
                            height: 100%;
                            text-align: center;
                            cursor: pointer;
                            color: #333;
                            transition: all 0.3s;

                            &:hover {
                                color: #1890ff;
                            }
                        }

                        input:checked + label {
                            color: #1890ff;
                        }
                    }
                }
            }

            .contents {
                .content-box {
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #f0f0f0;

                    .title {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }

                    .content {
                        font-size: 16px;
                        color: #666;
                        margin-bottom: 10px;
                    }

                    p {
                        margin: 0;
                        font-size: 14px;
                        color: #999;
                        margin-bottom: 10px;
                    }

                    div {
                        display: flex;
                        align-items: center;

                        div {
                            margin-right: 20px;
                            display: flex;
                            align-items: center;

                            i {
                                font-size: 20px;
                                margin-right: 5px;
                            }

                            span {
                                font-size: 14px;
                                color: #999;
                            }
                        }

                        .information {
                            display: flex;
                            align-items: center;

                            i {
                                font-size: 20px;
                                margin-right: 5px;
                            }

                            span {
                                font-size: 14px;
                                color: #999;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>