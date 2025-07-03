<script lang="ts" setup>
import {onMounted, ref} from 'vue';

const props = defineProps<{
  fileUrl: string;
}>();

const open = ref(true);
const loading = ref(true);
const error = ref(false);
const contentType = ref<string | null>(null);

async function detectContentType(url: string) {
  try {
    const response = await fetch(url, {method: 'HEAD'});
    if (!response.ok) throw new Error('Failed to fetch headers');
    const ct = response.headers.get('Content-Type');
    return ct;
  } catch (e) {
    console.error(e);
    return null;
  }
}

onMounted(async () => {
  if (!props.fileUrl) {
    error.value = true;
    loading.value = false;
    return;
  }
  const ct = await detectContentType(props.fileUrl);
  if (!ct) {
    error.value = true;
  } else {
    contentType.value = ct;
  }
  loading.value = false;
});
</script>

<template>
  <UModal v-model:open="open" size="lg" title="Aperçu du document">
    <template #body>
      <div v-if="loading">Chargement...</div>
      <div v-else-if="error">Impossible de charger le document.</div>
      <div v-else>
        <img
            v-if="contentType && contentType.startsWith('image/')"
            :src="props.fileUrl"
            alt="Preview image"
            style="max-width: 100%; max-height: 80vh; object-fit: contain;"
        />
        <iframe
            v-else-if="contentType === 'application/pdf'"
            :src="props.fileUrl"
            frameborder="0"
            style="width: 100%; height: 80vh; border: none;"
        ></iframe>
        <p v-else>Format non supporté pour l'aperçu.</p>
      </div>
    </template>
  </UModal>
</template>