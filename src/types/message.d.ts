interface MessageSender {
    id: string;
    name: string;
    avatarUrl: string;
}

interface MessageContent {
    text: string | null;
    files: string[] | null;
}

export interface Message {
    id: string;
    sender: MessageSender;
    content: MessageContent;
    sentAt: string;
}