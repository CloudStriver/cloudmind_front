<template>
    <div class="main-box">
        <input 
            type="text"
            placeholder="搜索"
            v-model="keyword"
        >
        <i @click="search()" class="iconfont icon-sistrix"></i>
    </div>
</template>

<script setup lang="ts">
// import router from '@/router'
import {onMounted, ref, watch} from 'vue'
import {useRoute} from "vue-router";
import router from "@/router";
import {SearchPeriodType, SearchSortType} from "@/utils/consts";
import {errorMsg} from "@/utils/message";
const keyword = ref('')
const route = useRoute() // 如果你需要获取当前路由信息
onMounted(() => {
  keyword.value = route.params.keyword as string
})

const search = () => {
  if(!keyword.value) {
    errorMsg('请输入搜索内容')
    return
  }
  const selectContent = route.params.type as string
  const selectSort = parseInt(route.params.sort as string)
  const selectPeriod = parseInt(route.params.period as string)
  if(!selectContent || !selectSort || !selectPeriod) {
    router.push(`/search/${keyword.value}/post/${SearchSortType.Synthesis}/${SearchPeriodType.None}`)
    return
  }
  router.push(`/search/${keyword.value}/${selectContent}/${selectSort}/${selectPeriod}`)
}

watch(() => route.params.keyword, (value) => {
  if(value) {
    keyword.value = value as string
  }
  console.log("!!!")
})
</script>

<style scoped lang="css">
.main-box {
    width: 400px;
    height: 32px;
    border-radius: 25px;
    border: 1.5px solid rgb(107, 167, 232);
    background-color: #ffffff;
    display: flex;
    align-items: center;

    input {
        margin: 0 20px 0 15px;
        width: 83%;
        height: 96%;
        border: none;
        outline: none;
    }
    input::placeholder {
        color: rgb(165, 165, 165);
    }

    i {
        cursor: pointer;
        font-size: 20px;
        color: rgb(107, 167, 232);
    }
}
</style>