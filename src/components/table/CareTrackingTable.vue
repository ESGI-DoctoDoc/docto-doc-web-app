<script lang="ts" setup>
import {ref} from 'vue'
import TableHeaderDefault from '~/components/table/TableHeaderDefault.vue'
import type {TableColumn, TableRow} from "@nuxt/ui";
import type {CareTracking} from "~/types/care-tracking";
import {useSession} from "~/composables/auth/useSession";

const props = defineProps<{
  data: CareTracking[]
  loading: boolean
}>()

const emits = defineEmits(['onUpdate', 'onRemove', 'onCreate', 'onDetail', 'onLoadMore', 'onMessage'])
const {getUser} = useSession()

const tableBodyRef = ref<HTMLElement | null>(null)
const isLoadingMore = ref(false)

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
    accessorKey: 'endedAt',
    header: 'État du suivi',
    // cell: ({row}) => dayjs(row.original.endedAt).isBefore(dayjs()) ? 'Terminé' : 'En cours'
    cell: ({row}) => 'En cours'
  },
  {
    id: 'actions',
    header: 'Actions',
  }
]

function getCareTrackingOptions(row: CareTracking) {
  return [
    {
      label: 'Voir les messages',
      icon: 'i-lucide-message-square',
      onClick: () => emits('onMessage', row)
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

</script>

<template>
  <div class="flex-1 divide-y divide-accented fit">
    <TableHeaderDefault
        v-model:search="search"
        :button-label="canCreate ? 'Ajouter un suivi de dossier' : ''"
        searchable
        @update:search="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
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
          :data="data"
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
