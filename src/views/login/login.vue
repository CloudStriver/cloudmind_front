<template>
    <div class="main-box">
        <img src="../../assets/images/background-circle.png" class="circle">
        <div class="panel">
            <img 
                src="../../assets/images/illustration.png" 
                style="transform: scale(0.7); -webkit-user-drag: none;"
            >
            <div class="contents">
                <div class="cloudmind">
                    <img src="../../assets/images/cloudmind.png">
                </div>
                <div class="switch">
                    <button>登 录</button>
                    <button style="cursor: pointer;" @click="register">注 册</button>
                </div>
                <div class="input">
                    <div class="email">
                        <i class="iconfont icon-user-solid"
                            style="color: rgb(187, 186, 186)">
                        </i>
                        <input class="email-input" 
                               type="text"
                               placeholder="邮箱"
                               v-model="email"
                               @input="judgeAccountInput"
                               @blur="judgeAccountBlur"
                        >
                    </div>
                    <div class="email-msg" v-show="errorEmail">* {{ errorEmailMsg }}</div>
                    <div class="password">
                        <i class="iconfont icon-lock-solid" 
                           style="color: rgb(187, 186, 186)">
                        </i>
                        <input class="password-input" 
                               type="password"
                               placeholder="密码"
                               v-model="password"
                               @input="judgePasswordInput"
                               @blur="judgePasswordBlur"
                        >
                    </div>
                    <div class="password-msg" v-show="errorPassword">* {{ errorPasswordMsg }}</div>
                    <div v-if="isCaptcha" class="captcha">
                        <Captcha ref="captcha"></Captcha>
                    </div>
                    <div class="auto-forget">
                        <div>
                            <input type="checkbox" 
                                   id="checkbox"
                                   class="checkbox-input"
                            >
                            <label class="checkbox-lable" for="checkbox">自动登录</label>
                        </div>
                        <div class="forget">忘记密码?</div>
                    </div>
                    <button class="login-button" @click="login">登录</button>
                    <div class="agreements">
                        <input 
                            type="checkbox" 
                            id="agreement"
                            style="vertical-align: middle;"
                            v-model="agreements"
                        >
                        <label for="agreement" class="agreement-lable">已阅读并同意以下协议 </label>
                        <router-link 
                            to="/agreements_user"
                            style="color: rgba(60, 176, 253, 1); text-decoration: none; vertical-align: middle;"
                        > 用户协议、</router-link>
                        <router-link 
                            to="/agreements_privacy"
                            style="color: rgba(60, 176, 253, 1); text-decoration: none; vertical-align: middle;"
                        >隐私政策</router-link>
                    </div>
                </div>
                <div class="third">
                    <div class="third-login">
                        <div></div>
                        <div>第三方登录</div>
                        <div ></div>
                    </div>
                    <div>
                        <i class="iconfont icon-qq qq"></i>
                        <i class="iconfont icon-weixin weixin"></i>
                        <i class="iconfont icon-gitub gitub"></i>
                        <a href="https://gitee.com/oauth/authorize?client_id=10dfe502136745d1f135474390c4cb6cd50fce3a5bf7a167891d3b0ec184d2eb&redirect_uri=https://apisix.cloudmind.top/auth/githubLogin&response_type=code" target="_blank">
                            <i class="iconfont icon-gitee1 gitee"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div> 
</template>

<script setup lang="ts">
import Captcha from '@/components/captcha.vue'
import router from '@/router'
import { ref, onMounted } from 'vue'
import { post, get } from '@/utils/request';
import { useStore } from '@/store/index';
import { errorMsg, successMsg } from '@/utils/message';
import { judgeEmail, judgePassword } from '@/utils/judge'

const store = useStore()
const captcha = ref()
const email = ref("")
const password = ref("")
const errorEmailMsg = ref("")
const errorPasswordMsg = ref("")
const isEmail = ref(false)
const isCaptcha = ref(false)
const isPassword = ref(false)
const errorEmail = ref(false)
const agreements = ref(false)
const errorPassword = ref(false)

onMounted(() => {
    thirdLogin()
})

