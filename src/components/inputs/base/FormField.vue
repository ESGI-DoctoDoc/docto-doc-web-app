<script lang="ts" setup>
import {useTranslate} from '~/composables/useTranslate'

const {translate} = useTranslate()

defineProps<{
  forgotPassword?: boolean
}>()

</script>

<template>
  <UFormField v-bind="$attrs">
    <template #hint>
      <NuxtLink v-if="forgotPassword" class="text-primary" to="/auth/forgotPassword">Oublié ?</NuxtLink>
    </template>
    <template #default>
      <slot/>
    </template>
    <template #error="{ error }">
      <span v-if="error && typeof error === 'string'">{{ translate(error) }}</span>
    </template>
  </UFormField>
</template>