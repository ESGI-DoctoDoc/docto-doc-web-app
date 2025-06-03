<script lang="ts" setup>

import type {FormSubmitEvent} from "@nuxt/ui";
import {
  type CreateMedicalConcernForm,
  createMedicalConcernSchema
} from "~/components/inputs/validators/medical-concern-form.validator";

const open = defineModel('open', {
  type: Boolean,
  default: true,
})

const emit = defineEmits<{
  (e: 'onSubmit', value: CreateMedicalConcernForm): void;
}>()

const form = ref<CreateMedicalConcernForm>({
  name: '',
  duration: '1h00',
  price: 0,
  questions: [],
})

function onSubmit(form: FormSubmitEvent<CreateMedicalConcernForm>) {
  emit('onSubmit', form.data);
}

const durations = [
  {label: '15 minutes', value: '0h15'},
  {label: '30 minutes', value: '0h30'},
  {label: '45 minutes', value: '0h45'},
  {label: '1 heure', value: '1h00'},
  {label: '1 heure 30 minutes', value: '1h30'},
  {label: '2 heures', value: '2h00'},
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
        <h2 class="text-2xl font-medium">Motif de consultation</h2>
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

          <UButton block label="Ajouter un motif de consultation" type="submit"/>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>