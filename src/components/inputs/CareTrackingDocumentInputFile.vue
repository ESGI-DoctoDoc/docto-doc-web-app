<script lang="ts" setup>

import InputFileBase from "~/components/inputs/base/InputFileBase.vue";
import {useMediaApi} from "~/services/media/media.api";
import {careTrackingApi} from "~/services/care-tracking/care-tracking.api";

defineEmits<{
  (e: 'uploaded', files: { url: string, id: string }[]): void;
}>()

const props = defineProps<{
  careTrackingId: string;
}>()

const {deleteFile} = useMediaApi()
const {showError, handleError} = useNotify()
const {uploadCareTrackingFiles: uploadCareTrackingFiles} = careTrackingApi();

const files = ref<{ url: string, id: string }[]>([]);
const isLoading = ref(false);

async function onUploadFiles(filesToUpload: File[]) {
  isLoading.value = true;
  try {
    if (filesToUpload.length === 0) {
      showError('Aucun fichier sélectionné');
      return;
    }

    const uploadedFiles = await uploadCareTrackingFiles(filesToUpload, props.careTrackingId, "Autre");
    uploadedFiles.forEach((file) => {
      files.value.push({
        url: file.url,
        id: file.id
      })
    });
  } catch (error) {
    handleError("Erreur lors de l'envoi des fichiers", error);
  } finally {
    isLoading.value = false;
  }
}

async function onDeleteFile(id: string) {
  isLoading.value = true;
  try {
    await deleteFile(`/doctors/care-tracking/${props.careTrackingId}/documents/${id}`);
    files.value = files.value.filter(file => file.id !== id);
  } catch (error) {
    handleError("Erreur lors de la suppression de la photo de profil", error);
  } finally {
    isLoading.value = false;
  }
}

</script>

<template>
  <div class="">
    <UFormField class="text-left" label="Fichiers" name="files">
      <InputFileBase
          v-model:files="files"
          :max="4"
          :types="['image/*', 'application/pdf']"
          class="mb-2"
          @on-files-selected="onUploadFiles"
          @on-delete-file="onDeleteFile"
      />
    </UFormField>
  </div>
</template>

<style scoped>

</style>