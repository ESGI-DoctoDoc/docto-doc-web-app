<script lang="ts" setup>

import type {AppointmentStatus} from "~/types/appointment";
import dayjs from "dayjs";
import {useCalendar} from "~/composables/calendar/useCalendar";

export interface AppointmentListItemType {
  id: string
  date: string
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

const {convertDateToIsoString} = useCalendar()

const appointmentDate = computed(() => {
  const startDate = dayjs(convertDateToIsoString(props.appointment.date, props.appointment.startHour));
  return `${startDate.format('ddd DD MMM YYYY HH:mm')}`;
})

const badgeColor = computed(() => {
  switch (props.appointment.status) {
    case "cancelled-unexcused":
      return 'error';
    case "cancelled-excused":
      return 'info';
    case "completed":
      return 'success';
    case "upcoming":
      return 'primary';
    case "waiting-room":
      return 'info';
    default:
      return 'neutral';
  }
})

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
        <UBadge :color="badgeColor" :label="appointment.status"/>
        <UIcon
            class="cursor-pointer"
            name="i-lucide-chevron-right"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>