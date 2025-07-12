<script lang="ts" setup>
import {defineEmits, defineProps, ref} from 'vue'

const {showError, show} = useNotify()

type InputFileType = 'image/*' | 'application/pdf';

interface InputFileProps {
  types: InputFileType[]
  max?: number
  lazy?: boolean
}

interface InputFileEmits {
  (e: 'update:modelValue', value: string[]): void;
  (e: 'on-files-selected', files: File[]): void;
  (e: 'on-delete-file', id: string): void;
}

const uploadedFiles = defineModel('files', {
  type: Array as PropType<{ url: string; id: string; name?: string }[]>,
  required: true,
})

const props = defineProps<InputFileProps>()
const emits = defineEmits<InputFileEmits>()

const isHovering = ref(false)
const isLoading = ref(false)
const previewError = ref<boolean[]>([]);

const acceptedTypes = computed(() => {
  const allTypes = []
  if (props.types.includes('image/*')) {
    allTypes.push('image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp');
  }
  if (props.types.includes('application/pdf')) {
    allTypes.push('application/pdf');
  }
  return allTypes;
})

function handleClick() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = acceptedTypes.value.join(',');
  input.multiple = props.max !== 1;
  input.onchange = (event: Event) => {
    const files = (event.target as HTMLInputElement).files;
    handleMaxFiles(Array.from(files || []));
  };
  input.click();
}

function handleDrop(event: DragEvent) {
  isHovering.value = false;
  event.preventDefault();
  const files = event.dataTransfer?.files;
  const filteredFiles = Array.from(files || []).filter(file => acceptedTypes.value.includes(file.type));
  const ignoredFiles = Array.from(files || []).filter(file => !acceptedTypes.value.includes(file.type));
  if (ignoredFiles.length === files?.length) {
    showError('Type de fichier non autorisé', `Formats autorisés : ${acceptedTypes.value.map((type) => type.split('/')[1]).join(', ')}`);
    return;
  }

  if (ignoredFiles.length > 0) {
    show({
      color: 'warning',
      title: 'Fichiers ignorés',
      description: `Certains fichiers ont été ignorés car ils ne correspondent pas aux types autorisés : ${ignoredFiles.map(file => file.name).join(', ')}`,
      icon: 'i-lucide-alert-triangle',
    });
  }
  handleMaxFiles(filteredFiles);
}


async function handleMaxFiles(files: File[]) {
  const maxAllowed = props.max ?? Infinity;
  const remainingSlots = maxAllowed - uploadedFiles.value.length;

  if (remainingSlots <= 0) {
    showError('Limite atteinte', `Vous pouvez télécharger jusqu'à ${maxAllowed} fichier(s).`);
    return;
  }

  const filesToEmit = files.slice(0, remainingSlots).filter((file) => {
    const size = file.size / 1024 / 1024; // Convert to MB
    if (size > 5) {
      showError('Fichier trop volumineux', `Le fichier ${file.name} dépasse la taille maximale de 5 Mo.`);
      return false;
    }
    return true;
  });

  if (props.lazy) {
    await localUpload(filesToEmit)
  }

  if (files.length > remainingSlots) {
    show({
      color: 'warning',
      title: 'Trop de fichiers',
      description: `Seuls ${remainingSlots} fichier(s) ont été acceptés.`,
      icon: 'i-lucide-alert-triangle',
    });
  }

  emits('on-files-selected', filesToEmit);
}

async function localUpload(files: File[]) {
  const uploaded: { url: string; id: string; name?: string }[] = files.map((file) => {
    const url = URL.createObjectURL(file);
    const id = Math.random().toString(36).substring(2, 9);
    return {url, id, name: file.name};
  });

  if (uploaded.length === 0) {
    return;
  }

  uploadedFiles.value = uploaded;
}

async function removeFile(id: string) {
  emits('on-delete-file', id);
}
</script>

<template>
  <div
      :class="{ 'bg-gray-100': isHovering }"
      class="relative w-full h-24 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
      @click="handleClick"
      @drop="handleDrop"
      @dragover.prevent="isHovering = true"
      @dragleave.prevent="isHovering = false"
  >
    <UProgress v-if="isLoading" class="absolute top-0 left-0 w-full h-2 z-10" size="sm"/>
    <template v-if="uploadedFiles.length === 0">
      <div>
        <UIcon class="size-5" name="i-lucide-lightbulb"/>
      </div>
      <div>Uploader vos fichiers</div>
    </template>
    <template v-else>
      <div class="flex gap-2">
        <div v-for="(uploadedFile, index) in uploadedFiles" :key="index" class="flex items-center relative">
          <div class="absolute -top-0.5 right-0">
            <UButton color="error" icon="i-lucide-x" size="xs" @click.stop="removeFile(uploadedFile.id)"/>
          </div>
          <template v-if="!previewError[index]">
            <img
                :alt="'Preview ' + index"
                :src="uploadedFile.url"
                class="w-16 h-16 object-cover rounded-md"
                @error="previewError[index] = true"
            />
          </template>
          <template v-else>
            <div
                class="h-16 w-36 flex flex-col space-y-1.5 items-center justify-center bg-gray-200 rounded-md border border-gray-300">
              <UIcon
                  class="w-16 h-16 text-gray-500 text-xl"
                  name="i-lucide-file-text"
              />
              <small class="text-xs">
                {{
                  uploadedFile.name
                      ? uploadedFile.name.length > 22
                          ? uploadedFile.name.slice(0, 22) + '...'
                          : uploadedFile.name
                      : 'Fichier inconnu'
                }}
              </small>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>