interface MessageSender {
    id: string;
    name: string;
    avatarUrl?: string;
}

interface MessageContent {
    text: string | null;
    files: string[] | null;
}

export interface Message {
    sender: MessageSender;
    content: MessageContent;
    sendAt: string;
}