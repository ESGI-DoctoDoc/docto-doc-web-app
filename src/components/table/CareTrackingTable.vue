<script lang="ts" setup>
import {ref} from 'vue'
import TableHeaderDefault from '~/components/table/TableHeaderDefault.vue'
import type {TableColumn, TableRow} from "@nuxt/ui";
import type {CareTracking} from "~/types/care-tracking";
import {useSession} from "~/composables/auth/useSession";
import {careTrackingApi} from "~/services/care-tracking/care-tracking.api";

const props = defineProps<{
  data: CareTracking[]
  loading: boolean
}>()

const emits = defineEmits(['onUpdate', 'onRemove', 'onCreate', 'onDetail', 'onLoadMore', 'onMessage'])
const {getUser} = useSession()
const {handleError} = useNotify()
const {searchCareTrackingByPatientName} = careTrackingApi()

const tableBodyRef = ref<HTMLElement | null>(null)
const isLoadingMore = ref(false)
const isSearching = ref(false)
const tableData = ref<CareTracking[]>(props.data)

watch(
    () => props.data,
    (newData) => {
      tableData.value = newData;
    },
    {immediate: true}
)

const canCreate = computed(() => {
  const user = getUser()
  return user?.doctor?.isLicenseActivated === true;
})

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
    accessorKey: 'closedAt',
    header: 'État du suivi',
    cell: ({row}) => row.original.closedAt ? 'Terminé' : 'En cours'
  },
  {
    id: 'actions',
    header: 'Actions',
  }
]

function getCareTrackingOptions(row: CareTracking) {
  const options = [{
    label: 'Voir les messages',
    icon: 'i-lucide-message-square',
    onClick: () => emits('onMessage', row)
  }];

  const user = getUser();
  const isOwner = row?.owner?.id === user?.doctor?.id;
  if (isOwner) {
    options.push({
      label: 'Modifier le suivi',
      icon: 'i-lucide-edit',
      onClick: () => emits('onUpdate', row)
    })
  }

  return options;
}

function onAddClick() {
  emits('onCreate')
}

function onSelect(row: TableRow<CareTracking>) {
  const careTracking = props.data[row.index];
  emits('onDetail', careTracking);
}

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
    tableData.value = await searchCareTrackingByPatientName(search.value?.trim());
  } catch (error) {
    handleError('Erreur lors de la recherche', error)
  } finally {
    isLoadingMore.value = false;
  }
}

</script>

<template>
  <div class="flex-1 divide-y divide-accented fit">
    <TableHeaderDefault
        v-model:search="search"
        :button-label="canCreate ? 'Ajouter un suivi de dossier' : ''"
        searchable
        @update:search="onSearch()"
        @button-click="onAddClick"
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
          :data="tableData"
          sticky
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
    <div class="flex justify-end px-4 py-3.5 text-sm text-muted">
      Nombre d'éléments : {{ data.length }}
    </div>
  </div>
</template>

<style scoped>
</style>
