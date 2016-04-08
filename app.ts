


function start() {
    var c = <HTMLCanvasElement>document.getElementById("canvas");
    var l = <HTMLTextAreaElement>document.getElementById("log");
    var client = new deltav.client(c, l);
}


namespace deltav {

    export enum CtlKey {
        Up = 104,
        Down = 98,
        Left = 100,
        Right = 102,
        Accelerate = 38,
        Brake = 40,
        Clockwise = 39,
        AntiClockwise = 37,
        Fire = 17,
    } 
    
    /*
     * http://www.cambiaresearch.com/articles/15/javascript-key-codes
     */
    export class Input {
        private pressed = new Array<boolean>();
        public lastClick : MouseEvent;
        
        constructor(canvas: HTMLCanvasElement, doc: HTMLDocument) {
            canvas.addEventListener("click", ev => this.click(ev));
            canvas.addEventListener("mousewheel", ev => this.wheel(ev));
            doc.addEventListener("keydown", ev => this.keyDown(ev));
            doc.addEventListener("keyup", ev => this.keyUp(ev));
        }

        public isDown(key: CtlKey) : boolean {
            return this.pressed[key];
        }

        private keyUp(ev: KeyboardEvent) {
            this.pressed[ev.keyCode] = false;
        }
        
        private keyDown(ev : KeyboardEvent) {
            this.pressed[ev.keyCode] = true;
        }

        private wheel(ev : MouseWheelEvent) {
        }
        
        private click(ev : MouseEvent) {
            this.lastClick = ev;
        }
    }
    
    export class Logger {
        constructor(private logArea: HTMLTextAreaElement) {
        }
        
        public log(s: string | number) {
            var message = (s + '\n' + this.logArea.value); //.substr(0, 10000);
            this.logArea.value = message;
        }
    }
    
    export class World { 
        public north = 0;
        public south = 0;
        public east = 0;
        public west = 0;
        
        // drag acts against the velocity of the object in a small amount
        public drag = -0.9;
        
        public things = new Array<Thing>();
        
        constructor(public width: number, public height: number) {
            this.south = height;
            this.east = width;
        }
        
        public update(time : number, input: Input) {
            for (var i = 0; i < this.things.length; i++) {
                this.things[i].update(time, this, input);
            }
        }

        public render(ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = "aliceblue";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fill();

             for (var i = 0; i < this.things.length; i++) {
                this.things[i].render(ctx);
             }
        }
    }
    
    
    export class Thing {
        protected velocity = Vector.Zero(2);
        protected position = Vector.Zero(2);
        protected acceleration = Vector.Zero(2);
        protected mass = 30;

        constructor(public logger: Logger, x: number, y: number) {
            this.position = Vector.create([x, y]);
        }

        public update(time: number, world : World, input: Input) {
            this.position = this.position.add(this.velocity.multiply(time));
            this.velocity = this.velocity.add(this.acceleration.multiply(time));
        }
        
        public render(ctx: CanvasRenderingContext2D) {
        }        
        
        public getX() { 
            return this.position.e(1); 
        }
        
        public getY() { 
            return this.position.e(2); 
        }
        
        public getV() {
            return this.velocity.dup();
        }
    }
    
    export class Bullet extends Thing {
        constructor(ship: Ship, x: number, y: number, velocity: Vector) {
            super(ship.logger, x, y);
            this.velocity = velocity;
            this.mass = 2;
        }

        public update(time: number, world : World, input: Input) {
            super.update(time, world, input);
        }
        
