namespace deltav {

    export class World {
        public north = 0;
        public south = 0;
        public east = 0;
        public west = 0;

        // drag acts against the velocity of the object in a small amount
        public drag = -0.9;

        public bodies = new Array<Body>();

        constructor(private logger: Logger, public width: number, public height: number) {
            this.south = height;
            this.east = width;

            this.bodies.push(new Ship(this.logger, 400, 500));

            for (let i = 0; i < 50; i++) {
                this.bodies.push(new Asteroid(
                    this.logger,
                    Math.random() * this.width,
                    Math.random() * this.height,
                    Math.random() * 30));
            }
        }

        public update(time: number, input: Input) {
            for (let i = 0; i < this.bodies.length; i++) {
                this.bodies[i].update(time, this, input);
            }
        }

        public render(ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fill();

             for (let i = 0; i < this.bodies.length; i++) {
                this.bodies[i].render(ctx);
             }
        }
    }
}
