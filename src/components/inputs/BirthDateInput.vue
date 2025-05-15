<script lang="ts" setup>

import InputDateBase from "~/components/inputs/base/InputDateBase.vue";
import type {CalendarDate} from "@internationalized/date";

const modelValue = defineModel<CalendarDate>('modelValue')
</script>

<template>
  <UFormField>
    <InputDateBase v-model="modelValue"/>
  </UFormField>
</template>

<style scoped>

</style>