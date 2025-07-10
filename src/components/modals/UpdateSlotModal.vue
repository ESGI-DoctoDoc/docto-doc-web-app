<script lang="ts" setup>

import type {FormErrorEvent, FormSubmitEvent} from "@nuxt/ui";
import DoctorMedicalConcernsSelect from "~/components/inputs/DoctorMedicalConcernsSelect.vue";
import {type UpdateSlotForm, updateSlotSchema} from "~/components/inputs/validators/slot-form.validator";
import type {SlotDetail} from "~/types/slot";
import FormField from "~/components/inputs/base/FormField.vue";

const props = defineProps<{
  slotDetail: SlotDetail;
}>();

const open = defineModel('open', {
  type: Boolean,
  default: true,
})

const emit = defineEmits<{
  (e: 'onSubmit', value: UpdateSlotForm): void;
  (e: 'onCancel'): void;
}>()

const {showError} = useNotify()

const form = ref<UpdateSlotForm>({
  startHour: props.slotDetail.startHour,
  endHour: props.slotDetail.endHour,
  medicalConcerns: props.slotDetail.medicalConcerns?.map(m => m.id) || [],
});


function onSubmit(form: FormSubmitEvent<UpdateSlotForm>) {
  console.log("form is accepted", form.data);
  emit('onSubmit', form.data);
}

function onError(event: FormErrorEvent) {
  console.log(event);
  showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire.');
}

</script>

<template>
  <UModal
      v-model:open="open"
      :ui="{
        body: 'min-h-auto max-h-[65vh] overflow-y-auto'
      }"
      close
      @after:leave="$emit('onCancel')"
  >
    <template #title>
      <h2 class="text-2xl font-medium">Modifier la plage d'ouverture</h2>
    </template>
    <template #body>
      <UForm
          id="create-absence-form"
          :schema="updateSlotSchema"
          :state="form"
          class="flex flex-col space-y-4"
          @error="onError"
          @submit="onSubmit"
      >
        <h3 class="text-lg font-semibold">Jour et heures de consultation</h3>

        <div class="w-full flex space-x-4">
          <!-- Heure de début -->
          <FormField class="w-1/2" label="Heure de début" name="startHour">
            <UInput
                v-model="form.startHour"
                class="w-full"
                placeholder="HH:mm"
                type="time"
            />
          </FormField>

          <!-- Heure de fin -->
          <FormField class="w-1/2" label="Heure de fin" name="endHour">
            <UInput
                v-model="form.endHour"
                class="w-full"
                placeholder="HH:mm"
                type="time"
            />
          </FormField>
        </div>

        <h3 class="text-lg font-semibold ">Motifs de consultation</h3>
        <!-- Motifs de consultation -->
        <DoctorMedicalConcernsSelect
            v-model:medical-concern="form.medicalConcerns"
            class="w-full"
            multiple
        />
      </UForm>
    </template>
    <template #footer>
      <UButton
          block
          form="create-absence-form"
          label="Enregistrer"
          type="submit"
      />
    </template>
  </UModal>
</template>

<style scoped>

</style>