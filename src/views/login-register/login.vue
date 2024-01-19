<template>
    <div class="main-box">
        <img src="../../assets/images/background-circle.png" class="circle">
        <div class="panel">
            <img src="../../assets/images/illustration.png" 
                 style="transform: scale(0.7); -webkit-user-drag: none;">
            <div class="contents">
                <div class="cloudmind">
                    <img src="../../assets/images/cloudmind.png">
                </div>
                <div class="switch">
                    <button>登 录</button>
                    <button style="cursor: pointer;">注 册</button>
                </div>
                <div class="input">
                    <div class="account">
                        <i class="iconfont icon-user-solid"
                            style="color: rgb(187, 186, 186)">
                        </i>
                        <input class="account-input" 
                               type="text"
                               placeholder="邮箱"
                               v-model="account"
                               @input="judgeAccount"
                        >
                    </div>
                    <div class="password">
                        <i class="iconfont icon-lock-solid" 
                           style="color: rgb(187, 186, 186)">
                        </i>
                        <input class="password-input" 
                               type="password"
                               placeholder="密码"
                        >
                    </div>
                    <div v-if="isCaptcha" class="captcha">
                        <Captcha></Captcha>
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
import Captcha from '@/components/captcha.vue'
import { ref } from 'vue'
import { judgeEmail } from './utils'

let account = ref("")
let isCaptcha = ref(false)
let isEmail = ref(false)

const judgeAccount = () => {
    isEmail.value = judgeEmail(account.value)
    if (isEmail.value) {
        isCaptcha.value = true
    } 
    else {
        isCaptcha.value = false
    }
}

const login = () => {
    if (isCaptcha.value) {
        console.log("登录成功");
        
    }
    else {
        console.log("登录失败");
    }
}

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
                width: 100%;
                height: auto;
                margin-bottom: 10px;
                padding: 0 10px 10px 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;

                .account, 
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
                .account:hover,
                .password:hover {
                    box-shadow: inset 0 0 1px 1px rgba(188, 190, 192, 0.854);
                }

                .account-input,
                .password-input {
                    width: 89%;
                    height: 90%;
                    border: none;
                    border-radius: 0 3px 3px 0;
                    outline: none;
                    font-size: 14px;
                }
                .account-input::placeholder,
                .password-input::placeholder {
                    font-size: 13px;
                    color: rgb(187, 186, 186);
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

                    .forget {
                        cursor: pointer;
                        color: rgba(60, 176, 253, 1);
                    }
                    .forget:hover {
                        text-decoration: underline;
                        color: blue;
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
                }
                .login-button:hover {
                    box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.2);
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