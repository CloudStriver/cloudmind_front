<template>
    <div class="forget-box">
        <img src="../../assets/images/background-circle.png" class="circle">
        <div class="forget-panel">
            <img src="../../assets/images/cloudmind.png" alt="">
            <div class="contents">
                <div class="title">{{ title }}</div>
                <el-form
                    ref="ruleFormRef"
                    style="max-width: 600px"
                    :model="ruleForm"
                    status-icon
                    label-width="auto"
                    class="demo-ruleForm"
                    @submit.prevent="submitForm(ruleFormRef)"
                >
                    <el-form-item 
                        v-if="step === '找回密码'"
                        prop="email"
                        :rules="[
                        {
                            required: true,
                            message: '请输入邮箱',
                            trigger: 'blur',
                        },
                        {

                            type: 'email',
                            message: '请输入正确的邮箱格式',
                            trigger: ['blur', 'change'],
                        },
                        ]"  
                    >
                        <el-input 
                            v-model="ruleForm.email" 
                            type="email" 
                            prefix-icon="User"
                            placeholder="请输入邮箱"
                        />
                    </el-form-item>
                    <el-form-item 
                        v-if="step === '验证码验证'"
                        prop="verification"
                        :rules="[
                            {
                                required: true,
                                message: '请输入验证码',
                                trigger: ['blur', 'change'],
                            },
                        ]"
                    >
                        <el-input 
                            v-model="ruleForm.verification" 
                            type="text" 
                            placeholder="请输入验证码"
                        />
                    </el-form-item>
                    <el-form-item 
                        v-if="step === '重置密码'"
                        prop="password"
                        class="confirm-password"
                        :rules="[
                            {
                                required: true,
                                message: '请输入密码',
                                trigger: ['blur', 'change'],
                            },
                            {
                                min: 8,
                                message: '密码长度不能小于8位',
                                trigger: ['blur', 'change'],
                            },
                            {
                                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/,
                                message: '密码必须包含数字和字母',
                                trigger: ['blur', 'change'],
                            }
                        ]"
                    >
                        <el-input 
                            v-model="ruleForm.password" 
                            type="password" 
                            prefix-icon="Password"
                            placeholder="请输入新密码"
                        />
                    </el-form-item>
                    <el-form-item 
                        v-if="step === '重置密码'"
                        prop="confirmPassword"
                        :rules="[
                            {
                                required: true,
                                message: '请再次输入密码',
                                trigger: 'blur',
                            },
                            confirmPasswordRules
                        ]"
                    >
                        <el-input 
                            v-model="ruleForm.confirmPassword" 
                            type="password" 
                            prefix-icon="Password"
                            placeholder="请确认新密码"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button 
                            type="primary" 
                            @click="submitForm(ruleFormRef)"
                        >{{ buttonMsg }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { post, get } from '@/utils/request'
import type { FormInstance } from 'element-plus'
import { errorMsg, successMsg } from '@/utils/message';

const step = ref('找回密码')
const title = ref('找回密码')
const buttonMsg = ref('下一步')
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref({
    email: '',
    verification: '',
    password: '',
    confirmPassword: '',
})

const confirmPasswordRules = {
    validator: (rule: any, value: string, callback: any) => {
        if (value === '') {
            callback(new Error('请输入新密码'))
        } else if (value !== ruleForm.value.password) {
            callback(new Error('两次输入密码不一致!'))
        } else {
            callback()
        }
    },
    trigger: 'blur',
}

const submitForm = (formEl: FormInstance | undefined) => {
    if (buttonMsg.value === '下一步') {
        if (step.value === '找回密码') {
            if (!formEl) return
            formEl.validate((valid) => {
                if (valid) {
                    post(false, '/auth/sendEmail', {
                        email: ruleForm.value.email,
                        subject: '找回密码',
                    })
                    .then(() => {
                        step.value = '验证码验证'
                        title.value = `${ruleForm.value.email}进行验证`
                        buttonMsg.value = '下一步'
                        successMsg('验证码已发送至您的邮箱，请注意查收！')
                    })
                }
                else {
                    return false;
                }
            })
        }
        else if (step.value === '验证码验证') {
            if (!formEl) return
            formEl.validate((valid) => {
                if (valid) {
                    const CheckEmailUrl = "/auth/checkEmail"
                    get(false, `${CheckEmailUrl}?email=${ruleForm.value.email}&code=${ruleForm.value.verification}`)
                    .then((res: any) => {
                        if (res.ok) {
                            step.value = '重置密码'
                            title.value = '重置密码'
                            buttonMsg.value = '完成'
                        }
                        else {
                            errorMsg('验证码错误，请重新输入！')
                        }
                    })
                    .catch((err: any) => {
                        errorMsg(err)
                    })
                }
                else {
                    return false;
                }
            })
        }
    }
    else {
        if (!formEl) return
        formEl.validate((valid) => {
            if (valid) {
                post(false, '/auth/setPasswordByEmail', {
                    email: ruleForm.value.email,
                    password: ruleForm.value.password,
                })
                .then((res: any) => {
                    if (res.Code === 0) {
                        errorMsg(res.Msg)
                    }
                    else {
                        successMsg(res.Msg)
                        setTimeout(() => {
                            // window.location.href = '/login'
                        }, 2000)
                    }
                })
            }
            else {
                return false;
            }
        })
    }
}
</script>
<style scoped lang="css">
.forget-box {
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow: auto;
    background-color: rgba(240, 245, 255, 1);
    display: flex;
    justify-content: center;
    align-items: center;

    .circle {
        position: absolute;
        width: 20%;
        right: 20px;
        bottom: 20px;
    }

    .forget-panel {
        width: 380px;
        height: 380px;
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;

        img {
            padding: 0;
            transform: scale(0.7);
        }

        .contents {
            margin: 20px 60px 0 60px;
    
            .title {
                margin-bottom: 30px;
                padding-left: 20px;
                border-left: 3px solid #409EFF;
            }
    
            .el-input {
                margin-bottom: 30px;
                height: 40px;
            }

            button {
                width: 100%;
                height: 40px;
                border: none;
                cursor: pointer;
                font-size: 15px;
                border-radius: 5px;
                margin-bottom: 15px;
                color: #fff;
                background: linear-gradient(155.11deg, rgba(30, 168, 255, 1) 0%, rgba(59, 142, 231, 0.4) 100%);
            }

            .demo-ruleForm:deep(.el-form-item__error) {
                top: 45px;
            }

            .confirm-password {
                margin-bottom: 0;
            }
        }
    }
}
</style>