<script lang="ts" setup>
import {useNotify} from '~/composables/useNotify'
import type {Doctor} from '~/types/doctor'
import {usePagination} from "~/composables/usePagination";
import {doctorsApi} from "~/services/doctors/doctors.api";
import DoctorDetailSlideover from "~/components/slideover/DoctorDetailSlideover.vue";
import DoctorsTable from "~/components/table/DoctorsTable.vue";
import DoctorConfirmationModal from "~/components/modals/DoctorConfirmationModal.vue";
import DoctorReportModal from "~/components/modals/DoctorReportModal.vue";
import DoctorRecruitmentModal from "~/components/modals/DoctorRecruitmentModal.vue";

definePageMeta({
  title: 'Tous les medécins',
  layout: 'main-layout',
  role: 'admin',
})

const {handleError} = useNotify()
const {fetchDoctors, acceptDoctorVerification, rejectDoctorVerification} = doctorsApi()
const {nextPage, resetPagination} = usePagination()

const isLoading = ref(true)
const doctors = ref<Doctor[]>([])
const currentDoctor = ref<Doctor>()
const openDoctorDetail = ref(false)
const openVerification = ref(false)
const openRecruitment = ref(false)
const openReport = ref(false)

async function getDoctors() {
  isLoading.value = true
  try {
    doctors.value = await fetchDoctors({
      page: 0,
      size: 15,
    })
  } catch (error) {
    handleError('"Erreur lors du chargement des médecins', error)
  } finally {
    isLoading.value = false
  }
}

function onShowDetail(doctor: Doctor) {
  currentDoctor.value = doctor
  openDoctorDetail.value = true
}

function onShowVerification(doctor: Doctor) {
  currentDoctor.value = doctor
  openVerification.value = true
}

function onShowRecruitments() {
  openRecruitment.value = true
}

function onShowReport(doctor: Doctor) {
  currentDoctor.value = doctor
  openReport.value = true
}

function onClose() {
  openDoctorDetail.value = false
  currentDoctor.value = undefined
}

async function onVerificationChanged(type: 'validated' | 'refused') {
  openVerification.value = false
  if (!currentDoctor.value) {
    return
  }

  try {
    if (type === 'validated') {
      await acceptDoctorVerification(currentDoctor.value.id);
    } else {
      await rejectDoctorVerification(currentDoctor.value.id);
    }
    await getDoctors();
  } catch (error) {
    handleError('Erreur lors de la mise à jour de la vérification du médecin', error)
  } finally {
    currentDoctor.value = undefined
  }
}

async function onLoadMore(stopLoading: () => void) {
  isLoading.value = true
  try {
    const moreDoctors = await nextPage(fetchDoctors)
    doctors.value.push(...moreDoctors)
    stopLoading();
  } catch (error) {
    handleError('Erreur lors du chargement des médecins supplémentaires', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  resetPagination();
  getDoctors()
})
</script>

<template>
  <div class="fit">
    <UProgress v-if="isLoading" class="absolute top-0 left-0 right-0 z-50"/>
    <DoctorsTable
        v-model:loading="isLoading"
        :data="doctors"
        @on-detail="onShowDetail"
        @on-load-more="onLoadMore"
        @on-coverage="navigateTo('/admin/doctors/coverage')"
        @on-show-recruitment="onShowRecruitments"
    />

    <DoctorDetailSlideover
        v-if="currentDoctor"
        v-model:open="openDoctorDetail"
        :doctor="currentDoctor"
        @on-close="onClose()"
        @on-verification="onShowVerification($event)"
        @on-check-report="onShowReport($event)"
    />

    <DoctorConfirmationModal
        v-if="openVerification && currentDoctor"
        v-model:open="openVerification"
        :doctor="currentDoctor"
        @on-submit="onVerificationChanged($event)"
    />

    <DoctorReportModal
        v-if="openReport && currentDoctor"
        v-model:open="openReport"
        :doctor="currentDoctor"
        @on-close="openReport = false; currentDoctor = undefined"
    />

    <DoctorRecruitmentModal
        v-if="openRecruitment"
        v-model:open="openRecruitment"
        @on-close="openRecruitment = false"
    />
  </div>
</template>

<style scoped>
</style>