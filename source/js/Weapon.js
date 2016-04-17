var deltav;
(function (deltav) {
    class Weapon {
        constructor(ship, caliber, velocity, reloadTime) {
            this.ship = ship;
            this.caliber = caliber;
            this.velocity = velocity;
            this.reloadTime = reloadTime;
            this.countdown = 0;
            this.logger = ship.logger;
        }
        ready() {
            return this.countdown === 0;
        }
        update(time) {
            this.countdown -= time;
            if (this.countdown < 0) {
                this.countdown = 0;
            }
        }
        fire(world, position, velocity) {
            let barrel = position.add(velocity.toUnitVector().multiply(20));
            let shipV = this.ship.getV();
            let bulletV = shipV.add(shipV.toUnitVector().multiply(this.velocity));
            world.addDynamicBody(this.makeBullet(barrel, bulletV));
            this.countdown = this.reloadTime;
        }
        makeBullet(barrel, velocity) {
            return null;
        }
        recentlyFired(bullet) {
            return bullet.isFrom(this) && this.countdown > 0;
        }
    }
    deltav.Weapon = Weapon;
    class GattlingGun extends Weapon {
        constructor(ship) {
            super(ship, 1, 200, 0.2);
        }
        makeBullet(barrel, velocity) {
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
            return new Bullet(this.logger, this, barrel, velocity, "silver", geo);
        }
        fire(world, position, velocity) {
            super.fire(world, position, velocity);
        }
    }
    deltav.GattlingGun = GattlingGun;
    class Canon extends Weapon {
        constructor(ship) {
            super(ship, 10, 100, 1);
        }
        makeBullet(barrel, velocity) {
            let geo = new Array();
            for (let i = 0; i < 10; i++) {
                geo.push(Vector.create([1, 0])
                    .rotate(Math.PI * 2 / 5 * i, Vector.Zero(2))
                    .multiply(5));
            }
            return new Bullet(this.logger, this, barrel, velocity, "#444461", geo);
        }
        fire(world, position, velocity) {
            super.fire(world, position, velocity);
        }
    }
    deltav.Canon = Canon;
    class Bullet extends deltav.Body {
        constructor(logger, weapon, position, velocity, color, geometry) {
            super(logger, position);
            this.weapon = weapon;
            this.velocity = velocity;
            this.mass = weapon.caliber;
            this.brush = color;
            this.heading = velocity.toAngle();
            this.setGeometry(geometry);
        }
        update(time, world, input) {
            return super.update(time, world, input);
        }
        render(ctx) {
            super.render(ctx);
        }
        isFrom(weapon) {
            return this.weapon === weapon;
        }
    }
    deltav.Bullet = Bullet;
})(deltav || (deltav = {}));

//# sourceMappingURL=Weapon.js.map
