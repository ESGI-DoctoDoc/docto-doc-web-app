<script lang="ts" setup>

import DoctorMapCoverage from "~/components/doctors/DoctorMapCoverage.vue";

definePageMeta({
  title: 'Couverture des médecins',
  layout: 'main-layout',
  role: 'admin',
  path: '/admin/doctors/coverage',
})

</script>

<template>
  <div class="fit">
    <div class="flex flex-col space-y-2 p-4">
      <UBreadcrumb
          :items="[
            { label: 'Médecins', icon: 'i-lucide-user', to: '/admin/doctors' },
            { label: 'Couverture', icon: 'i-lucide-map' }
          ]"
      />
      <h2 class="text-xl font-semibold mt-2">Couverture des médecins</h2>
      <div>
        <DoctorMapCoverage/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>