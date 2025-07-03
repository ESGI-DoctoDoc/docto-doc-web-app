<script lang="ts" setup>

import {ref} from 'vue'
import type {TableColumn} from "@nuxt/ui";
import type {Subscription} from "~/types/subscription";
import dayjs from "dayjs";
import TableHeaderDefault from "~/components/table/TableHeaderDefault.vue";

const props = defineProps<{
  data: Subscription[]
  loading: boolean
}>()

const emits = defineEmits(['onCheckout', 'onViewInvoice'])
const search = ref('')

// const addButton = computed(() => {
//   const hasActive = props.data.some(sub => sub.status === 'active')
//   return hasActive ? '' : 'Ajouter une licence'
// })

const table = ref('table')
const columns: TableColumn<Subscription>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
  },
  {
    id: 'doctor',
    header: 'Docteur',
    accessorFn: (row) => row.doctor?.email,
    cell: ({row}) => {
      return row.original?.doctor?.email;
    },
  },
  {
    header: 'Nom',
    cell: () => 'Licence 1 an',
  },
  {
    header: 'Début',
    cell: ({row}) => dayjs(row.original.start).format('DD/MM/YYYY'),
  },
  {
    header: 'Fin',
    cell: ({row}) => dayjs(row.original.end).format('DD/MM/YYYY'),
  },
  {
    header: 'Prix',
    cell: ({row}) => row.original.amount === 0 ? 'Gratuit' : `${row.original.amount} €`,
  },
  {
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.original.status
      switch (status) {
        case 'active':
          return 'Active'
        case 'expired':
          return 'Expirée'
        case 'inactive':
          return 'Inactive'
        case 'payment_error':
          return 'Erreur de paiement'
        default:
          return 'Inconnu'
      }
    }
  },
  {
    id: 'actions',
    header: 'Actions',
  }
]

function getRowActions(subscription: Subscription) {
  return [
    {
      label: 'Télécharger la facture',
      icon: 'i-lucide-file-text',
      onClick: () => {
        emits('onViewInvoice', subscription)
      },
    },
  ]
}
</script>

<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <TableHeaderDefault
        v-model:search="search"
        searchable
        @update:search="table?.tableApi?.getColumn('doctor')?.setFilterValue(search)"
    />

    <UTable
        ref="table"
        empty="Liste vide"
        :columns="columns"
        :data="data"
        :loading="loading"
        sticky
        style="height: calc(100vh - 8vh - 15vh);"
    >
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
      <template #actions-cell="{ row }">
        <UDropdownMenu :items="getRowActions(row.original)">
          <UButton
              :disabled="loading"
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