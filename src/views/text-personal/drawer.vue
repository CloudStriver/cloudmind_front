<template>
    <div class="main-box">
        <div class="operate">
            <div class="transfer">
                <i class="iconfont icon-yunchuanshu"></i>
                <span>传输</span>
            </div>
            <div class="upload">
                <i class="iconfont icon-yunshangchuan"></i>
                <span>上传</span>
            </div>
            <div class="create">
                <i class="iconfont icon-a-11Hxinjianwenjianjia"></i>
                <span>新建</span>
            </div>
        </div>
        <div class="classify-box">
            <div class="sort">
                <input 
                    type="radio"
                    name="select"
                    id="sort" 
                >
                <label for="sort">
                    <i class="iconfont icon-fenlei"></i>
                    <span>文件筛选</span>
                </label>
            </div>
            <ul>
                <li class="classify-li">
                    <input 
                        type="radio"
                        name="classify"
                        id="file"
                    >
                    <label for="file">
                        <i class="iconfont icon-file-alt-solid"></i>
                        <span>文档</span>
                    </label>
                </li>
                <li class="classify-li">
                    <input 
                        type="radio"
                        name="classify"
                        id="file"
                    >
                    <label for="file">
                        <i class="iconfont icon-image"></i>
                        <span>图片</span>
                    </label>
                </li>
                <li class="classify-li">
                    <input 
                        type="radio"
                        name="classify"
                        id="file"
                    >
                    <label for="file">
                        <i class="iconfont icon-video-solid"></i>
                        <span>视频</span>
                    </label>
                </li>
                <li class="classify-li">
                    <input 
                        type="radio"
                        name="classify"
                        id="file"
                    >
                    <label for="file">
                        <i class="iconfont icon-music-solid"></i>
                        <span>音乐</span>
                    </label>
                </li>
            </ul>
        </div>
        <div class="recycle">
            <input 
                type="radio"    
                name="select"
                id="recycle"
            >
            <label for="recycle">
                <i class="iconfont icon-lajitong"></i>
                <span>回收站</span>
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="css">
.main-box {
    color: rgb(25, 80, 146);
    background-color: rgba(240, 245, 255, 1);
    padding: 10px 20px;
    display: flex;
    flex-direction: column;

    .operate {
        .transfer,
        .upload,
        .create {
            height: 50px;
            line-height: 40px;
            padding-bottom: 30px;
            text-align: center;
    
            i {
                font-size: 30px;
                margin-right: 10px;
                vertical-align: middle;
            }
        }
    
        .create {
            border-bottom: 1px solid rgba(25, 79, 146, 0.205);
            margin-bottom: 20px;
            padding-bottom: 50px;
        }
    }

    .classify-box {
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(25, 79, 146, 0.205);

        .sort {
            margin-bottom: 10px;
            
            label {
                i {
                    margin-right: 10px;
                    font-size: 20px;
                }
            }
        }

        ul {
            .classify-li {
                width: 100px;
                margin: 25px 0 25px 30px;

                i {
                    font-size: 20px;
                    margin-right: 10px;
                }
            }
        }
    }

    .recycle {
        label {
            color: rgb(206, 112, 112);

            i {
                font-size: 20px;
                margin-right: 10px;
                color: rgb(203, 76, 76);
            }
        }
    }
    
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    input[type="radio"] {
        display: none;
    }


}
</style>