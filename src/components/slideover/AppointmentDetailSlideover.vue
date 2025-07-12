<script lang="ts" setup>


import type {Appointment} from "~/types/appointment";
import {useSession} from "~/composables/auth/useSession";
import {useClipboard} from "@vueuse/core";
import {appointmentApi} from "~/services/appointments/appointment.api";
import dayjs from "dayjs";

const isOpen = defineModel('isOpen', {
  type: Boolean,
  default: false,
})

const props = defineProps<{
  appointment: Appointment
}>()

defineEmits(['on-close', 'on-update', 'on-delete', 'on-cancel', 'on-end'])


const {showError, showSuccess} = useNotify()
const {copy} = useClipboard()
const {fetchAppointmentById} = appointmentApi()
const {getUser} = useSession()


const loading = ref(false)
const appointmentDetail = ref<Appointment>()
const permissions = ref({
  canDelete: false,
})

const isCancelled = computed(() => appointmentDetail.value?.status === 'cancelled-excused' || appointmentDetail.value?.status === 'cancelled-unexcused');
const isEnded = computed(() => appointmentDetail.value?.status === 'completed');
const isToday = computed(() => {
  const start = appointmentDetail.value?.start;
  return dayjs(start).isSame(dayjs(), 'day');
});
const isAdmin = computed(() => {
  const user = getUser();
  return user?.user.role === 'admin';
});
const formatStart = computed(() => {
  const start = appointmentDetail.value?.start;
  return dayjs(start).format('DD/MM/YYYY') + ' ' + appointmentDetail.value?.startHour;
});
const formattedStatus = computed(() => {
  const status = appointmentDetail.value?.status;
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
      return 'En salle d\'attente';
    default:
      return '';
  }
});

async function fetchAppointmentDetails() {
  loading.value = true
  try {
    if (!props?.appointment?.id) {
      showError('Aucun rendez-vous sélectionné', 'Veuillez sélectionner un rendez-vous pour afficher les détails.')
      return;
    }

    appointmentDetail.value = await fetchAppointmentById(props!.appointment.id);
  } catch (error) {
    if (error instanceof Error) {
      showError('Erreur lors de la récupération des détails du rendez-vous', error.message);
    } else {
      showError('Une erreur est survenue lors de la récupération des détails du rendez-vous.');
    }
  } finally {
    loading.value = false;
  }
}


onMounted(() => {
  const user = getUser()
  if (user) {
    permissions.value.canDelete = user.user.role === 'admin';
  }
  fetchAppointmentDetails();
});

function copyToClipboard(text: string) {
  copy(text)
      .then(() => {
        showSuccess('Copié dans le presse-papiers');
      })
      .catch((error) => {
        showError('Erreur lors de la copie', error.message);
      });
}

function formatPhoneNumber(phone: string): string {
  const number = phone.startsWith('+33') ? '0' + phone.slice(3) : phone;
  return number.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}
</script>

<template>
  <USlideover
      v-model:open="isOpen"
      aria-describedby="appointment-detail-description"
      aria-description="Appointment Detail Slideover"
      class="max-w-lg"
      close
      @after:leave="$emit('on-close')"
  >
    <template #title>
      <h2 class="text-lg font-semibold">Détails du Rendez-vous</h2>
    </template>

    <template #body>
      <div v-if="loading" class="flex flex-col space-y-6">
        <div class="flex justify-between">
          <USkeleton class="h-4 w-20"/>
          <USkeleton class="h-4 w-28"/>
        </div>
        <div class="flex justify-between">
          <USkeleton class="h-4 w-24"/>
          <USkeleton class="h-4 w-16"/>
        </div>
        <div class="flex justify-between">
          <USkeleton class="h-4 w-32"/>
          <USkeleton class="h-4 w-20"/>
        </div>
        <div class="flex justify-between">
          <USkeleton class="h-4 w-32"/>
          <USkeleton class="h-4 w-20"/>
        </div>
      </div>

      <div v-else-if="appointmentDetail" class="flex flex-col space-y-2">
        <div class="flex justify-between space-y-1">
          <div>Nom</div>
          <div class="cursor-pointer" @click="copyToClipboard(appointmentDetail.patient.name)">
            {{ appointmentDetail.patient.name }}
          </div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Email</div>
          <div class="cursor-pointer" @click="copyToClipboard(appointmentDetail.patient.email)">
            {{ appointmentDetail.patient.email }}
          </div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Téléphone</div>
          <div class="cursor-pointer" @click="copyToClipboard(formatPhoneNumber(appointmentDetail.patient.phone))">
            {{ formatPhoneNumber(appointmentDetail.patient.phone) }}
          </div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Début</div>
          <div>{{ formatStart }}</div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Motif de consultation</div>
          <div>{{ appointmentDetail.medicalConcern.name }}</div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Statut</div>
          <div>{{ formattedStatus }}</div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Note du médecin</div>
          <div>{{ appointmentDetail.doctorNotes ?? 'Pas de note.' }}</div>
        </div>

        <h2 v-if="appointmentDetail?.careTracking?.id" class="pt-6 text-xl font-medium">Suivi de dossier</h2>
        <AppDivider v-if="appointmentDetail?.careTracking?.id" class="w-full pb-4 pt-2"/>
        <div v-if="appointmentDetail?.careTracking?.id" class="flex justify-between space-y-1">
          <div>Nom du suivi</div>
          <div>{{ appointmentDetail.careTracking?.name }}</div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="fit flex flex-col space-y-2">
        <UButton
            v-if="!isEnded && !isCancelled && !isAdmin"
            block
            color="primary"
            @click="$emit('on-update', appointmentDetail!)"
        >
          Modifier
        </UButton>
        <UButton
            v-if="!isEnded && !isCancelled && !isAdmin && isToday"
            block
            color="primary"
            variant="subtle"
            @click="$emit('on-end', appointmentDetail!)"
        >
          Marquer comme terminé
        </UButton>
        <UButton
            v-if="!isEnded && !isCancelled && !isAdmin"
            block
            color="error"
            icon="i-lucide-x-circle"
            variant="subtle"
            @click="$emit('on-cancel', appointmentDetail!)"
        >
          Annuler le rendez-vous
        </UButton>
      </div>
    </template>
  </USlideover>
</template>

<style scoped>

</style>
