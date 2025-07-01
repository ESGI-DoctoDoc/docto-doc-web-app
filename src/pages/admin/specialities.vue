<script lang="ts" setup>
import {useNotify} from "~/composables/useNotify";
import SpecialitiesTable from "~/components/table/SpecialitiesTable.vue";
import {specialityApi} from "~/services/specialities/speciality.api";
import type {CreateSpecialityForm} from "~/components/inputs/validators/speciality-form.validator";
import type {Speciality} from "~/types/speciality";
import {usePagination} from "~/composables/usePagination";

definePageMeta({
  title: 'Spécialités',
  layout: 'main-layout',
  role: 'admin',

})

const {nextPage, resetPagination} = usePagination()
const {showError, handleError} = useNotify()
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

async function fetchSpecialities() {
  isLoading.value = true
  try {
    specialities.value = await getSpecialities({
      page: 0,
      size: 10,
    })
  } catch (error) {
    handleError('Erreur lors du chargement des spécialités', error);
  } finally {
    isLoading.value = false
  }
}

async function onLoadMore(stopLoading: () => void) {
  isLoading.value = true
  try {
    const moreSpecialities = await nextPage(getSpecialities)
    specialities.value.push(...moreSpecialities)
    stopLoading();
  } catch (error) {
    handleError('Erreur lors du chargement des spécialités', error);
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  resetPagination();
  isLoading.value = true;
  fetchSpecialities()
})

</script>

<template>
  <SpecialitiesTable
      v-model:loading="isLoading"
      :data="specialities"
      @on-create-speciality="onCreateSpeciality"
      @on-load-more="onLoadMore"
  />
</template>

<style scoped>

</style>