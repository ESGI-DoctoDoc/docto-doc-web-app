<script lang="ts" setup>

import type {CreateSpecialityForm} from "~/components/inputs/validators/speciality-form.validator";
import {createSpecialitySchema} from "~/components/inputs/validators/speciality-form.validator";
import type {FormSubmitEvent} from "@nuxt/ui";
import type {Speciality} from "~/types/speciality";
import FormField from "~/components/inputs/base/FormField.vue";

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const props = defineProps<{
  speciality?: Speciality
}>()

const emit = defineEmits<{
  (e: 'onsubmit', value: CreateSpecialityForm): void;
}>()

const form = ref<CreateSpecialityForm>({
  name: props.speciality?.name || '',
})

function onSubmit(form: FormSubmitEvent<CreateSpecialityForm>) {
  emit('onsubmit', form.data);
}

</script>

<template>
  <UModal
      v-model:open="open"
      :close="false"
      class="w-full max-w-96"
  >
    <template #body>
      <div class="pt-4 flex justify-between w-full">
        <h2 v-if="speciality" class="text-2xl font-medium">Modifier la spécialité</h2>
        <h2 v-else class="text-2xl font-medium">Nouvelle spécialité</h2>
      </div>
      <AppDivider class="w-full pb-4 pt-2"/>

      <UForm
          :schema="createSpecialitySchema"
          :state="form"
          class="flex flex-col space-y-4 w-full"
          @submit.prevent="onSubmit"
      >
        <FormField class="w-full" label="Nom de la spécialité" name="name" required>
          <UInput v-model="form.name" class="w-full" placeholder="Entrez le nom de la spécialité" type="text"/>
        </FormField>

        <UButton v-if="speciality" block label="Modifier la spécialité" type="submit"/>
        <UButton v-else block label="Ajouter un motif de consultation" type="submit"/>
      </UForm>
    </template>
  </UModal>
</template>

<style scoped>

</style>