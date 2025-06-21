<script lang="ts" setup>
import {defineEmits, defineProps, ref} from 'vue'

interface InputFileProps {
  maxHeightPreview?: number
  preview?: boolean
  multiple?: boolean
  max?: number
}

const modelValue = defineModel('urls', {
  type: Array as PropType<string[]>,
  required: true,
})
const props = defineProps<InputFileProps>()
const emit = defineEmits(['update:modelValue', 'uploaded'])

const isHovering = ref(false)
const urls = ref<string[]>([])

async function processFile(file: File) {
  if (urls.value.length >= (props.max ?? 2)) {
    alert(`Nombre maximal de fichiers atteint (${props.max})`);
    return;
  }
  // Example: process file and emit base64 preview
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:modelValue', e.target?.result)
    emit('uploaded', true)
  }
  reader.readAsDataURL(file)

  // Example: upload file and emit URL
  const url = await uploadFile(file);
  console.log('File uploaded:', url)
  console.log(modelValue.value)
  urls.value.push(url);
  modelValue.value.push(url);
}

async function uploadFile(file: File): Promise<string> {
  // const res = await MediaApi.uploadFile(file);
  // return res.url;
  console.log("file: ", file);
  return "https://fastly.picsum.photos/id/319/536/354.jpg?hmac=ZzEILWavlsP9MWDCsCqQp3fxsbmTD48rzZWY5c57IPU";
}

function handleClick() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = props.multiple;
  input.onchange = (event: Event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const remaining = (props.max ?? 2) - urls.value.length;
      if (remaining <= 0) {
        alert(`Nombre maximal de fichiers atteint (${props.max})`);
        return;
      }
      const selectedFiles = Array.from(files).slice(0, remaining);
      for (const file of selectedFiles) {
        processFile(file);
      }
    }
  };
  input.click();
}

function handleDrop(event: DragEvent) {
  isHovering.value = false;
  event.preventDefault();
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const remaining = (props.max ?? 2) - urls.value.length;
    if (remaining <= 0) {
      alert(`Nombre maximal de fichiers atteint (${props.max})`);
      return;
    }
    const droppedFiles = Array.from(files).slice(0, remaining);
    for (const file of droppedFiles) {
      processFile(file);
    }
  }
}

function removeFile(index: number) {
  urls.value.splice(index, 1)
  modelValue.value.splice(index, 1)
}
</script>

<template>
  <div
      :class="{ 'bg-gray-100': isHovering }"
      class="w-full h-24 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
      @click="handleClick"
      @drop="handleDrop"
      @dragover.prevent="isHovering = true"
      @dragleave.prevent="isHovering = false"
  >
    <template v-if="urls.length === 0">
      <div>
        <UIcon class="size-5" name="i-lucide-lightbulb"/>
      </div>
      <div>Uploader vos fichiers</div>
    </template>
    <template v-else>
      <div class="flex gap-2">
        <div v-for="(url, index) in urls" :key="index" class="flex items-center relative">
          <div class="absolute -top-0.5 right-0">
            <UButton color="error" icon="i-lucide-x" size="xs" @click.stop="removeFile(index)"/>
          </div>
          <img :alt="'Preview ' + index" :src="url" class="w-16 h-16 object-cover rounded-md"/>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>