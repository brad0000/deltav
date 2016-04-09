
namespace deltav {

    export enum CtlKey {
        Up = 104,
        Down = 98,
        Left = 100,
        Right = 102,
        Accelerate = 38,
        Brake = 40,
        Clockwise = 39,
        AntiClockwise = 37,
        Fire = 17,
    }
    /*
     * http://www.cambiaresearch.com/articles/15/javascript-key-codes
     */
    export class Input {
        public lastClick: MouseEvent;
        private pressed = new Array<boolean>();

        constructor(canvas: HTMLCanvasElement, doc: HTMLDocument) {
            canvas.addEventListener("click", ev => this.click(ev));
            canvas.addEventListener("mousewheel", ev => this.wheel(ev));
            doc.addEventListener("keydown", ev => this.keyDown(ev));
            doc.addEventListener("keyup", ev => this.keyUp(ev));
        }

        public isDown(key: CtlKey): boolean {
            return this.pressed[key];
        }

        private keyUp(ev: KeyboardEvent) {
            this.pressed[ev.keyCode] = false;
        }

        private keyDown(ev: KeyboardEvent) {
            this.pressed[ev.keyCode] = true;
        }

        private wheel(ev: MouseWheelEvent) {
            // nothing
        }

        private click(ev: MouseEvent) {
            this.lastClick = ev;
        }
    }
}
