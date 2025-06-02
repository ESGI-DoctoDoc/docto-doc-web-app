<script lang="ts" setup>

import {ref} from 'vue'
import TableHeaderDefault from '~/components/table/TableHeaderDefault.vue'
import type {TableColumn} from "@nuxt/ui";
import type {Speciality} from "~/types/speciality";
import CreateSpecialityModal from "~/components/modals/CreateSpecialityModal.vue";
import type {CreateSpecialityForm} from "~/components/inputs/validators/speciality-form.validator";

defineProps<{
  data: Speciality[]
  loading: boolean
}>()

const emits = defineEmits([])

const isOpen = ref(false)

const search = ref('')
const table = ref('table')
const columns: TableColumn<Speciality>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
  },
  {
    id: 'name',
    header: 'Nom',
    accessorKey: 'name',
    cell: ({row}) => row.getValue('name'),
  },
  {
    id: 'actions',
    header: 'Actions',
  }
]

function onCreateSpeciality(form: CreateSpecialityForm) {
  console.log(form);
}

</script>

<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <TableHeaderDefault
        v-model:search="search"
        button-label="Créer une spécialité"
        searchable
        @update:search="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
        @button-click="isOpen = true"
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

    <CreateSpecialityModal v-model:open="isOpen" @onsubmit="onCreateSpeciality($event)"/>
  </div>
</template>

<style scoped>
</style>