var deltav;
(function (deltav) {
    class Logger {
        constructor(logArea) {
            this.logArea = logArea;
        }
        log(s) {
            let message = (s + "\n" + this.logArea.value);
            this.logArea.value = message;
        }
    }
    deltav.Logger = Logger;
    class World {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.north = 0;
            this.south = 0;
            this.east = 0;
            this.west = 0;
            this.drag = -0.9;
            this.things = new Array();
            this.south = height;
            this.east = width;
        }
        update(time, input) {
            for (let i = 0; i < this.things.length; i++) {
                this.things[i].update(time, this, input);
            }
        }
        render(ctx) {
            ctx.fillStyle = "aliceblue";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fill();
            for (let i = 0; i < this.things.length; i++) {
                this.things[i].render(ctx);
            }
        }
    }
    deltav.World = World;
    class Thing {
        constructor(logger, x, y) {
            this.logger = logger;
            this.velocity = Vector.Zero(2);
            this.position = Vector.Zero(2);
            this.acceleration = Vector.Zero(2);
            this.mass = 5;
            this.position = Vector.create([x, y]);
        }
        update(time, world, input) {
            this.position = this.position.add(this.velocity.multiply(time));
            this.velocity = this.velocity.add(this.acceleration.multiply(time));
        }
        render(ctx) {
        }
        getX() {
            return this.position.e(1);
        }
        getY() {
            return this.position.e(2);
        }
        getV() {
            return this.velocity.dup();
        }
    }
    deltav.Thing = Thing;
    class Bullet extends Thing {
        constructor(ship, x, y, velocity) {
            super(ship.logger, x, y);
            this.velocity = velocity;
            this.mass = 2;
        }
        update(time, world, input) {
            super.update(time, world, input);
        }
        render(ctx) {
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.arc(this.position.e(1), this.position.e(2), this.mass, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    deltav.Bullet = Bullet;
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
            let barrel = position.add(velocity.toUnitVector().multiply(mass * 2));
            let shipV = this.ship.getV();
            world.things.push(new Bullet(this.ship, barrel.e(1), barrel.e(2), shipV.add(shipV.toUnitVector().multiply(this.velocity))));
            this.countdown = this.reloadTime;
        }
    }
    deltav.Weapon = Weapon;
})(deltav || (deltav = {}));

//# sourceMappingURL=app.js.map
