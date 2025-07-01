<script lang="ts" setup>

import type {DropdownMenuItem} from "#ui/components/DropdownMenu.vue";
import type {TabsItem} from "#ui/components/Tabs.vue";
import {useSession} from "~/composables/auth/useSession";

enum ActionsType {
  ABSENCE = 'absence',
  EXCEPTIONAL_OPENING = 'exceptional_opening',
  APPOINTMENT = 'appointment'
}

const emits = defineEmits<{
  (e: 'change-view', view: string | number): void
  (e: 'on-actions', action: ActionsType): void
  (e: 'on-calendar-type' | 'next' | 'prev'): void
}>()

const {getUser} = useSession()

const canCreate = computed(() => {
  const user = getUser()
  return user?.doctor?.isLicenseActivated === true;
})

const items = ref<TabsItem[]>([
  {label: 'Journée', value: 'timeGridDay'},
  {label: 'Semaine', value: 'timeGridWeek'},
  {label: 'Mois', value: 'dayGridMonth'}
])

const planItems = ref<DropdownMenuItem[]>([
  {
    label: 'Un rendez-vous',
    icon: 'i-lucide-calendar-plus',
    disabled: !canCreate.value,
    onSelect: () => emits('on-actions', ActionsType.APPOINTMENT)
  },
  {
    label: 'Une absence',
    icon: 'i-lucide-ban',
    onSelect: () => emits('on-actions', ActionsType.ABSENCE)
  },
]);


</script>

<template>
  <div class="flex items-center justify-between space-x-2 p-3.5" style="min-height: 6vh; max-height: 6vh;">
    <slot name="default">
      <div class="">
        <USwitch class="text-sm" label="Créneaux configurés" @change="$emit('on-calendar-type')"/>
      </div>

      <div class="flex-1 max-w-md">
        <div class="flex space-x-2 w-full">
          <UButton icon="i-lucide-chevron-left" variant="soft" @click="$emit('prev')"/>
          <UTabs
              :content="false"
              :items="items"
              class="w-full"
              default-value="timeGridWeek"
              size="xs"
              variant="pill"
              @update:model-value="$emit('change-view', $event)"
          />
          <UButton icon="i-lucide-chevron-right" variant="soft" @click="$emit('next')"/>
        </div>
      </div>

      <UDropdownMenu :items="planItems">
        <UButton class="pl-4" color="primary" label="Planifier" trailing-icon="i-lucide-chevron-down" variant="subtle"/>
      </UDropdownMenu>
    </slot>
  </div>
</template>

<style scoped>

</style>