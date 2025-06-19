<script lang="ts" setup>
import {appointmentApi} from '~/services/appointments/appointment.api'
import {useNotify} from '~/composables/useNotify'
import type {Appointment} from '~/types/appointment'
import AppointmentsTable from "~/components/table/AppointmentsTable.vue";
import AppointmentDetailSlideover from "~/components/slideover/AppointmentDetailSlideover.vue";
import type {UpdateAppointmentForm} from "~/components/inputs/validators/appointment-form.validator";
import SaveAppointmentModal from "~/components/modals/SaveAppointmentModal.vue";
import {useModals} from "~/composables/useModal";

definePageMeta({
  title: 'Mes rendez-vous',
  layout: 'main-layout',
  role: 'doctor',
  path: '/my-appointments/:id?',
})

const {retrieveDeeplinkId, retrieveDeeplinkFilter, filterDeeplinkToQuery, resetDeeplink} = useDeeplink()
const {showError, showSuccess} = useNotify()
const {fetchAppointments, updateAppointment, cancelAppointment} = appointmentApi()
const {showCancelAppointmentReasonModal} = useModals()

const isLoading = ref(true)
const myAppointments = ref<Appointment[]>([])
const currentAppointment = ref<Appointment>()
const openAppointmentDetail = ref(false)
const openUpdateAppointment = ref(false)

async function onUpdate(form: UpdateAppointmentForm) {
  isLoading.value = true
  try {
    if (!currentAppointment.value) {
      showError('Aucun rendez-vous sélectionné pour la mise à jour')
      return
    }

    await updateAppointment({
      id: currentAppointment.value?.id,
      patientId: form.patient,
      medicalConcernId: form.medicalConcern,
      start: form.start,
      startHour: form.startHour,
      careTrackingId: form.careTracking,
      notes: form.notes,
      answers: form.answers,
    });
    await getAppointments()
  } catch (error) {
    if (error instanceof Error) {
      showError('Erreur lors de la mise à jour du rendez-vous', error.message)
    } else {
      showError('Erreur inconnue lors de la mise à jour du rendez-vous')
    }
  } finally {
    isLoading.value = false
  }
}

async function getAppointments() {
  isLoading.value = true
  try {
    myAppointments.value = await fetchAppointments({})
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
    myAppointments.value = await fetchAppointments({})
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

async function onShowCancel() {
  if (!currentAppointment.value) {
    showError("Aucun rendez-vous sélectionné pour l'annulation");
    return;
  }

  isLoading.value = true;
  try {
    const instance = showCancelAppointmentReasonModal();
    const result = await instance.result as { reason: string };
    const reason = result.reason.trim();
    if (!reason) {
      showError('Annulation échouée', "Veuillez fournir une raison pour l'annulation.");
      return;
    }

    await cancelAppointment(currentAppointment.value.id, reason);
    showSuccess('Rendez-vous annulé avec succès');
    openAppointmentDetail.value = false;
    await getAppointments();
  } catch (error) {
    if (error instanceof Error) {
      showError("Erreur lors de l'annulation", error.message);
    } else {
      showError("Erreur inconnue lors de l'annulation");
    }
  } finally {
    isLoading.value = false;
  }
}

function onShowDetail(appointment: Appointment) {
  currentAppointment.value = appointment
  openAppointmentDetail.value = true
}

function onShowUpdate(appointment: Appointment) {
  currentAppointment.value = appointment
  openUpdateAppointment.value = true
}

function onClose() {
  openAppointmentDetail.value = false
  currentAppointment.value = undefined
  resetDeeplink();
}

onMounted(() => {
  const appointmentId = retrieveDeeplinkId()
  if (appointmentId) {
    onShowDetail({id: appointmentId} as Appointment)
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
        @on-detail="onShowDetail"
        @on-update="onShowUpdate"
        @on-cancel="onShowCancel"
    />

    <SaveAppointmentModal
        v-if="currentAppointment && openUpdateAppointment"
        v-model:open="openUpdateAppointment"
        :appointment="currentAppointment"
        @on-submit="onUpdate"
    />

    <AppointmentDetailSlideover
        v-if="currentAppointment && !openUpdateAppointment"
        v-model:open="openAppointmentDetail"
        :appointment="currentAppointment"
        @on-close="onClose()"
        @on-update="onShowUpdate($event)"
    />
  </div>
</template>

<style scoped>
</style>