<template>
    <div class="main-box"> 
        <div class="path">
            <div
                class="path-item"
                v-for="(path, index) of pathData.pathName"
                :key="index"
                @click="toPath(index)"
            >{{ path }}
                <div>></div>
            </div>
            <div class="nowPath">{{ nowPath.pathName }}</div>
        </div> 
        <div class="header-bottom">
            <label for="allSelect">
                <input 
                    type="checkbox"
                    id="allSelect"
                >全选
            </label>
            <div class="sort">
                <i class="iconfont icon-paixu"></i>
                <span>按照时间排序</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useStore } from '@/store'
import router from '@/router'

const store = useStore()
const pathData = ref({
    pathId: [] as string[],
    pathName: [] as string[]
})
const nowPath = ref({
    pathId: "",
    pathName: ""
})

onMounted(() => {
    pathData.value = {
        pathId: (sessionStorage.getItem("PathId") as string).split("/"),
        pathName: (sessionStorage.getItem("PathName") as string).split("/")
    }
    nowPath.value = {
        pathId: pathData.value.pathId.pop() as string,
        pathName: pathData.value.pathName.pop() as string
    }
})

watch(() => store.pathChange, (newVal) => {
    if (newVal) {
        pathData.value = {
            pathId: (sessionStorage.getItem("PathId") as string).split("/"),
            pathName: (sessionStorage.getItem("PathName") as string).split("/")
        }
        nowPath.value = {
            pathId: pathData.value.pathId.pop() as string,
            pathName: pathData.value.pathName.pop() as string
        }
    }
})

const toPath = (index: number) => {
    router.push({name: 'text-personal', params: {fatherId: pathData.value.pathId[index]}})
}
</script>

<style scoped lang="css">
.main-box {
    display: flex;
    flex-direction: column;

    .path {
        font-size: 20px;
        padding: 0 20px;
        margin-bottom: 10px;
        color: rgb(61, 108, 171);
        display: flex;
        
        .path-item {
            cursor: pointer;
            user-select: none;
            color: #b7b6b6;
            display: flex;

            div {
                margin: 0 5px;
            }
        }
        .path-item:hover {
            color: #789bbc;

            div {
                color: #b7b6b6;
            }
        }

        .nowPath {
            font-weight: 550;
            cursor: pointer;
        }
    }

    .header-bottom {
        margin: 0 20px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        label {
            font-size: 15px;
            color: #646363;
            vertical-align: middle;
            cursor: pointer;
            user-select: none;

            input {
                vertical-align: middle;
                margin-right: 10px;
            }
        }

        .sort {
            font-size: 15px;
            color: #646363;
            cursor: pointer;
            user-select: none;

            i {
                margin-right: 5px;
            }
        }
    }
}
</style>