<script setup lang="ts">
import {useSession} from "~/composables/auth/useSession";

definePageMeta({
  middleware: 'auth-middleware',
})

const {logout} = useSession()

</script>

<template>
  <div>
    <UButton @click="logout" color="primary" size="md" variant="solid">
      Se déconnecter
    </UButton>
  </div>
</template>

<style scoped>

</style>