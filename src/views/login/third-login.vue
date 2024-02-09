<template>
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
            <a href="https://gitee.com/oauth/authorize?client_id=10dfe502136745d1f135474390c4cb6cd50fce3a5bf7a167891d3b0ec184d2eb&redirect_uri=https://cloudmind.top/login&response_type=code" target="_blank">
                <i class="iconfont icon-gitee1 gitee"></i>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
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
}
</style>