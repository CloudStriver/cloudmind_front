<template>
    <div class="main-box">
        <div class="panel">
            <img
                src="../../assets/images/background-circle.png"
                class="circle"
                alt=""
            >
            <img 
                class="illustration"
                src="../../assets/images/illustration.png" 
                alt=""
            >
            <div class="contents">
                <div class="cloudmind">
                    <img src="../../assets/images/cloudmind.png" alt="">
                </div>
                <div class="switch">
                    <button style="cursor: pointer;" @click="login">登 录</button>
                    <button>注 册</button>
                </div>
                <div class="input">
                    <div class="email" v-if="setCaptcha">
                        <i class="iconfont icon-user-solid"
                            style="color: rgb(187, 186, 186)">
                        </i>
                        <input 
                            type="text" 
                            placeholder="输入邮箱"
                            class="email-input"
                            autocomplete="new-password"
                            v-model="email"
                            @blur="emailBlur"
                        >
                    </div>
                    <div class="email-msg" v-show="errorEmail">* {{ EmailMsg }}</div>
                    <div class="getCaptcah" v-if="setCaptcha">
                        <i 
                            class="iconfont icon-shield-alt-solid"
                            style="color: rgb(187, 186, 186)">
                        </i>
                        <input 
                            type="text" 
                            placeholder="输入验证码"
                            class="captcha-input"
                            v-model="captcha"
                            @blur="captchaBlur"
                        >
                        <button
                            @click="getCaptcah"
                            class="captcha-button"
                            :disabled="isButtonDisabled"
                        >{{ captchaMessage }}</button>
                    </div>
                    <div class="captcha-msg" v-show="errorCaptcha">* {{ captchaMsg }}</div>
                    <div class="password" v-if="setPassword">
                        <i 
                            class="iconfont icon-lock-solid"
                            style="color: rgb(187, 186, 186)"
                        ></i>
                        <input 
                            type="password"
                            placeholder="输入密码(8-16位字符)"
                            class="password-input"
                            v-model="password"
                            @blur="passwordBlur"
                        >
                    </div>
                    <div class="password-msg" v-show="errorPassword">* {{ passwordMsg }}</div>
                    <div class="confirm-password" v-if="setPassword">
                        <i 
                            class="iconfont icon-lock-solid"
                            style="color: rgb(187, 186, 186)"
                        ></i>
                        <input 
                            type="password"
                            placeholder="确认密码"
                            class="confirm-password-input"
                            v-model="confirmPassword"
                            @blur="confirmPasswordBlur"
                        >
                    </div>
                    <div class="confirm-password-msg" v-show="errorConfirmPassword">* {{ confirmPasswordMsg }}</div>
                    <button 
                        v-show="!isNext"
                        class="register-next" 
                        @click="next"
                    >下一步</button>
                    <div v-show="isNext">
                        <button class="register-back" @click="back">上一步</button>
                        <button class="register-register" @click="register">注册</button>
                    </div>
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
                <Third></Third>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '../../router/index'
import Third from '@/views/login/third-login.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { judgeEmail, judgePassword } from '@/utils/judge'
import { errorMsg, successMsg } from '@/utils/message'
import { post, get } from '@/utils/request'
import { useStore } from '@/store'
import {CheckEmailUrl, RegisterUrl, SendEmailUrl} from "@/utils/consts";

const store = useStore()
const email = ref('')
const captcha = ref('')
const password = ref('')
const EmailMsg = ref('')
const captchaMsg = ref('')
const passwordMsg = ref('')
const confirmPassword = ref('')
const confirmPasswordMsg = ref('')
const isNext = ref(false)
const isEmail = ref(false)
const setCaptcha = ref(true)
const errorEmail = ref(false)
const isPassword = ref(false)
const agreements = ref(false)
const setPassword = ref(false)
const errorCaptcha = ref(false)
const errorPassword = ref(false)
const isConfirmassword = ref(false)
const clickGetCaptcha = ref(false)
const errorConfirmPassword = ref(false)
const captchaMessage = ref('获取验证码')
const isButtonDisabled = ref(false) // 新增一个响应式变量来控制按钮的disabled状态


onMounted(() => {
    document.addEventListener('keydown', handleEnterKey);
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleEnterKey);
})

const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        if (!isNext.value) {
            next()
        } else {
            register()
        }
    }
}

