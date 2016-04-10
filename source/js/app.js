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
        intersects(other) {
            return !((this.south < other.north || this.north > other.south)
                || (this.east < other.west || this.west > other.east));
        }
    }
    deltav.Box = Box;
})(deltav || (deltav = {}));

//# sourceMappingURL=app.js.map
