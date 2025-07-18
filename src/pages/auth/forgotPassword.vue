<script setup lang="ts">

import AuthLayout from "~/layouts/AuthLayout.vue";
import EmailInput from "~/components/inputs/EmailInput.vue";
import type {FormSubmitEvent} from "@nuxt/ui";
import {type ForgotPasswordForm, forgotPasswordSchema} from "~/components/inputs/validators/user-form.validator";
import {useAuthApi} from "~/services/auth/auth.api";

const {showSuccess, handleError} = useNotify()
const {translate} = useTranslate()
const {requestResetPassword, isLoading} = useAuthApi()
const image = new URL('@/assets/images/patient-pc.png', import.meta.url).href

const form = reactive<Partial<ForgotPasswordForm>>({
  email: '',
})

async function onSubmit(event: FormSubmitEvent<ForgotPasswordForm>) {

  try {
    await requestResetPassword({
      email: event.data.email,
    })

    showSuccess(
        translate('auth.reset_password.request.success.title'),
        translate('auth.reset_password.request.success.message')
    )
  } catch (error) {
    handleError('Erreur lors de la demande de réinitialisation du mot de passe', error);
  }
}

</script>

<template>
  <AuthLayout>
    <div class="flex flex-col gap-2 w-full px-4 md:w-3/4 xl:w-1/2 mx-auto">
      <div
          class="flex flex-col md:flex-row rounded-2xl border-2 border-gray-200 w-full overflow-hidden max-w-4xl mx-auto">
        <!-- Form     -->
        <div class="w-full md:w-1/2 p-6 md:p-8 flex justify-center items-center bg-white">
          <div class="w-full text-center" style="">
            <h1 class="text-2xl font-bold">{{ translate('auth.reset_password.request.title') }}</h1>
            <p class="pt-1 pb-6">{{ translate('auth.reset_password.request.description') }}</p>

            <UForm :schema="forgotPasswordSchema" :state="form" class="space-y-4" @submit.prevent="onSubmit">
              <EmailInput v-model="form.email"/>
              <UButton :loading="isLoading" block color="primary" type="submit">{{ translate('auth.reset_password.request.button') }}</UButton>
            </UForm>

            <AppDivider title="ou"/>

            <div class="text-xs">
              <span class="pr-1">{{ translate('auth.reset_password.request.account_exist') }}</span>
              <NuxtLink class="text-primary" to="/auth/login">{{ translate('auth.reset_password.request.login_link') }}</NuxtLink>
            </div>
          </div>
        </div>

        <!-- Image     -->
        <div class="hidden md:block h-full w-1/2">
          <img :src="image" alt="patient" class="w-auto">
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<style scoped>

</style>