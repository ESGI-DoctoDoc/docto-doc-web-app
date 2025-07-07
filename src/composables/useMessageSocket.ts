import { Client } from '@stomp/stompjs';
import { ref, onBeforeUnmount } from 'vue';
import type { Message } from '~/types/message';

const BASE_SOCKET_URL = `${import.meta.env.VITE_API_BASE}/v1`;

export const useMessageSocket = (careTrackingId: string) => {
    const client = ref<Client | null>(null);
    const isConnected = ref(false);
    const receivedMessages = ref<Message[]>([]);

    const connect = async () => {
        if (!import.meta.client) return;

        try {
            console.log("connecting...");
            console.log(import.meta.env.VITE_API_KEY);
            const SockJS = (await import('sockjs-client')).default;
            const stomp = new Client({
                webSocketFactory: () => new SockJS(`${BASE_SOCKET_URL}/ws`),
                connectHeaders: {
                    'x-api-key': import.meta.env.VITE_API_KEY,
                },
                onConnect: () => {
                    isConnected.value = true;
                    stomp.subscribe(`/topic/${careTrackingId}`, (message) => {
                        const parsed = JSON.parse(message.body);
                        receivedMessages.value.push(parsed);
                        console.log('[WebSocket] Message reçu :', parsed);
                    });
                },
                onStompError: (frame) => console.error('STOMP Error:', frame),
                onWebSocketError: (err) => console.error('WebSocket Error:', err),
            });

            stomp.activate();
            client.value = stomp;
        } catch (error) {
            console.error('Failed to initialize WebSocket:', error);
        }
    };

    const disconnect = () => {
        client.value?.deactivate();
        isConnected.value = false;
        receivedMessages.value = [];
    };

    onBeforeUnmount(() => {
        disconnect();
    });

    return {
        connect,
        disconnect,
        isConnected,
        receivedMessages,
    };
};