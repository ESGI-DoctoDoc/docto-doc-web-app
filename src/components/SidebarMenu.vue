<script lang="ts" setup>
const props = defineProps<{
  role: 'doctor' | 'admin' | 'patient'
}>()

const route = useRoute()

const allLinks = {
  doctor: [
    {label: 'Calendrier', to: '/my-calendar', icon: 'i-heroicons-calendar-days'},
    {label: 'Rendez-vous', to: '/my-appointments', icon: 'i-heroicons-clock'},
    {label: 'Mes patients', to: '/my-patients', icon: 'i-heroicons-user-group'},
    {label: 'Motifs', to: '/my-medical-concerns', icon: 'i-heroicons-clipboard-document-list'},
    {label: 'Suivis de dossier', to: '/care-tracking', icon: 'i-heroicons-document-magnifying-glass'},
    {label: 'Licence', to: '/my-license', icon: 'i-heroicons-identification'},
    // { label: 'Paramètres', to: '/settings', icon: 'i-heroicons-cog-6-tooth' }
  ],
  admin: [
    {label: 'Dashboard', to: '/admin/dashboard', icon: 'i-heroicons-home'},
    {label: 'Docteurs', to: '/admin/doctors', icon: 'i-heroicons-user'},
    {label: 'Rendez-vous', to: '/admin/appointments', icon: 'i-heroicons-calendar-days'},
    {label: 'Spécialités', to: '/admin/specialities', icon: 'i-heroicons-clipboard-document-list'},
    {label: 'Abonnements', to: '/admin/subscriptions', icon: 'i-heroicons-credit-card'},
  ]
}

const links = computed(() => allLinks[props.role])
</script>

<template>
  <UNavigationMenu
      :items="links"
      :model-value="route.path"
      class="w-48"
      orientation="vertical"
  >
    <template #item-icon="{ item }">
      <i :class="item.icon"/>
    </template>
  </UNavigationMenu>
</template>