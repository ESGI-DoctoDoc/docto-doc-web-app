<script lang="ts" setup>

import {ref} from 'vue'
import TableHeaderDefault from '~/components/table/TableHeaderDefault.vue'
import type {TableColumn, TableRow} from "@nuxt/ui";
import type {Doctor} from "~/types/doctor";
import {doctorsApi} from "~/services/doctors/doctors.api";

const props = defineProps<{
  data: Doctor[]
  loading: boolean
}>()

const emits = defineEmits(['onDetail', 'onLoadMore', 'onCoverage', 'onShowRecruitment'])
const tableBodyRef = ref<HTMLElement | null>(null)

const {handleError} = useNotify()
const {searchDoctorsByName} = doctorsApi()

const isLoadingMore = ref(false)
const isSearching = ref(false)
const tableData = ref<Doctor[]>(props.data)

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
  const doctor = tableData.value[row.index];
  emits('onDetail', doctor);
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
    tableData.value = await searchDoctorsByName(search.value?.trim());
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
    >
      <template #left>
        <div class="flex space-x-2">
          <UButton
              icon="i-heroicons-chart-bar-20-solid"
              label="Voir la couverture"
              variant="ghost"
              @click="$emit('onCoverage')"
          />
          <UButton
              icon="i-heroicons-user-plus"
              label="À recruter"
              variant="subtle"
              @click="$emit('onShowRecruitment')"
          />
        </div>
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
          :data="tableData"
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