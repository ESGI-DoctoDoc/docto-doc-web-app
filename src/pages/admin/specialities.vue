<script lang="ts" setup>
import {useNotify} from "~/composables/useNotify";
import SpecialitiesTable from "~/components/table/SpecialitiesTable.vue";
import {specialityApi} from "~/services/specialities/speciality.api";
import type {CreateSpecialityForm} from "~/components/inputs/validators/speciality-form.validator";
import type {Speciality} from "~/types/speciality";

definePageMeta({
  title: 'Spécialités',
  layout: 'main-layout',
  role: 'admin',

})

const {showError} = useNotify()
const {getSpecialities, createSpeciality} = specialityApi();


const isLoading = ref<boolean>(true);
const specialities = ref<Speciality[]>([]);


async function onCreateSpeciality(form: CreateSpecialityForm, onClose: () => void) {
  isLoading.value = true;
  try {
    const speciality = await createSpeciality(form);
    specialities.value.push(speciality);
    onClose();
  } catch (error) {
    if (error instanceof Error) {
      showError('Erreur lors de la création de la spécialité', error.message);
    } else {
      showError('Erreur inconnue lors de la création de la spécialité');
    }
  } finally {
    isLoading.value = false;
  }
}


onMounted(() => {
  isLoading.value = true;
  getSpecialities()
      .then((response) => {
        specialities.value = response;
      })
      .catch((error: Error) => {
        showError('Erreur lors du chargement des spécialités', error.message);
      })
      .finally(() => (isLoading.value = false));
})

</script>

<template>
  <SpecialitiesTable
      v-model:loading="isLoading"
      :data="specialities"
      @on-create-speciality="onCreateSpeciality"
  />
</template>

<style scoped>

</style>