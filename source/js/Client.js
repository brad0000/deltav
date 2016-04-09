var deltav;
(function (deltav) {
    class Client {
        constructor(canvas, logArea) {
            this.clock = 0;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            this.logger = new deltav.Logger(logArea);
            this.world = new deltav.World(canvas.width, canvas.height);
            this.input = new deltav.Input(canvas, document);
            this.ctx = canvas.getContext("2d");
            this.world.things.push(new deltav.Ship(this.logger, 400, 500));
            this.startGameLoop();
        }
        startGameLoop() {
            setInterval(() => {
                this.updateWorld(0.033);
                this.renderWorld();
            }, 30);
        }
        updateWorld(time) {
            this.clock += time;
            this.world.update(time, this.input);
        }
        renderWorld() {
            this.ctx.strokeStyle = "gray";
            this.ctx.strokeRect(0, 0, this.world.width, this.world.height);
            this.ctx.stroke();
            this.ctx.strokeStyle = "black";
            this.ctx.strokeText(this.clock.toFixed(1), 20, 20);
            this.ctx.stroke();
            this.world.render(this.ctx);
        }
    }
    deltav.Client = Client;
})(deltav || (deltav = {}));

//# sourceMappingURL=Client.js.map
