<script lang="ts" setup>

import type {DoctorRecruitment} from "~/types/doctor";
import {doctorsApi} from "~/services/doctors/doctors.api";
import dayjs from "dayjs";

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const {handleError} = useNotify()
const {fetchDoctorRecruitments} = doctorsApi()

const isLoading = ref(false)

const recruitments = ref<DoctorRecruitment[]>([])

async function getDoctorRecruitments() {
  isLoading.value = true
  try {
    recruitments.value = await fetchDoctorRecruitments();
  } catch (error) {
    handleError('Erreur lors de la récupération du rapport du médecin', error)
    open.value = false;
  } finally {
    isLoading.value = false
  }
}


onMounted(() => {
  getDoctorRecruitments();
})

</script>

<template>
  <UModal
      v-model:open="open"
      :ui="{
        body: 'min-h-[70vh] max-h-[70vh] overflow-y-auto',
        content: 'min-w-[90vh] max-w-[95vh]',
      }"
      aria-description="Liste des recrutements de médecins"
      close
      title="Recrutements de médecins"
  >
    <template #body>
      <div class="space-y-6 text-sm text-gray-800">
        <UTable
            :columns="[
                { accessorKey: 'firstName', header: 'Prénom' },
                { accessorKey: 'lastName', header: 'Nom'},
                { header: 'Demandé le', cell: ({row}) => dayjs(row.original.createdAt).format('DD/MM/YYYY') },
            ]"
            :data="recruitments || []"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>