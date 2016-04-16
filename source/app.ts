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

        public translate(x: number, y: number) {
            this.west += x;
            this.east += x;
            this.north += y;
            this.south += y;
        }

        public centerOn(position: Vector) {
            this.west = position.e(1) - this.width / 2;
            this.north = position.e(2) - this.height / 2;
            this.east = this.west + this.width;
            this.south = this.north + this.height;
        }

        public divide(): Box[] {
            let cx = this.west + this.width / 2;
            let cy = this.north + this.height / 2; 
            return [
                new Box(this.north, cy, cx, this.west),
                new Box(this.north, cy, this.east, cx),
                new Box(cy, this.south, cx, this.west),
                new Box(cy, this.south, this.east, cx),  
            ];
        }

        public clamp(box: Box) {
            if (this.west < box.west) {
                this.west = box.west;
                this.east = this.west + this.width;
            } else if (this.east > box.east) {
                this.east = box.east;
                this.west = this.east - this.width;
            }
            if (this.north < box.north) {
                this.north = box.north;
                this.south = this.north + this.height;
            } else if (this.south > box.south) {
                this.south = box.south;
                this.north = box.south - this.height;
            }
        }

        public contains(other: Box): boolean {
            return this.north < other.north
                && this.west < other.west
                && this.south > other.south
                && this.east > other.east;
        }
        
        public intersects(other: Box): boolean {
            // check if a is totally outside b, in 2 dimensions, then negate.
            return !((this.south < other.north || this.north > other.south)
                || (this.east < other.west || this.west > other.east));
        }
    }
}
