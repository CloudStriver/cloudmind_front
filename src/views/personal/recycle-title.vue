<template>
    <div class="recycle-title-box">
        <header class="recycle-header">
            <div class="recycle-header-header">
                <div>回收站</div>
              <button @click="cleanOutRecycle">
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
    </div>
</template>

<script setup lang="ts">

import {post} from "@/utils/request";
import {successMsg} from "@/utils/message";
const emit = defineEmits(['sendRecycleTitleOptions'])
const cleanOutRecycle = () => {
  post('/content/emptyRecycleBin')
      .then(() => {
        successMsg('成功清空回收站')
        emit('sendRecycleTitleOptions', "cleanOutRecycle")
      })
}
</script>

<style scoped lang="css">
.recycle-title-box {
    width: 100%;
    padding: 0 20px;
    padding-top: 10px;

    .recycle-header {
        width: 100%;
        display: flex;
        flex-direction: column;

        .recycle-header-header {
            display: flex;
            justify-content: space-between;

            div {
                font-size: 20px;
                font-weight: 600;
                color: rgb(61, 108, 171);
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
            margin-top: 10px;
            margin-bottom: 10px;

            label {
                font-size: 15px;
                color: #686666;
                cursor: pointer;
                user-select: none;

                input {
                    margin-right: 10px;
                }
            }
        }

        .recycle-header-footer {
            height: 30px;
            font-size: 15px;
            color: #a8a7a7;
            border-bottom: 1px solid #e5e5e586;
            display: flex;
            justify-content: space-between;

            div:first-child {
                width: 68.5%;
            }
        }
    }
}
</style>