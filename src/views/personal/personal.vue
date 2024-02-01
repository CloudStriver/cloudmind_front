<template>
    <div class="main-box" @click="cancelPopup($event)">
        <Nav class="nav" :link="fatherId"></Nav>
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
        <div class="check-file-details" v-if="isShowFileDetails">
            <div class="details-box">
                <header class="details-header">
                    <div>详细信息</div>
                    <i class="iconfont icon-cuowu1" @click="cancelShowFileDetails"></i>
                </header>
                <section class="details-section">
                    <i class="iconfont icon-wenjian"></i>
                </section>
                <footer class="details-footer">
                    <div class="details-footer-div-style">
                        <div>文件名</div>
                        <div>{{ fileDetails.name }}</div>
                    </div>
                    <div class="details-footer-div-style">
                        <div>类型</div>
                        <div>{{ fileDetails.type }}</div>
                    </div>
                    <div class="details-footer-div-style">
                        <div>路径</div>
                        <div>{{ fileDetails.path }}</div>
                    </div>
                    <div class="details-footer-div-style">
                        <div>大小</div>
                        <div>{{ fileDetails.size }}</div>
                    </div>
                    <div class="details-footer-div-style">
                        <div>创建时间</div>
                        <div>{{ fileDetails.createAt }}</div>
                    </div>
                    <div class="details-footer-div-style">
                        <div>修改时间</div>
                        <div>{{ fileDetails.updateAt }}</div>
                    </div>
                </footer>
            </div>
        </div>
        <div class="create-folder-box" v-if="isCreateFolder">
            <div class="create-folder">
                <header class="create-folder-header">
                    <div>新建文件夹</div>
                    <i class="iconfont icon-cuowu1" @click="cancelCreateFolder"></i>
                </header>
                <section class="create-folder-section">
                    <input 
                        type="text" 
                        v-model="createFolderName" 
                        ref="folderName"
                        @focus="selectText"
                        class="folder-name"
                    >
                </section>
                <footer class="create-folder-footer">
                    <button @click="confirmCreateFolder">确定</button>
                </footer>
            </div>
        </div>
        <div class="contents" :style="{marginLeft: contentsMaginLeft + 'px'}">
            <header class="header">
                <div class="header-header">
                    <div class="path">
                        <div 
                            v-for="(item, index) in path"
                            :key="index"
                        >{{ item }}</div>
                    </div>
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
                    :createFolderData = "createFolderData"
                ></Popup>
                <div 
                    class="file-popup" 
                    v-show="isFilePopup"
                    :style="{left: filePopupLeft + 'px', top: filePopupRight + 'px'}"
                >
                    <div class="upload-public">上传至社区</div>
                    <div class="detail" @click="checkFileDetail()">查看详细信息</div>
                    <div class="download">下载</div>
                    <div class="move">移动</div>
                    <div class="delete">删除</div>
                    <div class="recycle">移至回收站</div>
                </div>
                <div class="files-box">
                    <div 
                        class="files-contents"
                        v-for="(file, index) in filesList"
                        :key="index"
                        @contextmenu="contextmenuShowFilePopup(index)"
                        @click="enterOrClick(file)"
                    >
                        <div class="images">
                            <i 
                                class="iconfont icon-file-alt-solid"
                                v-if="file.type !== '文件夹'" 
                            ></i>
                            <i 
                                class="iconfont icon-wenjian"
                                v-if="file.type === '文件夹'"
                            ></i>
                        </div>
                        <div class="title">{{ getFileName(file.name) }}</div>
                        <div class="time">{{ file.updateAt }}</div>
                    </div>
                    <!-- <div class="contents">
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
                    :createFolderData = "createFolderData"
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
import { useStore } from '@/store/index';
import { ref, onMounted, computed } from 'vue'
import { getPrivateFiles, getFatherIdFromHerf, type createFiles } from './utils'
import type { Ref } from 'vue'

