<template>
    <div class="box">
        <div class="header"> 
            <h5>重命名</h5>
            <i class="iconfont icon-cuowu1" @click="cancel"></i>
        </div>
        <input 
            type="text" 
            placeholder="请输入新的文件名" 
            v-model="name"
        />
        <div class="footer">
            <button @click="cancel">取消</button>
            <button @click="confirm">确定</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue' 
import { post } from '@/utils/request'

const props = defineProps<{
    sendName: {
        name: string,
        fileId: string
    }
}>()
const emit = defineEmits(['sendRename'])
const name = ref("")

watch(() => props.sendName, (value) => {
    name.value = value.name
})

const cancel = () => {
    name.value = ""
    emit('sendRename', {
        option: 'cancel',
        message: ""
    })
}
const confirm = () => {
    post('/content/updateFile', {
        fileId: props.sendName.fileId,
        name: name.value
    }).then((res:any) => {
        emit('sendRename', {
            option: 'confirm',
            message: name.value
        })
    })
}
</script>

<style scoped lang="css">
.box {
    border-radius: 5px;
    background-color: #fff;
    padding: 10px;

    .header {
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;

        i {
            font-size: 20px;
            cursor: pointer;
        }

        h5 {
            margin: 0;
            padding: 0;
            font-size: 16px;
            font-weight: 400;
        }
    }

    input {
        width: 100%;
        height: 30px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 30px;
        padding-left: 10px;
    }
    input:focus {
        outline: none;
        border: 1px solid #2b2c2d;
    }

    .footer {
        display: flex;
        justify-content: flex-end;

        button {
            width: 60px;
            height: 30px;
            margin-left: 10px;
            border: none;
        }
        button:nth-child(1) {
            background-color: #f5f5f5;
        }
        button:nth-child(2) {
            background-color: rgb(250, 236, 228);
            color: rgb(66, 100, 159)
        }
    }
}
</style>