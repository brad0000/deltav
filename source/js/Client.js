var deltav;
(function (deltav) {
    class Client {
        constructor(canvas, logArea) {
            this.clock = 0;
            this.lastLoopDuration = 0;
            this.lastUpdateDuration = 0;
            this.lastRenderDuration = 0;
            this.lastUpdateTime = Date.now();
            this.lastTimeElapsed = 0;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            this.logger = new deltav.Logger(logArea);
            this.world = new deltav.World(this.logger, 100000, 100000);
            this.view = new View(this.logger, canvas.width, canvas.height, this.world);
            this.input = new deltav.Input(canvas, document);
            this.ctx = canvas.getContext("2d");
            requestAnimationFrame(() => this.gameLoop());
        }
        gameLoop() {
            requestAnimationFrame(() => this.gameLoop());
            let now = Date.now();
            this.lastTimeElapsed = now - this.lastUpdateTime;
            this.updateWorld(this.lastTimeElapsed / 1000);
            this.lastUpdateDuration = Date.now() - now;
            this.lastUpdateTime = now;
            let renderStart = Date.now();
            this.renderWorld();
            this.lastRenderDuration = Date.now() - renderStart;
            this.lastLoopDuration = Date.now() - now;
        }
        updateWorld(time) {
            this.clock += time;
            this.world.update(time, this.input);
            this.view.update(time, this.world, this.input);
        }
        renderWorld() {
            this.view.render(this.ctx);
            this.ctx.strokeStyle = "white";
            this.ctx.strokeText("last elapsed: " + this.lastTimeElapsed, 20, 20);
            this.ctx.strokeText("last loop: " + this.lastLoopDuration, 20, 40);
            this.ctx.strokeText("last update: " + this.lastUpdateDuration, 20, 60);
            this.ctx.strokeText("last render: " + this.lastRenderDuration, 20, 80);
            this.ctx.stroke();
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
