var deltav;
(function (deltav) {
    class Ship extends deltav.Body {
        constructor(logger, position) {
            super(logger, position);
            this.power = 5000;
            this.angularPower = 20;
            this.weapon = new deltav.Weapon(this);
            this.brush = "red";
            this.velocity = Vector.create([0, 1]);
            let geo = [
                Vector.create([-2, -3]),
                Vector.create([0, -3]),
                Vector.create([1, -1]),
                Vector.create([4, -.8]),
                Vector.create([4, .8]),
                Vector.create([1, 1]),
                Vector.create([0, 3]),
                Vector.create([-2, 3]),
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
        update(time, world, input) {
            super.update(time, world, input);
            let speed = this.velocity.modulus();
            if (speed > 1) {
                this.heading = this.velocity.toAngle();
            }
            this.weapon.update(time);
            if (input.isDown(deltav.CtlKey.Fire) && this.weapon.ready()) {
                this.weapon.fire(world, this.position, this.velocity, this.mass);
            }
            let force = Vector.Zero(2);
            if (input.isDown(deltav.CtlKey.Up)) {
                force = force.add(Vector.create([0, -this.power]));
            }
            else if (input.isDown(deltav.CtlKey.Down)) {
                force = force.add(Vector.create([0, this.power]));
            }
            if (input.isDown(deltav.CtlKey.Left)) {
                force = force.add(Vector.create([-this.power, 0]));
            }
            else if (input.isDown(deltav.CtlKey.Right)) {
                force = force.add(Vector.create([this.power, 0]));
            }
            if (input.isDown(deltav.CtlKey.Accelerate)) {
                if (this.velocity.eql(Vector.Zero(2))) {
                    this.velocity.setElements([0, -0.1]);
                }
                force = force.add(this.velocity.toUnitVector().multiply(this.power));
                let exhaust = this.position.add(this.velocity.toUnitVector().multiply(-10));
                world.addStaticBody(new deltav.Smoke(this.logger, exhaust, this.velocity.multiply(-1), 1));
            }
            else if (input.isDown(deltav.CtlKey.Brake)) {
                force = force.add(this.velocity.rotate(Math.PI, Vector.Zero(2)).toUnitVector().multiply(this.power));
            }
            this.acceleration = force.divide(this.mass).multiply(time);
            let veerRight = input.isDown(deltav.CtlKey.Clockwise);
            let veerLeft = input.isDown(deltav.CtlKey.AntiClockwise);
            let rotation = null;
            if (veerRight || veerLeft) {
                rotation = this.velocity
                    .rotate(Math.PI / 2 * (veerRight ? 1 : -1), Vector.Zero(2))
                    .toUnitVector()
                    .multiply(this.scaleAngularPower(speed))
                    .multiply(time);
                this.acceleration = this.acceleration.add(rotation);
            }
        }
        report() {
            return "p " + this.fv(this.position, 0)
                + " h " + this.fh(this.velocity.toAngle())
                + " v " + this.velocity.modulus().toFixed(2)
                + " a " + this.acceleration.modulus().toFixed(2);
        }
        render(ctx) {
            super.render(ctx);
            if (this.velocity.modulus() > 0.5) {
                ctx.beginPath();
                ctx.strokeStyle = "red";
                ctx.moveTo(this.getX(), this.getY());
                let endOfLine = this.position.add(this.velocity.toUnitVector().multiply(this.mass * 2));
                ctx.lineTo(endOfLine.e(1), endOfLine.e(2));
                ctx.stroke();
            }
        }
        recentlyFired(bullet) {
            return this.weapon.recentlyFired(bullet);
        }
        scaleAngularPower(speed) {
            return this.angularPower * speed;
        }
        fh(rad) {
            let deg = rad * 180 / Math.PI;
            return deg.toFixed(0);
        }
        fv(v, dp) {
            let e = v.elements;
            return e[0].toFixed(dp) + ", " + e[1].toFixed(dp);
        }
    }
    deltav.Ship = Ship;
})(deltav || (deltav = {}));

//# sourceMappingURL=Ship.js.map
