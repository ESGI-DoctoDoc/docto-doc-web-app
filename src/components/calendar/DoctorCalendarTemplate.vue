<script lang="ts" setup>
import {ref} from 'vue'
import type {CalendarOptions, EventContentArg} from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import CalendarEventDetailSlideover from "~/components/slideover/CalendarEventDetailSlideover.vue";
import CreateSlotModal from "~/components/modals/CreateSlotModal.vue";
import type {CreateSlotForm, UpdateSlotForm} from "~/components/inputs/validators/slot-form.validator";
import {slotApi} from "~/services/slots/slot.api";
import {useCalendar} from "~/composables/calendar/useCalendar";
import type {Slot, SlotDetail} from "~/types/slot";
import UpdateSlotModal from "~/components/modals/UpdateSlotModal.vue";
import dayjs from "dayjs";


defineProps({})

defineEmits<{
  (e: 'on-calendar-type'): void
}>()

const {showError, showSuccess} = useNotify()
const {mapSlotToCalendarEvent, doctorSlotsTemplate} = useCalendar()
const {createSlot, getSlots, updateSlot} = slotApi();


const loading = ref(true);
const currentStartDate = ref(dayjs().startOf('week').format('YYYY-MM-DD'));
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
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  initialDate: dayjs().startOf('week').format('YYYY-MM-DD'),
  locale: frLocale,
  headerToolbar: false,
  selectable: true,
  editable: false,
  eventStartEditable: false,
  eventDurationEditable: false,
  droppable: false,
  dayMaxEventRows: true,
  allDaySlot: false,
  eventResizableFromStart: false,
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

    const dateStr = dayjs(start).format('YYYY-MM-DD')
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
    const event = arg.event;
    const params = event.extendedProps.extraParams;
    const eventType = params.type;
    if (eventType === 'monthly-recurrence' || eventType === 'weekly-recurrence') {
      const slot = params.slot as Slot;
      return {
        html: `
          <div class="flex space-x-2 h-full">
            <div class="h-full bg-success-500 w-2 rounded-sm"></div>
            <div class="flex flex-col justify-between text-black h-full p-0.5 overflow-hidden w-full">
              <div class="flex flex-col w-full">
                <div class="flex justify-between items-center">
                  <div class="text-xs text-gray-600">
                    ${slot.startHour} - ${slot.endHour}
                  </div>
                  <div class="text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v240h-80v-80H200v400h280v80H200ZM760 0q-73 0-127.5-45.5T564-160h62q13 44 49.5 72T760-60q58 0 99-41t41-99q0-58-41-99t-99-41q-29 0-54 10.5T662-300h58v60H560v-160h60v57q27-26 63-41.5t77-15.5q83 0 141.5 58.5T960-200q0 83-58.5 141.5T760 0ZM200-640h560v-80H200v80Zm0 0v-80 80Z"/></svg>
                  </div>
                </div>
                <div class="text-sm font-medium capitalize mt-0.5">
                  ${slot.recurrence === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
                </div>
              </div>
            </div>
          </div>
        `
      }
    } else if (eventType === 'single-slot') {
      const slot = params.slot as Slot;
      return {
        html: `
          <div class="flex space-x-2 h-full">
            <div class="h-full bg-success-500 w-2 rounded-sm"></div>
            <div class="flex flex-col justify-between text-black h-full p-0.5 overflow-hidden">
              <div class="flex flex-col">
                <div class="text-xs text-gray-600">
                  ${slot.startHour} - ${slot.endHour}
                </div>
                <div class="text-sm font-medium capitalize mt-0.5">
                  Ouverture
                </div>
              </div>
            </div>
          </div>
        `
      }
    }
  }
})

async function onCreateSlot(form: CreateSlotForm) {
  loading.value = true;
  try {
    await createSlot(form);
    showCreateSlot.value = false
    await fetchSlots(currentStartDate.value);
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

async function onUpdateSlot(form: UpdateSlotForm) {
  loading.value = true;
  try {
    if (!currentSlotDetail.value) {
      showError('Aucun créneau sélectionné pour la mise à jour.');
      return;
    }

    await updateSlot(currentSlotDetail.value.id, {
      startHour: form.startHour,
      endHour: form.endHour,
      medicalConcerns: form.medicalConcerns,
    });
    showUpdateSlot.value = false
    currentSlotDetail.value = undefined;
    await fetchSlots(currentStartDate.value);
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

async function fetchSlots(start?: string) {
  loading.value = true;
  try {
    currentStartDate.value = start ?? dayjs().startOf('week').format('YYYY-MM-DD');
    const startDate = currentStartDate.value;
    const doctorSlots = await getSlots({startDate});
    calendarOptions.value.events = doctorSlots.map((slot) => mapSlotToCalendarEvent(slot as Slot));
    doctorSlotsTemplate.value = calendarOptions.value.events;
  } catch (error) {
    console.error('Error loading slots:', error);
  } finally {
    loading.value = false;
  }
}

function onNext() {
  calendarRef.value?.getApi().next();
  currentStartDate.value = dayjs(currentStartDate.value)
      .add(1, 'week')
      .startOf('week')
      .format('YYYY-MM-DD');
  fetchSlots(currentStartDate.value);
}

function onPrev() {
  calendarRef.value?.getApi().prev();
  currentStartDate.value = dayjs(currentStartDate.value)
      .subtract(1, 'week')
      .startOf('week')
      .format('YYYY-MM-DD');
  fetchSlots(currentStartDate.value);
}

function onToday() {
  calendarRef.value?.getApi().today();
  currentStartDate.value = dayjs().startOf('week').format('YYYY-MM-DD');
  fetchSlots(currentStartDate.value);
}

onMounted(() => {
  fetchSlots();
})

</script>

<template>
  <div class="fit">
    <UProgress v-if="loading" animation="carousel" class="absolute top-0 left-0 w-full z-50" size="sm"/>
    <CalendarHeaderDefault>
      <div class="flex items-center space-x-2">
        <UButton color="neutral" label="Ajourd'hui" size="sm" variant="subtle" @click="onToday"/>
        <UButton icon="i-lucide-chevron-left" variant="subtle" @click="onPrev"/>
        <UButton icon="i-lucide-chevron-right" variant="subtle" @click="onNext"/>
        <p class="text-lg px-3">
          {{ dayjs(currentStartDate).format('DD') }} -
          {{ dayjs(currentStartDate).subtract(1, 'day').add(1, 'week').format('DD MMMM YYYY') }}
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <UButton :disabled="loading" label="Nouveau créneau" leading-icon="i-lucide-calendar-plus" variant="subtle"
                 @click="showCreateSlot = true"/>
        <UButton color="secondary" icon="i-lucide-arrow-left" label="Retour" variant="subtle"
                 @click="$emit('on-calendar-type')"/>
      </div>
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
@reference "../../styles/styles.css";

.monthly-recurrence, .weekly-recurrence {
  @apply bg-cyan-100
}

.single-slot {
  @apply bg-info-100
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