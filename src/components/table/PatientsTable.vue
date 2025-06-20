<script lang="ts" setup>

import {ref} from 'vue'
import TableHeaderDefault from '~/components/table/TableHeaderDefault.vue'
import type {TableColumn, TableRow} from "@nuxt/ui";
import type {Patient} from "~/types/patient";
import {useSession} from "~/composables/auth/useSession";
import type {DropdownMenuItem} from "#ui/components/DropdownMenu.vue";

const props = defineProps<{
  data: Patient[]
  loading: boolean
}>()

const emits = defineEmits(['onDetail', 'onUpdate', 'onCreate', 'onRemove', 'onLoadMore'])

const {getUser} = useSession()
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

const permissions = ref({
  canCreate: false,
  canDelete: false,
  canUpdate: false,
})

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
  {
    id: 'actions',
    header: 'Actions',
  },
]


function onAddClick() {
  if (permissions.value.canCreate) {
    emits('onCreate')
  }
}

function onSelect(row: TableRow<Patient>) {
  const patient = props.data[row.index];
  emits('onDetail', patient);
}

onMounted(() => {
  const user = getUser()
  if (user) {
    permissions.value.canCreate = user.role === 'admin';
    permissions.value.canDelete = user.role === 'admin';
    permissions.value.canUpdate = user.role === 'admin';
  }
})

function getPatientOptions(row: Patient): DropdownMenuItem[] {
  const options: DropdownMenuItem[] = [
    {
      label: 'Créer un rendez-vous',
      icon: 'i-lucide-calendar-plus',
      onSelect: () => {
        //todo create useDeeplink and push to appointment creation page
      },
    }
  ]

  if (permissions.value.canCreate) {
    options.push({
      label: 'Créer un patient',
      icon: 'i-lucide-user-plus',
      onSelect: () => emits('onCreate', row),
    })
  }

  if (permissions.value.canUpdate) {
    options.push({
      label: 'Modifier le patient',
      icon: 'i-lucide-edit',
      onSelect: () => emits('onUpdate', row),
    })
  }

  if (permissions.value.canDelete) {
    options.push({
      label: 'Supprimer le patient',
      icon: 'i-lucide-trash-2',
      onSelect: () => emits('onRemove', row),
    })
  }

  return options
}

</script>

<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <TableHeaderDefault
        v-model:search="search"
        :button-label="permissions.canCreate ? 'Ajouter un patient' : undefined"
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
          :columns="columns"
          :data="data"
          sticky
          @select="onSelect"
      >
        <template #expanded="{ row }">
          <pre>{{ row.original }}</pre>
        </template>
        <template #actions-cell="{ row }">
          <UDropdownMenu :items="getPatientOptions(row.original)">
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