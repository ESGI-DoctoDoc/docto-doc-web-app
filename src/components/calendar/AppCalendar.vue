<script lang="ts" setup>
import {ref} from 'vue'
import type {CalendarOptions, EventContentArg} from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'

const props = defineProps({
  events: {
    type: Array as () => { title: string; start: string, end: string }[],
    default: () => []
  }
})
const emits = defineEmits<{
  (e: 'event-click', event: EventContentArg): void
}>()

const calendarRef = ref()

const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  locale: frLocale,
  headerToolbar: false,
  customButtons: {
    createEvent: {
      text: 'Créer événement',
      click() {
        const date = new Date()
        const dateStr = date.toISOString().substring(0, 10)
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
    }
  },
  selectable: true,
  editable: true,
  dayMaxEventRows: true,
  allDaySlot: false,
  slotDuration: '00:15:00',
  slotMinTime: '07:00:00',
  slotMaxTime: '23:00:00',
  events: props.events,
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

function changeView(view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') {
  calendarRef.value?.getApi().changeView(view)
}

defineExpose({
  changeView
})

</script>

<template>
  <FullCalendar ref="calendarRef" :options="calendarOptions"/>
</template>

<style>
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