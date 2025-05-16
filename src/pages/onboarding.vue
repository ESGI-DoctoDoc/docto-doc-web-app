<script lang="ts" setup>

import {type LoginForm, loginSchema} from "~/components/inputs/validators/user-form.validator";
import PictureInput from "~/components/inputs/PictureInput.vue";
import FirstNameInput from "~/components/inputs/FirstNameInput.vue";
import LastNameInput from "~/components/inputs/LastNameInput.vue";
import BioInput from "~/components/inputs/BioInput.vue";
import AuthLayout from "~/layouts/AuthLayout.vue";
import type {FormSubmitEvent} from "@nuxt/ui";
import Placeholder from "~/components/utils/Placeholder.vue";
import BirthDateInput from "~/components/inputs/BirthDateInput.vue";


const form = reactive<Partial<LoginForm>>({
  email: 'patient1@example.com',
  password: 'Abdcd76@'
})

const currentStep = ref(0)

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
    formSubtitle: 'Renseignez votre spécialité, vos expériences et préférences pour mieux vous connecter aux patients.',
  },
  {
    title: 'Étape 3',
    shortDescription: 'RPPS et documents justificatifs',
    formTitle: 'Vérification professionnelle',
    formSubtitle: 'Fournissez vos identifiants professionnels et documents requis.',
  },
  {
    title: 'Étape 4',
    shortDescription: 'Vérification et résumé',
    formTitle: 'Résumé de votre profil',
    formSubtitle: 'Vérifiez les informations saisies avant de finaliser votre inscription.',
  }
]

async function onSubmit(event: FormSubmitEvent<LoginForm>) {
  //todo ici abd
  console.log(event.data)
}

</script>

<template>
  <AuthLayout>
    <div class="flex flex-col gap-2" style="width: 55vw; height: 65vh">
      <div
          class="flex flex-row rounded-2xl border-2 border-gray-200 w-full overflow-hidden h-full"
          style="min-width: 600px">
        <!-- Left forms     -->
        <div class="w-3/5 p-8 flex justify-center items-center bg-white">
          <UForm :schema="loginSchema" :state="form" @submit.prevent="onSubmit">
            <!-- Step 1           -->
            <div v-if="currentStep === 0" class="w-full text-center" style="">
              <h1 class="text-2xl font-bold">{{ steps[0].formTitle }}</h1>
              <p class="pt-1 pb-6">{{ steps[0].formSubtitle }}</p>

              <!-- Step 1           -->
              <div class="space-y-4">
                <div class="flex flex-row gap-2">
                  <div class="w-auto">
                    <PictureInput class="w-20 h-20"/>
                  </div>
                  <div class="w-5/6">
                    <Placeholder class="h-full"/>
                  </div>
                </div>
                <div class="flex flex-row gap-2">
                  <FirstNameInput class="w-1/2"/>
                  <LastNameInput class="w-1/2"/>
                </div>
                <BirthDateInput/>
                <BioInput/>
              </div>
            </div>

            <!-- Step 2           -->
            <div v-if="currentStep === 1" class="w-full text-center" style="">
              <h1 class="text-2xl font-bold">{{ steps[1].formTitle }}</h1>
              <p class="pt-1 pb-6">{{ steps[1].formSubtitle }}</p>

              <div class="space-y-4">
                <!--              <SpecialityInput />-->
                <!--              <YearExperienceInput />-->
                <!--              <MedicalConcernSelect />-->
                <!--              <LanguageSelect />-->
              </div>
            </div>

            <!-- Step 3           -->
            <div v-if="currentStep === 2" class="w-full text-center" style="">
              <h1 class="text-2xl font-bold">{{ steps[2].formTitle }}</h1>
              <p class="pt-1 pb-6">{{ steps[2].formSubtitle }}</p>

              <div class="space-y-4">
                <!--              <RPPSInput />-->
                <!--              <FileInput />-->
                <!--              <FileInput />-->
              </div>
            </div>

            <!-- Step 4           -->
            <div v-if="currentStep === 3" class="w-full text-center" style="">
              <h1 class="text-2xl font-bold">{{ steps[3].formTitle }}</h1>
              <p class="pt-1 pb-6">{{ steps[3].formSubtitle }}</p>
              <div class="space-y-4">

                <!-- Liste toutes les données           -->
                <UButton block class="px-6" color="primary" type="submit">Finaliser l'inscription</UButton>
              </div>
            </div>
          </UForm>
        </div>

        <!-- Steps     -->
        <div class="h-full w-2/5 border-l-2 border-l-gray-200 p-4 bg-white">

          <div class="h-full flex flex-col gap-y-4">
            <div
                v-for="(step, index) in steps" :key="index"
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
    </div>
  </AuthLayout>
</template>

<style scoped>

</style>