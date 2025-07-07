<script lang="ts" setup>

import PictureInput from "~/components/inputs/PictureInput.vue";
import InputFileBase from "~/components/inputs/base/InputFileBase.vue";
import {doctorsApi} from "~/services/doctors/doctors.api";
import {useMediaApi} from "~/services/media/media.api";

const avatar = defineModel('avatar', {
  type: String,
  required: true,
});

const {handleError, showError} = useNotify()
const {uploadDoctorProfilePicture} = doctorsApi()
const {deleteFile} = useMediaApi()

const files = ref<{ url: string, id: string }[]>([]);
const isLoading = ref(false);
const avatar2 = ref('');

async function onUploadFiles(filesToUpload: File[]) {
  isLoading.value = true;
  try {
    if (filesToUpload.length === 0) {
      showError('Aucun fichier sélectionné');
      return;
    }

    const profilePicture = await uploadDoctorProfilePicture(filesToUpload[0]);
    files.value = [{
      url: profilePicture.url,
      id: profilePicture.id
    }];
    avatar.value = profilePicture.id; // Update the avatar with the new profile picture URL
    avatar2.value = profilePicture.url; // Update the avatar with the new profile picture URL
  } catch (error) {
    handleError("Erreur lors de l'envoi de la photo de profil", error);
  } finally {
    isLoading.value = false;
  }
}

async function onDeleteFile(id: string) {
  isLoading.value = true;
  try {
    await deleteFile(`/doctors/onboarding/documents/${id}`);
    files.value = files.value.filter(file => file.id !== id);
    avatar.value = '';
    avatar2.value = '';
  } catch (error) {
    handleError("Erreur lors de la suppression de la photo de profil", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  if (avatar.value) {
    avatar2.value = avatar.value;
  }
})

</script>

<template>
  <UFormField class="text-left" label="Votre photo de profil" name="profilePictureUrl" required>
    <UInput class="hidden"/>
    <div class="flex flex-row space-x-4 mt-3">
      <div class="w-auto flex justify-center items-center">
        <PictureInput v-model="avatar2" class="w-20 h-20 border-gray-300 border-1"/>
      </div>
      <div class="w-5/6">
        <InputFileBase
            v-model:files="files"
            v-model:loading="isLoading"
            :max="3"
            :types="['image/*']"
            @on-files-selected="onUploadFiles($event)"
            @on-delete-file="onDeleteFile($event)"
        />
      </div>
    </div>
  </UFormField>
</template>

<style scoped>

</style>