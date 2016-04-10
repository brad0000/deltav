var deltav;
(function (deltav) {
    class Wreckage extends deltav.Body {
        constructor(logger, position, velocity) {
            super(logger, position);
            this.velocity = velocity;
        }
        update(time, world, input) {
            super.update(time, world, input);
            world.addStaticBody(new Smoke(this.logger, this.position, this.velocity.add([
                Math.random() * 100,
                Math.random() * 100,
            ]), 2));
        }
        render(ctx) {
        }
    }
    deltav.Wreckage = Wreckage;
    class Smoke extends deltav.Body {
        constructor(logger, position, velocity, radius, color) {
            super(logger, position);
            this.fireGradient = [
                "255,0,0",
                "255,0,0",
                "255,0,0",
                "255,0,0",
                "255,106,0",
                "255,106,0",
                "255,216,0",
                "255,216,0",
                "255,255,255",
                "0,255,255",
            ];
            this.velocity = velocity;
            this.opacity = 1;
            this.brush = color || "white";
            this.radius = radius;
            this.deltaRadius = this.radius / 2;
        }
        update(time, world, input) {
            super.update(time, world, input);
            this.radius += this.deltaRadius;
            this.opacity -= 0.1;
            if (this.opacity < 0) {
                this.isDead = true;
            }
        }
        render(ctx) {
            ctx.beginPath();
            ctx.fillStyle = this.fireColor(this.opacity);
            ctx.arc(this.getX(), this.getY(), this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        fireColor(opacity) {
            return "rgba("
                + this.fireGradient[Math.round(opacity * this.fireGradient.length)]
                + ", "
                + opacity
                + ")";
        }
    }
    deltav.Smoke = Smoke;
})(deltav || (deltav = {}));

//# sourceMappingURL=Smoke.js.map
