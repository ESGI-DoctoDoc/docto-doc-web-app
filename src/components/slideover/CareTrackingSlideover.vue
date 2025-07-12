<script lang="ts" setup>
import type {CareTracking, CareTrackingAppointment, CareTrackingDetail} from '~/types/care-tracking';
import {careTrackingApi} from "~/services/care-tracking/care-tracking.api";
import CareTrackingDocumentInputFile from "~/components/inputs/CareTrackingDocumentInputFile.vue";
import AppointmentListItem, {type AppointmentListItemType} from "~/components/appointments/AppointmentListItem.vue";
import {useSession} from "~/composables/auth/useSession";

const isOpen = defineModel('open', {type: Boolean, required: true});
const props = defineProps<{ careTracking: CareTracking, readonly?: boolean }>();
defineEmits(['on-close', 'on-update', 'on-end', 'on-delete', 'on-add-appointment']);

const {getUser} = useSession()
const {showError, handleError} = useNotify();
const {fetchCareTrackingById} = careTrackingApi();

const loading = ref(true);
const addDocumentModal = ref(false);
const careTrackingDetail = ref<CareTrackingDetail>();

const fileInput = ref<InstanceType<typeof CareTrackingDocumentInputFile>>();

const isOwner = computed(() => {
  const user = getUser();
  return props.careTracking?.owner?.id === user?.doctor?.id;
});
const isEnded = computed(() => {
  return !!careTrackingDetail.value?.closedAt;
});

async function getCareTrackingDetails() {
  loading.value = true;

  try {
    if (!props?.careTracking?.id) {
      showError('Aucun suivi de dossier sélectionné', 'Veuillez sélectionner un suivi de dossier pour afficher les détails.');
      return;
    }

    careTrackingDetail.value = await fetchCareTrackingById(props.careTracking.id);
  } catch (error) {
    handleError("Erreur lors de la récupération des détails du suivi de dossier", error);
  } finally {
    loading.value = false;
  }
}


onMounted(() => {
  getCareTrackingDetails();
})

function toAppointment(appointment: CareTrackingAppointment): AppointmentListItemType {
  return {
    id: appointment.id,
    date: appointment.date,
    start: appointment.start,
    status: appointment.status,
    startHour: appointment.startHour,
    endHour: appointment.endHour,
    patient: {
      id: careTrackingDetail.value!.patient?.id,
      firstname: careTrackingDetail.value!.patient.firstName,
      lastname: careTrackingDetail.value!.patient.lastName,
    },
  }
}

</script>

<template>
  <USlideover
      v-model:open="isOpen"
      aria-describedby="care-tracking-detail-description"
      aria-description="CareTracking Detail Slideover"
      class="max-w-lg"
      close
      @after:leave="$emit('on-close')"
  >
    <template #title>
      <h2 class="text-lg font-semibold">Détail du suivi de dossier</h2>
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
      <div v-else-if="careTrackingDetail" class="flex flex-col space-y-2">
        <div class="flex justify-between space-y-1">
          <div>Nom du suivi</div>
          <div class="cursor-pointer capitalize">
            {{ props.careTracking.name }}
          </div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Patient</div>
          <div class="cursor-pointer capitalize">
            {{ props.careTracking.patient.firstName }} {{ props.careTracking.patient.lastName }}
          </div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Email</div>
          <div class="cursor-pointer">
            {{ props.careTracking.patient.email }}
          </div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Téléphone</div>
          <div class="cursor-pointer">
            {{ props.careTracking.patient.phone }}
          </div>
        </div>

        <!-- Rendez-vous       -->
        <div class="flex justify-between items-baseline pt-6">
          <h3 class="text-lg font-semibold">Tous les rendez-vous</h3>
          <div v-if="!readonly && !isEnded">
            <UButton
                color="primary"
                label="Ajouter un rendez-vous"
                size="sm"
                variant="outline"
                @click="$emit('on-add-appointment', careTrackingDetail)"
            />
          </div>
        </div>
        <AppDivider class="w-full pb-4 pt-2"/>
        <div class="space-y-2">
          <div v-if="careTrackingDetail.appointments.length == 0">
            <div class="text-center text-gray-500">Pas de rendez-vous associés à ce suivi de dossier.</div>
          </div>
          <AppointmentListItem
              v-for="(appointment, index) in careTrackingDetail.appointments"
              v-else
              :key="index"
              :appointment="toAppointment(appointment)"
          />
        </div>

        <h3 class="text-lg font-semibold pt-6">Médecins associés</h3>
        <AppDivider class="w-full pb-4 pt-2"/>
        <div class="flex flex-col space-y-2">
          <div v-if="careTrackingDetail.doctors.length == 0">
            <div class="text-center text-gray-500">Aucun médecin associé à ce suivi de dossier.</div>
          </div>
          <div v-else>
            <ul class="list-disc pl-5">
              <li v-for="(doctor, index) in careTrackingDetail.doctors" :key="index">
                {{ doctor.firstName }} {{ doctor.lastName }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Documents       -->
        <div class="flex justify-between items-baseline pt-6">
          <h3 class="text-lg font-semibold">Documents</h3>
          <UModal v-model:open="addDocumentModal" close title="Ajouter des fichiers">
            <UButton v-if="!isEnded" color="primary" size="sm" variant="outline">
              Ajouter un fichier
            </UButton>
            <template #body>
              <CareTrackingDocumentInputFile
                  ref="fileInput"
                  :care-tracking-id="careTrackingDetail.id"
                  @uploaded="(files) => {
                  if(careTrackingDetail) {
                    (careTrackingDetail.files ?? []).push(...files.map(file => file.url))
                  }
                  addDocumentModal = false;
                }"
              />
            </template>
          </UModal>
        </div>
        <AppDivider class="w-full pb-4 pt-2"/>
        <DocumentsPreview v-if="careTrackingDetail.files" :files="careTrackingDetail.files" last-view-all/>
      </div>
    </template>
    <template #footer>
      <template v-if="isOwner">
        <div v-if="!readonly" class="fit flex flex-col space-y-2">
          <UButton block color="primary" @click="$emit('on-update', props.careTracking)">
            Modifier
          </UButton>
          <UButton
              v-if="!careTrackingDetail?.closedAt"
              block
              color="primary"
              variant="outline"
              @click="$emit('on-end', props.careTracking)"
          >
            Fermer le suivi de dossier
          </UButton>
        </div>
      </template>
    </template>
  </USlideover>
</template>

<style scoped>
</style>

