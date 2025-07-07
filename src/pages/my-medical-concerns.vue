<script lang="ts" setup>
import MedicalConcernsTable from '~/components/table/MedicalConcernsTable.vue'
import {medicalConcernsApi} from "~/services/medical-concerns/medical-concerns.api";
import {useNotify} from "~/composables/useNotify";
import CreateMedicalConcernModal from "~/components/modals/CreateMedicalConcernModal.vue";
import type {CreateMedicalConcernForm} from "~/components/inputs/validators/medical-concern-form.validator";
import type {MedicalConcern} from "~/types/medical-concern";
import SaveMedicalConcernQuestionsModal from "~/components/modals/SaveMedicalConcernQuestionsModal.vue";
import type {
  CreateMedicalConcernQuestionForm
} from "~/components/inputs/validators/medical-concern-question-form.validator";

definePageMeta({
  title: 'Mes motifs de consultation',
  layout: 'main-layout',
  role: 'doctor',
})

const {showError, handleError} = useNotify()
const {
  fetchMedicalConcerns,
  createMedicalConcern,
  updateMedicalConcern,
  removeMedicalConcern,
  saveMedicalConcernQuestions,
} = medicalConcernsApi();


const isLoading = ref(true);
const openCreateModal = ref(false);
const openUpdateModal = ref(false);
const openEditQuestions = ref(false);
const myMedicalConcerns = ref<MedicalConcern[]>([]);
const currentMedicalConcern = ref<MedicalConcern>();

async function onCreate(form: CreateMedicalConcernForm) {
  isLoading.value = true;
  try {
    await createMedicalConcern(form);
    await getMedicalConcerns();
    openCreateModal.value = false;
  } catch (error) {
    handleError('Erreur lors de la création du motif de consultation', error);
  } finally {
    isLoading.value = false;
  }
}

async function onUpdate(form: CreateMedicalConcernForm) {
  isLoading.value = true;
  try {
    if (!currentMedicalConcern.value) {
      showError('Aucun motif de consultation sélectionné');
      return;
    }
    await updateMedicalConcern({
      id: currentMedicalConcern.value.id,
      name: form.name,
      duration: form.duration,
      price: form.price,
    });
    openUpdateModal.value = false;
    await getMedicalConcerns();
  } catch (error) {
    handleError('Erreur lors de la mise à jour du motif de consultation', error);
  } finally {
    isLoading.value = false;
  }
}

async function onSaveQuestions(form: CreateMedicalConcernQuestionForm) {
  isLoading.value = true;
  try {
    console.log("la", currentMedicalConcern.value)
    if (!currentMedicalConcern.value) {
      showError('Aucun motif de consultation sélectionné');
      return;
    }
    await saveMedicalConcernQuestions({
      medicalConcern: currentMedicalConcern.value!.id,
      questions: form.questions,
    });
    await fetchMedicalConcerns();
    openEditQuestions.value = false;
  } catch (error) {
    handleError('Erreur lors de l\'enregistrement des questions', error);
  } finally {
    isLoading.value = false;
  }
}

async function onRemoveConcern(medicalConcern: MedicalConcern) {
  isLoading.value = true;
  try {
    await removeMedicalConcern(medicalConcern.id);
    myMedicalConcerns.value = myMedicalConcerns.value.filter(mc => mc.id !== medicalConcern.id);
  } catch (error) {
    handleError('Erreur lors de la suppression du motif de consultation', error);
  } finally {
    isLoading.value = false;
  }
}

async function getMedicalConcerns() {
  isLoading.value = true;
  try {
    myMedicalConcerns.value = await fetchMedicalConcerns();
  } catch (error) {
    handleError('Erreur lors du chargement des motifs de consultation', error);
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
        @on-update="(medicalConcern) => {
          currentMedicalConcern = medicalConcern;
          openUpdateModal = true;
        }"
        @on-create="openCreateModal = true"
        @on-edit-questions="(medicalConcern) => {
          currentMedicalConcern = medicalConcern;
          openEditQuestions = true;
        }"
    />
    <CreateMedicalConcernModal
        v-if="openCreateModal"
        @on-submit="onCreate"
    />
    <CreateMedicalConcernModal
        v-if="openUpdateModal && currentMedicalConcern"
        :medical-concern="currentMedicalConcern"
        @on-submit="onUpdate"
        @update:open="openUpdateModal = false"
    />
    <SaveMedicalConcernQuestionsModal
        v-if="openEditQuestions"
        v-model:open="openEditQuestions"
        :initial-questions="currentMedicalConcern?.questions"
        @on-submit="onSaveQuestions"
    />
  </div>
</template>

<style scoped>

</style>