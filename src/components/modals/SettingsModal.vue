<script lang="ts" setup>

import {doctorsApi} from "~/services/doctors/doctors.api";
import type {DoctorProfile} from "~/types/doctor";
import dayjs from "dayjs";
import {computed} from 'vue';
import {type ProfileForm, profileSchema} from "~/components/inputs/validators/user-form.validator";
import type {FormErrorEvent} from "@nuxt/ui";
import AvatarFileInput from "~/components/inputs/AvatarFileInput.vue";
import FormField from "~/components/inputs/base/FormField.vue";
import AddressInput from "~/components/inputs/AddressInput.vue";

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
  profilePictureUrl: '',
});

const formattedPhone = computed(() => {
  if (!doctor.value?.phone) return '';
  return doctor.value.phone.replace(/^\+33/, '0');
});

async function getMe() {
  try {
    doctor.value = await fetchDoctorProfile();
    form.value.firstname = doctor.value.firstName || '';
    form.value.lastname = doctor.value.lastName || '';
    form.value.bio = doctor.value.bio || '';
    form.value.address = doctor.value.address?.formatted || '';
    form.value.profilePictureUrl = doctor.value.profilePictureUrl || '';
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
        profilePictureUrl: form.profilePictureUrl,
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

        <AvatarFileInput v-model:avatar="form.profilePictureUrl" class="w-full" name="profilePictureUrl"/>

        <FormField class="w-full" label="Spécialité">
          <UInput v-model="doctor.speciality.name" class="w-full" disabled/>
        </FormField>
        <div class="flex flex-row gap-4">
          <FormField class="w-1/2" label="Prénom">
            <UInput v-model="form.firstname" class="w-full"/>
          </FormField>
          <FormField class="w-1/2" label="Nom">
            <UInput v-model="form.lastname" class="w-full"/>
          </FormField>
        </div>
        <FormField label="Email">
          <UInput v-model="doctor.email" class="w-full text-left" disabled/>
        </FormField>
        <FormField label="Téléphone">
          <UInput :model-value="formattedPhone" class="w-full text-left" disabled/>
        </FormField>
        <AddressInput v-model="form.address" class="w-full"/>
        <FormField label="Biographie">
          <UTextarea
              v-model="form.bio" :rows="4" class="w-full text-left"
              placeholder="Parlez-nous de vous..."
          />
        </FormField>
        <FormField v-if="doctor.subscription" class="" label="Licence">
          <p>
            Du {{ dayjs(doctor.subscription?.start).format('DD/MM/YYYY') }}
            au {{ dayjs(doctor.subscription?.end).format('DD/MM/YYYY') }}
          </p>
        </FormField>

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