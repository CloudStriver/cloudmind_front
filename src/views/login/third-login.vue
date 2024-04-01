<template>
    <div class="third">
        <div class="third-login">
            <div></div>
            <div>第三方登录</div>
            <div ></div>
        </div>
        <div>
            <a href="https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=102103336&redirect_uri=https://cloudmind.top/login&scope=state">
              <i class="iconfont icon-qq qq" ></i>
            </a>
            <i class="iconfont icon-weixin weixin" @click="getQrCode"></i>
            <i class="iconfont icon-gitub gitub"></i>
            <a href="https://gitee.com/oauth/authorize?client_id=10dfe502136745d1f135474390c4cb6cd50fce3a5bf7a167891d3b0ec184d2eb&redirect_uri=https://cloudmind.top/login&response_type=code" target="_blank">
                <i class="iconfont icon-gitee1 gitee"></i>
            </a>
        </div>
      <div v-if="qrCodeUrl" class="qr-code-container">
        <img :src="qrCodeUrl" alt="WeChat QR Code" />
      </div>
    </div>
</template>

<script setup lang="ts">
import {onUnmounted, ref} from "vue";
import {get, post} from "@/utils/request";
import router from "@/router";
import {useStore} from "@/store";

const store = useStore()
const qrCodeUrl = ref('');
const tempUserId = ref('');
const pollingInterval = 2000; // 轮询间隔，例如 2000 毫秒（2秒）
let pollingTimer: number | null = null; // 明确指定类型为 number | null

const getQrCode = () => {
   get("https://apisix.cloudmind.top/auth/weixinLogin").then((res: any) => {
     qrCodeUrl.value = res.qrUrl
     tempUserId.value = res.tempUserId
     startPolling(); // 获取到 QR Code 后开始轮询
  })
}

// 开始轮询登录状态
const startPolling = () => {
  pollingTimer = window.setInterval(() => {
    checkLoginStatus();
  }, pollingInterval) as unknown as number; // 断言为 unknown 后再断言为 number
};

// 检查登录状态
const checkLoginStatus = () => {
  post("https://apisix.cloudmind.top/auth/weixinIsLogin", {
    tempUserId: tempUserId.value,
  }).then((res: any) => {
    if (res.userId !== "") {
      clearInterval(pollingTimer as number); // 这里也可能需要断言
      store.setUserLocal (res.shortToken, res.longToken, res.userId)
      router.push('/')
    }
    // 可以根据需要处理其他登录状态，例如登录失败
  }).catch((error) => {
    console.error('Error checking login status:', error);
  });
};

// 组件卸载时清除轮询定时器，避免内存泄露
onUnmounted(() => {
  if (pollingTimer !== null) {
    clearInterval(pollingTimer as number); // 断言为 number
  }
});


</script>

<style scoped lang="css">
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
        font-size: 13px;
        color: rgb(187, 186, 186);
        user-select: none;
    }

    a {
        text-decoration: none;
    }

    i {
        font-size: 30px;
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

  .qr-code-container {
    position: relative;
    width: 100%;
    height: 100vh; /* 使用视口高度作为容器高度，确保容器填满整个屏幕 */
  }

  .qr-code-container img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* 通过转换移动图片，使其准确居中 */
  }
}
</style>