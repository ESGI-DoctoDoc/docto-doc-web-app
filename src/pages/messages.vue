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
import {useMessageSocket} from "~/composables/useMessageSocket";
import {messageApi} from "~/services/messages/message.api";
import dayjs from "dayjs";
import DocumentsPreview from "~/components/DocumentsPreview.vue";
import CareTrackingSlideover from "~/components/slideover/CareTrackingSlideover.vue";

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
const user = getUser()
const {postMessage, getMessages} = messageApi();

const careTrackingId = route.params.id as string;
const { connect, disconnect, receivedMessages } = useMessageSocket(careTrackingId);

const form = reactive<SendMessageForm>({
  message: '',
  files: [],
})

const openCareTrackingDetail = ref(false);

const dropdownItems = ref([
  {
    label: 'Voir le suivi de dossier',
    onSelect: () => {
      openCareTrackingDetail.value = true;
    }
  },
])

const showDropZone = ref(false)
const isLoading = ref(true);
const isLoadingMore = ref(false);
const previewError = ref<boolean[]>([]);
const currentUrl = ref('');
const lastCursor = ref<{ sentAt: string, id: string } | null>(null);
const hasMore = ref(true);

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
  try {
    const response = await getMessages(careTrackingId);
    const ordered = [...response].reverse();

    messages.value = ordered.map((message) => ({
      id: message.id,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        avatarUrl: message.sender.avatarUrl,
      },
      content: {
        text: message.content.text,
        files: message.content.files,
      },
      sentAt: message.sentAt,
    }));

    if (messages.value.length > 0) {
      const first = messages.value[0];
      lastCursor.value = {
        sentAt: first.sentAt,
        id: first.id,
      };
    }

    hasMore.value = response.length === 8;
  } catch (error) {
    showError('Erreur de récupération', 'Impossible de charger les messages.');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

async function loadMoreMessages() {
  if (!hasMore.value || isLoadingMore.value || !lastCursor.value) return;

  isLoadingMore.value = true;

  try {
    const response = await getMessages(careTrackingId, lastCursor.value);

    const newMessages = response.map((message) => ({
      id: message.id,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        avatarUrl: message.sender.avatarUrl,
      },
      content: {
        text: message.content.text,
        files: message.content.files,
      },
      sendAt: message.sentAt,
    }));

    messages.value.unshift(...[...newMessages].reverse());

    if (newMessages.length > 0) {
      const oldest = newMessages[0];
      lastCursor.value = {
        sentAt: oldest.sendAt,
        id: oldest.id,
      };
    }

    hasMore.value = newMessages.length === 8;
  } catch (error) {
    showError('Erreur de récupération', 'Impossible de charger plus de messages.');
    console.error(error);
  } finally {
    isLoadingMore.value = false;
  }
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

function connectSocket() {
  connect();
}

function disconnectSocket() {
  disconnect()
}

function listenToMessages() {
  watch(() => receivedMessages.value.length, () => {
    if (receivedMessages.value.length > 0) {
      const lastMessage = receivedMessages.value[receivedMessages.value.length - 1];
      messages.value.push(lastMessage);
      console.log(lastMessage);
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    }
  });
}

async function sendMessage(formEvent: FormSubmitEvent<SendMessageForm>) {
  if (!careTrackingDetail.value || !careTrackingDetail.value.doctors.length) {
    showError('Erreur', 'Aucun docteur associé au suivi de dossier.');
    return;
  }

  const userDoctorId = user?.doctor?.id;
  const doctor = careTrackingDetail.value.doctors.find(doc => doc.id === userDoctorId)
      || careTrackingDetail.value.doctors[0];

  const fullName = `${doctor.firstName} ${doctor.lastName}`;

  const messageToSend: Message = {
    id: crypto.randomUUID(),
    sender: {
      id: doctor.id,
      name: fullName,
      avatarUrl: doctor.profilePictureUrl,
    },
    content: {
      text: formEvent.data.message,
      files: formEvent.data.files ?? [],
    },
    sentAt: dayjs().toDate(),
  };

  try {
    const trimmedContent = messageToSend.content.text?.trimEnd() ?? '';
    await postMessage(careTrackingId, {
      content: trimmedContent,
      files: messageToSend.content.files ?? [],
    });
    form.message = '';
    form.files = [];
    showDropZone.value = false;
  } catch (error) {
    showError('Erreur d\'envoi', 'Impossible d\'envoyer le message');
    console.error(error);
  }
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
    navigateTo('/care-tracking');
  }
}

onMounted(async () => {
  await getCareTrackingById()

  if (careTrackingDetail.value) {
    connectSocket()
    listenToMessages()
    await fetchMessages()
  }
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
            <div class="text-xl font-medium">{{ careTrackingDetail?.name || 'Nom suivi de dossier' }}</div>
            <div class="text-sm">
              <template v-if="careTrackingDetail && careTrackingDetail.doctors.length > 0">
                {{ careTrackingDetail.doctors.map(doc => `${doc.firstName} ${doc.lastName}`).join(', ') }}
              </template>
              <template v-else>
                Aucun docteur associé
              </template>
            </div>
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
                  v-if="message.content.text"
                  :class="{ 'bg-info-100': isMessageFromMe(message), 'bg-gray-50': !isMessageFromMe(message) }"
                  class="border border-gray-300 rounded-md p-3 text-black message-content"
              >
                {{ message.content.text }}
              </div>
              <DocumentsPreview
                  v-if="message.content.files && message.content.files.length > 0"
                  :files="message.content.files"
              />
              <div class="text-sm text-gray-500">
                {{ dayjs(message.sentAt).format("DD/MM/YYYY HH:mm") }}
              </div>
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
            <MessageInputFile
                v-if="showDropZone && careTrackingDetail?.id"
                v-model:files="form.files"
                :care-tracking-id="careTrackingDetail?.id"
            />
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

    <CareTrackingSlideover
        v-if="openCareTrackingDetail && careTrackingDetail"
        v-model:open="openCareTrackingDetail"
        :care-tracking="careTrackingDetail"
        readonly
        @close="openCareTrackingDetail = false"
    />
  </div>
</template>

<style scoped>
.message-content {
  white-space: pre-wrap;
  max-width: 100%;
  overflow-x: auto;
}
</style>