<script lang="ts" setup>

import type {Doctor, DoctorReporting} from "~/types/doctor";
import {doctorsApi} from "~/services/doctors/doctors.api";
import type {MedicalConcern} from "~/types/medical-concern";
import dayjs from "dayjs";
import FormField from "~/components/inputs/base/FormField.vue";

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const props = defineProps<{
  doctor: Doctor
}>()

const {showError, handleError} = useNotify()
const {fetchDoctorReporting, fetchDoctorMedicalConcerns} = doctorsApi()

const isLoading = ref(false)

const allReporting = ref<DoctorReporting[]>([])
const medicalConcerns = ref<MedicalConcern[]>([])

async function getDoctorReporting() {
  isLoading.value = true
  try {
    allReporting.value = await fetchDoctorReporting(props.doctor.id);
  } catch (error) {
    handleError('Erreur lors de la récupération du rapport du médecin', error)
  } finally {
    isLoading.value = false
  }
}

async function getMedicalConcerns() {
  isLoading.value = true
  try {
    medicalConcerns.value = await fetchDoctorMedicalConcerns(props.doctor.id);
  } catch (error) {
    handleError('Erreur lors de la récupération des motifs de consultation', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (props.doctor?.id) {
    getDoctorReporting();
    getMedicalConcerns();
  } else {
    showError('Aucun médecin sélectionné', 'Veuillez sélectionner un médecin pour afficher les détails.')
    navigateTo('/admin/doctors');
  }
})

const items = ref([
  {
    label: 'Profil',
    value: 'profil',
    icon: 'i-heroicons-user-circle',
    slot: 'profil' as const,
  },
  {
    label: 'Motifs de consultation',
    value: 'motifs',
    icon: 'i-heroicons-clipboard-document-list',
    slot: 'motifs' as const,
  },
  {
    label: 'Questions',
    value: 'questions',
    icon: 'i-heroicons-question-mark-circle',
    slot: 'questions' as const,
  },
  {
    label: 'Signalements',
    value: 'reporting',
    icon: 'i-heroicons-exclamation-circle-solid',
    slot: 'reporting' as const,
  },
])

</script>

<template>
  <UModal
      v-model:open="open"
      :ui="{
        body: 'min-h-[70vh] max-h-[70vh] overflow-y-auto',
        content: 'min-w-[90vh] max-w-[95vh]',
      }"
      aria-description="Vérification du médecin"
      close
      title="Vérification du médecin"
  >
    <template #body>
      <div class="space-y-6 text-sm text-gray-800">
        <UTabs :items="items" class="w-full" default-value="profil">
          <template #profil>
            <div v-if="doctor" class="w-full flex flex-col space-y-4 mt-4">
              <FormField class="w-full" label="Spécialité">
                <UInput :model-value="doctor?.speciality?.name" class="w-full" disabled/>
              </FormField>
              <div class="flex flex-row gap-4">
                <FormField class="w-1/2" label="Prénom">
                  <UInput :model-value="doctor.firstName" class="w-full" disabled/>
                </FormField>
                <FormField class="w-1/2" label="Nom">
                  <UInput :model-value="doctor.lastName" class="w-full" disabled/>
                </FormField>
              </div>
              <FormField label="Email">
                <UInput :model-value="doctor.email" class="w-full text-left" disabled/>
              </FormField>
              <FormField label="Adresse">
                <UInput :model-value="doctor?.address?.formatted" class="w-full text-left" disabled/>
              </FormField>
              <FormField label="Biographie">
                <UTextarea
                    :model-value="doctor.bio" :rows="4" class="w-full text-left"
                    placeholder="Parlez-nous de vous..."
                    disabled
                />
              </FormField>
            </div>
          </template>

          <template #motifs>
            <div>
              <UTable
                  :columns="[
                      { accessorKey: 'name', header: 'Motif' },
                      { accessorKey: 'duration', header: 'Durée'},
                      { accessorKey: 'price', header: 'Prix'},
                      { header: 'Questions', cell: ({ row }) => row.original.questions.length + ' question(s)' },
                  ]"
                  :data="medicalConcerns || []"
              />
            </div>
          </template>

          <template #questions>
            <div>
              <UTable
                  :columns="[
                  { accessorKey: 'motif', header: 'Motif de consultation' },
                  { header: 'Question', cell: ({ row }) => row.original.question.question },
                  { header: 'Options', cell: ({ row }) => row.original.question.options?.map(o => o.label)?.join(',') },
                ]"
                  :data="medicalConcerns.flatMap(m => m.questions.map(q => ({ motif: m.name, question: q }))) || []"
              />
            </div>
          </template>

          <template #reporting>
            <div>
              <UTable
                  :columns="[
                  { header: 'Nom', cell: ({row}) => row.original.reporter.firstName + ' ' + row.original.reporter.lastName },
                  { header: 'Email', cell: ({row}) => row.original.reporter.email },
                  { accessorKey: 'explanation', header: 'Raison' },
                  { header: 'Date', cell: ({row}) => dayjs(row.original.createdAt).format('DD/MM/YYYY') },
                ]"
                  :data="allReporting"
              />
            </div>
          </template>
        </UTabs>
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>