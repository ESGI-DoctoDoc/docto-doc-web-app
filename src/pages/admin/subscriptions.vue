<script lang="ts" setup>

import {useNotify} from "~/composables/useNotify";
import {usePagination} from "~/composables/usePagination";
import {subscriptionApi} from "~/services/subscriptions/subscription.api";
import type {Subscription} from "~/types/subscription";
import LicensesTable from "~/components/table/LicensesTable.vue";

definePageMeta({
  layout: 'main-layout',
  title: 'Tous les abonnements',
  role: 'admin',
})

const {handleError, showError} = useNotify()
const {nextPage, resetPagination} = usePagination()
const {getSubscriptionInvoice, getSubscriptions} = subscriptionApi()

const isLoading = ref(true)
const mySubscriptions = ref<Subscription[]>([])

async function onViewInvoice(subscription: Subscription) {
  if (mySubscriptions.value.length === 0) {
    showError("Aucune licence disponible pour afficher la facture.")
    return
  }

  isLoading.value = true
  try {
    const invoice = await getSubscriptionInvoice(subscription.id);
    if (invoice) {
      window.open(invoice.invoiceUrl, '_blank');
    } else {
      showError("Aucune facture disponible pour cette licence.")
    }
  } catch (error) {
    handleError("Erreur lors de la récupération de la facture.", error)
  } finally {
    isLoading.value = false
  }
}

async function getSubscriptionsList() {
  isLoading.value = true
  try {
    mySubscriptions.value = await getSubscriptions({
      page: 0,
      size: 10,
    })
  } catch (error) {
    handleError('Erreur lors du chargement des abonnements', error)
  } finally {
    isLoading.value = false
  }
}

async function onLoadMore(stopLoading: () => void) {
  isLoading.value = true
  try {
    const moreSubscriptions = await nextPage(getSubscriptions)
    mySubscriptions.value.push(...moreSubscriptions);
    stopLoading();
  } catch (error) {
    handleError('Erreur lors du chargement des licences supplémentaires', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  resetPagination()
  getSubscriptionsList()
})

</script>

<template>
  <div class="fit">
    <UProgress v-if="isLoading" class="absolute top-0 left-0 right-0 z-50" size="sm"/>
    <LicensesTable
        :data="mySubscriptions"
        :loading="isLoading"
        @on-view-invoice="onViewInvoice($event)"
        @on-load-more="onLoadMore"
    />
  </div>
</template>

<style scoped>

</style>