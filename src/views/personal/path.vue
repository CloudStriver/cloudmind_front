<template>
    <div class="main-box" @click="cancelShowSort($event)"> 
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
                    v-model="allSelect"
                >全选
            </label>
            <div class="sort">
                <div @click.stop="clickSort">
                    <i class="iconfont icon-paixu"></i>
                    <span>按照时间排序</span>
                </div>
                <div class="sort-box" v-show="isShowSort">
                    <ul>
                        <li>
                            <input 
                                type="radio"
                                name="typeSort"
                                id="name"
                                v-model="typeSort"
                                value="name"
                                checked
                            >
                            <i v-show="typeSort === 'name'" class="iconfont icon-0-58"></i>
                            <i v-show="typeSort !== 'name'" class="iconfont icon-0-58 i"></i>
                            <label for="name">名称</label>
                        </li>
                        <li>
                            <input 
                                type="radio"
                                name="typeSort"
                                id="createTime"
                                v-model="typeSort"
                                value="createTime"
                            >
                            <i v-show="typeSort === 'createTime'" class="iconfont icon-0-58"></i>
                            <i v-show="typeSort !== 'createTime'" class="iconfont icon-0-58 i"></i>
                            <label for="createTime">创建时间</label>
                        </li>
                        <li>
                            <input 
                                type="radio"
                                name="typeSort"
                                id="updateTime"
                                v-model="typeSort"
                                value="updateTime"
                            >
                            <i v-show="typeSort === 'updateTime'" class="iconfont icon-0-58" ></i>
                            <i v-show="typeSort !== 'updateTime'" class="iconfont icon-0-58 i" ></i>
                            <label for="updateTime">修改时间</label>
                        </li>
                        <li>
                            <input 
                                type="radio"
                                name="typeSort"
                                id="size"
                                v-model="typeSort"
                                value="size"
                            >
                            <i v-show="typeSort === 'size'" class="iconfont icon-0-58"></i>
                            <i v-show="typeSort !== 'size'" class="iconfont icon-0-58 i"></i>
                            <label for="size">文件大小</label>
                        </li>
                    </ul>
                    <div class="line"></div>
                    <ul>
                        <li>
                            <input 
                                type="radio"
                                name="sort"
                                id="asc"
                                v-model="sort"
                                value="asc"
                            >
                            <i v-show="sort === 'asc'" class="iconfont icon-0-58"></i>
                            <i v-show="sort !== 'asc'" class="iconfont icon-0-58 i"></i>
                            <label for="asc">升序</label>
                        </li>
                        <li>
                            <input 
                                type="radio"
                                name="sort"
                                id="desc"
                                v-model="sort"
                                value="desc"
                            >
                            <i  v-show="sort === 'desc'" class="iconfont icon-0-58"></i>
                            <i  v-show="sort !== 'desc'" class="iconfont icon-0-58 i"></i>
                            <label for="desc">降序</label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useStore } from '@/store'
import router from '@/router'
import {StoragePathId, StoragePathName} from "@/utils/consts";

const store = useStore()
const emit = defineEmits(['sendPathMsg'])
const typeSort = ref("name")
const sort = ref("asc")
const allSelect = ref(false)
const isShowSort = ref(false)
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
        pathId: (sessionStorage.getItem(StoragePathId) as string).split("/"),
        pathName: (sessionStorage.getItem(StoragePathName) as string).split("/")
    }
    nowPath.value = {
        pathId: pathData.value.pathId.pop() as string,
        pathName: pathData.value.pathName.pop() as string
    }
})

watch(() => store.pathChange, (newVal) => {
    if (newVal) {
        pathData.value = {
            pathId: (sessionStorage.getItem(StoragePathId) as string).split("/"),
            pathName: (sessionStorage.getItem(StoragePathName) as string).split("/")
        }
        nowPath.value = {
            pathId: pathData.value.pathId.pop() as string,
            pathName: pathData.value.pathName.pop() as string
        }
    }
})
watch(() => allSelect.value, (newVal) => {
    emit('sendPathMsg', {
        option: 'allSelect',
        message: newVal
    })
})

const cancelShowSort = (e: MouseEvent) => {
    //还需要再完善取消弹框的方法
    document.querySelectorAll('.sort-box').forEach((item) => {
        if (!item.contains(e.target as Node)) {
            isShowSort.value = false
        }
    })
}

const clickSort = () => {
    isShowSort.value = !isShowSort.value
}
const toPath = (index: number) => {
    router.push({name: 'personal', params: {fatherId: pathData.value.pathId[index]}})
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
        border-bottom: 1px solid #e5e5e586;
        padding-bottom: 20px;

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
            position: relative;
            font-size: 15px;
            color: #646363;
            cursor: pointer;
            user-select: none;

            i {
                margin-right: 5px;
            }

            .sort-box {
                position: absolute;
                width: 130px;
                top: 30px;
                left: -10px;
                border-radius: 10px;
                background-color: #fff;
                box-shadow: 0 0 5px #cecece;
                padding: 10px;

                .line {
                    width: 100%;
                    height: 1px;
                    background-color: #e5e5e56e;
                    margin-top: 10px;
                    margin-bottom: 10px;
                }

                ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    li {
                        margin: 5px 0;
                        display: flex;
                        align-items: center;
                        margin-right: 10px;
                        color: #789bbc;

                        input {
                            display: none;
                        }

                        label {
                            width: 100%;
                            font-size: 15px;
                            cursor: pointer;
                            user-select: none;
                        }
                        label:hover {
                            color: #789bbc;
                        }

                        .i {
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
}
</style>