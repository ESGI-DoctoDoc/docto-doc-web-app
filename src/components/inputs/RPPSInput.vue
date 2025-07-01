<script lang="ts" setup>
import InputTextBase from "~/components/inputs/base/InputTextBase.vue"

const modelValue = defineModel('modelValue', {
  type: String,
  default: '12345678801'
})

</script>

<template>
  <UFormField label="N° RRPS" name="rpps" required>
    <InputTextBase
        v-model="modelValue"
        autocomplete="rpps"
        color="primary"
        name="rpps"
        placeholder="Entrez votre n° RRPS"
        required
        type="text"
        variant="outline"
    />
  </UFormField>
</template>