var deltav;
(function (deltav) {
    class Smoke extends deltav.Body {
        constructor(ship, x, y, velocity) {
            super(ship.logger, x, y);
            this.radius = 1;
            this.opacity = 1;
            this.velocity = velocity;
            this.brush = "white";
        }
        update(time, world, input) {
            super.update(time, world, input);
            this.radius += 0.5;
            this.opacity -= 0.1;
            if (this.opacity < 0) {
                this.isDead = true;
            }
        }
        render(ctx) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(255, 255, 255, " + this.opacity.toString() + ")";
            ctx.arc(this.getX(), this.getY(), this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    deltav.Smoke = Smoke;
})(deltav || (deltav = {}));

//# sourceMappingURL=Smoke.js.map
