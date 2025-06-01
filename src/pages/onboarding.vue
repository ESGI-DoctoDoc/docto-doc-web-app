<script lang="ts" setup>

import {type OnboardingForm, onboardingSchema} from "~/components/inputs/validators/user-form.validator";
import AuthLayout from "~/layouts/AuthLayout.vue";
import type {FormSubmitEvent} from "@nuxt/ui";
import {useSession} from "~/composables/auth/useSession";
import AvatarFileInput from "~/components/inputs/AvatarFileInput.vue";
import FirstNameInput from "~/components/inputs/FirstNameInput.vue";
import LastNameInput from "~/components/inputs/LastNameInput.vue";
import BirthDateInput from "~/components/inputs/BirthDateInput.vue";
import BioInput from "~/components/inputs/BioInput.vue";
import DoctorSpecialitySelect from "~/components/inputs/DoctorSpecialitySelect.vue";
import LanguageSelect from "~/components/inputs/LanguageSelect.vue";
import YearExperienceInput from "~/components/inputs/YearExperienceInput.vue";
import RPPSInput from "~/components/inputs/RPPSInput.vue";
import IdentityCardInput from "~/components/inputs/IdentityCardInput.vue";
import {useOnboardingApi} from "~/services/onboarding/onboarding.api";
import type {User} from "~/types/user";

const {logoutUser, hasCompletedOnboarding, setUser} = useSession()
const {translate} = useTranslate()
const {showSuccess, showError} = useNotify()
const {process, isLoading} = useOnboardingApi()

const image = new URL('@/assets/images/doctor-and-patient.png', import.meta.url).href
const form = reactive<Partial<OnboardingForm>>({
  rpps: '123456789011',
  speciality: 'Cardiology',
  experienceYears: 0,
  acceptPublicCoverage: false,
  firstName: '',
  lastName: '',
  birthDate: '',
  bio: '',
  profilePictureUrl: '',
  languages: ['', ''],
  doctorDocuments: ['', '']
})

const currentStep = ref(0)
const isOnWaiting = ref(false)
const isAccepted = ref(false)
const hasPaid = ref(false)

const steps = [
  {
    title: translate('onboarding.step1.title'),
    shortDescription: translate('onboarding.step1.shortDescription'),
    formTitle: translate('onboarding.step1.formTitle'),
    formSubtitle: translate('onboarding.step1.formSubtitle'),
  },
  {
    title: translate('onboarding.step2.title'),
    shortDescription: translate('onboarding.step2.shortDescription'),
    formTitle: translate('onboarding.step2.formTitle'),
    formSubtitle: translate('onboarding.step2.formSubtitle'),
  },
  {
    title: translate('onboarding.step3.title'),
    shortDescription: translate('onboarding.step3.shortDescription'),
    formTitle: translate('onboarding.step3.formTitle'),
    formSubtitle: translate('onboarding.step3.formSubtitle'),
  },
  {
    title: translate('onboarding.step4.title'),
    shortDescription: translate('onboarding.step4.shortDescription'),
    formTitle: translate('onboarding.step4.formTitle'),
    formSubtitle: translate('onboarding.step4.formSubtitle'),
  },
  {
    title: translate('onboarding.step5.title'),
    shortDescription: translate('onboarding.step5.shortDescription'),
    formTitle: translate('onboarding.step5.formTitle'),
    formSubtitle: translate('onboarding.step5.formSubtitle'),
  },
  {
    title: translate('onboarding.step6.title'),
    shortDescription: translate('onboarding.step6.shortDescription'),
    formTitle: translate('onboarding.step6.formTitle'),
    formSubtitle: translate('onboarding.step6.formSubtitle'),
  }
]

function goToDashboard() {
  const user: User = {
    userId: '00000000-0000-0000-0000-000000000001',
    firstname: 'Doctor',
    lastname: 'One',
    email: 'doctor1@example.com',
    phone: '+33100000001',
    hasOnBoardingDone: true,
    role: "doctor",
  };
  setUser(user)
}

onMounted(() => {
  if (hasCompletedOnboarding.value) {
    navigateTo('/')
  }
})

function redirectToStripeCheckout() {
  console.log("Redirecting to Stripe checkout...");
  hasPaid.value = true;
  currentStep.value = 7;
}

async function onSubmit(event: FormSubmitEvent<OnboardingForm>) {
  try {
    await process({
      rpps: event.data.rpps,
      speciality: event.data.speciality,
      experienceYears: event.data.experienceYears,
      acceptPublicCoverage: event.data.acceptPublicCoverage,
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      birthDate: event.data.birthDate,
      bio: event.data.bio,
      profilePictureUrl: event.data.profilePictureUrl,
      languages: event.data.languages,
      doctorDocuments: event.data.doctorDocuments,
    })
    showSuccess(
        translate('auth.login.success.title'),
        translate('auth.login.success.message')
    )
  } catch (e) {
    console.log(e)
    showError('Erreur', 'Onboarding échoué.')
  }
  isOnWaiting.value = true;
  currentStep.value = 3;

  setTimeout(() => {
    validateAccount();
  }, 2000)
}

