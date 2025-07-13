<script setup lang="ts">
import InputTextBase from "~/components/inputs/base/InputTextBase.vue"
import FormField from "~/components/inputs/base/FormField.vue";

const modelValue = defineModel('modelValue', {
  type: String,
  default: ''
})
</script>

<template>
  <FormField label="Prénom" name="firstName" required>
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
  </FormField>
</template>