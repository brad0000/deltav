var deltav;
(function (deltav) {
    (function (CtlKey) {
        CtlKey[CtlKey["Up"] = 104] = "Up";
        CtlKey[CtlKey["Down"] = 98] = "Down";
        CtlKey[CtlKey["Left"] = 100] = "Left";
        CtlKey[CtlKey["Right"] = 102] = "Right";
        CtlKey[CtlKey["Accelerate"] = 38] = "Accelerate";
        CtlKey[CtlKey["Brake"] = 40] = "Brake";
        CtlKey[CtlKey["Clockwise"] = 39] = "Clockwise";
        CtlKey[CtlKey["AntiClockwise"] = 37] = "AntiClockwise";
        CtlKey[CtlKey["WeaponGroup1"] = 17] = "WeaponGroup1";
        CtlKey[CtlKey["WeaponGroup2"] = 32] = "WeaponGroup2";
    })(deltav.CtlKey || (deltav.CtlKey = {}));
    var CtlKey = deltav.CtlKey;
    class Input {
        constructor(canvas, doc) {
            this.pressed = new Array();
            canvas.addEventListener("click", ev => this.click(ev));
            canvas.addEventListener("mousewheel", ev => this.wheel(ev));
            doc.addEventListener("keydown", ev => this.keyDown(ev));
            doc.addEventListener("keyup", ev => this.keyUp(ev));
            window.addEventListener("gamepadconnected", ev => this.gamePadOn(ev));
            window.addEventListener("gamepaddisconnected", ev => this.gamePadOff(ev));
        }
        isDown(key) {
            let gamepad = navigator.getGamepads()[0];
            if (gamepad == null) {
                return this.pressed[key];
            }
            else {
                return this.gamepadIsKeyDown(gamepad, key);
            }
        }
        rate(key) {
            let gamepad = navigator.getGamepads()[0];
            if (gamepad == null) {
                return 1;
            }
            else {
                return this.gamepadRate(gamepad, key);
            }
        }
        gamepadRate(gamepad, key) {
            switch (key) {
                case CtlKey.Accelerate: return -Math.min(gamepad.axes[1], 0);
                case CtlKey.Brake: return Math.max(gamepad.axes[1], 0);
                case CtlKey.AntiClockwise: return -Math.min(gamepad.axes[0], 0);
                case CtlKey.Clockwise: return Math.max(gamepad.axes[0], 0);
            }
        }
        gamepadIsKeyDown(gamepad, key) {
            switch (key) {
                case CtlKey.WeaponGroup1: return gamepad.buttons[0].pressed;
                case CtlKey.WeaponGroup2: return gamepad.buttons[1].pressed;
                case CtlKey.Accelerate: return this.gamepadRate(gamepad, key) > 0.1;
                case CtlKey.Brake: return this.gamepadRate(gamepad, key) > 0.1;
                case CtlKey.AntiClockwise: return this.gamepadRate(gamepad, key) > 0.2;
                case CtlKey.Clockwise: return this.gamepadRate(gamepad, key) > 0.2;
            }
        }
        gamePadOn(ev) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", ev.gamepad.index, ev.gamepad.id, ev.gamepad.buttons.length, ev.gamepad.axes.length);
        }
        gamePadOff(ev) {
            console.log("Gamepad disconnected from index %d: %s", ev.gamepad.index, ev.gamepad.id);
        }
        keyUp(ev) {
            this.pressed[ev.keyCode] = false;
        }
        keyDown(ev) {
            this.pressed[ev.keyCode] = true;
        }
        wheel(ev) {
        }
        click(ev) {
            this.lastClick = ev;
        }
    }
    deltav.Input = Input;
})(deltav || (deltav = {}));

//# sourceMappingURL=Input.js.map
