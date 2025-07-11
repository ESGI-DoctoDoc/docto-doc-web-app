<script lang="ts" setup>
import {useClipboard} from "@vueuse/core";
import {doctorsApi} from "~/services/doctors/doctors.api";
import type {Doctor, DoctorDetail} from "~/types/doctor";
import dayjs from "dayjs";

const isOpen = defineModel('isOpen', {
  type: Boolean,
  default: false,
})

const props = defineProps<{
  doctor: Doctor
}>()

defineEmits(['on-close', 'on-verification', 'on-check-report'])

const {showError, showSuccess} = useNotify()
const {copy} = useClipboard()
const {fetchDoctorById} = doctorsApi()

const loading = ref(false)
const doctorDetail = ref<DoctorDetail>()

async function fetchPatientDetails() {
  loading.value = true
  try {
    if (!props?.doctor?.id) {
      showError('Aucun patient sélectionné', 'Veuillez sélectionner un patient pour afficher les détails.')
      return;
    }

    doctorDetail.value = await fetchDoctorById(props!.doctor.id);
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
      <h2 class="text-lg font-semibold">Détails du docteur</h2>
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

      <div v-else-if="doctorDetail" class="flex flex-col space-y-2">
        <div
            v-if="doctorDetail.isReported"
            class="border border-error-500 bg-error-50 text-error-900 p-4 rounded flex justify-between items-center"
        >
          <div>
            <p>Ce docteur a été signalé par un patient</p>
          </div>
          <UButton color="error" variant="solid" @click="$emit('on-check-report', doctorDetail)">
            Voir le(s) signalement(s)
          </UButton>
        </div>

        <div
            v-if="!doctorDetail.isVerified"
            class="border border-green-500 bg-green-50 text-green-900 p-4 rounded flex justify-between items-center"
        >
          <div>
            <p>En attente de confirmation</p>
          </div>
          <UButton color="primary" variant="solid" @click="$emit('on-verification', doctorDetail)">
            Vérifier ses informations
          </UButton>
        </div>

        <h2 class="text-xl font-medium pt-6">Informations personnelles</h2>
        <AppDivider class="w-full pb-4 pt-2"/>

        <div class="flex justify-between space-y-1">
          <div>Prénom</div>
          <div class="cursor-pointer" @click="copyToClipboard(doctorDetail.firstName)">
            {{ doctorDetail.firstName }}
          </div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Nom</div>
          <div class="cursor-pointer" @click="copyToClipboard(doctorDetail.lastName)">
            {{ doctorDetail.lastName }}
          </div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Email</div>
          <div class="cursor-pointer" @click="copyToClipboard(doctorDetail.email)">
            {{ doctorDetail.email }}
          </div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Téléphone</div>
          <div class="cursor-pointer" @click="copyToClipboard(formatPhoneNumber(doctorDetail.phone))">
            {{ formatPhoneNumber(doctorDetail.phone) }}
          </div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Date de naissance</div>
          <div>{{ dayjs(doctorDetail.birthdate).format('DD/MM/YYYY') }}</div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Spécialité</div>
          <div>{{ doctorDetail.speciality?.name ?? 'Non renseignée' }}</div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Email vérifié</div>
          <div>{{ doctorDetail.isEmailVerified ? 'Oui' : 'Non' }}</div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Vérifié</div>
          <div>{{ doctorDetail.isVerified ? 'Oui' : 'Non' }}</div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Créé le</div>
          <div>{{ dayjs(doctorDetail.createdAt).format('DD/MM/YYYY') }}</div>
        </div>

        <!--        <h3 class="mt-4 text-lg font-semibold">Adresse</h3>-->
        <!--        <div class="flex justify-between space-y-1">-->
        <!--          <div>Adresse</div>-->
        <!--          <div>{{ doctorDetail.address?.formatted ?? 'Non renseignée' }}</div>-->
        <!--        </div>-->

        <h2 class="text-xl font-medium pt-6">Statistiques d’activité</h2>
        <AppDivider class="w-full pb-4 pt-2"/>

        <div class="flex justify-between space-y-1">
          <div>Nombre de rendez-vous</div>
          <div>{{ doctorDetail.counter.appointments }}</div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Nombre de patients</div>
          <div>{{ doctorDetail.counter.patients }}</div>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<style scoped>

</style>