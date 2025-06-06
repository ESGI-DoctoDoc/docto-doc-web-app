<script lang="ts" setup>

import {medicalConcernsApi} from "~/services/medical-concerns/medical-concerns.api";

const medicalConcern = defineModel('medicalConcern', {
  type: [String, Array] as PropType<string[]>,
  required: true,
})

const props = defineProps<{
  multiple?: boolean;
}>();

const {fetchMedicalConcerns} = medicalConcernsApi()
const {showError} = useNotify();

const loading = ref(true);

const label = computed(() => {
  if (props.multiple) {
    return 'Sélectionnez les motifs de consultation';
  }
  return 'Sélectionnez un motif de consultation';
})

const medicalConcernsItems = ref<{ label: string, value: string }[]>([]);

async function medicalConcernsToList() {
  loading.value = true;
  try {
    const medicalConcerns = await fetchMedicalConcerns();
    medicalConcernsItems.value = medicalConcerns.map(medicalConcern => ({
      label: medicalConcern.name,
      value: medicalConcern.id,
    }));
  } catch (e) {
    if (e instanceof Error) {
      showError('Erreur lors du chargement des motifs de consultation', e.message);
    } else {
      showError('Erreur inconnue lors du chargement des motifs de consultation');
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  medicalConcernsToList();
})

</script>

<template>
  <UFormField :label class="w-full" name="medicalConcerns" required>
    <USelect
        v-model="medicalConcern"
        :disabled="loading"
        :items="medicalConcernsItems"
        :loading="loading"
        class="w-full"
        multiple
        placeholder="Sélectionnez un motif de consultation"
    />
  </UFormField>
</template>

<style scoped>

</style>