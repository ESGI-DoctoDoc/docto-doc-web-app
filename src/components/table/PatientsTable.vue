<script lang="ts" setup>

import {ref} from 'vue'
import TableHeaderDefault from '~/components/table/TableHeaderDefault.vue'
import type {TableColumn, TableRow} from "@nuxt/ui";
import type {Patient} from "~/types/patient";
import {patientsApi} from "~/services/patients/patient.api";

const props = defineProps<{
  data: Patient[]
  loading: boolean
}>()

const emits = defineEmits(['onDetail', 'onUpdate', 'onCreate', 'onRemove', 'onLoadMore'])
const tableBodyRef = ref<HTMLElement | null>(null)

const {handleError} = useNotify()
const {searchPatientByName} = patientsApi()

const isLoadingMore = ref(false)
const isSearching = ref(false)
const tableData = ref<Patient[]>(props.data)

watch(
    () => props.data,
    (newData) => {
      tableData.value = newData;
    },
    {immediate: true}
)

function onTableScroll() {
  const el = tableBodyRef.value
  if (!el || isSearching.value) return

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
const columns: TableColumn<Patient>[] = [
  {
    accessorKey: 'name',
    header: 'Nom',
    cell: ({row}) => `${row.original.firstname} ${row.original.lastname}`,
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
    accessorKey: 'gender',
    header: 'Genre',
    cell: ({row}) => {
      const genders = {
        MALE: 'Homme',
        FEMALE: 'Femme',
      }
      return genders[row.getValue<'MALE' | 'FEMALE'>('gender')]
    }
  },
]

function onSelect(row: TableRow<Patient>) {
  const patient = props.data[row.index];
  emits('onDetail', patient);
}

async function onSearch() {
  if (search.value?.trim() === '') {
    tableData.value = props.data;
    return;
  }

  if (search.value.length <= 2) {
    isSearching.value = false;
    return;
  }
  isSearching.value = true;

  isLoadingMore.value = true;
  try {
    tableData.value = await searchPatientByName(search.value?.trim());
  } catch (error) {
    handleError('Erreur lors de la recherche', error)
  } finally {
    isLoadingMore.value = false;
  }
}


</script>

<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <TableHeaderDefault
        v-model:search="search"
        searchable
        @update:search="onSearch()"
    />

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