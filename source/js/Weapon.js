var deltav;
(function (deltav) {
    class Weapon {
        constructor(ship) {
            this.ship = ship;
            this.velocity = 100;
            this.reloadTime = .5;
            this.countdown = 0;
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
        fire(world, position, velocity, mass) {
            let barrel = position.add(velocity.toUnitVector().multiply(15));
            let shipV = this.ship.getV();
            world.addDynamicBody(new Bullet(this.ship.logger, this, barrel, shipV.add(shipV.toUnitVector().multiply(this.velocity))));
            this.countdown = this.reloadTime;
        }
        recentlyFired(bullet) {
            return bullet.isFrom(this) && this.countdown > 0;
        }
    }
    deltav.Weapon = Weapon;
    class Bullet extends deltav.Body {
        constructor(logger, weapon, position, velocity) {
            super(logger, position);
            this.weapon = weapon;
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
        update(time, world, input) {
            super.update(time, world, input);
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
