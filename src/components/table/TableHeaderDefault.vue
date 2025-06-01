<script lang="ts" setup>

defineProps<{
  search?: string
  searchable?: boolean
  buttonLabel?: string
}>()

defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'button-click'): void
}>()
</script>

<template>
  <div class="table-header-default py-3.5 overflow-x-auto">
    <UInput
        v-if="searchable"
        :model-value="search"
        class="max-w-lg w-1/3"
        placeholder="Rechercher..."
        @update:model-value="$emit('update:search', $event)"
    />
    <UButton
        v-if="buttonLabel"
        :label="buttonLabel"
        @click="$emit('button-click')"
    />
  </div>
</template>

<style scoped>
.table-header-default {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
</style>