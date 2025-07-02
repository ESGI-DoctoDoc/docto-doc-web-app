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

const emits = defineEmits(['onCreateSpeciality', 'on-update-speciality', 'onLoadMore'])

const isOpen = ref(false)
const updateSpeciality = ref(false)
const isLoadingMore = ref(false)
const currentSpeciality = ref<Speciality>();
const tableBodyRef = ref<HTMLElement | null>(null)

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
    id: 'createdAt',
    header: 'Créé le',
    accessorKey: 'createdAt',
    cell: ({row}) => new Date(row.getValue('createdAt')).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
  },
  {
    id: 'actions',
    header: 'Actions',
  }
]

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

function getRowActions(speciality: Speciality) {
  return [
    {
      label: 'Modifier',
      icon: 'i-lucide-edit',
      onClick: () => {
        updateSpeciality.value = true
        currentSpeciality.value = speciality
      },
    },
  ]
}

function onCreateSpeciality(form: CreateSpecialityForm) {
  emits('onCreateSpeciality', form, () => {
    isOpen.value = false
  })
}

function onUpdateSpeciality(form: CreateSpecialityForm) {
  if (!currentSpeciality.value) return

  emits('on-update-speciality', {
    id: currentSpeciality.value.id,
    name: form.name,
  }, () => {
    updateSpeciality.value = false
    currentSpeciality.value = undefined
  })
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

    <div
        ref="tableBodyRef"
        style="overflow-y: auto; height: calc(100vh - 8vh - 60px - 55px);"
        @scroll="onTableScroll"
    >
      <UTable
        ref="table"
        empty="Liste vide"
        :loading="loading"
        :columns="columns"
        :data="data"
        sticky
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
    </div>
    <div class="flex justify-end px-4 py-3.5 text-sm text-muted">
      Nombre d'éléments : {{ data.length }}
    </div>

    <CreateSpecialityModal v-model:open="isOpen" @onsubmit="onCreateSpeciality($event)"/>
    <CreateSpecialityModal
        v-if="currentSpeciality && updateSpeciality"
        v-model:open="updateSpeciality"
        :speciality="currentSpeciality"
        @onsubmit="onUpdateSpeciality($event)"
    />
  </div>
</template>

<style scoped>
</style>