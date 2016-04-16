var deltav;
(function (deltav) {
    class Client {
        constructor(canvas, logArea) {
            this.clock = 0;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            this.logger = new deltav.Logger(logArea);
            this.world = new deltav.World(this.logger, 5000, 5000);
            this.view = new View(this.logger, canvas.width, canvas.height, this.world);
            this.input = new deltav.Input(canvas, document);
            this.ctx = canvas.getContext("2d");
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
            this.view.update(time, this.world, this.input);
        }
        renderWorld() {
            this.view.render(this.ctx);
        }
    }
    deltav.Client = Client;
    class View extends deltav.Box {
        constructor(logger, width, height, world) {
            super(0, height, width, 0);
            this.logger = logger;
            this.world = world;
        }
        update(time, world, input) {
            let playerPosition = world.getPlayerPosition();
            this.centerOn(playerPosition);
            this.clamp(world);
        }
        render(ctx) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fill();
            ctx.translate(-this.west, -this.north);
            this.world.render(ctx, this);
            ctx.translate(this.west, this.north);
        }
    }
    deltav.View = View;
})(deltav || (deltav = {}));

//# sourceMappingURL=Client.js.map
