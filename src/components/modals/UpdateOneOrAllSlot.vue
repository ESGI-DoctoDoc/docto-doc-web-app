<script lang="ts" setup>

defineProps<{
  message: string
}>()

const emit = defineEmits<{
  (e: 'close', value: { allSlot: boolean, cancel: boolean }): void;
}>()

function confirm() {
  emit('close', {allSlot: true, cancel: false})
}

function one() {
  emit('close', {allSlot: false, cancel: false})
}

function cancel() {
  emit('close', {allSlot: false, cancel: true})
}
</script>

<template>
  <UModal title="Confirmation" @close="cancel">
    <template #body>
      <div class="text-center space-y-4">
        <p>{{ message }}</p>
        <div class="flex justify-center gap-4">
          <UButton color="secondary" @click="one">Uniquement ce créneau</UButton>
          <UButton color="success" @click="confirm">Oui, tous les créneaux</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>