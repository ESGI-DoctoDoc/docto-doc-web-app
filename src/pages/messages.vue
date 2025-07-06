<script lang="ts" setup>

import InputAreaBase from "~/components/inputs/base/InputAreaBase.vue";
import type {FormErrorEvent, FormSubmitEvent} from "@nuxt/ui";
import {type SendMessageForm, sendMessageSchema} from "~/components/inputs/validators/messages-form.validator";
import MessageInputFile from "~/components/inputs/MessageInputFile.vue";
import type {Message} from "~/types/message";
import {useSession} from "~/composables/auth/useSession";
import type {CareTrackingDetail} from "~/types/care-tracking";
import {careTrackingApi} from "~/services/care-tracking/care-tracking.api";
import {useDebounceFn} from '@vueuse/core';
import {ref} from "vue";
import PreviewDocumentModal from "~/components/modals/PreviewDocumentModal.vue";
import DocumentsPreview from "~/components/DocumentsPreview.vue";

definePageMeta({
  title: 'Messages',
  layout: 'main-layout',
  role: 'admin',
  path: '/care-tracking/:id/messages',
})

const route = useRoute()
const {showError, handleError} = useNotify()
const {getUser} = useSession()
const {fetchCareTrackingById} = careTrackingApi()

const form = reactive<SendMessageForm>({
  message: '',
  files: [],
})

const dropdownItems = ref([
  {
    label: 'Action 1',
    icon: 'i-lucide-pencil',
    click: () => {
    }
  },
  {
    label: 'Action 2',
    icon: 'i-lucide-trash',
    click: () => {
    }
  }
])

const showDropZone = ref(false)
const isLoading = ref(true);
const isLoadingMore = ref(false);
const previewError = ref<boolean[]>([]);
const currentUrl = ref('');

const messages = ref<Message[]>([]);
const careTrackingDetail = ref<CareTrackingDetail>();

const messagesContainer = ref<HTMLElement | null>(null);

watch(messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
});

async function fetchMessages() {
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
  messages.value = [
    {
      id: '1',
      sender: {id: '1', name: 'Docteur1', avatarUrl: 'https://via.placeholder.com/40'},
      content: {text: 'Bonjour, comment allez-vous ?', files: []},
      sendAt: '2025-07-03T09:00:00Z',
    },
    {
      id: '2',
      sender: {id: '00000000-0000-0000-0000-000000000004', name: 'Moi', avatarUrl: 'https://via.placeholder.com/40'},
      content: {text: 'Je vais bien, merci !', files: []},
      sendAt: '2025-07-03T09:02:00Z',
    },
    {
      id: '3',
      sender: {id: '1', name: 'Docteur1', avatarUrl: 'https://via.placeholder.com/40'},
      content: {text: 'Avez-vous pris vos médicaments ?', files: []},
      sendAt: '2025-07-03T09:03:00Z',
    },
    {
      id: '5',
      sender: {id: '1', name: 'Docteur1', avatarUrl: 'https://via.placeholder.com/40'},
      content: {text: 'Parfait. Continuez comme ça.', files: ['https://picsum.photos/536/354']},
      sendAt: '2025-07-03T09:05:00Z',
    },
    {
      id: '6',
      sender: {id: '00000000-0000-0000-0000-000000000004', name: 'Moi', avatarUrl: 'https://via.placeholder.com/40'},
      content: {text: 'Merci docteur !', files: []},
      sendAt: '2025-07-03T09:06:00Z',
    },
    {
      id: '7',
      sender: {id: '1', name: 'Docteur1', avatarUrl: 'https://via.placeholder.com/40'},
      content: {text: 'À bientôt pour un nouveau suivi.', files: []},
      sendAt: '2025-07-03T09:07:00Z',
    }
  ];
  isLoading.value = false;
}

async function loadMoreMessages() {
  isLoadingMore.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
  const newMessages: Message[] = [
    {
      id: '8',
      sender: {id: '1', name: 'Docteur1', avatarUrl: 'https://via.placeholder.com/40'},
      content: {
        text: null,
        files: ['https://picsum.photos/536/354', 'https://picsum.photos.fr/no-content', 'https://picsum.photos/536/354', 'https://picsum.photos/536/354']
      },
      sendAt: '2025-07-03T09:08:00Z',
    },
    {
      id: '9',
      sender: {id: '00000000-0000-0000-0000-000000000004', name: 'Moi', avatarUrl: 'https://via.placeholder.com/40'},
      content: {text: 'Merci pour le suivi.', files: []},
      sendAt: '2025-07-03T09:09:00Z',
    }
  ];
  messages.value.unshift(...newMessages);
  isLoadingMore.value = false;
}

const onScroll = useDebounceFn(() => {
  if (messagesContainer.value) {
    const {scrollTop} = messagesContainer.value;
    if (scrollTop < 25) {
      console.log("Chargement de plus de messages...");
      loadMoreMessages();
    }
  }
}, 300);

function isMessageFromMe(message: Message) {
  const user = getUser()
  return message.sender.id === user?.doctor?.id;
}

// TODO: Initialiser la connexion WebSocket
function connectSocket() {
}

// TODO: Se déconnecter proprement du socket
function disconnectSocket() {
}

// TODO: Écouter les nouveaux messages entrants via socket
function listenToMessages() {
}

