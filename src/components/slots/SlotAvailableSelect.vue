<script lang="ts" setup>
import {slotApi} from '~/services/slots/slot.api';

const slot = defineModel('slot', {
  type: String as PropType<string>,
  default: '',
});

const medicalConcern = defineModel('medicalConcern', {
  type: String as PropType<string>,
  default: '',
});

const date = defineModel('date', {
  type: String as PropType<string>,
  default: '',
});

const {showError} = useNotify();
const {getSlotsAvailable} = slotApi();


const loading = ref(false);
const slots = ref<{ label: string; value: string, disabled: boolean }[]>([]);

async function fetchSlots() {
  loading.value = true;
  try {
    if (!date.value || !medicalConcern.value) {
      slots.value = [];
      return;
    }
    const availableSlots = await getSlotsAvailable({
      startDate: date.value,
      medicalConcernId: medicalConcern.value,
    });
    slots.value = availableSlots.map((slot) => ({
      label: slot.start,
      value: slot.start,
      disabled: slot.isBooked,
    }));
  } catch (error) {
    if (error instanceof Error) {
      showError("Erreur lors de la création de l'absence", error.message);
    } else {
      showError("Erreur inconnue lors de la création de l'absence");
    }
    slots.value = [];
  } finally {
    loading.value = false;
  }
}

watch(
    () => [date.value, medicalConcern.value],
    fetchSlots,
    {immediate: true}
);

</script>

<template>
  <UFormField label="Horaire disponible" required>
    <USelect
        v-model="slot"
        :disabled="loading || slots.length === 0"
        :items="slots"
        :loading="loading"
        :placeholder="slots.length === 0 ? 'Aucun horaire disponible' : 'Sélectionnez un horaire'"
        class="w-full"
    >
      <template #item="{ item }">
        <span :class="item.disabled ? 'line-through text-red-500' : ''">{{ item.label }}</span>
      </template>
    </USelect>
  </UFormField>
</template>

<style scoped>
</style>