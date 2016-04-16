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
    class Box {
        constructor(north, south, east, west) {
            this.north = north;
            this.south = south;
            this.east = east;
            this.west = west;
            this.width = this.east - this.west;
            this.height = this.south - this.north;
        }
        translate(x, y) {
            this.west += x;
            this.east += x;
            this.north += y;
            this.south += y;
        }
        centerOn(position) {
            this.west = position.e(1) - this.width / 2;
            this.north = position.e(2) - this.height / 2;
            this.east = this.west + this.width;
            this.south = this.north + this.height;
        }
        divide() {
            let cx = this.west + this.width / 2;
            let cy = this.north + this.height / 2;
            return [
                new Box(this.north, cy, cx, this.west),
                new Box(this.north, cy, this.east, cx),
                new Box(cy, this.south, cx, this.west),
                new Box(cy, this.south, this.east, cx),
            ];
        }
        clamp(box) {
            if (this.west < box.west) {
                this.west = box.west;
                this.east = this.west + this.width;
            }
            else if (this.east > box.east) {
                this.east = box.east;
                this.west = this.east - this.width;
            }
            if (this.north < box.north) {
                this.north = box.north;
                this.south = this.north + this.height;
            }
            else if (this.south > box.south) {
                this.south = box.south;
                this.north = box.south - this.height;
            }
        }
        contains(other) {
            return this.north < other.north
                && this.west < other.west
                && this.south > other.south
                && this.east > other.east;
        }
        intersects(other) {
            return !((this.south < other.north || this.north > other.south)
                || (this.east < other.west || this.west > other.east));
        }
    }
    deltav.Box = Box;
})(deltav || (deltav = {}));

//# sourceMappingURL=app.js.map
