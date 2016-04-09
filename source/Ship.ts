namespace deltav {

    export class Ship extends Thing {

        private power = 5000;
        private angularPower = 2000;
        private weapon: Weapon;

        constructor(logger: Logger, x: number, y: number) {
            super(logger, x, y);
            this.weapon = new Weapon(this);
        }

        public update(time: number, world: World, input: Input) {

            super.update(time, world, input);

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
                    .multiply(this.angularPower)
                    .multiply(time);
                this.acceleration = this.acceleration.add(rotation);
            }
        }

        public render(ctx: CanvasRenderingContext2D) {
            ctx.beginPath();
            ctx.arc(this.getX(), this.getY(), this.mass, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = "black";
            ctx.strokeText(this.report(), 20, 40);
            ctx.stroke();

            if  (this.velocity.modulus() > 0.5) {
                ctx.moveTo(this.getX(), this.getY());
                let endOfLine = this.position.add(this.velocity.toUnitVector().multiply(this.mass * 2));
                ctx.lineTo(endOfLine.e(1), endOfLine.e(2));
                ctx.stroke();
            }
        }

        public report(): string {
            return "p " + this.fv(this.position, 0)
                + " h " + this.fh(this.velocity.toAngle())
                + " v " + this.velocity.modulus().toFixed(2)
                + " a " + this.acceleration.modulus().toFixed(2);
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