const files = ref()
const music = ref()
const images = ref()
const radios = ref()
const folderName = ref()
const store = useStore();
const isFlles = ref(false)
const isImages = ref(false)
const isradios = ref(false)
const isMusic = ref (false)
const isFilePopup = ref(false)
const isClickPopup = ref(false)
const isCreateFolder = ref(false)
const isContexmenuPopup = ref(false)
const isShowFileDetails = ref(false)
const path = ref<any>(['CloudMind > '])
const userId = ref('')
const fatherId = ref('')
const createFolderName = ref('新建文件夹')
const filesList = ref<any>([])
const popupLeft = ref(0)
const popupRight = ref(0)
const drawerLeft = ref(0)
const filePopupLeft = ref(0)
const filePopupRight = ref(0)
const nowClickFileIndex = ref(-1)
const contentsMaginLeft = ref(140)
const createFolderData = ref<createFiles>({
    file: {
        name: '新建文件夹',
        url: '',
        type: '文件夹',
        fatherId: userId.value,
        spaceSize: -1,
    }
})
const fileDetails = ref({
    name: '',
    type: '',
    path: '',
    size: 0,
    createAt: '',
    updateAt: '',
})

onMounted(() => {
    userId.value = store.getUserId()
    fatherId.value = getFatherIdFromHerf() || userId.value
    filesList.value = getPrivateFiles(fatherId.value)
})
window.addEventListener('popstate', function() {
    location.reload();
});

const checkFileDetail = () => {
    isFilePopup.value = false
    isShowFileDetails.value = true
    const index = nowClickFileIndex.value
    fileDetails.value = {
        name: filesList.value[index].name,
        type: filesList.value[index].type,
        path: filesList.value[index].path,
        size: filesList.value[index].spaceSize,
        createAt: filesList.value[index].createAt,
        updateAt: filesList.value[index].updateAt,
    }    
}

const cancelShowFileDetails = () => {
    isShowFileDetails.value = false
}

const selectText = () => {
    folderName.value.select()
}

const cancelCreateFolder = () => {
    isCreateFolder.value = false
}

const confirmCreateFolder = () => {
    createFolderData.value = {
        file: {
            name: createFolderName.value,
            url: '',
            type: '文件夹',
            fatherId: fatherId.value,
            spaceSize: -1,
        }
    }

    isCreateFolder.value = false
    createFolderName.value = '新建文件夹'
}

const updateFilesList = (update: any) => {
    if (update[0]) {
        if (update[1]) {
            isCreateFolder.value = true
            filesList.value = getPrivateFiles(fatherId.value)
        }
        else {
            filesList.value = getPrivateFiles(fatherId.value)
        }
    }

}

const getFileName = computed(() => {
    return (name: string) => {
        return name.length > 10 ? name.slice(0, 10) + '...' : name
    }
})

const clickShowPopup = () => {
    isClickPopup.value = true
    isContexmenuPopup.value = false
    document.addEventListener('click', cancelPopup)
}
const cancelPopup = (event: MouseEvent) => {
    const popup = document.querySelector('.add-popup') as HTMLElement;
    if (popup && !popup.contains(event.target as Node)) {
        isClickPopup.value = false
        document.removeEventListener('click', cancelPopup)
    }
    const tpopup = document.querySelector('.contextmenu-popup') as HTMLElement;
    if (tpopup && !tpopup.contains(event.target as Node)) {
        isContexmenuPopup.value = false
        document.removeEventListener('click', cancelPopup)
    }
    const filePopup = document.querySelector('.file-popup') as HTMLElement;
    if (filePopup && !filePopup.contains(event.target as Node)) {
        isFilePopup.value = false
        document.removeEventListener('click', cancelPopup)
    }
}
const contextmenuShowPopup = (event: any) => {
    const filePopup = document.querySelector('.files-contents') as HTMLElement;
    if (filePopup && event.target.classList.contains('files-box')) {
        isClickPopup.value = false
        isFilePopup.value = false
        isContexmenuPopup.value = true
        document.addEventListener('click', cancelPopup)
        if (event.clientY + 150 > window.innerHeight) {
            popupRight.value = event.clientY - 150
        }
        else {
            popupRight.value = event.clientY
        }
        popupLeft.value = event.clientX
        event.preventDefault()
    }
    else {
        isFilePopup.value = true
        isContexmenuPopup.value = false
        document.addEventListener('click', cancelPopup)
        if (event.clientY + 280 > window.innerHeight) {
            filePopupRight.value = event.clientY - 280
        }
        else {
            filePopupRight.value = event.clientY
        }
        filePopupLeft.value = event.clientX
        event.preventDefault()
    }
}

