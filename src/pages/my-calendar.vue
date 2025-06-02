<script lang="ts" setup>

import AppCalendar from "~/components/calendar/AppCalendar.vue";
import type {EventContentArg} from "@fullcalendar/core";
import DoctorCalendarTemplate from "~/components/modals/DoctorCalendarTemplate.vue";
import {ref} from "vue";
import type {DropdownMenuItem, TabsItem} from "@nuxt/ui";

definePageMeta({
  title: 'Mon calendrier',
  layout: 'main-layout',
  role: 'doctor',

})

const isOpen = ref(false);
const showCalendarTemplate = ref(false);
const showCreateAbsence = ref(false);
const calendarTemplateRef = ref<InstanceType<typeof AppCalendar>>();

const items = ref<TabsItem[]>([
  {label: 'Journée', value: 'timeGridDay'},
  {label: 'Semaine', value: 'timeGridWeek'},
  {label: 'Mois', value: 'dayGridMonth'}
])
const planItems = ref<DropdownMenuItem[]>([
  {label: 'Une absence', icon: 'i-lucide-ban', onSelect: () => showCreateAbsence.value = true},
  {label: 'Une ouverture exceptionnelle', icon: 'i-lucide-sun'},
  {label: 'Ma semaine type', icon: 'i-lucide-calendar-clock', onSelect: () => showCalendarTemplate.value = true},
]);

const motifs = ref([
  {id: 1, name: "Consultation d'ostéopathie", duration: 15},
  {id: 2, name: 'Consultation de suivi de très longue qui faut gérer', duration: 30},
  {id: 3, name: 'Première consultation', duration: 45},
]);

function onEventClick(event: EventContentArg) {
  console.log('Event clicked:', event);
  isOpen.value = true;
}

function onChangeView(view: string | number) {
  calendarTemplateRef.value?.changeView(view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay');
}

function onCreateAbsence(form: unknown) {
  console.log(form)
}

</script>

<template>
  <div style="height: calc(100vh - 8vh - 10vh);">

    <!-- Header with calendar title and view options -->
    <div v-if="!showCalendarTemplate" class="flex items-center justify-between mb-2 space-x-2">
      <div class="text-gray-700 font-medium text-xl">Mon agenda</div>

      <UTabs
          :content="false"
          :items="items"
          class="flex-1 max-w-md"
          default-value="timeGridWeek"
          size="xs"
          variant="pill"
          @update:model-value="onChangeView"
      />

      <UDropdownMenu
          :items="planItems"
      >
        <UButton class="pl-4" color="primary" label="Planifier" trailing-icon="i-lucide-chevron-down" variant="subtle"/>
      </UDropdownMenu>
    </div>
    <div v-else class="flex justify-between mb-2">
      <div class="text-gray-700 font-medium text-xl">Mon calendrier type</div>

      <UButton
          icon="i-lucide-chevron-left"
          label="Retour à mon agenda"
          variant="soft"
          @click="showCalendarTemplate = !showCalendarTemplate"
      />
    </div>

    <!-- Calendar component -->
    <AppCalendar v-if="!showCalendarTemplate" ref="calendarTemplateRef" class="h-full" @event-click="onEventClick"/>
    <DoctorCalendarTemplate v-else class="h-full" @event-click="onEventClick"/>

    <!-- Modal create absence -->
    <CreateDoctorAbsence
        v-model:open="showCreateAbsence"
        @on-submit="onCreateAbsence"
    />

    <!-- Slideover for event details //todo create component -->
    <USlideover
        v-model:open="isOpen"
        :close="false"
    >
      <template #body>
        <div class="pt-4 flex justify-between">
          <h2 class="text-2xl font-medium">Information du slot</h2>
          <UButton label="Modifier" variant="subtle"/>
        </div>
        <AppDivider class="w-full pb-4 pt-2"/>

        <div class="flex flex-col space-y-2">
          <div class="flex justify-between">
            <div>Début</div>
            <div>08:00</div>
          </div>
          <div class="flex justify-between">
            <div>Fin</div>
            <div>12:30</div>
          </div>
        </div>

        <h2 class="pt-6 text-2xl font-medium">Motifs de consultation</h2>
        <AppDivider class="w-full pb-4 pt-2"/>
        <div class="flex flex-col space-y-2">
          <div
              v-for="medicalConcern in motifs" :key="medicalConcern.id"
              class="flex flex-col space-y-2 border-1 border-gray-200 px-4 py-2 rounded-sm"
              style="background: #F1F5F9;"
          >
            <div>{{ medicalConcern.name }}</div>
            <div class="text-sm text-gray-500">Durée : {{ medicalConcern.duration }} minutes</div>
          </div>

        </div>
      </template>
    </USlideover>
  </div>
</template>

<style scoped>

</style>