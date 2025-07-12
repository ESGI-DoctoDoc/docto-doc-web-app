<script setup lang="ts">
import {useSession} from "~/composables/auth/useSession";

const {getUser, logoutUser} = useSession()

onMounted(() => {
  const userAuth = getUser();
  if (userAuth?.user?.role === 'admin') {
    navigateTo('/admin/doctors')
  } else if (userAuth?.user?.role === 'doctor') {
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