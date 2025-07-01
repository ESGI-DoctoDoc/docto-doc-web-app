<script lang="ts" setup>

const language = defineModel('language', {
  type: Array as PropType<string[]>,
  default: 'Français',
});

const languages = [
  {id: 'french', name: 'Français'},
  {id: 'english', name: 'Englais'},
  {id: 'spanish', name: 'Espagnol'},
  {id: 'german', name: 'Allemand'},
];

const items = languages.map(s => ({
  label: s.name,
  value: s.id,
}));

</script>

<template>
  <UFormField class="w-full" label="Langue(s) parlée(s)" name="languages" required>
    <USelect
        v-model="language"
        :items="items"
        class="w-full"
        placeholder="Sélectionnez une ou plusieurs langues"
        color="primary"
        multiple
        variant="outline"
    />
  </UFormField>
</template>

<style scoped>

</style>