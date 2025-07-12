<script lang="ts" setup>
import PatientsTable from '~/components/table/PatientsTable.vue'
import {patientsApi} from '~/services/patients/patient.api'
import {useNotify} from '~/composables/useNotify'
import type {Patient} from '~/types/patient'
import PatientDetailSlideover from "~/components/slideover/PatientDetailSlideover.vue";
import {usePagination} from "~/composables/usePagination";
import type {CreateAppointmentForm} from "~/components/inputs/validators/appointment-form.validator";
import SaveAppointmentModal from "~/components/modals/SaveAppointmentModal.vue";
import {appointmentApi} from "~/services/appointments/appointment.api";

definePageMeta({
  title: 'Mes patients',
  layout: 'main-layout',
  role: 'doctor',
})

const {showError, handleError, showSuccess} = useNotify()
const {fetchPatients} = patientsApi()
const {nextPage, resetPagination} = usePagination()
const {createAppointment} = appointmentApi()

const isLoading = ref(true)
const myPatients = ref<Patient[]>([])
const currentPatient = ref<Patient>()
const openPatientDetail = ref(false)
const showCreateAppointment = ref(false)

async function getPatients() {
  isLoading.value = true
  try {
    myPatients.value = await fetchPatients({
      page: 0,
      size: 15
    })
  } catch (error) {
    if (error instanceof Error) {
      showError('Erreur lors du chargement des patients', error.message)
    } else {
      showError('Erreur inconnue lors du chargement des patients')
    }
  } finally {
    isLoading.value = false
  }
}

async function onLoadMore(stopLoading: () => void) {
  isLoading.value = true
  try {
    const morePatients = await nextPage(fetchPatients)
    myPatients.value.push(...morePatients);
    stopLoading();
  } catch (error) {
    handleError('Erreur lors du chargement des patients supplémentaires', error)
  } finally {
    isLoading.value = false
  }
}

async function onCreateAppointment(form: CreateAppointmentForm) {
  isLoading.value = true;
  try {
    await createAppointment({
      patientId: form.patient,
      medicalConcernId: form.medicalConcern,
      start: form.start,
      startHour: form.startHour,
      careTrackingId: form.careTracking,
      notes: form.notes,
      answers: form.answers,
    });
    showSuccess('Rendez-vous créé avec succès');
    showCreateAppointment.value = false;
    currentPatient.value = undefined;
  } catch (error) {
    handleError("Erreur lors de la création du rendez-vous", error)
  } finally {
    isLoading.value = false;
  }
}

function onShowCreateAppointment(patient: Patient) {
  currentPatient.value = patient
  showCreateAppointment.value = true
}

function onDetail(patient: Patient) {
  currentPatient.value = patient
  openPatientDetail.value = true
}

onMounted(() => {
  resetPagination();
  getPatients()
})
</script>

<template>
  <div class="fit">
    <PatientsTable
        v-model:loading="isLoading"
        :data="myPatients"
        @on-detail="onDetail"
        @on-load-more="onLoadMore"
    />

    <PatientDetailSlideover
        v-if="currentPatient"
        v-model:open="openPatientDetail"
        :patient="currentPatient"
        @on-create-appointment="onShowCreateAppointment($event)"
        @on-close="currentPatient = undefined"
    />

    <SaveAppointmentModal
        v-if="showCreateAppointment && currentPatient"
        v-model:open="showCreateAppointment"
        :patient-id="currentPatient.id"
        @on-submit="onCreateAppointment"
    />
  </div>
</template>

<style scoped>
</style>