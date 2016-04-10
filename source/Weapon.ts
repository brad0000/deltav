namespace deltav {
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
            let barrel = position.add(velocity.toUnitVector().multiply(15));
            let shipV = this.ship.getV();
            world.bodies.push(
                new Bullet(
                    this.ship,
                    barrel.e(1),
                    barrel.e(2),
                    shipV.add(shipV.toUnitVector().multiply(this.velocity))));
            this.countdown = this.reloadTime;
        }
    }

    export class Bullet extends Body {
        constructor(ship: Ship, x: number, y: number, velocity: Vector) {
            super(ship.logger, x, y);
            this.velocity = velocity;
            this.mass = 2;
            this.brush = "orange";
            this.heading = ship.getH();

            this.geometry = [
                Vector.create([-5, -2.5]),
                Vector.create([4, -2.5]),
                Vector.create([6.25, 0]),
                Vector.create([4, 2.5]),
                Vector.create([-5, 2.5]),
            ];

            for (let i = 0; i < this.geometry.length; i++) {
                this.geometry[i] = this.geometry[i].multiply(0.75);
            }

        }

        public update(time: number, world: World, input: Input) {
            super.update(time, world, input);
        }

        public render(ctx: CanvasRenderingContext2D) {
            super.render(ctx);
        }
    }
}
