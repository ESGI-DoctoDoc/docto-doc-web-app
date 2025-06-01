<script lang="ts" setup>
import {ref} from 'vue'
import type {CalendarOptions, EventContentArg} from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'


defineProps({})

const emits = defineEmits<{
  (e: 'event-click', event: EventContentArg): void
}>()

const slots = ref([
  // Lundi
  {title: 'Consultation', start: '2025-06-02T08:00:00', end: '2025-06-02T12:00:00'},
  {title: 'Consultation', start: '2025-06-02T14:00:00', end: '2025-06-02T16:00:00'},

  // Mardi
  {title: 'Consultation', start: '2025-06-03T08:00:00', end: '2025-06-03T12:00:00'},
  {title: 'Consultation', start: '2025-06-03T14:00:00', end: '2025-06-03T16:00:00'},

  // Jeudi
  {title: 'Consultation', start: '2025-06-05T08:00:00', end: '2025-06-05T12:00:00'},
  {title: 'Consultation', start: '2025-06-05T14:00:00', end: '2025-06-05T16:00:00'},

  // Vendredi
  {title: 'Consultation', start: '2025-06-06T08:00:00', end: '2025-06-06T12:00:00'},
  {title: 'Consultation', start: '2025-06-06T14:00:00', end: '2025-06-06T16:00:00'},

  // Samedi
  {title: 'Consultation', start: '2025-06-07T08:00:00', end: '2025-06-07T12:00:00'},
  {title: 'Consultation', start: '2025-06-07T14:00:00', end: '2025-06-07T16:00:00'},
])

const slotDurations = ['00:30:00', '00:15:00']
let currentSlotIndex = 0

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
  customButtons: {
    createEvent: {
      text: 'Créer événement',
      click() {
        const dateStr = '2025-06-02' // lundi fixe
        const time = '08:00'
        const startISO = `${dateStr}T${time}:00`
        const startDate = new Date(startISO)
        const durationMinutes = 90
        const endDate = new Date(startDate.getTime() + durationMinutes * 60000)
        const endISO = endDate.toISOString()

        calendarOptions.value.events.push(
            {title: 'Motif A', start: startISO, end: endISO},
            {title: 'Motif B', start: startISO, end: endISO},
            {title: 'Motif C', start: `${dateStr}T08:00:00`, end: `${dateStr}T11:30:00`}
        )
      }
    },
    toggleSlotDuration: {
      text: 'Changer tranche',
      click() {
        currentSlotIndex = (currentSlotIndex + 1) % slotDurations.length
        calendarOptions.value.slotDuration = slotDurations[currentSlotIndex]
      }
    }
  },
  selectable: true,
  editable: true,
  dayMaxEventRows: true,
  allDaySlot: false,
  slotDuration: slotDurations[currentSlotIndex],
  slotMinTime: '07:00:00',
  slotMaxTime: '23:00:00',
  events: slots.value,
  dateClick() {
    console.log('Date clicked')
  },
  eventClick(arg) {
    emits('event-click', arg)
  },
  eventContent: (arg: EventContentArg) => {
    return {
      html: `
        <div>
          <b>${arg.event.title}</b><br/>
          <small>${arg.event.extendedProps.description || ''}</small>
        </div>
      `
    }
  }
})
</script>

<template>
  <FullCalendar ref="calendarRef" :options="calendarOptions" class="w-full"/>
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

.custom-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--color-primary);
}
</style>