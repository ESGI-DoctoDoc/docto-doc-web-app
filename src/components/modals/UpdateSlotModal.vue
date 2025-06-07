<script lang="ts" setup>

import type {FormErrorEvent, FormSubmitEvent} from "@nuxt/ui";
import DoctorMedicalConcernsSelect from "~/components/inputs/DoctorMedicalConcernsSelect.vue";
import {type CreateSlotForm, createSlotSchema} from "~/components/inputs/validators/slot-form.validator";
import type {SlotDetail} from "~/types/slot";

const props = defineProps<{
  slotDetail: SlotDetail;
}>();

const open = defineModel('open', {
  type: Boolean,
  default: true,
})

const emit = defineEmits<{
  (e: 'onSubmit', value: CreateSlotForm): void;
  (e: 'onCancel'): void;
}>()

const {showError} = useNotify()

const form = ref<CreateSlotForm>({
  day: props.slotDetail.day,
  startHour: props.slotDetail.startHour,
  endHour: props.slotDetail.endHour,
  recurrence: props.slotDetail.recurrence || 'none',
  start: props.slotDetail.start,
  end: props.slotDetail.end,
  dayNumber: props.slotDetail.dayNumber,
  medicalConcerns: props.slotDetail.medicalConcerns.map(concern => concern.id),
});

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

</script>

<template>
  <UModal
      v-model:open="open"
      :ui="{
        body: 'min-h-auto max-h-[65vh] overflow-y-auto'
      }"
      close
      @after:leave="$emit('onCancel')"
  >
    <template #title>
      <h2 class="text-2xl font-medium">Modifier la plage d'ouverture</h2>
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

        <UFormField v-if="form.recurrence === 'monthly'" label="Jour du mois" name="dayNumber">
          <UInput
              v-model="form.dayNumber"
              class="w-full"
              max="28"
              min="1"
              placeholder="1-28"
              type="number"
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
          <UInput
              v-model="form.end"
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