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
            world.addDynamicBody(
                new Bullet(
                    this.ship.logger,
                    this,
                    barrel,
                    shipV.add(shipV.toUnitVector().multiply(this.velocity))));
            this.countdown = this.reloadTime;
        }

        public recentlyFired(bullet: Bullet): boolean {
            return bullet.isFrom(this) && this.countdown > 0;
        }
    }

    export class Bullet extends Body {
        constructor(logger: Logger, private weapon: Weapon, position: Vector, velocity: Vector) {
            super(logger, position);
            this.velocity = velocity;
            this.mass = 2;
            this.brush = "orange";
            this.heading = velocity.toAngle();

            let geo = [
                Vector.create([-5, -2.5]),
                Vector.create([4, -2.5]),
                Vector.create([6.25, 0]),
                Vector.create([4, 2.5]),
                Vector.create([-5, 2.5]),
            ];

            for (let i = 0; i < geo.length; i++) {
                geo[i] = geo[i].multiply(0.75);
            }

            this.setGeometry(geo);
        }

        public update(time: number, world: World, input: Input) {
            super.update(time, world, input);
        }

        public render(ctx: CanvasRenderingContext2D) {
            super.render(ctx);
        }

        public isFrom(weapon: Weapon) {
            return this.weapon === weapon;
        }
    }
}
