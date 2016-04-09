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

var deltav;
(function (deltav) {
    class Client {
        constructor(canvas, logArea) {
            this.clock = 0;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            this.logger = new deltav.Logger(logArea);
            this.world = new deltav.World(canvas.width, canvas.height);
            this.input = new deltav.Input(canvas, document);
            this.ctx = canvas.getContext("2d");
            this.world.things.push(new deltav.Ship(this.logger, 400, 500));
            this.startGameLoop();
        }
        startGameLoop() {
            setInterval(() => {
                this.updateWorld(0.033);
                this.renderWorld();
            }, 30);
        }
        updateWorld(time) {
            this.clock += time;
            this.world.update(time, this.input);
        }
        renderWorld() {
            this.ctx.strokeStyle = "gray";
            this.ctx.strokeRect(0, 0, this.world.width, this.world.height);
            this.ctx.stroke();
            this.ctx.strokeStyle = "black";
            this.ctx.strokeText(this.clock.toFixed(1), 20, 20);
            this.ctx.stroke();
            this.world.render(this.ctx);
        }
    }
    deltav.Client = Client;
})(deltav || (deltav = {}));

//# sourceMappingURL=Client.js.map

var deltav;
(function (deltav) {
    (function (CtlKey) {
        CtlKey[CtlKey["Up"] = 104] = "Up";
        CtlKey[CtlKey["Down"] = 98] = "Down";
        CtlKey[CtlKey["Left"] = 100] = "Left";
        CtlKey[CtlKey["Right"] = 102] = "Right";
        CtlKey[CtlKey["Accelerate"] = 38] = "Accelerate";
        CtlKey[CtlKey["Brake"] = 40] = "Brake";
        CtlKey[CtlKey["Clockwise"] = 39] = "Clockwise";
        CtlKey[CtlKey["AntiClockwise"] = 37] = "AntiClockwise";
        CtlKey[CtlKey["Fire"] = 17] = "Fire";
    })(deltav.CtlKey || (deltav.CtlKey = {}));
    var CtlKey = deltav.CtlKey;
    class Input {
        constructor(canvas, doc) {
            this.pressed = new Array();
            canvas.addEventListener("click", ev => this.click(ev));
            canvas.addEventListener("mousewheel", ev => this.wheel(ev));
            doc.addEventListener("keydown", ev => this.keyDown(ev));
            doc.addEventListener("keyup", ev => this.keyUp(ev));
        }
        isDown(key) {
            return this.pressed[key];
        }
        keyUp(ev) {
            this.pressed[ev.keyCode] = false;
        }
        keyDown(ev) {
            this.pressed[ev.keyCode] = true;
        }
        wheel(ev) {
        }
        click(ev) {
            this.lastClick = ev;
        }
    }
    deltav.Input = Input;
})(deltav || (deltav = {}));

//# sourceMappingURL=Input.js.map

var deltav;
(function (deltav) {
    class Ship extends deltav.Thing {
        constructor(logger, x, y) {
            super(logger, x, y);
            this.power = 5000;
            this.angularPower = 2000;
            this.weapon = new deltav.Weapon(this);
        }
        update(time, world, input) {
            super.update(time, world, input);
            this.weapon.update(time);
            if (input.isDown(deltav.CtlKey.Fire) && this.weapon.ready()) {
                this.weapon.fire(world, this.position, this.velocity, this.mass);
            }
            let force = Vector.Zero(2);
            if (input.isDown(deltav.CtlKey.Up)) {
                force = force.add(Vector.create([0, -this.power]));
            }
            else if (input.isDown(deltav.CtlKey.Down)) {
                force = force.add(Vector.create([0, this.power]));
            }
            if (input.isDown(deltav.CtlKey.Left)) {
                force = force.add(Vector.create([-this.power, 0]));
            }
            else if (input.isDown(deltav.CtlKey.Right)) {
                force = force.add(Vector.create([this.power, 0]));
            }
            if (input.isDown(deltav.CtlKey.Accelerate)) {
                if (this.velocity.eql(Vector.Zero(2))) {
                    this.velocity.setElements([0, -0.1]);
                }
                force = force.add(this.velocity.toUnitVector().multiply(this.power));
            }
            else if (input.isDown(deltav.CtlKey.Brake)) {
                force = force.add(this.velocity.rotate(Math.PI, Vector.Zero(2)).toUnitVector().multiply(this.power));
            }
            this.acceleration = force.divide(this.mass).multiply(time);
            let veerRight = input.isDown(deltav.CtlKey.Clockwise);
            let veerLeft = input.isDown(deltav.CtlKey.AntiClockwise);
            let rotation = null;
            if (veerRight || veerLeft) {
                rotation = this.velocity
                    .rotate(Math.PI / 2 * (veerRight ? 1 : -1), Vector.Zero(2))
                    .toUnitVector()
                    .multiply(this.angularPower)
                    .multiply(time);
                this.acceleration = this.acceleration.add(rotation);
            }
        }
        render(ctx) {
            ctx.beginPath();
            ctx.arc(this.getX(), this.getY(), this.mass, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = "black";
            ctx.strokeText(this.report(), 20, 40);
            ctx.stroke();
            if (this.velocity.modulus() > 0.5) {
                ctx.moveTo(this.getX(), this.getY());
                let endOfLine = this.position.add(this.velocity.toUnitVector().multiply(this.mass * 2));
                ctx.lineTo(endOfLine.e(1), endOfLine.e(2));
                ctx.stroke();
            }
        }
        report() {
            return "p " + this.fv(this.position, 0)
                + " h " + this.fh(this.velocity.toAngle())
                + " v " + this.velocity.modulus().toFixed(2)
                + " a " + this.acceleration.modulus().toFixed(2);
        }
        fh(rad) {
            let deg = rad * 180 / Math.PI;
            return deg.toFixed(0);
        }
        fv(v, dp) {
            let e = v.elements;
            return e[0].toFixed(dp) + ", " + e[1].toFixed(dp);
        }
    }
    deltav.Ship = Ship;
})(deltav || (deltav = {}));

//# sourceMappingURL=Ship.js.map
