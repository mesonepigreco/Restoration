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

        this.target = null;
        this.raycast = raycast;
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
        if (distance(this, enemy) < this.attack_range) {
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

    update(dt) {
        
    }
}