namespace deltav {
    export class Logger {
        constructor(private logArea: HTMLTextAreaElement) {
        }

        public log(s: string | number) {
            let message = (s + "\n" + this.logArea.value);
            this.logArea.value = message;
        }
    }
}
