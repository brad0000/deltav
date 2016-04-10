var deltav;
(function (deltav) {
    class Star extends deltav.Body {
        constructor(logger, position, radius) {
            super(logger, position);
            this.radius = radius;
        }
        update(time, world, input) {
        }
        render(ctx) {
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(this.getX(), this.getY(), this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    deltav.Star = Star;
})(deltav || (deltav = {}));

//# sourceMappingURL=Star.js.map
