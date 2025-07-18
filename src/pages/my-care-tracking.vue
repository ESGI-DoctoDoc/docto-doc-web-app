<script lang="ts" setup>
import CareTrackingTable from '~/components/table/CareTrackingTable.vue';
import SaveCareTrackingModal from '~/components/modals/SaveCareTrackingModal.vue';
import CareTrackingSlideover from '~/components/slideover/CareTrackingSlideover.vue';
import {useNotify} from '~/composables/useNotify';
import type {CareTracking, CareTrackingDetail} from '~/types/care-tracking';
import {careTrackingApi} from '~/services/care-tracking/care-tracking.api';
import type {
  CreateCareTrackingForm,
  UpdateCareTrackingForm
} from "~/components/inputs/validators/care-tracking-form.validator";
import {usePagination} from "~/composables/usePagination";
import SaveAppointmentModal from "~/components/modals/SaveAppointmentModal.vue";
import type {CreateAppointmentForm} from "~/components/inputs/validators/appointment-form.validator";
import {appointmentApi} from "~/services/appointments/appointment.api";

definePageMeta({
  title: 'Suivi de dossier',
  layout: 'main-layout',
  role: 'doctor',
  path: '/care-tracking',
})

const {showSuccess, handleError} = useNotify();
const {createAppointment} = appointmentApi()

const isLoading = ref(true);
const openCreateModal = ref(false);
const openDetail = ref(false);
const openSaveAppointmentModal = ref(false);
const openUpdateModal = ref(false);
const myCareTrackings = ref<CareTracking[]>([]);
const currentCareTracking = ref<CareTracking | null>(null);
const currentCareTrackingDetail = ref<CareTrackingDetail>();

const {
  fetchCareTracking,
  createCareTracking,
  updateCareTracking,
  removeCareTracking,
  closeCareTracking,
} = careTrackingApi();
const {resetPagination, nextPage} = usePagination()

async function getCareTrackings() {
  isLoading.value = true;
  try {
    myCareTrackings.value = await fetchCareTracking({
      page: 0,
      size: 15
    });
  } catch (error) {
    handleError('Erreur lors du chargement des suivis de dossier', error);
  } finally {
    isLoading.value = false;
  }
}

async function onLoadMore(stopLoading: () => void) {
  isLoading.value = true
  try {
    const moreCareTracking = await nextPage(fetchCareTracking)
    myCareTrackings.value.push(...moreCareTracking);
    stopLoading();
  } catch (error) {
    handleError('Erreur lors du chargement des patients supplémentaires', error)
  } finally {
    isLoading.value = false
  }
}

function onShowDetail(careTracking: CareTracking) {
  currentCareTracking.value = careTracking;
  openDetail.value = true;
}

function onShowUpdate(careTracking: CareTracking) {
  currentCareTracking.value = careTracking;
  openUpdateModal.value = true;
}

async function onRemove(careTracking: CareTracking) {
  isLoading.value = true;
  try {
    await removeCareTracking(careTracking.id);
    myCareTrackings.value = myCareTrackings.value.filter(ct => ct.id !== careTracking.id);
    showSuccess('Suivi supprimé');
  } catch (error) {
    handleError('Erreur lors de la suppression du suivi', error);
  } finally {
    isLoading.value = false;
  }
}

function onShowCreate() {
  openCreateModal.value = true;
}

async function onCreateCareTracking(form: CreateCareTrackingForm) {
  isLoading.value = true;
  try {
    await createCareTracking({
      name: form.name,
      description: form.description,
      patientId: form.patient,
    });
    showSuccess('Suivi de dossier créé');
    openCreateModal.value = false;
    await getCareTrackings();
  } catch (error) {
    handleError('Erreur lors de la création du suivi', error);
  } finally {
    isLoading.value = false;
  }
}

async function onUpdateCareTracking(form: UpdateCareTrackingForm) {
  isLoading.value = true;
  try {
    if (currentCareTracking.value) {
      await updateCareTracking({
        id: currentCareTracking.value.id,
        description: form.description,
        name: form.name,
      });
      showSuccess('Suivi mis à jour');
      openUpdateModal.value = false;
      currentCareTracking.value = null;
      await getCareTrackings();
    }
  } catch (error) {
    handleError('Erreur lors de la mise à jour du suivi', error);
  } finally {
    isLoading.value = false;
  }
}

function onShowMessage(careTracking: CareTracking) {
  navigateTo(`/care-tracking/${careTracking.id}/messages`)
}

function onShowSaveAppointmentModal(careTrackingDetail: CareTrackingDetail) {
  currentCareTrackingDetail.value = careTrackingDetail;
  openSaveAppointmentModal.value = true;
}

async function onEnd() {
  isLoading.value = true;
  try {
    if (currentCareTracking.value) {
      await closeCareTracking(currentCareTracking.value.id);
      showSuccess('Suivi de dossier terminé');
      openDetail.value = false;
      currentCareTracking.value = null;
      await getCareTrackings();
    }
  } catch (error) {
    handleError('Erreur lors de la clôture du suivi', error);
  } finally {
    isLoading.value = false;
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
    openSaveAppointmentModal.value = false;
    currentCareTrackingDetail.value = undefined;
  } catch (error) {
    handleError("Erreur lors de la création du rendez-vous", error)
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  resetPagination();
  getCareTrackings();
});
</script>

<template>
  <div class="fit">
    <CareTrackingTable
        v-model:loading="isLoading"
        :data="myCareTrackings"
        @on-detail="onShowDetail"
        @on-update="onShowUpdate"
        @on-remove="onRemove"
        @on-create="onShowCreate"
        @on-load-more="onLoadMore"
        @on-message="onShowMessage"
    />

    <!-- Create   -->
    <SaveCareTrackingModal
        v-if="openCreateModal"
        v-model:open="openCreateModal"
        @on-submit="onCreateCareTracking"
        @on-close="openCreateModal = false; openUpdateModal = false; currentCareTracking = null"
    />
    <!-- Update   -->
    <SaveCareTrackingModal
        v-if="currentCareTracking && openUpdateModal"
        v-model:open="openUpdateModal"
        :care-tracking="currentCareTracking"
        @on-submit="onUpdateCareTracking"
        @on-close="openCreateModal = false; openUpdateModal = false; currentCareTracking = null"
    />

    <CareTrackingSlideover
        v-if="openDetail && currentCareTracking"
        v-model:open="openDetail"
        :care-tracking="currentCareTracking"
        @on-close="openDetail = false; currentCareTracking = null"
        @on-update="onShowUpdate"
        @on-delete="onRemove"
        @on-end="onEnd"
        @on-add-appointment="onShowSaveAppointmentModal"
    />

    <SaveAppointmentModal
        v-if="openSaveAppointmentModal && currentCareTrackingDetail"
        v-model:open="openSaveAppointmentModal"
        :care-tracking-id="currentCareTrackingDetail.id"
        :patient-id="currentCareTrackingDetail.patient.id"
        @on-submit="onCreateAppointment($event)"
    />
  </div>
</template>

<style scoped>
</style>