const emailBlur = () => {
    if (email.value === '') {
        errorEmail.value = true
        EmailMsg.value = '邮箱不能为空'
        return
    }
    isEmail.value = judgeEmail(email.value)
    if (!isEmail.value) {
        errorEmail.value = true
        EmailMsg.value = '邮箱格式不正确'
    } else {
        errorEmail.value = false
        EmailMsg.value = ''
    }
}

const captchaBlur = () => {
    if (captcha.value === '') {
        errorCaptcha.value = true
        captchaMsg.value = '验证码不能为空'
        return
    }
    if (captcha.value.length < 6) {
        errorCaptcha.value = true
        captchaMsg.value = '验证码格式不正确'
    } else {
        errorCaptcha.value = false
        captchaMsg.value = ''
    }
}

const passwordBlur =() => {
    if (password.value === '') {
        errorPassword.value = true
        passwordMsg.value = '密码不能为空'
        return
    }
    if (!judgePassword(password.value)) {
        errorPassword.value = true
        passwordMsg.value = '密码格式不正确，必须同时包含数字和字母'
        isPassword.value = false
    } else {
        errorPassword.value = false
        passwordMsg.value = ''
        isPassword.value = true
    }
}

const confirmPasswordBlur = () => {
    if (confirmPassword.value !== password.value) {
        errorConfirmPassword.value = true
        confirmPasswordMsg.value = '两次密码不一致'
        isConfirmassword.value = false
    } else {
        errorConfirmPassword.value = false
        confirmPasswordMsg.value = ''
        isConfirmassword.value = true
    }
}

const judgeThisPassword = () => {
    return isPassword.value && isConfirmassword.value;
}

const getCaptcah = () => {
    if (isEmail.value) {
        clickGetCaptcha.value = true
        isButtonDisabled.value = true // 点击后立即禁用按钮
        post(false, SendEmailUrl, {
            email: email.value,
            subject: '注册'
        })

        let time = 60
        let timer = setInterval(() => {
            time--
            captchaMessage.value = `${time}s后重新获取`
            if (time === 0) {
                clearInterval(timer)
                captchaMessage.value = '重新获取'
              isButtonDisabled.value = false
            }
        }, 1000)
        
    }
    else {
        errorEmail.value = true
        EmailMsg.value = '邮箱格式不正确'
        clickGetCaptcha.value = false
    }
}

const generateRrandomString = ():string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result
}

const next = () => {
    if (isEmail.value && captcha.value.length === 6 && clickGetCaptcha.value) {
        get(false, `${CheckEmailUrl}?email=${email.value}&code=${captcha.value}`)
        .then((res: any) => {
            if (res.ok) {
                isNext.value = true
                setCaptcha.value = false
                setPassword.value = true
            }
            else {
                errorMsg('验证码错误')
            }
        })
    } 
    else {
        errorMsg('请先填写正确的邮箱和验证码')
    }
}

const back = () => [
    isNext.value = false,
    setCaptcha.value = true,
    setPassword.value = false
]

const register = () => {
    if (judgeThisPassword()) {
        if (agreements.value) {
            const name = generateRrandomString()
            post(false, RegisterUrl, {
                name: name,
                email: email.value,
                sex: 1,
                password: password.value,
            })
            .then((res: any) => {
                store.setUserSession(res.shortToken, res.longToken, res.userId)

                successMsg('注册成功')
                router.push('/posts/hot')
            })
        }
        else {
            errorMsg('请阅读并同意用户协议和隐私政策')
        }
    }
    else {
        errorMsg('请先填写正确的密码')
    }
}

const login = () => router.push('/login')
</script>

