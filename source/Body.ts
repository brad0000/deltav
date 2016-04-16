namespace deltav {
    export class Body {
        public logger: Logger;

        public isDead = false;
        protected health = 1;

        protected mass = 5;
        protected position = Vector.Zero(2);
        protected velocity = Vector.Zero(2);
        protected acceleration = Vector.Zero(2);
        protected rotationSpeed: number;
        protected heading = 0;
        protected brush: string;
        protected radius: number;
        protected collisionRadius: number;

        private geometry = Array<Vector>();
        private boundingBox: Box = null;

        constructor(logger: Logger, position: Vector) {
            this.position = position;
            this.brush = "black";
            this.rotationSpeed = 0;
        }

        public getX() { return this.position.e(1); }
        public getY() { return this.position.e(2); }

        public getP() { return this.position.dup(); }
        public getV() { return this.velocity.dup(); }

        public getH() { return this.heading; }
        public getR() { return this.radius; }

        public getCollisionBox() {
            let p = this.position.elements;
            return new Box(
                p[1] - this.collisionRadius,
                p[1] + this.collisionRadius,
                p[0] + this.collisionRadius,
                p[0] - this.collisionRadius);
        }

        public getBoundingBox() {
            if (this.boundingBox == null) {
                let p = this.position.elements;
                this.boundingBox = new Box(
                    p[1] - this.radius,
                    p[1] + this.radius,
                    p[0] + this.radius,
                    p[0] - this.radius);
            }
            return this.boundingBox;
        }


        public update(time: number, world: World, input: IInput) {
            this.position = this.position.add(this.velocity.multiply(time));
            this.velocity = this.velocity.add(this.acceleration.multiply(time));
            this.boundingBox = null;
            // if (this.health < 1) {
            //     world.addStaticBody(
            //         new Smoke(
            //             this.logger,
            //             this.position,
            //             this.velocity.add([
            //                 Math.random() * 100,
            //                 Math.random() * 100,
            //             ]),
            //             5));
            // }
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

            // // bounding box
            // let b = this.getBox();
            // ctx.beginPath();
            // ctx.strokeRect(b.west, b.north, b.width, b.height);
            // ctx.strokeStyle = "yellow";
            // ctx.stroke();
        }

        public collide(body: Body): boolean {
            this.health -= body.mass / 100;
            this.isDead = this.health <= 0;
            return this.isDead;
        }

        protected setGeometry(geometry: Array<Vector>) {
            this.geometry = geometry;
            let lengths = this.geometry.map((v, i, e) => { return v.modulus(); });
            this.radius = Math.max(...lengths);
            this.collisionRadius = this.radius * 0.7;
        }
    }
}
