<template>
    <div class="main-box">
        <div 
            class="files-contents"
        >
            <div class="images">
                <i 
                    class="iconfont icon-file-alt-solid"
                    
                ></i>
                <!-- <i 
                    class="iconfont icon-wenjian"
                ></i> -->
            </div>
            <div class="name">as</div>
            <div class="time">asd</div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="css">
.main-box {
    box-shadow: inset 0 0 10px 1px #8ca0b668;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 150px);
    grid-template-rows: repeat(auto-fill, 200px);
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    justify-content: space-between;

    .files-contents {
        width: 150px; 
        height: 180px; 
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


        .name {
            font-size: 15px;
            color: #252526;
        }

        .time {
            font-size: 12px;
            color: #a0a0a0;
            margin-top: 5px;
        }
    }

    .files-contents:hover {
        cursor: pointer;
        border-radius: 20px;
        background-color: #f5f5f58f;
    }
}
</style>