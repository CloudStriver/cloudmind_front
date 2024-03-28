<template>
    <div class="popup-main-box">
      <div class="cleanOut-main-box" v-if="props.sendContents.option === 'cleanOutFile'">
        <div class="cleanOut-box">
          <div class="cleanOut">
            <div class="button">
              <button @click="cancelPopup">取消</button>
              <button @click="confirmCleanOut">确定</button>
            </div>
          </div>
        </div>
      </div>
        <div class="recycle-main-box" v-if="props.sendContents.option === 'moveToRecycle'">
            <div class="recycle-box">
                <div class="recycle">
                    <div>移至回收站</div>
                    <div>移至回收站的文件仍然占用云盘容量，10天后无法找回</div>
                    <div class="button">
                        <button @click="cancelPopup">取消</button>
                        <button @click="confirmMoveToRecycle">确定</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="detail-box" v-if="props.sendContents.option === 'checkDetail'">
            <span 
                class="show-details" 
                v-if="isShowDeatil"
                :style="{left: detailsLeft + 'px', top: detailsTop + 'px'}"
            >{{ details }}</span>
            <div class="check-file-details">
                <div class="details">
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
                                    @mouseover="showDetails(props.sendContents.contents[0].name, $event)"
                                    @mouseleave="isShowDeatil = false"
                                >{{ props.sendContents.contents[0].name }}</span></div>
                        </div>
                        <div class="details-footer-div-style">
                            <div>类型</div>
                            <div>{{ props.sendContents.contents[0].type }}</div>
                        </div>
                        <div class="details-footer-div-style">
                            <div>路径</div>
                            <div><span
                                    @mouseover="showDetails(props.sendContents.contents[0].path, $event)"
                                    @mouseleave="isShowDeatil = false"
                                >{{ props.sendContents.contents[0].path }}</span></div>
                        </div>
                        <div class="details-footer-div-style">
                            <div>大小</div>
                            <div>{{ props.sendContents.contents[0].spaceSize }}</div>
                        </div>
                        <div class="details-footer-div-style">
                            <div>创建时间</div>
                            <div>{{ props.sendContents.contents[0].createAt }}</div>
                        </div>
                        <div class="details-footer-div-style">
                            <div>修改时间</div>
                            <div>{{ props.sendContents.contents[0].updateAt }}</div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
        <div class="move-box" v-if="props.sendContents.option === 'moveFile'">
            <div class="move">
                <header class="move-box-header">
                    <div>移动到</div>
                    <i class="iconfont icon-cuowu1" @click="cancelPopup"></i>
                </header>
                <section class="move-box-section">
                    <div class="move-path">
                        <div 
                            class="move-path-item"
                            v-for="(path, index) of pathData.pathName"
                            :key="index"
                            @click="toPath(index)"
                        >{{ path }}
                            <div>></div>
                        </div>
                        <div class="nowMovePath">{{ nowPath.pathName }}</div>
                    </div>
                    <div v-if="isMoveCreateFolder" class="move-add-folder">
                        <i class="iconfont icon-wenjian"></i>
                        <input 
                            type="text" 
                            ref="folderName"
                            v-model="moveCreateFolderName"
                            @blur="confirmMoveCreateFolder"
                        >
                        <i class="iconfont icon-cuowu" @click="cancelMoveCreateFolder"></i>
                    </div>
                    <div 
                        class="move-filesList-box"
                        v-for="(file, index) of foldersList.files"
                        :key="index"
                        @click="enterTheFolder(file)"
                    >
                        <div class="move-filesList-contents">
                            <i class="iconfont icon-wenjian"></i>
                            <div>{{ file.name }}</div>
                        </div>
                    </div>
                </section>
                <footer class="move-box-footer">
                    <i class="iconfont icon-folder-add-line" @click="isMoveCreateFolder = true"></i>
                    <button @click="confirmMove">确定</button>
                </footer>
            </div>
        </div>
        <div class="rename-box" v-if="props.sendContents.option === 'renameFile'">
            <Rename class="rename"
                :sendName="renameMsg"
                @sendRename="getRename"
            ></Rename>
        </div>
    </div>
</template>