// TODO: Envoyer un message via socket
function sendMessage(form: FormSubmitEvent<SendMessageForm>) {
  console.log("form is accepted", form.data);
  messages.value = [
    ...messages.value,
    {
      id: String(messages.value.length + 1),
      sender: {id: '00000000-0000-0000-0000-000000000004', name: 'Moi', avatarUrl: 'https://via.placeholder.com/40'},
      content: {text: form.data.message, files: null},
      sendAt: new Date().toISOString(),
    }
  ];
  form.data.message = '';
}

function onError(event: FormErrorEvent) {
  console.log(event);
  showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire.');
}

const patientName = ref<string | null>(null);
const breadcrumbItems = computed(() => [
  {label: 'Suivi de dossier', icon: 'i-lucide-file-text', to: '/care-tracking'},
  {label: patientName.value ?? 'Chargement...', icon: 'i-lucide-user', to: '/my-patients'},
  {label: 'Messages', icon: 'i-lucide-message-square'}
]);

async function getCareTrackingById() {
  try {
    const careTrackingId = route.params.id as string;
    if (!careTrackingId) {
      showError('ID de suivi de dossier manquant');
      navigateTo('/care-tracking');
      return;
    }

    careTrackingDetail.value = await fetchCareTrackingById(careTrackingId);

    const patient = careTrackingDetail.value.patient;
    patientName.value = `${patient.firstName} ${patient.lastName}`;
  } catch (error) {
    handleError('Erreur lors de la récupération du suivi de dossier', error);
  }
}

onMounted(() => {
  // getCareTrackingById()
  connectSocket()
  listenToMessages()
  fetchMessages()
})

onBeforeUnmount(() => {
  disconnectSocket()
})

</script>

<template>
  <div class="fit">
    <div class="flex flex-col space-y-2 p-4 h-full">
      <UBreadcrumb :items="breadcrumbItems"/>

      <!-- Message     -->
      <div
          class="flex flex-col border-1 border-gray-200 rounded-lg mt-3" style="height: calc(100% - 5vh);"
      >
        <!-- Header       -->
        <div class="flex items-center justify-between px-4 py-2 border-b-gray-300 border-b">
          <div class="flex flex-col mb-2">
            <div class="text-xl font-medium">Nom suivi de dossier</div>
            <div class="text-sm">Docteur1, Docteur2, ...</div>
          </div>
          <div>
            <UDropdownMenu :items="dropdownItems">
              <UButton class="text-black" icon="i-lucide-more-vertical" size="xl" variant="soft"/>
            </UDropdownMenu>
          </div>
        </div>

        <!-- All messages   -->
        <div ref="messagesContainer" class="flex-1 flex flex-col space-y-3 overflow-y-auto px-4 py-4 relative"
             @scroll="onScroll">
          <!-- Loading   -->
          <UProgress v-if="isLoadingMore" class="absolute top-0 left-0 right-0 z-20" indeterminate size="sm"/>
          <div v-if="isLoading" class="flex-1 flex items-center justify-center">
            <div class="text-gray-500">Chargement des messages...</div>
          </div>

          <!-- Empty   -->
          <div v-else-if="messages.length === 0" class="flex-1 flex flex-col space-y-3 overflow-y-auto px-4 py-4">
            <div class="text-center text-gray-500">
              <p>Aucun message pour le moment.</p>
              <p>Commencez la conversation en envoyant un message.</p>
            </div>
          </div>

          <!-- Messages   -->
          <div v-else class="flex flex-col space-y-3 px-4 py-4">
            <div
                v-for="(message, index) in messages" :key="index"
                :class="isMessageFromMe(message) ? 'self-end items-end' : 'self-start items-start'"
                class="flex flex-col space-y-2 max-w-[75%]"
            >
              <div
                  :class="{ 'flex-row-reverse gap-x-2': isMessageFromMe(message) }"
                  class="flex space-x-2 items-baseline"
              >
                <UAvatar :src="message.sender.avatarUrl" class="border border-gray-300" size="2xl"/>
                <div class="font-medium">{{ message.sender.name }}</div>
              </div>
              <div
                  v-if="message.content.text != null"
                  :class="{ 'bg-info-100': isMessageFromMe(message), 'bg-gray-50': !isMessageFromMe(message) }"
                  class="border border-gray-300 rounded-md p-3 text-black"
              >
                {{ message.content.text }}
              </div>
              <DocumentsPreview
                  v-if="message.content.files && message.content.files.length > 0"
                  :files="message.content.files"
              />
              <div class="text-sm text-gray-500">Le 12/10/2023 à 14:30</div>
            </div>
          </div>
        </div>

        <!-- Input message -->
        <div class="flex items-end space-x-2 mt-4 p-4 border-t border-t-gray-300">
          <UButton color="neutral" icon="i-lucide-paperclip" size="xl" variant="soft"
                   @click="showDropZone = !showDropZone"/>
          <UForm
              id="sendMessageForm"
              :schema="sendMessageSchema"
              :state="form"
              class="flex-1 flex flex-col"
              @error="onError"
              @submit="sendMessage"
          >
            <MessageInputFile v-if="showDropZone" v-model:files="form.files"/>
            <UFormField class="text-left" name="message">
              <InputAreaBase
                  v-model="form.message"
                  :rows="1"
                  class="flex-1"
                  placeholder="Écrivez un message..."
              />
            </UFormField>
          </UForm>
          <UButton :loading="isLoading" form="sendMessageForm" icon="i-lucide-send" size="xl" type="submit"
                   variant="soft"/>
        </div>
      </div>
    </div>

    <PreviewDocumentModal v-if="currentUrl" :file-url="currentUrl" @close="currentUrl = ''"/>
  </div>
</template>

<style scoped>

</style>