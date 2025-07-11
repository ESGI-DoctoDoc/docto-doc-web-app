<script lang="ts" setup>

import FormField from "~/components/inputs/base/FormField.vue";

defineProps<{
  message: string
}>()

const emit = defineEmits(['close'])

const reason = ref('')
const reasons = [
  {label: 'Raisons personnelles', value: 'Raisons personnelles'},
  {label: 'Problème de santé', value: 'Problème de santé'},
  {label: 'Le patient a souhaité annuler', value: 'Le patient a souhaité annuler'},
  {label: 'Autre', value: 'Autre'}
]

function confirm() {
  emit('close', {reason: reason.value})
}

function cancel() {
  emit('close', {reason: null})
}
</script>

<template>
  <UModal title="Souhaitez-vous annuler le rendez-vous ?" @close="cancel">
    <template #body>
      <div class="flex flex-col space-y-2.5">
        <FormField label="Raison de l'annulation" name="cancel-reason" required>
          <USelect v-model="reason" :items="reasons" class="w-full"/>
        </FormField>
        <div class="flex justify-center gap-4 mt-4">
          <UButton class="w-1/2" @click="cancel">Non</UButton>
          <UButton :disabled="!reason" class="w-1/2" color="error" @click="confirm">Oui</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>