<script lang="ts" setup>

const modelValue = defineModel('modelValue', {
  type: String,
  default: ''
})

defineProps<{
  readonly?: boolean
}>()

</script>

<template>
  <UAvatar v-if="modelValue" :src="modelValue" size="3xl"/>
  <UAvatar v-else size="3xl"/>
</template>

<style scoped>

</style>