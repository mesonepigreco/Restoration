import { Sprite} from "./sprite.js";
import { Keyboard} from "./keyboard.js";
import {norm} from "./vector_func.js";

export class Player extends Sprite {
    constructor(x, y, groups, collision_group) {
        super(x, y, groups);

        this.loaded  = 0;
        let self = this;

        function load() {
            self.loaded += 1
        }
        // Initialize the animations

        this.animations = {
            "idle_down" : [],
            "idle_up" : [],
            "idle_left" : [],
            "idle_right" : [],
            "run_down" : [],
            "run_up" : [],
            "run_left" : [],
            "run_right" : []
        }
        
        this.load_frame(load, "assets/wizard/back.png", "idle_up");
        this.load_frame(load, "assets/wizard/front.png", "idle_down");
        this.load_frame(load, "assets/wizard/side.png", "idle_right");
        this.load_frame(load, "assets/wizard/side_r.png", "idle_left");
        

        /*
        this.load_animation("idle", "data/miner/idle", 6, 13, 4);
        this.load_animation("walk", "data/miner/walk", 0, 7, 4);
        this.load_animation("fall", "data/miner/fall", 13, 18, 4);*/


        this.collision_group = collision_group;
        this.direction = "down";
        this.status = "idle";
        this.speed = 40;
        //this.jump = 250; 
        this.magic_value = 100;
        this.current_animation = "idle_down";

        // Triggers and timeouts
        this.invincibility_time = -1000;
        this.invincibility_timeout = 100;

        this.keyboard = new Keyboard();
        this.kind = "player";
    }

    is_loaded() {
        if (this.loaded === 4) return true;
        return false;
    }

    update_status() {
        // For now nothing


        this.current_animation = this.status + "_" + this.direction;
    }

    update_controls() {
        //console.log(this.keyboard.keys);
        if (this.keyboard.keys["ArrowRight"]) {
            this.velocity.x = this.speed;
            this.direction = "right";
        } 
        else if (this.keyboard.keys["ArrowLeft"]) {
            this.velocity.x = -this.speed;
            this.direction = "left";
        } else {
            this.velocity.x = 0;
        }

        if (this.keyboard.keys["ArrowUp"]) {
            this.velocity.y = -this.speed;
            this.direction = "up";
        }
        else if (this.keyboard.keys["ArrowDown"]) {
            this.velocity.y = this.speed;
            this.direction = "down";
        } else {
            this.velocity.y = 0;
        }

        if (this.keyboard.keys[" "] && this.is_ground) {
            this.velocity.y = - this.jump;
        }
    }

    update(dt) {
        // Call the update of the upper function
        super.update(dt);

        this.update_controls();

        // Apply the horizontal moovement
        this.x += this.velocity.x * dt;
        this.update_collision(true);

        // Apply the vertical moovement
        this.y += this.velocity.y * dt;
        this.update_collision(false);

        // Change the animation to be played
        this.update_status();
    }

    update_collision(left_right = true) {
        let colliders = this.collision_group.sprites;
        var is_ground = false;
        //console.log("Colliders: ", this.collision_group.sprites);
        for (var i = 0; i < colliders.length; ++i) {
            let sprite =  colliders[i];
            if (sprite.collidewith(this)) {
                // Check for the horizontal direction
                if (left_right) {
                    if (this.velocity.x > 0) {
                        this.x = sprite.x - this.image.width;
                    } else if (this.velocity.x < 0) {
                        this.x = sprite.x + sprite.image.width;
                    }
                    this.velocity.x = 0;
                }
                else {
                    // Check for the vertical direction
                    if (this.velocity.y > 0) {
                        this.y = sprite.y - this.image.height;
                        is_ground = true;
                    } else if (this.velocity.y < 0) {
                        this.y = sprite.y + sprite.image.height;
                    }
                    this.velocity.y = 0;
                }
            }
        }

        if (this.is_ground && !is_ground) {
            this.is_ground = false;
            this.falling_timer = Date.now();
        } else {
            this.is_ground = is_ground;
        }
    }
}