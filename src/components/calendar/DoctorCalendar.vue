<script lang="ts" setup>
import {ref} from 'vue'
import type {CalendarOptions, EventContentArg, EventInput} from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import SaveDoctorAbsence from "~/components/modals/SaveDoctorAbsence.vue";
import SaveAppointmentModal from '~/components/modals/SaveAppointmentModal.vue';
import AppointmentDetailSlideover from '~/components/slideover/AppointmentDetailSlideover.vue';
import type {CreateDoctorAbsenceForm} from "~/components/inputs/validators/doctor-absence-form.validator";
import type {
  CreateAppointmentForm,
  UpdateAppointmentForm
} from '~/components/inputs/validators/appointment-form.validator';
import {doctorAbsenceApi} from "~/services/absences/doctorAbsenceApi";
import {appointmentApi} from '~/services/appointments/appointment.api';
import {useCalendar} from "~/composables/calendar/useCalendar";
import type {Absence} from "~/types/absence";
import type {Appointment} from '~/types/appointment';
import type {ContextMenuItem} from "#ui/components/ContextMenu.vue";
import dayjs from "dayjs";
import {useGlobalRequestApi} from "~/services/global-request.api";
import {useSession} from "~/composables/auth/useSession";

const props = defineProps({
  events: {
    type: Array as () => { title: string; start: string, end: string }[],
    default: () => []
  }
})

defineEmits<{
  (e: 'event-click', event: EventContentArg): void
  (e: 'on-calendar-type'): void
}>()

const {showCancelAppointmentReasonModal} = useModals()
const {handleError, showSuccess, showError} = useNotify()
const {createAbsence, getAbsences, updateAbsence} = doctorAbsenceApi();
const {createAppointment, cancelAppointment, updateAppointment, fetchAppointments, endAppointment} = appointmentApi();
const {mapDoctorAbsenceToCalendarEvent, mapAppointmentToCalendarEvent} = useCalendar()
const {deleteByPath} = useGlobalRequestApi()
const {getUser} = useSession()

const calendarRef = useTemplateRef('calendarRef');

const currentStartDate = ref(dayjs().startOf('week').format('YYYY-MM-DD'));
const currentView = ref<'week' | 'month' | 'day'>('week');

const loading = ref(false);
const showCreateAbsence = ref(false);
const showUpdateAbsence = ref(false);
const showCreateAppointment = ref(false);
const showAppointmentDetail = ref(false);
const showUpdateAppointment = ref(false);
const currentAbsence = ref<Absence>();
const currentAppointment = ref<Appointment | null>(null);
const selectedHours = ref<[string, string, string]>(); // [date, startHour, endHour]
const items = [
  {label: 'Créer une absence', onSelect: () => onActions('absence')},
  {
    label: 'Prendre un rendez-vous',
    onSelect: () => onActions('appointment'),
    disabled: !getUser()?.doctor?.isLicenseActivated
  }
] satisfies ContextMenuItem[];

