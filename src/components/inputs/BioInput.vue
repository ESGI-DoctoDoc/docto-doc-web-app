<script lang="ts" setup>

import InputAreaBase from "~/components/inputs/base/InputAreaBase.vue";
import FormField from "~/components/inputs/base/FormField.vue";

const modelValue = defineModel('modelValue', {
  type: String,
  default: 'yoyo'
})


</script>

<template>
  <FormField label="Bio" name="bio" required>
    <InputAreaBase v-model="modelValue" :rows="3" placeholder="Votre bio."/>
  </FormField>
</template>

<style scoped>

</style>