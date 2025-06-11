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
  (e: 'on-calendar-type'): void
}>()

const calendarRef = useTemplateRef('calendarRef');

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
  },
})

function onChangeView(view: string | number) {
  calendarRef.value?.getApi().changeView(view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay');
}

function onActions(action: 'absence' | 'exceptional_opening' | 'appointment') {
  if (action === 'absence') {
    //todo
  } else if (action === 'exceptional_opening') {
    //todo
  }
}

function onNext() {
  calendarRef.value?.getApi().next();
}

function onPrev() {
  calendarRef.value?.getApi().prev();
}

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
      <FullCalendar ref="calendarRef" :options="calendarOptions" class="h-full"/>
    </div>
  </div>
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