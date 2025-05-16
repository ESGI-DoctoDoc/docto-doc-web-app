<script lang="ts" setup>
import AppDivider from "~/components/AppDivider.vue";
import EmailInput from "~/components/inputs/EmailInput.vue";
import PasswordInput from "~/components/inputs/PasswordInput.vue";
import AuthLayout from "~/layouts/AuthLayout.vue";
import PhoneInput from "~/components/inputs/PhoneInput.vue";
import {type RegisterForm, registerSchema} from "~/components/inputs/validators/user-form.validator";
import type {FormSubmitEvent} from "@nuxt/ui";

const form = reactive<Partial<RegisterForm>>({
  email: '',
  password: '',
  phone: '',
})

const image = new URL('@/assets/images/patient.png', import.meta.url).href

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<RegisterForm>) {
  toast.add({title: 'Success', description: 'The form has been submitted.', color: 'success'})
  console.log(event.data)
  try {
    const {email, password, phone} = event.data
    console.log(email, password, phone)
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
            <h1 class="text-2xl font-bold">Créer un compte</h1>
            <p class="pt-1 pb-6">Inscrivez-vous pour accéder à votre compte.</p>

            <UForm :schema="registerSchema" :state="form" class="space-y-4" @submit.prevent="onSubmit">
              <EmailInput v-model="form.email"/>
              <PasswordInput v-model="form.password"/>
              <PhoneInput v-model="form.phone" />
              <UButton block color="primary" type="submit">S'inscrire</UButton>
            </UForm>

            <AppDivider title="ou"/>

            <div class="text-xs">
              <span class="pr-1">Vous avez déjà un compte ?</span>
              <NuxtLink class="text-primary" to="/auth/login">Se connecter</NuxtLink>
            </div>
          </div>
        </div>

        <!-- Image     -->
        <div class="h-full w-1/2">
          <img :src="image" alt="patient" class="w-auto">
        </div>
      </div>
      <p class="text-center text-xs">En vous inscrivant, vous acceptez nos
        <NuxtLink class="text-primary" to="/terms">Conditions d'utilisation</NuxtLink>
        <span class="px-1">et notre</span>
        <NuxtLink class="text-primary" to="/privacy">Politique de confidentialité</NuxtLink>
        <span>.</span>
      </p>
    </div>
  </AuthLayout>
</template>

<style scoped>

</style>