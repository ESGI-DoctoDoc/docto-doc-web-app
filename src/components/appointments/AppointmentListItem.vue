<script lang="ts" setup>

import type {AppointmentStatus} from "~/types/appointment";
import dayjs from "dayjs";
import {useDeeplink} from "~/composables/useDeeplink";

export interface AppointmentListItemType {
  id: string
  date: string
  start: string
  startHour: string
  endHour: string
  status: AppointmentStatus
  patient: {
    id: string
    firstname: string
    lastname: string
  }
}

const props = defineProps<{
  appointment: AppointmentListItemType
}>()

const {navigateToResource} = useDeeplink()

const appointmentDate = computed(() => {
  const startDate = dayjs(props.appointment.start);
  return `${startDate.format('ddd DD MMM YYYY')} à ${props.appointment.startHour}`;
})

const badgeColor = computed(() => {
  switch (props.appointment.status) {
    case "cancelled-unexcused":
      return 'error';
    case "cancelled-excused":
      return 'error';
    case "completed":
      return 'success';
    case "upcoming":
      return 'info';
    case "waiting-room":
      return 'info';
    default:
      return 'neutral';
  }
})
const formattedStatus = computed(() => {
  const status = props.appointment?.status;
  switch (status) {
    case 'upcoming':
      return 'À venir';
    case 'confirmed':
      return 'Confirmé';
    case 'locked':
      return 'Verrouillé';
    case 'cancelled-excused':
      return 'Annulé (excusé)';
    case 'cancelled-unexcused':
      return 'Annulé (non excusé)';
    case 'completed':
      return 'Terminé';
    case 'waiting-room':
      return 'En salle d\'attente';
    default:
      return '';
  }
});

</script>

<template>
  <div
      :class="{'line-through': appointment.status === 'cancelled-unexcused' || appointment.status === 'cancelled-excused'}"
      class="flex justify-between border border-gray-200 rounded-xl bg-gray-50 px-4 py-3 capitalize"
  >
    <div class="flex space-x-4 w-2/3">
      <div class="">{{ appointment.patient.firstname }} {{ appointment.patient.lastname }}</div>
      <div class="">{{ appointmentDate }}</div>
    </div>
    <div class="">
      <div class="flex justify-end items-center space-x-2 w-full">
        <!-- todo add component here               -->
        <UBadge :color="badgeColor" :label="formattedStatus"/>
        <UIcon
            class="cursor-pointer"
            name="i-lucide-chevron-right"
            @click="navigateToResource('/my-appointments', props.appointment.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>