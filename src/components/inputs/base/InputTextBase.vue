<script lang="ts" setup>

defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: "number" | "reset" | "submit" | "search" | "date" | "text" | "color" | "button" | "checkbox" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "password" | "radio" | "range" | "tel" | "time" | "url" | "week" | string & {}
  required?: boolean
  disabled?: boolean
  autocomplete?: string
  autofocus?: boolean
  variant?: 'outline' | 'soft' | 'subtle' | 'ghost' | 'none'
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
  maxLength?: number
}>()

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <UInput
      class="w-full"
      :model-value="modelValue"
      :placeholder="placeholder"
      :type="type || 'text'"
      :required="required"
      size="md"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :variant="variant"
      :color="color"
      :maxlength="maxLength"
      @update:model-value="emit('update:modelValue', $event)"
  />
</template>