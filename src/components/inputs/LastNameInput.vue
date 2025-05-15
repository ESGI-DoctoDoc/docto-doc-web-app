<script setup lang="ts">
import InputTextBase from "~/components/inputs/base/InputTextBase.vue"

const modelValue = defineModel('modelValue', {
  type: String,
  default: ''
})
</script>

<template>
  <UFormField label="Nom" name="lastName" required>
    <InputTextBase
        v-model="modelValue"
        name="lastName"
        type="text"
        placeholder="Entrez votre nom"
        required
        autocomplete="family-name"
        variant="outline"
        color="primary"
    />
  </UFormField>
</template>