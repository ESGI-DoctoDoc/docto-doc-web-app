<script lang="ts" setup>
import type {FormSubmitEvent} from '@nuxt/ui'
import {type LoginForm, loginSchema} from "~/components/inputs/validators/user-form.validator";
import {useAuthApi} from "~/services/auth/auth.api";
import EmailInput from "~/components/inputs/EmailInput.vue";
import PasswordInput from "~/components/inputs/PasswordInput.vue";
import AuthLayout from "~/layouts/AuthLayout.vue";
import AppDivider from "~/components/AppDivider.vue";
import {useSession} from "~/composables/auth/useSession";

const {showSuccess, showError} = useNotify()
const {translate} = useTranslate()
const {login, isLoading} = useAuthApi()
const {setToken} = useSession()
const image = new URL('@/assets/images/doctor-and-patient.png', import.meta.url).href

const form = reactive<Partial<LoginForm>>({
  email: 'slimane.abdallah75@gmail.com',
  password: 'Abd1234#',
})

async function onSubmit(event: FormSubmitEvent<LoginForm>) {
  try {
    const data = await login({
      email: event.data.email,
      password: event.data.password
    })

    setToken(data.token);
    navigateTo('/')

    showSuccess(
        translate('auth.login.success.title'),
        translate('auth.login.success.message')
    )
  } catch (e) {
    console.error(e)
    showError('Erreur', 'Connexion échouée.')
  }
}
</script>

<template>
  <AuthLayout>
    <div class="flex flex-col gap-2 w-1/2">
      <div class="flex flex-row rounded-2xl border-2 border-gray-200 w-full overflow-hidden" style="min-width: 600px">
        <!-- Form     -->
        <div class="w-1/2 p-8 flex justify-center items-center bg-white">
          <div class="w-full text-center" style="">
            <h1 class="text-2xl font-bold">{{ translate('auth.login.title') }}</h1>
            <p class="pt-1 pb-6">{{ translate('auth.login.description') }}</p>

            <UForm :schema="loginSchema" :state="form" class="space-y-4" @submit.prevent="onSubmit">
              <EmailInput v-model="form.email"/>
              <PasswordInput v-model="form.password" forgot-password/>
              <UButton :loading="isLoading" block color="primary" type="submit">
                {{ translate('auth.login.button') }}
              </UButton>
            </UForm>

            <AppDivider :title="translate('common.or')"/>

            <div class="text-xs">
              <span class="pr-1">{{ translate('auth.login.no_account') }}</span>
              <NuxtLink class="text-primary" to="/auth/register">{{ translate('auth.login.register_link') }}</NuxtLink>
            </div>
          </div>
        </div>

        <!-- Image     -->
        <div class="h-full w-1/2">
          <img :src="image" alt="patient" class="w-auto">
        </div>
      </div>
      <p class="text-center text-xs mt-2 font-medium">
        {{ translate('auth.login.terms_prefix') }}
        <NuxtLink class="text-primary" to="/terms">{{ translate('common.terms') }}</NuxtLink>
        <span class="px-1">{{ translate('common.and') }}</span>
        <NuxtLink class="text-primary" to="/privacy">{{ translate('common.privacy') }}</NuxtLink>
        <span>.</span>
      </p>
    </div>
  </AuthLayout>
</template>
