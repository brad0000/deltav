namespace deltav {
    export class Logger {
        constructor(private logArea: HTMLTextAreaElement) {
        }

        public log(s: string | number) {
            let message = (s + "\n" + this.logArea.value);
            this.logArea.value = message;
        }
    }

    export class Box {
        public width: number;
        public height: number;

        constructor(
            public north: number,
            public south: number,
            public east: number,
            public west: number) {
            this.width = this.east - this.west;
            this.height = this.south - this.north;
        }

        public intersects(other: Box): boolean {
            // check if a is totally outside b, in 2 dimensions, then negate.
            return !((this.south < other.north || this.north > other.south)
                || (this.east < other.west || this.west > other.east));
        }
    }
}
