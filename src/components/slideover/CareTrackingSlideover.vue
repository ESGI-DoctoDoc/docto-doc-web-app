<script lang="ts" setup>
import type {CareTracking, CareTrackingDetail} from '~/types/care-tracking';
import {careTrackingApi} from "~/services/care-tracking/care-tracking.api";

const isOpen = defineModel('open', {type: Boolean, required: true});
const props = defineProps<{ careTracking: CareTracking }>();
defineEmits(['on-close', 'on-update', 'on-end', 'on-delete']);

const {showError, handleError} = useNotify();
const {fetchCareTrackingById} = careTrackingApi();

const loading = ref(true);
const careTrackingDetail = ref<CareTrackingDetail>();

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
      <div v-else-if="careTracking" class="flex flex-col space-y-2">
        <div class="flex justify-between space-y-1">
          <div>Nom du suivi</div>
          <div class="cursor-pointer">
            {{ props.careTracking.name }}
          </div>
        </div>
        <div class="flex justify-between space-y-1">
          <div>Patient</div>
          <div class="cursor-pointer">
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
      </div>
    </template>
    <template #footer>
      <div class="fit flex flex-col space-y-2">
        <UButton block color="primary" @click="$emit('on-update', props.careTracking)">
          Modifier
        </UButton>
        <UButton block color="primary" variant="outline" @click="$emit('on-end', props.careTracking)">
          Ferme le suivi de dossier
        </UButton>
        <!--  todo handle admin       -->
        <UButton v-if="false" block color="error" @click="$emit('on-delete', props.careTracking)">
          Supprimer
        </UButton>
      </div>
    </template>
  </USlideover>
</template>

<style scoped>
</style>

