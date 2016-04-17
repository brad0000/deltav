namespace deltav {

    export class World extends Box {
        public drag = -0.9;
        private player: Ship;
        private gcCountdown = 10;

        private loader: WorldLoader;
        
        private staticBodyTree: RTree;
        private staticBodyList = new Array<Body>();
        
        private dynamicBodyTree: RTree;
        private dynamicBodyList = new Array<Body>();

        constructor(private logger: Logger, public width: number, public height: number) {
            super(0, height, width, 0);

            this.staticBodyTree = new RTree(this);
            this.dynamicBodyTree = new RTree(this);

            this.player = new Ship(this.logger, Vector.create([this.width / 2, this.height / 2]));
            this.addDynamicBody(this.player);

            this.loader = new WorldLoader(logger, this);
        }

        public addStaticBody(body: Body) {
            body.tag = this.staticBodyList.length; 
            this.staticBodyList[body.tag] = body;

            this.staticBodyTree.add(body);
        }

        public addDynamicBody(body: Body) {
            body.tag = this.dynamicBodyList.length; 
            this.dynamicBodyList[body.tag] = body;
            
            this.dynamicBodyTree.add(body);
        }

        public update(time: number, input: IInput) {
            this.gcCountdown -= time;

            this.loader.update(time);

            // collision detection
            let skipHashset: { [id: string]: boolean; } = {};
            let a, b: Body;
            let nearbyBodies: Array<Body>;
            for (let i = 0; i < this.dynamicBodyList.length; i++) {
                a = this.dynamicBodyList[i];
                
                // Find all dynamicBodies in the vicinity, this will include body a.
                nearbyBodies = this.dynamicBodyTree.search(a.getBoundingBox().scale(10, 10));
                
                for (let j = 0; j < nearbyBodies.length; j++) {
                    // get body b
                    b = nearbyBodies[j];
                    
                    // Don't check for collisions between a body and itself, or between a two bodies
                    // that we've already checked. 
                    if (a.tag !== b.tag && !skipHashset[a.tag + "," + b.tag]) {
                        // flag not to check the inverse
                        skipHashset[b.tag + "," + a.tag] = true;

                        // check for collisions
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
            } else {
                this.updateBodies(this.dynamicBodyList, this.dynamicBodyTree, time, input);
                this.updateBodies(this.staticBodyList, this.staticBodyTree, time, input);
            }
        }

        public render(ctx: CanvasRenderingContext2D, clip: Box) {
            this.renderBodies(this.staticBodyTree.search(clip), ctx, null);
            this.renderBodies(this.dynamicBodyTree.search(clip), ctx, null);
        }

        public getPlayerPosition() {
            return this.player.getP();
        }

        public addStar(star: Body) {
            this.staticBodyTree.add(star);
        }

        private handleCollision(a: Body, b: Body) {

            let isADead = a.collide(b);
            let isBDead = b.collide(a);
            
            let wreakage: Wreckage;
            
            if (isADead && isBDead) {
                wreakage = new Wreckage(
                    this.logger,
                    a.getP().avg(b.getP()), 
                    a.getV().avg(b.getV()),
                    (a.getR() + b.getR()) / 2);
            } else if (isADead) {
                wreakage = new Wreckage(
                    this.logger,
                    a.getP(), 
                    a.getV(),
                    a.getR());
            } else if (isBDead) {
                wreakage = new Wreckage(
                    this.logger,
                    b.getP(), 
                    b.getV(),
                    b.getR());
            }
            
            if (wreakage != null) {
                this.addStaticBody(wreakage);
            }
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

        private updateBodiesWithGC(bodies: Array<Body>, bodyTree: RTree, time: number, input: IInput) {
            let body: Body;
            for (let i = 0; i < bodies.length; i++) {
                body = bodies[i];
                if (body.isDead) {
                    bodies.splice(i, 1);
                    bodyTree.remove(body);
                    i--;
                } else {
                    if (body.update(time, this, input)) {
                        bodyTree.remove(body);
                        bodyTree.add(body);
                    }
                }
            }
        }

        private updateBodies(bodies: Array<Body>, bodyTree: RTree, time: number, input: IInput) {
            let body: Body;
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

        private renderBodies(bodies: Array<Body>, ctx: CanvasRenderingContext2D, clip: Box) {

            if (clip == null) {
                
                for (let i = 0; i < bodies.length; i++) {
                    if (!bodies[i].isDead) {
                        bodies[i].render(ctx);
                    }
                }
                
            } else {
             
                for (let i = 0; i < bodies.length; i++) {
                    if (!bodies[i].isDead && clip.intersects(bodies[i].getBoundingBox())) {
                        bodies[i].render(ctx);
                    }
                }
            }
            
        }
    }
    
    export class WorldLoader {
        private starsPreload: Array<Body>;
        private starsPreloadIndex: number;
        
        constructor(private logger: Logger, private world: World) {

            this.starsPreload = new Array<Body>(500000);
            this.starsPreloadIndex = 0;
            
            for (let i = 0; i < this.starsPreload.length; i++) {
                this.starsPreload[i] = 
                    new Star(
                        this.logger,
                        Vector.create([
                            Math.random() * this.world.width,
                            Math.random() * this.world.height,
                        ]),
                        Math.random() * 1.5);
            }

            for (let i = 0; i < 1000; i++) {
                this.world.addStaticBody(
                    new Asteroid(
                        this.logger,
                        Vector.create([
                            Math.random() * this.world.width,
                            Math.random() * this.world.height,
                        ]),
                        Math.random() * 30));
            }

            // for (let i = 0; i < 10; i++) {
            //     this.world.addDynamicBody(
            //         new Drone(
            //             this.logger,
            //             Vector.create([
            //                 Math.random() * this.world.width,
            //                 Math.random() * this.world.height,
            //             ])));
            // }
            
        }
        
        public update(time: number) {
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
    
}
