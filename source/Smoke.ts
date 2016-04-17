namespace deltav {
    export class Wreckage extends Body {

        constructor(logger: Logger, position: Vector, velocity: Vector, radius: number) {
            super(logger, position);
            this.velocity = velocity;
            this.radius = radius * .75;
        }

        public update(time: number, world: World, input: Input): boolean {
            let moved = super.update(time, world, input);

            world.addStaticBody(
                new Smoke(
                    this.logger,
                    this.position,
                    this.velocity.add([
                      Math.random() * 100,
                      Math.random() * 100,
                    ]),
                    this.radius));

            this.radius /= 1.05;

            if (this.radius < 0.5) {
                this.isDead = true;
            }
            
            return moved;
        }

        public render(ctx: CanvasRenderingContext2D) {
            // 
        }
    }

    export class Smoke extends Body {
        private opacity: number;
        private deltaRadius: number;
        private fireGradient = [
            "255,0,0",
            "255,0,0",
            "255,0,0",
            "255,0,0",
            "255,106,0",
            "255,106,0",
            "255,216,0",
            "255,216,0",
            "255,255,255",
            "111,237,252",
        ];

        constructor(logger: Logger, position: Vector, velocity: Vector, radius: number, color?: string) {
            super(logger, position);
            this.velocity = velocity;

            this.opacity = 1;
            this.brush = color || "white";

            this.radius = radius;
            this.deltaRadius = this.radius / 2;
        }

        public update(time: number, world: World, input: Input): boolean {
            let moved = super.update(time, world, input);
            this.radius += this.deltaRadius;
            this.opacity -= 0.1;

            if (this.opacity < 0) {
                this.isDead = true;
            }
            
            return moved;
        }

        public render(ctx: CanvasRenderingContext2D) {
            ctx.beginPath();
            ctx.fillStyle = this.fireColor(this.opacity);
            ctx.arc(this.getX(), this.getY(), this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        private fireColor(opacity: number) {
            return "rgba("
                + this.fireGradient[Math.round(opacity * this.fireGradient.length)]
                + ", "
                + opacity
                + ")";
        }
    }
}
