<script lang="ts" setup>


import type {Appointment} from "~/types/appointment";
import {useSession} from "~/composables/auth/useSession";
import {useClipboard} from "@vueuse/core";
import {appointmentApi} from "~/services/appointments/appointment.api";

const isOpen = defineModel('isOpen', {
  type: Boolean,
  default: false,
})

const props = defineProps<{
  appointment: Appointment
}>()

defineEmits(['on-close', 'on-update', 'on-delete'])


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

async function fetchAppointmentDetails() {
  loading.value = true
  try {
    if (!props?.appointment?.id) {
      showError('Aucun patient sélectionné', 'Veuillez sélectionner un patient pour afficher les détails.')
      return;
    }

    appointmentDetail.value = await fetchAppointmentById(props!.appointment.id);
  } catch (error) {
    if (error instanceof Error) {
      showError('Erreur lors de la récupération des détails du patient', error.message);
    } else {
      showError('Une erreur est survenue lors de la récupération des détails du patient.');
    }
  } finally {
    loading.value = false;
  }
}


onMounted(() => {
  const user = getUser()
  if (user) {
    permissions.value.canDelete = user.role === 'admin';
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
          <div>Date de naissance</div>
          <div class="cursor-pointer">
            {{ appointmentDetail.patient.birthdate }}
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
          <div>{{ appointmentDetail.startHour }} - {{ appointmentDetail.start }}</div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Statut</div>
          <div>{{ appointmentDetail.status }}</div>
        </div>
        <div v-if="appointmentDetail.doctorNotes" class="flex justify-between space-y-1">
          <div>Notes</div>
          <div>{{ appointmentDetail.doctorNotes }}</div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="fit flex flex-col space-y-2">
        <UButton v-if="!isEnded && !isCancelled" block color="primary" @click="$emit('on-update', appointmentDetail!)">
          Modifier
        </UButton>
        <UButton v-if="!isEnded && !isCancelled" block color="error" icon="i-lucide-x-circle" variant="subtle">
          Annuler le rendez-vous
        </UButton>
        <UButton v-if="permissions.canDelete" block color="error" @click="$emit('on-delete', appointmentDetail!)">
          Supprimer
        </UButton>
      </div>
    </template>
  </USlideover>
</template>

<style scoped>

</style>