<script lang="ts" setup>

import InputAreaBase from "~/components/inputs/base/InputAreaBase.vue";

const modelValue = defineModel('modelValue', {
  type: String,
  default: 'yoyo'
})


</script>

<template>
  <UFormField label="Bio" name="bio" required>
    <InputAreaBase v-model="modelValue" :rows="3" placeholder="Votre bio."/>
  </UFormField>
</template>

<style scoped>

</style>