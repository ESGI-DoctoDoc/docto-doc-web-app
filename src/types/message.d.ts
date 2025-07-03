interface MessageSender {
    id: string;
    name: string;
    avatarUrl?: string;
}

interface MessageContent {
    text: string;
    files: string[];
}

export interface Message {
    id: string;
    sender: MessageSender;
    content: MessageContent;
    sendAt: string;
}