function validateAccount() {
  console.log("Account validated");
  isAccepted.value = true;
  currentStep.value = 4;
}

</script>

<template>
  <AuthLayout>
    <div class="flex flex-col gap-2" style="width: 50vw; height: 68vh">
      <div
          class="flex flex-row rounded-2xl border-2 border-gray-200 w-full overflow-hidden h-full"
          style="min-width: 600px">
        <!-- Left forms     -->
        <div class="w-3/5 p-12 flex justify-center items-center bg-white">
          <div class="w-full h-full">
            <div class="h-2/6 text-center flex flex-col justify-center items-center">
              <h1 class="text-2xl font-bold">{{ steps[currentStep].formTitle }}</h1>
              <p class="pt-4 pb-8">{{ steps[currentStep].formSubtitle }}</p>
            </div>
            <div class="h-4/6">
              <UForm :schema="onboardingSchema" :state="form" @submit.prevent="onSubmit">
                <!-- Step 1           -->
                <div v-if="currentStep === 0" class="w-full text-center" style="">
                  <div class="space-y-4">
                    <AvatarFileInput/>
                    <div class="flex flex-row gap-6">
                      <FirstNameInput v-model="form.firstName" class="w-1/2"/>
                      <LastNameInput v-model="form.lastName" class="w-1/2"/>
                    </div>
                    <BirthDateInput v-model="form.birthDate"/>
                    <BioInput v-model="form.bio"/>
                  </div>
                </div>

                <!-- Step 2           -->
                <div v-if="currentStep === 1" class="w-full text-center" style="">
                  <div class="space-y-4">
                    <DoctorSpecialitySelect v-model="form.speciality"/>
                    <YearExperienceInput v-model="form.experienceYears"/>
                    <LanguageSelect v-model="form.languages"/>
                  </div>
                </div>

                <!-- Step 3           -->
                <div v-if="currentStep === 2" class="w-full text-center" style="">
                  <div class="space-y-4">
                    <RPPSInput v-model="form.rpps"/>
                    <IdentityCardInput v-model="form.doctorDocuments"/>
                    <UButton :loading="isLoading" block class="px-6" color="primary" type="submit"
                             @click="goToDashboard()">
                      {{ translate('onboarding.finalSubmit') }}
                    </UButton>
                  </div>
                </div>

                <!-- Step 4           -->
                <div v-if="currentStep === 3 && isOnWaiting">
                  <div class="space-y-4 text-gray-700 text-sm leading-6 text-left px-2">
                    <p>{{ translate('onboarding.step4.paragraph1') }}</p>
                    <p>{{ translate('onboarding.step4.paragraph2') }}</p>
                    <p v-html="translate('onboarding.step4.paragraph3')"></p>
                  </div>
                  <UButton v-if="isAccepted" :loading="isLoading" block class="mt-6 px-6" color="primary" @click="validateAccount">
                    {{ translate('onboarding.step4.buttonNext') }}
                  </UButton>
                  <UButton v-else block class="mt-6 px-6" color="primary" disabled loading>
                    {{ translate('onboarding.step4.buttonPending') }}
                  </UButton>
                </div>

                <!-- Step 5           -->
                <div v-if="currentStep === 4 && isAccepted">
                  <div class="space-y-4 text-gray-700 text-sm leading-6 text-left px-2">
                    <p>{{ translate('onboarding.step5.paragraph1') }}</p>
                    <p>{{ translate('onboarding.step5.paragraph2') }}</p>
                  </div>
                  <UButton :loading="isLoading" block class="mt-6 px-6" color="primary" @click="redirectToStripeCheckout">
                    {{ translate('onboarding.step5.button') }}
                  </UButton>
                </div>
              </UForm>
            </div>
          </div>
        </div>

        <!-- Image     -->
        <div v-if="isOnWaiting && !isAccepted || isAccepted" class="h-full w-1/2">
          <img :src="image" alt="patient" class="w-auto object-contain">
        </div>

        <!-- Steps     -->
        <div v-else class="overflow-y-scroll h-full w-2/5 border-l-2 border-l-gray-200 p-4 bg-white">
          <div v-if="!isOnWaiting && !isAccepted" class="flex flex-col gap-y-4">
            <div
                v-for="(step, index) in steps.slice(0, 3)" :key="index"
                :class="currentStep === index ? 'bg-primary-100' : 'bg-white'"
                class="flex flex-col border-2 border-gray-200 p-4 rounded-xl h-1/4"
                @click="currentStep = index"
            >
              <div class="font-semibold pb-2.5">{{ step.title }}</div>
              <div class="text-gray-600 text-sm" style="max-width: 180px">{{ step.shortDescription }}</div>
            </div>
          </div>
        </div>
      </div>
      <p class="text-center text-xs mt-2 font-medium">
        {{ translate('onboarding.logout.prefix') }}
        <NuxtLink class="text-primary" @click="logoutUser">{{ translate('onboarding.logout.action') }}</NuxtLink>
      </p>
    </div>
  </AuthLayout>
</template>

<style scoped>

</style>