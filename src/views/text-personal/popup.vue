<template>
    <div class="popup-main-box">
        <span 
            class="show-details" 
            v-if="isShowDeatil"
            :style="{left: detailsLeft + 'px', top: detailsTop + 'px'}"
        >{{ details }}</span>
        <div class="check-file-details">
            <div class="details-box">
                <header class="details-header">
                    <div>详细信息</div>
                    <i 
                        class="iconfont icon-cuowu1" 
                        @click="cancelPopup"
                    ></i>
                </header>
                <section class="details-section">
                    <i class="iconfont icon-wenjian"></i>
                </section>
                <footer class="details-footer">
                    <div class="details-footer-div-style">
                        <div>文件名</div>
                        <div><span
                                @mouseover="showDetails(props.sendContents.contents.name, $event)"
                                @mouseleave="isShowDeatil = false"
                            >{{ props.sendContents.contents.name }}</span></div>
                    </div>
                    <div class="details-footer-div-style">
                        <div>类型</div>
                        <div>{{ props.sendContents.contents.type }}</div>
                    </div>
                    <div class="details-footer-div-style">
                        <div>路径</div>
                        <div><span
                                @mouseover="showDetails(props.sendContents.contents.path, $event)"
                                @mouseleave="isShowDeatil = false"
                            >{{ props.sendContents.contents.path }}</span></div>
                    </div>
                    <div class="details-footer-div-style">
                        <div>大小</div>
                        <div>{{ props.sendContents.contents.spaceSize }}</div>
                    </div>
                    <div class="details-footer-div-style">
                        <div>创建时间</div>
                        <div>{{ props.sendContents.contents.createAt }}</div>
                    </div>
                    <div class="details-footer-div-style">
                        <div>修改时间</div>
                        <div>{{ props.sendContents.contents.updateAt }}</div>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const emit = defineEmits(['sendOperations'])
const props = defineProps<{
    sendContents: {
        option: string,
        contents: {
            fileId: string,
            userId: string,
            name: string,
            type: string,
            path: string,
            fatherId: string,
            spaceSize: string,
            createAt: string,
            updateAt: string
        }
    }
}>()
const details = ref("")
const isShowDeatil = ref(false)
const detailsLeft = ref(0)
const detailsTop = ref(0)

onMounted(() => {
    console.log(props.sendContents.contents)
})

const cancelPopup = () => {
    emit('sendOperations', "cancelPopup")
}
const showDetails = (name: string, event: any) => {
    details.value = name
    detailsLeft.value = event.clientX
    detailsTop.value = event.clientY
    isShowDeatil.value = true
}
</script>

<style scoped lang="css">
.popup-main-box {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #00000078;
    top: 0;
    left: 0;
    transition: all 0.3s;
    overflow-y: auto;
    display: flex;
    align-items: center;

    .show-details {
        position: absolute;
        width: auto;
        padding: 0 10px;
        background-color: #fff;
        border: 1px solid #000;
        z-index: 3;
        font-size: 13px;
    }

    .check-file-details {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 50px;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;

        .details-box {
            position: relative;
            width: 400px;
            height: 460px;
            padding: 10px;
            background-color: rgb(240, 245, 254);
            box-shadow: 0 0 30px 2px rgba(5, 5, 5, 0.1);
            user-select: none;
            margin: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;

            .details-header {
                width: 100%;
                display: flex;
                justify-content: space-between;
                
                i {
                    font-size: 20px;
                    cursor: pointer;
                }
            }

            .details-section {
                i {
                    font-size: 120px;
                    color: rgb(95, 134, 185);
                }
            }

            .details-footer {
                width: 380px;
                height: 280px;
                background-color: #fff;
                padding: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;

                .details-footer-div-style {
                    display: flex;
                    font-size: 15px;

                    div:first-child {
                        width: 100px;
                        margin-right: 10px;
                        color: rgb(110, 137, 173);
                    }
                    div:last-child {
                        width: 270px;
                        color: rgb(26, 54, 91);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow:ellipsis
                    }
                }
            }
        }
    }
}
</style>