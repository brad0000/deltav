namespace deltav {
    export class Smoke extends Body {
        private radius = 1;
        private opacity = 1;
        constructor(ship: Ship, x: number, y: number, velocity: Vector) {
            super(ship.logger, x, y);
            this.velocity = velocity;
            this.brush = "white";
        }

        public update(time: number, world: World, input: Input) {
            super.update(time, world, input);
            this.radius += 0.1;
            this.opacity -= 0.1;

            if (this.opacity < 0) {
                this.isDead = true;
            }
        }

        public render(ctx: CanvasRenderingContext2D) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(255, 255, 255, " + this.opacity.toString() + ")";
            ctx.arc(this.getX(), this.getY(), this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
