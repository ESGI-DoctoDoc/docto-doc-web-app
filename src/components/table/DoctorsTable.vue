<script lang="ts" setup>

import {ref} from 'vue'
import TableHeaderDefault from '~/components/table/TableHeaderDefault.vue'
import type {TableColumn, TableRow} from "@nuxt/ui";
import type {Doctor} from "~/types/doctor";

const props = defineProps<{
  data: Doctor[]
  loading: boolean
}>()

const emits = defineEmits(['onDetail', 'onLoadMore', 'onCoverage'])

const tableBodyRef = ref<HTMLElement | null>(null)

const isLoadingMore = ref(false)

function onTableScroll() {
  const el = tableBodyRef.value
  if (!el) return

  const scrollBottom = el.scrollTop + el.clientHeight
  const isAtBottom = scrollBottom >= el.scrollHeight - 10

  if (isAtBottom && !isLoadingMore.value) {
    isLoadingMore.value = true
    emits('onLoadMore', () => {
      isLoadingMore.value = false
    })
  }
}

const search = ref('')
const table = ref('table')
const columns: TableColumn<Doctor>[] = [
  {
    accessorKey: 'name',
    header: 'Nom',
    accessorFn: (row) => row.firstName + ' ' + row.lastName,
    cell: ({row}) => `${row.original.firstName} ${row.original.lastName}`,
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'phone',
    header: 'Téléphone'
  },
  {
    accessorKey: 'speciality',
    header: 'Spécialité',
    cell: ({row}) => row.original.speciality?.name || 'Non spécifiée',
  },
  {
    accessorKey: 'createdAt',
    header: 'Créé le',
    cell: ({row}) => new Date(row.getValue('createdAt')).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
  },
]

function onSelect(row: TableRow<Doctor>) {
  const doctor = props.data[row.index];
  emits('onDetail', doctor);
}

</script>

<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <TableHeaderDefault
        v-model:search="search"
        searchable
        @update:search="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
    >
      <template #left>
        <UButton
            icon="i-heroicons-chart-bar-20-solid"
            label="Voir la couverture"
            variant="subtle"
            @click="$emit('onCoverage')"
        />
      </template>
    </TableHeaderDefault>

    <div
        ref="tableBodyRef"
        style="overflow-y: auto; height: calc(100vh - 8vh - 60px - 55px);"
        @scroll="onTableScroll"
    >
      <UTable
          ref="table"
          empty="Liste vide"
          :columns="columns"
          :data="data"
          sticky
          @select="onSelect"
      >
        <template #expanded="{ row }">
          <pre>{{ row.original }}</pre>
        </template>
      </UTable>
    </div>

    <div class="flex justify-end px-4 py-3.5 text-sm text-muted">
      Nombre d'éléments : {{ data.length }}
    </div>
  </div>
</template>

<style scoped>
</style>