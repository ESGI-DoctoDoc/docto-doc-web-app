import {RequestBuilder} from '~/api/request-builder';
import {type SendMessageDto, type SendMessageRequest, sendMessageRequestSchema,} from './dto/send-message.dto';
import {
    getMessageQuerySchema,
    type GetMessagesQuerySchema,
    type GetMessagesResponse,
    getMessagesResponseSchema, type MessageCursor
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
                    files: message.files,
                },
            });
    }

    function getMessages(careTrackingId: string, cursor?: MessageCursor) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/doctors/${careTrackingId}/messages`)
            .withQuery<GetMessagesQuerySchema>(getMessageQuerySchema)
            .withResponse<GetMessagesResponse>(getMessagesResponseSchema)
            .execute({
                query: cursor
                    ? {
                        cursorSentAt: cursor.sentAt,
                        cursorId: cursor.id,
                    }
                    : {},
            });
    }

    return {
        postMessage,
        getMessages
    };
};