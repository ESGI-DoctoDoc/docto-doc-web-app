<script lang="ts" setup>
import PatientsTable from '~/components/table/PatientsTable.vue'
import {useNotify} from "~/composables/useNotify";
import {medicalConcernsApi} from "~/services/medical-concerns/medical-concerns.api";

export type MedicalConcern = {
  id: string;
  name: string;
  description: string;
}

definePageMeta({
  title: 'Mes rendez-vous',
  layout: 'main-layout',
  role: 'doctor',
})

const {showError} = useNotify()
const {fetchMedicalConcerns, removeMedicalConcern} = medicalConcernsApi();


const isLoading = ref<boolean>(true);
const myMedicalConcerns = ref<MedicalConcern[]>([]);

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

onMounted(() => {
  isLoading.value = true;
  fetchMedicalConcerns()
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
  <PatientsTable
      v-model:loading="isLoading"
      :data="myMedicalConcerns"
  />
</template>

<style scoped>

</style>