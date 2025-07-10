<script lang="ts" setup>


import {patientsApi} from "~/services/patients/patient.api";
import FormField from "~/components/inputs/base/FormField.vue";

const patient = defineModel('patient', {
  type: String as PropType<string>,
  required: true,
})

defineProps<{
  disabled?: boolean
}>()

const {fetchPatients} = patientsApi();
const {showError} = useNotify();

const loading = ref(true);

const patientsItems = ref<{ label: string, value: string, email: string }[]>([]);
const patientLocal = ref<{ label: string, value: string, email: string }>();

async function patientsToList() {
  loading.value = true;
  try {
    const patients = await fetchPatients({
      page: 0,
      size: 100,
    });
    patientsItems.value = patients.map(patient => ({
      label: `${patient.firstname} ${patient.lastname}`,
      email: patient.email || '',
      value: patient.id,
    }));
    if (patientsItems.value.length > 0 && patient.value) {
      const selectedPatient = patientsItems.value.find(p => p.value === patient.value);
      if (selectedPatient) {
        patientLocal.value = selectedPatient;
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      showError('Erreur lors du chargement des patients', e.message);
    } else {
      showError('Erreur inconnue lors du chargement des patients');
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  patientsToList();
})

</script>

<template>
  <FormField label="Sélectionnez un patient" name="patient" required>
    <USelectMenu
        v-model="patientLocal"
        :disabled="loading || disabled"
        :items="patientsItems"
        :loading="loading"
        class="w-full"
        placeholder="Sélectionnez un patient"
        @update:model-value="patient = patientLocal?.value || ''"
    >
      <template #item="{ item }">
        <div class="flex flex-col">
          <span>{{ item.label }}</span>
          <span class="text-xs text-gray-500">{{ item.email }}</span>
        </div>
      </template>
    </USelectMenu>
  </FormField>
</template>

<style scoped>

</style>