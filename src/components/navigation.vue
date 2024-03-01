<template>
    <div class="main-box">
        <img 
            class="logo"
            src="../assets/images/logo.png" 
            alt="logo"
        >
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
                :to="'/personal/'"
                class="router-nav"
                active-class="router-active"
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
            <router-link 
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
            </router-link>
            <router-link
                to="/manage"
                class="router-nav"
                active-class="router-active"
            >
                <i class="iconfont icon-guanlizhongxin-shezhi-01"></i>
            </router-link>
            <router-link
                :to="{name: 'text-personal', params: {fatherId: fatherId}}"
                class="router-nav"
                active-class="router-active"
                exact-active-class="router-active"
            >
                <i class="iconfont icon-sidenav-doc" style="font-size: 18px;"></i>
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

watch(() => props.link, (newVal) => {
    if (newVal) {
        fatherId.value = newVal
        router.push('/text-personal/' + newVal)
    }
})

</script>

<style scoped lang="css">
.main-box {
    display: flex;

    .logo {
        transform: scale(0.5);
    }

    .nav-box {
        display: flex;

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
</style>