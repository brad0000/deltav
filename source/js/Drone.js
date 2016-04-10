var deltav;
(function (deltav) {
    class Drone extends deltav.Ship {
        constructor(logger, x, y) {
            super(logger, x, y);
            this.pilot = new AiPilot(logger, this);
            this.brush = "blue";
        }
        update(time, world, input) {
            let aiInput = this.pilot.update(time, world);
            super.update(time, world, aiInput);
        }
        render(ctx) {
            super.render(ctx);
        }
    }
    deltav.Drone = Drone;
    class AiPilot {
        constructor(logger, drone) {
            this.logger = logger;
            this.drone = drone;
            this.input = new AiInput();
            this.tactic = new HuntTactic(this.logger, this.drone);
        }
        update(time, world) {
            this.tactic = this.tactic.update(time, world, this.input);
            return this.input;
        }
    }
    deltav.AiPilot = AiPilot;
    class AiTactic {
        constructor(logger) {
            this.logger = logger;
        }
        update(time, world, input) {
            return this;
        }
    }
    deltav.AiTactic = AiTactic;
    class WaitTactic extends AiTactic {
        constructor(logger, ship, countdown) {
            super(logger);
            this.ship = ship;
            this.countdown = countdown;
            this.isStopped = false;
        }
        update(time, world, input) {
            super.update(time, world, input);
            this.countdown -= time;
            if (this.countdown < 0) {
                return new HuntTactic(this.logger, this.ship);
            }
            else {
                if (this.isStopped) {
                    input.reset();
                }
                else {
                    let speed = this.ship.getV().modulus();
                    if (speed = 0) {
                        this.isStopped = true;
                        input.set(deltav.CtlKey.Brake, false);
                    }
                    else {
                        input.set(deltav.CtlKey.Brake, true);
                    }
                }
            }
            return this;
        }
    }
    deltav.WaitTactic = WaitTactic;
    class HuntTactic extends AiTactic {
        constructor(logger, ship) {
            super(logger);
            this.ship = ship;
            this.targetPosition = null;
            this.hasDeltaVSolution = false;
        }
        update(time, world, input) {
            super.update(time, world, input);
            let shipPosition = this.ship.getP();
            if (this.targetPosition == null) {
                this.targetPosition = Vector.create([
                    world.width * 0.1 + Math.random() * world.width * 0.8,
                    world.height * 0.1 + Math.random() * world.height * 0.8,
                ]);
                this.interceptVector = this.targetPosition.subtract(shipPosition);
                this.initialDistanceToTarget = this.interceptVector.modulus();
            }
            else {
                this.interceptVector = this.targetPosition.subtract(shipPosition);
            }
            let distanceToTarget = this.interceptVector.modulus();
            if (distanceToTarget < 20) {
                input.reset();
                return new WaitTactic(this.logger, this.ship, 5);
            }
            else {
                let shipVelocity = this.ship.getV();
                let speed = shipVelocity.modulus();
                let onTarget = Math.abs(this.interceptVector.toAngle() - shipVelocity.toAngle())
                    < (Math.PI / 8);
                if (this.hasDeltaVSolution) {
                    if (onTarget) {
                    }
                    else {
                        this.hasDeltaVSolution = false;
                    }
                }
                else {
                    if (onTarget) {
                        this.interceptVector = this.targetPosition.subtract(shipPosition);
                        this.initialDistanceToTarget = this.interceptVector.modulus();
                        this.hasDeltaVSolution = true;
                    }
                    else {
                    }
                }
                if (this.hasDeltaVSolution) {
                    if (distanceToTarget < this.initialDistanceToTarget / 2) {
                        input.set(deltav.CtlKey.Accelerate, false);
                        input.set(deltav.CtlKey.Brake, true);
                    }
                    else {
                        input.set(deltav.CtlKey.Accelerate, true);
                        input.set(deltav.CtlKey.Brake, false);
                    }
                    if (speed > 10) {
                        if (this.interceptVector.toAngle() < shipVelocity.toAngle()) {
                            input.set(deltav.CtlKey.AntiClockwise, true);
                            input.set(deltav.CtlKey.Clockwise, false);
                        }
                        else {
                            input.set(deltav.CtlKey.AntiClockwise, false);
                            input.set(deltav.CtlKey.Clockwise, true);
                        }
                    }
                }
                else {
                    if (speed < 30) {
                        input.set(deltav.CtlKey.Accelerate, true);
                        input.set(deltav.CtlKey.Brake, false);
                    }
                    else {
                        input.set(deltav.CtlKey.Accelerate, false);
                        input.set(deltav.CtlKey.Brake, true);
                    }
                    if (speed > 10) {
                        if (this.interceptVector.toAngle() < shipVelocity.toAngle()) {
                            input.set(deltav.CtlKey.AntiClockwise, true);
                            input.set(deltav.CtlKey.Clockwise, false);
                        }
                        else {
                            input.set(deltav.CtlKey.AntiClockwise, false);
                            input.set(deltav.CtlKey.Clockwise, true);
                        }
                    }
                }
                this.lastDistanceToTarget = distanceToTarget;
                return this;
            }
        }
    }
    deltav.HuntTactic = HuntTactic;
    class AiInput {
        constructor() {
            this.lastClick = null;
            this.pressed = new Array();
        }
        isDown(key) {
            return this.pressed[key];
        }
        set(key, value) {
            this.pressed[key] = value;
        }
        reset() {
            for (let i = 0; i < this.pressed.length; i++) {
                this.pressed[i] = false;
            }
        }
    }
    deltav.AiInput = AiInput;
})(deltav || (deltav = {}));

//# sourceMappingURL=Drone.js.map
