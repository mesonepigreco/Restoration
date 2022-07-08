import { Character } from "./character.js";
import { distance, norm } from "./vector_func.js";

export class Wolf extends Character {
    constructor(x, y, raycast, groups) {
        super(x, y, "enemy", groups);

        // Field of vision
        this.fov = 60;
        this.angle_of_vision = 60 // Degrees

        this.attack_rate = 1; // Per second
        this.attack_trigger = -1000;
        this.attack_range = 10;

        this.spot_trigger = -1000;
        this.spot_countdown = 200;

        this.target = null;
        this.raycast = raycast;
        this.facing_direction = "down";
        this.angle_start = 0;
        this.angle_end = 0;
        this.spotted = false;
        this.status = "idle";

        // Assets and animations
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
        
        this.load_frame(load, "assets/wolf/back.png", "idle_up");
        this.load_frame(load, "assets/wolf/front.png", "idle_down");
        this.load_frame(load, "assets/wolf/right.png", "idle_right");
        this.load_frame(load, "assets/wolf/left.png", "idle_left");
    }

    get_angle() {
        let angle_start = 0;
        let angle_end = 0;

        if (this.facing_direction === "down") {
            angle_start = -2.3561;
            angle_end = -0.7854;
        } else if (this.facing_direction === "right") {
            angle_start = -0.7854;
            angle_end = 0.7854;
        } else if (this.facing_direction === "up") {
            angle_start = 0.7854;
            angle_end = 2.3561;
        } else if (this.facing_direction === "left") {
            angle_start = 2.3561;
            angle_end = 3.9270;
        }
        this.angle_start = angle_start;
        this.angle_end = angle_end;
    }

    move_to(position) {
        // Move toward the given position
        this.velocity.x = position.x - this.x;
        this.velocity.y = position.y - this.y;

        let nn = norm(this.velocity);
        this.velocity.x *= this.speed / nn;
        this.velocity.y *= this.speed / nn;
    }

    attack(enemy) {
        let time = Date.now();
        if (distance(this.center, enemy.center) < this.attack_range) {
            if (time - this.attack_trigger > 1000 / this.attack_rate) {
                // TODO: Show the animation of the attack

                // Trigger the attack
                // TODO: Push back function
                
                // Compute the damage
                let damage = this.attack - enemy.armor;
                enemy.hp -= damage;
                this.attack_trigger = time;
            }
        }
    }

    update(dt, player = null) {
        let time = Date.now();
        if (player !== null) {
            // Check if the enemy can see the player.
            this.get_angle();
            let visible = this.raycast.project_ray(this.center, player.center, this.fov, this.angle_start, this.angle_end);
            
            if (visible && !this.spotted) {
                // Check if we need to play an animation or a spotted sound
                if (time - this.spot_trigger > this.spot_countdown) {
                    // Spotted for the first time
                    this.spotted = true;
                    this.spot_trigger = time;
                    
                    // TODO: Play animation and sound
                }
            }

            if (visible) {
                // Update the target
                this.move_to(player.center);
                this.attack(player);
            }
        }

        super.update(dt);

        // TODO: update the status
    }
}