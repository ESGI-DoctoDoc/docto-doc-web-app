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
  <div class="overflow-hidden" style="height: calc(100vh - 8vh);">
    <DoctorCalendarTemplate
        v-if="showCalendarType"
        class="fit"
        @on-calendar-type="showCalendarType = !showCalendarType"
    />
    <DoctorCalendar
        v-else ref="calendarTemplateRef"
        class="fit"
        @on-calendar-type="showCalendarType = !showCalendarType"
    />
  </div>
</template>

<style scoped>

</style>