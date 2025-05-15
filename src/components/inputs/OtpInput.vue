<script lang="ts" setup>

const modelValue = defineModel<string[]>('modelValue')

</script>

<template>
  <UPinInput v-model="modelValue" :length="6" otp size="xl" type="number"  />
</template>

<style scoped>

</style>