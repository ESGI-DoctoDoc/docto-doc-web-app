<script lang="ts" setup>
import InputTextBase from "~/components/inputs/base/InputTextBase.vue"

const modelValue = defineModel('modelValue', {
  type: Number,
  default: 0
})

</script>

<template>
  <UFormField label="Année d'expérience" name="year" required>
    <InputTextBase
        v-model="modelValue"
        color="primary"
        name="year"
        placeholder="Combien d'années d'expérience vous avez ?"
        required
        type="number"
        variant="outline"
    />
  </UFormField>
</template>