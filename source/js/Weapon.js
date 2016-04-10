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
            world.bodies.push(new Bullet(this.ship, barrel.e(1), barrel.e(2), shipV.add(shipV.toUnitVector().multiply(this.velocity))));
            this.countdown = this.reloadTime;
        }
    }
    deltav.Weapon = Weapon;
    class Bullet extends deltav.Body {
        constructor(ship, x, y, velocity) {
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
        update(time, world, input) {
            super.update(time, world, input);
        }
        render(ctx) {
            super.render(ctx);
        }
    }
    deltav.Bullet = Bullet;
})(deltav || (deltav = {}));

//# sourceMappingURL=Weapon.js.map
