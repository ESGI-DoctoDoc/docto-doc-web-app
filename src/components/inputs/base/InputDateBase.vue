<script setup lang="ts">

const modelValue = defineModel<string>();
</script>

<template>
  <UInput v-model="modelValue" class="w-full" type="date"/>
</template>

