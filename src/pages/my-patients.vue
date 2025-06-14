<script lang="ts" setup>
import PatientsTable from '~/components/table/PatientsTable.vue'
import {patientsApi} from '~/services/patients/patient.api'
import {useNotify} from '~/composables/useNotify'
import type {Patient} from '~/types/patient'
import PatientDetailSlideover from "~/components/slideover/PatientDetailSlideover.vue";

definePageMeta({
  title: 'Mes patients',
  layout: 'main-layout',
  role: 'doctor',
})

const {showError} = useNotify()
const {fetchPatients} = patientsApi()

const isLoading = ref(true)
const myPatients = ref<Patient[]>([])
const currentPatient = ref<Patient>()
const openPatientDetail = ref(false)

async function getPatients() {
  isLoading.value = true
  try {
    myPatients.value = await fetchPatients()
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

function onDetail(patient: Patient) {
  console.log('patient', currentPatient)
  currentPatient.value = patient
  openPatientDetail.value = true
}

onMounted(() => {
  getPatients()
})
</script>

<template>
  <div class="fit">
    <PatientsTable
        v-model:loading="isLoading"
        :data="myPatients"
        @on-detail="onDetail"
    />

    <PatientDetailSlideover
        v-if="currentPatient"
        v-model:open="openPatientDetail"
        :patient="currentPatient"
        @on-close="currentPatient = undefined"
    />
  </div>
</template>

<style scoped>
</style>