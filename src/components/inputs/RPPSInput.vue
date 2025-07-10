<script lang="ts" setup>
import InputTextBase from "~/components/inputs/base/InputTextBase.vue"
import FormField from "~/components/inputs/base/FormField.vue";

const modelValue = defineModel('modelValue', {
  type: String,
  default: '12345678801'
})

</script>

<template>
  <FormField label="N° RRPS" name="rpps" required>
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
  </FormField>
</template>