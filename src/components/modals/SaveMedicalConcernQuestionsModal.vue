<script lang="ts" setup>

import type {FormErrorEvent, FormSubmitEvent} from "@nuxt/ui";
import {useModals} from "~/composables/useModal";
import {
  type CreateMedicalConcernQuestionForm,
  createMedicalConcernQuestionSchema
} from "~/components/inputs/validators/medical-concern-question-form.validator";
import type {MedicalConcernQuestion} from "~/types/medical-concern-question";

const open = defineModel('open', {
  type: Boolean,
  default: true,
})

const props = defineProps<{
  initialQuestions?: MedicalConcernQuestion[]
}>()

const emit = defineEmits<{
  (e: 'onSubmit', value: CreateMedicalConcernQuestionForm): void;
}>()

const {showError} = useNotify()
const {showPopupContinueModal} = useModals()

const form = ref<CreateMedicalConcernQuestionForm>({
  questions: []
})

onMounted(() => {
  console.log(props.initialQuestions)
  form.value.questions = props.initialQuestions ?? [];
})

const questionTypes = [
  {label: 'Texte libre', value: 'text', onSelect: () => addQuestion('text')},
  {label: 'Oui / Non', value: 'yes_no', onSelect: () => addQuestion('yes_no')},
  {label: 'Liste déroulante', value: 'list', onSelect: () => addQuestion('list')}
];

function addQuestion(type: 'text' | 'yes_no' | 'list' = 'text') {
  if (type === 'list') {
    form.value.questions.push({
      question: '',
      type: 'list',
      options: [{label: '', value: ''}],
      isMandatory: false,
    });
  } else if (type === 'yes_no') {
    form.value.questions.push({
      question: '',
      type: 'yes_no',
      options: [
        {label: 'Oui', value: 'yes'},
        {label: 'Non', value: 'no'}
      ],
      isMandatory: false,
    });
  } else {
    form.value.questions.push({
      question: '',
      type: 'text',
      options: [],
      isMandatory: false,
    });
  }
}

function addOption(index: number) {
  if (!form.value.questions[index]?.options) {
    form.value.questions[index].options = [];
  }

  if (form.value.questions[index].options?.length >= 10) {
    showError("Vous ne pouvez pas ajouter plus de 10 options à une question.");
    return;
  }
  form.value.questions[index]?.options?.push({label: '', value: ''});
}

function removeQuestion(index: number) {
  const instance = showPopupContinueModal("Êtes-vous sûr de vouloir supprimer cette question ?")
  instance.result.then(async (result) => {
    if (result) {
      try {
        form.value.questions.splice(index, 1);
      } catch (error) {
        console.error('Erreur lors de la suppression de la question:', error);
      }
    }
  })
}

function moveUp(index: number) {
  if (index > 0) {
    const questions = form.value.questions;
    [questions[index - 1], questions[index]] = [questions[index], questions[index - 1]];
  }
}

function moveDown(index: number) {
  const questions = form.value.questions;
  if (index < questions.length - 1) {
    [questions[index + 1], questions[index]] = [questions[index], questions[index + 1]];
  }
}

function onSubmit(form: FormSubmitEvent<CreateMedicalConcernQuestionForm>) {
  console.log("form is accepted", form.data);
  emit('onSubmit', form.data);
}

function onError(event: FormErrorEvent) {
  showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire.');
}

</script>

