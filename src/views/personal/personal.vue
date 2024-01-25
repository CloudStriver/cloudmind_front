<template>
    <div class="main-box">
        <Nav class="nav"></Nav>
        <div class="drawer-box">
            <div 
                class="drawer"
                :style="{left: drawerLeft + 'px'}"
                @dblclick="drawerHandle"
            >
                <div class="classify">
                    <div 
                        class="files"
                        ref="files"
                        @click="clickFiles"
                    >
                        <i class="iconfont icon-file-alt-solid"></i>
                        <div>文件</div>
                    </div>
                    <div 
                        class="images"
                        ref="images"
                        @click="clickImages"
                    >
                        <i class="iconfont icon-image"></i>
                        <div>图片</div>
                    </div>
                    <div 
                        class="radios"
                        ref="radios"
                        @click="clickRadios"
                    >
                        <i class="iconfont icon-video-solid"></i>
                        <div>视频</div>
                    </div>
                    <div class="music"
                        ref="music"
                        @click="clickMusic"
                    >
                        <i class="iconfont icon-music-solid"></i>
                        <div>音乐</div>
                    </div>
                </div>
                <div class="statistic">
                </div>
            </div>
        </div>
        <div class="contents" :style="{marginLeft: contentsMaginLeft + 'px'}">
            <header class="header">
                <div class="header-header">
                    <div class="path">CloudMind ></div>
                    <Search class="search"></Search> 
                </div>
                <div class="header-footer">
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
            </header>
            <footer class="footer">
                <div></div>
                <i class="iconfont icon-jia add"></i>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import Nav from '@/components/navigation.vue'
import Search from '@/components/search.vue'
import { ref } from 'vue'
import type { Ref } from 'vue'

const files = ref()
const music = ref()
const images = ref()
const radios = ref()
const isFlles = ref(false)
const isImages = ref(false)
const isradios = ref(false)
const isMusic = ref (false)
const drawerLeft = ref(0)
const contentsMaginLeft = ref(140)

const drawerHandle = () => {
    if (drawerLeft.value === 0) {

        drawerLeft.value = -140
        contentsMaginLeft.value = 5
    }
    else {
        drawerLeft.value = 0
        contentsMaginLeft.value = 150
    }
}

const cancelOption = () => {
    isFlles.value = false
    isImages.value = false
    isradios.value = false
    isMusic.value = false
    files.value.classList.remove('classify-active');
    images.value.classList.remove('classify-active');
    radios.value.classList.remove('classify-active');
    music.value.classList.remove('classify-active');
}
const judgeOptions = (option: Ref<HTMLElement>, isOption: Ref<boolean>) => {
    console.log(isOption.value);
    
    if (!isOption.value) {
        cancelOption()
        option.value.classList.add('classify-active');
        isOption.value = true
        console.log(isOption.value);
    }
    else {
        option.value.classList.remove('classify-active');
    }
}

const clickFiles = () => {
    judgeOptions(files, isFlles)
}

const clickImages = () => {
    judgeOptions(images, isImages)
}

const clickRadios = () => {
    judgeOptions(radios, isradios)
}

const clickMusic = () => {
    judgeOptions(music, isMusic)
}
</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    height: 100%;
    display: flex;

    .nav {
        width: 80px;
        z-index: 10;
    }

    .drawer-box {
        position: relative;
        display: flex;
        .drawer {
            position: absolute;
            width: 150px;
            height: 100%;
            border-right: 1px solid rgb(209, 225, 252); 
            background-color: rgba(240, 245, 255, 1);
            padding: 20px 0;
            z-index: 1;
            transition: all 1s;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;

            .classify {
                width: 150px;
                height: 220px;
                font-size: 15px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                div {
                    height: 50px;
                    color: rgb(57, 92, 137);
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    i {
                        vertical-align: middle;
                        font-size: 20px;
                        margin-right: 10px;
                    }

                }

                .files:hover, 
                .images:hover,
                .radios:hover,
                .music:hover {
                    color: #000;
                    
                    div {
                    color: #000;
                    }
                }

                .classify-active {
                    background-color: rgba(151, 149, 149, 0.056);
                    font-weight: 600;
                }
            }

            .statistic {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background-color: #c9dcf5;
            }
        }
    }

    .contents {
        width: 100%;
        height: 100%;
        background-color: #fff;
        transition: all 1s;
        display: flex;
        flex-direction: column;

        .header {
            width: 100%;
            height: 100px;
            padding: 20px 20px 10px 20px;
            border-bottom: 1px solid rgb(209, 225, 252);
            background-color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .header-header {
                display: flex;
                justify-content: space-between;

                .path {
                    font-size: 20px;
                    font-weight: 550;
                    color: rgb(61, 108, 171);
                }
    
                .search {
                    width: 250px;
                }
            }

            .header-footer {
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

        .footer {
            width: 100%;
            height: 100%;
            box-shadow: 14px 5px 15px 2px rgb(230, 239, 255) inset;
            .add {
                position: absolute;
                font-size: 80px;
                color: #82b4ea;
                border-radius: 50%;
                right: 20px;
                bottom: 20px;
                cursor: pointer;
            }
            .add:hover {
                transition: all 1ms;
                box-shadow: 0 0 10px 1px rgb(123, 123, 123);
            }
            .add:active {
                transition: all 100ms;
                transform: scale(0.9);
            }
        }
    }
}
</style>