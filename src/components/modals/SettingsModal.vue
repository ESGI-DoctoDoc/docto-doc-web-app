<script lang="ts" setup>

import {doctorsApi} from "~/services/doctors/doctors.api";
import type {DoctorProfile} from "~/types/doctor";
import dayjs from "dayjs";
import {computed} from 'vue';

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

defineEmits(['close'])

const {fetchDoctorProfile} = doctorsApi()
const {handleError} = useNotify()

const doctor = ref<DoctorProfile>();

const formattedPhone = computed(() => {
  if (!doctor.value?.phone) return '';
  return doctor.value.phone.replace(/^\+33/, '0');
});

async function getMe() {
  try {
    doctor.value = await fetchDoctorProfile();
  } catch (error) {
    handleError('Erreur lors du chargement des informations du médecin', error);
  }
}

onMounted(() => {
  getMe();
});

</script>

<template>
  <UModal
      v-model:open="open"
      :ui="{
      body: 'min-h-auto max-h-[65vh] overflow-y-auto'
    }"
      aria-description="Paramètre"
      close
      title="Mon profil"
  >
    <template #body>
      <div v-if="doctor" class="flex flex-col space-y-4 text-sm text-gray-800">

        <div class="flex flex-col items-center space-y-2">
          <div
              class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-white">
            {{ doctor.firstName[0] }}{{ doctor.lastName[0] }}
          </div>
          <div v-if="doctor.speciality" class="text-sm text-gray-600">
            {{ doctor.speciality.name }}
          </div>
        </div>

        <div class="flex flex-row gap-4">
          <UFormField class="w-1/2" label="Prénom">
            <UInput v-model="doctor.firstName" class="w-full" disabled/>
          </UFormField>
          <UFormField class="w-1/2" label="Nom">
            <UInput v-model="doctor.lastName" class="w-full" disabled/>
          </UFormField>
        </div>
        <UFormField label="Email">
          <UInput v-model="doctor.email" class="w-full text-left" disabled/>
        </UFormField>
        <UFormField label="Téléphone">
          <UInput :model-value="formattedPhone" class="w-full text-left" disabled/>
        </UFormField>
        <UFormField v-if="doctor.address" label="Adresse">
          <UInput v-model="doctor.address.formatted" class="w-full text-left" disabled/>
        </UFormField>
        <UFormField label="Biographie">
          <UTextarea v-model="doctor.bio" :rows="4" class="w-full text-left" disabled
                     placeholder="Parlez-nous de vous..."/>
        </UFormField>
        <UFormField v-if="doctor.subscription" class="" label="Licence">
          <p>
            Du {{ dayjs(doctor.subscription?.start).format('DD/MM/YYYY') }}
            au {{ dayjs(doctor.subscription?.end).format('DD/MM/YYYY') }}
          </p>
        </UFormField>
      </div>
      <div v-else>
        <p class="text-gray-500">Chargement des informations du médecin...</p>
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>