var deltav;
(function (deltav) {
    class World extends deltav.Box {
        constructor(logger, width, height) {
            super(0, height, width, 0);
            this.logger = logger;
            this.width = width;
            this.height = height;
            this.drag = -0.9;
            this.gcCountdown = 10;
            this.staticBodyList = new Array();
            this.dynamicBodyList = new Array();
            this.staticBodyTree = new deltav.RTree(this);
            this.dynamicBodyTree = new deltav.RTree(this);
            this.player = new deltav.Ship(this.logger, Vector.create([this.width / 2, this.height / 4]));
            this.addDynamicBody(this.player);
            this.loader = new WorldLoader(logger, this);
        }
        addStaticBody(body) {
            body.tag = this.staticBodyList.length;
            this.staticBodyList[body.tag] = body;
            this.staticBodyTree.add(body);
        }
        addDynamicBody(body) {
            body.tag = this.dynamicBodyList.length;
            this.dynamicBodyList[body.tag] = body;
            this.dynamicBodyTree.add(body);
        }
        update(time, input) {
            this.gcCountdown -= time;
            this.loader.update(time);
            let skipHashset = {};
            let a, b;
            let nearbyBodies;
            for (let i = 0; i < this.dynamicBodyList.length; i++) {
                a = this.dynamicBodyList[i];
                nearbyBodies = this.dynamicBodyTree.search(a.getBoundingBox().scale(10, 10));
                for (let j = 0; j < nearbyBodies.length; j++) {
                    b = nearbyBodies[j];
                    if (a.tag !== b.tag && !skipHashset[a.tag + "," + b.tag]) {
                        skipHashset[b.tag + "," + a.tag] = true;
                        if (this.intersect(a, b)) {
                            this.handleCollision(a, b);
                        }
                    }
                }
            }
            if (this.gcCountdown < 0) {
                this.updateBodiesWithGC(this.dynamicBodyList, this.dynamicBodyTree, time, input);
                this.updateBodiesWithGC(this.staticBodyList, this.staticBodyTree, time, input);
                this.gcCountdown = 10;
            }
            else {
                this.updateBodies(this.dynamicBodyList, this.dynamicBodyTree, time, input);
                this.updateBodies(this.staticBodyList, this.staticBodyTree, time, input);
            }
        }
        render(ctx, clip) {
            this.renderBodies(this.staticBodyTree.search(clip), ctx, null);
            this.renderBodies(this.dynamicBodyTree.search(clip), ctx, null);
        }
        getPlayerPosition() {
            return this.player.getP();
        }
        addStar(star) {
            this.staticBodyTree.add(star);
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
        updateBodiesWithGC(bodies, bodyTree, time, input) {
            let body;
            for (let i = 0; i < bodies.length; i++) {
                body = bodies[i];
                if (body.isDead) {
                    bodies.splice(i, 1);
                    bodyTree.remove(body);
                    i--;
                }
                else {
                    if (body.update(time, this, input)) {
                        bodyTree.remove(body);
                        bodyTree.add(body);
                    }
                }
            }
        }
        updateBodies(bodies, bodyTree, time, input) {
            let body;
            for (let i = 0; i < bodies.length; i++) {
                body = bodies[i];
                if (!body.isDead) {
                    if (body.update(time, this, input)) {
                        bodyTree.remove(body);
                        bodyTree.add(body);
                    }
                }
            }
        }
        renderBodies(bodies, ctx, clip) {
            if (clip == null) {
                for (let i = 0; i < bodies.length; i++) {
                    if (!bodies[i].isDead) {
                        bodies[i].render(ctx);
                    }
                }
            }
            else {
                for (let i = 0; i < bodies.length; i++) {
                    if (!bodies[i].isDead && clip.intersects(bodies[i].getBoundingBox())) {
                        bodies[i].render(ctx);
                    }
                }
            }
        }
    }
    deltav.World = World;
    class WorldLoader {
        constructor(logger, world) {
            this.logger = logger;
            this.world = world;
            this.starsPreload = new Array(500000);
            this.starsPreloadIndex = 0;
            for (let i = 0; i < this.starsPreload.length; i++) {
                this.starsPreload[i] =
                    new deltav.Star(this.logger, Vector.create([
                        Math.random() * this.world.width,
                        Math.random() * this.world.height,
                    ]), Math.random() * 1.5);
            }
            for (let i = 0; i < 1000; i++) {
                this.world.addStaticBody(new deltav.Asteroid(this.logger, Vector.create([
                    Math.random() * this.world.width,
                    Math.random() * this.world.height,
                ]), Math.random() * 30));
            }
        }
        update(time) {
            if (this.starsPreload != null) {
                for (; this.starsPreloadIndex < this.starsPreload.length; this.starsPreloadIndex++) {
                    this.world.addStar(this.starsPreload[this.starsPreloadIndex]);
                }
                if (this.starsPreloadIndex === this.starsPreload.length - 1) {
                    this.starsPreload = [];
                    this.starsPreload = null;
                }
            }
        }
    }
    deltav.WorldLoader = WorldLoader;
})(deltav || (deltav = {}));

//# sourceMappingURL=World.js.map
