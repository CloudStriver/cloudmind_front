<template>
    <div class="files-box">
        <!-- <div class="contents">
            <div class="images">
                <i class="iconfont icon-wenjian"></i>
            </div>
            <div class="title">复习资料</div>
            <div class="time">2024/01/26 13:14</div>
        </div>
        <div class="contents">
            <div class="images">
                <i class="iconfont icon-file-alt-solid"></i>
            </div>
            <div class="title">期末作业</div>
            <div class="time">2024/01/26 13:14</div>
        </div>
        <div class="contents">
            <div class="images">
                <i class="iconfont icon-shipinwenjian radio"></i>
            </div>
            <div class="title">宋浩高数不挂科</div>
            <div class="time">2024/01/26 13:14</div>
        </div>
        <div class="contents">
            <div class="images">
                <i class="iconfont icon-yinlewenjian music"></i>
            </div>
            <div class="title">兰淞清唱合集</div>
            <div class="time">2024/01/26 13:14</div>
        </div>
        <div class="contents">
            <div class="images">
                <i class="iconfont icon-jianzhuanquan- image"></i>
            </div>
            <div class="title">兰淞自拍合集</div>
            <div class="time">2024/01/26 13:14</div>
        </div> -->
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="css">
.files-box {
    width: 100%;
    height: 92%;
    padding: 10px 10px 20px 10px;
    margin-bottom: 120px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 150px);
    grid-template-rows: repeat(auto-fill, 200px);
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    justify-content: space-between;
    align-items: center;
    overflow-y: auto;
    
    
    .contents {
        width: 150px; 
        height: 180px; 
        background-color: #fff;
        margin-right: 10px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .images {
            width: 100px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;

            i {
                font-size: 100px;
                color: #96b0df;
            }

            .radio {
                font-size: 80px;
            }

            .music {
                font-size: 85px;
            }

            .image {
                font-size: 75px;
            }
        }


        .title {
            font-size: 15px;
            color: #252526;
        }

        .time {
            font-size: 12px;
            color: #a0a0a0;
            margin-top: 5px;
        }
    }

    .contents:hover {
        background-color: #f5f5f5;
        border-radius: 20px;
    }
}
</style>