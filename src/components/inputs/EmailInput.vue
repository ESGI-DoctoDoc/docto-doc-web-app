<script setup lang="ts">
import InputTextBase from "~/components/inputs/base/InputTextBase.vue"

const modelValue = defineModel('modelValue', {
  type: String,
  default: ''
})

</script>

<template>
  <UFormField label="Email" name="email" required>
    <InputTextBase
        v-model="modelValue"
        name="email"
        type="email"
        placeholder="Entrez votre email"
        required
        autocomplete="email"
        variant="outline"
        color="primary"
    />
  </UFormField>
</template>