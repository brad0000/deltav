namespace deltav {
    export class Star extends Body {
        constructor(logger: Logger, position: Vector, radius: number) {
            super(logger, position);
            this.radius = radius;
        }

        public update(time: number, world: World, input: Input) {
            // nada
        }

        public render(ctx: CanvasRenderingContext2D) {
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(this.getX(), this.getY(), this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
