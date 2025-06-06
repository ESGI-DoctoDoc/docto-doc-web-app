<script lang="ts" setup>

import {ref} from "vue";
import DoctorCalendar from "~/components/calendar/DoctorCalendar.vue";
import DoctorCalendarTemplate from "~/components/calendar/DoctorCalendarTemplate.vue";

definePageMeta({
  title: 'Mon calendrier',
  layout: 'main-layout',
  role: 'doctor',

})

const showCalendarType = ref(true);

</script>

<template>
  <div style="height: calc(100vh - 8vh - 6vh);">
    <DoctorCalendarTemplate
        v-if="showCalendarType"
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