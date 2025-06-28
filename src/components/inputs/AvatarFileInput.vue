<script lang="ts" setup>

import PictureInput from "~/components/inputs/PictureInput.vue";
import InputFileBase from "~/components/inputs/base/InputFileBase.vue";

const avatar = defineModel('avatar', {
  type: String,
  required: true,
});

const files = ref<string[]>([]);

watch(
    () => files.value,
    (newFiles) => {
      console.log("New files:", newFiles);
      if (newFiles && newFiles.length > 0) {
        avatar.value = newFiles[0];
      } else {
        avatar.value = '';
      }
    },
    {deep: true, immediate: true}
);

</script>

<template>
  <UFormField class="text-left" label="Votre photo de profil" name="profilePictureUrl" required>
    <UInput class="hidden"/>
    <div class="flex flex-row space-x-4 mt-3">
      <div class="w-auto flex justify-center items-center">
        <PictureInput v-model="avatar" class="w-20 h-20 border-gray-300 border-1"/>
      </div>
      <div class="w-5/6">
        <InputFileBase v-model:urls="files" :max="1" class="h-full"/>
      </div>
    </div>
  </UFormField>
</template>

<style scoped>

</style>