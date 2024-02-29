<template>
    <div class="main-box">
        <Drawer class="drawer"></Drawer>
        <div class="contents-box">
            <div class="header">
                <CHeader class="cheader"></CHeader>
                <PathTitle></PathTitle>
            </div>
            <div class="bottom">
                <Files class="files"></Files>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Files from './files.vue'
import Drawer from './drawer.vue'
import PathTitle from './path.vue'
import CHeader from '@/components/header.vue'

</script>

<style scoped lang="css">
.main-box {
    height: 100%;
    display: flex;

    .drawer {
        height: 100%;
        z-index: 2;
    }

    .contents-box {
        flex: 1;
        display: flex;
        flex-direction: column;

        .header {
            display: flex;
            flex-direction: column;
            
            .cheader:deep(.header-box) {
                height: 55px;
                padding: 0 20px 0 0 ;
                background-color: #fff;
                box-shadow: none;
            }
            .cheader:deep(.logo) {
                display: none;
            }
        }

        .bottom {
            padding: 20px;
            flex: 1;

            .files {

            }
        }
    }
}
</style>