const contextmenuShowFilePopup = (index: number) => {
    nowClickFileIndex.value = index
}

const enterOrClick = (file: any) => {
    if (file.type === '文件夹') {
        fatherId.value = file.fileId
        store.setFatherId(fatherId.value)
        filesList.value = getPrivateFiles(fatherId.value)
    }
    else {
        console.log('打开文件');
    }
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

    .check-file-details {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 11;
        padding: 50px;
        background-color: #cbcbcb3e;
        overflow-y: auto;
        display: flex;

        .details-box {
            position: relative;
            width: 400px;
            height: 460px;
            padding: 10px;
            background-color: rgb(240, 245, 254);
            box-shadow: 0 0 30px 2px rgba(5, 5, 5, 0.1);
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
                        color: rgb(110, 137, 173);
                    }
                    div:last-child {
                        width: 260px;
                        color: rgb(26, 54, 91);
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
        }
    }

    .create-folder-box {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 11;
        background-color: #cbcbcb3e;

        .create-folder {
            position: absolute;
            width: 350px;
            height: 180px;
            border-radius: 20px;
            background-color: rgb(240, 245, 254);
            box-shadow: 0 0 30px 2px rgba(5, 5, 5, 0.1);
            padding: 10px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .create-folder-header {
                display: flex;
                justify-content: space-between;

                i {
                    cursor: pointer;
                    font-size: 25px;
                    color: rgb(95, 134, 185);
                }
            }

            .create-folder-section {
                display: flex;
                justify-content: center;
                align-items: center;

                .folder-name {
                    width: 290px;
                    height: 40px;
                    padding-left: 5px;
                    border-radius: 5px;
                    border: 1px solid rgb(130, 149, 182);
                }
                .folder-name:focus {
                    outline: none;
                }
            }

            .create-folder-footer {
                width: 100%;
                padding-right: 10px;
                display: flex;
                justify-content: flex-end;

                button {
                    width: 80px;
                    height: 30px;
                    border-radius: 3px;
                    color: rgb(66, 100, 159);
                    border: none;
                    box-shadow: 0 0 3px 0.2px rgb(85, 138, 212);
                    background-color: rgb(250, 236, 228);
                    transition: all 0.1s;
                }
                button:active {
                    transform: scale(0.9);
                }
            }

        }
    }
    .contents {
        /* width: 100%; */
        height: 100%;
        background-color: #fff;
        transition: all 1s;
        display: flex;
        flex-direction: column;
        flex: 1;

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
                    display: flex;
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
            display: flex;
            flex: 1;
            overflow-y: auto;

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

            .file-popup {
                position: absolute;
                width: 160px;
                border-radius: 15px;
                z-index: 10;
                background-color: #fff;
                box-shadow: 0 0 10px 1px rgb(214, 214, 214);

                div {
                    height: 35px;
                    margin: 10px;
                    padding-left: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
                div:hover {
                    background-color: #f5f5f5;
                }
                
                .recycle {
                    color: #d83b3b;
                }
            }

            .files-box {
                width: 100%;
                flex: 1;
                padding: 10px 10px 20px 10px;
                display: grid;
                grid-template-columns: repeat(auto-fill, 150px);
                grid-template-rows: repeat(auto-fill, 200px);
                grid-row-gap: 10px;
                grid-column-gap: 10px;
                justify-content: space-between;
                align-items: center;
                
                
                .files-contents {
                    width: 150px; 
                    height: 180px; 
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

                .files-contents:hover {
                    cursor: pointer;
                    border-radius: 20px;
                    background-color: #f5f5f5;
                }
            }
        }
    }
}
</style>