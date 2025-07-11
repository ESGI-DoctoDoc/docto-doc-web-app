<script lang="ts" setup>

import {type OnboardingForm1, onboardingSchema1} from "~/components/inputs/validators/user-form.validator";
import type {FormErrorEvent, FormSubmitEvent} from "@nuxt/ui";
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
import {onMounted, reactive, ref} from 'vue';
import AddressInput from "~/components/inputs/AddressInput.vue";

definePageMeta({
  layout: 'auth-layout',
})

const {logoutUser, getUser} = useSession()
const {translate} = useTranslate()
const {showSuccess, showError} = useNotify()
const {process, isLoading} = useOnboardingApi()

const image = new URL('@/assets/images/doctor-and-patient.png', import.meta.url).href
const form = reactive<OnboardingForm1>({
  rpps: '10000668540',
  speciality: '',
  experienceYears: 0,
  gender: 'FEMALE',
  acceptPublicCoverage: false,
  firstName: '',
  lastName: '',
  birthDate: '',
  bio: '',
  profilePictureUrl: '',
  address: '',
  languages: [],
  doctorDocuments: []
})

const fileCache = reactive(new Map<string, string>())

const currentStep = ref(0)
const isOnWaiting = ref(false)
const isAccepted = ref(false)

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

const isMobile = ref(false)
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)

  const user = getUser();
  if (user?.doctor?.isVerified) {
    navigateTo('/');
  } else if (user?.doctor?.isOnboardingCompleted) {
    isOnWaiting.value = true;
    currentStep.value = 3;
  }
})

async function onSubmit(event: FormSubmitEvent<OnboardingForm1>) {
  try {
    await process({
      rpps: event.data.rpps,
      speciality: event.data.speciality,
      experienceYears: event.data.experienceYears,
      acceptPublicCoverage: event.data.acceptPublicCoverage,
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      gender: event.data.gender,
      birthDate: event.data.birthDate,
      bio: event.data.bio,
      profilePictureUrl: event.data.profilePictureUrl,
      languages: event.data.languages,
      doctorDocuments: event.data.doctorDocuments,
      address: event.data.address
    })
    showSuccess(
        translate('auth.login.success.title'),
        translate('auth.login.success.message')
    )
    isOnWaiting.value = true;
    currentStep.value = 3;
  } catch (e) {
    console.log(e)
    showError('Erreur', 'Onboarding échoué.')
  }
}

function onError(event: FormErrorEvent) {
  console.log(event);
  showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire.');
}

</script>

<template>
  <div v-if="isMobile" class="fixed inset-0 z-50 flex items-center justify-center bg-white px-4 text-center">
    <div>
      <p class="text-lg font-semibold text-gray-800">
        Accédez à votre tableau de bord depuis un ordinateur.
      </p>
      <p class="text-sm text-gray-600 mt-2">
        Cette interface n'est pas disponible sur mobile.
      </p>
      <UButton
          block
          class="mt-4"
          label="Se déconnecter"
          @click="logoutUser"
      />
    </div>
  </div>
  <div v-else class="flex flex-col gap-2 max-w-4xl min-w-xs" style="height: 68vh">
    <div
        class="flex flex-row rounded-2xl border-2 border-gray-200 w-full overflow-hidden h-full"
        style="min-width: 600px">
      <!-- Left forms     -->
      <div class="w-3/5 p-12 flex justify-center items-center bg-white overflow-y-scroll py-4">
        <div class="w-full h-full">
          <div class="text-center flex flex-col justify-center items-center">
            <h1 class="text-2xl font-bold">{{ steps[currentStep].formTitle }}</h1>
            <p class="pt-4 pb-8">{{ steps[currentStep].formSubtitle }}</p>
          </div>
          <UForm id="form" :schema="onboardingSchema1" :state="form" @error="onError" @submit.prevent="onSubmit">
            <!-- Step 1           -->
            <div v-show="currentStep === 0" class="w-full text-center" style="">
              <div class="flex flex-col justify-start space-y-4">
                <AvatarFileInput v-model:avatar="form.profilePictureUrl" name="profilePictureUrl"/>
                <div class="flex flex-row gap-4">
                  <FirstNameInput v-model="form.firstName" class="w-1/2 text-left"/>
                  <LastNameInput v-model="form.lastName" class="w-1/2 text-left"/>
                </div>
                <BirthDateInput v-model="form.birthDate" class="text-left"/>
                <URadioGroup
                    v-model="form.gender"
                    :items="[{label: 'Femme', value: 'FEMALE'}, {label: 'Homme', value: 'MALE'}]"
                    orientation="horizontal"
                />
              </div>
            </div>

            <!-- Step 2           -->
            <div v-show="currentStep === 1" class="w-full text-center" style="">
              <div class="space-y-4">
                <div class="flex space-x-2 items-center">
                  <div class="w-3/5 flex flex-col">
                    <DoctorSpecialitySelect v-model:speciality="form.speciality" class="text-left"/>
                  </div>
                  <div class="w-2/5 flex flex-col">
                    <YearExperienceInput v-model="form.experienceYears" class="text-left"/>
                  </div>
                </div>
                <AddressInput v-model="form.address" class="mb-4"/>
                <LanguageSelect v-model:language="form.languages"/>
                <BioInput v-model="form.bio"/>
              </div>
            </div>

            <!-- Step 3           -->
            <div v-show="currentStep === 2" class="w-full text-center" style="">
              <div class="space-y-4">
                <RPPSInput v-model="form.rpps"/>
                <IdentityCardInput v-model:files="form.doctorDocuments"/>
              </div>
            </div>

            <!-- Step 4           -->
            <div v-if="currentStep === 3 && isOnWaiting">
              <div class="space-y-4 text-gray-700 text-sm leading-6 text-left px-2">
                <p>{{ translate('onboarding.step4.paragraph1') }}</p>
                <p>{{ translate('onboarding.step4.paragraph2') }}</p>
                <p v-html="translate('onboarding.step4.paragraph3')"></p>
              </div>
              <UButton v-if="isAccepted" :loading="isLoading" block class="mt-6 px-6" color="primary">
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
              <UButton :loading="isLoading" block class="mt-6 px-6" color="primary">
                {{ translate('onboarding.step5.button') }}
              </UButton>
            </div>
          </UForm>
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
        <UButton :loading="isLoading" block class="px-6 mt-2" color="primary" form="form" type="submit">
          {{ translate('onboarding.finalSubmit') }}
        </UButton>
      </div>
    </div>
    <p class="text-center text-xs mt-2 font-medium">
      {{ translate('onboarding.logout.prefix') }}
      <NuxtLink class="text-primary" @click="logoutUser">{{ translate('onboarding.logout.action') }}</NuxtLink>
    </p>
  </div>
</template>

<style scoped>

</style>