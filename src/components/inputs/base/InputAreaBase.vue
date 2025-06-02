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
  maxRows?: number
}>()

</script>

<template>
  <UTextarea v-model="modelValue" :maxrows="5" :placeholder :rows="rows" autoresize class="w-full"/>
</template>

<style scoped>

</style>