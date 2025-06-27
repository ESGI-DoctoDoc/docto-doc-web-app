<script lang="ts" setup>

import {ref} from 'vue'
import type {TableColumn} from "@nuxt/ui";
import type {Subscription} from "~/types/subscription";
import dayjs from "dayjs";

const props = defineProps<{
  data: Subscription[]
  loading: boolean
}>()

const emits = defineEmits(['onCheckout', 'onViewInvoice'])

const addButton = computed(() => {
  const hasActive = props.data.some(sub => sub.status === 'active')
  return hasActive ? '' : 'Prendre ma licence'
})

const table = ref('table')
const columns: TableColumn<Subscription>[] = [
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
    cell: ({row}) => row.original.status === 'active' ? 'Active' : 'Expirée',
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
    <div class="flex justify-end">
      <UButton
          v-if="addButton"
          color="primary"
          @click="$emit('onCheckout')"
      />
    </div>

    <UTable
        ref="table"
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