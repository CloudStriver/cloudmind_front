<template>
    <div class="activity-box">
        <div class="slideshow-box">
            <div class="slideshow">
                <el-carousel height="320px">
                <el-carousel-item v-for="item in 4" :key="item">
                    <h3 class="small justify-center" text="2xl">{{ item }}</h3>
                </el-carousel-item>
                </el-carousel>
            </div>  
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="css">
.activity-box {
    height: 360px;
    padding: 20px;
    background-color: #fff;
    display: flex;
    align-items: center;

    .slideshow-box {
        width: 70%;
        height: 100%;

        .slideshow {
            .el-carousel__item h3 {
            color: #475669;
            opacity: 0.75;
            line-height: 150px;
            margin: 0;
            text-align: center;
            }

            .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
            }

            .el-carousel__item:nth-child(2n + 1) {
            background-color: #d3dce6;
            }
        }
    }
}
</style>