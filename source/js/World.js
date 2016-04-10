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
            this.gcCountdown = 10;
            this.south = height;
            this.east = width;
            for (let i = 0; i < 500; i++) {
                this.bodies.push(new deltav.Star(this.logger, Math.random() * this.width, Math.random() * this.height, Math.random() * 1.5));
            }
            for (let i = 0; i < 50; i++) {
                this.bodies.push(new deltav.Asteroid(this.logger, Math.random() * this.width, Math.random() * this.height, Math.random() * 30));
            }
            this.bodies.push(new deltav.Ship(this.logger, this.width / 2, this.height / 4));
            for (let i = 0; i < 10; i++) {
                this.bodies.push(new deltav.Drone(this.logger, Math.random() * this.width, Math.random() * this.height));
            }
        }
        update(time, input) {
            this.gcCountdown -= time;
            if (this.gcCountdown < 0) {
                let old = this.bodies;
                this.bodies = [];
                for (let i = 0; i < old.length; i++) {
                    if (!old[i].isDead) {
                        old[i].update(time, this, input);
                        this.bodies.push(old[i]);
                    }
                }
            }
            else {
                for (let i = 0; i < this.bodies.length; i++) {
                    if (!this.bodies[i].isDead) {
                        this.bodies[i].update(time, this, input);
                    }
                }
            }
        }
        render(ctx) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fill();
            for (let i = 0; i < this.bodies.length; i++) {
                if (!this.bodies[i].isDead) {
                    this.bodies[i].render(ctx);
                }
            }
        }
    }
    deltav.World = World;
})(deltav || (deltav = {}));

//# sourceMappingURL=World.js.map
