<script lang="ts" setup>
import {appointmentApi} from '~/services/appointments/appointment.api'
import {useNotify} from '~/composables/useNotify'
import type {Appointment} from '~/types/appointment'
import AppointmentsTable from "~/components/table/AppointmentsTable.vue";
import AppointmentDetailSlideover from "~/components/slideover/AppointmentDetailSlideover.vue";
import {usePagination} from "~/composables/usePagination";

definePageMeta({
  title: 'Tous les rendez-vous',
  layout: 'main-layout',
  role: 'admin',
})

const {handleError} = useNotify()
const {fetchAppointments} = appointmentApi()
const {nextPage, resetPagination} = usePagination()

const isLoading = ref(true)
const myAppointments = ref<Appointment[]>([])
const currentAppointment = ref<Appointment>()
const openAppointmentDetail = ref(false)

async function getAppointments() {
  isLoading.value = true
  try {
    myAppointments.value = await fetchAppointments({
      page: 0,
      size: 10,
    })
  } catch (error) {
    handleError('"Erreur lors du chargement des rendez-vous', error)
  } finally {
    isLoading.value = false
  }
}

function onShowDetail(appointment: Appointment) {
  currentAppointment.value = appointment
  openAppointmentDetail.value = true
}

function onClose() {
  openAppointmentDetail.value = false
  currentAppointment.value = undefined
}

async function onLoadMore(stopLoading: () => void) {
  isLoading.value = true
  try {
    const moreAppointments = await nextPage(fetchAppointments)
    myAppointments.value.push(...moreAppointments)
    stopLoading();
  } catch (error) {
    handleError('Erreur lors du chargement des rendez-vous supplémentaires', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  resetPagination();
  getAppointments()
})
</script>

<template>
  <div class="fit">
    <UProgress v-if="isLoading" class="absolute top-0 left-0 right-0 z-50"/>
    <AppointmentsTable
        v-model:loading="isLoading"
        :data="myAppointments"
        @on-detail="onShowDetail"
        @on-load-more="onLoadMore"
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