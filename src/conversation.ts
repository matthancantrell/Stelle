import * as message from './message';

export class Conversation {
    messages: message.Message[] = new Array;

    constructor(){
        this.messages = [];
    }

    getMessages() { return this.messages; }
    getLength() { return this.messages.length; }

    addMessage(message : message.Message) {
        this.messages.push(message);
    }

    removeOldestMessage() {
        this.messages.shift();
    }

    printConversation() {
        for (const mes of this.messages) {
            console.log(mes.getMessage());
        }
    }
}