<script lang="ts" setup>

import {ref} from 'vue'
import TableHeaderDefault from '~/components/table/TableHeaderDefault.vue'
import type {TableColumn} from "@nuxt/ui";

type Patient = {}

defineProps<{
  data: Patient[]
  loading: boolean
}>()

const emits = defineEmits([])

const search = ref('')
const table = ref('table')
const columns: TableColumn<Patient>[] = [
  {
    id: 'actions',
    header: 'Actions',
  }
]


function onAddClick() {
  console.log('Ajout d’un')
}

</script>

<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <TableHeaderDefault
        v-model:search="search"
        button-label="Ajouter ?"
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
      <template #actions-cell="{ /*row*/ }">
        <UDropdownMenu :items="[]">
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