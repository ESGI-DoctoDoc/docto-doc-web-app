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
    <UAvatar :src="modelValue" size="3xl" />
</template>

<style scoped>

</style>