const thirdLogin = () => {
    const code = location.href.split('=')[1]
    if (code) {
        const url = '/auth/giteeLogin?code=' + code
        get(url)
        .then ((res: any) => {
            store.setUserInfo(res.userId, res.shortToken, res.longToken, res.chatToken, false)
            store.localSetUserInfo(res.userId, res.shortToken, res.longToken, res.chatToken, false)
            
            successMsg('登录成功')
            router.push('/')
        })
        .catch((err:any) => {
            console.log(err);
        })
    }
}

const judgeAccountInput = () => {
    isEmail.value = judgeEmail(email.value)
    if (isEmail.value) {
        isCaptcha.value = true
    } 
    else {
        isCaptcha.value = false
    }
}
const judgeAccountBlur = () => {
    if (email.value === "") {
        errorEmail.value = true
        errorEmailMsg.value = "邮箱不能为空"
    }
    else if (!isEmail.value) {
        errorEmail.value = true
        errorEmailMsg.value = "邮箱格式不正确"
    }
    else {
        errorEmail.value = false
    }
}

const judgePasswordInput = () => {
    if (password.value.length === 0) {
        errorPassword.value = true
        errorPasswordMsg.value = "密码不能为空"
    }
    else if (password.value.length < 8) {
        errorPassword.value = true
        errorPasswordMsg.value = "密码长度不能小于8位"
    }
    else if (password.value.length === 20) {
        errorPassword.value = true
        errorPasswordMsg.value = "密码长度不能大于20位"
    }
    else {
        judgePasswordBlur()
    }
}
const judgePasswordBlur = () => {
    const judgeIsPassword = judgePassword(password.value)
    if (!judgeIsPassword) {
        errorPassword.value = true
        errorPasswordMsg.value = "密码需要同时包含字母和数字"
    }
    else {
        errorPassword.value = false
        isPassword.value = true
    }
}

const judgeEmailAndPassword = () => {
    if (isEmail.value && isPassword.value) {
        return true
    }
    else {
        return false
    }
}

const login = () => {
    if (email.value === '') {
        errorEmail.value = true
        errorEmailMsg.value = "邮箱不能为空"
        return 
    }

    if (judgeEmailAndPassword() && agreements.value && captcha.value.isSuccess) {
        post('/auth/emailLogin', {
            email: email.value,
            password: password.value
        })
        .then ((res: any) => {
            store.setUserInfo(res.userId, res.shortToken, res.longToken, res.chatToken, false)
            store.localSetUserInfo(res.userId, res.shortToken, res.longToken, res.chatToken, false)
            
            successMsg('登录成功')
            router.push('/')
        })
        .catch((err:any) => {
            console.log(err);
        })
    }
    else if (!captcha.value.isSuccess) {
        errorMsg('未进行人机验证')
    }
    else if (!agreements.value) {
        errorMsg("请阅读并同意用户协议和隐私政策")
    }
    else {
        errorMsg("请正确填写邮箱和密码")
    }
}

const register = () => router.push('/register')

</script>
 
