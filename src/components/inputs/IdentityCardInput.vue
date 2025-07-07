<script lang="ts" setup>

import InputFileBase from "~/components/inputs/base/InputFileBase.vue";
import {doctorsApi} from "~/services/doctors/doctors.api";
import {useMediaApi} from "~/services/media/media.api";

const modelValue = defineModel('files', {
  type: Array as () => string[],
  default: () => []
});
const {showError, handleError} = useNotify();
const {uploadDoctorDocuments} = doctorsApi();
const {deleteFile} = useMediaApi()

const isLoading = ref(false);
const files = ref<{ url: string, id: string }[]>([]);

async function onUploadFiles(filesToUpload: File[]) {
  isLoading.value = true;
  try {
    if (filesToUpload.length === 0) {
      showError('Aucun fichier sélectionné');
      return;
    }

    const profilePicture = await uploadDoctorDocuments(filesToUpload);
    if (!profilePicture || profilePicture.length === 0) {
      showError('Aucun fichier n\'a été téléchargé');
      return;
    }

    profilePicture.forEach(file => {
      files.value.push({
        url: file.url,
        id: file.id
      })
    });
    modelValue.value = files.value.map(file => file.id);
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
  } catch (error) {
    handleError("Erreur lors de la suppression de la photo de profil", error);
  } finally {
    isLoading.value = false;
  }
}

</script>

<template>
  <UFormField label="Carte d'identité" name="identityCard" required>
    <InputFileBase
        v-model:files="files"
        :max="2"
        :types="['image/*', 'application/pdf']"
        @on-files-selected="onUploadFiles"
        @on-delete-file="onDeleteFile"
    />
  </UFormField>
</template>

<style scoped>

</style>