<style scoped lang="css">
.main-box {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgba(240, 245, 255, 1);
    padding: 30px;
    display: flex;
    overflow: auto;

    .panel {
        position: relative;
        width: 1400px;
        height: 700px;
        border-radius: 80px;
        background: rgba(207, 227, 252, 0.6);
        box-shadow: 0px 1px 7px 2px rgba(114, 157, 224, 0.51);
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-around;

        .circle {
            position: absolute;
            width: 400px;
            height: 400px;
            right: -200px;
            bottom: -120px;
        }

        .illustration {
            transform: scale(0.85);
            -webkit-user-drag: none;
        }


        .contents {
            width: 400px;
            height: auto;
            border-radius: 25px;
            margin-right: 100px;
            padding: 16px;
            padding-bottom: 40px;
            background-color: #fff;

            .cloudmind {
                margin-bottom: 20px;
                display: flex;
                justify-content: center;
            }
            .cloudmind img {
                transform: scale(0.82); 
                -webkit-user-drag: none;
            }

            .switch {
                width: 50%;
                height: 50px;
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
                    font-size: 14px;
                }
                button:first-child {
                    color: #b9b9b9;
                    background-color: rgba(255, 255, 255, 0);
                }
                button:last-child {
                    font-weight: 700;
                    border-radius: 5px;
                    color: rgb(62, 96, 133);
                    background-color: #fff;
                    box-shadow: 0px 1px 4px  rgba(0, 0, 0, 0.2);
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
                .getCaptcah,
                .password,
                .confirm-password {
                    width: 260px;
                    height: 40px;
                    box-shadow: inset 0 0 1px 1px rgba(224, 223, 223, 0.981);
                    border-radius: 5px;
                    padding-left: 10px;
                    padding-right: 1px;
                    margin-bottom: 20px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
                .email:hover {
                    box-shadow: inset 0 0 1px 1px rgba(188, 190, 192, 0.854);
                }
                .email-input {
                    width: 89%;
                    height: 90%;
                    border: none;
                    border-radius: 0 3px 3px 0;
                    outline: none;
                    font-size: 14px;
                }
                .email-input::placeholder {
                    font-size: 13px;
                    color: rgb(187, 186, 186);
                }

                .email-msg,
                .password-msg,
                .confirm-password-msg,
                .captcha-msg{
                    position: absolute;
                    font-size: 12px;
                    color: #d84141;
                    left: 55px;
                }
                .email-msg,
                .password-msg {
                    top: 41px;
                }
        
                .captcha-msg,
                .confirm-password-msg{
                    top: 102px;
                }


                .captcha-button {
                    width: 42%;
                    height: 90%;
                    border: none;
                    outline: none;
                    font-size: 13px;
                    color: rgb(50, 145, 209);
                    background-color: #fff;
                    transition: all 0.5s;
                    cursor: pointer;
                }
                .captcha-button:active {
                    transform: scale(0.96);
                }
                .getCaptcah:hover {
                    box-shadow: inset 0 0 1px 1px rgba(188, 190, 192, 0.854);
                }
                .captcha-input {
                    width: 43%;
                    height: 90%;
                    border: none;
                    border-radius: 0 3px 3px 0;
                    outline: none;
                    font-size: 14px;
                }
                .captcha-input::placeholder {
                    font-size: 13px;
                    color: rgb(187, 186, 186);
                }

                .password-input,
                .confirm-password-input {
                    width: 89%;
                    height: 90%;
                    border: none;
                    border-radius: 0 3px 3px 0;
                    outline: none;
                    font-size: 14px;
                }

                .password-input::placeholder,
                .confirm-password-input::placeholder {
                    font-size: 13px;
                    color: rgb(187, 186, 186);
                }

                .register-next,
                .register-register,
                .register-back {
                    width: 260px;
                    height: 40px;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    border-radius: 10px;
                    margin-bottom: 15px;
                    color: #fff;
                    background: linear-gradient(155.11deg, rgba(30, 168, 255, 1) 0%, rgba(59, 142, 231, 0.4) 100%);
                    transition: all 0.5s;
                }

                .register-back,
                .register-register {
                    width: 125px;
                    margin: 5px;
                    margin-top: 0px;
                    margin-bottom: 15px;
                }

                .register-back {
                    background: linear-gradient(155.11deg, rgb(197, 197, 197) 0%, rgba(65, 65, 65, 0.4) 100%);
                }

                .register-button:hover {
                    box-shadow: 0 0 10px 2px rgba(30, 169, 255, 0.281);
                }
                .register-button:active {
                    transform: scale(0.9);
                }

                .agreements {
                    font-size: 12px;
                    margin-right: 7px;
                    margin-bottom: 10px;

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
                .gitub {
                    color: rgb(0, 0, 0);
                }
            }

            .third a {
                text-decoration: none;
            }
        }
    }
}

@media screen and (max-width: 1000px) {
    .contents {
        position: absolute;
        width: 1600px;
        height: 800px;
        border-radius: 100px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .illustration {
        display: none;
    }
}
</style>