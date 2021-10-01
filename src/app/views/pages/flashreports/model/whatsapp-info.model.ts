import { WhatsappChatInfo } from './whatsapp-chat-info.model';

export class WhatsappInfo {
    public chatId: number;
    public chatName: string;
    public tcre: number;
    public tres: number;
    public rslt: number;

    public chatInfo: WhatsappChatInfo[];

    constructor() {
        this .tcre = 0;
        this .tres = 0;
        this .rslt = 0;
        this .chatInfo = [];
    }
}
