<script lang="ts" setup>
import AppDivider from "~/components/AppDivider.vue";
import EmailInput from "~/components/inputs/EmailInput.vue";
import PasswordInput from "~/components/inputs/PasswordInput.vue";
import AuthLayout from "~/layouts/AuthLayout.vue";
import PhoneInput from "~/components/inputs/PhoneInput.vue";
import {type RegisterForm, registerSchema} from "~/components/inputs/validators/user-form.validator";
import type {FormSubmitEvent} from "@nuxt/ui";
import {useAuthApi} from "~/services/auth/auth.api";

const {showSuccess, handleError} = useNotify()
const {translate} = useTranslate()
const {register, isLoading} = useAuthApi()

const form = reactive<Partial<RegisterForm>>({
  email: '',
  password: '',
  phone: '',
})

const image = new URL('@/assets/images/patient.png', import.meta.url).href

async function onSubmit(event: FormSubmitEvent<RegisterForm>) {
  const clientPhoneNumber = event.data.phone.replace(/[-. ]/g, '')
  const phoneNumber = clientPhoneNumber.replace(/^0/, '+33')
  try {
    await register({
      email: event.data.email,
      password: event.data.password,
      phoneNumber: phoneNumber,
    })

    navigateTo('/auth/login')

    showSuccess(
        translate('auth.register.success.title'),
        translate('auth.register.success.message')
    )
  } catch (error) {
    handleError("Erreur lors de l'inscription", error);
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
            <h1 class="text-2xl font-bold">{{ translate('auth.register.title') }}</h1>
            <p class="pt-1 pb-6">{{ translate('auth.register.description') }}</p>

            <UForm :schema="registerSchema" :state="form" class="space-y-4" @submit.prevent="onSubmit">
              <EmailInput v-model="form.email" class="text-left"/>
              <PasswordInput v-model="form.password" class="text-left"/>
              <PhoneInput v-model="form.phone" class="text-left"/>
              <UButton :loading="isLoading" block color="primary" type="submit">{{ translate('auth.register.button') }}</UButton>
            </UForm>

            <AppDivider :title="translate('common.or')"/>

            <div class="text-xs">
              <span class="pr-1">Vous avez déjà un compte ?</span>
              <NuxtLink class="text-primary" to="/auth/login">Se connecter</NuxtLink>
            </div>
          </div>
        </div>

        <!-- Image     -->
        <div class="hidden md:block h-full w-1/2">
          <img :src="image" alt="patient" class="w-auto">
        </div>
      </div>
      <p class="text-center text-xs mt-2 font-medium">{{ translate('auth.register.terms_prefix') }}
        <NuxtLink class="text-primary" to="/terms">{{ translate('common.terms') }}</NuxtLink>
        <span class="px-1">et notre</span>
        <NuxtLink class="text-primary" to="/privacy">{{ translate('common.privacy') }}</NuxtLink>
        <span>.</span>
      </p>
    </div>
  </AuthLayout>
</template>

<style scoped>

</style>