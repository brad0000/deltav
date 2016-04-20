namespace deltav {
    
    export class Ship extends Body {

        protected power = 20000;
        protected angularPower = 20000;
        protected weaponGroups: WeaponGroup[];
        protected engines: Engine[];
        
        protected img: HTMLImageElement;

        constructor(logger: Logger, position: Vector) {
            super(logger, position);

            this.mass = 10;
            this.radius = 50;

            this.brush = "red";

            this.velocity = Vector.create([0, 1]);

            let geo = [
                Vector.create([-2, -3]), // back of wing
                Vector.create([0, -3]),
                Vector.create([1, -1]),
                Vector.create([4, -.8]), // top right nose
                Vector.create([4, .8]),
                Vector.create([1, 1]),
                Vector.create([0, 3]),
                Vector.create([-2, 3]), // back of wing
                Vector.create([-1.5, 1]),
                Vector.create([-2, 1]),
                Vector.create([-2, -1]),
                Vector.create([-1.5, -1]),
            ];

            for (let i = 0; i < geo.length; i++) {
                geo[i] = geo[i].multiply(5);
            }

            this.setGeometry(geo);
        }

        public update(time: number, world: World, input: IInput): boolean {
            let moved = super.update(time, world, input);

            let speed = this.velocity.modulus();
            if (speed > 1) {
                this.heading = this.velocity.toAngle();
            }

            for (let i = 0; i < this.weaponGroups.length; i++) {
                this.weaponGroups[i].update(time);
            }

            if (input.isDown(CtlKey.WeaponGroup1) && this.weaponGroups[0].ready()) {
                this.weaponGroups[0].fire(world, this.position, this.velocity);
            }
            
            if (input.isDown(CtlKey.WeaponGroup2) && this.weaponGroups[1].ready()) {
                this.weaponGroups[1].fire(world, this.position, this.velocity);
            }

            // calc net forces
            let force = Vector.Zero(2);
            let directionVector = Vector.create([1, 0]).rotate(this.heading, Vector.Zero(2));

            if (input.isDown(CtlKey.Accelerate)) {
                
                let throttle = input.rate(CtlKey.Accelerate);
                force = force.add(directionVector.multiply(throttle * this.power));

                for (let i = 0; i < this.engines.length; i++) {
                    this.engines[i].update(world);
                }

            } else if (input.isDown(CtlKey.Brake)) {
                let brake = input.rate(CtlKey.Brake);
                force = force.add(directionVector.multiply(-1).multiply(brake * this.power));
            }
            
            // newton
            this.acceleration = force.divide(this.mass).multiply(time);

            // change heading
            let veerRight = input.isDown(CtlKey.Clockwise);
            let veerLeft = input.isDown(CtlKey.AntiClockwise);
            let rotation: Vector = null;
            if (veerRight || veerLeft) {
                
                let rate = input.rate(veerLeft ? CtlKey.AntiClockwise : CtlKey.Clockwise);
                
                rotation = this.velocity
                    .rotate(Math.PI / 2 * (veerRight ? 1 : -1), Vector.Zero(2))
                    .toUnitVector()
                    .multiply(this.angularPower * rate)
                    .multiply(time);
                    
                this.acceleration = this.acceleration.add(rotation);

                // let rad = Math.PI / 2 * (veerRight ? -1 : 1);
                // let exhaust = this.position.add(Vector.create([4, 0]).rotate(this.heading, this.position));
                // world.bodies.push(
                //     new Smoke(this, exhaust.e(1), exhaust.e(2), this.velocity.rotate(rad, this.velocity)));
            }
            
            return moved;
        }

        public report(): string {
            return "p " + this.fv(this.position, 0)
                + " h " + this.fh(this.velocity.toAngle())
                + " v " + this.velocity.modulus().toFixed(2)
                + " a " + this.acceleration.modulus().toFixed(2);
        }

        public render(ctx: CanvasRenderingContext2D) {
            
            if (this.img == null) {
                super.render(ctx);
            } else {
                
                // supposedly these are expensive:
                // ctx.save();
                // ctx.restore();
                
                ctx.translate(this.getX(), this.getY());
                ctx.rotate(this.heading);
                ctx.drawImage(this.img, -this.radius, -this.radius / 2, this.radius * 2, this.radius);
                ctx.rotate(-this.heading);
                ctx.translate(-this.getX(), -this.getY());
                
            }

            // if  (this.velocity.modulus() > 0.5) {
            //     ctx.beginPath();
            //     ctx.strokeStyle = "red";
            //     ctx.moveTo(this.getX(), this.getY());
            //     let endOfLine = this.position.add(this.velocity.toUnitVector().multiply(this.mass * 2));
            //     ctx.lineTo(endOfLine.e(1), endOfLine.e(2));
            //     ctx.stroke();
            // }

            // logging
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.font = "10px Arial";
            ctx.fillText((this.health * 100).toFixed(0), this.getX() - 10, this.getY() - 20);
            ctx.fill();
        }

        public recentlyFired(bullet: Bullet): boolean {
            for (let i = 0; i < this.weaponGroups.length; i++) {
                if (this.weaponGroups[i].recentlyFired(bullet)) {
                    return true;
                }
            }
            return false;
        }

        // private scaleAngularPower(speed: number): number {
        //     return this.angularPower * speed;
        // }

        private fh(rad: number): string {
            let deg = rad * 180 / Math.PI;
            return deg.toFixed(0);
        }

        private fv(v: Vector, dp: number): string {
            let e = v.elements;
            return e[0].toFixed(dp) + ", " + e[1].toFixed(dp);
        }
    }
    
        export class Hornet extends Ship {
        constructor(logger: Logger, position: Vector) {
            super(logger, position);

                this.img = <HTMLImageElement>document.images.namedItem("hornet");
                this.mass = 10;
                this.radius = 30;
            
                this.weaponGroups = [
                    new WeaponGroup(this.logger, this, [ new GattlingGun(this, Vector.create([this.radius, 0])) ]),
                    new WeaponGroup(this.logger, this, [ new Canon(this, Vector.create([this.radius, 0])) ]),
                ];
                
                this.engines = [
                    new Engine(this.logger, this, Vector.create([-this.radius + 5, 0])),  
                ];
        }
    }
    
    export class Constellation extends Ship {
        constructor(logger: Logger, position: Vector) {
            super(logger, position);

                this.img = <HTMLImageElement>document.images.namedItem("constellation");
                this.mass = 38;
                this.radius = 85;
                this.power = 50000;
                this.angularPower = 10000;

                this.weaponGroups = [
                    new WeaponGroup(this.logger, this, [ 
                        new GattlingGun(this, Vector.create([0, -20])),
                        new GattlingGun(this, Vector.create([0, 20])),
                    ]),
                    new WeaponGroup(this.logger, this, [ new Canon(this, Vector.create([this.radius, 0])) ]),
                ];

                this.engines = [
                    new Engine(this.logger, this, Vector.create([-this.radius + 5, 20])),  
                    new Engine(this.logger, this, Vector.create([-this.radius + 5, -20])),
                ];
        }
    }
    
    export class Engine {
        constructor(private logger: Logger, private ship: Ship, private position: Vector) {
            
        }
        
        public update(world: World) {
            
            let shipPosition = this.ship.getP();
            let exhaust = shipPosition.add(this.position).rotate(this.ship.getH(), shipPosition);
            
            world.addStaticBody(new Smoke(this.logger, exhaust, Vector.Zero(2), 1));
        }
    }

}
