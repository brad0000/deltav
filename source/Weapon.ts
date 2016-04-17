namespace deltav {
    export class Weapon {
        protected logger: Logger;
        private countdown = 0;

        constructor(protected ship: Ship, public caliber: number, private velocity: number, private reloadTime: number) {
            this.logger = ship.logger;
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

        public fire(world: World, position: Vector, velocity: Vector) {
            let barrel = position.add(velocity.toUnitVector().multiply(20));
            let shipV = this.ship.getV();
            let bulletV = shipV.add(shipV.toUnitVector().multiply(this.velocity));
            world.addDynamicBody(this.makeBullet(barrel, bulletV));
            this.countdown = this.reloadTime;
        }

        protected makeBullet(barrel: Vector, velocity: Vector): Bullet {
            // nothing
            return null;
        }

        public recentlyFired(bullet: Bullet): boolean {
            return bullet.isFrom(this) && this.countdown > 0;
        }
    }

    export class GattlingGun extends Weapon {
        constructor(ship: Ship) {
            super(ship, 1, 200, 0.2);
        }

        public makeBullet(barrel: Vector, velocity: Vector) {
            let geo = [
                Vector.create([-5, -2.5]),
                Vector.create([4, -2.5]),
                Vector.create([6.25, 0]),
                Vector.create([4, 2.5]),
                Vector.create([-5, 2.5]),
            ];

            for (let i = 0; i < geo.length; i++) {
                geo[i] = geo[i].multiply(0.3);
            }

            return new Bullet(
                this.logger,
                this,
                barrel,
                velocity,
                "silver",
                geo);
        }

        public fire(world: World, position: Vector, velocity: Vector) {
            super.fire(world, position, velocity);
        }
    }

    export class Canon extends Weapon {
        constructor(ship: Ship) {
            super(ship, 10, 100, 1);
        }

        public makeBullet(barrel: Vector, velocity: Vector) {

            let geo = new Array<Vector>();
            for (let i = 0; i < 10; i++) {
                geo.push(
                    Vector.create([1, 0])
                        .rotate(Math.PI * 2 / 5 * i, Vector.Zero(2))
                        .multiply(5));
            }

            return new Bullet(
                this.logger,
                this,
                barrel,
                velocity,
                "#444461",
                geo);
        }

        public fire(world: World, position: Vector, velocity: Vector) {
            super.fire(world, position, velocity);
        }
    }

    export class Bullet extends Body {
        constructor(
            logger: Logger,
            private weapon: Weapon,
            position: Vector,
            velocity: Vector,
            color: string,
            geometry: Array<Vector>) {

            super(logger, position);
            this.velocity = velocity;
            this.mass = weapon.caliber;
            this.brush = color;
            this.heading = velocity.toAngle();

            this.setGeometry(geometry);
        }

        public update(time: number, world: World, input: Input) {
            return super.update(time, world, input);
        }

        public render(ctx: CanvasRenderingContext2D) {
            super.render(ctx);
        }

        public isFrom(weapon: Weapon) {
            return this.weapon === weapon;
        }
    }
}
