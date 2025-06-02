<script lang="ts" setup>
import {ref} from 'vue';

import InputSelectBase from "~/components/inputs/base/InputSelectBase.vue";

const specialities = [
  {id: 'cardiology', name: 'Cardiology'},
  {id: 'dermatology', name: 'Dermatology'},
  {id: 'neurology', name: 'Neurology'},
];

const selectedSpeciality = ref(specialities[0]);
</script>

<template>
  <UFormField label="Spécialité" required>
    <InputSelectBase
        v-model="selectedSpeciality"
        :items="specialities.map(s => ({
      label: s.name,
      value: s.id,
    }))"
        placeholder="Sélectionnez une spécialité"
    />
  </UFormField>
</template>

<style scoped>

</style>