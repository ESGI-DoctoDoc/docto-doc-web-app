<script lang="ts" setup>

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
  <UFormField label="Mot de passe" name="password" required>
    <template #hint>
      <NuxtLink v-if="forgotPassword" class="text-primary" to="/auth/forgotPassword">Oublié ?</NuxtLink>
    </template>
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
  </UFormField>
</template>

<style scoped>

</style>