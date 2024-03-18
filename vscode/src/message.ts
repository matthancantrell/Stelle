import { Time } from "./time";

export class Message {
    role: string = "";
    content: string = "";
    time: Time;

    constructor(role: string, content: string) {
        this.setRole(role);
        this.setContent(content);
        this.time = new Time();
    }

    getRole() { return this.role; }
    setRole(role: string) { this.role = role; }

    getContent() { return this.content; }
    setContent(content: string) { this.content = content; }

    getMessage(): string {
        return JSON.stringify({
            role: this.getRole(),
            content: this.getContent()
        });
    }
}