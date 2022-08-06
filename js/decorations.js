import { Sprite } from "./sprite.js";

export class AnimatedFlower extends Sprite {
    constructor(x, y, groups = []) {
        super(x, y, "flower", groups);

        // The dimension of the flower
        this.loaded  = false;

        let self = this;
        this.load_static_image("assets/decorations/flower.png", () => {
            self.loaded = true;
        });
        this.set_width_height(8,8);
        this.setup_spritesheet_animation("idle", [0,1]);

        this.current_animation = "idle";
        this.frame_rate = 1.2;
    }

    is_loaded() {
        return self.loaded;
    }
}