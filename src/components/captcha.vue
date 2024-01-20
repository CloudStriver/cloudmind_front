<template>
    <div 
        class="track"
        ref="trackLeftX"
        @mouseout="mouseOut"
    >
        <div class="typeface">向右拖动滑块</div>
        <div 
            class="filled-noactive" 
            ref="filled"
            :style="{width: sliderX + 'px'}"
        ></div>
        <div 
            class="slider-noactive" 
            ref="slider"
            :style="{left: sliderX + 'px'}"
            @mousedown="mouseDown"
        >
            <i class="iconfont icon-youjian" v-if="isCaptcha === 'padding'"></i>
            <i 
                class="iconfont icon-cuowu1" 
                v-if="isCaptcha === 'error'"
                style="color: #fff;"
            ></i>
            <i 
                class="iconfont icon-0-58" 
                v-if="isCaptcha === 'success'"
                style="color: #fff;"
            ></i>
        </div>
    </div>
</template>

<script setup lang="ts">
import { errorMsg, successMsg } from '@/utils/message';
import { onMounted, ref } from 'vue'

const trackLeftX = ref()
const slider = ref()
const filled = ref()
let trackLeft = ref(0) //轨道距离窗口最左测的距离
let clickX = 0 //鼠标点击时的X坐标
let minX = ref(0) //鼠标可移动的最小X坐标
let maxX = ref(0) //鼠标可移动的最大X坐标
let sliderX = ref(0) //滑块距离轨道最左测的距离left
let sliderLeft = ref(0) //滑块距离轨道最左测的距离
let isMouseDown = ref(false) //鼠标是否按下
let isCaptcha = ref("padding") //是否验证成功
document.onselectstart = () => false //解决拖动滑块时选中文字和图片的问题
onMounted(() => {
    trackLeft.value = Math.ceil(trackLeftX.value.getBoundingClientRect().left)    
})

const mouseDown = (event: MouseEvent) => {
    isMouseDown.value = true
    clickX = event.clientX
    sliderLeft.value = clickX - trackLeft.value
    minX.value = clickX
    maxX.value = minX.value + 190   
}

const mouseMove = (event: MouseEvent) => {
    if (isMouseDown.value) {
        sliderX.value = event.clientX - trackLeft.value - sliderLeft.value
        if (sliderX.value < 0) {
            sliderX.value = 0
        } else if (sliderX.value > 190) {
            sliderX.value = 190
        }
    }
}

const mouseUp = () => {
    if (isMouseDown.value) {
        if (sliderX.value < 190) {
            errorMsg("验证失败，请重新验证")
            isCaptcha.value = "error"
            slider.value.classList.add("slider-error")
            filled.value.classList.add("filled-error")
            setTimeout(() => {
                sliderX.value = 0
                isCaptcha.value = "padding"
                slider.value.classList.remove("slider-error")
                filled.value.classList.remove("filled-error")
            }, 2000)
        } else {
            successMsg("验证成功")
            sliderX.value = 190
            isCaptcha.value = "success"
            slider.value.classList.add("slider-success")
            filled.value.classList.add("filled-success")
        }
        isMouseDown.value = false
    }
}

const mouseOut = () => { 
    if (isMouseDown.value) {
        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)
    }
}

</script>

<style scoped lang="css">
.track {
    position: relative;
    width: 220px;
    height: 30px;
    background-color: #f4f9ff;
    box-shadow: inset 0 0 2px #c9c9c9;
    display: flex;
    align-items: center;

    .typeface {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 11px;
        color: rgb(153, 153, 153);
        user-select: none;
    }

    .filled-noactive,
    .filled-success,
    .filled-error {
        position: absolute;
        height: 30px;
        border: 0.1px solid #1991fa;
        background-color: #cee8fe;
    }

    .filled-success {
        border: 0.1px solid #6ce149;
        background-color: #e5ffdd;
    }

    .filled-error {
        border: 0.1px solid #de533e;
        background-color: #ffe5e5;
    }

    .slider-noactive,
    .slider-success,
    .slider-error {
        position: absolute;
        width: 30px;
        height: 30px;
        color: #afaeae;
        background-color: #fff;
        box-shadow: 0 0 2px 0.6px #c9c9c9;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .slider-noactive:hover,
    .slider-noactive:active {
        color: #fff;
        background-color: #1991fa;
        box-shadow: 0 0 3px 0.6px #d0d0d0;
    }

    .slider-success,
    .slider-success:hover,
    .slider-success:active {
        background-color: #6ce149;
    }

    .slider-error,
    .slider-error:hover,
    .slider-error:active {
        background-color: #de533e;
    }
}
</style>