<template>
    <div class="activity-box">
        <div class="slideshow-box">
            <div class="slideshow">
                <el-carousel height="320px">
                <el-carousel-item v-for="(slider,index) in sliderList" :key="index">
                    <img class="small justify-center" :src="slider.imageUrl" alt="">
                </el-carousel-item>
                </el-carousel>
            </div>  
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Slider} from "@/utils/type";
import {GetSliders} from "@/utils/api";
const sliderList = ref<Slider[]>([])
onMounted(async () => {
  await GetSliders().then((res: any) => {
      sliderList.value = res.sliders.map((slider:any) => ({
        sliderId: slider.sliderId,
        imageUrl: slider.imageUrl,
        linkUrl: slider.linkUrl
      }))
  })
})

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
.small {
  width: 100%; /* 确保图片宽度充满容器 */
  height: 100%; /* 确保图片高度充满容器 */
  object-fit: cover; /* 覆盖整个容器，而不失去宽高比 */
  display: block; /* 消除图片下方可能出现的空隙 */
}

</style>