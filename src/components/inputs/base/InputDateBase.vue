<script setup lang="ts">
import type { CalendarDate} from '@internationalized/date';
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

const modelValue = defineModel<CalendarDate>();

const df = new DateFormatter('fr-FR', {
  dateStyle: 'medium'
})

// const modelValue = shallowRef(new CalendarDate(2022, 1, 10))
</script>

<template>
  <UPopover>
    <UButton class="w-full flex justify-center" color="neutral" variant="subtle" icon="i-lucide-calendar">
      {{ modelValue ? df.format(modelValue.toDate(getLocalTimeZone())) : 'Select a date' }}
    </UButton>

    <template #content>
      <UCalendar v-model="modelValue" class="p-2" />
    </template>
  </UPopover>
</template>

