<script lang="ts" setup>

import InputDateBase from "~/components/inputs/base/InputDateBase.vue";

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const emit = defineEmits<{
  (e: 'onsubmit', value: unknown): void;
}>()

// const items = [
//   { label: 'Ne pas répéter', value: 'none' },
//   { label: 'Chaque jour', value: 'daily' },
//   { label: 'Chaque semaine', value: 'weekly' },
//   { label: 'Chaque mois', value: 'monthly' },
// ]

function onSubmit(form: unknown) {
  emit('onsubmit', form);
}

</script>

<template>
  <UModal
      v-model:open="open"
      :close="false"
  >
    <template #body>
      <div class="pt-4 flex justify-between w-full">
        <h2 class="text-2xl font-medium">Créer une absence</h2>
      </div>
      <AppDivider class="w-full pb-4 pt-2"/>

      <div class="flex flex-col space-y-4 w-full">
        <UForm :schema="schema" :state="" class="flex space-x-2" @submit.prevent="onSubmit">
          <UFormField class="w-1/2" label="Début" required>
            <InputDateBase/>
          </UFormField>
          <UFormField class="w-1/2" label="Fin" required>
            <InputDateBase/>
          </UFormField>
        </UForm>
        <UCheckbox label="Absence est pour la journée entière"/>

        <!--        <UFormField class="w-full" label="Répéter">
                  <URadioGroup :items="items"/>
                </UFormField>

                <UFormField label="Date de fin de répétition">
                  <InputDateBase/>
                </UFormField>-->

        <UFormField class="w-full" label="Description">
          <UTextarea
              class="w-full"
              placeholder="Entrez une description de l'absence"
          />
        </UFormField>

        <UButton block label="Ajouter un motif de consultation"/>

      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>