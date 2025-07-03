<script lang="ts" setup>

import InputFileBase from "~/components/inputs/base/InputFileBase.vue";
import {useMediaApi} from "~/services/media/media.api";

const modelValue = defineModel('files', {
  type: Array as () => string[],
  default: () => []
});

const {deleteFile} = useMediaApi()
const {showError, handleError} = useNotify()
// const {uploadMessageFiles} = messagesApi();

const files = ref<{ url: string, id: string }[]>([]);
const isLoading = ref(false);

async function onUploadFiles(filesToUpload: File[]) {
  isLoading.value = true;
  try {
    if (filesToUpload.length === 0) {
      showError('Aucun fichier sélectionné');
      return;
    }

    // const uploadedFiles = await uploadMessageFiles(filesToUpload);
    // uploadedFiles.forEach((file) => {
    //   files.value.push({
    //     url: file.url,
    //     id: file.id
    //   })
    // });
    // modelValue.value = files.value.map(file => file.id);
  } catch (error) {
    handleError("Erreur lors de l'envoi des fichiers", error);
  } finally {
    isLoading.value = false;
  }
}

async function onDeleteFile(id: string) {
  isLoading.value = true;
  try {
    await deleteFile(`/doctors/profile/${id}`);
    files.value = files.value.filter(file => file.id !== id);
  } catch (error) {
    handleError("Erreur lors de la suppression de la photo de profil", error);
  } finally {
    isLoading.value = false;
  }
}

</script>

<template>
  <UFormField class="text-left" label="Fichiers" name="files">
    <InputFileBase
        v-model:files="files"
        :max="4"
        :types="['image/*']"
        class="mb-2"
        @on-files-selected="onUploadFiles"
        @on-delete-file="onDeleteFile"
    />
  </UFormField>
</template>

<style scoped>

</style>