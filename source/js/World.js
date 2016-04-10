var deltav;
(function (deltav) {
    class World extends deltav.Box {
        constructor(logger, width, height) {
            super(0, height, width, 0);
            this.logger = logger;
            this.width = width;
            this.height = height;
            this.drag = -0.9;
            this.staticBodies = new Array();
            this.dynamicBodies = new Array();
            this.gcCountdown = 10;
            for (let i = 0; i < 500; i++) {
                this.addStaticBody(new deltav.Star(this.logger, Vector.create([
                    Math.random() * this.width,
                    Math.random() * this.height,
                ]), Math.random() * 1.5));
            }
            for (let i = 0; i < 50; i++) {
                this.addStaticBody(new deltav.Asteroid(this.logger, Vector.create([
                    Math.random() * this.width,
                    Math.random() * this.height,
                ]), Math.random() * 30));
            }
            this.addDynamicBody(new deltav.Ship(this.logger, Vector.create([this.width / 2, this.height / 4])));
            for (let i = 0; i < 100; i++) {
                this.addDynamicBody(new deltav.Drone(this.logger, Vector.create([
                    Math.random() * this.width,
                    Math.random() * this.height,
                ])));
            }
        }
        addStaticBody(body) {
            this.staticBodies.push(body);
        }
        addDynamicBody(body) {
            this.dynamicBodies.push(body);
        }
        update(time, input) {
            this.gcCountdown -= time;
            let a, b;
            for (let i = 0; i < this.dynamicBodies.length; i++) {
                a = this.dynamicBodies[i];
                for (let j = 0; j < this.dynamicBodies.length; j++) {
                    if (i !== j) {
                        b = this.dynamicBodies[j];
                        if (this.intersect(a, b)) {
                            let wreakage = a.collide(b);
                            this.addStaticBody(wreakage);
                        }
                    }
                }
            }
            if (this.gcCountdown < 0) {
                this.updateBodiesWithGC(this.staticBodies, time, input);
                this.updateBodiesWithGC(this.dynamicBodies, time, input);
            }
            else {
                this.updateBodies(this.staticBodies, time, input);
                this.updateBodies(this.dynamicBodies, time, input);
            }
        }
        render(ctx) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fill();
            this.renderBodies(this.staticBodies, ctx);
            this.renderBodies(this.dynamicBodies, ctx);
        }
        intersect(a, b) {
            if (a.isDead || b.isDead) {
                return false;
            }
            else {
                if (a.getCollisionBox().intersects(b.getCollisionBox())) {
                    if (!this.isBulletHittingWeapon(a, b)) {
                        return true;
                    }
                }
                else {
                    return false;
                }
            }
        }
        isBulletHittingWeapon(a, b) {
            if (a instanceof deltav.Ship && b instanceof deltav.Bullet) {
                return a.recentlyFired(b);
            }
            else if (a instanceof deltav.Bullet && b instanceof deltav.Ship) {
                return b.recentlyFired(a);
            }
            else {
                return false;
            }
        }
        updateBodiesWithGC(bodies, time, input) {
            let old = bodies;
            bodies = [];
            for (let i = 0; i < old.length; i++) {
                if (!old[i].isDead) {
                    old[i].update(time, this, input);
                    bodies.push(old[i]);
                }
            }
        }
        updateBodies(bodies, time, input) {
            for (let i = 0; i < bodies.length; i++) {
                if (!bodies[i].isDead) {
                    bodies[i].update(time, this, input);
                }
            }
        }
        renderBodies(bodies, ctx) {
            for (let i = 0; i < bodies.length; i++) {
                if (!bodies[i].isDead) {
                    bodies[i].render(ctx);
                }
            }
        }
    }
    deltav.World = World;
})(deltav || (deltav = {}));

//# sourceMappingURL=World.js.map
