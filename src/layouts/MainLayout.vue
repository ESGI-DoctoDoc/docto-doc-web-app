<script lang="ts" setup>
import {useRoute} from 'vue-router'
import {useSession} from "~/composables/auth/useSession";
import SidebarMenu from '~/components/SidebarMenu.vue'

const route = useRoute()
const {logoutUser, getUser} = useSession()

const image = new URL('@/assets/images/logo.png', import.meta.url).href
const userRole = getUser()?.role || 'doctor'

const pageTitle = computed(() => {
  return route.meta.title || route.name?.toString().replace('-', ' ') || 'Page'
})

</script>

<template>
  <div class="layout">
    <!-- Ligne du haut : Logo + NavBar -->
    <div class="top-row">
      <div class="logo-container">
        <img :src="image" alt="Logo" class="h-full object-contain"/>
      </div>
      <header class="navbar">
        <h1 class="text-2xl font-bold mt-2 ml-2">{{ pageTitle }}</h1>
        <div class="flex space-x-4 justify-center items-center">
          <UButton class="flex p-2.5 justify-center items-center rounded-xl text-black text-xl border-1 border-gray-200"
                   icon="i-heroicons-bell"
                   style="background: #F1F5F9"/>
          <UDropdownMenu
              :items="[
              { label: 'Paramètres', icon: 'i-heroicons-cog-6-tooth', to: '/settings' },
              { label: 'Se déconnecter', icon: 'i-heroicons-arrow-right-on-rectangle', onSelect: () => logoutUser(), }
            ]"
          >
            <div class="flex space-x-2 items-center py-1 pl-3 pr-1 rounded-lg border-1 border-gray-200"
                 style="background: #F1F5F9;">
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