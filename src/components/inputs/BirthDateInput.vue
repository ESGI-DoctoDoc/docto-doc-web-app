<script lang="ts" setup>

import InputDateBase from "~/components/inputs/base/InputDateBase.vue";

const modelValue = defineModel<string>('modelValue')
</script>

<template>
  <UFormField>
    <InputDateBase v-model="modelValue"/>
  </UFormField>
</template>

<style scoped>

</style>