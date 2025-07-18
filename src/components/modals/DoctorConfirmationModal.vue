<script lang="ts" setup>

import type {Doctor} from "~/types/doctor";
import dayjs from "dayjs";

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const props = defineProps<{
  doctor: Doctor
}>()

const emit = defineEmits<{
  (e: 'on-submit', type: 'validated' | 'refused'): void;
}>()

const {showError} = useNotify()
const {showPopupContinueModal} = useModals()

async function confirmRefused() {
  const instance = showPopupContinueModal("Souhaitez-vous vraiment refuser ce médecin ?");
  const result = await instance.result;
  if (result) {
    emit('on-submit', 'refused');
  }
}

function onCompareToDirectory() {
  if (!props.doctor?.rpps) {
    showError('RPPS manquant');
    return
  }
  const url = `https://annuaire.esante.gouv.fr/pp/detail/${props.doctor.rpps}`;
  window.open(url, '_blank');
}


</script>

<template>
  <UModal
      v-model:open="open"
      :ui="{
        body: 'min-h-auto max-h-[65vh] overflow-y-auto'
      }"
      aria-description="Vérification du médecin"
      close
      title="Vérification du médecin"
  >
    <template #body>
      <div class="space-y-6 text-sm text-gray-800">
        <!-- Informations personnelles -->
        <div v-if="doctor">
          <h3 class="text-base font-semibold mb-3 text-gray-900">Informations personnelles</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            <div><span class="font-medium">Nom :</span> {{ doctor?.lastName }}</div>
            <div><span class="font-medium">Prénom :</span> {{ doctor?.firstName }}</div>
            <div class="sm:col-span-2"><span class="font-medium">Email :</span> {{ doctor?.email }}</div>
            <div><span class="font-medium">Téléphone :</span> {{
                doctor?.phone?.replace(/^\+33/, '0')?.replace(/(\d{2})(?=\d)/g, '$1 ')
              }}
            </div>
            <div v-if="doctor?.birthdate"><span class="font-medium">Date de naissance :</span>
              {{ dayjs(doctor.birthdate).format('DD/MM/YYYY') }}
            </div>
          </div>
        </div>

        <!-- Informations professionnelles -->
        <div>
          <h3 class="text-base font-semibold mb-3 text-gray-900">Informations professionnelles</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            <div><span class="font-medium">Spécialité :</span> {{ doctor?.speciality?.name ?? 'Non renseignée' }}</div>
            <div><span class="font-medium">Ajouté le :</span> {{ new Date(doctor?.createdAt).toLocaleDateString() }}
            </div>
          </div>
        </div>

        <!-- Documents fournis -->
        <div>
          <h3 class="text-base font-semibold mb-3 text-gray-900">Documents fournis</h3>
          <DocumentsPreview v-if="doctor.files" :files="doctor.files"/>
          <div v-else class="text-gray-500">Aucun document fourni</div>
        </div>

        <UButton
            block
            label="Confirmer les informations sur l'annuaire"
            trailing-icon="ri:external-link-line"
            variant="subtle"
            @click="onCompareToDirectory()"
        />
      </div>
    </template>
    <template #footer>
      <div class="flex w-full space-x-2.5">
        <UButton
            block
            color="error"
            @click="confirmRefused"
        >
          Refuser le médecin
        </UButton>
        <UButton
            block
            @click="$emit('on-submit', 'validated')"
        >
          Valider le médecin
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>