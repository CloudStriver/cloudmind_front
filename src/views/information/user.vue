<template>
    <div class="main-box">
        <CHeader class="cheader" :avatar="detail.avatar"></CHeader>
        <div class="contents">
            <div class="operate-box">
                <div class="avatar-name">
                    <div 
                        class="avatar" 
                        @mouseover="planAvatar" 
                        @mouseleave="noPlanAvatar"
                    >
                        <label
                            for="changeAvatar"
                            class="change-avatar" 
                            v-show="isChangeAvatar"
                        >
                            <input 
                                type="file" 
                                style="display: none;" 
                                id="changeAvatar"
                                @change="changeAvatar($event)"
                                accept="image/*"
                            >
                            <i class="iconfont icon-xiangji"></i>
                        </label>
                        <avatar :avatar="detail.avatar"></avatar>
                    </div>
                    <div>{{ splitName(detail.name) }}</div>
                </div>
                <div class="select">
                    <div>
                        <input 
                            type="radio" 
                            name="select" 
                            id="个人资料" 
                            v-model="select"
                            value="个人资料"
                            style="display: none;"
                            checked
                        > 
                        <label for="个人资料">个人资料</label>
                    </div>
                    <div>
                        <input 
                            type="radio" 
                            name="select" 
                            id="账号设置" 
                            v-model="select"
                            value="账号设置"
                            style="display: none;"
                        > 
                        <label for="账号设置">账号设置</label>
                    </div>
                    <div>
                        <input 
                            type="radio" 
                            name="select" 
                            id="浏览历史"
                            v-model="select"
                            value="浏览历史" 
                            style="display: none;"
                        > 
                        <label for="浏览历史">浏览历史</label>
                    </div>
                </div>
            </div>
            <div class="show-contents" v-show="select === '个人资料'">
                <header class="show-contents-header">个人资料
                  <button @click="toggleEdit" class="edit-button">{{ isEditing ? '取消' : '编辑' }}</button>
                  <button v-if="isEditing" @click="saveChanges" class="edit-button">保存</button>
                </header>
                <footer class="show-contents-footer">
                    <div class="info">
                        <div class="first">
                            <div>用</div>
                            <div>户</div>
                            <div>昵</div>
                            <div>称</div>
                        </div>
                        <div>
                          <div v-if="!isEditing" class="second">{{ detail.name }}</div>
                          <input v-else class="second" v-model="editableDetail.name">
                        </div>
                    </div>
                    <div class="info">
                        <div class="first">
                            <div>用</div>
                            <div>户</div>
                            <div>ID</div>
                        </div>
                        <div class="second">{{ userId }}</div>
                    </div>
                    <div class="info">
                        <div class="first">
                            <div>性</div>
                            <div>别</div>
                        </div>
                        <div>
                          <div v-if="!isEditing" class="second">{{ detail.sex }}</div>
                          <div v-else class="second">
                            <input type="radio" id="male" value="男" v-model="editableDetail.sex" name="sex">
                            <label for="male">男</label>
                            <input type="radio" id="female" value="女" v-model="editableDetail.sex" name="sex">
                            <label for="female">女</label>
                          </div>
                        </div>
                    </div>
                    <div class="info">
                        <div class="first">
                            <div>真</div>
                            <div>实</div>
                            <div>姓</div>
                            <div>名</div>
                        </div>
                        <div>
                          <div v-if="!isEditing" class="second">{{ detail.fullName }}</div>
                          <input v-else class="second" v-model="editableDetail.fullName">
                        </div>
                    </div>
                    <div class="info">
                        <div class="first">
                            <div>身</div>
                            <div>份</div>
                            <div>证</div>
                            <div>号</div>
                        </div>
                        <div>
                          <div v-if="!isEditing" class="second">{{ detail.idCard }}</div>
                          <input v-else class="second" v-model="editableDetail.idCard">
                        </div>
                    </div>
                    <div class="info">
                        <div class="first">
                            <div>个</div>
                            <div>人</div>
                            <div>简</div>
                            <div>介</div>
                        </div>
                        <div>
                          <div v-if="!isEditing" class="second">{{ detail.description }}</div>
                          <input v-else class="second" v-model="editableDetail.description">
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CHeader from '@/components/header.vue'
import avatar from '@/components/avatar.vue'
import {ref, onMounted} from 'vue'
import { useStore } from '@/store'
import SparkMD5 from 'spark-md5'
import { cosUploadImage } from '@/utils/public-cos'
import {getUserDetail, updateUser} from './utils'
import {UserAvatarUrl} from "@/utils/consts";

