<script lang="ts" setup>
import {ref} from 'vue'
import TableHeaderDefault from '~/components/table/TableHeaderDefault.vue'
import type {TableColumn, TableRow} from "@nuxt/ui";
import type {CareTracking} from "~/types/care-tracking";

const props = defineProps<{
  data: CareTracking[]
  loading: boolean
}>()

const emits = defineEmits(['onUpdate', 'onRemove', 'onCreate', 'onDetail'])

const search = ref('')
const table = ref('table')
const columns: TableColumn<CareTracking>[] = [
  {
    accessorKey: 'name',
    header: 'Nom'
  },
  {
    accessorKey: 'patient',
    header: 'Patient',
    cell: ({row}) => row.original.patient.firstName + ' ' + row.original.patient.lastName
  },
  {
    accessorKey: 'endedAt',
    header: 'État du suivi',
    cell: () => 'En cours'
  },
  {
    id: 'actions',
    header: 'Actions',
  }
]

function getCareTrackingOptions(row: CareTracking) {
  return [
    {
      label: 'Détail',
      icon: 'i-lucide-eye',
      onClick: () => emits('onDetail', row)
    },
    {
      label: 'Modifier le suivi',
      icon: 'i-lucide-edit',
      onClick: () => emits('onUpdate', row)
    },
    // {
    //   label: 'Retirer le suivi',
    //   icon: 'i-lucide-trash-2',
    //   onClick: () => emits('onRemove', row)
    // }
  ]
}

function onAddClick() {
  emits('onCreate')
}

function onSelect(row: TableRow<CareTracking>) {
  const careTracking = props.data[row.index];
  emits('onDetail', careTracking);
}

</script>

<template>
  <div class="flex-1 divide-y divide-accented fit">
    <TableHeaderDefault
        v-model:search="search"
        button-label="Ajouter un suivi de dossier"
        searchable
        @update:search="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
        @button-click="onAddClick"
    />

    <UTable
        ref="table"
        :columns="columns"
        :data="data"
        sticky
        style="height: calc(100vh - 8vh - 60px - 55px);"
        @select="onSelect"
    >
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
      <template #actions-cell="{ row }">
        <UDropdownMenu :items="getCareTrackingOptions(row.original)" :popper="{ placement: 'bottom-end' }">
          <UButton
              aria-label="Actions"
              color="neutral"
              icon="i-lucide-ellipsis-vertical"
              variant="ghost"
          />
        </UDropdownMenu>
      </template>
    </UTable>
  </div>
</template>

<style scoped>
</style>
