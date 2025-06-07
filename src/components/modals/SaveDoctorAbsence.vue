<script lang="ts" setup>

import type {FormErrorEvent, FormSubmitEvent} from "@nuxt/ui";
import dayjs from "dayjs";
import {
  type CreateDoctorAbsenceForm,
  createDoctorAbsenceSchema
} from "~/components/inputs/validators/doctor-absence-form.validator";
import type {Absence} from "~/types/absence";

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const props = defineProps<{
  absence?: Absence
}>()

const emit = defineEmits<{
  (e: 'on-submit', value: CreateDoctorAbsenceForm): void;
}>()

const {showError} = useNotify()

const allDay = ref(false);
const form = ref<CreateDoctorAbsenceForm>({
  date: props?.absence?.date ?? '',
  start: props?.absence?.start ?? dayjs().format('YYYY-MM-DD'),
  end: props?.absence?.end ?? '',
  startHour: props?.absence?.startHour ?? dayjs().format('HH:mm'),
  endHour: props?.absence?.endHour ?? '',
  description: props?.absence?.description ?? '',
});

// const repeatItems = [
//   { label: 'Ne pas répéter', value: 'none' },
//   { label: 'Chaque jour', value: 'daily' },
//   { label: 'Chaque semaine', value: 'weekly' },
//   { label: 'Chaque mois', value: 'monthly' },
// ]


function onSubmit(form: FormSubmitEvent<CreateDoctorAbsenceForm>) {
  emit('on-submit', form.data);
}

function onError(event: FormErrorEvent) {
  console.log(event);
  showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire.');
}

function onSetFullDay() {
  if (allDay.value) {
    form.value.date = form.value.start || dayjs(form.value.start).format('YYYY-MM-DD');
    form.value.start = '';
    form.value.startHour = '';
    form.value.end = '';
    form.value.endHour = '';
  } else {
    form.value.start = dayjs().format('YYYY-MM-DD');
    form.value.startHour = dayjs().format('HH:mm');
    form.value.end = '';
    form.value.endHour = '';
    form.value.date = '';
  }
}

</script>

<template>
  <UModal
      v-model:open="open"
      :ui="{
        body: 'min-h-auto max-h-[65vh] overflow-y-auto'
      }"
      close
  >
    <template #title>
      <h2 class="text-2xl font-medium">Créer une absence</h2>
    </template>
    <template #body>
      <UForm
          id="create-absence-form"
          :schema="createDoctorAbsenceSchema"
          :state="form"
          class="flex flex-col space-y-4"
          @error="onError"
          @submit.prevent="onSubmit"
      >
        <h3 class="text-lg font-semibold">Jour et heures de l'absence</h3>
        <div v-if="!allDay" class="w-full flex space-x-4">
          <UFormField class="w-2/3" label="Début" name="start" required>
            <UInput v-model="form.start" class="w-full" placeholder="Sélectionnez une date" type="date"/>
          </UFormField>
          <UFormField class="w-1/3" label="Heure" name="startHour" required>
            <UInput
                v-model="form.startHour"
                class="w-full"
                placeholder="HH:mm"
                type="time"
            />
          </UFormField>
        </div>
        <div v-if="!allDay" class="w-full flex space-x-4">
          <UFormField class="w-2/3" label="Fin" name="end" required>
            <UInput v-model="form.end" class="w-full" placeholder="Sélectionnez une date" type="date"/>
          </UFormField>
          <UFormField class="w-1/3" label="Heure" name="endHour" required>
            <UInput
                v-model="form.endHour"
                class="w-full"
                placeholder="HH:mm"
                type="time"
            />
          </UFormField>
        </div>
        <UFormField v-else class="w-full" label="Jour" name="start" required>
          <UInput v-model="form.date" class="w-full" placeholder="Sélectionnez une date" type="date"/>
        </UFormField>
        <UCheckbox v-model="allDay" label="Absence est pour la journée entière" @change="onSetFullDay()"/>

        <!--        <UFormField class="w-full" label="Répéter">
                  <URadioGroup :items="items"/>
                </UFormField>

                <UFormField label="Date de fin de répétition">
                  <InputDateBase/>
                </UFormField>-->

        <h3 class="text-lg font-semibold mt-4">Motif de l'absence</h3>
        <UFormField class="w-full" label="Description" name="description">
          <UTextarea
              class="w-full"
              placeholder="Entrez une description de l'absence"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton
          block
          form="create-absence-form"
          label="Enregistrer"
          type="submit"
      />
    </template>
  </UModal>
</template>

<style scoped>

</style>