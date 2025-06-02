<script lang="ts" setup>

import InputFileBase from "~/components/inputs/base/InputFileBase.vue";
</script>

<template>
  <UFormField label="Carte d'identité" name="identityCard" required>
    <InputFileBase multiple preview/>
  </UFormField>
</template>

<style scoped>

</style>