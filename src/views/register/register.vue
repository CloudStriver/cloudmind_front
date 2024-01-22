<template>
    <div class="main-box">
        <img src="../../assets/images/background-circle.png" class="circle">
        <div class="panel">
            <img 
                src="../../assets/images/illustration.png" 
                style="transform: scale(0.7); -webkit-user-drag: none; "
            >
            <div class="contents">
                <div class="cloudmind">
                    <img src="../../assets/images/cloudmind.png">
                </div>
                <div class="switch">
                    <button style="cursor: pointer;" @click="login">登 录</button>
                    <button>注 册</button>
                </div>
                <div class="input">
                    <div class="email">
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
                        >
                        <!-- textPassword测试密码 -->
                        <button @click="textPassword">获取验证码</button> 
                    </div>
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
                    <button class="register-button" @click="register">注册</button>
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
                        <i class="iconfont icon-gitee1 gitee"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '../../router/index'
import { ref } from 'vue'
import { judgeEmail, judgePassword } from '@/utils/judge'

const email = ref('')
const isEmail = ref(false)
const errorEmail = ref(false)
const EmailMsg = ref('')
const setCaptcha = ref(true)
const setPassword = ref(false)
const password = ref('')
const confirmPassword = ref('')
const errorPassword = ref(false)
const passwordMsg = ref('')
const errorConfirmPassword = ref(false)
const confirmPasswordMsg = ref('')
const isPassword = ref(false)

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

const passwordBlur =() => {
    if (password.value === '') {
        errorPassword.value = true
        passwordMsg.value = '密码不能为空'
        return
    }
    if (!judgePassword(password.value)) {
        errorPassword.value = true
        passwordMsg.value = '密码格式不正确'
    } else {
        errorPassword.value = false
        passwordMsg.value = ''
    }
}

const confirmPasswordBlur = () => {
    if (confirmPassword.value !== password.value) {
        errorConfirmPassword.value = true
        confirmPasswordMsg.value = '两次密码不一致'
    } else {
        errorConfirmPassword.value = false
        confirmPasswordMsg.value = ''
        isPassword.value = true
    }
}

const textPassword = () => {
    if (isEmail.value) {
        setCaptcha.value = false
        setPassword.value = true
    }
    else {
        errorEmail.value = true
        EmailMsg.value = '邮箱格式不正确'
    }
}

const register = () => {
    if (isEmail.value && isPassword.value) {
        console.log('注册成功')
        router.push('/')
    } 
}

const login = () => router.push('/login')
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
                .confirm-password-msg {
                    position: absolute;
                    font-size: 10px;
                    color: #d84141;
                    left: 55px;
                }
                .email-msg {
                    top: 32px;
                }
                .password-msg {
                    top: 79.5px;
                }
                .confirm-password-msg {
                    top: 126px;
                }

                .getCaptcah button {
                    width: 40%;
                    height: 90%;
                    border: none;
                    outline: none;
                    font-size: 12px;
                    color: rgb(50, 145, 209);
                    background-color: #fff;
                }
                .getCaptcah:hover {
                    box-shadow: inset 0 0 1px 1px rgba(188, 190, 192, 0.854);
                }
                .captcha-input {
                    width: 45%;
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

                .register-button {
                    width: 220px;
                    height: 32px;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    border-radius: 10px;
                    margin-top: 15px;
                    margin-bottom: 10px;
                    color: #fff;
                    background: linear-gradient(155.11deg, rgba(30, 168, 255, 1) 0%, rgba(59, 142, 231, 0.4) 100%);
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
            }
        }
    }
}
</style>