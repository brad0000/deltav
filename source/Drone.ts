namespace deltav {
    export class Drone extends Ship {
        private pilot: AiPilot;

        constructor(logger: Logger, position: Vector) {
            super(logger, position);
            this.pilot = new AiPilot(logger, this);
            this.brush = "blue";
        }

        public update(time: number, world: World, input: IInput) {
            let aiInput = this.pilot.update(time, world);
            super.update(time, world, aiInput);
        }

        public render(ctx: CanvasRenderingContext2D) {
            super.render(ctx);
        }
    }

    export class AiPilot {
        private input = new AiInput();
        private tactic: AiTactic;

        constructor(private logger: Logger, private drone: Drone) {
            this.tactic = new HuntTactic(this.logger, this.drone);
        }

        public update(time: number, world: World): IInput {
            this.tactic = this.tactic.update(time, world, this.input);
            return this.input;
        }
    }

    export class AiTactic {
        constructor(protected logger: Logger) {
            // nothing
        }
        public update(time: number, world: World, input: AiInput): AiTactic {
            return this;
        }
    }

    export class WaitTactic extends AiTactic {
        private isStopped = false;

        constructor(logger: Logger, private ship: Ship, private countdown: number) {
            super(logger);
        }
        public update(time: number, world: World, input: AiInput): AiTactic {
            super.update(time, world, input);

            this.countdown -= time;

            if (this.countdown < 0) {
                return new HuntTactic(this.logger, this.ship);
            } else {
                if (this.isStopped) {
                    // nothing
                    input.reset();
                } else {
                    let speed = this.ship.getV().modulus();
                    if (speed = 0) {
                        this.isStopped = true;
                        input.set(CtlKey.Brake, false);
                    } else {
                        input.set(CtlKey.Brake, true);
                    }
                }
            }

            return this;
        }
    }

    export class HuntTactic extends AiTactic {
        public targetPosition: Vector = null;
        public interceptVector: Vector;

        private hasDeltaVSolution = false;
        private initialDistanceToTarget: number;
        private lastDistanceToTarget: number;

        constructor(logger: Logger, private ship: Ship) {
            super(logger);
        }
        public update(time: number, world: World, input: AiInput): AiTactic {
            super.update(time, world, input);

            let shipPosition = this.ship.getP();

            if (this.targetPosition == null) {
                this.targetPosition = Vector.create([
                    world.width * 0.1 + Math.random() * world.width * 0.8,
                    world.height * 0.1 + Math.random() * world.height * 0.8,
                ]);
                this.interceptVector = this.targetPosition.subtract(shipPosition);
                this.initialDistanceToTarget = this.interceptVector.modulus();
            } else {
                this.interceptVector = this.targetPosition.subtract(shipPosition);
            }

            let distanceToTarget = this.interceptVector.modulus();

            if (distanceToTarget < 20) {
                // We're there, end of tactic.
                input.reset();
                return new WaitTactic(this.logger, this.ship, 5);
            } else {

                let shipVelocity = this.ship.getV();
                let speed = shipVelocity.modulus();

                let onTarget = Math.abs(this.interceptVector.toAngle() - shipVelocity.toAngle())
                    < (Math.PI / 8);

                if (this.hasDeltaVSolution) {
                    // we have an acceleration solution, check to see if we're still on target
                    if (onTarget) {
                        // we're still on target, continue
                    } else {
                        // we have a lock, but we're off that target, reset lock.
                        this.hasDeltaVSolution = false;
                    }
                } else {
                    // we don't have an acceleration solution, if we're on target then make one
                    if (onTarget) {
                        this.interceptVector = this.targetPosition.subtract(shipPosition);
                        this.initialDistanceToTarget = this.interceptVector.modulus();
                        this.hasDeltaVSolution = true;
                    } else {
                        // we don't have an acceleration solution and we're off target.
                    }
                }

                if (this.hasDeltaVSolution) {
                    // move using the acceleration solution

                    // accelerate towards the target then brake as we approach
                    if (distanceToTarget < this.initialDistanceToTarget / 2) {
                        input.set(CtlKey.Accelerate, false);
                        input.set(CtlKey.Brake, true);
                    } else {
                        input.set(CtlKey.Accelerate, true);
                        input.set(CtlKey.Brake, false);
                    }

                    // only start turning once we're moving
                    if (speed > 10) {
                        if (this.interceptVector.toAngle() < shipVelocity.toAngle()) {
                            input.set(CtlKey.AntiClockwise, true);
                            input.set(CtlKey.Clockwise, false);
                        } else {
                            input.set(CtlKey.AntiClockwise, false);
                            input.set(CtlKey.Clockwise, true);
                        }
                    }

                } else {
                    // rotate slowly to get on-target.

                    // fixed slow turning speed
                    if (speed < 30) {
                        input.set(CtlKey.Accelerate, true);
                        input.set(CtlKey.Brake, false);
                    } else {
                        input.set(CtlKey.Accelerate, false);
                        input.set(CtlKey.Brake, true);
                    }

                    // only start turning once we're moving
                    if (speed > 10) {
                        if (this.interceptVector.toAngle() < shipVelocity.toAngle()) {
                            input.set(CtlKey.AntiClockwise, true);
                            input.set(CtlKey.Clockwise, false);
                        } else {
                            input.set(CtlKey.AntiClockwise, false);
                            input.set(CtlKey.Clockwise, true);
                        }
                    }
                }

                this.lastDistanceToTarget = distanceToTarget;
                return this;
            }
        }
    }

    export class AiInput implements IInput {
        public lastClick: MouseEvent = null;
        private pressed = new Array<boolean>();

        public isDown(key: CtlKey): boolean {
            return this.pressed[key];
        }

        public set(key: CtlKey, value: boolean) {
            this.pressed[key] = value;
        }

        public reset() {
            for (let i = 0; i < this.pressed.length; i++) {
                this.pressed[i] = false;
            }
        }
    }
}
