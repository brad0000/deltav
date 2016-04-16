var deltav;
(function (deltav) {
    class Ship extends deltav.Body {
        constructor(logger, position) {
            super(logger, position);
            this.power = 20000;
            this.angularPower = 40;
            this.mass = 20;
            this.gattlingGun = new deltav.GattlingGun(this);
            this.canon = new deltav.Canon(this);
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
            this.gattlingGun.update(time);
            this.canon.update(time);
            if (input.isDown(deltav.CtlKey.FirePrimary) && this.gattlingGun.ready()) {
                this.gattlingGun.fire(world, this.position, this.velocity);
            }
            if (input.isDown(deltav.CtlKey.FireSecondary) && this.canon.ready()) {
                this.canon.fire(world, this.position, this.velocity);
            }
            let force = Vector.Zero(2);
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
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.font = "10px Arial";
            ctx.fillText((this.health * 100).toFixed(0), this.getX() - 10, this.getY() - 20);
            ctx.fill();
        }
        recentlyFired(bullet) {
            return this.gattlingGun.recentlyFired(bullet)
                || this.canon.recentlyFired(bullet);
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
