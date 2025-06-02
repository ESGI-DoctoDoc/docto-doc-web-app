<script lang="ts" setup>
import MedicalConcernsTable from '~/components/table/MedicalConcernsTable.vue'
import {medicalConcernsApi} from "~/services/medical-concerns/medical-concerns.api";
import {useNotify} from "~/composables/useNotify";
import CreateMedicalConcernModal from "~/components/modals/CreateMedicalConcernModal.vue";
import type {CreateMedicalConcernForm} from "~/components/inputs/validators/medical-concern-form.validator";
import type {MedicalConcern} from "~/types/medical-concern";

definePageMeta({
  title: 'Mes motifs de consultation',
  layout: 'main-layout',
  role: 'doctor',
})

const {showError} = useNotify()
const {fetchMedicalConcerns, createMedicalConcern, removeMedicalConcern} = medicalConcernsApi();


const isLoading = ref(true);
const openCreateModal = ref(false);
const myMedicalConcerns = ref<MedicalConcern[]>([]);


async function onCreate(form: CreateMedicalConcernForm) {
  isLoading.value = true;
  try {
    const medicalConcern = await createMedicalConcern(form);
    myMedicalConcerns.value.push(medicalConcern);
    openCreateModal.value = false;
  } catch (error) {
    if (error instanceof Error) {
      showError('Erreur lors de la création du motif de consultation', error.message);
    } else {
      showError('Erreur inconnue lors de la création du motif de consultation');
    }
  } finally {
    isLoading.value = false;
  }
}

function onEditQuestions(medicalConcern: MedicalConcern) {

}

async function onRemoveConcern(medicalConcern: MedicalConcern) {
  isLoading.value = true;
  try {
    await removeMedicalConcern(medicalConcern.id);
    myMedicalConcerns.value = myMedicalConcerns.value.filter(mc => mc.id !== medicalConcern.id);
  } catch (error) {
    if (error instanceof Error) {
      showError('Erreur lors de la suppression du motif de consultation', error.message);
    } else {
      showError('Erreur inconnue lors de la suppression du motif de consultation');
    }
  } finally {
    isLoading.value = false;
  }
}

async function getMedicalConcerns() {
  isLoading.value = true;
  try {
    myMedicalConcerns.value = await fetchMedicalConcerns();
  } catch (error) {
    if (error instanceof Error) {
      showError('Erreur lors du chargement des motifs de consultation', error.message);
    } else {
      showError('Erreur inconnue lors du chargement des motifs de consultation');
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getMedicalConcerns();
})

</script>

<template>
  <div class="fit">
    <MedicalConcernsTable
        v-model:loading="isLoading"
        :data="myMedicalConcerns"
        @on-remove="onRemoveConcern"
        @on-create="openCreateModal = true"
    />
    <CreateMedicalConcernModal
        v-if="openCreateModal"
        @on-submit="onCreate"
    />
  </div>
</template>

<style scoped>

</style>