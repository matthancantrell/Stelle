export class Time {
    hours: string;
    minutes: string;
    ampm: string;

    constructor() {
        const now = new Date();
        this.hours = (now.getHours() % 12 || 12).toString();
        this.minutes = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
        this.ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    }

    getTime(): string {
        var time: string = this.hours + ":" + this.minutes + " " + this.ampm;
        return time;
    }
}