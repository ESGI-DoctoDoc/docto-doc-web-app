<script lang="ts" setup>


import type {Patient} from "~/types/patient";
import {patientsApi} from "~/services/patients/patient.api";
import {useSession} from "~/composables/auth/useSession";
import {useClipboard} from "@vueuse/core";

const isOpen = defineModel('isOpen', {
  type: Boolean,
  default: false,
})

const props = defineProps<{
  patient: Patient
}>()

const emits = defineEmits(['on-close', 'on-update', 'on-delete'])


const {showError, showSuccess} = useNotify()
const {copy} = useClipboard()
const {fetchPatientById} = patientsApi()
const {getUser} = useSession()


const loading = ref(false)
const patientDetail = ref<Patient>()
const permissions = ref({
  canUpdate: false,
  canDelete: false,
})

async function fetchPatientDetails() {
  loading.value = true
  try {
    if (!props?.patient?.id) {
      showError('Aucun patient sélectionné', 'Veuillez sélectionner un patient pour afficher les détails.')
      return;
    }

    patientDetail.value = await fetchPatientById(props!.patient.id);
  } catch (error) {
    if (error instanceof Error) {
      showError('Erreur lors de la récupération des détails du patient', error.message);
    } else {
      showError('Une erreur est survenue lors de la récupération des détails du patient.');
    }
  } finally {
    loading.value = false;
  }
}


onMounted(() => {
  const user = getUser()
  if (user) {
    permissions.value.canUpdate = user.role === 'admin';
    permissions.value.canDelete = user.role === 'admin';
  }
  fetchPatientDetails();
});

function copyToClipboard(text: string) {
  copy(text)
      .then(() => {
        showSuccess('Copié dans le presse-papiers');
      })
      .catch((error) => {
        showError('Erreur lors de la copie', error.message);
      });
}

function formatPhoneNumber(phone: string): string {
  const number = phone.startsWith('+33') ? '0' + phone.slice(3) : phone;
  return number.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}
</script>

<template>
  <USlideover
      v-model:open="isOpen"
      aria-describedby="patient-detail-description"
      aria-description="Patient Detail Slideover"
      class="max-w-lg"
      close
      @after:leave="$emit('on-close')"
  >
    <template #title>
      <h2 class="text-lg font-semibold">Détails du patient</h2>
    </template>

    <template #body>
      <div v-if="loading" class="flex flex-col space-y-6">
        <div class="flex justify-between">
          <USkeleton class="h-4 w-20"/>
          <USkeleton class="h-4 w-28"/>
        </div>
        <div class="flex justify-between">
          <USkeleton class="h-4 w-24"/>
          <USkeleton class="h-4 w-16"/>
        </div>
        <div class="flex justify-between">
          <USkeleton class="h-4 w-32"/>
          <USkeleton class="h-4 w-20"/>
        </div>
        <div class="flex justify-between">
          <USkeleton class="h-4 w-32"/>
          <USkeleton class="h-4 w-20"/>
        </div>
      </div>

      <div v-else-if="patientDetail" class="flex flex-col space-y-2">
        <div class="flex justify-between space-y-1">
          <div>Nom</div>
          <div class="cursor-pointer" @click="copyToClipboard(`${patientDetail.firstname} ${patientDetail.lastname}`)">
            {{ patientDetail.firstname }} {{ patientDetail.lastname }}
          </div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Date de naissance</div>
          <div class="cursor-pointer">{{ patientDetail.birthdate }}</div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Email</div>
          <div class="cursor-pointer" @click="copyToClipboard(patientDetail.email)">{{ patientDetail.email }}</div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Téléphone</div>
          <div class="cursor-pointer" @click="copyToClipboard(formatPhoneNumber(patientDetail.phone))">
            {{ formatPhoneNumber(patientDetail.phone) }}
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="fit flex flex-col space-y-2">
        <UButton block color="primary" icon="i-lucide-calendar" variant="subtle">
          Prendre rendez-vous
        </UButton>
        <UButton v-if="permissions.canUpdate" block color="primary" @click="$emit('on-update', patientDetail!)">
          Modifier
        </UButton>
        <UButton v-if="permissions.canDelete" block color="error" @click="$emit('on-delete', patientDetail!)">
          Supprimer
        </UButton>
      </div>
    </template>
  </USlideover>
</template>

<style scoped>

</style>