var deltav;
(function (deltav) {
    class Asteroid extends deltav.Body {
        constructor(logger, position, radius) {
            super(logger, position);
            this.brush = "gray";
            this.velocity.setElements([Math.random() * 7 - 3.5, Math.random() * 7 - 3.5]);
            this.rotationSpeed = Math.random() * 0.001 - 0.0005;
            let v = Vector.create([1, 0]);
            let r = 0;
            let iterations = Math.round(4 + Math.random() * radius);
            let geo = new Array();
            for (let i = 0; i < iterations; i++) {
                r += Math.PI * 2 / iterations;
                geo.push(v.rotate(r, Vector.Zero(2))
                    .multiply(radius * (1 + Math.random())));
            }
            this.setGeometry(geo);
        }
        update(time, world, input) {
            let moved = super.update(time, world, input);
            this.heading += this.rotationSpeed / time;
            return moved;
        }
        render(ctx) {
            super.render(ctx);
        }
    }
    deltav.Asteroid = Asteroid;
})(deltav || (deltav = {}));

//# sourceMappingURL=Asteroid.js.map
