<script lang="ts" setup>

import InputTextBase from "~/components/inputs/base/InputTextBase.vue"

const modelValue = defineModel('modelValue', {
  type: String,
  default: ''
})

</script>

<template>
  <UFormField label="Adresse de consultation" name="address" required>
    <InputTextBase
        v-model="modelValue"
        autocomplete="address"
        color="primary"
        name="address"
        placeholder="Entrez votre adresse"
        required
        type="text"
        variant="outline"
    />
  </UFormField>
</template>

<style scoped>

</style>