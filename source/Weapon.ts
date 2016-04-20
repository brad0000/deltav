namespace deltav {
    export class Weapon {
        protected logger: Logger;
        private countdown = 0;

        constructor(
            protected ship: Ship, 
            protected position: Vector,
            public caliber: number, 
            private velocity: number, 
            private reloadTime: number) {
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

        public fire(world: World) {
            let shipP = this.ship.getP();
            let shipV = this.ship.getV();
            
            let muzzle = shipP.add(this.position).rotate(this.ship.getH(), shipP);
            let bulletV = shipV.add(shipV.toUnitVector().multiply(this.velocity));
            
            world.addDynamicBody(this.makeBullet(muzzle, bulletV));
            this.countdown = this.reloadTime;
        }

        protected makeBullet(muzzle: Vector, velocity: Vector): Bullet {
            // nothing
            return null;
        }

        public recentlyFired(bullet: Bullet): boolean {
            return bullet.isFrom(this) && this.countdown > 0;
        }
    }

    export class GattlingGun extends Weapon {
        constructor(ship: Ship, position: Vector) {
            super(ship, position, 1, 400, 0.2);
        }

        public makeBullet(muzzle: Vector, velocity: Vector) {
            let geo = [
                Vector.create([-10, -0.75]),
                Vector.create([10, -0.75]),
                Vector.create([10, 0.75]),
                Vector.create([-10, 0.75]),
            ];

            return new Bullet(
                this.logger,
                this,
                muzzle,
                velocity,
                "OrangeRed",
                geo);
        }

        public fire(world: World) {
            super.fire(world);
        }
    }

    export class Canon extends Weapon {
        constructor(ship: Ship, position: Vector) {
            super(ship, position, 10, 200, 1);
        }

        public makeBullet(muzzle: Vector, velocity: Vector) {

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
                muzzle,
                velocity,
                "#444461",
                geo);
        }

        public fire(world: World) {
            super.fire(world);
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
    
    export class WeaponGroup {
        constructor(private logger: Logger, private ship: Ship, private weapons: Weapon[]) {
            // nothing
        }

        public ready(): boolean {
            for (let i = 0; i < this.weapons.length; i++) {
                if (!this.weapons[i].ready()) {
                    return false;
                }
            }
            return true;
        }

        public update(time: number) {
            for (let i = 0; i < this.weapons.length; i++) {
                this.weapons[i].update(time);
            }
        }

        public fire(world: World, position: Vector, velocity: Vector) {
            for (let i = 0; i < this.weapons.length; i++) {
                this.weapons[i].fire(world);
            }
        }
        
        public recentlyFired(bullet: Bullet): boolean {
            for (let i = 0; i < this.weapons.length; i++) {
                if (this.weapons[i].recentlyFired(bullet)) {
                    return true;
                }
            }
            return false;
        }
    }
}
