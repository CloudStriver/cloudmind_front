<template>
    <div class="main-box"> 
        <div class="path">
            <div class="path-item">
                Coulea
                <div>></div>
            </div>
            <div class="nowPath">ni</div>
        </div> 
        <div class="header-bottom">
            <label for="allSelect">
                <input 
                    type="checkbox"
                    id="allSelect"
                >全选
            </label>
            <div class="sort">
                <i class="iconfont icon-paixu"></i>
                <span>按照时间排序</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="css">
.main-box {
    display: flex;
    flex-direction: column;

    .path {
        font-size: 20px;
        padding: 0 20px;
        margin-bottom: 10px;
        color: rgb(61, 108, 171);
        display: flex;

        .path-item {
            display: flex;
            cursor: pointer;
            user-select: none;
            color: #b7b6b6;

            div {
                margin: 0 5px;
            }
        }
        .path-item:hover {
            color: #789bbc;

            div {
                color: #b7b6b6;
            }
        }

        .nowPath {
            font-weight: 550;
            cursor: pointer;
        }
    }

    .header-bottom {
        margin: 0 20px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        label {
            font-size: 15px;
            color: #646363;
            vertical-align: middle;
            cursor: pointer;
            user-select: none;

            input {
                vertical-align: middle;
                margin-right: 10px;
            }
        }

        .sort {
            font-size: 15px;
            color: #646363;
            cursor: pointer;
            user-select: none;

            i {
                margin-right: 5px;
            }
        }
    }
}
</style>