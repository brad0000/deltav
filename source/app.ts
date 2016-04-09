

namespace deltav {

    export class Logger {
        constructor(private logArea: HTMLTextAreaElement) {
        }

        public log(s: string | number) {
            let message = (s + "\n" + this.logArea.value);
            this.logArea.value = message;
        }
    }

    export class World {
        public north = 0;
        public south = 0;
        public east = 0;
        public west = 0;

        // drag acts against the velocity of the object in a small amount
        public drag = -0.9;

        public things = new Array<Thing>();

        constructor(public width: number, public height: number) {
            this.south = height;
            this.east = width;
        }

        public update(time: number, input: Input) {
            for (let i = 0; i < this.things.length; i++) {
                this.things[i].update(time, this, input);
            }
        }

        public render(ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = "aliceblue";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fill();

             for (let i = 0; i < this.things.length; i++) {
                this.things[i].render(ctx);
             }
        }
    }


    export class Thing {
        protected velocity = Vector.Zero(2);
        protected position = Vector.Zero(2);
        protected acceleration = Vector.Zero(2);
        protected mass = 5;

        constructor(public logger: Logger, x: number, y: number) {
            this.position = Vector.create([x, y]);
        }


        public update(time: number, world: World, input: Input) {
            this.position = this.position.add(this.velocity.multiply(time));
            this.velocity = this.velocity.add(this.acceleration.multiply(time));
        }

        public render(ctx: CanvasRenderingContext2D) {
            // nothing
        }

        public getX() {
            return this.position.e(1);
        }

        public getY() {
            return this.position.e(2);
        }

        public getV() {
            return this.velocity.dup();
        }
    }

    export class Bullet extends Thing {
        constructor(ship: Ship, x: number, y: number, velocity: Vector) {
            super(ship.logger, x, y);
            this.velocity = velocity;
            this.mass = 2;
        }

        public update(time: number, world: World, input: Input) {
            super.update(time, world, input);
        }

        public render(ctx: CanvasRenderingContext2D) {
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.arc(this.position.e(1), this.position.e(2), this.mass, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    export class Weapon {
        private velocity = 100;
        private reloadTime = .5;
        private countdown = 0;

        constructor(private ship: Ship) {
        }

        public ready() {
            return this.countdown === 0;
        }

        public update(time: number) {
            this.countdown -= time;
            if (this.countdown < 0) {
                this.countdown = 0;
            }
        }

        public fire(world: World, position: Vector, velocity: Vector, mass: number) {
            let barrel = position.add(velocity.toUnitVector().multiply(mass * 2));
            let shipV = this.ship.getV();
            world.things.push(
                new Bullet(
                    this.ship,
                    barrel.e(1),
                    barrel.e(2),
                    shipV.add(shipV.toUnitVector().multiply(this.velocity))));
            this.countdown = this.reloadTime;
        }
    }
}
