import { RequestBuilder } from '~/api/request-builder';
import {
    sendMessageRequestSchema,
    type SendMessageRequest,
    type SendMessageDto,
} from './dto/send-message.dto';
import {
    getMessagesResponseSchema,
    type GetMessagesResponse
} from './dto/get-message.dto';

export const messageApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`;

    function postMessage(careTrackingId: string, message: SendMessageDto) {
        return new RequestBuilder(BASE_API_URL)
            .post(`/doctors/care-tracking/${careTrackingId}/message`)
            .withBody<SendMessageRequest>(sendMessageRequestSchema)
            .execute({
                body: {
                    content: message.content,
                },
            });
    }

    function getMessages(careTrackingId: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/doctors/${careTrackingId}/messages`)
            .withResponse<GetMessagesResponse>(getMessagesResponseSchema)
            .execute();
    }

    return {
        postMessage,
        getMessages
    };
};