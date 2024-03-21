<template>
    <div class="recycle-box">
        <div 
            class="recycle-file-content"
            v-for="(file, index) of recycleFilesList.files"
            :key="index"
            @click="chooseFile(file)"
        >
            <div class="name-box">
                <div class="checkbox" v-if="!file.isChoose"></div>
                <div class="checkbox-choose" v-else>
                    <i class="iconfont icon-0-58"></i>
                </div>
                <i 
                    v-if="file.type !== '文件夹'"
                    class="iconfont icon-file-alt-solid"
                ></i>
                <i 
                    v-if="file.type === '文件夹'"
                    class="iconfont icon-wenjian"
                ></i>
                <div>{{ file.name }}</div>
            </div>
            <div class="detail">
                <div>{{ file.spaceSize }}</div>
                <div>{{ file.updateAt }}</div>
                <div >10天</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRecycleFilesList } from './utils'
import type { responseRecycleFilesList } from './utils'

const recycleFilesList = ref<responseRecycleFilesList>({
    files: [
        {
            fileId: "",
            userId: "",
            name: "",
            type: "",
            path: "",
            fatherId: "",
            spaceSize: "",
            isDel: 0,
            zone: "",
            subZone: "",
            description: "",
            updateAt: "",
            createAt: "",
            isChoose: false
        }
    ],
    total: 0,
    token: ""
})

onMounted(async() => {
    recycleFilesList.value = await getRecycleFilesList({
        limit: 100,
        backward: true,
        offset: 0
    })
})

const chooseFile = (file: any) => {
    file.isChoose = !file.isChoose
}
</script>

<style scoped lang="css">
.recycle-box {
    width: 100%;
    height: 100%;
    padding: 10px 10px;

    .recycle-file-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #e5e5e5;

        .name-box {
            width: 77%;
            display: flex;
            align-items: center;

            .checkbox {
                width: 15px;
                height: 15px;
                border: 1px solid #e5e5e5;
                border-radius: 50%;
                margin-right: 10px;
            }
            .checkbox-choose {
                width: 15px;
                height: 15px;
                border: 1px solid #e5e5e5;
                border-radius: 50%;
                margin-right: 10px;
                background-color: #96b0df;
                display: flex;
                justify-content: center;
                align-items: center;   

                i {
                    margin: 10px;
                    color: #fff;
                    font-size: 20px;
                    font-weight: 700;

                }
            }

            i {
                font-size: 30px;
                margin-right: 10px;
                color: #96b0df;
            }
        }

        .detail {
            width: 23%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>