const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  initialDate: dayjs().startOf('week').format('YYYY-MM-DD'),
  locale: frLocale,
  headerToolbar: false,
  selectable: true,
  editable: false,
  eventStartEditable: false,
  eventDurationEditable: false,
  droppable: false,
  eventResizableFromStart: false,
  dayMaxEventRows: true,
  allDaySlot: false,
  slotDuration: '00:15:00',
  slotMinTime: '07:00:00',
  slotMaxTime: '23:00:00',
  events: props.events,
  select(selectionInfo) {
    const start = selectionInfo.start;
    const end = selectionInfo.end;

    const sameDay = start.toDateString() === end.toDateString();
    if (!sameDay) {
      console.log("Sélection sur plusieurs jours non autorisée");
      return;
    }

    const diffInMs = end.getTime() - start.getTime();
    const diffInMinutes = diffInMs / 60000;
    if (diffInMinutes < 30) {
      calendarRef.value?.getApi().unselect();
      return;
    }

    const formatTime = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    const dateStr = dayjs(start).format('YYYY-MM-DD')
    const startTime = formatTime(start);
    const endTime = formatTime(end);

    selectedHours.value = [dateStr, startTime, endTime]
    setTimeout(() => {
      const highlight = document.querySelector('.fc-highlight');
      if (highlight) {
        const icon = document.createElement('span');
        icon.innerText = 'Clique droit';
        icon.title = 'Clique droit pour plus d\'options';
        icon.style.position = 'absolute';
        icon.style.bottom = '2px';
        icon.style.right = '2px';
        icon.style.fontSize = '10px';
        icon.style.backgroundColor = 'var(--color-gray-200)';
        icon.style.border = '1px solid var(--color-gray-300)';
        icon.style.padding = '2px 6px';
        icon.style.borderRadius = '4px';
        highlight.appendChild(icon);
      }
    }, 200);
  },
  eventClick(arg) {
    const event = arg.event;
    const params = event.extendedProps.extraParams;
    const eventType = params.type;

    if (eventType === 'appointment') {
      currentAppointment.value = params.appointment as Appointment;
      showAppointmentDetail.value = true;
    } else if (eventType === 'full-day-absence' || eventType === 'partial-day-absence') {
      currentAbsence.value = params.absence as Absence;
      showUpdateAbsence.value = true;
    }
  },
  eventContent: (arg: EventContentArg) => {
    const event = arg.event;
    const params = event.extendedProps.extraParams;
    const eventType = params.type;
    if (eventType === 'appointment') {
      const appointment = params.appointment as Appointment;
      const isErrorColor = appointment.status === 'cancelled-unexcused' || appointment.status === 'cancelled-excused';
      return {
        html: `
          <div class="flex space-x-2 h-full">
            <div class="h-full bg-${isErrorColor ? 'error' : 'success'}-500 w-2 rounded-sm"></div>
            <div class="flex-1 flex-col justify-between text-black h-full p-0.5 overflow-hidden">
              <div class="flex flex-col">
                <div class="text-xs text-gray-600">
                  ${appointment.startHour} - ${appointment.endHour}
                </div>
                <div class="text-sm font-medium capitalize mt-0.5">
                  ${appointment.patient?.name}
                </div>
              </div>
            </div>
          </div>
        `
      }
    } else if (eventType === 'full-day-absence') {
      const absence = params.absence as Absence;
      return {
        html: `
          <div class="flex space-x-2 h-full">
            <div class="h-full bg-error-500 w-2 rounded-sm"></div>
            <div class="flex-1 flex-col justify-between text-black h-full p-0.5 overflow-hidden">
              <div class="flex flex-col">
                <div class="text-xs text-gray-600">
                  ${absence.startHour} - ${absence.endHour}
                </div>
                <div class="text-sm font-medium capitalize mt-0.5">
                  Absence
                </div>
                <div class="text-sm font-medium capitalize mt-1.5 italic text-ellipsis overflow-hidden">
                  ${absence.description ?? ''}
                </div>
              </div>
            </div>
          </div>
        `
      }
    } else if (eventType === 'partial-day-absence') {
      const absence = params.absence as Absence;
      return {
        html: `
          <div class="flex space-x-2 h-full">
            <div class="h-full bg-danger-500 w-2 rounded-sm"></div>
            <div class="flex-1 flex-col justify-between text-black h-full p-0.5 overflow-hidden">
              <div class="flex flex-col">
                <div class="text-xs text-gray-600">
                  ${absence.startHour} - ${absence.endHour}
                </div>
                <div class="text-sm font-medium capitalize mt-0.5">
                  ${absence.description || 'Absence'}
                </div>
              </div>
            </div>
          </div>
        `
      }
    }
  }
})

