<script setup lang="ts">
import InputTextBase from "~/components/inputs/base/InputTextBase.vue"

const modelValue = defineModel('modelValue', {
  type: String,
  default: 'Abdallah'
})
</script>

<template>
  <UFormField label="Prénom" name="firstName" required>
    <InputTextBase
        v-model="modelValue"
        name="firstName"
        type="text"
        placeholder="Entrez votre prénom"
        required
        autocomplete="given-name"
        variant="outline"
        color="primary"
    />
  </UFormField>
</template>