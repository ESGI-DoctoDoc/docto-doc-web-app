<script lang="ts" setup>

const isOpen = defineModel('isOpen', {
  type: Boolean,
  default: false,
})
const slot = defineModel('slot', {
  type: Object as () => { start: string; end: string }, //Todo add type
  default: () => ({start: '', end: ''}),
})

</script>

<template>
  <USlideover v-model:open="isOpen" close>
    <template #title>
      <h2 class="text-2xl font-medium">Détail du slot</h2>
    </template>
    <template #body>
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
            v-for="medicalConcern in []" :key="medicalConcern.id"
            class="flex flex-col space-y-2 border-1 border-gray-200 px-4 py-2 rounded-sm"
            style="background: #F1F5F9;"
        >
          <div>{{ medicalConcern.name }}</div>
          <div class="text-sm text-gray-500">Durée : {{ medicalConcern.duration }} minutes</div>
        </div>

      </div>
    </template>
  </USlideover>
</template>

<style scoped>

</style>