<script lang="ts" setup>

import {ref} from 'vue'
import TableHeaderDefault from '~/components/table/TableHeaderDefault.vue'
import type {TableColumn, TableRow} from "@nuxt/ui";
import {useSession} from "~/composables/auth/useSession";
import type {DropdownMenuItem} from "#ui/components/DropdownMenu.vue";
import type {Appointment} from "~/types/appointment";
import dayjs from "dayjs";

const props = defineProps<{
  data: Appointment[]
  loading: boolean
}>()

const emits = defineEmits(['onDetail', 'onUpdate', 'onReschedule', 'onCancel', 'onDelete'])

const {getUser} = useSession()


const permissions = ref({
  canDelete: false,
})

const search = ref('')
const table = ref('table')
const columns: TableColumn<Appointment>[] = [
  {
    accessorKey: 'patient',
    header: 'Nom du patient',
    cell: ({row}) => `${row.original.patient.name}`,
  },
  {
    accessorKey: 'start',
    header: 'Date',
    cell: ({row}) => {
      return dayjs(row.original.start).format('DD/MM/YYYY') + ' ' + row.original.startHour;
    }
  },
  {
    accessorKey: 'birthdate',
    header: 'Date de naissance',
  },
  {
    accessorKey: 'status',
    header: 'Statut',
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
  },
];

function onSelect(row: TableRow<Appointment>) {
  const patient = props.data[row.index];
  emits('onDetail', patient);
}

onMounted(() => {
  const user = getUser()
  if (user) {
    permissions.value.canDelete = user.role === 'admin';
  }
})

function getAppointmentOptions(row: Appointment): DropdownMenuItem[] {
  const isEnded = row.status === 'completed';
  const isCancelled = row.status === 'cancelled-excused' || row.status === 'cancelled-unexcused';
  const ableTo = {
    canUpdate: !isEnded && !isCancelled,
    canPostponed: !isEnded && !isCancelled,
    canReschedule: true, // Assuming rescheduling is always allowed
    canCancel: !isEnded && !isCancelled,
    canDelete: !isEnded && !isCancelled && permissions.value.canDelete,
  }

  const options: DropdownMenuItem[] = []
  if (ableTo.canUpdate) {
    options.push({
      label: 'Modifier le rendez-vous',
      icon: 'i-lucide-edit',
      onClick: () => emits('onUpdate', row),
    })
  }
  if (ableTo.canPostponed) {
    // options.push({
    //   label: 'Déplacer le rendez-vous',
    //   icon: 'i-lucide-calendar-check',
    //   onClick: () => emits('onReschedule', row),
    // })
  }
  if (ableTo.canReschedule) {
    // options.push({
    //   label: 'Reprogrammer le rendez-vous',
    //   icon: 'i-lucide-calendar-plus',
    //   onClick: () => emits('onReschedule', row),
    // })
  }
  if (ableTo.canCancel) {
    options.push({
      label: 'Annuler le rendez-vous',
      icon: 'i-lucide-x-circle',
      onClick: () => emits('onCancel', row),
    })
  }
  if (ableTo.canDelete) {
    options.push({
      label: 'Supprimer le rendez-vous',
      icon: 'i-lucide-trash-2',
      onClick: () => emits('onDelete', row),
    })
  }

  return options
}

</script>

<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <TableHeaderDefault
        v-model:search="search"
        searchable
        @update:search="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
    />

    <UTable
        ref="table"
        :columns="columns"
        :data="data"
        sticky
        style="height: calc(100vh - 8vh - 60px - 55px);"
        @select="onSelect"
    >
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
      <template #actions-cell="{ row }">
        <UDropdownMenu :items="getAppointmentOptions(row.original)">
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