<script lang="ts" setup>

import {doctorsApi} from "~/services/doctors/doctors.api";
import type {DoctorProfile} from "~/types/doctor";
import dayjs from "dayjs";
import {computed} from 'vue';
import {type ProfileForm, profileSchema} from "~/components/inputs/validators/user-form.validator";
import type {FormErrorEvent} from "@nuxt/ui";
import AvatarFileInput from "~/components/inputs/AvatarFileInput.vue";

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

defineEmits(['close'])

const {fetchDoctorProfile, updateDoctorProfile} = doctorsApi()
const {handleError, showSuccess, showError} = useNotify()

const doctor = ref<DoctorProfile>();
const form = ref<ProfileForm>({
  firstname: '',
  lastname: '',
  bio: '',
  address: '',
});
const profilePictureUrl = ref();

const formattedPhone = computed(() => {
  if (!doctor.value?.phone) return '';
  return doctor.value.phone.replace(/^\+33/, '0');
});

async function getMe() {
  try {
    doctor.value = await fetchDoctorProfile();
    profilePictureUrl.value = doctor.value?.profilePictureUrl || '';
  } catch (error) {
    handleError('Erreur lors du chargement des informations du médecin', error);
  }
}

async function updateMe(form: ProfileForm) {
  try {
    if (doctor.value) {
      await updateDoctorProfile({
        firstname: form.firstname,
        lastname: form.lastname,
        bio: form.bio,
        address: form.address,
      });
      await getMe();
      showSuccess('Informations modifiées.');
    }
  } catch (error) {
    handleError('Erreur lors de la mise à jour des informations du médecin', error);
  }
}

function onError(event: FormErrorEvent) {
  console.log(event);
  showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire.');
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
      <UForm
          v-if="doctor"
          :schema="profileSchema"
          :state="form"
          class="flex flex-col space-y-4 text-sm text-gray-800"
          @error="onError"
          @submit.prevent="updateMe(form)"
      >

        <AvatarFileInput v-model:avatar="profilePictureUrl" class="w-full" name="profilePictureUrl"/>

        <UFormField class="w-full" label="Spécialité">
          <UInput v-model="doctor.speciality.name" class="w-full" disabled/>
        </UFormField>
        <div class="flex flex-row gap-4">
          <UFormField class="w-1/2" label="Prénom">
            <UInput v-model="doctor.firstName" class="w-full"/>
          </UFormField>
          <UFormField class="w-1/2" label="Nom">
            <UInput v-model="doctor.lastName" class="w-full"/>
          </UFormField>
        </div>
        <UFormField label="Email">
          <UInput v-model="doctor.email" class="w-full text-left" disabled/>
        </UFormField>
        <UFormField label="Téléphone">
          <UInput :model-value="formattedPhone" class="w-full text-left" disabled/>
        </UFormField>
        <UFormField v-if="doctor.address" label="Adresse">
          <UInput v-model="doctor.address.formatted" class="w-full text-left"/>
        </UFormField>
        <UFormField label="Biographie">
          <UTextarea
              v-model="doctor.bio" :rows="4" class="w-full text-left"
              placeholder="Parlez-nous de vous..."
          />
        </UFormField>
        <UFormField v-if="doctor.subscription" class="" label="Licence">
          <p>
            Du {{ dayjs(doctor.subscription?.start).format('DD/MM/YYYY') }}
            au {{ dayjs(doctor.subscription?.end).format('DD/MM/YYYY') }}
          </p>
        </UFormField>

        <UButton
            block
            class="mt-4 w-full"
            color="primary"
        >
          Enregistrer les modifications
        </UButton>
      </UForm>
      <div v-else>
        <p class="text-gray-500">Chargement des informations du médecin...</p>
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>