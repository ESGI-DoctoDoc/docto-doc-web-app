<script setup lang="ts">
import {useSession} from "~/composables/auth/useSession";

const {logoutUser} = useSession()

</script>

<template>
  <div>
    <UButton color="primary" size="md" variant="solid" @click="logoutUser">
      Se déconnecter
    </UButton>
  </div>
</template>

<style scoped>

</style>