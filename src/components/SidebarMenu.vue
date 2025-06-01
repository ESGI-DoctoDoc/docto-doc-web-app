<script lang="ts" setup>
const props = defineProps<{
  role: 'doctor' | 'admin'
}>()

const route = useRoute()

const allLinks = {
  doctor: [
    {label: 'Calendrier', to: '/my-calendar', icon: 'i-heroicons-calendar-days'},
    {label: 'Rendez-vous', to: '/my-appointments', icon: 'i-heroicons-clock'},
    {label: 'Mes patients', to: '/my-patients', icon: 'i-heroicons-user-group'},
    {label: 'Motifs', to: '/my-medical-concerns', icon: 'i-heroicons-clipboard-document-list'},
    {label: 'Suivis de dossier', to: '/care-tracking', icon: 'i-heroicons-document-magnifying-glass'},
    {label: 'Licence', to: '/license', icon: 'i-heroicons-identification'},
    // { label: 'Paramètres', to: '/settings', icon: 'i-heroicons-cog-6-tooth' }
  ],
  admin: [
    {label: 'Dashboard', to: '/', icon: 'i-heroicons-home'},
    {label: 'Docteurs', to: '/doctors', icon: 'i-heroicons-user'},
    {label: 'Rendez-vous', to: '/appointments', icon: 'i-heroicons-calendar-days'},
    {label: 'Motifs', to: '/medical-concerns', icon: 'i-heroicons-clipboard-document-list'},
    {label: 'Questions', to: '/questions', icon: 'i-heroicons-question-mark-circle'},
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