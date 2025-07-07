<script lang="ts" setup>

import {ref} from "vue";
import DoctorCalendar from "~/components/calendar/DoctorCalendar.vue";
import DoctorCalendarTemplate from "~/components/calendar/DoctorCalendarTemplate.vue";

definePageMeta({
  title: 'Mon calendrier',
  layout: 'main-layout',
  role: 'doctor',
})

const showCalendarType = ref(false);

</script>

<template>
  <div class="overflow-hidden" style="height: calc(100vh - 8vh); position: relative;">
    <!-- Overlay sombre derrière le composant -->
    <div v-if="showCalendarType" class="calendar-overlay">
      <DoctorCalendarTemplate
          class="fit border-1 border-amber-300 intense-shadow"
          @on-calendar-type="showCalendarType = !showCalendarType"
      />
    </div>

    <!-- Calendrier principal -->
    <DoctorCalendar
        v-else
        ref="calendarTemplateRef"
        class="fit"
        @on-calendar-type="showCalendarType = !showCalendarType"
    />
  </div>
</template>

<style scoped>
.calendar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* effet sombre */
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.intense-shadow {
  box-shadow: 0 0 50px 10px rgba(255, 193, 7, 0.8); /* box-shadow vénère, jaune ambre */
  border-radius: 12px;
  background-color: white;
  padding: 16px;
}
</style>