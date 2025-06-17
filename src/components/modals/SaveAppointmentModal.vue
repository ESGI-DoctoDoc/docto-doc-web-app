<script lang="ts" setup>

import type {FormErrorEvent, FormSubmitEvent} from "@nuxt/ui";
import InputAreaBase from "~/components/inputs/base/InputAreaBase.vue";
import type {Appointment} from "~/types/appointment";
import {
  type CreateAppointmentForm,
  saveAppointmentFormSchema
} from "~/components/inputs/validators/appointment-form.validator";
import DoctorMedicalConcernsSelect from "~/components/inputs/DoctorMedicalConcernsSelect.vue";
import PatientsSelect from "~/components/inputs/PatientsSelect.vue";
import CareTrackingSelect from "~/components/inputs/CareTrackingSelect.vue";
import AnswerQuestions from "~/components/questions/AnswerQuestions.vue";
import SlotAvailableSelect from "~/components/slots/SlotAvailableSelect.vue";
import dayjs from "dayjs";

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const props = defineProps<{
  appointment?: Appointment
}>()

const emit = defineEmits<{
  (e: 'on-submit', value: CreateAppointmentForm): void;
}>()

const {showError} = useNotify()

const form = ref<CreateAppointmentForm & { hasToAnswerQuestions: boolean }>({
  patient: props?.appointment?.patient?.id ?? '',
  medicalConcern: props?.appointment?.medicalConcern?.id ?? '',
  start: dayjs(props?.appointment?.start).format('YYYY-MM-DD') ?? '',
  startHour: props?.appointment?.startHour ?? '',
  careTracking: props?.appointment?.careTracking?.id ?? '',
  answers: props?.appointment?.answers?.map(answer => ({
    questionId: answer.id,
    answer: answer.answer,
  })) ?? [],
  notes: props?.appointment?.doctorNotes ?? '',
  hasToAnswerQuestions: true,
})

function onSubmit(formEvent: FormSubmitEvent<CreateAppointmentForm>) {
  if (!form.value.hasToAnswerQuestions) {
    emit('on-submit', formEvent.data);
  }
  showError('Répondre aux questions', 'Veuillez répondre aux questions avant de soumettre le formulaire.');
}

function onError(event: FormErrorEvent) {
  console.log(event);
  showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire.');
}

</script>

<template>
  <UModal
      v-model:open="open"
      :dismissible="false"
      :ui="{
        body: 'min-h-auto max-h-[65vh] overflow-y-auto'
      }"
      aria-description="Créer un rendez-vous"
      close
  >
    <template #title>
      <h2 v-if="appointment" class="text-2xl font-medium">Modifier le rendez-vous</h2>
      <h2 v-else class="text-2xl font-medium">Créer un rendez-vous</h2>
    </template>
    <template #body>
      <UForm
          id="create-appointment-form"
          :schema="saveAppointmentFormSchema"
          :state="form"
          class="flex flex-col space-y-4"
          @error="onError"
          @submit.prevent="onSubmit"
      >
        <h3 class="text-lg font-semibold">Patient et motif</h3>
        <PatientsSelect
            v-model:patient="form.patient"
            class="w-full"
            name="patient"
        />
        <DoctorMedicalConcernsSelect
            v-model:medical-concern="form.medicalConcern"
            class="w-full"
            name="medicalConcern"
        />
        <div v-if="form.medicalConcern">
          <UModal
              :class="{ 'border border-red-500 rounded-md': form.hasToAnswerQuestions }"
              :close="!form.hasToAnswerQuestions"
              :dismissible="!form.hasToAnswerQuestions"
              :ui="{
              body: 'min-h-auto max-h-[65vh] overflow-y-auto'
            }"
              title="Répondre aux questions"
          >
            <UButton
                block
                color="primary"
                label="Répondre aux questions"
                variant="soft"
            />
            <template #body>
              <h3 class="text-lg font-semibold mb-4">Questions pour le patient</h3>
              <AnswerQuestions
                  v-model:answers="form.answers"
                  v-model:has-to-answer-questions="form.hasToAnswerQuestions"
                  v-model:medical-concern="form.medicalConcern"
              />
            </template>
          </UModal>
        </div>

        <h3 class="text-lg font-semibold">Date et heure du rendez-vous</h3>
        <UFormField
            label="Date du rendez-vous"
            name="start"
            required
        >
          <UInput
              v-model="form.start"
              class="w-full"
              placeholder="Sélectionnez une date"
              type="date"
          />
        </UFormField>
        <SlotAvailableSelect
            v-model:date="form.start"
            v-model:medical-concern="form.medicalConcern"
            v-model:slot="form.startHour"
            class="w-full"
            name="startHour"
        />

        <h3 class="text-lg font-semibold">Lier le rendez-vous à un suivi de dossier</h3>
        <CareTrackingSelect
            v-model="form.careTracking"
            class="w-full"
        />

        <h3 class="text-lg font-semibold">Notes</h3>
        <UFormField
            class="w-full"
            label="Notes sur le rendez-vous"
            name="notes"
        >
          <InputAreaBase
              v-model="form.notes"
              :rows="3"
              class="w-full"
              placeholder="Notes sur le rendez-vous"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex w-full space-x-2.5">
        <UButton
            v-if="appointment"
            block
            form="create-appointment-form"
            label="Mettre à jour le rendez-vous"
            type="submit"
        />
        <UButton
            v-else
            block
            form="create-appointment-form"
            label="Créer le rendez-vous"
            type="submit"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>