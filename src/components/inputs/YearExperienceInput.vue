<script lang="ts" setup>
import InputTextBase from "~/components/inputs/base/InputTextBase.vue"
import FormField from "~/components/inputs/base/FormField.vue";

const modelValue = defineModel('modelValue', {
  type: Number,
  default: 0
})

</script>

<template>
  <FormField label="Année d'expérience" name="year" required>
    <InputTextBase
        v-model="modelValue"
        color="primary"
        name="year"
        placeholder="Combien d'années d'expérience vous avez ?"
        required
        type="number"
        variant="outline"
    />
  </FormField>
</template>