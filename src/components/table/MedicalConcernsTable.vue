<script lang="ts" setup>

import {ref} from 'vue'
import TableHeaderDefault from '~/components/table/TableHeaderDefault.vue'
import type {TableColumn} from "@nuxt/ui";
import type {MedicalConcern} from "~/types/medical-concern";

defineProps<{
  data: MedicalConcern[]
  loading: boolean
}>()

const emits = defineEmits(['onUpdate', 'onRemove', 'onCreate', 'onEditQuestions'])

function formatDuration(duration: number): string {
  switch (duration) {
    case 15: return '15 minutes';
    case 30: return '30 minutes';
    case 45: return '45 minutes';
    case 60: return '1 heure';
    case 90: return '1h30';
    case 120: return '2 heures';
    default: return `${duration} min`;
  }
}

const search = ref('')
const table = ref('table')
const columns: TableColumn<MedicalConcern>[] = [
  {
    accessorKey: 'name',
    header: 'Nom'
  },
  {
    accessorKey: 'duration',
    header: 'Durée',
    cell: ({row}) => formatDuration(row.getValue('duration')) || 'Non spécifiée'
  },
  {
    accessorKey: 'price',
    header: 'Prix',
    cell: ({row}) => row.getValue('price') ? `${row.getValue('price')} €` : 'Gratuit'
  },
  {
    header: 'Questions',
    accessorFn: (row) => row.questions.length,
  },
  {
    id: 'actions',
    header: 'Actions',
  }
]

function getMedicalConcernsOptions(row: MedicalConcern) {
  return [
    {
      label: 'Modifier le motif',
      icon: 'i-lucide-edit',
      onClick: () => {
        console.log('Modification du motif de consultation', row)
        emits('onUpdate', row)
      }
    },
    {
      label: 'Gérer les questions',
      icon: 'i-lucide-edit-2',
      onClick: () => {
        console.log('Gestion des questions pour le motif de consultation', row)
        emits('onEditQuestions', row)
      }
    },
    {
      label: 'Retirer le motif',
      icon: 'i-lucide-trash-2',
      onClick: () => {
        console.log('Suppression du motif de consultation', row)
        emits('onRemove', row)
      }
    }
  ]
}

function onAddClick() {
  emits('onCreate')
}

</script>

<template>
  <div class="flex-1 divide-y divide-accented fit">
    <TableHeaderDefault
        v-model:search="search"
        button-label="Ajouter un motif de consultation"
        searchable
        @update:search="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
        @button-click="onAddClick"
    />

    <UTable
        ref="table"
        empty="Liste vide"
        :columns="columns"
        :data="data"
        sticky
        :loading
        :ui="{
          thead: 'bg-gray-50',
        }"
        style="height: calc(100vh - 8vh - 60px - 55px);"
    >
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
      <template #actions-cell="{ row }">
        <UDropdownMenu :items="getMedicalConcernsOptions(row.original)">
          <UButton
              aria-label="Actions"
              color="neutral"
              icon="i-lucide-ellipsis-vertical"
              variant="ghost"
          />
        </UDropdownMenu>
      </template>
    </UTable>

    <div class="flex justify-end px-4 py-3.5 text-sm text-muted" style="min-height: 55px; max-height: 55px">
      <span class="mr-1">Nombre d'éléments :</span>
      <span v-if="loading" class="flex items-center justify-center">
        <UIcon class="animate-spin" name="i-lucide-loader"/>
      </span>
      <span v-else>{{ data.length }}</span>

    </div>
  </div>
</template>

<style scoped>
</style>