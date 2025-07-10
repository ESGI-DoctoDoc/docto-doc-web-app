<script setup lang="ts">
import InputTextBase from "~/components/inputs/base/InputTextBase.vue"
import FormField from "~/components/inputs/base/FormField.vue";

const modelValue = defineModel('modelValue', {
  type: String,
  default: 'Slimane'
})
</script>

<template>
  <FormField label="Nom" name="lastName" required>
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
  </FormField>
</template>