<script lang="ts" setup>

import type {FormSubmitEvent} from "@nuxt/ui";
import {
  type CreateMedicalConcernForm,
  createMedicalConcernSchema
} from "~/components/inputs/validators/medical-concern-form.validator";
import {MedicalConcernDuration} from "~/types/medical-concern-duration";
import type {MedicalConcern} from "~/types/medical-concern";

const open = defineModel('open', {
  type: Boolean,
  default: true,
})

const props = defineProps<{
  medicalConcern?: MedicalConcern
}>()

const emit = defineEmits<{
  (e: 'onSubmit', value: CreateMedicalConcernForm): void;
}>()

const form = ref<CreateMedicalConcernForm>({
  name: props?.medicalConcern?.name || '',
  duration: props?.medicalConcern?.duration || MedicalConcernDuration.MIN_60,
  price: props?.medicalConcern?.price ?? 30,
  questions: [],
})

async function onSubmit(formEvent: FormSubmitEvent<CreateMedicalConcernForm>) {
  emit('onSubmit', formEvent.data);
}

const durations = [
  { label: "15 minutes", value: MedicalConcernDuration.MIN_15 },
  { label: "30 minutes", value: MedicalConcernDuration.MIN_30 },
  { label: "45 minutes", value: MedicalConcernDuration.MIN_45 },
  { label: "1 heure",    value: MedicalConcernDuration.MIN_60 },
  { label: "1h30",       value: MedicalConcernDuration.MIN_90 },
  { label: "2 heures",   value: MedicalConcernDuration.MIN_120 },
];

</script>

<template>
  <UModal
      v-model:open="open"
      :close="false"
      class="w-full h-1/2"
      @close="open = false"
  >
    <template #body>
      <div class="pt-4 flex justify-between w-full">
        <h2 v-if="medicalConcern" class="text-2xl font-medium">Modifier le motif de consultation</h2>
        <h2 v-else class="text-2xl font-medium">Motif de consultation</h2>
      </div>
      <AppDivider class="w-full pb-4 pt-2"/>

      <div class="flex fit gap-4">
        <UForm
            :schema="createMedicalConcernSchema"
            :state="form"
            class="flex flex-col space-y-4 w-full"
            @submit.prevent="onSubmit"
        >
          <UFormField class="w-full" label="Nom du motif" name="name" required>
            <UInput v-model="form.name" class="w-full" placeholder="Entrez le nom de la spécialité" type="text"/>
          </UFormField>
          <UFormField class="w-full" label="Durée de la consultation" name="duration" required>
            <USelect
                v-model="form.duration"
                :items="durations"
                class="w-full"
                placeholder="Sélectionnez la durée de la consultation"
            />
          </UFormField>
          <UFormField class="w-full" label="Prix de la consultation" name="price" required>
            <UInput
                v-model.number="form.price"
                class="w-full"
                min="0"
                placeholder="Entrez le prix de la consultation"
                type="number"
            />
          </UFormField>

          <UButton v-if="medicalConcern" block label="Modifier le motif de consultation" type="submit"/>
          <UButton v-else block label="Ajouter un motif de consultation" type="submit"/>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>