function onChangeView(view: string | number) {
  calendarRef.value?.getApi().changeView(view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay');
  switch (view) {
    case 'dayGridMonth':
      calendarOptions.value.slotDuration = '01:00:00';
      calendarOptions.value.slotMinTime = '00:00:00';
      calendarOptions.value.slotMaxTime = '23:59:59';
      calendarOptions.value.allDaySlot = true;
      currentView.value = 'month';
      break;
    case 'timeGridWeek':
      calendarOptions.value.slotDuration = '00:15:00';
      calendarOptions.value.slotMinTime = '07:00:00';
      calendarOptions.value.slotMaxTime = '23:00:00';
      calendarOptions.value.allDaySlot = false;
      currentView.value = 'week';
      break;
    case 'timeGridDay':
      calendarOptions.value.slotDuration = '00:15:00';
      calendarOptions.value.slotMinTime = '07:00:00';
      calendarOptions.value.slotMaxTime = '23:00:00';
      calendarOptions.value.allDaySlot = false;
      currentView.value = 'day';
      break;
    default:
      console.warn('Vue non supportée :', view);
  }
}

function onActions(action: 'absence' | 'exceptional_opening' | 'appointment') {
  if (action === 'absence') {
    showCreateAbsence.value = true;
  } else if (action === 'exceptional_opening') {
    //todo
  } else if (action === 'appointment') {
    showCreateAppointment.value = true;
  }
}

async function onEndAppointment() {
  if (!currentAppointment.value) {
    showError('Aucun rendez-vous sélectionné pour la fin');
    return;
  }

  loading.value = true;
  try {
    await endAppointment(currentAppointment.value.id);
    await getAppointments(currentStartDate.value);
    await fetchAbsences(currentStartDate.value);
    showAppointmentDetail.value = false;
  } catch (error) {
    handleError("Erreur lors de la fin du rendez-vous", error)
  } finally {
    loading.value = false;
  }
}

async function onSaveAbsence(form: CreateDoctorAbsenceForm) {
  loading.value = true;
  try {
    await createAbsence(form);
    await getAppointments(currentStartDate.value);
    await fetchAbsences(currentStartDate.value);
    showSuccess('Absence créée avec succès');
    showCreateAbsence.value = false;
  } catch (error) {
    handleError("Erreur lors de la création de l'absence", error)
  } finally {
    loading.value = false;
  }
}

async function onUpdateAbsence(form: CreateDoctorAbsenceForm) {
  loading.value = true;
  try {
    if (!currentAbsence.value) {
      showError('Aucune absence sélectionnée pour la mise à jour');
      return;
    }

    await updateAbsence({
      id: currentAbsence.value.id,
      date: form.date,
      start: form.start,
      end: form.end,
      startHour: form.startHour,
      endHour: form.endHour,
      description: form.description,
    });
    await getAppointments(currentStartDate.value);
    await fetchAbsences(currentStartDate.value);
    showSuccess('Absence mise à jour avec succès');
    showCreateAbsence.value = false;
  } catch (error) {
    handleError("Erreur lors de la création de l'absence", error)
  } finally {
    loading.value = false;
  }
}

async function onCreateAppointment(form: CreateAppointmentForm) {
  loading.value = true;
  try {
    await createAppointment({
      patientId: form.patient,
      medicalConcernId: form.medicalConcern,
      start: form.start,
      startHour: form.startHour,
      careTrackingId: form.careTracking,
      notes: form.notes,
      answers: form.answers,
    });
    showSuccess('Rendez-vous créé avec succès');
    showCreateAppointment.value = false;
    await getAppointments(currentStartDate.value);
    await fetchAbsences(currentStartDate.value);
  } catch (error) {
    handleError("Erreur lors de la création du rendez-vous", error)
  } finally {
    loading.value = false;
  }
}

async function onUpdateAppointment(form: UpdateAppointmentForm) {
  loading.value = true
  try {
    if (!currentAppointment.value) {
      showError('Aucun rendez-vous sélectionné pour la mise à jour')
      return
    }

    await updateAppointment({
      id: currentAppointment.value?.id,
      patientId: form.patient,
      medicalConcernId: form.medicalConcern,
      start: form.start,
      startHour: form.startHour,
      careTrackingId: form.careTracking,
      notes: form.notes,
      answers: form.answers,
    });
    currentAppointment.value = null
    showUpdateAppointment.value = false
    await getAppointments(currentStartDate.value);
    await fetchAbsences(currentStartDate.value);
  } catch (error) {
    handleError("Erreur lors de la mise à jour du rendez-vous", error)
  } finally {
    loading.value = false
  }
}

async function onShowCancel() {
  if (!currentAppointment.value) {
    showError("Aucun rendez-vous sélectionné pour l'annulation");
    return;
  }

  loading.value = true;
  try {
    const instance = showCancelAppointmentReasonModal();
    const result = await instance.result as { reason: string };
    const reason = result?.reason?.trim();
    if (!reason) {
      showError('Annulation échouée', "Veuillez fournir une raison pour l'annulation.");
      return;
    }

    await cancelAppointment(currentAppointment.value.id, reason);
    showSuccess('Rendez-vous annulé avec succès');
    await getAppointments(currentStartDate.value);
    await fetchAbsences(currentStartDate.value);
    showAppointmentDetail.value = false;
  } catch (error) {
    handleError("Erreur lors de l'annulation du rendez-vous", error)
  } finally {
    loading.value = false;
  }
}

function onShowUpdate(appointment: Appointment) {
  currentAppointment.value = appointment
  showUpdateAppointment.value = true
}

async function onDeleteAbsence(id: string) {
  loading.value = true;
  try {
    await deleteByPath(`/doctors/absences/${id}`);
    await getAppointments(currentStartDate.value);
    await fetchAbsences(currentStartDate.value);
    showSuccess('Absence supprimée avec succès');
  } catch (error) {
    handleError("Erreur lors de la suppression de l'absence", error)
  } finally {
    loading.value = false;
  }
}

async function getAppointments(start?: string) {
  try {
    const date = start ?? dayjs().startOf('week').format('YYYY-MM-DD');
    const appointments = await fetchAppointments({startDate: date});
    calendarOptions.value.events = appointments.map((appointment) => mapAppointmentToCalendarEvent(appointment));
  } catch (error) {
    handleError("Erreur lors de la récupération des rendez-vous", error)
  }
}

async function fetchAbsences(start?: string) {
  try {
    const date = start ?? dayjs().startOf('week').format('YYYY-MM-DD');
    const absences = await getAbsences({startDate: date});
    absences.forEach((absence) => (calendarOptions.value.events as EventInput[]).push(mapDoctorAbsenceToCalendarEvent(absence as Absence)))
  } catch (error) {
    handleError("Erreur lors de la récupération des absences", error)
  }
}


async function onNext() {
  calendarRef.value?.getApi().next();
  currentStartDate.value = dayjs(currentStartDate.value)
      .add(1, currentView.value)
      .startOf(currentView.value)
      .format('YYYY-MM-DD');
  await getAppointments(currentStartDate.value)
  await fetchAbsences(currentStartDate.value);
}

async function onPrev() {
  calendarRef.value?.getApi().prev();
  currentStartDate.value = dayjs(currentStartDate.value)
      .subtract(1, currentView.value)
      .startOf(currentView.value)
      .format('YYYY-MM-DD');
  await getAppointments(currentStartDate.value)
  await fetchAbsences(currentStartDate.value);
}

function onCancelContextMenu(open: boolean) {
  if (!open) {
    selectedHours.value = undefined;
  }
}

async function onToday() {
  calendarRef.value?.getApi().today();
  currentStartDate.value = dayjs().startOf('week').format('YYYY-MM-DD');
  await getAppointments(currentStartDate.value);
  await fetchAbsences(currentStartDate.value);
}

onMounted(async () => {
  loading.value = true;
  await getAppointments()
  await fetchAbsences();
  loading.value = false;
})

</script>

<template>
  <div class="fit">
    <UProgress v-if="loading" animation="carousel" class="absolute top-0 left-0 w-full z-50" size="sm"/>
    <CalendarHeaderDefault
        :end="dayjs(currentStartDate).subtract(1, 'day').add(1, currentView).format('YYYY-MM-DD')"
        :start="currentStartDate"
        @next="onNext()"
        @prev="onPrev()"
        @change-view="onChangeView"
        @on-actions="onActions"
        @on-calendar-type="$emit('on-calendar-type')"
        @today="onToday()"
    />
    <div class="overflow-y-auto" style="height: calc(100% - 6vh);">
      <UContextMenu :disabled="selectedHours?.[0] === undefined" :items="items" @update:open="onCancelContextMenu">
        <FullCalendar ref="calendarRef" :options="calendarOptions" class="h-full"/>
      </UContextMenu>
    </div>

    <SaveDoctorAbsence
        v-if="showCreateAbsence"
        v-model:open="showCreateAbsence"
        :hours="selectedHours"
        @on-submit="onSaveAbsence"
    />
    <SaveDoctorAbsence
        v-if="showUpdateAbsence"
        v-model:open="showUpdateAbsence"
        :absence="currentAbsence"
        @on-submit="onUpdateAbsence"
        @on-delete="onDeleteAbsence"
    />
    <SaveAppointmentModal
        v-if="showCreateAppointment"
        v-model:open="showCreateAppointment"
        :hours="selectedHours"
        @on-submit="onCreateAppointment"
    />
    <SaveAppointmentModal
        v-if="currentAppointment && showUpdateAppointment"
        v-model:open="showUpdateAppointment"
        :appointment="currentAppointment"
        :patient-id="currentAppointment.patient.id"
        @on-submit="onUpdateAppointment"
    />
    <AppointmentDetailSlideover
        v-if="currentAppointment && showAppointmentDetail"
        v-model:open="showAppointmentDetail"
        :appointment="currentAppointment"
        @on-close="showAppointmentDetail = false; currentAppointment = null"
        @on-update="onShowUpdate($event)"
        @on-cancel="onShowCancel()"
        @on-end="onEndAppointment()"
    />
  </div>
</template>

<style>
@reference "../../styles/styles.css";

.fc-v-event {
  @apply p-1 bg-info-100 rounded-lg border-1 border-gray-300
}

.full-day-absence, .partial-day-absence, .appointment-cancelled-excused, .appointment-cancelled-unexcused {
  @apply bg-error-100
}

.appointment-upcoming, .appointment-confirmed {
  @apply bg-info-100
}

.appointment-completed {
  @apply bg-success-100
}

.fc-next-button, .fc-prev-button {
  height: 38px;
  padding: 0.2em 0.50em !important
}

.fc .fc-day-today {
  background-color: var(--color-primary-50) !important;
}

.fc-button-primary {
  background-color: var(--color-primary) !important;
  border-color: var(--color-gray-200) !important;
}

.fc-highlight {
  background-color: var(--color-primary-50) !important;
  @apply h-full;
  @apply rounded-md;
  @apply border-2 border-dashed border-gray-200;
  @apply cursor-pointer;
}
</style>