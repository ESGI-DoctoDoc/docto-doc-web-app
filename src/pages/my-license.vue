<script lang="ts" setup>

import {useNotify} from "~/composables/useNotify";
import {usePagination} from "~/composables/usePagination";
import {subscriptionApi} from "~/services/subscriptions/subscription.api";
import type {Subscription} from "~/types/subscription";
import LicensesTable from "~/components/table/LicensesTable.vue";

definePageMeta({
  layout: 'main-layout',
  title: 'Ma licence',
  role: 'doctor',
})

const {handleError, showError} = useNotify()
const {nextPage, resetPagination} = usePagination()
const {checkoutLicense, getSubscriptionInvoice, getSubscriptions} = subscriptionApi()

const isLoading = ref(true)
const mySubscriptions = ref<Subscription[]>([])

async function redirectToCheckout() {
  try {
    const response = await checkoutLicense();
    if (response.redirectUrl) {
      window.location.href = response.redirectUrl;
    }
  } catch (error) {
    handleError("Une erreur est survenue lors de la redirection vers le paiement.", error)
  }
}

async function onViewInvoice(subscription: Subscription) {
  if (mySubscriptions.value.length === 0) {
    showError("Aucune licence disponible pour afficher la facture.")
    return
  }

  try {
    const invoice = await getSubscriptionInvoice(subscription.id);
    if (invoice) {
      window.open(invoice.invoiceUrl, '_blank');
    } else {
      showError("Aucune facture disponible pour cette licence.")
    }
  } catch (error) {
    handleError("Erreur lors de la récupération de la facture.", error)
  }
}

async function getSubscriptionsList() {
  isLoading.value = true
  try {
    mySubscriptions.value = await getSubscriptions({
      page: 0,
      size: 15
    })
  } catch (error) {
    handleError('Erreur lors du chargement des licences', error)
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
    <LicensesTable
        :data="mySubscriptions"
        :loading="isLoading"
        @on-checkout="redirectToCheckout()"
        @on-view-invoice="onViewInvoice($event)"
        @on-load-more="onLoadMore"
    />
  </div>
</template>

<style scoped>

</style>