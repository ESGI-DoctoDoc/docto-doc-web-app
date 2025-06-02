<script lang="ts" setup>
import {useNotify} from "~/composables/useNotify";
import SpecialitiesTable from "~/components/table/SpecialitiesTable.vue";

definePageMeta({
  title: 'Spécialités',
  layout: 'main-layout',
  role: 'admin',

})

const {showError} = useNotify()
// const {fetchDoctorMedicalConcerns, removeDoctorMedicalConcern} = medicalConcernsApi();


const isLoading = ref<boolean>(true);
// const myMedicalConcerns = ref<MedicalConcern[]>([]);


onMounted(() => {
  isLoading.value = true;
  // fetchDoctorMedicalConcerns()
  //     .then((response) => {
  //       myMedicalConcerns.value = response;
  //     })
  //     .catch((error: Error) => {
  //       showError('Erreur lors du chargement des motifs de consultation', error.message);
  //     })
  //     .finally(() => (isLoading.value = false));
})

</script>

<template>
  <SpecialitiesTable
      v-model:loading="isLoading"
      :data="[]"
  />
</template>

<style scoped>

</style>