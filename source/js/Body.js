var deltav;
(function (deltav) {
    class Body {
        constructor(logger, position) {
            this.isDead = false;
            this.health = 1;
            this.mass = 5;
            this.position = Vector.Zero(2);
            this.velocity = Vector.Zero(2);
            this.acceleration = Vector.Zero(2);
            this.heading = 0;
            this.geometry = Array();
            this.boundingBox = null;
            this.position = position;
            this.brush = "black";
            this.rotationSpeed = 0;
        }
        getX() { return this.position.e(1); }
        getY() { return this.position.e(2); }
        getP() { return this.position; }
        getV() { return this.velocity; }
        getH() { return this.heading; }
        getR() { return this.radius; }
        getCollisionBox() {
            let p = this.position.elements;
            return new deltav.Box(p[1] - this.collisionRadius, p[1] + this.collisionRadius, p[0] + this.collisionRadius, p[0] - this.collisionRadius);
        }
        getBoundingBox() {
            if (this.boundingBox == null) {
                let p = this.position.elements;
                this.boundingBox = new deltav.Box(p[1] - this.radius, p[1] + this.radius, p[0] + this.radius, p[0] - this.radius);
            }
            return this.boundingBox;
        }
        update(time, world, input) {
            this.position = this.position.add(this.velocity.multiply(time));
            this.velocity = this.velocity.add(this.acceleration.multiply(time));
            this.boundingBox = null;
            return !this.velocity.eql([0, 0]);
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
            this.health -= body.mass / 100;
            this.isDead = this.health <= 0;
            return this.isDead;
        }
        setGeometry(geometry) {
            this.geometry = geometry;
            let lengths = this.geometry.map((v, i, e) => { return v.modulus(); });
            this.radius = Math.max(...lengths);
            this.collisionRadius = this.radius * 0.7;
        }
    }
    deltav.Body = Body;
})(deltav || (deltav = {}));

//# sourceMappingURL=Body.js.map
