<script lang="ts" setup>

const modelValue = defineModel('modelValue', {
  type: String,
  default: ''
})

defineProps<{
  rows?: number
  placeholder?: string
  autoresize?: boolean
  required?: boolean
}>()

</script>

<template>
  <UTextarea v-model="modelValue" :placeholder :rows class="w-full"/>
</template>

<style scoped>

</style>