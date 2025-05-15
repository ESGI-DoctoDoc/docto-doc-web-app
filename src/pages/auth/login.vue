<script lang="ts" setup>
import type {FormSubmitEvent} from '@nuxt/ui'
import {type LoginForm, loginSchema} from "~/components/inputs/validators/user-form.validator";
import {useAuthApi} from "~/services/auth/auth.api";
import EmailInput from "~/components/inputs/EmailInput.vue";
import PasswordInput from "~/components/inputs/PasswordInput.vue";
import AuthLayout from "~/layouts/AuthLayout.vue";
import AppDivider from "~/components/AppDivider.vue";
import {loginRequestSchema} from "~/services/auth/dto/login.dto";
import {useSession} from "~/composables/auth/useSession";

definePageMeta({
  middleware: 'auth-middleware',
})

const {login, isLoading} = useAuthApi()
const {token} = useSession()
const image = new URL('@/assets/images/doctor-and-patient.png', import.meta.url).href

const form = reactive<Partial<LoginForm>>({
  email: 'patient1@example.com',
  password: 'Abdcd76@'
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<LoginForm>) {
  try {
    const data = await login(loginRequestSchema.parse({
      identifier: event.data.email,
      password: event.data.password
    }));

    token.value = data.token;
    navigateTo('/')

    toast.add({title: 'Success', description: 'Login successful.', color: 'success'})
  } catch (e) {
    console.error(e)
    toast.add({title: 'Error', description: 'Login failed.', color: 'error'})
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
            <h1 class="text-2xl font-bold">Identifiez-vous</h1>
            <p class="pt-1 pb-6">Connectez-vous à votre compte.</p>

            <UForm :schema="loginSchema" :state="form" class="space-y-4" @submit.prevent="onSubmit">
              <EmailInput v-model="form.email"/>
              <PasswordInput v-model="form.password" forgot-password/>
              <UButton :loading="isLoading" block color="primary" type="submit">Se connecter</UButton>
            </UForm>

            <AppDivider title="ou"/>

            <div class="text-xs">
              <span class="pr-1">Vous n'avez pas de compte ?</span>
              <NuxtLink class="text-primary" to="/auth/register">Inscrivez-vous</NuxtLink>
            </div>
          </div>
        </div>

        <!-- Image     -->
        <div class="h-full w-1/2">
          <img :src="image" alt="patient" class="w-auto">
        </div>
      </div>
      <p class="text-center text-xs">En vous connectant, vous acceptez nos
        <NuxtLink class="text-primary" to="/terms">Conditions d'utilisation</NuxtLink>
        <span class="px-1">et notre</span>
        <NuxtLink class="text-primary" to="/privacy">Politique de confidentialité</NuxtLink>
        <span>.</span>
      </p>
    </div>
  </AuthLayout>
</template>