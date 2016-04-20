var deltav;
(function (deltav) {
    class Weapon {
        constructor(ship, position, caliber, velocity, reloadTime) {
            this.ship = ship;
            this.position = position;
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
        fire(world) {
            let shipP = this.ship.getP();
            let shipV = this.ship.getV();
            let muzzle = shipP.add(this.position).rotate(this.ship.getH(), shipP);
            let bulletV = shipV.add(shipV.toUnitVector().multiply(this.velocity));
            world.addDynamicBody(this.makeBullet(muzzle, bulletV));
            this.countdown = this.reloadTime;
        }
        makeBullet(muzzle, velocity) {
            return null;
        }
        recentlyFired(bullet) {
            return bullet.isFrom(this) && this.countdown > 0;
        }
    }
    deltav.Weapon = Weapon;
    class GattlingGun extends Weapon {
        constructor(ship, position) {
            super(ship, position, 1, 400, 0.2);
        }
        makeBullet(muzzle, velocity) {
            let geo = [
                Vector.create([-10, -0.75]),
                Vector.create([10, -0.75]),
                Vector.create([10, 0.75]),
                Vector.create([-10, 0.75]),
            ];
            return new Bullet(this.logger, this, muzzle, velocity, "OrangeRed", geo);
        }
        fire(world) {
            super.fire(world);
        }
    }
    deltav.GattlingGun = GattlingGun;
    class Canon extends Weapon {
        constructor(ship, position) {
            super(ship, position, 10, 200, 1);
        }
        makeBullet(muzzle, velocity) {
            let geo = new Array();
            for (let i = 0; i < 10; i++) {
                geo.push(Vector.create([1, 0])
                    .rotate(Math.PI * 2 / 5 * i, Vector.Zero(2))
                    .multiply(5));
            }
            return new Bullet(this.logger, this, muzzle, velocity, "#444461", geo);
        }
        fire(world) {
            super.fire(world);
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
    class WeaponGroup {
        constructor(logger, ship, weapons) {
            this.logger = logger;
            this.ship = ship;
            this.weapons = weapons;
        }
        ready() {
            for (let i = 0; i < this.weapons.length; i++) {
                if (!this.weapons[i].ready()) {
                    return false;
                }
            }
            return true;
        }
        update(time) {
            for (let i = 0; i < this.weapons.length; i++) {
                this.weapons[i].update(time);
            }
        }
        fire(world, position, velocity) {
            for (let i = 0; i < this.weapons.length; i++) {
                this.weapons[i].fire(world);
            }
        }
        recentlyFired(bullet) {
            for (let i = 0; i < this.weapons.length; i++) {
                if (this.weapons[i].recentlyFired(bullet)) {
                    return true;
                }
            }
            return false;
        }
    }
    deltav.WeaponGroup = WeaponGroup;
})(deltav || (deltav = {}));

//# sourceMappingURL=Weapon.js.map
