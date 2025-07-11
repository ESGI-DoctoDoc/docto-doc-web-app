<script lang="ts" setup>

import {ref} from 'vue'
import TableHeaderDefault from '~/components/table/TableHeaderDefault.vue'
import type {TableColumn, TableRow} from "@nuxt/ui";
import {useSession} from "~/composables/auth/useSession";
import type {DropdownMenuItem} from "#ui/components/DropdownMenu.vue";
import type {Appointment} from "~/types/appointment";
import dayjs from "dayjs";
import {appointmentApi} from "~/services/appointments/appointment.api";

const props = defineProps<{
  data: Appointment[]
  loading: boolean
}>()

const emits = defineEmits(['onDetail', 'onUpdate', 'onReschedule', 'onCancel', 'onDelete', 'onLoadMore'])
const tableBodyRef = ref<HTMLElement | null>(null)

const {handleError} = useNotify()
const {searchAppointmentsByPatient} = appointmentApi()

const isLoadingMore = ref(false)
const isSearching = ref(false)
const tableData = ref<Appointment[]>(props.data)

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

const {getUser} = useSession()


const permissions = ref({
  canDelete: false,
})

const search = ref('')
const table = ref('table')
const columns: TableColumn<Appointment>[] = [
  {
    id: 'doctor',
    header: 'Médecin',
    accessorFn: (row) => row.doctor?.email,
    cell: ({row}) => {
      return row.original?.doctor?.email || 'Aucun médecin assigné';
    },
  },
  {
    accessorKey: 'patient',
    header: 'Nom du patient',
    accessorFn: (row) => row.patient?.name,
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
    accessorKey: 'medicalConcern',
    header: 'Motif de consultation',
    cell: ({row}) => row.original?.medicalConcern?.name || 'Aucun motif spécifié',
  },
  {
    header: 'Statut',
    cell: ({row}) => {
      const status = row.original.status
      switch (status) {
        case 'upcoming':
          return 'À venir';
        case 'confirmed':
          return 'Confirmé';
        case 'locked':
          return 'Verrouillé';
        case 'cancelled-excused':
          return 'Annulé (excusé)';
        case 'cancelled-unexcused':
          return 'Annulé (non excusé)';
        case 'completed':
          return 'Terminé';
        case 'waiting-room':
          return 'En salle d’attente';
        default:
          return 'Inconnu';
      }
    }
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
    permissions.value.canDelete = user.user.role === 'admin';
  }
})

function getAppointmentOptions(row: Appointment): DropdownMenuItem[] {
  const isAdmin = getUser()?.user.role === 'admin';
  const isEnded = row.status === 'completed';
  const isCancelled = row.status === 'cancelled-excused' || row.status === 'cancelled-unexcused';
  const ableTo = {
    canUpdate: !isEnded && !isCancelled && !isAdmin,
    canPostponed: !isEnded && !isCancelled && !isAdmin,
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
  if (ableTo.canCancel) {
    options.push({
      label: 'Annuler le rendez-vous',
      icon: 'i-lucide-x-circle',
      onClick: () => emits('onCancel', row),
    })
  }
  // if (ableTo.canDelete) {
  //   options.push({
  //     label: 'Supprimer le rendez-vous',
  //     icon: 'i-lucide-trash-2',
  //     onClick: () => emits('onDelete', row),
  //   })
  // }

  return options
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
    tableData.value = await searchAppointmentsByPatient(search.value?.trim());
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
          :data="tableData"
          sticky
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
    </div>

    <div class="flex justify-end px-4 py-3.5 text-sm text-muted">
      Nombre d'éléments : {{ data.length }}
    </div>
  </div>
</template>

<style scoped>
</style>