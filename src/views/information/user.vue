<template>
    <div class="main-box">
        <Nav class="nav"></Nav>
        <div class="contents">
            <div class="operate-box">
                <div class="avatar-name">
                    <div class="avatar"><avatar :url="imageUrl"></avatar></div>
                    <div>{{ splitName(name) }}</div>
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
                <header class="show-contents-header">个人资料</header>
                <footer class="show-contents-footer">
                    <div class="info">
                        <div class="first">
                            <div>用</div>
                            <div>户</div>
                            <div>昵</div>
                            <div>称</div>
                        </div>
                        <div class="second">{{ name }}</div>
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
                        <div class="second">{{ sex }}</div>
                    </div>
                    <div class="info">
                        <div class="first">
                            <div>真</div>
                            <div>实</div>
                            <div>姓</div>
                            <div>名</div>
                        </div>
                        <div class="second">{{ fullName }}</div>
                    </div>
                    <div class="info">
                        <div class="first">
                            <div>身</div>
                            <div>份</div>
                            <div>证</div>
                            <div>号</div>
                        </div>
                        <div class="second">{{ idCard }}</div>
                    </div>
                    <div class="info">
                        <div class="first">
                            <div>个</div>
                            <div>人</div>
                            <div>简</div>
                            <div>介</div>
                        </div>
                        <div class="second">{{ description }}</div>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Nav from '@/components/navigation.vue'
import avatar from '@/components/avatar.vue'
import { ref, onMounted } from 'vue'
import { useStore } from '@/store/index'
import { get } from '@/utils/request'

const store = useStore()
const userId = store.getUserId()
const name = ref('')
const sex = ref('男') //1男 2女
const idCard = ref('未填写')
const fullName = ref('未填写')
const description = ref('未填写')
const select = ref('个人资料')
const imageUrl = ref('/src/assets/images/avatar.png')

onMounted(() => {
    get('/content/getUserDetail')
    .then((res: any) => {
        name.value = res.userDetail.name,
        sex.value = res.userDetail.sex === 1 ? '男' : '女',
        fullName.value = res.userDetail.fullName === '' ? '未填写' : res.fullName,
        idCard.value = res.userDetail.idCard === '' ? '未填写' : res.idCard,
        description.value = res.userDetail.description === '' ? '未填写' : res.description,
        imageUrl.value = res.userDetail.imageUrl  === '' ? '/src/assets/images/avatar.png' : res.imageUrl
        console.log(res.userDetail);
        
    })
})

const splitName = (name: string) => {
    return name.length  > 10 ? name.slice(0, 10) + '...' : name
}
</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    height: 100%;
    display: flex;

    .nav {
        position: fixed;
        height: 100%;
        width: 80px;
        float: left;
    }

    .contents {
        width: 100%;
        height: 100%;
        background-color: rgba(240, 245, 255, 1);
        margin-left: 80px;
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