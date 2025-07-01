<script lang="ts" setup>

import {autocompleteApi} from "~/services/autocompleteApi/autocomplete.api";

const modelValue = defineModel('modelValue', {
  type: String,
  required: true,
})

const searchTerm = ref('')
const suggestions = ref<string[]>([])
const loading = ref(false)

const {fetchAddressAutocomplete} = autocompleteApi()

async function fetchAddresses(query: string) {
  loading.value = true
  suggestions.value = []
  try {
    const addresses = await fetchAddressAutocomplete({
      address: query,
    })
    suggestions.value = addresses.map((address) => address.formattedAddress)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

watch(searchTerm, (term) => {
  if (term.length >= 2) {
    fetchAddresses(term)
  } else {
    suggestions.value = []
  }
})
</script>

<template>
  <UFormField class="w-full text-left" label="Adresse de consultation" name="address" required>
    <UInputMenu
        v-model="modelValue"
        v-model:search-term="searchTerm"
        :ignore-filter="true"
        :items="suggestions"
        :loading="loading"
        class="w-full"
        name="address"
        placeholder="Saisir une adresse..."
        required
        size="md"
        type="text"
    />
  </UFormField>
</template>

<style scoped>

</style>