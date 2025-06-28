<script lang="ts" setup>

import {useAuthApi} from "~/services/auth/auth.api";

definePageMeta({
  layout: 'auth-layout',
})

const route = useRoute()
const {verifyEmail} = useAuthApi()
const {showSuccess, showError, handleError} = useNotify()

const image = new URL('@/assets/images/patient-pc.png', import.meta.url).href

const isLoading = ref(true)
const isError = ref(false)

async function retrieveUserId() {
  isLoading.value = true;

  try {
    const userId = (route.query?.userId || '') as string;
    if (!userId) {
      showError("Aucun identifiant utilisateur trouvé dans l'URL.");
      // navigateTo('/auth/login');
      return;
    }

    await verifyEmail(userId);
    showSuccess('Email vérifié avec succès.', 'Vous pouvez maintenant vous connecter.');
  } catch (error) {
    console.error(error)
    handleError("Erreur lors de la vérification de l'email.", error);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  retrieveUserId()
});

</script>

<template>
  <div class="flex flex-col gap-2 w-1/2">
    <div class="flex flex-row rounded-2xl border-2 border-gray-200 w-full overflow-hidden" style="min-width: 600px">
      <!-- Form     -->
      <div class="w-1/2 p-8 flex justify-center items-center bg-white">
        <div class="w-full text-center">
          <h1 class="text-2xl font-bold">Vérification de l'email</h1>
          <div v-if="isLoading" class="mt-4 flex justify-center">
            <span class="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-gray-700"></span>
          </div>
          <div v-else-if="isError" class="mt-4 text-red-600">
            Une erreur s'est produite lors de la vérification de l'email. Veuillez réessayer.
          </div>
          <div v-else class="mt-4 text-green-600">
            <div>
              Email vérifié avec succès. Vous pouvez maintenant vous connecter.
            </div>
            <div class="mt-4">
              <UButton block class="w-full" color="primary" to="/auth/login">
                Se connecter
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Image     -->
      <div class="h-full w-1/2">
        <img :src="image" alt="patient" class="w-auto">
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>