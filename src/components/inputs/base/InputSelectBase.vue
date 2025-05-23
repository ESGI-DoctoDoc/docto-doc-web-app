<script lang="ts" setup>
export interface InputSelectItem {
  label: string;
  value: string;
  description?: string;
}

const props = defineProps<{
  modelValue: InputSelectItem;
  items: InputSelectItem[];
  placeholder?: string;
}>();

defineEmits<{
  (e: 'onChange', item: InputSelectItem): void;
  (e: 'update:modelValue', value: string): void;
}>();

const localValue = ref(props.modelValue);

</script>

<template>
  <USelectMenu
      v-model="localValue"
      :items="props.items"
      :placeholder="props.placeholder"
      class="w-full"
      option-attribute="label"
      value-attribute="value"
  >
    <template #item-label="{ item }">
      <div class="font-medium">{{ item.label }}</div>
    </template>
    <template #item-trailing="{ item }">
      <div class="text-sm text-gray-500">{{ item.description }}</div>
    </template>
  </USelectMenu>
</template>
