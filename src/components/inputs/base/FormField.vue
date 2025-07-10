<script lang="ts" setup>
import {useTranslate} from '~/composables/useTranslate'

const {translate} = useTranslate()
</script>

<template>
  <UFormField v-bind="$attrs">
    <template #default>
      <slot/>
    </template>
    <template #error="{ error }">
      <span v-if="error && typeof error === 'string'">{{ translate(error) }}</span>
    </template>
  </UFormField>
</template>