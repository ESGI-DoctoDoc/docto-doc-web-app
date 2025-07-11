<script lang="ts" setup>
import {useRoute} from 'vue-router'
import {useSession} from "~/composables/auth/useSession";
import SidebarMenu from '~/components/SidebarMenu.vue'
import {subscriptionApi} from "~/services/subscriptions/subscription.api";
import SettingsModal from "~/components/modals/SettingsModal.vue";
import {doctorsApi} from "~/services/doctors/doctors.api";
import type {DoctorNotification} from "~/types/doctor-notification";
import dayjs from "dayjs";

const route = useRoute()
const router = useRouter()
const {handleError, showSuccess} = useNotify()
const {logoutUser, getUser, hasLicenseActive} = useSession()
const {checkoutLicense, checkoutLicenseConfirmation} = subscriptionApi();
const {fetchNotifications, markAsReadNotification} = doctorsApi()

const image = new URL('@/assets/images/logo.png', import.meta.url).href
const userRole = getUser()?.user?.role || 'doctor'
const isAdmin = computed(() => getUser()?.user?.role === 'admin')

const fullName = computed(() => {
  const user = getUser()
  return isAdmin.value ? 'Administrateur' : `${user?.doctor?.firstName || ''} ${user?.doctor?.lastName || ''}`
})

const avatarUrl = computed(() => {
  const user = getUser()
  return user?.doctor?.avatarUrl || ''
})

const pageTitle = computed(() => {
  return route.meta.title || route.name?.toString().replace('-', ' ') || 'Page'
})

const showLicensePayment = computed(() => {
  if (isAdmin.value) {
    return false; // Only show the banner for non-admin users
  }

  if (hasLicenseActive.value) {
    return false;
  }

  const localStorageKey = 'dismissLicenseBanner'
  const dismissBannerUntil = localStorage.getItem(localStorageKey) as string | null
  if (!dismissBannerUntil) {
    return true;
  }
  return new Date(dismissBannerUntil) < new Date();
})

const bannerVisible = ref(showLicensePayment.value)
const confirmingPayment = ref(false)
const confirmingPaymentError = ref(false)
const showSettingsModal = ref(false)

const checkoutLoading = ref(false)

const isMobile = ref(false)

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

  checkoutLoading.value = true

  try {
    const response = await checkoutLicense();
    if (response.redirectUrl) {
      window.location.href = response.redirectUrl;
    } else {
      checkoutLoading.value = false
    }
  } catch (error) {
    handleError("Une erreur est survenue lors de la redirection vers le paiement.", error)
    checkoutLoading.value = false
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

const allNotifications = ref<DoctorNotification[]>([])

const unreadNotifications = computed(() => {
  return allNotifications.value.filter(notification => notification.isRead === false)
})

const notificationFilter = ref<'all' | 'unread'>('unread')
const filteredNotifications = computed(() => {
  return notificationFilter.value === 'all'
      ? allNotifications.value
      : allNotifications.value.filter(n => !n.isRead)
})

async function getNotifications() {
  try {
    allNotifications.value = await fetchNotifications()
  } catch (error) {
    console.error(error)
    // handleError("Une erreur est survenue lors de la récupération des notifications.", error)
  }
}

async function markNotificationAsRead(notificationId: string) {
  try {
    await markAsReadNotification(notificationId)
    const notification = allNotifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
  } catch (error) {
    handleError("Une erreur est survenue lors de la mise à jour de la notification.", error)
  }
}

const intervalId = ref();
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

  // mobile detection
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024 // arbitrary breakpoint for desktop
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // fetch notifications every 5 minutes
  intervalId.value = setInterval(() => {
    getNotifications()
  }, 5 * 60 * 1000) // every 5 minutes

  // fetch notifications
  getNotifications()
})

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})
</script>

<template>
  <div class="layout relative">
    <div v-if="isMobile" class="fixed inset-0 z-50 flex items-center justify-center bg-white px-4 text-center">
      <div>
        <p class="text-lg font-semibold text-gray-800">
          Accédez à votre tableau de bord depuis un ordinateur.
        </p>
        <p class="text-sm text-gray-600 mt-2">
          Cette interface n'est pas disponible sur mobile.
        </p>
        <UButton
            block
            class="mt-4"
            label="Se déconnecter"
            @click="logoutUser"
        />
      </div>
    </div>
    <template v-else>
      <div
          v-if="bannerVisible && !confirmingPayment && !confirmingPaymentError"
          class="top-banner w-screen bg-yellow-200 text-yellow-800 flex items-center justify-between px-6 py-2 z-10 border-b border-b-gray-400 fixed top-0 left-0"
      >
        <p class="text-sm font-medium">
          Vous n'avez pas de licence active.
          <UButton
              :disabled="checkoutLoading"
              :loading="checkoutLoading"
              variant="ghost"
              class="underline text-yellow-900 hover:text-yellow-700 ml-1"
              @click="redirectToCheckout"
          >
            Cliquez ici pour l'obtenir.
          </UButton>
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
            <UPopover>
              <div class="relative">
                <UButton
                    class="flex p-2.5 justify-center items-center rounded-xl text-black text-xl border-1 border-gray-200"
                    icon="i-heroicons-bell"
                    style="background: #F1F5F9"
                    @click="getNotifications()"
                />
                <span
                    v-if="unreadNotifications.length > 0"
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ unreadNotifications.length }}
                </span>
              </div>
              <template #content>
                <div class="min-w-md p-4 max-w-md">
                  <h3 class="text-lg font-semibold mb-2">Notifications</h3>
                  <div class="flex space-x-2 mb-2">
                    <UButton
                        :variant="notificationFilter === 'unread' ? 'solid' : 'soft'"
                        size="xs"
                        @click="notificationFilter = 'unread'"
                    >
                      Non lues
                    </UButton>
                    <UButton
                        :variant="notificationFilter === 'all' ? 'solid' : 'soft'"
                        size="xs"
                        @click="notificationFilter = 'all'"
                    >
                      Toutes
                    </UButton>
                  </div>
                  <div v-if="filteredNotifications.length === 0" class="text-sm text-gray-500 pt-4 pb-2">
                    Pas de nouvelles notifications.
                  </div>
                  <ul v-else class="space-y-2 max-h-96 overflow-y-auto py-2">
                    <li
                        v-for="notification in filteredNotifications"
                        :key="notification.id"
                        class="flex justify-between items-center space-x-6 px-4 py-2 rounded-lg bg-gray-100 "
                    >
                      <div class="max-w-sm">
                        <small class="text-xs">{{ dayjs(notification.createdAt).format('DD/MM/YYYY HH:mm') }}</small>
                        <p class="font-medium">{{ notification.title }}</p>
                        <p v-if="notification.content" class="text-xs text-gray-600">{{ notification.content }}</p>
                        <div v-else class="text-gray-600">Pas de contenu</div>
                      </div>
                      <div v-if="notificationFilter === 'unread'">
                        <UButton
                            icon="i-heroicons-check"
                            variant="subtle"
                            @click="markNotificationAsRead(notification.id)"
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </template>
            </UPopover>
            <UDropdownMenu
                :items="[
                { label: 'Paramètres', icon: 'i-heroicons-cog-6-tooth', disabled: isAdmin, onSelect: () => showSettingsModal = true },
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
                    :src="avatarUrl"
                    class="border border-gray-300"
                />
                <span class="text-gray-700">{{ fullName }}</span>
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

      <SettingsModal
          v-if="showSettingsModal"
          v-model:open="showSettingsModal"
          @close="showSettingsModal = false"
      />
    </template>
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