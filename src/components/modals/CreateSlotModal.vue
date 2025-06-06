<script lang="ts" setup>

import type {FormErrorEvent, FormSubmitEvent} from "@nuxt/ui";
import DoctorMedicalConcernsSelect from "~/components/inputs/DoctorMedicalConcernsSelect.vue";
import {type CreateSlotForm, createSlotSchema} from "~/components/inputs/validators/slot-form.validator";
import dayjs from 'dayjs';

const open = defineModel('open', {
  type: Boolean,
  default: true,
})

const emit = defineEmits<{
  (e: 'onSubmit', value: CreateSlotForm): void;
}>()

const {showError} = useNotify()

const form = ref<CreateSlotForm>({
  day: 'monday',
  startHour: '',
  endHour: '',
  recurrence: 'none',
  start: dayjs().format('YYYY-MM-DD'),
  end: '',
  medicalConcerns: [],
})
const hasEndDate = ref(false);

const daysOfWeek = [
  {label: 'Lundi', value: 'monday'},
  {label: 'Mardi', value: 'tuesday'},
  {label: 'Mercredi', value: 'wednesday'},
  {label: 'Jeudi', value: 'thursday'},
  {label: 'Vendredi', value: 'friday'},
  {label: 'Samedi', value: 'saturday'},
  {label: 'Dimanche', value: 'sunday'}
]

const recurrences = [
  {label: 'Aucune (exceptionnel)', value: 'none'},
  {label: 'Hebdomadaire', value: 'weekly'},
  {label: 'Mensuel', value: 'monthly'},
]


function onSubmit(form: FormSubmitEvent<CreateSlotForm>) {
  console.log("form is accepted", form.data);
  emit('onSubmit', form.data);
}

function onError(event: FormErrorEvent) {
  console.log(event);
  showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire.');
}

function onAddEndDate() {
  if (!hasEndDate.value) {
    form.value.end = '';
  } else if (form.value.recurrence !== 'none') {
    const recurrenceMap = {
      weekly: 'week',
      monthly: 'month',
    } as const;
    form.value.end = dayjs(form.value.start).add(1, recurrenceMap[form.value.recurrence]).format('YYYY-MM-DD');
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
      <h2 class="text-2xl font-medium">Nouvelle plage d'ouverture</h2>
    </template>
    <template #body>
      <UForm
          id="create-absence-form"
          :schema="createSlotSchema"
          :state="form"
          class="flex flex-col space-y-4"
          @error="onError"
          @submit="onSubmit"
      >
        <h3 class="text-lg font-semibold">Jour et heures de consultation</h3>
        <!-- Jour -->
        <UFormField class="w-full" label="Jour" name="day">
          <USelect
              v-model="form.day"
              :items="daysOfWeek"
              class="w-full"
              placeholder="Sélectionnez un jour"
          />
        </UFormField>

        <div class="w-full flex space-x-4">
          <!-- Heure de début -->
          <UFormField class="w-1/2" label="Heure de début" name="startHour">
            <UInput
                v-model="form.startHour"
                class="w-full"
                placeholder="HH:mm"
                type="time"
            />
          </UFormField>

          <!-- Heure de fin -->
          <UFormField class="w-1/2" label="Heure de fin" name="endHour">
            <UInput
                v-model="form.endHour"
                class="w-full"
                placeholder="HH:mm"
                type="time"
            />
          </UFormField>
        </div>

        <h3 class="text-lg font-semibold mt-4">Motifs de consultation</h3>
        <!-- Motifs de consultation -->
        <DoctorMedicalConcernsSelect
            v-model:medical-concern="form.medicalConcerns"
            class="w-full"
            multiple
        />

        <h3 class="text-lg font-semibold mt-4">Périodicité</h3>
        <!-- Récurrence -->
        <UFormField class="w-full" label="Récurrence" name="recurrence">
          <USelect
              v-model="form.recurrence"
              :items="recurrences"
              class="w-full"
              clearable
              placeholder="Aucune (exceptionnel)"
          />
        </UFormField>

        <h3 v-if="form.recurrence !== 'none'" class="text-lg font-semibold mt-4">Plage de périodicité</h3>
        <!-- Date de début -->
        <UFormField v-if="form.recurrence !== 'none'" class="w-full" label="Date de début" name="start">
          <UInput
              v-model="form.start"
              class="w-full"
              type="date"
          />
        </UFormField>

        <!-- Date de fin (optionnelle) -->
        <UFormField v-if="form.recurrence !== 'none'" class="w-full" label="Date de fin" name="end">
          <template #hint>
            <USwitch v-model="hasEndDate" color="error" size="xs" @change="onAddEndDate()"/>
          </template>
          <UInput
              v-model="form.end"
              :disabled="!hasEndDate"
              class="w-full"
              type="date"
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