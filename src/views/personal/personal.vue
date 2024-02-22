<template>
    <div class="main-box" @click="cancelPopup($event)">
        <div class="drawer-box">
            <div 
                class="drawer"
                :style="{left: drawerLeft + 'px'}"
                @dblclick="drawerHandle"
            >
                <div>
                    <div
                        class="main-classify"
                        @click="openOrCloseClassify"
                    >
                        <i class="iconfont icon-sanjiaoxia" v-show="!isClassifyOpen"></i>
                        <i class="iconfont icon-sanjiaoyou" v-show="isClassifyOpen"></i>
                        <div>文件筛选</div>
                    </div>
                    <div class="classify" :style="{top: classifyTop + 'px'}">
                        <div 
                            class="files"
                            ref="files"
                            @click="clickFiles"
                        >
                            <i class="iconfont icon-file-alt-solid"></i>
                            <div>文档</div>
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
                </div>
                <div
                    :style="{top: classifyTop + 'px'}"
                    class="main-recycle"
                    ref="recycle"
                    @click="enterRecycle"
                >回收站</div>
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
        <div class="move-files" v-if="isMoveFiles">
            <div class="move-box">
                <header class="move-box-header">
                    <div>移动到</div>
                    <i class="iconfont icon-cuowu1" @click="cancelMoveFiles"></i>
                </header>
                <section class="move-box-section">
                    <div class="move-path">
                        <div 
                            class="move-path-item"
                            v-for="(path, index) in movePath.path"
                            :key="index"
                            @click="jumpMovePath(index)"
                        >{{ path }}
                            <div>></div>
                        </div>
                        <div class="nowMovePath">{{ nowMovePath.path }}</div>
                    </div>
                    <div v-if="isMoveCreateFolder" class="move-add-folder">
                        <i class="iconfont icon-wenjian"></i>
                        <input 
                            type="text" 
                            ref="folderName"
                            v-model="moveCreateFolderName"
                            @focus="selectText"
                            @blur="confirmMoveCreateFolder"
                        >
                        <i class="iconfont icon-cuowu"></i>
                    </div>
                    <div 
                        class="move-filesList-box"
                        v-for="(file, index) in moveFoldersList"
                        :key="index"
                        @click="enterFolder(file, index)"
                    >
                        <div class="move-filesList-contents">
                            <i class="iconfont icon-wenjian"></i>
                            <div>{{ file.name }}</div>
                        </div>
                    </div>
                </section>
                <footer class="move-box-footer">
                    <i class="iconfont icon-folder-add-line" @click="createFolder"></i>
                    <button @click="confirmMove">确定</button>
                </footer>
            </div>
        </div>
        <div class="delete-file" v-if="isDeleteFile">
            <div class="confirm-delete" v-if="isDelete">
                <header class="confirm-delete-header">
                    <div>彻底删除</div>
                    <i class="iconfont icon-cuowu1" @click="cancelDeleteFile"></i>
                </header>
                <section class="confirm-delete-section">
                    <div>执行此操作后该文件将永久删除，是否继续执行？</div>
                </section>
                <footer class="confirm-delete-footer">
                    <button @click="confirmDeleteFile">彻底删除</button>
                </footer>
            </div>
            <div class="delete-public" v-if="isDeletPublic">
                <div>是否删除上传到社区空间中的该文件?</div>
                <div>
                    <button @click="confirmDeleteFileAndPublic">是</button>
                    <button @click="deleteUrl">否</button>
                </div>
            </div>
        </div>
        <div 
            class="contents" 
            :style="{marginLeft: contentsMaginLeft + 'px'}"
            v-show="!isRecycle"
        >
            <header class="header">
                <div class="header-header">
                    <div class="path">
                        <div 
                            class="path-item"
                            v-for="(item, index) in path"
                            :key="index"
                            @click="jumpPath(index)"
                        >{{ item }}
                            <div>></div>
                        </div>
                        <div class="nowPath">{{ nowPath }}</div>
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
                    <div class="detail" @click="checkFileDetail">查看详细信息</div>
                    <div class="download">下载</div>
                    <div class="move" @click="moveFile">移动</div>
                    <div class="recycle">移至回收站</div>
                    <div class="delete" @click="deleteFile">彻底删除</div>
                </div>
                <div class="files-box">
                    <div 
                        class="files-contents"
                        v-for="(file, index) in filesList.files"
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
        <div 
            class="recycle-contents"
            :style="{marginLeft: contentsMaginLeft + 'px'}"
            v-show="isRecycle"
        >
            <header class="recycle-header">
                <div class="recycle-header-header">
                    <div>回收站</div>
                    <button>
                        <i class="iconfont icon-lajitong"></i>
                        清空回收站
                    </button>
                </div>
                <div class="recycle-header-section">
                    <label for="recycleAllSelect">
                        <input 
                            type="checkbox"
                            id="recycleAllSelect"
                        >全选
                    </label>
                </div>
                <div class="recycle-header-footer">
                    <div>文件名称</div>
                    <div>大小</div>
                    <div>删除时间</div>
                    <div>剩余时间</div>
                </div>
            </header>
            <section class="recycle-footer">
                <div class="recycle-file-box">
                    <div class="recycle-file-content">
                        <div class="checkbox"></div>
                        <i class="iconfont icon-wenjian"></i>
                        <div>测试文件路径</div>
                    </div>
                    <div>10.3MB</div>
                    <div>2024/01/26 13:14</div>
                    <div>10天</div>
                </div>
                <div class="recycle-file-box">
                    <div class="recycle-file-content">
                        <div class="checkbox"></div>
                        <i class="iconfont icon-wenjian"></i>
                        <div>测试文件路径</div>
                    </div>
                    <div>10.3MB</div>
                    <div>2024/01/26 13:14</div>
                    <div>10天</div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import Search from '@/components/search.vue'
