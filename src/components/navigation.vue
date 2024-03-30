<template>
    <div class="nav-main-box">
        <img 
        class="logo"
        src="../assets/images/logo.png" 
        alt="logo"
        >
        <i class="iconfont icon-gengduo-2 more"></i>
        <div class="nav-box">
            <router-link 
                to="/" 
                class="router-nav"
                active-class="router-active"
            >
                <i class="iconfont icon-home-solid"></i>
            </router-link>
            <router-link
                v-if="store.getUserLongToken()"
                :to="{name: 'personal', params: {fatherId: fatherId}}"
                class="router-nav"
                active-class="router-active"
                exact-active-class="router-active"
            >
                <i class="iconfont icon-sidenav-doc" style="font-size: 18px;"></i>
            </router-link>
            <router-link 
                to="/space" 
                class="router-nav"
                active-class="router-active"
            >
                <i class="iconfont icon-cube-solid"></i>
            </router-link>
            <router-link 
                to="/posts" 
                class="router-nav"
                active-class="router-active"
            >
                <i class="iconfont icon-edit-solid"></i>
            </router-link>
            <!-- <router-link 
                to="/5" 
                class="router-nav"
                active-class="router-active"
            >
                <i class="iconfont icon-huodong"></i>
            </router-link>
            <router-link 
                to="/6" 
                class="router-nav"
                active-class="router-active"
            >
                <i class="iconfont icon-shopping-cart-solid"></i>
            </router-link> -->
            <router-link
                to="/manage"
                class="router-nav"
                active-class="router-active"
            >
                <i class="iconfont icon-guanlizhongxin-shezhi-01"></i>
            </router-link>
            <router-link
                to="/test"
                class="router-nav"
                active-class="router-active"
            >
                测试
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useStore } from '@/store/index';
import router from '@/router';

const store = useStore();
const userId = store.getUserId()
const fatherId = ref<string>(userId);
const props = defineProps(['link'])

watch(() => props.link, (newVal) => {
    if (newVal) {
        fatherId.value = newVal
        router.push('/personal/' + newVal)
    }
})

</script>

<style scoped lang="css">
.nav-main-box {
    display: flex;
    align-items: center;

    .more {
        font-size: 22px;
        color: rgb(165, 180, 197);
        cursor: pointer;
    }
    .logo {
        transform: scale(0.5);
    }

    .nav-box {
        .router-nav {
            text-decoration: none;
            display: flex;
            justify-content: center;
            align-items: center;
            
            i {
                font-size: 22px;
                margin: 25px;
                color: #a0a0a0;
            }

        }
        .router:hover {
            i {
                color: rgb(165, 180, 197);
            }
        }
        .router-active {
            i {
                color: rgb(107, 167, 232)
            }
        }
    }
}
@media screen and (min-width: 780px){
    .nav-box {
        display: flex;
    }
    .more {
        display: none;
    }
}
@media screen and (max-width: 780px) {
    .more {
        display: block;
        margin-right: 20px;
    }
    .nav-box {
        display: none;
    }
}
</style>