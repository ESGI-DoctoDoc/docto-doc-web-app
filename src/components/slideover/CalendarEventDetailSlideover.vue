<script lang="ts" setup>

import {slotApi} from "~/services/slots/slot.api";
import type {SlotDetail} from "~/types/slot";
import dayjs from 'dayjs';

const isOpen = defineModel('isOpen', {
  type: Boolean,
  default: false,
})

const props = defineProps<{
  slotId: string
}>()

const emit = defineEmits<{
  (e: 'on-close' | 'on-cancel'): void;
  (e: 'on-update', slotDetail: SlotDetail | undefined): void;
  (e: 'on-delete', formData: { allSlot: boolean, id: string }): void;
}>()


const {showPopupContinueModal, showUpdateOneOrAllSlot} = useModals();
const {showError} = useNotify()
const {getSlotById} = slotApi();

const loading = ref(false)
const isError = ref(false)
const slotDetail = ref<SlotDetail>()

async function fetchSlotDetails() {
  loading.value = true
  try {
    if (!props?.slotId) {
      showError('Aucun slot sélectionné', 'Veuillez sélectionner un slot pour afficher les détails.')
      return
    }
    slotDetail.value = await getSlotById(props!.slotId) as SlotDetail;
  } catch (error) {
    isError.value = true;
    if (error instanceof Error) {
      showError('Erreur lors de la récupération des détails du slot', error.message)
    } else {
      showError('Une erreur est survenue lors de la récupération des détails du slot.')
    }
  } finally {
    loading.value = false
  }

}

function formatDay(day: string): string {
  switch (day) {
    case 'monday':
      return 'Lundi';
    case 'tuesday':
      return 'Mardi';
    case 'wednesday':
      return 'Mercredi';
    case 'thursday':
      return 'Jeudi';
    case 'friday':
      return 'Vendredi';
    case 'saturday':
      return 'Samedi';
    case 'sunday':
      return 'Dimanche';
    default:
      return 'N/A';
  }
}

async function onConfirmDeleteSlot() {
  if (!slotDetail.value) {
    showError('Aucun slot sélectionné', 'Veuillez sélectionner un slot pour le supprimer.');
    return;
  }

  if (slotDetail.value.recurrence !== 'none') {
    const instance = showUpdateOneOrAllSlot("Voulez-vous supprimer cette plage d'ouverture pour tous les créneaux récurrents ?");
    const result = await instance.result;
    if (result?.cancel === true || !result) {
      emit('on-cancel');
      return;
    }

    if (result?.allSlot === true) {
      emit('on-delete', {allSlot: true, id: slotDetail.value.id});
    } else {
      emit('on-delete', {allSlot: false, id: slotDetail.value.id});
    }
  } else {
    const instance = showPopupContinueModal("Voulez-vous modifier cette plage d'ouverture ?");
    const result = await instance.result;
    if (result) {
      emit('on-delete', {allSlot: false, id: slotDetail.value.id});
    }
  }
}

onMounted(() => {
  fetchSlotDetails()
})

</script>

<template>
  <USlideover
      v-model:open="isOpen"
      aria-description="Détails du slot"
      class="max-w-lg"
      close
      @after:leave="$emit('on-close')"
  >
    <template #title>
      <h2 class="text-2xl font-medium">Détail du slot</h2>
    </template>
    <template #body>
      <div v-if="loading" class="flex flex-col space-y-4">
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

        <h2 class="pt-6 text-xl font-medium">Récurrence</h2>
        <AppDivider class="w-full pb-4 pt-2"/>
        <div class="flex justify-between">
          <USkeleton class="h-4 w-20"/>
          <USkeleton class="h-4 w-24"/>
        </div>
        <div class="flex justify-between">
          <USkeleton class="h-4 w-28"/>
          <USkeleton class="h-4 w-16"/>
        </div>
        <div class="flex justify-between">
          <USkeleton class="h-4 w-32"/>
          <USkeleton class="h-4 w-20"/>
        </div>

        <h2 class="pt-6 text-xl font-medium">Motifs de consultation</h2>
        <AppDivider class="w-full pb-4 pt-2"/>
        <div class="space-y-2">
          <div v-for="i in 3" :key="i" class="space-y-1 border border-gray-200 px-4 py-2 rounded-sm"
               style="background: #F1F5F9;">
            <USkeleton class="h-5 w-48"/>
            <USkeleton class="h-7 w-32"/>
          </div>
        </div>
      </div>

      <div v-else-if="slotDetail" class="flex flex-col space-y-2">
        <div class="flex justify-between">
          <div>Date</div>
          <div>{{ formatDay(slotDetail.day) }}</div>
        </div>
        <div class="flex justify-between">
          <div>Début</div>
          <div>{{ slotDetail.startHour }}</div>
        </div>
        <div class="flex justify-between">
          <div>Fin</div>
          <div>{{ slotDetail.endHour }}</div>
        </div>

        <h2 class="pt-6 text-xl font-medium">Récurrence</h2>
        <AppDivider class="w-full pb-4 pt-2"/>
        <div class="flex flex-col space-y-2">
          <div class="flex justify-between">
            <div>Récurrence</div>
            <div v-if="slotDetail.recurrence === 'none'">Aucune</div>
            <div v-else-if="slotDetail.recurrence === 'weekly'">Hebdomadaire</div>
            <div v-else-if="slotDetail.recurrence === 'monthly'">Mensuelle ({{ slotDetail.dayNumber }} du mois)</div>
          </div>
          <div v-if="slotDetail.recurrence !== 'none'" class="flex justify-between">
            <div>Date de début</div>
            <div>{{ dayjs(slotDetail.start).format('DD/MM/YYYY') }}</div>
          </div>
          <div v-if="slotDetail.recurrence !== 'none'" class="flex justify-between">
            <div>Date de fin</div>
            <div>{{ dayjs(slotDetail.end).format('DD/MM/YYYY') }}</div>
          </div>
        </div>

        <h2 class="pt-6 text-xl font-medium">Motifs de consultation</h2>
        <AppDivider class="w-full pb-4 pt-2"/>
        <div class="flex flex-col space-y-2">
          <div
              v-for="medicalConcern in slotDetail?.medicalConcerns" :key="medicalConcern.id"
              class="flex flex-col space-y-2 border-1 border-gray-200 px-4 py-2 rounded-sm bg-gray-50"
          >
            <div>{{ medicalConcern.name }}</div>
            <div class="text-sm text-gray-500">Durée : {{ medicalConcern.duration }} minutes</div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="fit flex flex-col space-y-2">
        <UButton
            :disabled="loading || isError"
            block
            class="w-full"
            variant="subtle"
            @click="$emit('on-update', slotDetail)"
        >
          Modifier
        </UButton>
        <UButton
            :disabled="loading || isError"
            block
            class="w-full"
            color="error"
            variant="subtle"
            @click="onConfirmDeleteSlot()"
        >
          Supprimer le slot
        </UButton>
      </div>
    </template>
  </USlideover>
</template>

<style scoped>

</style>