<template>
  <UModal
      v-model:open="open"
      :ui="{
        body: 'min-h-[65vh] max-h-[65vh] overflow-y-auto'
      }"
      close
  >
    <template #title>
      <h2 class="text-2xl font-medium">Questions</h2>
    </template>
    <template #body>
      <div class="flex justify-between mb-4">
        <h1 class="text-xl">Mes questions</h1>
        <UDropdownMenu :items="questionTypes">
          <UButton :disabled="form.questions?.length >= 10" icon="i-lucide-plus" label="Nouvelle question"
                   variant="soft"/>
        </UDropdownMenu>
      </div>

      <div v-if="form.questions.length === 0">
        <p class="text-sm text-gray-500">Aucune question n'a été ajoutée. Cliquez sur "Nouvelle question" pour en créer
          une.</p>
      </div>

      <UForm
          id="medical-concern-form"
          :schema="createMedicalConcernQuestionSchema"
          :state="form"
          class="flex flex-col space-y-4 w-full overflow-y-scroll"
          @error="onError"
          @submit.prevent="onSubmit"
      >
        <div
            v-for="(question, i) in form.questions" :key="i"
            class="flex flex-col justify-between items-start bg-gray-50 border-1 border-gray-200 rounded-lg p-4 space-y-4"
        >
          <div class="flex justify-between items-start w-full space-y-4">
            <div class="flex flex-col items-start mb-0 w-4/5">
              <div class="flex space-x-2">
                <div>#{{ i + 1 }}</div>
                <div
                    :class="{
                  'bg-blue-100 text-blue-800': question.type === 'text',
                  'bg-green-100 text-green-800': question.type === 'yes_no',
                  'bg-yellow-100 text-yellow-800': question.type === 'list'
                }"
                    class="text-sm border-1 border-gray-200 px-2 rounded-sm mb-1"
                >{{ questionTypes.find(q => q.value === question.type)?.label || 'Type inconnu' }}
                </div>
              </div>
              <UFormField :name="`questions.${i}.question`" class="my-2 w-full" required>
                <UInput v-model.trim="question.question" class="w-full" placeholder="Entrez votre question"
                        type="text"/>
              </UFormField>
              <UCheckbox v-model="question.isMandatory" label="Question obligatoire"/>
            </div>
            <div class="flex flex-col gap-1 self-start">
              <UTooltip text="Supprimer la question">
                <UButton color="error" icon="i-lucide-trash-2" variant="subtle" @click="removeQuestion(i)"/>
              </UTooltip>
              <UTooltip text="Monter la question">
                <UButton icon="i-lucide-chevron-up" variant="subtle" @click="moveUp(i)"/>
              </UTooltip>
              <UTooltip text="Descendre la question">
                <UButton icon="i-lucide-chevron-down" variant="subtle" @click="moveDown(i)"/>
              </UTooltip>
            </div>
          </div>

          <AppDivider v-if="question.type === 'list'" class="w-full"/>
          <div v-if="question.type === 'list'" class="flex flex-col w-full space-y-2">
            <h1>Options</h1>
            <div class="flex flex-col w-full space-y-1">
              <div v-for="(option, index) in question.options" :key="index" class="flex space-x-2 items-start">
                <UFormField :name="`questions.${i}.options.${index}.label`" class="w-full">
                  <UInput v-model="option.label" class="w-full" placeholder="Entrez l'option" type="text"
                          @update:model-value="option.value = option.label"/>
                  <UInput v-show="false" v-model="option.value" type="text"/>
                </UFormField>
                <UInput v-show="false" v-model="option.value" :name="`questions.${i}.options.${index}.value`"
                        type="text"/>
                <UButton
                    color="error"
                    icon="i-lucide-trash-2"
                    variant="subtle"
                    @click="question.options?.splice(index, 1)"
                />
              </div>
              <UButton
                  :disabled="question?.options?.length >= 10"
                  block
                  class="mt-1"
                  icon="i-lucide-plus"
                  label="Nouvel option"
                  variant="subtle"
                  @click="addOption(i)"
              />
            </div>
          </div>
        </div>
      </UForm>
    </template>
    <template #footer>
      <UButton
          :label="form.questions.length > 0 ? 'Enregistrer le(s) question(s)' : 'Ne pas poser de questions'"
          block
          form="medical-concern-form"
          type="submit"
      />
    </template>
  </UModal>
</template>

<style scoped>

</style>