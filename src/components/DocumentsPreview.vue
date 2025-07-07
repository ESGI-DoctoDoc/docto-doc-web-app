<script lang="ts" setup>
import VuePdfEmbed from 'vue-pdf-embed'
// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const props = defineProps<{
  files: string[] | { url: string, id: string }[];
}>()

type errorStep = 'image' | 'pdf' | 'unknown'
const previewError = ref<Record<number, errorStep>>({})
const fileLoaded = ref<Record<number, errorStep>>({})

onMounted(() => {
  setTimeout(() => {
    props.files.forEach((file, index) => {
      if (!fileLoaded.value[index]) {
        previewError.value[index] = 'unknown'
        fileLoaded.value[index] = 'unknown'
      }
    })
  }, 15000)
})

</script>

<template>
  <div v-if="files.length > 0" class="mt-2 grid grid-cols-2 gap-2">
    <div
        v-for="(file, fileIndex) in files"
        :key="fileIndex"
        class="border border-gray-300 rounded p-2 bg-white shadow-sm w-full"
        style="min-width: 230px; min-height: 180px; max-width: 230px; max-height: 180px; position: relative;"
    >
      <template v-if="!previewError[fileIndex]">
        <template v-if="typeof file === 'string'">
          <div
              v-if="!fileLoaded[fileIndex]"
              class="absolute inset-0 flex items-center justify-center bg-white/70 z-10"
          >
            <UIcon class="animate-spin text-gray-500 w-20 h-20" name="i-heroicons-arrow-path-20-solid" size="xl"/>
          </div>
          <img
              :alt="'Preview ' + fileIndex"
              :src="file"
              class="h-full min-w-36 object-cover rounded-md"
              @error="previewError[fileIndex] = 'image'"
              @load="fileLoaded[fileIndex] = 'image'"
          />
        </template>
        <template v-else>
          <div
              v-if="!previewError[fileIndex] && !fileLoaded[fileIndex]"
              class="absolute inset-0 flex items-center justify-center bg-white/70 z-10"
          >
            <UIcon class="animate-spin text-gray-500 w-5 h-5" name="i-heroicons-arrow-path-20-solid"/>
          </div>
          <img
              :alt="'Preview ' + fileIndex"
              :src="file.url"
              class="h-full min-w-36 object-cover rounded-md"
              @error="previewError[fileIndex] = 'image'"
              @load="fileLoaded[fileIndex] = 'image'"
          />
        </template>
      </template>
      <template v-else-if="previewError[fileIndex] === 'image'">
        <VuePdfEmbed
            v-if="typeof file === 'string'"
            :source="file"
            annotation-layer
            text-layer
            @error="previewError[fileIndex] = 'unknown'"
            @loaded="fileLoaded[fileIndex] = 'pdf'"
            @loading-failed="previewError[fileIndex] = 'unknown'"
            @rendering-failed="previewError[fileIndex] = 'unknown'"
        />
        <VuePdfEmbed v-else :source="file.url" annotation-layer text-layer
                     @loading-failed="previewError[fileIndex] = 'pdf'"/>
      </template>
      <template v-else-if="previewError[fileIndex] === 'unknown'">
        <div class="flex flex-col items-center justify-center h-full space-y-2">
          <UIcon class="text-red-500 w-10 h-10" name="i-heroicons-exclamation-triangle-20-solid" size="xl"/>
          <span class="text-sm text-red-500 text-center">Erreur de chargement...</span>
        </div>
      </template>
      <a
          v-if="fileLoaded[fileIndex] !== 'unknown'"
          :href="typeof file === 'string' ? file : file.url"
          class="absolute top-1 right-1 text-gray-500 bg-white hover:bg-green-200 rounded-full px-2 py-1 border border-gray-300"
          download
          target="_blank"
          title="Télécharger"
      >
        <UIcon class="w-5 h-5 flex justify-center items-center" name="i-heroicons-arrow-down-tray-20-solid"/>
      </a>
    </div>
  </div>
</template>

<style scoped>

</style>