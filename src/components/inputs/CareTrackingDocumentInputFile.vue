<script lang="ts" setup>

import InputFileBase from "~/components/inputs/base/InputFileBase.vue";
import {careTrackingApi} from "~/services/care-tracking/care-tracking.api";
import {
  type MedicalRecordForm,
  medicalRecordFormSchema
} from "~/components/inputs/validators/Medical-record-form.validator";
import type {FormErrorEvent, FormSubmitEvent} from "@nuxt/ui";
import type {DocumentType} from "~/types/care-tracking";
import FormField from "~/components/inputs/base/FormField.vue";

const props = defineProps<{
  careTrackingId: string;
}>()

const emits = defineEmits<{
  (e: 'uploaded', files: { url: string, id: string }[]): void;
}>()

const {showError, handleError} = useNotify()
const {uploadCareTrackingFiles: uploadCareTrackingFiles} = careTrackingApi();

const files = ref<{ url: string, id: string }[]>([]);
const isLoading = ref(false);

const filesToUpload = ref<File[]>([]);
const form = ref<MedicalRecordForm>({
  type: 'Autre',
})

async function onUploadFiles(fileToUpload: File, type: DocumentType) {
  isLoading.value = true;
  try {
    if (!fileToUpload) {
      showError('Aucun fichier sélectionné');
      return;
    }

    const uploadedFiles = await uploadCareTrackingFiles([fileToUpload], props.careTrackingId, type);
    emits('uploaded', uploadedFiles);
  } catch (error) {
    handleError("Erreur lors de l'envoi des fichiers", error);
  } finally {
    isLoading.value = false;
  }
}

async function onDeleteFile(id: string) {
  isLoading.value = true;
  try {
    files.value = files.value.filter(file => file.id !== id);
  } catch (error) {
    handleError("Erreur lors de la suppression de la photo de profil", error);
  } finally {
    isLoading.value = false;
  }
}

async function executeUploadFiles(type: DocumentType) {
  if (filesToUpload.value.length > 0) {
    await onUploadFiles(filesToUpload.value[0], type);
    filesToUpload.value = [];
  } else {
    showError('Aucun fichier à envoyer');
  }
}

function onFilesSelected(files: File[]) {
  filesToUpload.value = files;
}

async function onSubmit(event: FormSubmitEvent<MedicalRecordForm>) {
  isLoading.value = true;
  try {
    if (filesToUpload.value.length === 0) {
      showError('Aucun fichier sélectionné');
      return;
    }
    await executeUploadFiles(event.data.type);
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
      <FormField class="text-left w-full" label="Type de document" name="type">
        <USelect
            v-model="form.type"
            :items="[
              { label: 'Rapport médical', value: 'Rapport médical' },
              { label: 'Ordonnance', value: 'Ordonnance' },
              { label: 'Certificat médical', value: 'Certificat médical' },
              { label: 'Résultats d\'analyses', value: 'Résultats d\'analyses' },
              { label: 'Autre', value: 'Autre' }
            ]"
            class="w-full"
            placeholder="Sélectionnez un type de document"
        />
      </FormField>
      <FormField class="text-left" label="Fichiers" name="files">
        <InputFileBase
            v-model:files="files"
            :max="1"
            :types="['image/*', 'application/pdf']"
            lazy
            @on-files-selected="onFilesSelected"
            @on-delete-file="onDeleteFile"
        />
      </FormField>

      <UButton :loading="isLoading" block class="mt-4" type="submit">
        Ajouter le document
      </UButton>
    </UForm>
  </div>
</template>

<style scoped>

</style>