import Popup from '@/views/personal/popup.vue'
import { useStore } from '@/store/index';
import { ref, onMounted, computed } from 'vue'
import { getPrivateFiles, getFatherIdFromHerf, getFolderList } from './utils'
import type { createFiles, responseGetPrivateFiles } from './utils'
import type { Ref } from 'vue'
import { post } from '@/utils/request';
import { errorMsg, successMsg } from '@/utils/message';

const files = ref()
const music = ref()
const images = ref()
const radios = ref()
const recycle = ref()
const classify = ref()
const folderName = ref()
const store = useStore();
const isFlles = ref(false)
const isDelete = ref(false)
const isImages = ref(false)
const isradios = ref(false)
const isMusic = ref (false)
const isRecycle = ref(false)
const isMoveFiles = ref(false)
const isFilePopup = ref(false)
const isClickPopup = ref(false)
const isDeleteFile = ref(false)
const isDeletPublic = ref(false)
const isClassifyOpen = ref(false)
const clearCommunity = ref(false)
const isCreateFolder = ref(false)
const isContexmenuPopup = ref(false)
const isShowFileDetails = ref(false)
const isMoveCreateFolder = ref(false)
const userId = ref('')
const nowPath = ref('')
const fatherId = ref('')
const createFolderName = ref('新建文件夹')
const moveCreateFolderName = ref('新建文件夹')
const path = ref<any>([])
const movePath = ref<any>({
    path: [],
    fileId: [],
})
const nowMovePath = ref({ 
    path:'', 
    fileId: ''
})
const moveFoldersList = ref<any>([])
const tempMoveFolderList = ref<any>([])
const popupLeft = ref(0)
const popupRight = ref(0)
const drawerLeft = ref(0)
const classifyTop = ref(0)
const filePopupLeft = ref(0)
const filePopupRight = ref(0)
const nowClickFileIndex = ref(-1)
const nowClickFolderIndex = ref(-1)
const contentsMaginLeft = ref(150)
const createFolderData = ref<createFiles>({
    file: {
        name: '新建文件夹',
        url: '',
        type: '文件夹',
        fatherId: userId.value,
        spaceSize: -1,
    }
})
const filesList = ref<responseGetPrivateFiles>({
    fatherNamePath: '',
    fatherIdPath: '',
    files: [],
})
const fileDetails = ref({
    name: '',
    type: '',
    path: '',
    size: '',
    createAt: '',
    updateAt: '',
})