        public render(ctx: CanvasRenderingContext2D) {
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.arc(this.position.e(1), this.position.e(2), this.mass, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    export class Weapon {
        private velocity = 1000;
        
        constructor(private ship : Ship) {
            
        }
        
        public fire(world : World, position: Vector, velocity: Vector, mass: number) {
            var endOfLine = position.add(velocity.toUnitVector().multiply(mass * 2));
            world.things.push(
                new Bullet(
                    this.ship,
                    endOfLine.e(1),
                    endOfLine.e(2),
                    this.ship.getV().toUnitVector().multiply(this.velocity)));
        }
    }
    
    export class Ship extends Thing {
        
        private heading = 0;
        private power = 1000;
        private angularPower = 2000;
        private weapon : Weapon;
        
        constructor(logger: Logger, x: number, y: number) {
            super(logger, x, y);
            this.weapon = new Weapon(this);
        }
        
        public update(time: number, world : World, input: Input) {

            if (input.isDown(CtlKey.Fire)) {
                this.weapon.fire(world, this.position, this.velocity, this.mass);
            }

            super.update(time, world, input);            

            // calc net forces
            var force = Vector.Zero(2);
            if (input.isDown(CtlKey.Up)) {
                force = force.add(Vector.create([0, -this.power]));
            } else if (input.isDown(CtlKey.Down)) {
                force = force.add(Vector.create([0, this.power]));
            } 
            if (input.isDown(CtlKey.Left)) {
                force = force.add(Vector.create([-this.power, 0]));
            } else if (input.isDown(CtlKey.Right)) {
                force = force.add(Vector.create([this.power, 0]));
            }
            if (input.isDown(CtlKey.Accelerate)) {
                if (this.velocity.eql(Vector.Zero(2))) {
                    // Allow user to accelerate from standing stop.
                    this.velocity.setElements([0, -0.1]);
                }
                force = force.add(this.velocity.toUnitVector().multiply(this.power));
            } else if (input.isDown(CtlKey.Brake)) {
                force = force.add(this.velocity.rotate(Math.PI, Vector.Zero(2)).toUnitVector().multiply(this.power));
            }
            this.acceleration = force.divide(this.mass).multiply(time);
            
            // change heading
            var veerRight = input.isDown(CtlKey.Clockwise);
            var veerLeft = input.isDown(CtlKey.AntiClockwise);
            var rotation : Vector = null;
            if (veerRight || veerLeft) {
                rotation = this.velocity
                    .rotate(Math.PI / 2 * (veerRight ? 1 : -1), Vector.Zero(2))
                    .toUnitVector()
                    .multiply(this.angularPower)
                    .multiply(time);
                this.acceleration = this.acceleration.add(rotation);
            }
        }
        
        public render(ctx: CanvasRenderingContext2D) {
            ctx.beginPath();
            ctx.arc(this.getX(), this.getY(), this.mass, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.strokeStyle = 'black';
            ctx.strokeText(this.report(), 20, 40);
            ctx.stroke();
            
            if  (this.velocity.modulus() > 0.5) {
                ctx.moveTo(this.getX(), this.getY());
                var endOfLine = this.position.add(this.velocity.toUnitVector().multiply(this.mass * 2));
                ctx.lineTo(endOfLine.e(1), endOfLine.e(2));
                ctx.stroke();
            }
        }
        
        public report() : string {
            return 'p ' + this.fv(this.position) 
                + ' v ' + this.fv(this.velocity)
                + ' a ' + this.fv(this.acceleration);
        }
        
        private fv(v: Vector) : string {
            var e = v.elements;
            return e[0].toFixed(2).toString() + ', ' + e[1].toFixed(2).toString(); 
        }
    }
    
    export class client {
        
        private ctx : CanvasRenderingContext2D;
        private world : World;
        private clock = 0;
        private logger : Logger;
        private input : Input;
        
        constructor(canvas : HTMLCanvasElement, logArea : HTMLTextAreaElement) {
            
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;

            this.logger = new Logger(logArea);
            this.world = new World(canvas.width, canvas.height);
            this.input = new Input(canvas, document);

            this.ctx = canvas.getContext("2d");
            
            this.world.things.push(new Ship(this.logger, 100, 100));
            
            this.startGameLoop();
        }
        
        private startGameLoop() {
            setInterval(() => {
                this.updateWorld(0.033);
                this.renderWorld();
            }, 30)
        }
        
        private updateWorld(time : number) {
            this.clock += time;
            this.world.update(time, this.input);            
        }
        
        private renderWorld() {
            this.ctx.strokeStyle = 'gray';
            this.ctx.strokeRect(0, 0, this.world.width, this.world.height);
            this.ctx.stroke();
            
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeText(this.clock.toFixed(1).toString(), 20, 20);
            this.ctx.stroke();
            
            this.world.render(this.ctx);
        }
        
    }
    
}