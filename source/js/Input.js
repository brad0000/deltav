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
        CtlKey[CtlKey["Fire"] = 17] = "Fire";
    })(deltav.CtlKey || (deltav.CtlKey = {}));
    var CtlKey = deltav.CtlKey;
    class Input {
        constructor(canvas, doc) {
            this.pressed = new Array();
            canvas.addEventListener("click", ev => this.click(ev));
            canvas.addEventListener("mousewheel", ev => this.wheel(ev));
            doc.addEventListener("keydown", ev => this.keyDown(ev));
            doc.addEventListener("keyup", ev => this.keyUp(ev));
        }
        isDown(key) {
            return this.pressed[key];
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
