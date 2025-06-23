<script lang="ts" setup>
import {useRoute} from 'vue-router'
import {useSession} from "~/composables/auth/useSession";
import SidebarMenu from '~/components/SidebarMenu.vue'
import {subscriptionApi} from "~/services/subscriptions/subscription.api";

const route = useRoute()
const router = useRouter()
const {handleError, showSuccess} = useNotify()
const {logoutUser, getUser, hasLicenseActive} = useSession()
const {checkoutLicense, checkoutLicenseConfirmation} = subscriptionApi();

const image = new URL('@/assets/images/logo.png', import.meta.url).href
const userRole = getUser()?.user?.role || 'doctor'

const pageTitle = computed(() => {
  return route.meta.title || route.name?.toString().replace('-', ' ') || 'Page'
})

const showLicensePayment = computed(() => {
  const localStorageKey = 'dismissLicenseBanner'
  const dismissBannerUntil = localStorage.getItem(localStorageKey) as string | null
  if (!dismissBannerUntil) {
    return true;
  }
  return !hasLicenseActive.value && new Date(dismissBannerUntil) < new Date();
})

const bannerVisible = ref(showLicensePayment.value)
const confirmingPayment = ref(false)
const confirmingPaymentError = ref(false)

function setDismissBanner() {
  const localStorageKey = 'dismissLicenseBanner'
  const dismissUntil = new Date()
  dismissUntil.setDate(dismissUntil.getDate() + 7)
  localStorage.setItem(localStorageKey, dismissUntil.toISOString())
  bannerVisible.value = false
}

async function redirectToCheckout() {
  if (hasLicenseActive.value) {
    return
  }

  try {
    const response = await checkoutLicense();
    if (response.redirectUrl) {
      window.location.href = response.redirectUrl;
    }
  } catch (error) {
    handleError("Une erreur est survenue lors de la redirection vers le paiement.", error)
  }
}

async function verifyPayment(paymentId: string) {
  try {
    await checkoutLicenseConfirmation(paymentId)
    setTimeout(() => {
      confirmingPayment.value = false
      localStorage.removeItem('dismissLicenseBanner')
      bannerVisible.value = false
      router.replace({
        query: {},
      })
      showSuccess('Votre licence a été activée avec succès !')
    }, 700)
  } catch (error) {
    handleError("Une erreur est survenue lors de la confirmation du paiement.", error)
    confirmingPayment.value = false
    confirmingPaymentError.value = true
  }
}

onMounted(() => {
  const paymentId = route.query['session_id']
  if (typeof paymentId === 'string') {
    const isSuccess = route.query['success'] === 'true'
    if (!isSuccess) {
      confirmingPaymentError.value = true
      setTimeout(() => {
        confirmingPaymentError.value = false
        router.replace({
          query: {},
        })
      }, 5000)
      return
    }
    confirmingPayment.value = true
    verifyPayment(paymentId)
  }
})
</script>

<template>
  <div class="layout relative">

    <div
        v-if="bannerVisible && !confirmingPayment && !confirmingPaymentError"
        class="top-banner w-screen bg-yellow-200 text-yellow-800 flex items-center justify-between px-6 py-2 z-10 border-b border-b-gray-400 fixed top-0 left-0"
    >
      <p class="text-sm font-medium">
        Vous n'avez pas de licence active.
        <a
            class="underline text-yellow-900 hover:text-yellow-700 ml-1"
            @click="redirectToCheckout"
        >
          Cliquez ici pour l'obtenir.
        </a>
      </p>
      <UButton class="text-yellow-700" icon="i-heroicons-x-mark" variant="ghost" @click="setDismissBanner()"/>
    </div>

    <div
        v-if="confirmingPayment"
        class="top-banner w-screen bg-blue-100 text-blue-800 flex items-center justify-between px-6 py-2 z-10 border-b border-b-gray-400 fixed top-0 left-0"
    >
      <p class="text-sm font-medium flex items-center gap-2">
        <UIcon class="animate-spin" name="i-heroicons-arrow-path"/>
        Confirmation de votre paiement en cours... Votre licence est en cours d’activation.
      </p>
    </div>
    <div
        v-if="confirmingPaymentError"
        class="top-banner w-screen bg-red-100 text-red-800 flex items-center justify-between px-6 py-2 z-10 border-b border-b-gray-400 fixed top-0 left-0"
    >
      <p class="text-sm font-medium flex items-center gap-2">
        <UIcon name="i-heroicons-x-mark"/>
        Vous avez annulé le paiement ou une erreur est survenue. Veuillez réessayer.
      </p>
    </div>

    <!-- Ligne du haut : Logo + NavBar -->
    <div class="top-row">
      <div class="logo-container">
        <img :src="image" alt="Logo" class="h-full object-contain">
      </div>
      <header class="navbar">
        <h1 class="text-2xl font-bold mt-2 ml-2">{{ pageTitle }}</h1>
        <div class="flex space-x-4 justify-center items-center">
          <UButton
              class="flex p-2.5 justify-center items-center rounded-xl text-black text-xl border-1 border-gray-200"
              icon="i-heroicons-bell"
              style="background: #F1F5F9"
          />
          <UDropdownMenu
              :items="[
              { label: 'Paramètres', icon: 'i-heroicons-cog-6-tooth', to: '/settings' },
              { label: 'Se déconnecter', icon: 'i-heroicons-arrow-right-on-rectangle', onSelect: () => logoutUser(), }
            ]"
          >
            <div
                class="flex space-x-2 items-center py-1 pl-3 pr-1 rounded-lg border-1 border-gray-200"
                style="background: #F1F5F9;"
            >
              <UAvatar
                  alt="User Avatar"
                  size="md"
                  src="https://i.pravatar.cc/150?img=3"
              />
              <span class="text-gray-700">John Doe</span>
              <UButton icon="i-heroicons-chevron-down" variant="ghost"/>
            </div>
          </UDropdownMenu>
        </div>
      </header>
    </div>

    <div class="bottom-row">
      <!-- Sidebar -->
      <aside class="sidebar">
        <SidebarMenu :role="userRole"/>
      </aside>

      <!-- Contenu -->
      <main class="page-content">
        <slot/>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.top-row {
  display: flex;
  height: 8vh;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.logo-container {
  padding: 0.9em;
  width: 220px;
  background: #F6F4F1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #ffffff;
}

.bottom-row {
  display: flex;
  flex: 1;
  height: calc(100vh - 8vh);
}

.sidebar {
  width: 220px;
  background-color: white;
  padding: 1rem;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
}

.page-content {
  overflow-y: auto;
  flex: 1;
  background: white;
}
</style>