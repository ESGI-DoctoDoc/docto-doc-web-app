<script lang="ts" setup>
import MedicalConcernsTable from '~/components/table/MedicalConcernsTable.vue'
import {medicalConcernsApi} from "~/services/medical-concers/medical-concerns.api";
import {useNotify} from "~/composables/useNotify";

export type MedicalConcern = {
  id: string;
  name: string;
  description: string;
}

definePageMeta({
  title: 'Mes motifs de consultation',
  layout: 'main-layout',
})

const {showError} = useNotify()
const {fetchDoctorMedicalConcerns, removeDoctorMedicalConcern} = medicalConcernsApi();


const isLoading = ref<boolean>(true);
const myMedicalConcerns = ref<MedicalConcern[]>([]);

function onEditQuestions(medicalConcern: MedicalConcern) {

}

async function onRemoveConcern(medicalConcern: MedicalConcern) {
  isLoading.value = true;
  try {
    await removeDoctorMedicalConcern(medicalConcern.id);
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

onMounted(() => {
  isLoading.value = true;
  fetchDoctorMedicalConcerns()
      .then((response) => {
        myMedicalConcerns.value = response;
      })
      .catch((error: Error) => {
        showError('Erreur lors du chargement des motifs de consultation', error.message);
      })
      .finally(() => (isLoading.value = false));
})

</script>

<template>
  <MedicalConcernsTable
      v-model:loading="isLoading"
      :data="myMedicalConcerns"
      @on-questions="onEditQuestions"
      @on-remove="onRemoveConcern"
  />
</template>

<style scoped>

</style>