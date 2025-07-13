<script lang="ts" setup>

import FormField from "~/components/inputs/base/FormField.vue";

const modelValue = defineModel('modelValue', {
  type: String,
  default: ''
})

defineProps<{
  forgotPassword?: boolean
}>()

const show = ref(false)

</script>

<template>
  <FormField forgot-password label="Mot de passe" name="password" required>
    <UInput
        v-model="modelValue"
        :type="show ? 'text' : 'password'"
        :ui="{ trailing: 'pe-1' }"
        class="w-full"
        placeholder="Password"
    >
      <template #trailing>
        <UButton
            :aria-label="show ? 'Hide password' : 'Show password'"
            :aria-pressed="show"
            :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            aria-controls="password"
            color="neutral"
            size="sm"
            variant="link"
            @click="show = !show"
        />
      </template>
    </UInput>
  </FormField>
</template>

<style scoped>

</style>