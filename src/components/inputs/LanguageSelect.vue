<script lang="ts" setup>
import {ref} from 'vue';

import InputSelectMultipleBase from "~/components/inputs/base/InputSelectMultipleBase.vue";

const languages = [
  {id: 'french', name: 'Français'},
  {id: 'english', name: 'English'},
  {id: 'spanish', name: 'Español'},
  {id: 'german', name: 'Deutsch'},
];

const selectedLanguage = ref();
</script>

<template>
  <UFormField label="Langue(s) parlée(s)" required>
    <InputSelectMultipleBase
        v-model="selectedLanguage"
        :items="languages.map(s => ({
          label: s.name,
          value: s.id,
        }))"
        placeholder="Sélectionnez une ou plusieurs langues"
    />
  </UFormField>
</template>

<style scoped>

</style>