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
            this.player = new deltav.Ship(this.logger, Vector.create([this.width / 2, this.height / 4]));
            this.addDynamicBody(this.player);
            for (let i = 0; i < 5; i++) {
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
            let skipHashset = {};
            let a, b;
            for (let i = 0; i < this.dynamicBodies.length; i++) {
                a = this.dynamicBodies[i];
                for (let j = 0; j < this.dynamicBodies.length; j++) {
                    if (i !== j || skipHashset[i + "," + j] === true) {
                        skipHashset[j + "," + i] = true;
                        b = this.dynamicBodies[j];
                        if (this.intersect(a, b)) {
                            this.handleCollision(a, b);
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
        render(ctx, clip) {
            this.renderBodies(this.staticBodies, ctx, clip);
            this.renderBodies(this.dynamicBodies, ctx, clip);
        }
        getPlayerPosition() {
            return this.player.getP();
        }
        handleCollision(a, b) {
            let isADead = a.collide(b);
            let isBDead = b.collide(a);
            let wreakage;
            if (isADead && isBDead) {
                wreakage = new deltav.Wreckage(this.logger, a.getP().avg(b.getP()), a.getV().avg(b.getV()), (a.getR() + b.getR()) / 2);
            }
            else if (isADead) {
                wreakage = new deltav.Wreckage(this.logger, a.getP(), a.getV(), a.getR());
            }
            else if (isBDead) {
                wreakage = new deltav.Wreckage(this.logger, b.getP(), b.getV(), b.getR());
            }
            if (wreakage != null) {
                this.addStaticBody(wreakage);
            }
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
        renderBodies(bodies, ctx, clip) {
            for (let i = 0; i < bodies.length; i++) {
                if (!bodies[i].isDead && clip.intersects(bodies[i].getBoundingBox())) {
                    bodies[i].render(ctx);
                }
            }
        }
    }
    deltav.World = World;
})(deltav || (deltav = {}));

//# sourceMappingURL=World.js.map