<script setup lang="ts">
import Rename from './rename-box.vue'
import { onMounted, ref } from 'vue';
import {getPrivateFilesList, postCreateFile, postMoveFile, postDeleteFile, postCleanOutFile} from './utils'
import type { responsePrivateFilesList, requestCreateFile } from './utils'
import { errorMsg, successMsg } from '@/utils/message';

const emit = defineEmits(['sendOperations', 'sendRenameMsg'])
const renameMsg = ref({
    fileId: "",
    name: ""
})
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
        }[]
    }
}>()
const details = ref("")
const moveCreateFolderName = ref("新建文件夹")
const isShowDeatil = ref(false)
const isMoveCreateFolder = ref(false)
const detailsTop = ref(0)
const detailsLeft = ref(0)
const foldersList = ref<responsePrivateFilesList>({
    files: [
        {
            fileId: '',
            userId: '',
            name: '',
            type: '',
            path: '',
            fatherId: '',
            spaceSize: '',
            isDel: 0,
            zone: '',
            subZone: '',
            description: '',
            updateAt: '',
            createAt: '',
        }
    ],
    total: 0,
    token: '',
    fatherIdPath: '',
    fatherNamePath: ''
})
const folderData = ref<requestCreateFile>({
    name: "",
    type: '文件夹',
    spaceSize: -1,
    md5: "",
    fatherId: "",
    category: 1,
})
const pathData = ref({
    pathId: [] as string[],
    pathName: [] as string[]
})
const nowPath = ref({
    pathId: "",
    pathName: ""
})

onMounted(async() => {
    if (props.sendContents.option === "moveFile") {
        pathData.value = {
            pathId: (sessionStorage.getItem("PathId") as string).split("/"),
            pathName: (sessionStorage.getItem("PathName") as string).split("/")
        }
        nowPath.value = {
            pathId: pathData.value.pathId.pop() as string,
            pathName: pathData.value.pathName.pop() as string
        }
        foldersList.value = await getPrivateFilesList({
            limit: 100,
            offset: 0,
            sortType: 3,
            backward: true,
            onlyFatherId: nowPath.value.pathId,
            onlyType: ["文件夹"]
        })
    }
    else if (props.sendContents.option === 'renameFile') {
        renameMsg.value = {
            fileId: (props.sendContents.contents as any).fileId,
            name: (props.sendContents.contents as any).name
        }
    }
})

const getRename = (sendRename: any) => {
    if (sendRename.option === 'cancel') {
        cancelPopup()
    }
    else if (sendRename.option === 'confirm') {
        cancelPopup()
        emit('sendOperations', {
            option: 'updateName',
            name: sendRename.message
        })
    }
}

const confirmCleanOut = () => {
  const filedIdList = props.sendContents.contents.map(content => content.fileId);
  postCleanOutFile(filedIdList)
      .then(() => {
        cancelPopup()
        emit('sendOperations',
            {
              option: "refreshFiles",
              message: ""
            })
      })
}
const confirmMoveToRecycle = () => {
    const filedIdList = props.sendContents.contents.map((file) => file.fileId)
    postDeleteFile(filedIdList)
    .then(() => {
        cancelPopup()
        emit('sendOperations', 
        {
            option: "refreshFiles",
            message: ""
        })
    })
}

const toPath = async(index: number) => {
    pathData.value.pathId.splice(index + 1)
    pathData.value.pathName.splice(index + 1)
    nowPath.value = {
        pathId: pathData.value.pathId.pop() as string,
        pathName: pathData.value.pathName.pop() as string
    }
    foldersList.value = await getPrivateFilesList({
        limit: 100,
        offset: 0,
        sortType: 3,
        backward: true,
        onlyFatherId: nowPath.value.pathId,
        onlyType: ["文件夹"]
    })
}

