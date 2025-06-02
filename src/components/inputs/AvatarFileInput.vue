<script lang="ts" setup>

import PictureInput from "~/components/inputs/PictureInput.vue";
import InputFileBase from "~/components/inputs/base/InputFileBase.vue";
</script>

<template>
  <UFormField label="Votre photo de profil" name="avatar" required>
    <div class="flex flex-row gap-2 mt-3">
      <div class="w-auto">
        <PictureInput class="w-20 h-20"/>
      </div>
      <div class="w-5/6">
        <InputFileBase class="h-full"/>
      </div>
    </div>
  </UFormField>
</template>

<style scoped>

</style>