var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function start() {
    var c = document.getElementById("canvas");
    var l = document.getElementById("log");
    var client = new deltav.client(c, l);
}
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
    var Input = (function () {
        function Input(canvas, doc) {
            var _this = this;
            this.pressed = new Array();
            canvas.addEventListener("click", function (ev) { return _this.click(ev); });
            canvas.addEventListener("mousewheel", function (ev) { return _this.wheel(ev); });
            doc.addEventListener("keydown", function (ev) { return _this.keyDown(ev); });
            doc.addEventListener("keyup", function (ev) { return _this.keyUp(ev); });
        }
        Input.prototype.isDown = function (key) {
            return this.pressed[key];
        };
        Input.prototype.keyUp = function (ev) {
            this.pressed[ev.keyCode] = false;
        };
        Input.prototype.keyDown = function (ev) {
            this.pressed[ev.keyCode] = true;
        };
        Input.prototype.wheel = function (ev) {
        };
        Input.prototype.click = function (ev) {
            this.lastClick = ev;
        };
        return Input;
    })();
    deltav.Input = Input;
    var Logger = (function () {
        function Logger(logArea) {
            this.logArea = logArea;
        }
        Logger.prototype.log = function (s) {
            var message = (s + '\n' + this.logArea.value);
            this.logArea.value = message;
        };
        return Logger;
    })();
    deltav.Logger = Logger;
    var World = (function () {
        function World(width, height) {
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
        World.prototype.update = function (time, input) {
            for (var i = 0; i < this.things.length; i++) {
                this.things[i].update(time, this, input);
            }
        };
        World.prototype.render = function (ctx) {
            ctx.fillStyle = "aliceblue";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fill();
            for (var i = 0; i < this.things.length; i++) {
                this.things[i].render(ctx);
            }
        };
        return World;
    })();
    deltav.World = World;
    var Thing = (function () {
        function Thing(logger, x, y) {
            this.logger = logger;
            this.velocity = Vector.Zero(2);
            this.position = Vector.Zero(2);
            this.acceleration = Vector.Zero(2);
            this.mass = 30;
            this.position = Vector.create([x, y]);
        }
        Thing.prototype.update = function (time, world, input) {
            this.position = this.position.add(this.velocity.multiply(time));
            this.velocity = this.velocity.add(this.acceleration.multiply(time));
        };
        Thing.prototype.render = function (ctx) {
        };
        Thing.prototype.getX = function () {
            return this.position.e(1);
        };
        Thing.prototype.getY = function () {
            return this.position.e(2);
        };
        Thing.prototype.getV = function () {
            return this.velocity.dup();
        };
        return Thing;
    })();
    deltav.Thing = Thing;
    var Bullet = (function (_super) {
        __extends(Bullet, _super);
        function Bullet(ship, x, y, velocity) {
            _super.call(this, ship.logger, x, y);
            this.velocity = velocity;
            this.mass = 2;
        }
        Bullet.prototype.update = function (time, world, input) {
            _super.prototype.update.call(this, time, world, input);
        };
        Bullet.prototype.render = function (ctx) {
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.arc(this.position.e(1), this.position.e(2), this.mass, 0, Math.PI * 2);
            ctx.stroke();
        };
        return Bullet;
    })(Thing);
    deltav.Bullet = Bullet;
    var Weapon = (function () {
        function Weapon(ship) {
            this.ship = ship;
            this.velocity = 1000;
        }
        Weapon.prototype.fire = function (world, position, velocity, mass) {
            var endOfLine = position.add(velocity.toUnitVector().multiply(mass * 2));
            world.things.push(new Bullet(this.ship, endOfLine.e(1), endOfLine.e(2), this.ship.getV().toUnitVector().multiply(this.velocity)));
        };
        return Weapon;
    })();
    deltav.Weapon = Weapon;
    var Ship = (function (_super) {
        __extends(Ship, _super);
        function Ship(logger, x, y) {
            _super.call(this, logger, x, y);
            this.heading = 0;
            this.power = 1000;
            this.angularPower = 2000;
            this.weapon = new Weapon(this);
        }
        Ship.prototype.update = function (time, world, input) {
            if (input.isDown(CtlKey.Fire)) {
                this.weapon.fire(world, this.position, this.velocity, this.mass);
            }
            _super.prototype.update.call(this, time, world, input);
            var force = Vector.Zero(2);
            if (input.isDown(CtlKey.Up)) {
                force = force.add(Vector.create([0, -this.power]));
            }
            else if (input.isDown(CtlKey.Down)) {
                force = force.add(Vector.create([0, this.power]));
            }
            if (input.isDown(CtlKey.Left)) {
                force = force.add(Vector.create([-this.power, 0]));
            }
            else if (input.isDown(CtlKey.Right)) {
                force = force.add(Vector.create([this.power, 0]));
            }
            if (input.isDown(CtlKey.Accelerate)) {
                if (this.velocity.eql(Vector.Zero(2))) {
                    this.velocity.setElements([0, -0.1]);
                }
                force = force.add(this.velocity.toUnitVector().multiply(this.power));
            }
            else if (input.isDown(CtlKey.Brake)) {
                force = force.add(this.velocity.rotate(Math.PI, Vector.Zero(2)).toUnitVector().multiply(this.power));
            }
            this.acceleration = force.divide(this.mass).multiply(time);
            var veerRight = input.isDown(CtlKey.Clockwise);
            var veerLeft = input.isDown(CtlKey.AntiClockwise);
            var rotation = null;
            if (veerRight || veerLeft) {
                rotation = this.velocity
                    .rotate(Math.PI / 2 * (veerRight ? 1 : -1), Vector.Zero(2))
                    .toUnitVector()
                    .multiply(this.angularPower)
                    .multiply(time);
                this.acceleration = this.acceleration.add(rotation);
            }
        };
        Ship.prototype.render = function (ctx) {
            ctx.beginPath();
            ctx.arc(this.getX(), this.getY(), this.mass, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = 'black';
            ctx.strokeText(this.report(), 20, 40);
            ctx.stroke();
            if (this.velocity.modulus() > 0.5) {
                ctx.moveTo(this.getX(), this.getY());
                var endOfLine = this.position.add(this.velocity.toUnitVector().multiply(this.mass * 2));
                ctx.lineTo(endOfLine.e(1), endOfLine.e(2));
                ctx.stroke();
            }
        };
        Ship.prototype.report = function () {
            return 'p ' + this.fv(this.position)
                + ' v ' + this.fv(this.velocity)
                + ' a ' + this.fv(this.acceleration);
        };
        Ship.prototype.fv = function (v) {
            var e = v.elements;
            return e[0].toFixed(2).toString() + ', ' + e[1].toFixed(2).toString();
        };
        return Ship;
    })(Thing);
    deltav.Ship = Ship;
    var client = (function () {
        function client(canvas, logArea) {
            this.clock = 0;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            this.logger = new Logger(logArea);
            this.world = new World(canvas.width, canvas.height);
            this.input = new Input(canvas, document);
            this.ctx = canvas.getContext("2d");
            this.world.things.push(new Ship(this.logger, 100, 100));
            this.startGameLoop();
        }
        client.prototype.startGameLoop = function () {
            var _this = this;
            setInterval(function () {
                _this.updateWorld(0.033);
                _this.renderWorld();
            }, 30);
        };
        client.prototype.updateWorld = function (time) {
            this.clock += time;
            this.world.update(time, this.input);
        };
        client.prototype.renderWorld = function () {
            this.ctx.strokeStyle = 'gray';
            this.ctx.strokeRect(0, 0, this.world.width, this.world.height);
            this.ctx.stroke();
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeText(this.clock.toFixed(1).toString(), 20, 20);
            this.ctx.stroke();
            this.world.render(this.ctx);
        };
        return client;
    })();
    deltav.client = client;
})(deltav || (deltav = {}));
