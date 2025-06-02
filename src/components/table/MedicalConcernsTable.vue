<script lang="ts" setup>

import {ref} from 'vue'
import TableHeaderDefault from '~/components/table/TableHeaderDefault.vue'
import type {TableColumn} from "@nuxt/ui";
import type {MedicalConcern} from "~/types/medical-concern";

defineProps<{
  data: MedicalConcern[]
  loading: boolean
}>()

const emits = defineEmits(['onUpdate', 'onRemove', 'onCreate'])

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
    cell: ({row}) => row.getValue('duration') || 'Non spécifiée'
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
      label: 'Gérer les questions',
      icon: 'i-lucide-edit-2',
      onClick: () => {
        console.log('Gestion des questions pour le motif de consultation', row)
        emits('onUpdate', row)
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
  <div class="flex-1 divide-y divide-accented w-full">
    <TableHeaderDefault
        v-model:search="search"
        button-label="Ajouter un motif de consultation"
        searchable
        @update:search="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
        @button-click="onAddClick"
    />

    <UTable
        ref="table"
        :columns="columns"
        :data="data"
        sticky
        style="height: calc(100vh - 8vh - 15vh);"
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

    <div class="flex justify-end px-4 py-3.5 text-sm text-muted">
      Nombre d'éléments : {{ data.length }}
    </div>
  </div>
</template>

<style scoped>
</style>