<script lang="ts" setup>
import InputDateBase from "~/components/inputs/base/InputDateBase.vue"

// Déclaration du v-model venant du parent
const modelValue = defineModel<string>('modelValue')

// Valeur par défaut si non définie
if (!modelValue.value) {
  modelValue.value = '1990-01-01'
}
</script>

<template>
  <UFormField label="Date de naissance" name="birthDate" required>
    <InputDateBase v-model="modelValue" />
  </UFormField>
</template>

<style scoped>
</style>