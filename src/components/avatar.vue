<template>
    <div class="main-box">
        <img :src="props.url">
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    url: {
        type: String,
        default: '/src/assets/images/avatar.png'
    
    }
})
</script>

<style scoped lang="css">
.main-box {
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-radius: 50%;
    cursor: pointer;
}
</style>