onMounted(async() => { 
    userId.value = store.getUserId()
    fatherId.value = getFatherIdFromHerf() || userId.value
    // filesList.value = await getPrivateFiles(fatherId.value)
    path.value = await getPath(filesList.value.fatherNamePath)
})

window.addEventListener('popstate', function() {
    location.reload();
});

const getPath = async (path: string) => {
    const tempPath = path.split('/')
    nowPath.value = tempPath.pop() as string
    return tempPath
}

const checkFileDetail = () => {
    isFilePopup.value = false
    isShowFileDetails.value = true
    const index = nowClickFileIndex.value
    fileDetails.value = {
        name: filesList.value.files[index].name,
        type: filesList.value.files[index].type,
        path: filesList.value.files[index].path,
        size: filesList.value.files[index].spaceSize,
        createAt: filesList.value.files[index].createAt,
        updateAt: filesList.value.files[index].updateAt,
    }    
}

const getNowPath = (file: any) => {
    const tempPath = file.fatherNamePath.split('/')
    const tempFileId = file.fatherIdPath.split('/')
    nowMovePath.value = {
        path: tempPath.pop() as string,
        fileId: tempFileId.pop() as string
    }
    return {
        path: tempPath,
        fileId: tempFileId
    }
}
const moveFile = () => {
    isMoveFiles.value = true
    isFilePopup.value = false
    moveFoldersList.value = getFolderList(fatherId.value)
    movePath.value = getNowPath(filesList.value)
}
const cancelMoveFiles = () => {
    isMoveFiles.value = false
}
const enterFolder = (file: any,index: number) => {
    const filesId = filesList.value.files[nowClickFileIndex.value].fileId
    if (file.fileId === filesId) {
        errorMsg('无法移动到该目录')
        return
    }
    else {
        tempMoveFolderList.value.push(moveFoldersList.value)
        moveFoldersList.value = getFolderList(moveFoldersList.value[index].fileId)
        nowClickFolderIndex.value = index
        movePath.value.path.push(nowMovePath.value.path)
        movePath.value.fileId.push(nowMovePath.value.fileId)
        nowMovePath.value.path = file.name
        nowMovePath.value.fileId = file.fileId
        console.log(nowMovePath.value);
    }
}
const createFolder = () => {
    isMoveCreateFolder.value = true
}
const confirmMoveCreateFolder = () => {
    isMoveCreateFolder.value = false
    const data = {
        file: {
            name: moveCreateFolderName.value,
            url: '',
            type: '文件夹',
            fatherId: nowMovePath.value.fileId,
            spaceSize: -1,
        }
    }
     post('/content/createFile', data)
    .then(async (res: any) => {
        if (nowMovePath.value.fileId === fatherId.value) {
            filesList.value = await getPrivateFiles(fatherId.value)
        }
        movePath.value.path.push(nowMovePath.value.path)
        movePath.value.fileId.push(nowMovePath.value.fileId)
        nowMovePath.value = {
            path: moveCreateFolderName.value,
            fileId: res.fileId
        }
        moveFoldersList.value = getFolderList(res.fileId)
        moveCreateFolderName.value = '新建文件夹'
        successMsg('创建成功')
    })
}
const confirmMove = () => {
    const tempFileId = filesList.value.files[nowClickFileIndex.value].fileId
    const tempFatherId = nowMovePath.value.fileId 
    
    post('/content/moveFile', {
        fileId: tempFileId,
        fatherId: tempFatherId, 
    })
    .then(async() => {
        filesList.value = await getPrivateFiles(fatherId.value)
        isMoveFiles.value = false
        successMsg('移动成功')
    })
}
const jumpMovePath = (index: number) => {
    moveFoldersList.value = getFolderList(movePath.value.fileId[index])
    console.log(movePath.value.fileId[index]);
    console.log(moveFoldersList.value);
    
    nowMovePath.value.path = movePath.value.path[index]
    nowMovePath.value.fileId = movePath.value.fileId[index]
    movePath.value.path = movePath.value.path.slice(0, index)
    movePath.value.fileId = movePath.value.fileId.slice(0, index)
}

