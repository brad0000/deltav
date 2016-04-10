namespace deltav {

    export class World extends Box {
        public drag = -0.9;
        private staticBodies = new Array<Body>();
        private dynamicBodies = new Array<Body>();

        private gcCountdown = 10;

        constructor(private logger: Logger, public width: number, public height: number) {
            super(0, height, width, 0);

            for (let i = 0; i < 500; i++) {
                this.addStaticBody(
                    new Star(
                        this.logger,
                        Vector.create([
                            Math.random() * this.width,
                            Math.random() * this.height,
                        ]),
                        Math.random() * 1.5));
            }

            for (let i = 0; i < 50; i++) {
                this.addStaticBody(
                    new Asteroid(
                        this.logger,
                        Vector.create([
                            Math.random() * this.width,
                            Math.random() * this.height,
                        ]),
                        Math.random() * 30));
            }

            this.addDynamicBody(
                new Ship(this.logger, Vector.create([this.width / 2, this.height / 4])));

            for (let i = 0; i < 100; i++) {
                this.addDynamicBody(
                    new Drone(
                        this.logger,
                        Vector.create([
                            Math.random() * this.width,
                            Math.random() * this.height,
                        ])));
            }
        }

        public addStaticBody(body: Body) {
            this.staticBodies.push(body);
        }

        public addDynamicBody(body: Body) {
            this.dynamicBodies.push(body);
        }

        public update(time: number, input: IInput) {
            this.gcCountdown -= time;

            // collision detection
            let a, b: Body;
            for (let i = 0; i < this.dynamicBodies.length; i++) {
                a = this.dynamicBodies[i];
                for (let j = 0; j < this.dynamicBodies.length; j++) {
                    if (i !== j) {
                        b = this.dynamicBodies[j];
                        if (this.intersect(a, b)) {
                            // bang.
                            let wreakage = a.collide(b);
                            this.addStaticBody(wreakage);
                        }
                    }
                }
            }

            if (this.gcCountdown < 0) {
                this.updateBodiesWithGC(this.staticBodies, time, input);
                this.updateBodiesWithGC(this.dynamicBodies, time, input);
            } else {
                this.updateBodies(this.staticBodies, time, input);
                this.updateBodies(this.dynamicBodies, time, input);
            }
        }

        public render(ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fill();

            this.renderBodies(this.staticBodies, ctx);
            this.renderBodies(this.dynamicBodies, ctx);
        }

        private intersect(a: Body, b: Body): boolean {
            if (a.isDead || b.isDead) {
                return false;
            } else {
                if (a.getCollisionBox().intersects(b.getCollisionBox())) {
                    if (!this.isBulletHittingWeapon(a, b)) {
                        return true;
                    }
                } else {
                    return false;
                }
            }
        }

        private isBulletHittingWeapon(a: Body, b: Body): boolean {
            // Check for an edge case where a bullet collides with a ship it was just fired from.
            if (a instanceof Ship && b instanceof Bullet) {
                return (<Ship>a).recentlyFired(<Bullet>b);
            } else if (a instanceof Bullet && b instanceof Ship) {
                return (<Ship>b).recentlyFired(<Bullet>a);
            } else {
                return false;
            }
        }

        private updateBodiesWithGC(bodies: Array<Body>, time: number, input: IInput) {
            let old = bodies;
            bodies = [];
            for (let i = 0; i < old.length; i++) {
                if (!old[i].isDead) {
                    old[i].update(time, this, input);
                    bodies.push(old[i]);
                }
            }
        }

        private updateBodies(bodies: Array<Body>, time: number, input: IInput) {
            for (let i = 0; i < bodies.length; i++) {
                if (!bodies[i].isDead) {
                    bodies[i].update(time, this, input);
                }
            }
        }

        private renderBodies(bodies: Array<Body>, ctx: CanvasRenderingContext2D) {
             for (let i = 0; i < bodies.length; i++) {
                if (!bodies[i].isDead) {
                    bodies[i].render(ctx);
                }
             }
        }
    }
}
