<script lang="ts" setup>

import type {FormErrorEvent, FormSubmitEvent} from "@nuxt/ui";
import dayjs from "dayjs";
import {
  type CreateDoctorAbsenceForm,
  createDoctorAbsenceSchema
} from "~/components/inputs/validators/doctor-absence-form.validator";
import type {Absence} from "~/types/absence";
import InputAreaBase from "~/components/inputs/base/InputAreaBase.vue";
import FormField from "~/components/inputs/base/FormField.vue";
import {doctorAbsenceApi} from "~/services/absences/doctorAbsenceApi";

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const props = defineProps<{
  hours?: [string, string, string]; // [date, startHour, endHour]
  absence?: Absence
}>()

const emit = defineEmits<{
  (e: 'on-submit', value: CreateDoctorAbsenceForm, callback: () => void): void;
  (e: 'on-delete', id: string): void;
}>()

const {fetchAppointmentsOnDateAbsence, fetchAppointmentsOnAbsence} = doctorAbsenceApi();
const {showPopupContinueModal} = useModals()
const {showError} = useNotify()

const allDay = ref(props?.absence?.startHour === '00:00' && props?.absence?.endHour === '23:59');
const form = ref<CreateDoctorAbsenceForm>({
  date: allDay.value ? props?.absence?.date : '',
  start: props?.absence?.start || props?.hours?.[0] || dayjs().format('YYYY-MM-DD'),
  end: props?.absence?.end || props?.hours?.[0] || '',
  startHour: props?.absence?.startHour || props?.hours?.[1] || '',
  endHour: props?.absence?.endHour || props?.hours?.[2] || '',
  description: props?.absence?.description || '',
  notifyPatients: true,
});

const isAddLoading = ref(false);
const showAppointmentWarning = ref(false);
const warningAppointments = ref<{ start: string, startHour: string, patient: { name: string } }[]>();

async function checkIfAbsenceOverlapsAppointment() {
  if (allDay.value && form.value.date) {
    showAppointmentWarning.value = true;
    warningAppointments.value = await fetchAppointmentsOnDateAbsence(form.value.date);
  } else if (form.value.start && form.value.startHour && form.value.end && form.value.endHour) {
    showAppointmentWarning.value = true;
    warningAppointments.value = await fetchAppointmentsOnAbsence({
      start: form.value.start,
      startHour: form.value.startHour,
      end: form.value.end,
      endHour: form.value.endHour
    });
  } else {
    showAppointmentWarning.value = false;
    warningAppointments.value = []
  }
}

function onSubmit(form: FormSubmitEvent<CreateDoctorAbsenceForm>) {
  isAddLoading.value = true;
  emit('on-submit', form.data, () => {
    isAddLoading.value = false;
  });
}

function onError(event: FormErrorEvent) {
  console.log(event);
  showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire.');
}

async function onSetFullDay() {
  if (allDay.value) {
    form.value.date = form.value.start || dayjs(form.value.start).format('YYYY-MM-DD');
    form.value.start = '';
    form.value.startHour = '00:00';
    form.value.end = '';
    form.value.endHour = '';
  } else {
    form.value.start = dayjs().format('YYYY-MM-DD');
    form.value.startHour = dayjs().format('HH:mm');
    form.value.end = '';
    form.value.endHour = '';
    form.value.date = '';
  }
  await checkIfAbsenceOverlapsAppointment();
}

watch(
    () => [form.value.start, form.value.startHour, form.value.end, form.value.endHour, allDay.value],
    async () => {
      await checkIfAbsenceOverlapsAppointment();
    },
    {immediate: true}
);

async function confirmDelete() {
  if (props.absence) {
    const instance = showPopupContinueModal("Souhaitez-vous supprimer cette absence ?");
    const result = await instance.result;
    if (result) {
      emit('on-delete', props.absence.id);
    }
  }
}

</script>

<template>
  <UModal
      v-model:open="open"
      :ui="{
        body: 'min-h-auto max-h-[65vh] overflow-y-auto'
      }"
      aria-description="Créer une absence pour le médecin"
      close
  >
    <template #title>
      <h2 v-if="absence" class="text-2xl font-medium">Modifier l'absence</h2>
      <h2 v-else class="text-2xl font-medium">Créer une absence</h2>
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
        <div
            v-if="showAppointmentWarning && warningAppointments && warningAppointments.length > 0"
            class="flex flex-col space-y-2 bg-yellow-100 text-yellow-800 p-4 rounded border border-yellow-300 mb-4"
        >
          <div
              v-for="appointment in warningAppointments"
              :key="appointment.start + appointment.startHour"
              class="text-sm"
          >
            - {{ appointment.patient.name }} à {{ dayjs(appointment.start).format('DD/MM/YYYY') }}
            {{ appointment.startHour }}
          </div>
        </div>

        <h3 class="text-lg font-semibold">Jour et heures de l'absence</h3>
        <div v-if="!allDay" class="w-full flex space-x-4">
          <FormField class="w-2/3" label="Début" name="start" required>
            <UInput v-model="form.start" class="w-full" placeholder="Sélectionnez une date" type="date"/>
          </FormField>
          <FormField class="w-1/3" label="Heure" name="startHour" required>
            <UInput
                v-model="form.startHour"
                class="w-full"
                placeholder="HH:mm"
                type="time"
            />
          </FormField>
        </div>
        <div v-if="!allDay" class="w-full flex space-x-4">
          <FormField class="w-2/3" label="Fin" name="end" required>
            <UInput v-model="form.end" class="w-full" placeholder="Sélectionnez une date" type="date"/>
          </FormField>
          <FormField class="w-1/3" label="Heure" name="endHour" required>
            <UInput
                v-model="form.endHour"
                class="w-full"
                placeholder="HH:mm"
                type="time"
            />
          </FormField>
        </div>
        <FormField v-else class="w-full" label="Jour" name="start" required>
          <UInput v-model="form.date" class="w-full" placeholder="Sélectionnez une date" type="date"/>
        </FormField>
        <UCheckbox v-model="allDay" label="Absence est pour la journée entière" @change="onSetFullDay()"/>

        <!--        <FormField class="w-full" label="Répéter">
                  <URadioGroup :items="items"/>
                </FormField>

                <FormField label="Date de fin de répétition">
                  <InputDateBase/>
                </FormField>-->

        <h3 class="text-lg font-semibold mt-4">Motif de l'absence</h3>
        <FormField class="w-full" label="Description" name="description">
          <InputAreaBase
              v-model="form.description"
              class="w-full"
              :rows="3"
              placeholder="Entrez une description de l'absence"
          />
        </FormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex w-full space-x-2.5">
        <UButton
            block
            :disabled="isAddLoading"
            :loading="isAddLoading"
            form="create-absence-form"
            label="Enregistrer"
            type="submit"
        />
        <UButton
            v-if="absence"
            block
            color="error"
            label="Supprimer l'absence"
            @click="confirmDelete"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>