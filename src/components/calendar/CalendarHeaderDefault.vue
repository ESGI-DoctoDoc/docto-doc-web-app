<script lang="ts" setup>

import type {DropdownMenuItem} from "#ui/components/DropdownMenu.vue";
import type {TabsItem} from "#ui/components/Tabs.vue";
import {useSession} from "~/composables/auth/useSession";
import dayjs from "dayjs";

enum ActionsType {
  ABSENCE = 'absence',
  EXCEPTIONAL_OPENING = 'exceptional_opening',
  APPOINTMENT = 'appointment'
}

defineProps<{
  start?: string
  end?: string
}>()

const emits = defineEmits<{
  (e: 'change-view', view: string | number): void
  (e: 'on-actions', action: ActionsType): void
  (e: 'on-calendar-type' | 'next' | 'prev' | 'today'): void
}>()

const {getUser} = useSession()

const canCreate = computed(() => {
  const user = getUser()
  return user?.doctor?.isLicenseActivated === true;
})

const items = ref<TabsItem[]>([
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
      <div class="flex items-center space-x-2">
        <UButton color="neutral" label="Ajourd'hui" size="sm" variant="subtle" @click="$emit('today')"/>
        <UButton icon="i-lucide-chevron-left" variant="subtle" @click="$emit('prev')"/>
        <UButton icon="i-lucide-chevron-right" variant="subtle" @click="$emit('next')"/>
        <p class="text-lg px-3">{{ dayjs(start).format('DD') }} - {{ dayjs(end).format('DD MMMM YYYY') }}</p>
      </div>

      <div class="flex-1 max-w-md">
        <div class="flex space-x-2 w-ful items-centerl">
        </div>
      </div>

      <div class="flex space-x-2">
        <UButton color="secondary" label="Mes crénaux" variant="subtle" @click="$emit('on-calendar-type')"/>
        <UDropdownMenu :items="planItems">
          <UButton color="primary" label="Planifier" trailing-icon="i-lucide-chevron-down" variant="subtle"/>
        </UDropdownMenu>
      </div>
    </slot>
  </div>
</template>

<style scoped>

</style>