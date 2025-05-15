<script lang="ts" setup>

import InputAreaBase from "~/components/inputs/base/InputAreaBase.vue";

const modelValue = defineModel('modelValue', {
  type: String,
  default: ''
})


</script>

<template>
  <InputAreaBase v-model="modelValue" :rows="3" placeholder="Votre bio."/>
</template>

<style scoped>

</style>