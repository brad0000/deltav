var deltav;
(function (deltav) {
    class Logger {
        constructor(logArea) {
            this.logArea = logArea;
        }
        log(s) {
            let message = (s + "\n" + this.logArea.value);
            this.logArea.value = message;
        }
    }
    deltav.Logger = Logger;
})(deltav || (deltav = {}));

//# sourceMappingURL=app.js.map
