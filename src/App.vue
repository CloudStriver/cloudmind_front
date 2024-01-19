<script setup lang="ts">
import Message from '@/components/message/message.vue'
</script>

<template>
  <div id="App">
    <Message></Message>
    <router-view></router-view>
  </div>
</template>

<style scoped lang="css">
#App {
  width: 100%;
  height: 100%;
}
</style>
