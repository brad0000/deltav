var deltav;
(function (deltav) {
    class Body {
        constructor(logger, position) {
            this.isDead = false;
            this.mass = 5;
            this.position = Vector.Zero(2);
            this.velocity = Vector.Zero(2);
            this.acceleration = Vector.Zero(2);
            this.heading = 0;
            this.geometry = Array();
            this.position = position;
            this.brush = "black";
            this.rotationSpeed = 0;
        }
        getX() { return this.position.e(1); }
        getY() { return this.position.e(2); }
        getP() { return this.position.dup(); }
        getV() { return this.velocity.dup(); }
        getH() { return this.heading; }
        getCollisionBox() {
            let p = this.position.elements;
            return new deltav.Box(p[1] - this.collisionRadius, p[1] + this.collisionRadius, p[0] + this.collisionRadius, p[0] - this.collisionRadius);
        }
        update(time, world, input) {
            this.position = this.position.add(this.velocity.multiply(time));
            this.velocity = this.velocity.add(this.acceleration.multiply(time));
        }
        render(ctx) {
            ctx.fillStyle = this.brush;
            ctx.strokeStyle = this.brush;
            ctx.beginPath();
            let v = this.position.add(this.geometry[0]).rotate(this.heading, this.position);
            ctx.moveTo(v.e(1), v.e(2));
            for (let i = 1; i < this.geometry.length; i++) {
                v = this.position.add(this.geometry[i]).rotate(this.heading, this.position);
                ctx.lineTo(v.e(1), v.e(2));
            }
            ctx.closePath();
            ctx.fill();
        }
        collide(body) {
            this.isDead = true;
            body.isDead = true;
            return new deltav.Wreckage(this.logger, this.position, this.velocity.avg(body.getV()), (this.radius + body.radius) / 2);
        }
        setGeometry(geometry) {
            this.geometry = geometry;
            let lengths = this.geometry.map((v, i, e) => { return v.modulus(); });
            this.radius = Math.max(...lengths);
            this.collisionRadius = this.radius * 0.5;
        }
    }
    deltav.Body = Body;
})(deltav || (deltav = {}));

//# sourceMappingURL=Body.js.map
