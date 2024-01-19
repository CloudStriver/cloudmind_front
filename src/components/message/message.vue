<template>
    <div class="message">
        <div class="success" v-if="choice === 1">
            <i 
                class="iconfont icon-zhengque" 
                style="color: #68ba3f; margin-right: 5px;"
            ></i>
            <div 
                style="color: #6ec045;"
            >{{ message }} </div>
        </div>
        <div class="error" v-if="choice === -1">
            <i 
                class="iconfont icon-cuowu" 
                style="color: rgb(239, 94, 94); margin-right: 5px;"
            ></i>
            <div 
                style="color: rgb(239, 94, 94);"
            >{{ message }}</div>
        </div>
        <div class="warn" v-if="choice === 0">
            <i 
                class="iconfont icon-tishi" 
                style="color: #929396; margin-right: 5px;"
            ></i>
            <div 
                style="color: #929396;"
            >{{ message }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
let choice = ref()
let message = ref("");

</script>

<style scoped lang="css">
.message {
    position: absolute;
    left: 50%;
    top: 3%;
    transform: translate(-50%);
    z-index: 10;
}
.message div {
  font-size: 13px;  
}
.message .error,
.message .warn,
.message .success {
    width: auto;
    height: 35px;
    padding: 10px 80px;
    border-radius: 15px;
    display: flex;
}

.error {
    background-color: #fbd8d8f1;
    box-shadow: 0 0 20px 2px #a9a9a922;
}
.success {
    background-color: #e1f5d6;
    box-shadow: 0 0 20px 2px #a9a9a922;
}
.warn {
    background-color: #eaeaeb;
    box-shadow: 0 0 20px 2px #a9a9a922;
}
</style>