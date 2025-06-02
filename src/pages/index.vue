<script setup lang="ts">
import {useSession} from "~/composables/auth/useSession";

const {getUser, logoutUser} = useSession()

onMounted(() => {
  const user = getUser();
  if (user?.role === 'admin') {
    navigateTo('/admin/dashboard')
  } else if (user?.role === 'doctor') {
    navigateTo('/my-calendar')
  } else {
    logoutUser();
  }
})

</script>

<template>
  <div>
  </div>
</template>

<style scoped>

</style>