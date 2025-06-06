<script lang="ts" setup>

import type {DropdownMenuItem} from "#ui/components/DropdownMenu.vue";
import type {TabsItem} from "#ui/components/Tabs.vue";

enum ActionsType {
  ABSENCE = 'absence',
  EXCEPTIONAL_OPENING = 'exceptional_opening'
}

const emits = defineEmits<{
  (e: 'change-view', view: string | number): void
  (e: 'on-actions', action: ActionsType): void
  (e: 'on-calendar-type'): void
}>()

const items = ref<TabsItem[]>([
  {label: 'Journée', value: 'timeGridDay'},
  {label: 'Semaine', value: 'timeGridWeek'},
  {label: 'Mois', value: 'dayGridMonth'}
])

const planItems = ref<DropdownMenuItem[]>([
  {
    label: 'Une absence',
    icon: 'i-lucide-ban',
    onSelect: () => emits('on-actions', ActionsType.ABSENCE)
  },
  {
    label: 'Une ouverture exceptionnelle',
    icon: 'i-lucide-sun',
    onSelect: () => emits('on-actions', ActionsType.EXCEPTIONAL_OPENING)
  },
]);


</script>

<template>
  <div class="flex items-center justify-between space-x-2 p-3.5" style="min-height: 6vh; max-height: 6vh;">
    <slot name="default">
      <div class="">
        <USwitch class="text-sm" label="Ma semaine type" @change="$emit('on-calendar-type')"/>
      </div>

      <UTabs
          :content="false"
          :items="items"
          class="flex-1 max-w-md"
          default-value="timeGridWeek"
          size="xs"
          variant="pill"
          @update:model-value="$emit('change-view', $event)"
      />

      <UDropdownMenu :items="planItems">
        <UButton class="pl-4" color="primary" label="Planifier" trailing-icon="i-lucide-chevron-down" variant="subtle"/>
      </UDropdownMenu>
    </slot>
  </div>
</template>

<style scoped>

</style>