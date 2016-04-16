
namespace deltav {

    export class Client {

        private ctx: CanvasRenderingContext2D;
        private world: World;
        private view: View;
        private clock = 0;
        private logger: Logger;
        private input: IInput;

        constructor(canvas: HTMLCanvasElement, logArea: HTMLTextAreaElement) {

            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;

            this.logger = new Logger(logArea);
            this.world = new World(this.logger, 100000, 100000);
            this.view = new View(this.logger, canvas.width, canvas.height, this.world);
            this.input = new Input(canvas, document);
            this.ctx = canvas.getContext("2d");

            this.startGameLoop();
        }

        private startGameLoop() {
            setInterval(() => {
                this.updateWorld(0.033);
                this.renderWorld();
            }, 30);
        }

        private updateWorld(time: number) {
            this.clock += time;
            
            this.world.update(time, this.input);
            this.view.update(time, this.world, this.input);
        }

        private renderWorld() {
            this.view.render(this.ctx);
        }
    }
    
    export class View extends Box {
        
        constructor(private logger: Logger, width: number, height: number, private world: World) {
            super(0, height, width, 0);
        }

        public update(time: number, world: World, input: IInput) {
            
            let playerPosition = world.getPlayerPosition();
            
            this.centerOn(playerPosition);
            this.clamp(world);
            
            // if (input.isDown(CtlKey.Down)) {
            //     this.translate(0, 10);
            // }
            // if (input.isDown(CtlKey.Up)) {
            //     this.translate(0, -10);
            // }
            // if (input.isDown(CtlKey.Left)) {
            //     this.translate(-10, 0);
            // }
            // if (input.isDown(CtlKey.Right)) {
            //     this.translate(10, 0);
            // }
        }

        public render(ctx: CanvasRenderingContext2D) {
            
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fill();
            
            // HEADS UP
            // ctx.strokeStyle = "white";
            // ctx.strokeText(this.west + "," + this.north, 20, 20);
            // ctx.stroke();
            
            ctx.translate(-this.west, -this.north);
            
            // Tell the world to render itself, but to clip to the view's bounds.
            this.world.render(ctx, this);
            
            ctx.translate(this.west, this.north);
        }
    }
}
