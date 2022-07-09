import { Character } from "./character.js";
import { distance, norm } from "./vector_func.js";

export class Wolf extends Character {
    constructor(x, y, raycast, groups) {
        super(x, y, "enemy", groups, null);

        let self = this;
        function load() {
            self.loaded += 1;
            //self.image = self.animations[self.current_animation];
        }

        // Field of vision
        this.fov = 200;
        this.angle_of_vision = 120 // Degrees

        this.attack_rate = 1; // Per second
        this.attack_trigger = -1000;
        this.attack_range = 10;

        this.spot_trigger = -1000;
        this.spot_countdown = 200;
        this.speed = 15;

        this.target = null;
        this.raycast = raycast;
        this.facing_direction = "down";
        this.angle_start = 0;
        this.angle_end = 0;
        this.spotted = false;
        this.status = "idle";

        this.invisible = false;

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

    is_loaded() {
        if (this.loaded === 4) return true;
        return false;
    }


    get_angle() {
        let angle_start = 0;
        let angle_end = 0;

        if (norm(this.velocity) < 0.1) {
            if (this.facing_direction === "down") {
                angle_start = -2.79252;
                angle_end = -0.3491;
            } else if (this.facing_direction === "right") {
                angle_start = -1.22173;
                angle_end = 1.22173;
            } else if (this.facing_direction === "up") {
                angle_start = 0.34906;
                angle_end = 2.79252;
            } else if (this.facing_direction === "left") {
                angle_start = 1.91986;
                angle_end = 4.36332;
            }
        } else {
            let angle = Math.atan2(-this.velocity.y, this.velocity.x);
            angle_start = angle - this.angle_of_vision *Math.PI / 180;
            angle_end = angle + this.angle_of_vision *Math.PI / 180;
            if (angle_start < -Math.PI) {
                angle_start += 2*Math.PI;
                angle_end += 2*Math.PI;
            }
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

    update_direction() {
        if (this.velocity.x > this.velocity.y) {
            if (this.velocity.x > 0) this.facing_direction = "right";
            else this.facing_direction = "left";
        } else {
            if (this.velocity.y > 0) this.facing_direction = "down";
            else this.facing_direction = "up"; 
        }

        if (norm(this.velocity) > 0.1) console.log("I'm going: ", this.facing_direction);


        this.current_animation = this.status + "_" + this.facing_direction;
    }

    update(dt) {
        let player = this.target;
        let time = Date.now();
        if (player !== null && this.image !== null) {
            // Check if the enemy can see the player.
            this.get_angle();
            let visible = this.raycast.project_ray(this.center, player.center, this.fov, this.angle_start, this.angle_end);
            
            if (visible && !this.spotted) {
                console.log("Spotted!");
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
            } else {
                console.log("WHERE IS HIM?");
            }
        }

        this.update_direction();

        super.update(dt);

        // TODO: update the status
    }

    draw(context, camera) {
        super.draw(context, camera);

    }
}