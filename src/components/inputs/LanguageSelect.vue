<script lang="ts" setup>

import FormField from "~/components/inputs/base/FormField.vue";

const language = defineModel('language', {
  type: Array as PropType<string[]>,
  default: 'Français',
});

const languages = [
  {id: 'french', name: 'Français'},
  {id: 'english', name: 'Anglais'},
  {id: 'spanish', name: 'Espagnol'},
  {id: 'german', name: 'Allemand'},
];

const items = languages.map(s => ({
  label: s.name,
  value: s.id,
}));

</script>

<template>
  <FormField class="w-full" label="Langue(s) parlée(s)" name="languages" required>
    <USelect
        v-model="language"
        :items="items"
        class="w-full"
        placeholder="Sélectionnez une ou plusieurs langues"
        color="primary"
        multiple
        variant="outline"
    />
  </FormField>
</template>

<style scoped>

</style>