const store = useStore()
const userId = store.getUserId()
const isChangeAvatar = ref(false)
const isEditing = ref(false)
const detail = ref({
    name: '',
    sex: '男',//1男 2女
    idCard: '未填写',
    fullName: '未填写',
    description: '此人很懒，什么都没有写...',
    avatar: store.userAvatar
})
const editableDetail = ref({ ...detail.value })
const select = ref('个人资料')

onMounted(async() => {
    detail.value = await getUserDetail() as any
    editableDetail.value = detail.value
})

const toggleEdit = () => {
  if (isEditing.value) {
    isEditing.value = false
    editableDetail.value = { ...detail.value } // 取消时重置更改
  } else {
    isEditing.value = true
  }
}

const saveChanges = async () => {
  detail.value = { ...editableDetail.value }
  isEditing.value = false
  await updateUser(detail.value.name, detail.value.fullName, "", detail.value.sex == '男' ? 1 : 2, detail.value.idCard, detail.value.description)
}

const splitName = (name: string) => {
    return name.length  > 10 ? name.slice(0, 10) + '...' : name
}
const planAvatar = () => {
    isChangeAvatar.value = true
}
const noPlanAvatar = () => {
    isChangeAvatar.value = false
}
const changeAvatar = async(event: any) => {
    const file = event.target.files![0]
  if(file.type.indexOf('image') === -1) {
    alert('请上传图片')
    return
  }
    const fileReader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e: any) => {
        spark.append(e.target.result);
        const md5 = spark.end();
        const suffix = '.' + file.name.split('.').pop();
        cosUploadImage(file, md5, suffix, async () => {
            await updateUser("","", UserAvatarUrl + md5 + suffix, 0,"","")
            detail.value.avatar = UserAvatarUrl + md5 + suffix
        })
    }
}
</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .cheader {
        height: 70px;
    }

    .contents {
        width: 100%;
        height: 100%;
        flex: 1;
        background-color: rgba(240, 245, 255, 1);
        padding-top: 50px;
        display: flex;
        justify-content: center;

        .operate-box {
            width: 300px;
            height: 330px;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px 1px #e1e1e1;
            display: flex;
            flex-direction: column;
            align-items: center;

            .avatar-name {
                width: 150px;
                height: 180px;
                font-size: 20px;
                font-weight: 600;
                padding-bottom: 10px;
                margin-bottom: 10px;
                border-bottom: 1px solid #e1e1e1;
                display: flex;
                flex-direction: column;
                align-items: center;

                .avatar {
                    width: 120px;
                    height: 120px;
                    margin-bottom: 10px;

                    .change-avatar {
                        width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        position: absolute;
                        background-color: rgba(0, 0, 0, 0.5);
                        cursor: pointer;

                        i {
                            position: absolute;
                            font-size: 50px;
                            color: #ffffff;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                    
                    }
                }
            }

            .select {
                width: 120px;
                height: 120px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;

                label {
                    width: 120px;
                    font-size: 15px;
                    color: #9c9c9c;
                    cursor: pointer;
                }
                input:checked + label {
                    color: #409eff;
                }
                label:hover {
                    color: #0c0c0c;
                }
            }
        }

        .show-contents {
            width: 800px;
            height: 400px;
            background-color: #fff;
            margin-left: 20px;
            box-shadow: 0 0 10px 1px #e1e1e1;


            .show-contents-header {
                width: 100%;
                height: 50px;
                font-size: 20px;
                font-weight: 600;
                padding: 10px;
                border-bottom: 2px solid rgba(240, 245, 255, 1);
                .edit-button {
                  margin-left: 642px;
                  font-size: 20px;
                  font-weight: 600;
                  border-bottom: 2px solid rgba(240, 245, 255, 1);
                }
            }

            .show-contents-footer {
                height: 350px;
                padding-left: 20px;
                color: #4c4b4b;
                display: flex;
                flex-direction: column;
                justify-content: space-around;

                .info {
                    display: flex;

                    .first {
                        width: 70px;
                        font-size: 15px;
                        margin-right: 50px;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }

                    .second {
                        color: black;
                    }
                }
            }
        }
    }
}
</style>