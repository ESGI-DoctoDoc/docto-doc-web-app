<script lang="ts" setup>
import {appointmentApi} from '~/services/appointments/appointment.api'
import {useNotify} from '~/composables/useNotify'
import type {Appointment} from '~/types/appointment'
import AppointmentsTable from "~/components/table/AppointmentsTable.vue";
import AppointmentDetailSlideover from "~/components/slideover/AppointmentDetailSlideover.vue";

definePageMeta({
  title: 'Mes rendez-vous',
  layout: 'main-layout',
  role: 'doctor',
  path: '/my-appointments/:id?',
})

const {retrieveDeeplinkId, retrieveDeeplinkFilter, filterDeeplinkToQuery, resetDeeplink} = useDeeplink()
const {showError} = useNotify()
const {fetchAppointments} = appointmentApi()

const isLoading = ref(true)
const myAppointments = ref<Appointment[]>([])
const currentAppointment = ref<Appointment>()
const openAppointmentDetail = ref(false)

async function getAppointments() {
  isLoading.value = true
  try {
    myAppointments.value = await fetchAppointments()
  } catch (error) {
    if (error instanceof Error) {
      showError('Erreur lors du chargement des rendez-vous', error.message)
    } else {
      showError('Erreur inconnue lors du chargement des rendez-vous')
    }
  } finally {
    isLoading.value = false
  }
}

async function getAppointmentsByFilter(filters: Record<string, string>) {
  isLoading.value = true
  try {
    console.log(`Fetching appointments with filters: "${filterDeeplinkToQuery(filters)}"`)
    myAppointments.value = await fetchAppointments()
  } catch (error) {
    if (error instanceof Error) {
      showError('Erreur lors du chargement des rendez-vous', error.message)
    } else {
      showError('Erreur inconnue lors du chargement des rendez-vous')
    }
  } finally {
    isLoading.value = false
  }
}

function onDetail(appointment: Appointment) {
  currentAppointment.value = appointment
  openAppointmentDetail.value = true
}

function onClose() {
  openAppointmentDetail.value = false
  currentAppointment.value = undefined
  resetDeeplink();
}

onMounted(() => {
  const appointmentId = retrieveDeeplinkId()
  if (appointmentId) {
    onDetail({id: appointmentId} as Appointment)
  }

  const filters = retrieveDeeplinkFilter()
  if (filters.hasFilter) {
    getAppointmentsByFilter(filters.filter)
  } else {
    getAppointments()
  }
})
</script>

<template>
  <div class="fit">
    <AppointmentsTable
        v-model:loading="isLoading"
        :data="myAppointments"
        @on-detail="onDetail"
    />

    <AppointmentDetailSlideover
        v-if="currentAppointment"
        v-model:open="openAppointmentDetail"
        :appointment="currentAppointment"
        @on-close="onClose()"
    />
  </div>
</template>

<style scoped>
</style>