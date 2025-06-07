<script lang="ts" setup>
import {ref} from 'vue'
import type {CalendarOptions, EventContentArg, EventSourceInput} from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import CalendarEventDetailSlideover from "~/components/slideover/CalendarEventDetailSlideover.vue";
import CreateSlotModal from "~/components/modals/CreateSlotModal.vue";
import type {CreateSlotForm} from "~/components/inputs/validators/slot-form.validator";
import {slotApi} from "~/services/slots/slot.api";
import {useCalendar} from "~/composables/calendar/useCalendar";
import type {Slot, SlotDetail} from "~/types/slot";
import UpdateSlotModal from "~/components/modals/UpdateSlotModal.vue";


defineProps({})

defineEmits<{
  (e: 'on-calendar-type'): void
}>()

const {showError, showSuccess} = useNotify()
const {mapSlotToCalendarEvent, doctorSlotsTemplate} = useCalendar()
const {createSlot, getSlots} = slotApi();


const loading = ref(true);
const showEventDetail = ref(false)
const showCreateSlot = ref(false)
const showUpdateSlot = ref(false)

const currentSlot = ref<{ id: string }>();
const currentSlotDetail = ref<SlotDetail>();
const selectedHours = ref<[string, string, string]>(); // [date, startHour, endHour]

const slotDurations = ['00:30:00', '00:15:00']
const currentSlotIndex = 0

const calendarRef = ref()

const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  initialDate: '2025-06-02',
  locale: frLocale,
  showNonCurrentDates: false,
  dayHeaderFormat: {weekday: 'long'},
  fixedWeekCount: true,
  headerToolbar: false,
  selectable: true,
  editable: true,
  dayMaxEventRows: true,
  allDaySlot: false,
  slotDuration: slotDurations[currentSlotIndex],
  slotMinTime: '07:00:00',
  slotMaxTime: '23:00:00',
  select(selectionInfo) {
    const start = selectionInfo.start;
    const end = selectionInfo.end;

    // Vérifie si c'est le même jour
    const sameDay = start.toDateString() === end.toDateString();
    if (!sameDay) {
      console.log("Sélection sur plusieurs jours non autorisée");
      return;
    }

    const formatTime = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    const dateStr = start.toLocaleDateString('en-US', {weekday: 'long'}); // format "Monday", "Tuesday", etc.
    const startTime = formatTime(start);
    const endTime = formatTime(end);

    selectedHours.value = [dateStr.toLowerCase(), startTime, endTime]
    showCreateSlot.value = true;
  },
  dateClick() {
    console.log('Date clicked')
  },
  events: doctorSlotsTemplate.value,
  eventClick(arg) {
    currentSlot.value = {
      id: arg.event.id,
    };
    showEventDetail.value = true
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

async function onCreateSlot(form: CreateSlotForm) {
  loading.value = true;
  try {
    const slot = await createSlot(form);
    console.log(slot);
    showCreateSlot.value = false
    showSuccess('Créneau créé avec succès');
  } catch (error) {
    if (error instanceof Error) {
      showError('Erreur lors de la création du créneau', error.message);
    } else {
      showError('Une erreur est survenue lors de la création du créneau.');
    }
  } finally {
    loading.value = false;
  }
}

async function onUpdateSlot(/*form: CreateSlotForm*/) {
  loading.value = true;
  try {
    // const slot = await updateSlot(form);
    // console.log(slot);
    showUpdateSlot.value = false
    showSuccess('Créneau mis à jour avec succès');
  } catch (error) {
    if (error instanceof Error) {
      showError('Erreur lors de la mise à jour du créneau', error.message);
    } else {
      showError('Une erreur est survenue lors de la mise à jour du créneau.');
    }
  } finally {
    loading.value = false;
  }
}

async function fetchSlots() {
  loading.value = true;
  try {
    const doctorSlots = await getSlots();
    calendarOptions.value.events = doctorSlots.map((slot) => mapSlotToCalendarEvent(slot as Slot)) as EventSourceInput;
    doctorSlotsTemplate.value = calendarOptions.value.events as EventSourceInput;
  } catch (error) {
    console.error('Error loading slots:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchSlots();
})

</script>

<template>
  <div class="fit">
    <CalendarHeaderDefault>
      <USwitch class="text-sm" label="Ma semaine type" model-value @change="$emit('on-calendar-type')"/>

      <UButton :disabled="loading" label="Nouveau créneau" variant="subtle" @click="showCreateSlot = true"/>
    </CalendarHeaderDefault>
    <div class="overflow-y-auto" style="height: calc(100% - 6vh);">
      <FullCalendar
          ref="calendarRef"
          :options="calendarOptions"
          class="h-full"
      />
    </div>
    <CalendarEventDetailSlideover
        v-if="currentSlot"
        v-model:open="showEventDetail"
        :slot-id="currentSlot.id"
        @on-close="currentSlot = undefined"
        @on-update="showUpdateSlot = true; showEventDetail = false; currentSlotDetail = $event"
    />
    <CreateSlotModal
        v-if="showCreateSlot"
        v-model:open="showCreateSlot"
        :hours="selectedHours"
        @on-submit="onCreateSlot"
    />
    <UpdateSlotModal
        v-if="currentSlotDetail"
        v-model:open="showUpdateSlot"
        :slot-detail="currentSlotDetail"
        @on-submit="onUpdateSlot"
        @on-cancel="showEventDetail = true; currentSlot = {id: currentSlotDetail.id}; showEventDetail = true"
    />
  </div>
</template>

<style>

.fc-event-main {
  background: var(--color-primary) !important;
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
</style>