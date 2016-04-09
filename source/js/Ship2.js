var deltav;
(function (deltav) {
    class Ship2 extends deltav.Body {
        constructor(logger, x, y) {
            super(logger, x, y);
            this.power = 5000;
            this.angularPower = 2000;
            this.brush = "gray";
            this.velocity.setElements([Math.random() * 7, Math.random() * 7]);
            this.rotationSpeed = Math.random() * 0.001 - 0.0005;
            this.geometry.push(this.position.add(Vector.create([-1, -.5]).multiply(20)));
            this.geometry.push(this.position.add(Vector.create([1, -.5]).multiply(20)));
            this.geometry.push(this.position.add(Vector.create([1.25, 0]).multiply(20)));
            this.geometry.push(this.position.add(Vector.create([1, .5]).multiply(20)));
            this.geometry.push(this.position.add(Vector.create([-1, .5]).multiply(20)));
        }
        update(time, world, input) {
            super.update(time, world, input);
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
                    .multiply(this.angularPower)
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
            ctx.strokeStyle = "yellow";
            ctx.arc(this.getX(), this.getY(), 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.fillText(this.report(), 20, 40);
            ctx.fill();
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
    deltav.Ship2 = Ship2;
})(deltav || (deltav = {}));

//# sourceMappingURL=Ship2.js.map
