<template>
    <div class="main-box">
        <img 
            src="../assets/images/logo.png" 
            alt="logo"
            style="transform: scale(0.5);"
        >
        <div class="nav-box">
            <router-link 
                to="/" 
                class="router"
                active-class="router-active"
            >
                <i class="iconfont icon-home-solid"></i>
            </router-link>
            <router-link
                to="/personal"
                class="router"
                active-class="router-active"
            >
                <i class="iconfont icon-sidenav-doc" style="font-size: 22px;"></i>
            </router-link>
            <router-link 
                to="/space" 
                class="router"
                active-class="router-active"
            >
                <i class="iconfont icon-cube-solid"></i>
            </router-link>
            <router-link 
                to="/4" 
                class="router"
                active-class="router-active"
            >
                <i class="iconfont icon-edit-solid"></i>
            </router-link>
            <router-link 
                to="/5" 
                class="router"
                active-class="router-active"
            >
                <i class="iconfont icon-huodong"></i>
            </router-link>
            <router-link 
                to="/6" 
                class="router"
                active-class="router-active"
            >
                <i class="iconfont icon-shopping-cart-solid"></i>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="css">
.main-box {
    width: 80px;
    background-color: rgb(219, 235, 255);
    padding-top: 10px;
    display: flex;
    flex-direction: column;

    .nav-box {
        width: 80px;
        padding-top: 30px;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;

        .router {
            width: 80px;
            height: 50px;
            text-decoration: none;
            margin-bottom: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            
            i {
                font-size: 25px;
                color: rgb(137, 161, 208);
            }

        }
        .router:hover {
            background-color: rgba(213, 228, 242, 0.978);
        }
       

        .router-active {
            border-right: 2px solid rgb(76, 145, 220);
            i {
                color: rgb(76, 145, 220);
                font-weight: 700;
            }
        }
    }
}
</style>