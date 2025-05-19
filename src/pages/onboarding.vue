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
import AddressInput from "~/components/inputs/AddressInput.vue";
import {useOnboardingApi} from "~/services/onboarding/onboarding.api";

const {logoutUser} = useSession()
const {translate} = useTranslate()
const {showSuccess, showError} = useNotify()
const {process, isLoading} = useOnboardingApi()

const image = new URL('@/assets/images/doctor-and-patient.png', import.meta.url).href
//todo abd: c'est juste pour le teste normalement il faut le type du schema
const form = reactive<Partial<OnboardingForm>>({
  rpps: "12345678801    ",
  speciality: "Cardiology   ",
  experienceYears: 5,
  acceptPublicCoverage: true,
  firstName: "John",
  lastName: "Doe",
  birthDate: "1980-05-12",
  bio: "Experienced cardiologist with 10 years of practice.",
  profilePictureUrl: "https://example.com/pic.jpg",
  languages: ["English", "French"],
  doctorDocuments: ["https://ex.com/2.pdf", "https://ex.com/1.pdf"]
})

const currentStep = ref(0)
const isOnWaiting = ref(false)
const isAccepted = ref(false)
const hasPaid = ref(false)

const steps = [
  {
    title: 'Étape 1',
    shortDescription: 'Ajoutez une photo et vos infos personnelles',
    formTitle: 'Informations personnelles',
    formSubtitle: 'Aidez-nous à mieux vous connaître en remplissant les informations de base.',
  },
  {
    title: 'Étape 2',
    shortDescription: 'Décrivez votre parcours et vos compétences',
    formTitle: 'Votre parcours professionnel',
    formSubtitle: 'Renseignez votre spécialité, vos expériences et vos langues parlées.',
  },
  {
    title: 'Étape 3',
    shortDescription: 'RPPS et documents justificatifs',
    formTitle: 'Vérification professionnelle',
    formSubtitle: 'Fournissez vos identifiants professionnels et documents requis.',
  },
  {
    title: 'Étape 4',
    shortDescription: 'Vérification en cours',
    formTitle: 'Vérification de votre compte',
    formSubtitle: 'Nous vérifions vos informations, cela peut prendre quelques minutes.',
  },
  {
    title: 'Étape 5',
    shortDescription: 'Paiement de la licence',
    formTitle: 'Paiement de la licence',
    formSubtitle: 'Procédez au paiement de votre licence.',
  },
  {
    title: 'Étape 6',
    shortDescription: 'Confirmation d\'inscription',
    formTitle: 'Inscription réussie !',
    formSubtitle: 'Votre inscription est validée, accédez à votre tableau de bord.',
  }
]

function goToDashboard() {
  //redirection
}

function redirectToStripeCheckout() {
  console.log("Redirecting to Stripe checkout...");
  hasPaid.value = true;
  currentStep.value = 7;
}

async function onSubmit(event: FormSubmitEvent<OnboardingForm>) {
  //todo ici abd
  console.log(event.data)
  try {
    await process({
      rpps: event.data.rpps,
      specialty: event.data.speciality,
      experienceYears: event.data.experienceYears,
      acceptPublicCoverage: event.data.acceptPublicCoverage,
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      birthDate: event.data.birthDate,
      bio: event.data.bio,
      profilePictureUrl: event.data.profilePictureUrl,
      languages: event.data.languages,
      doctorDocuments: event.data.doctorDocuments // todo Corentino: mettre le storage en place
    })
    navigateTo('/')

    showSuccess(
        translate('auth.login.success.title'),
        translate('auth.login.success.message')
    )
  }  catch (e) {
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
                      <FirstNameInput class="w-1/2"/>
                      <LastNameInput class="w-1/2"/>
                    </div>
                    <BirthDateInput/>
                    <BioInput/>
                  </div>
                </div>

                <!-- Step 2           -->
                <div v-if="currentStep === 1" class="w-full text-center" style="">
                  <div class="space-y-4">
                    <DoctorSpecialitySelect/>
                    <YearExperienceInput/>
                    <LanguageSelect/>
                  </div>
                </div>

                <!-- Step 3           -->
                <div v-if="currentStep === 2" class="w-full text-center" style="">
                  <div class="space-y-4">
                    <RPPSInput/>
                    <IdentityCardInput/>
                    <AddressInput/>
                    <UButton block class="px-6" color="primary" type="submit" @click="onSubmit">
                      Finaliser l'inscription
                    </UButton>
                  </div>
                </div>

                <!-- Step 4           -->
                <div v-if="currentStep === 3 && isOnWaiting">
                  <div class="space-y-4 text-gray-700 text-sm leading-6 text-left px-2">
                    <p>
                      Nos équipes examinent actuellement votre dossier afin de vérifier que vous êtes bien autorisé à
                      exercer la médecine en France.
                    </p>
                    <p>
                      Cette vérification inclut la validation de vos documents professionnels, votre numéro RPPS, ainsi
                      que l'exactitude des informations fournies.
                    </p>
                    <p>
                      Ce processus peut prendre jusqu’à <strong>trois jours ouvrés</strong>. Vous recevrez une
                      notification dès que votre compte sera validé.
                    </p>
                  </div>
                  <UButton v-if="isAccepted" block class="mt-6 px-6" color="primary" @click="validateAccount">
                    Passer à l'étape suivante
                  </UButton>
                  <UButton v-else block class="mt-6 px-6" color="primary" disabled loading>
                    En attente de validation
                  </UButton>
                </div>

                <!-- Step 5           -->
                <div v-if="currentStep === 4 && isAccepted">
                  <div class="space-y-4 text-gray-700 text-sm leading-6 text-left px-2">
                    <p>
                      Votre compte a été validé avec succès ! Vous pouvez maintenant procéder au paiement de votre
                      licence.
                    </p>
                    <p>
                      Cliquez sur le bouton ci-dessous pour être redirigé vers la page de paiement sécurisé.
                    </p>
                  </div>
                  <UButton block class="mt-6 px-6" color="primary" @click="redirectToStripeCheckout">
                    Payer la licence
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
        Vous avez fait une erreur ou souhaitez reprendre plus tard ?
        <NuxtLink class="text-primary" @click="logoutUser">Se déconnecter</NuxtLink>
      </p>
    </div>
  </AuthLayout>
</template>

<style scoped>

</style>