<style scoped lang="css">
.main-box {
    width: 100%;
    height: 100%;
    background-color: rgba(240, 245, 255, 1);

    .circle {
        position: absolute;
        bottom: 2%;
        right: 5%;
        width: 25%;
        height: 51%;
        -webkit-user-drag: none;
    }

    .panel {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 1200px;
        height: 600px;
        border-radius: 80px;
        background: rgba(207, 227, 252, 0.6);
        box-shadow: 0px 1px 7px 2px rgba(114, 157, 224, 0.51);
        display: flex;
        align-items: center;
        justify-content: space-around;

        .contents {
            width: 360px;
            height: auto;
            border-radius: 25px;
            margin-right: 100px;
            padding: 16px;
            padding-bottom: 50px;
            background-color: #fff;

            .cloudmind {
                display: flex;
                justify-content: center;
            }
            .cloudmind img {
                transform: scale(0.7); 
                -webkit-user-drag: none;
            }

            .switch {
                width: 45%;
                height: 40px;
                background: rgba(243, 247, 251, 1);
                border-radius: 10px;
                margin: 0px 0 15px 53px;
                padding: 0 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                button {
                    width: 48%;
                    height: 70%;
                    border: none;
                    font-size: 13px;
                }
                button:first-child {
                    font-weight: 700;
                    border-radius: 5px;
                    color: rgb(62, 96, 133);
                    background-color: #fff;
                    box-shadow: 0px 1px 4px  rgba(0, 0, 0, 0.2);
                }
                button:last-child {
                    color: #b9b9b9;
                    background-color: rgba(255, 255, 255, 0);
                }
            }

            .input {
                position: relative;
                width: 100%;
                height: auto;
                margin-bottom: 10px;
                padding: 0 10px 10px 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;

                .email, 
                .password {
                    width: 220px;
                    height: 32px;
                    box-shadow: inset 0 0 1px 1px rgba(224, 223, 223, 0.981);
                    border-radius: 3px;
                    padding-left: 10px;
                    padding-right: 1px;
                    margin-bottom: 15px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
                .email:hover,
                .password:hover {
                    box-shadow: inset 0 0 1px 1px rgba(188, 190, 192, 0.854);
                }

                .email-input,
                .password-input {
                    width: 89%;
                    height: 90%;
                    border: none;
                    border-radius: 0 3px 3px 0;
                    outline: none;
                    font-size: 14px;
                }
                .email-input::placeholder,
                .password-input::placeholder {
                    font-size: 13px;
                    color: rgb(187, 186, 186);
                }

                .email-msg,
                .password-msg {
                    position: absolute;
                    font-size: 10px;
                    color: #d84141;
                    left: 55px;
                }

                .email-msg {
                    top: 32px;
                }
                .password-msg {
                    top: 79px;
                }

                .captcha {
                    width: 220px;
                    height: 32px;
                    margin-bottom: 15px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }

                .auto-forget {
                    width: 220px;
                    font-size: 11px;
                    margin-bottom: 15px;
                    display: flex;
                    justify-content: space-between;

                    .checkbox-input {
                        cursor: pointer;
                        margin-right: 5px;
                        vertical-align: middle;
                        
                    }
                    .checkbox-lable {
                        color: rgb(88, 88, 88); 
                        user-select: none;
                        cursor: pointer;
                    }
                    .checkbox-lable:hover,
                    .checkbox-input:hover {
                        color: rgba(60, 176, 253, 1);
                    }

                    .checkbox-input:checked + .checkbox-lable {
                        color: rgba(60, 176, 253, 1);
                    }

                    .forget {
                        cursor: pointer;
                        color: rgba(60, 176, 253, 1);
                    }

                    .forget:hover {
                        text-decoration: underline;
                        color: rgb(30, 79, 255);
                    }
                }

                .login-button {
                    width: 220px;
                    height: 32px;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    border-radius: 10px;
                    margin-bottom: 10px;
                    color: #fff;
                    background: linear-gradient(155.11deg, rgba(30, 168, 255, 1) 0%, rgba(59, 142, 231, 0.4) 100%);
                    transition: all 0.5s;
                }
                .login-button:hover {
                    box-shadow: 0 0 10px 2px rgba(30, 169, 255, 0.281);
                }
                .login-button:active {
                    transform: scale(0.9);
                }

                .agreements {
                    font-size: 10px;
                    margin-right: 7px;

                    .agreement-lable {
                        color: rgb(111, 111, 111); 
                        user-select: none;
                        cursor: pointer;
                        vertical-align: middle;
                    }
                }
            }

            .third {
                width: 100%;
                height: 60px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;

                .third-login {
                    width: 300px;
                    display: flex; 
                    justify-content: center;
                    align-items: center;
                }
                .third-login div:first-child,
                .third-login div:last-child {
                    width: 70px;
                    height: 0.1px;
                    background-color: rgb(187, 186, 186);
                }
                .third-login div:nth-child(2) {
                    font-size: 12px;
                    color: rgb(187, 186, 186);
                    user-select: none;
                }

                a {
                    text-decoration: none;
                }

                i {
                    font-size: 25px;
                    margin: 0 8px;
                    cursor: pointer;
                }
                .qq {
                    color: rgb(78, 186, 248);
                }
                .weixin {
                    color: rgb(71, 211, 118);
                }
                .gitee {
                    color: #d83d3d;
                }
            }
        }
    }
}
</style>