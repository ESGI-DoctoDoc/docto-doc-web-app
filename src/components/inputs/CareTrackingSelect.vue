<script lang="ts" setup>

const careTracking = defineModel('careTracking', {
  type: String as PropType<string>,
  required: false,
})

withDefaults(defineProps<{ required?: boolean }>(), {
  required: false,
})

// const {fetchPatients} = careTrackingApi();
const {showError} = useNotify();

const loading = ref(true);

const careTrackingItems = ref<{ label: string, value: string }[]>([]);

async function careTrackingToList() {
  loading.value = true;
  try {
    // const patients = await fetchPatients();
  } catch (e) {
    if (e instanceof Error) {
      showError('Erreur lors du chargement des suivis de dossier', e.message);
    } else {
      showError('Erreur inconnue lors du chargement des suivis de dossier');
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  careTrackingToList();
})

</script>

<template>
  <UFormField :required label="Sélectionnez un suivi de dossier" name="careTracking">
    <USelect
        v-model="careTracking"
        :disabled="loading || careTrackingItems.length === 0"
        :items="careTrackingItems"
        :loading="loading"
        :placeholder="careTrackingItems.length === 0 ? 'Aucun suivi de dossier disponible' : 'Sélectionnez un suivi de dossier'"
        class="w-full"
    />
  </UFormField>
</template>

<style scoped>

</style>