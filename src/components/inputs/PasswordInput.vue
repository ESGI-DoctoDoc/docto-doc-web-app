<script lang="ts" setup>
import InputTextBase from "~/components/inputs/base/InputTextBase.vue"

const modelValue = defineModel('modelValue', {
  type: String,
  default: ''
})

defineProps<{
  forgotPassword?: boolean
}>()

</script>

<template>
  <UFormField label="Mot de passe" name="password" required>
    <template #hint>
      <NuxtLink v-if="forgotPassword" class="text-primary" to="/auth/forgotPassword">Oublié ?</NuxtLink>
    </template>
    <InputTextBase
        v-model="modelValue"
        autocomplete="current-password"
        color="primary"
        name="password"
        placeholder="Entrez votre mot de passe"
        required
        size="md"
        type="password"
        variant="outline"
    />
  </UFormField>
</template>

<style scoped>

</style>