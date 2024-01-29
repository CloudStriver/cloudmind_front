<template>
    <div class="main-box" @click="cancelPopup($event)">
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
                    <div class="path">CloudMind >{{ path }}</div>
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
            <footer class="footer" @contextmenu="contextmenuShowPopup($event)">
                <Popup 
                    class="contextmenu-popup"
                    id="contextmenuPopup"
                    v-show="isContexmenuPopup"
                    @update="updateFilesList"
                    :style="{left: popupLeft + 'px', top: popupRight + 'px'}"
                ></Popup>
                <div class="files-box">
                    <div 
                        class="contents"
                        v-for="(file, index) in filesList"
                        :key="index"
                    >
                        <div class="images">
                            <i class="iconfont icon-wenjian"></i>
                        </div>
                        <div class="title">{{ getFileName(file.name) }}</div>
                        <div class="time">{{ getFileTime(file.updateAt) }}</div>
                    </div>
                    <!-- <div class="contents">
                        <div class="images">
                            <i class="iconfont icon-file-alt-solid"></i>
                        </div>
                        <div class="title">期末作业</div>
                        <div class="time">2024/01/26 13:14</div>
                    </div>
                    <div class="contents">
                        <div class="images">
                            <i class="iconfont icon-shipinwenjian radio"></i>
                        </div>
                        <div class="title">宋浩高数不挂科</div>
                        <div class="time">2024/01/26 13:14</div>
                    </div>
                    <div class="contents">
                        <div class="images">
                            <i class="iconfont icon-yinlewenjian music"></i>
                        </div>
                        <div class="title">兰淞清唱合集</div>
                        <div class="time">2024/01/26 13:14</div>
                    </div>
                    <div class="contents">
                        <div class="images">
                            <i class="iconfont icon-jianzhuanquan- image"></i>
                        </div>
                        <div class="title">兰淞自拍合集</div>
                        <div class="time">2024/01/26 13:14</div>
                    </div> -->
                </div>
                <i 
                    class="iconfont icon-jia add" 
                    @click.stop="clickShowPopup"
                ></i>
                <Popup 
                    id="add-popup"
                    class="add-popup"
                    v-show="isClickPopup"
                    @update="updateFilesList"
                ></Popup>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import Nav from '@/components/navigation.vue'
import Search from '@/components/search.vue'
import Popup from '@/views/personal/popup.vue'
import { getFilesUrl } from './utils'
import { useStore } from '@/store/index';
import type { Ref } from 'vue'
import { ref, onMounted, computed } from 'vue'

const files = ref()
const music = ref()
const images = ref()
const radios = ref()
const store = useStore();
const isFlles = ref(false)
const isImages = ref(false)
const isradios = ref(false)
const isMusic = ref (false)
const isClickPopup = ref(false)
const isContexmenuPopup = ref(false)
const path = ref('')
const userId = ref('')
const filesList = ref<any>([])
const popupLeft = ref(0)
const popupRight = ref(0)
const drawerLeft = ref(0)
const contentsMaginLeft = ref(140)

onMounted(() => {
    userId.value = store.getUserId()
    filesList.value = getFilesUrl(userId.value)
    console.log(filesList.value);
    
})

const updateFilesList = (update: boolean) => {
    if (update) {
        filesList.value = getFilesUrl(userId.value)
    }
}

const getFileName = computed(() => {
    return (name: string) => {
        return name.length > 10 ? name.slice(0, 10) + '...' : name
    }
})

const getFileTime = (time: number): string => {
    const date = new Date(time * 1000); // 将时间戳转换为日期对象
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}

const clickShowPopup = () => {
    isClickPopup.value = true
    isContexmenuPopup.value = false
    document.addEventListener('click', cancelPopup);
}
const cancelPopup = (event: MouseEvent) => {
    const popup = document.querySelector('.add-popup') as HTMLElement;
    if (popup && !popup.contains(event.target as Node)) {
        isClickPopup.value = false;
        document.removeEventListener('click', cancelPopup);
    }
    const tpopup = document.querySelector('.contextmenu-popup') as HTMLElement;
    if (tpopup && !tpopup.contains(event.target as Node)) {
        isContexmenuPopup.value = false;
        document.removeEventListener('click', cancelPopup);
    }
}
const contextmenuShowPopup = (event: MouseEvent) => {
    isClickPopup.value = false
    isContexmenuPopup.value = true
    document.addEventListener('click', cancelPopup);
    popupLeft.value = event.clientX - 160
    popupRight.value = event.clientY - 160
    event.preventDefault()
}

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
    overflow: hidden;

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
            padding: 10px 10px 10px 22px;

            .add {
                position: absolute;
                font-size: 70px;
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

            .add-popup {
                position: absolute;
                width: 160px;
                height: 150px;
                right: 20px;
                bottom: 100px;
                z-index: 10;
            }

            .contextmenu-popup {
                position: absolute;
                width: 160px;
                height: 150px;
                z-index: 10;
            }

            .files-box {
                width: 100%;
                height: 92%;
                padding: 10px 10px 20px 10px;
                margin-bottom: 120px;
                display: grid;
                grid-template-columns: repeat(auto-fill, 150px);
                grid-template-rows: repeat(auto-fill, 200px);
                grid-row-gap: 10px;
                grid-column-gap: 10px;
                justify-content: space-between;
                align-items: center;
                overflow-y: auto;
                
                
                .contents {
                    width: 150px; 
                    height: 180px; 
                    background-color: #fff;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    .images {
                        width: 100px;
                        height: 100px;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        i {
                            font-size: 100px;
                            color: #96b0df;
                        }

                        .radio {
                            font-size: 80px;
                        }

                        .music {
                            font-size: 85px;
                        }

                        .image {
                            font-size: 75px;
                        }
                    }


                    .title {
                        font-size: 15px;
                        color: #252526;
                    }

                    .time {
                        font-size: 12px;
                        color: #a0a0a0;
                        margin-top: 5px;
                    }
                }

                .contents:hover {
                    background-color: #f5f5f5;
                    border-radius: 20px;
                }
            }
        }
    }
}
</style>