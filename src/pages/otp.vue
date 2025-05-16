<script lang="ts" setup>

import AuthLayout from "~/layouts/AuthLayout.vue";
import OtpInput from "~/components/inputs/OtpInput.vue";
import {useAuthApi} from "~/services/auth/auth.api";
import {type OtpVerificationForm, otpVerificationSchema} from "~/components/inputs/validators/user-form.validator";
import type {FormSubmitEvent} from "@nuxt/ui";
import {useSession} from "~/composables/auth/useSession";

const toast = useToast()
const {verifyOtp, isLoading} = useAuthApi()
const {setToken, setHasCompletedOnboarding, setHasOtpValidated, logoutUser} = useSession()

const form = reactive<Partial<OtpVerificationForm>>({
  code: ['0', '0', '0', '0', '0', '0'],
})

async function onSubmit(event: FormSubmitEvent<OtpVerificationForm>) {
  try {
    console.log(event.data.code)
    const data = await verifyOtp(event.data.code);

    if (data) {
      setHasOtpValidated(true);
      setToken(data.token);
      setHasCompletedOnboarding(data.hasOnBoardingDone);
      toast.add({title: 'Success', description: 'OTP validated successfully.', color: 'success'})
      navigateTo('/')
    } else {
      toast.add({title: 'Error', description: 'Invalid OTP.', color: 'error'})
    }
  } catch (e) {
    console.error(e)
    toast.add({title: 'Error', description: 'Validation failed.', color: 'error'})
  }
}

</script>

<template>
  <AuthLayout>
    <div class="flex flex-col gap-2">
      <div class="flex flex-row rounded-2xl border-2 border-gray-200 w-full overflow-hidden" style="min-width: 600px">
        <div class="w-full text-center p-8 bg-white" style="">
          <div class="m-auto w-72">
            <h1 class="text-2xl font-bold">Vérification du compte</h1>
            <p class="pt-1 pb-6">Nous vous avons envoyé un SMS avec un code de vérification.</p>

            <UForm :schema="otpVerificationSchema" :state="form" class="space-y-4" @submit.prevent="onSubmit">
              <OtpInput v-model="form.code" />
              <UButton :loading="isLoading" block class="px-6" type="submit" color="primary">
                Vérifier le code
              </UButton>
            </UForm>

            <AppDivider title="ou"/>

            <div class="text-sm">
              <ULink class="text-primary" @click="logoutUser()">Se déconnecter</ULink>
              <span>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<style scoped>

</style>