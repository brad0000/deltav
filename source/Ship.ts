namespace deltav {
    export class Ship extends Body {

        protected power = 5000;
        protected angularPower = 20;
        protected weapon: Weapon;

        constructor(logger: Logger, x: number, y: number) {
            super(logger, x, y);

            this.weapon = new Weapon(this);
            this.brush = "red";

            this.velocity = Vector.create([0, 1]);

            this.geometry = [
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

            for (let i = 0; i < this.geometry.length; i++) {
                this.geometry[i] = this.geometry[i].multiply(5);
            }
        }

        public update(time: number, world: World, input: IInput) {
            super.update(time, world, input);

            let speed = this.velocity.modulus();
            if (speed > 1) {
                this.heading = this.velocity.toAngle();
            }

            this.weapon.update(time);
            if (input.isDown(CtlKey.Fire) && this.weapon.ready()) {
                this.weapon.fire(world, this.position, this.velocity, this.mass);
            }

            // calc net forces
            let force = Vector.Zero(2);
            if (input.isDown(CtlKey.Up)) {
                force = force.add(Vector.create([0, -this.power]));
            } else if (input.isDown(CtlKey.Down)) {
                force = force.add(Vector.create([0, this.power]));
            }
            if (input.isDown(CtlKey.Left)) {
                force = force.add(Vector.create([-this.power, 0]));
            } else if (input.isDown(CtlKey.Right)) {
                force = force.add(Vector.create([this.power, 0]));
            }

            if (input.isDown(CtlKey.Accelerate)) {
                if (this.velocity.eql(Vector.Zero(2))) {
                    // Allow user to accelerate from standing stop.
                    this.velocity.setElements([0, -0.1]);
                }
                force = force.add(this.velocity.toUnitVector().multiply(this.power));

                let exhaust = this.position.add(this.velocity.toUnitVector().multiply(-10));
                world.bodies.push(
                    new Smoke(this, exhaust.e(1), exhaust.e(2), this.velocity.multiply(-1)));

            } else if (input.isDown(CtlKey.Brake)) {
                force = force.add(this.velocity.rotate(Math.PI, Vector.Zero(2)).toUnitVector().multiply(this.power));
            }
            this.acceleration = force.divide(this.mass).multiply(time);

            // change heading
            let veerRight = input.isDown(CtlKey.Clockwise);
            let veerLeft = input.isDown(CtlKey.AntiClockwise);
            let rotation: Vector = null;
            if (veerRight || veerLeft) {
                rotation = this.velocity
                    .rotate(Math.PI / 2 * (veerRight ? 1 : -1), Vector.Zero(2))
                    .toUnitVector()
                    .multiply(this.scaleAngularPower(speed))
                    .multiply(time);
                this.acceleration = this.acceleration.add(rotation);

                // let rad = Math.PI / 2 * (veerRight ? -1 : 1);
                // let exhaust = this.position.add(Vector.create([4, 0]).rotate(this.heading, this.position));
                // world.bodies.push(
                //     new Smoke(this, exhaust.e(1), exhaust.e(2), this.velocity.rotate(rad, this.velocity)));
            }
        }

        public report(): string {
            return "p " + this.fv(this.position, 0)
                + " h " + this.fh(this.velocity.toAngle())
                + " v " + this.velocity.modulus().toFixed(2)
                + " a " + this.acceleration.modulus().toFixed(2);
        }

        public render(ctx: CanvasRenderingContext2D) {
            super.render(ctx);

            if  (this.velocity.modulus() > 0.5) {
                ctx.beginPath();
                ctx.strokeStyle = "red";
                ctx.moveTo(this.getX(), this.getY());
                let endOfLine = this.position.add(this.velocity.toUnitVector().multiply(this.mass * 2));
                ctx.lineTo(endOfLine.e(1), endOfLine.e(2));
                ctx.stroke();
            }

            // logging
            // ctx.beginPath();
            // ctx.fillStyle = "white";
            // ctx.font = "20px Arial";
            // ctx.fillText(this.report(), 20, 40);
            // ctx.fill();
        }

        private scaleAngularPower(speed: number): number {
            return this.angularPower * speed;
        }

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