const enterTheFolder = async(file: any) => {
    if (file.fileId === props.sendContents.contents[0].fileId) {
        errorMsg("不能移动到自己所在的文件夹")
        return
    }
    pathData.value.pathId.push(nowPath.value.pathId)
    pathData.value.pathName.push(nowPath.value.pathName)
    nowPath.value = {
        pathId: file.fileId,
        pathName: file.name
    }
    foldersList.value = await getPrivateFilesList({
        limit: 100,
        offset: 0,
        sortType: 3,
        backward: true,
        onlyFatherId: file.fileId,
        onlyType: ["文件夹"]
    })
}
const confirmMove = () => {
    postMoveFile(props.sendContents.contents[0].fileId, nowPath.value.pathId)
    .then(() => {
        successMsg("移动成功")
        cancelPopup()
        emit('sendOperations', {
            option: "refreshFiles",
            message: ""
        })
    })
}

const confirmMoveCreateFolder = () => {
    if (moveCreateFolderName.value === "") {
        cancelMoveCreateFolder()
        return 
    }

    folderData.value = {
        name: moveCreateFolderName.value,
        type: '文件夹',
        spaceSize: -1,
        md5: "",
        fatherId: nowPath.value.pathId,
        category: 1
    }
    postCreateFile(folderData.value)
    .then((res) => {
        pathData.value.pathId.push(nowPath.value.pathId)
        pathData.value.pathName.push(nowPath.value.pathName)
        nowPath.value = {
            pathId: res,
            pathName: moveCreateFolderName.value
        }
        foldersList.value.files.length = 1
        foldersList.value.files.pop()
        isMoveCreateFolder.value = false
    })
}
const cancelMoveCreateFolder = () => {
    isMoveCreateFolder.value = false
    moveCreateFolderName.value = "新建文件夹"
}

const cancelPopup = () => {
    emit('sendOperations', {
        option: "cancelPopup",
        message: ""
    })
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

    .cleanOut-main-box {
      display: flex;

      .cleanOut-box {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 50px;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;

        .cleanOut {
          position: relative;
          width: 210px;
          height: 50px;
          background-color: rgb(240, 245, 254);
          box-shadow: 0 0 30px 2px rgba(5, 5, 5, 0.1);
          border-radius: 5px;
          margin: auto;
          padding: 10px;
          user-select: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .button {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            button {
              width: 80px;
              height: 25px;
              border: none;
              border-radius: 3px;
              transition: all 0.1s;
            }

            button:first-child {
              margin-right: 10px;
              background-color: #e3e3e3a2;
              color: #707070
            }

            button:last-child {
              color: rgb(66, 100, 159);
              background-color: rgb(250, 236, 228);
            }

            button:active {
              transform: scale(0.9);
            }
          }
        }
      }
    }

    .recycle-main-box {
        display: flex;

        .recycle-box {
            position: absolute;
            width: 100%;
            height: 100%;
            padding: 50px;
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;

            .recycle {
                position: relative;
                width: 410px;
                height: 150px;
                background-color: rgb(240, 245, 254);
                box-shadow: 0 0 30px 2px rgba(5, 5, 5, 0.1);
                border-radius: 5px;
                margin: auto;
                padding: 10px;
                user-select: none;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .button {
                    width: 100%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;

                    button {
                        width: 80px;
                        height: 25px;
                        border: none;
                        border-radius: 3px;
                        transition: all 0.1s;
                    }
                    button:first-child {
                        margin-right: 10px;
                        background-color: #e3e3e3a2;
                        color: #707070
                    }
                    button:last-child {
                        color: rgb(66, 100, 159);
                        background-color: rgb(250, 236, 228);
                    }
                    button:active {
                        transform: scale(0.9);
                    }
                
                }
            }
        }
    }
    

    .detail-box {
        display: flex;

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
    
            .details {
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

    .move-box {
        width: 100%;
        height: 100%;
        padding: 50px;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        
        .move {
            width: 400px;
            height: 500px;
            background-color: rgb(240, 245, 254);
            box-shadow: 0 0 30px 2px rgba(5, 5, 5, 0.1);
            padding: 10px;
            margin: auto;
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
                        font-size: 15px;
                        color: #1d1d1e;
                        display: flex;
                        align-items: center;
    
                        i {
                            font-size: 30px;
                            color: rgb(95, 134, 185);
                            margin-right: 10px;
                        }

                        div {
                            width: 300px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
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

    .rename-box {
        width: 100%;
        height: 100%;
        padding: 50px;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;

        .rename {
            width: 380px;
            height: 160px;
            margin: auto;
        }
    }
}
</style>