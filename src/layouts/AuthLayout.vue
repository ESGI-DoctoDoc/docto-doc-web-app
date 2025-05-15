<script setup lang="ts">
const logo = new URL('@/assets/images/logo.png', import.meta.url).href
</script>

<template>
  <div class="h-screen w-screen">
    <header>
      <div class="relative" @click="() => $router.push('/')">
        <img :src="logo" alt="Logo" class="h-12 w-auto absolute ml-2 mt-2 cursor-pointer">
      </div>
    </header>
    <main class="flex items-center justify-center fit">
      <slot />
    </main>
  </div>
</template>


<style scoped>

</style>