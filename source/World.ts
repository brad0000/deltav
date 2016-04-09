namespace deltav {

    export class World {
        public north = 0;
        public south = 0;
        public east = 0;
        public west = 0;
        public drag = -0.9;
        public bodies = new Array<Body>();

        private gcCountdown = 10;

        constructor(private logger: Logger, public width: number, public height: number) {
            this.south = height;
            this.east = width;

            for (let i = 0; i < 500; i++) {
                this.bodies.push(new Star(
                    this.logger,
                    Math.random() * this.width,
                    Math.random() * this.height,
                    Math.random() * 1.5));
            }

            for (let i = 0; i < 50; i++) {
                this.bodies.push(new Asteroid(
                    this.logger,
                    Math.random() * this.width,
                    Math.random() * this.height,
                    Math.random() * 30));
            }

            this.bodies.push(new Ship(this.logger, 400, 500));
        }

        public update(time: number, input: Input) {
            this.gcCountdown -= time;
            if (this.gcCountdown < 0) {
                // remove dead bodies
                let old = this.bodies;
                this.bodies = [];
                for (let i = 0; i < old.length; i++) {
                    if (!old[i].isDead) {
                        old[i].update(time, this, input);
                        this.bodies.push(old[i]);
                    }
                }
            } else {
                // optimize speed
                for (let i = 0; i < this.bodies.length; i++) {
                    if (!this.bodies[i].isDead) {
                        this.bodies[i].update(time, this, input);
                    }
                }
            }
        }

        public render(ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fill();

             for (let i = 0; i < this.bodies.length; i++) {
                if (!this.bodies[i].isDead) {
                    this.bodies[i].render(ctx);
                }
             }
        }
    }
}
