<script lang="ts" setup>
import InputTextBase from "~/components/inputs/base/InputTextBase.vue"

const modelValue = defineModel('modelValue', {
  type: String,
  default: ''
})

</script>

<template>
  <UFormField label="Numéro de téléphone" name="phone" required>
    <InputTextBase
        v-model="modelValue"
        :maxLength="10"
        autocomplete="tel"
        color="primary"
        name="phone"
        placeholder="06 12 34 56 78"
        required
        size="md"
        type="tel"
        variant="outline"
    />
  </UFormField>
</template>

<style scoped>

</style>