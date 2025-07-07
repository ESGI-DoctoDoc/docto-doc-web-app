<script lang="ts" setup>

import InputFileBase from "~/components/inputs/base/InputFileBase.vue";
import {useMediaApi} from "~/services/media/media.api";
import type {FormErrorEvent, FormSubmitEvent} from "@nuxt/ui";
import {
  type MedicalRecordForm,
  medicalRecordFormSchema
} from "~/components/inputs/validators/Medical-record-form.validator";

const emits = defineEmits<{
  (e: 'uploaded', files: { url: string, id: string }[]): void;
}>()

const {deleteFile} = useMediaApi()
const {showError, handleError} = useNotify()
// const {uploadMessageFiles} = messagesApi();

const files = ref<{ url: string, id: string }[]>([]);
const isLoading = ref(false);

const form = ref({
  type: 'other',
  files: []
})

async function onUploadFiles(filesToUpload: File[]) {
  isLoading.value = true;
  try {
    if (filesToUpload.length === 0) {
      showError('Aucun fichier sélectionné');
      return;
    }

    const fileToUpload = filesToUpload[0];
    //todo
    emits('uploaded', [{url: '', id: 'temp-id'}]);
  } catch (error) {
    handleError("Erreur lors de l'envoi du fichier", error);
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

async function onSubmit(event: FormSubmitEvent<MedicalRecordForm>) {
  isLoading.value = true;
  try {
    if (event.data.files.length === 0) {
      showError('Aucun fichier sélectionné');
      return;
    }
  } catch (error) {
    handleError("Erreur lors de l'envoi du formulaire", error);
  } finally {
    isLoading.value = false;
  }
}

function onError(event: FormErrorEvent) {
  console.log(event);
  showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire.');
}

</script>

<template>
  <div class="">
    <UForm
        :schema="medicalRecordFormSchema"
        :state="form"
        class="flex flex-col space-y-4"
        @error="onError"
        @submit="onSubmit"
    >
      <UFormField class="text-left w-full" label="Type de document" name="type">
        <USelect
            v-model="form.type"
            :items="[
              { label: 'Rapport médical', value: 'medical_report' },
              { label: 'Ordonnance', value: 'prescription' },
              { label: 'Résultats d\'analyses', value: 'test_results' },
              { label: 'Autre', value: 'other' }
            ]"
            class="w-full"
            placeholder="Sélectionnez un type de document"
        />
      </UFormField>
      <UFormField class="text-left" label="Fichiers" name="files">
        <InputFileBase
            v-model:files="files"
            :max="1"
            :types="['image/*', 'application/pdf']"
            @on-files-selected="onUploadFiles"
            @on-delete-file="onDeleteFile"
        />
      </UFormField>

      <UButton :loading="isLoading" block class="mt-4" type="submit">
        Ajouter le document
      </UButton>
    </UForm>
  </div>
</template>

<style scoped>

</style>