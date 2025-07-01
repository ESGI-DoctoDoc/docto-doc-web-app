<script lang="ts" setup>
import {ref} from 'vue';
import {specialityApi} from "~/services/specialities/speciality.api";

const speciality = defineModel('speciality', {
  type: String,
  required: true
})

const {handleError} = useNotify()
const {getSpecialities} = specialityApi();

const specialityLocal = ref<{ label: string, value: string }>();
const specialitiesItems = ref<{ label: string, value: string }[]>([])
const isLoading = ref(false);

async function fetchSpecialities() {
  isLoading.value = true;
  try {
    const specialities = await getSpecialities({
      page: 0,
      size: 1000,
    });
    specialitiesItems.value = specialities.map(speciality => ({
      label: speciality.name,
      value: speciality.id,
    }));
    if (specialitiesItems.value.length > 0 && speciality.value) {
      const selectedSpeciality = specialitiesItems.value.find(s => s.label === speciality.value);
      if (selectedSpeciality) {
        specialityLocal.value = selectedSpeciality;
      }
    }
  } catch (error) {
    handleError('Erreur lors de la récupération des spécialités', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchSpecialities();
})
</script>

<template>
  <UFormField class="w-full" label="Spécialité" name="speciality" required>
    <USelectMenu
        v-model="specialityLocal"
        :disabled="isLoading || specialitiesItems.length === 0"
        :items="specialitiesItems"
        :loading="isLoading"
        class="w-full"
        placeholder="Sélectionnez une spécialité"
        color="primary"
        variant="outline"
        @update:model-value="speciality = $event.label || ''"
    />
  </UFormField>
</template>

<style scoped>

</style>