<script setup lang="ts">
import { reactive } from 'vue'
import AuthLayout from '~/layouts/AuthLayout.vue'
import PasswordInput from '~/components/inputs/PasswordInput.vue'
import type {FormSubmitEvent} from "@nuxt/ui";
import {
  type ResetPasswordForm,
  resetPasswordSchema
} from '~/components/inputs/validators/user-form.validator'
import { useAuthApi } from '~/services/auth/auth.api'
import { useNotify } from '~/composables/useNotify'
import { useTranslate } from '~/composables/useTranslate'

const { updatePassword, isLoading } = useAuthApi()
const { showSuccess, showError } = useNotify()
const { translate } = useTranslate()
const route = useRoute()

const form = reactive<Partial<ResetPasswordForm>>({
  password: 'Abd1234@',
  passwordConfirm: 'Abd1234@'
})

async function onSubmit(event: FormSubmitEvent<ResetPasswordForm>) {
  try {
    await updatePassword({
      newPassword: event.data.password,
      token: route.query.token as string
    })

    showSuccess(
        translate('auth.reset_password.update.success.title'),
        translate('auth.reset_password.update.success.message')
    )
    navigateTo('/auth/login')
  } catch (e) {
    console.log(e)
    showError("Erreur", "Modification du mot de passe échouée.")
  }
}
</script>

<template>
  <AuthLayout>
    <div class="flex flex-col gap-2 w-1/2">
      <div class="flex flex-row rounded-2xl border-2 border-gray-200 w-full overflow-hidden" style="min-width: 600px">
        <!-- Form -->
        <div class="w-1/2 p-8 flex justify-center items-center bg-white">
          <div class="w-full text-center">
            <h1 class="text-2xl font-bold">{{ translate('auth.reset_password.update.title') }}</h1>
            <p class="pt-1 pb-6">{{ translate('auth.reset_password.update.description') }}</p>

            <UForm
                :schema="resetPasswordSchema"
                :state="form"
                class="space-y-4"
                @submit.prevent="onSubmit"
            >
              <PasswordInput
                  v-model="form.password"
                  :label="translate('auth.reset_password.update.new_password')"
              />
              <PasswordInput
                  v-model="form.passwordConfirm"
                  :label="translate('auth.reset_password.update.confirm_password')"
              />
              <UButton :loading="isLoading" block color="primary" type="submit">
                {{ translate('auth.reset_password.update.button') }}
              </UButton>
            </UForm>

            <div class="text-xs pt-4">
              <NuxtLink class="text-primary" to="/auth/login">
                {{ translate('auth.reset_password.update.login_link') }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Image -->
        <div class="h-full w-1/2">
          <img src="~/assets/images/patient-pc.png" alt="patient" class="w-auto" />
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<style scoped>
</style>