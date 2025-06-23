<script lang="ts" setup>

import InputFileBase from "~/components/inputs/base/InputFileBase.vue";

const files = defineModel('files', {
  type: Array as () => string[],
  default: () => []
});

</script>

<template>
  <UFormField label="Carte d'identité" name="identityCard" required>
    <InputFileBase v-model:urls="files" multiple preview/>
  </UFormField>
</template>

<style scoped>

</style>