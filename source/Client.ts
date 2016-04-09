
namespace deltav {

    export class Client {

        private ctx: CanvasRenderingContext2D;
        private world: World;
        private clock = 0;
        private logger: Logger;
        private input: Input;

        constructor(canvas: HTMLCanvasElement, logArea: HTMLTextAreaElement) {

            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;

            this.logger = new Logger(logArea);
            this.world = new World(canvas.width, canvas.height);
            this.input = new Input(canvas, document);

            this.ctx = canvas.getContext("2d");

            this.world.things.push(new Ship(this.logger, 400, 500));

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
        }

        private renderWorld() {
            this.ctx.strokeStyle = "gray";
            this.ctx.strokeRect(0, 0, this.world.width, this.world.height);
            this.ctx.stroke();

            this.ctx.strokeStyle = "black";
            this.ctx.strokeText(this.clock.toFixed(1), 20, 20);
            this.ctx.stroke();

            this.world.render(this.ctx);
        }
    }
}
