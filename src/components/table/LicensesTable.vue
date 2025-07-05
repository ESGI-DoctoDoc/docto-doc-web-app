<script lang="ts" setup>

import {ref} from 'vue'
import type {TableColumn} from "@nuxt/ui";
import type {Subscription} from "~/types/subscription";
import dayjs from "dayjs";
import {subscriptionApi} from "~/services/subscriptions/subscription.api";
import {useSession} from "~/composables/auth/useSession";

defineProps<{
  data: Subscription[]
  loading: boolean
}>()

const emits = defineEmits(['onCheckout', 'onViewInvoice'])

const {handleError} = useNotify()
const {checkoutLicense} = subscriptionApi()
const {hasLicenseActive, getUser} = useSession()

const isAdmin = computed(() => getUser()?.user?.role === 'admin')
const showLicensePayment = computed(() => !(isAdmin.value || hasLicenseActive.value))

const bannerVisible = ref(showLicensePayment.value)
const checkoutLoading = ref(false)

const table = ref('table')
const columns: TableColumn<Subscription>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
  },
  {
    id: 'doctor',
    header: 'Docteur',
    accessorFn: (row) => row.doctor?.email,
    cell: ({row}) => {
      return row.original?.doctor?.email;
    },
  },
  {
    header: 'Nom',
    cell: () => 'Licence 1 an',
  },
  {
    header: 'Début',
    cell: ({row}) => dayjs(row.original.start).format('DD/MM/YYYY'),
  },
  {
    header: 'Fin',
    cell: ({row}) => dayjs(row.original.end).format('DD/MM/YYYY'),
  },
  {
    header: 'Prix',
    cell: ({row}) => row.original.amount === 0 ? 'Gratuit' : `${row.original.amount} €`,
  },
  {
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.original.status
      switch (status) {
        case 'active':
          return 'Active'
        case 'expired':
          return 'Expirée'
        case 'inactive':
          return 'Inactive'
        case 'payment_error':
          return 'Erreur de paiement'
        default:
          return 'Inconnu'
      }
    }
  },
  {
    id: 'actions',
    header: 'Actions',
  }
]

function getRowActions(subscription: Subscription) {
  return [
    {
      label: 'Télécharger la facture',
      icon: 'i-lucide-file-text',
      onClick: () => {
        emits('onViewInvoice', subscription)
      },
    },
  ]
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
</script>

<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <div
        v-if="bannerVisible"
        class="top-banner w-screen bg-yellow-200 text-yellow-800 flex items-center justify-between px-6 py-2 z-10 border-b border-b-gray-400 fixed top-0 left-0"
    >
      <p class="text-sm font-medium">
        Vous n'avez pas de licence active.
        <UButton
            :disabled="checkoutLoading"
            :loading="checkoutLoading"
            class="underline text-yellow-900 hover:text-yellow-700 ml-1"
            variant="ghost"
            @click="redirectToCheckout"
        >
          Cliquez ici pour l'obtenir.
        </UButton>
      </p>
    </div>

    <UTable
        ref="table"
        empty="Liste vide"
        :columns="columns"
        :data="data"
        :loading="loading"
        sticky
        style="height: calc(100vh - 15vh);"
    >
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
      <template #actions-cell="{ row }">
        <UDropdownMenu :items="getRowActions(row.original)">
          <UButton
              :disabled="loading"
              aria-label="Actions"
              color="neutral"
              icon="i-lucide-ellipsis-vertical"
              variant="ghost"
          />
        </UDropdownMenu>
      </template>
    </UTable>

    <div class="flex justify-end px-4 py-3.5 text-sm text-muted">
      Nombre d'éléments : {{ data.length }}
    </div>
  </div>
</template>

<style scoped>
</style>