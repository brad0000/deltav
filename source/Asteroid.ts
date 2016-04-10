namespace deltav {
    export class Asteroid extends Body {

        constructor(logger: Logger, position: Vector, radius: number) {
            super(logger, position);

            this.brush = "gray";

            // radom velocities
            this.velocity.setElements([Math.random() * 7 - 3.5, Math.random() * 7 - 3.5]);
            this.rotationSpeed = Math.random() * 0.001 - 0.0005;

            let v = Vector.create([1, 0]);
            let r = 0;
            let iterations = Math.round(4 + Math.random() * radius);
            let geo = new Array<Vector>();
            for (let i = 0; i < iterations; i++) {
                r += Math.PI * 2 / iterations;
                geo.push(
                    v.rotate(r, Vector.Zero(2))
                        .multiply(radius * (1 + Math.random())));
            }

            this.setGeometry(geo);
        }

        public update(time: number, world: World, input: Input) {
            super.update(time, world, input);
            this.heading += this.rotationSpeed / time;
        }

        public render(ctx: CanvasRenderingContext2D) {
            super.render(ctx);
        }

    }
}