//彻底删除api需要修改
const deleteFile = () => {
    isDeleteFile.value = true
    isDelete.value = true
    isFilePopup.value = false
}
const cancelDeleteFile = () => {
    isDeleteFile.value = false
}
const confirmDeleteFile = () => {
    isDelete.value = false
    isDeletPublic.value = true
}
const deleteUrl = () => {
    console.log(nowClickFileIndex.value);
    
    post('/content/deleteFile', {
        fileId: filesList.value.files[nowClickFileIndex.value].fileId,
        deleteType: 3,
        clearCommunity: clearCommunity.value,
    })
    .then(async() => {
        filesList.value = await getPrivateFiles(fatherId.value)
        isDeleteFile.value = false
        isDeletPublic.value = false
        successMsg('删除成功')
    })
}
const confirmDeleteFileAndPublic = () => {
    clearCommunity.value = true
    deleteUrl()
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

const updateFilesList = async (update: any) => {
    if (update[0]) {
        if (update[1]) {
            isCreateFolder.value = true
        }
        filesList.value = await getPrivateFiles(fatherId.value) 
    }
}

const jumpPath = async (index: number) => {
    const tempIdPath = filesList.value.fatherIdPath.split('/')
    fatherId.value = tempIdPath[index]
    store.setFatherId(fatherId.value)
    filesList.value = await getPrivateFiles(fatherId.value)
    path.value = await getPath(filesList.value.fatherNamePath)
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

const enterOrClick = async(file: any) => {
    if (file.type === '文件夹') {
        fatherId.value = file.fileId
        store.setFatherId(fatherId.value)
        filesList.value = await getPrivateFiles(fatherId.value)
        path.value = await getPath(file.path)
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

const openOrCloseClassify = () => {
    if (classifyTop.value === 0) {
        classifyTop.value = -200
        isClassifyOpen.value = true
    }
    else {
        classifyTop.value = 0
        isClassifyOpen.value = false
    }
    isRecycle.value = false
}

const enterRecycle = () => {
    isRecycle.value = true
    cancelOption()
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

    .drawer-box {
        position: relative;  
        display: flex;
        .drawer {
            position: absolute;
            width: 150px;
            height: 100%;
            padding-right: 2px;
            border-right: 1px solid rgb(209, 225, 252); 
            background-color: rgba(240, 245, 255, 1);
            z-index: 1;
            transition: all 1s;
            display: flex;
            flex-direction: column;
            align-items: center;

            .main-classify {
                position: relative;
                width: 100%;
                height: 40px;
                padding-left: 20px;
                z-index: 5;
                user-select: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                color: rgb(25, 80, 146);
                background-color: rgb(240, 245, 255);

                i {
                    margin-right: 3px;
                }
            }
            .main-classify:hover {
                background-color: rgb(255, 255, 255);
            }

            .classify {
                position: relative;
                width: 150px;
                height: auto;
                font-size: 15px;
                z-index: 3;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                transition: all 1s;

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

            .main-recycle {
                position: relative;
                width: 100%;
                height: 40px;
                padding-left: 20px;
                user-select: none;
                cursor: pointer;
                color: rgb(25, 80, 146);
                display: flex;
                align-items: center;
                transition: top 1s;
            }
            .main-recycle:hover {
                background-color: rgb(255, 255, 255);
            }

            .statistic {
                position: absolute;
                width: 120px;
                height: 120px;
                bottom: 10px;
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
        z-index: 12;
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

    .delete-file {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 11;
        padding: 50px;
        background-color: #cbcbcb3e;
        display: flex;
        overflow: auto;

        .confirm-delete {
            position: relative;
            width: 250px;
            height: 200px;
            background-color: #fcf5f5;
            box-shadow: 0 0 30px 2px rgba(5, 5, 5, 0.2);
            margin: auto;
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;

            .confirm-delete-header {
                width: 100%;
                display: flex;
                justify-content: space-between;
                
                i {
                    font-size: 20px;
                    cursor: pointer;
                }
            }

            .confirm-delete-section {
                color: #bb2b2b;
                font-size: 15px;
                font-weight: 550;
            }

            .confirm-delete-footer {
                button {
                    width: 100px;
                    height: 30px;
                    font-size: 15px;
                    border: none;
                    border-radius: 5px;
                    box-shadow: 0 0 3px 0.2px rgb(85, 138, 212);
                    color: #fff;
                    background-color: #e36060;
                    transistion: all 0.1s;
                }

                button:active {
                    transform: scale(0.9);
                }
            }
        }

        .delete-public {
            position: relative;
            width: 290px;
            height: 100px;
            background-color: #ffffff;
            box-shadow: 0 0 30px 2px rgba(5, 5, 5, 0.2);
            margin: auto;
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;

            button {
                width: 80px;
                height: 30px;
                font-size: 15px;
                border: none;
                border-radius: 5px;
                margin: 0 10px;
            }
            button:first-child {
                background-color: #ee6f6f;
                color: #fff;
            }
        }
    }

    .move-files {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 11;
        padding: 50px;
        background-color: #cbcbcb3e;
        display: flex;
        overflow: auto;

        .move-box {
            position: relative;
            width: 400px;
            height: 500px;
            background-color: rgb(240, 245, 254);
            box-shadow: 0 0 30px 2px rgba(5, 5, 5, 0.1);
            margin: auto;
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .move-box-header {
                width: 100%;
                display: flex;
                justify-content: space-between;
                
                i {
                    font-size: 20px;
                    cursor: pointer;
                }
            }

            .move-box-section {
                width: 380px;
                height: 400px;
                background-color: #fff;
                overflow-y: auto;

                .move-path {
                    display: flex;
                    align-items: center;
                    font-size: 12px;

                    .nowMovePath {
                        height: 25px;
                        color: rgb(61, 108, 171);
                        cursor: pointer;
                        user-select: none;
                        padding-left: 10px;
                        padding-top: 5px;
                        font-weight: 550;
                        display: flex;
                        align-items: center;
                    }
    
                    .move-path-item {
                        height: 25px;
                        cursor: pointer;
                        user-select: none;
                        color: #b7b6b6;
                        padding-left: 10px;
                        padding-top: 5px;
                        display: flex;
                        align-items: center;
    
                        div {
                            margin: 0 5px;
                        }
                    }
                    .move-path-item:hover {
                        color: #789bbc;
    
                        div {
                            color: #b7b6b6;
                        }
                    }
                }

                .move-add-folder {
                    width: 100%;
                    height: 50px;
                    padding-left: 10px;
                    cursor: pointer;
                    font-size: 15px;
                    color: #1d1d1e;
                    background-color: #f5f5f5;
                    display: flex;
                    align-items: center;

                    i:first-child {
                        font-size: 30px;
                        color: rgb(95, 134, 185);
                        margin-right: 10px;
                    }
                    
                    input {
                        width: 250px;
                        height: 30px;
                        border-radius: 5px;
                        border: 1px solid rgb(130, 149, 182);
                        padding-left: 10px;
                        margin-right: 50px;
                    }
                    input:hover {
                        border: 1px solid rgb(26, 73, 136);
                    }
                    input:focus {
                        outline: none;
                        border: 1px solid rgb(26, 73, 136);
                    }
                    
                    i:last-child {
                        font-size: 18px;
                        color: #d83b3b;
                    }
                }

                .move-filesList-box {
                    display: flex;
                    overflow-x: hidden;

                    .move-filesList-contents {
                        width: 100%;
                        height: 50px;
                        padding-left: 10px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        font-size: 15px;
                        color: #1d1d1e;

                        i {
                            font-size: 30px;
                            color: rgb(95, 134, 185);
                            margin-right: 10px;
                        }
                    }

                    .move-filesList-contents:hover {
                        background-color: #f5f5f5;
                    }
                }
            }

            .move-box-footer {
                width: 380px;
                height: 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                i {
                    font-size: 30px;
                    color: rgb(66, 100, 159);
                    cursor: pointer;
                    transition: all 0.1s;
                }
                i:active {
                    transform: scale(0.9);
                }

                button {
                    width: 100px;
                    height: 30px;
                    font-size: 16px;
                    border: none;
                    border-radius: 3px;
                    color: rgb(66, 100, 159);
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
                    color: rgb(61, 108, 171);
                    display: flex;

                    .path-item {
                        display: flex;
                        cursor: pointer;
                        user-select: none;
                        color: #b7b6b6;

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
            box-shadow: 8px 5px 15px 2px rgb(230, 239, 255) inset;
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
                
                .delete {
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

    .recycle-contents {
        height: 100%;
        background-color: #fff;
        transition: all 1s;
        display: flex;
        flex-direction: column;
        flex: 1;

        .recycle-header {
            width: 100%;
            height: 150px;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .recycle-header-header {
                width: 100%;
                padding: 20px 10px 0 10px;
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;

                div {
                    font-size: 20px;
                    font-weight: 600;
                    color: rgb(61, 108, 171);
                    display: flex;
                }

                button {
                    width: 120px;
                    height: 30px;
                    font-size: 15px;
                    border: none;
                    border-radius: 5px;
                    box-shadow: 0 0 3px 0.2px rgb(85, 138, 212);
                    color: #fff;
                    background-color: #e36060;
                    transition: all 0.1s;
                }
                button:active {
                    transform: scale(0.9);
                }
            }

            .recycle-header-section {
                width: 100%;
                padding: 0 0 10px 10px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;

                label {
                    font-size: 15px;
                    color: #686666;
                    vertical-align: middle;
                    cursor: pointer;
                    user-select: none;

                    input {
                        vertical-align: middle;
                        margin-right: 10px;
                    }
                }
            }

            .recycle-header-footer {
                height: 30px;
                font-size: 15px;
                color: #a8a7a7;
                padding-bottom: 10px;
                margin: 0 30px 0 30px;
                border-bottom: 1px solid rgb(241, 246, 255);
                display: flex;
                justify-content: space-between;

                div:first-child {
                    width: 70%;
                }
            }
        }

        .recycle-footer {
            height: 100%;
            padding: 20px;
            padding-left: 25px;
            padding-right: 30px;
            box-shadow: 8px 5px 15px 2px rgb(230, 239, 255) inset;
            overflow-y: auto;

            .recycle-file-box {
                height: 60px;
                border-bottom: 1px solid rgba(241, 246, 255, 0.676);
                display: flex;
                align-items: center;
                justify-content: space-between;

                .recycle-file-content {
                    width: 72%;
                    display: flex;
                    align-items: center;

                    .checkbox {
                        width: 13px;
                        height: 13px;
                        border: 1px solid #a8a7a7;
                        border-radius: 50%;
                        margin-right: 10px;
                    }

                    i {
                        font-size: 30px;
                        color: #6885ba;
                        margin-right: 10px;
                    }
                }
            }
        }
    }
}
</style>