
namespace deltav {

    export interface IInput {
        lastClick: MouseEvent;
        isDown(key: CtlKey): boolean;
        rate(key: CtlKey): number;
    }

    export enum CtlKey {
        Up = 104,
        Down = 98,
        Left = 100,
        Right = 102,
        Accelerate = 38,
        Brake = 40,
        Clockwise = 39,
        AntiClockwise = 37,
        WeaponGroup1 = 17,
        WeaponGroup2 = 32,
    }
    /*
     * http://www.cambiaresearch.com/articles/15/javascript-key-codes
     */
    export class Input implements IInput {
        public lastClick: MouseEvent;
        private pressed = new Array<boolean>();
        // private gamepad: Gamepad = null;
        
        constructor(canvas: HTMLCanvasElement, doc: HTMLDocument) {
            canvas.addEventListener("click", ev => this.click(ev));
            canvas.addEventListener("mousewheel", ev => this.wheel(ev));
            doc.addEventListener("keydown", ev => this.keyDown(ev));
            doc.addEventListener("keyup", ev => this.keyUp(ev));
            
            window.addEventListener("gamepadconnected", ev => this.gamePadOn(<GamepadEvent>ev));
            window.addEventListener("gamepaddisconnected", ev => this.gamePadOff(<GamepadEvent>ev));
        }

        public isDown(key: CtlKey): boolean {
            let gamepad = navigator.getGamepads()[0];
            
            if (gamepad == null) {
                return this.pressed[key];
            } else {
                return this.gamepadIsKeyDown(gamepad, key);
            }
        }

        public rate(key: CtlKey): number {
            let gamepad = navigator.getGamepads()[0];
            
            if (gamepad == null) {
                return 1;
            } else {
                return this.gamepadRate(gamepad, key);
            }
        }

        private gamepadRate(gamepad: Gamepad, key: CtlKey): number {
            switch (key) {
                case CtlKey.Accelerate: return -Math.min(gamepad.axes[1], 0);
                case CtlKey.Brake: return Math.max(gamepad.axes[1], 0);
                case CtlKey.AntiClockwise: return -Math.min(gamepad.axes[0], 0);
                case CtlKey.Clockwise: return Math.max(gamepad.axes[0], 0);
            }
        }

        private gamepadIsKeyDown(gamepad: Gamepad, key: CtlKey): boolean {
            switch (key) {
                case CtlKey.WeaponGroup1: return gamepad.buttons[0].pressed;
                case CtlKey.WeaponGroup2: return gamepad.buttons[1].pressed;
                case CtlKey.Accelerate: return this.gamepadRate(gamepad, key) > 0.1;
                case CtlKey.Brake: return this.gamepadRate(gamepad, key) > 0.1;
                case CtlKey.AntiClockwise: return this.gamepadRate(gamepad, key) > 0.2;
                case CtlKey.Clockwise: return this.gamepadRate(gamepad, key) > 0.2;
            }
        }

        private gamePadOn(ev: GamepadEvent) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                ev.gamepad.index, ev.gamepad.id,
                ev.gamepad.buttons.length, ev.gamepad.axes.length);
        } 

        private gamePadOff(ev: GamepadEvent) {
            console.log("Gamepad disconnected from index %d: %s",
                ev.gamepad.index, ev.gamepad.id);
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
