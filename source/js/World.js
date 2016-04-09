var deltav;
(function (deltav) {
    class World {
        constructor(logger, width, height) {
            this.logger = logger;
            this.width = width;
            this.height = height;
            this.north = 0;
            this.south = 0;
            this.east = 0;
            this.west = 0;
            this.drag = -0.9;
            this.bodies = new Array();
            this.south = height;
            this.east = width;
            this.bodies.push(new deltav.Ship(this.logger, 400, 500));
            for (let i = 0; i < 50; i++) {
                this.bodies.push(new deltav.Asteroid(this.logger, Math.random() * this.width, Math.random() * this.height, Math.random() * 30));
            }
        }
        update(time, input) {
            for (let i = 0; i < this.bodies.length; i++) {
                this.bodies[i].update(time, this, input);
            }
        }
        render(ctx) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fill();
            for (let i = 0; i < this.bodies.length; i++) {
                this.bodies[i].render(ctx);
            }
        }
    }
    deltav.World = World;
})(deltav || (deltav = {}));

//# sourceMappingURL=World.js.map
