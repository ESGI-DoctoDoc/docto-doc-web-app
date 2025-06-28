<script lang="ts" setup>

import AuthLayout from "~/layouts/AuthLayout.vue";
import OtpInput from "~/components/inputs/OtpInput.vue";
import {useAuthApi} from "~/services/auth/auth.api";
import {type OtpVerificationForm, otpVerificationSchema} from "~/components/inputs/validators/user-form.validator";
import type {FormSubmitEvent} from "@nuxt/ui";
import {useSession} from "~/composables/auth/useSession";
import AppDivider from "~/components/AppDivider.vue";

const {showSuccess, showError} = useNotify()
const {translate} = useTranslate()
const {verifyOtp, isLoading} = useAuthApi()
const {logoutUser, setDoubleAuth} = useSession()
const {setToken} = useSession()

const image = new URL('@/assets/images/patient-pc.png', import.meta.url).href
const form = reactive<Partial<OtpVerificationForm>>({
  code: ['0', '0', '0', '0', '0', '0'],
})

async function onSubmit(event: FormSubmitEvent<OtpVerificationForm>) {
  try {
    const data = await verifyOtp({
      doubleAuthCode: event.data.code.join(''),
    });
    setToken(data.token);
    setDoubleAuth(true)
    navigateTo('/')

    showSuccess(
        translate('auth.otp.success.title'),
        translate('auth.otp.success.message')
    )
  } catch (e) {
    console.error(e)
    showError('Erreur', 'Validation échouée.')
  }
}

</script>

<template>
  <AuthLayout>
    <div class="flex flex-col gap-2 w-full px-4 md:w-3/4 xl:w-dull mx-auto">
      <div
          class="flex flex-col md:flex-row rounded-2xl border-2 border-gray-200 w-full overflow-hidden max-w-4xl mx-auto">
        <!-- Form     -->
        <div class="w-full md:w-1/2 p-6 md:p-8 flex justify-center items-center bg-white">
          <div class="m-auto w-72">
            <h1 class="text-2xl font-bold">{{ translate('auth.otp.title') }}</h1>
            <p class="pt-1 pb-6">{{ translate('auth.otp.description') }}</p>

            <UForm :schema="otpVerificationSchema" :state="form" class="space-y-4" @submit.prevent="onSubmit">
              <OtpInput v-model="form.code"/>
              <UButton :loading="isLoading" block class="px-6" color="primary" type="submit">
                {{ translate('auth.otp.button') }}
              </UButton>
            </UForm>

            <AppDivider :title="translate('common.or')"/>

            <div class="text-sm text-center">
              <ULink class="text-primary" @click="logoutUser()">{{ translate('auth.logout.button') }}</ULink>
              <span>.</span>
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