<script lang="ts" setup>
import {ref} from 'vue'
import type {CalendarOptions, EventContentArg} from '@fullcalendar/core'
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
import type {Absence, dayOfWeek} from "~/types/absence";
import type {Appointment} from '~/types/appointment';
import type {ContextMenuItem} from "#ui/components/ContextMenu.vue";

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
const {createAbsence, getAbsences} = doctorAbsenceApi();
const {createAppointment, cancelAppointment, updateAppointment, fetchAppointments} = appointmentApi();
const {mapDoctorAbsenceToCalendarEvent, mapAppointmentToCalendarEvent, mapCalendarEventToDoctorAbsence} = useCalendar()
const calendarRef = useTemplateRef('calendarRef');

const loading = ref(false);
const showCreateAbsence = ref(false);
const showUpdateAbsence = ref(false);
const showCreateAppointment = ref(false);
const showAppointmentDetail = ref(false);
const showUpdateAppointment = ref(false);
const currentAbsence = ref<Absence>();
const currentAppointment = ref<Appointment | null>(null);
const selectedHours = ref<[dayOfWeek, string, string]>(); // [date, startHour, endHour]
const items = [
  {label: 'Créer une absence', onSelect: () => onActions('absence')},
  {label: 'Créer une ouverture exceptionnelle', onSelect: () => onActions('exceptional_opening')},
  {label: 'Prendre un rendez-vous', onSelect: () => onActions('appointment')}
] satisfies ContextMenuItem[];

const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  locale: frLocale,
  headerToolbar: false,
  selectable: true,
  editable: true,
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

    const dateStr = start.toLocaleDateString('en-US', {weekday: 'long'})
    const startTime = formatTime(start);
    const endTime = formatTime(end);

    selectedHours.value = [dateStr?.toLowerCase() as dayOfWeek, startTime, endTime]
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
    if (arg.event.extendedProps?.type === 'appointment') {
      onShowAppointmentDetail(arg.event.extendedProps.appointment);
    } else if (arg.event.id) {
      currentAbsence.value = mapCalendarEventToDoctorAbsence(arg.event);
      showUpdateAbsence.value = true;
    }
  },
  eventContent: (arg: EventContentArg) => {
    return {
      html: `
        <div class="text-black">
          <b>${arg.event.extendedProps.extraParams.title}</b><br/>
          <p>
            ${arg.event.extendedProps.extraParams.startHour || ''} - ${arg.event.extendedProps.extraParams.endHour || ''}
          </p>
        </div>
      `
    }
  }
})

function onChangeView(view: string | number) {
  calendarRef.value?.getApi().changeView(view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay');
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

function onShowAppointmentDetail(appointment: Appointment) {
  currentAppointment.value = appointment;
  showAppointmentDetail.value = true;
}

async function onSaveAbsence(form: CreateDoctorAbsenceForm) {
  loading.value = true;
  try {
    await createAbsence(form);
    await fetchAbsences();
    showSuccess('Absence créée avec succès');
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
    // TODO: rafraîchir les événements du calendrier si besoin
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
    // await getAppointments()
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
    const reason = result.reason.trim();
    if (!reason) {
      showError('Annulation échouée', "Veuillez fournir une raison pour l'annulation.");
      return;
    }

    await cancelAppointment(currentAppointment.value.id, reason);
    showSuccess('Rendez-vous annulé avec succès');
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
    await fetchAbsences();
    showSuccess('Absence supprimée avec succès');
  } catch (error) {
    handleError("Erreur lors de la suppression de l'absence", error)
  } finally {
    loading.value = false;
  }
}

async function getAppointments() {
  try {
    const appointments = await fetchAppointments();
    calendarOptions.value.events = appointments.map((appointment) => mapAppointmentToCalendarEvent(appointment));
  } catch (error) {
    handleError("Erreur lors de la récupération des rendez-vous", error)
  }
}

async function fetchAbsences() {
  try {
    const absences = await getAbsences();
    //Todo add au fur et à mesure les absences au calendrier
    // calendarOptions.value.events = absences.map((absence) => mapDoctorAbsenceToCalendarEvent(absence as Absence));
  } catch (error) {
    handleError("Erreur lors de la récupération des absences", error)
  }
}


function onNext() {
  calendarRef.value?.getApi().next();
}

function onPrev() {
  calendarRef.value?.getApi().prev();
}

function onCancelContextMenu(open: boolean) {
  if (!open) {
    selectedHours.value = undefined;
  }
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
        @next="onNext()"
        @prev="onPrev()"
        @change-view="onChangeView"
        @on-actions="onActions"
        @on-calendar-type="$emit('on-calendar-type')"
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
        @on-submit="onSaveAbsence"
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
        @on-submit="onUpdateAppointment"
    />
    <AppointmentDetailSlideover
        v-if="currentAppointment && showAppointmentDetail"
        v-model:open="showAppointmentDetail"
        :appointment="currentAppointment"
        @on-close="showAppointmentDetail = false; currentAppointment = null"
        @on-update="onShowUpdate($event)"
        @on-cancel="onShowCancel()"
    />
  </div>
</template>

<style>
@reference "../../styles/styles.css";

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