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
                v-if="store.getUserLongToken()"
                :to="'/personal/' + fatherId"
                class="router"
                active-class="router-active"
            >
                <i class="iconfont icon-sidenav-doc" style="font-size: 18px;"></i>
            </router-link>
            <router-link 
                to="/space" 
                class="router"
                active-class="router-active"
            >
                <i class="iconfont icon-cube-solid"></i>
            </router-link>
            <router-link 
                to="/posts" 
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
import { onMounted, ref, watch } from 'vue';
import { useStore } from '@/store/index';
import { getFatherIdFromHerf } from '@/views/personal/utils'
import router from '@/router';

const store = useStore();
const userId = store.getUserId()
const fatherId = ref<string>(userId);
const props = defineProps(['link'])
onMounted(() => {
    fatherId.value = getFatherIdFromHerf() || userId;
})

watch(() => props.link, (newVal) => {
    if (newVal) {
        fatherId.value = newVal
        router.push('/personal/' + newVal)
    }
})

</script>

<style scoped lang="css">
.main-box {
    display: flex;

    .nav-box {
        display: flex;

        .router {
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