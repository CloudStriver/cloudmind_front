<template>
    <div class="main-box">
        <CHeader class="cheader"></CHeader>
        <div class="contents-box">
            <div class="contents">
                <div class="manage-box">
                    <h1>管理中心</h1>
                    <div class="manage-menu">
                        <router-link
                            to="/manage/goods"
                            class="goods"
                        >
                            <i class="iconfont icon-shangpinzhongxin"></i>
                            <p>商品中心</p>
                        </router-link>
                        <router-link
                            to="/manage/order"
                            class="order"
                        >
                            <i class="iconfont icon-dingdanzhongxin"></i>
                            <p>订单中心</p>
                        </router-link>
                        <router-link
                            to="/manage/post"
                            class="post"
                        >
                            <i class="iconfont icon-tieziguanli"></i>
                            <p>帖子中心</p>
                        </router-link>
                        <router-link
                            to="/manage/collect"
                            class="collect"
                        >
                            <i class="iconfont icon-shoucangjia"></i>
                            <p>收藏夹</p>
                        </router-link>
                        <router-link
                            to="/manage/shop"
                            class="shop"
                        >
                            <i class="iconfont icon-gouwuche"></i>
                            <p>购物车</p>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CHeader from '@/components/header.vue'
</script>

<style scoped lang="css">
.main-box {
    width: 100%;
    height: 100%;
    display: flex; 
    flex-direction: column;

    .cheader {
        width: 100%;
        height: 70px;
    }

    .contents-box {
        width: 100%;
        height: 100%;
        background-color: rgba(240, 245, 255, 1);
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .contents {
            
            .manage-box {
                display: flex;
                flex-direction: column;

                .manage-menu {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }
            }

            .goods,
            .order,
            .post,
            .collect,
            .shop {
                color: #000;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 0 10px #a6a6a6;
                font-size: 20px;
                margin: 30px;
                padding: 0px 60px 0px 10px;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;

                i {
                    font-size: 30px;
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>