<script lang="ts" setup>

import {medicalConcernsApi} from "~/services/medical-concerns/medical-concerns.api";
import type {MedicalConcernQuestion} from "~/types/medical-concern-question";
import FormField from "~/components/inputs/base/FormField.vue";

const answers = defineModel('answers', {
  type: Array as PropType<{ questionId: string, answer: string }[]>,
  required: true,
})

const medicalConcern = defineModel('medicalConcern', {
  type: String as PropType<string>,
  required: true,
})

const hasToAnswerQuestions = defineModel('hasToAnswerQuestions', {
  type: Boolean as PropType<boolean>,
  required: true,
})

const {showError} = useNotify()
const {getQuestionsByMedicalConcernId} = medicalConcernsApi()

const questions = ref<MedicalConcernQuestion[]>([])
const loading = ref(true);
const inputValues = ref<Record<string, string>>({});

async function fetchQuestionsByMedicalConcern() {
  loading.value = true;
  try {
    questions.value = await getQuestionsByMedicalConcernId(medicalConcern.value);
    hasToAnswerQuestions.value = questions.value.filter(q => q.isMandatory).length > 0;

    inputValues.value = {};
    for (const question of questions.value) {
      const existingAnswer = answers.value.find(a => a.questionId === question.id);
      inputValues.value[question.id] = existingAnswer?.answer || '';
    }

    // Check if all mandatory questions have been answered
    checkIfHasAnsweredAllQuestions();
  } catch (e) {
    if (e instanceof Error) {
      showError('Erreur lors du chargement des questions', e.message);
    } else {
      showError('Erreur inconnue lors du chargement des questions');
    }
  } finally {
    loading.value = false;
  }
}

function checkIfHasAnsweredAllQuestions() {
  for (const question of questions.value) {
    if (question.isMandatory) {
      const answer = answers.value.find(a => a.questionId === question.id);
      if (!answer?.answer?.trim()) {
        hasToAnswerQuestions.value = true;
        return;
      }
    }
  }
  hasToAnswerQuestions.value = false;
}

function onChange(questionId: string, value: string) {
  inputValues.value[questionId] = value;
  const index = answers.value.findIndex(a => a.questionId === questionId);
  if (index !== -1) {
    answers.value[index].answer = value;
  } else {
    answers.value.push({questionId, answer: value});
  }

  checkIfHasAnsweredAllQuestions();
}

watch(
    () => medicalConcern.value,
    fetchQuestionsByMedicalConcern,
    {immediate: true}
)


onMounted(() => {
  fetchQuestionsByMedicalConcern();
})

</script>

<template>
  <div v-if="loading">
    <USkeleton class="w-full h-8"/>
  </div>
  <div v-else-if="questions.length == 0">
    Aucune question à répondre pour ce motif de consultation.
  </div>
  <div v-else class="flex flex-col space-y-2">
    <div v-for="question in questions" :key="question.id" class="flex flex-col space-y-1">
      <FormField :label="question.question" :name="`question-${question.id}`" :required="question.isMandatory">
        <UInput
            v-if="question.type === 'text'"
            :model-value="answers.find(a => a.questionId === question.id)?.answer || ''"
            class="w-full"
            placeholder="Réponse"
            @update:model-value="(value) => onChange(question.id, value as string)"
        />
        <USelect
            v-else-if="question.type === 'yes_no'"
            v-model="inputValues[question.id]"
            :items="[
              { label: 'Oui', value: 'yes' },
              { label: 'Non', value: 'no' }
            ]"
            class="w-full"
            @update:model-value="(value) => onChange(question.id, value as string)"
        />
        <USelect
            v-else-if="question.type === 'list'"
            v-model="inputValues[question.id]"
            :items="question.options?.map(option => ({ label: option.label, value: option.value })) ?? []"
            class="w-full"
            @update:model-value="(value) => onChange(question.id, value as string)"
        />
      </FormField>
    </div>
  </div>
</template>

<style scoped>

</style>