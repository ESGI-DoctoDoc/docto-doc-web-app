<script lang="ts" setup>
import type {CareTracking} from '~/types/care-tracking';
import PatientsSelect from '~/components/inputs/PatientsSelect.vue';
import {
  type CreateCareTrackingForm,
  createCareTrackingSchema
} from "~/components/inputs/validators/care-tracking-form.validator";
import type {FormErrorEvent, FormSubmitEvent} from "@nuxt/ui";
import InputAreaBase from "~/components/inputs/base/InputAreaBase.vue";
import FormField from "~/components/inputs/base/FormField.vue";

const open = defineModel('open', {
  type: Boolean,
  required: true,
});

const props = defineProps<{
  careTracking?: CareTracking | null
}>();

const emit = defineEmits(['on-submit', 'on-close']);

const {showError} = useNotify();

const form = ref<CreateCareTrackingForm>({
  name: props?.careTracking?.name ?? '',
  description: props?.careTracking?.description ?? '',
  patient: props?.careTracking?.patient?.id ?? ''
});

function onSubmit(formEvent: FormSubmitEvent<CreateCareTrackingForm>) {
  emit('on-submit', formEvent.data);
}

function onError(event: FormErrorEvent) {
  console.log(event);
  showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire.');
}
</script>

<template>
  <UModal
      v-model:open="open"
      aria-describedby="create-care-tracking-form"
      aria-description="Créer ou modifier un suivi de dossier"
      close
  >
    <template #title>
      <h2 v-if="careTracking" class="text-2xl font-medium">Modifier le suivi de dossier</h2>
      <h2 v-else class="text-2xl font-medium">Créer un suivi de dossier</h2>
    </template>
    <template #body>
      <UForm
          id="create-care-tracking-form"
          :schema="createCareTrackingSchema"
          :state="form"
          class="flex flex-col space-y-4"
          @error="onError"
          @submit.prevent="onSubmit"
      >
        <FormField class="w-full" label="Nom du suivi" name="name" required>
          <UInput v-model="form.name" class="w-full" placeholder="Nom du suivi de dossier" required/>
        </FormField>
        <FormField class="w-full" label="Description du suivi" name="description" required>
          <InputAreaBase v-model="form.description" class="w-full" name="description"
                         placeholder="Description du suivi de dossier"/>
        </FormField>
        <PatientsSelect v-if="!careTracking" v-model:patient="form.patient"/>
      </UForm>
    </template>
    <template #footer>
      <UButton block class="w-full" color="primary" form="create-care-tracking-form" type="submit">
        {{ props.careTracking ? 'Mettre à jour le suivi de dossier' : 'Créer le suivi de dossier' }}
      </UButton>
    </template>
  </UModal>
</template>

<style scoped>
</style>
