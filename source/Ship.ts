namespace deltav {
    export class Ship extends Body {

        protected power = 20000;
        protected angularPower = 20000;
        protected gattlingGun: GattlingGun;
        protected canon: Canon;

        constructor(logger: Logger, position: Vector) {
            super(logger, position);

            this.mass = 10;

            this.gattlingGun = new GattlingGun(this);
            this.canon = new Canon(this);

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

            this.gattlingGun.update(time);
            this.canon.update(time);
            if (input.isDown(CtlKey.FirePrimary) && this.gattlingGun.ready()) {
                this.gattlingGun.fire(world, this.position, this.velocity);
            }
            if (input.isDown(CtlKey.FireSecondary) && this.canon.ready()) {
                this.canon.fire(world, this.position, this.velocity);
            }

            // calc net forces
            let force = Vector.Zero(2);
            let directionVector = Vector.create([1, 0]).rotate(this.heading, Vector.Zero(2));

            if (input.isDown(CtlKey.Accelerate)) {
                
                let throttle = input.rate(CtlKey.Accelerate);
                force = force.add(directionVector.multiply(throttle * this.power));

                let exhaust = this.position.add(this.velocity.toUnitVector().multiply(-10));
                world.addStaticBody(
                    new Smoke(this.logger, exhaust, this.velocity.multiply(-1), 1));

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
            super.render(ctx);

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
            return this.gattlingGun.recentlyFired(bullet)
                || this.canon.recentlyFired(bullet);
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
}
