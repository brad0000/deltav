namespace deltav {
    export class Body {
        public logger: Logger;
        public isDead = false;

        protected mass = 5;
        protected position = Vector.Zero(2);
        protected velocity = Vector.Zero(2);
        protected acceleration = Vector.Zero(2);
        protected rotationSpeed: number;
        protected heading = 0;
        protected geometry = Array<Vector>();
        protected brush: string;

        constructor(logger: Logger, x: number, y: number) {
            this.position = Vector.create([x, y]);
            this.brush = "black";
            this.rotationSpeed = 0;
        }

        public getX() { return this.position.e(1); }
        public getY() { return this.position.e(2); }
        public getV() { return this.velocity.dup(); }
        public getH() { return this.heading; }

        public update(time: number, world: World, input: Input) {
            this.position = this.position.add(this.velocity.multiply(time));
            this.velocity = this.velocity.add(this.acceleration.multiply(time));
        }

        public render(ctx: CanvasRenderingContext2D) {
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
    }
}
