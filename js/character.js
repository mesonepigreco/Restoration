import { Particle, particle_flow } from "./particles.js";
import { Sprite } from "./sprite.js";

export class Character extends Sprite {
    constructor(x, y, kind, groups, collision_group = null) {
        super(x, y, kind, groups);

        // Here the stats of the character
        this.hp = 100;
        this.speed = 5;
        this.strenght = 12;
        this.intelligence = 12;
        this.armor = 0;
        this.mana = 100;

        this.xp = 0;
        
        // Here additional things about the character
        this.equipment = [];
        this.holding = null;
        this.clothes = [];
        this.spells = [];

        this.invisible = true;
        this.invulnerable = false;
        this.invisibility_trasparency = .6;
        this.invisibility_period = 700;
        this.invisibility_amplitude = .2;
        this.flicker_period = 180; // ms
        this.particle_speed = 30;


        this.collision_group = collision_group;


        // Load the model for the particles
        this.particle_model = new Particle(this.x, this.y);
        this.particle_model.set_all_animations(["blink"]);
        this.particle_model.load_animation("blink", "assets/blink", 0, 4, 4, ".png");
        this.particle_period = .1;
    }

    get max_mana() {
        return this.intelligence * 10;
    }

    level_up() {
        this.strenght += Math.random();
        this.intelligence += Math.random();
        this.hp += Math.random()*5;
        this.mana = this.max_mana;
        this.xp = 0;
    }


    update(dt) {
        super.update(dt);

        // Update the armor
        this.armor = (this.strenght - 12) * 0.2 
        for (var i = 0; i  < this.clothes.length; ++i) this.armor += this.clothes[i].armor;

        // Apply the horizontal moovement
        this.x += this.velocity.x * dt;
        //this.x = Math.floor(this.x);
        this.update_collision(true);

        // Apply the vertical moovement
        this.y += this.velocity.y * dt;
        //this.y = Math.floor(this.y);
        this.update_collision(false);
    }

    draw(context, camera) {
        context.save();
        if (this.invulnerable) {
            context.globalAlpha = Math.sin(Date.now() * Math.PI / this.flicker_period)**2;
        } else if (this.invisible) {
            var variable_alpha = .5*(Math.sin(Date.now() * Math.PI * 2 / this.invisibility_period) + 1);
            context.globalAlpha =  this.invisibility_trasparency + variable_alpha* this.invisibility_amplitude;

        }

        super.draw(context, camera);
        context.restore();
    }


    update_collision(left_right = true) {
        if (this.collision_group === null) {
            console.log("Il lupetto se ne va");
            return;
        }

        let colliders = this.collision_group.sprites;
        var is_ground = false;
        //console.log("Colliders: ", this.collision_group.sprites);
        for (var i = 0; i < colliders.length; ++i) {
            let sprite =  colliders[i];
            let collision = null;
            collision = this.collidewith(sprite);

            if (collision !== null) {

                // Check for the horizontal direction
                if (left_right) {
                    if (this.velocity.x > 0) {
                        this.x = sprite.x + collision.left - this.colliders[0].right - 1e-8;
                    } else if (this.velocity.x < 0) {
                        this.x = sprite.x + collision.right - this.colliders[0].left + 1e-8;
                    }
                    this.velocity.x = 0;
                }
                else {
                    // Check for the vertical direction
                    if (this.velocity.y < 0) {
                        this.y = sprite.y + collision.bottom - this.colliders[0].top + 1e-8;
                        is_ground = true;
                    } else if (this.velocity.y > 0) {
                        this.y = sprite.y + collision.top - this.colliders[0].bottom - 1e-8;
                    }
                    this.velocity.y = 0;
                }
            }
        }
        /*
        if (this.is_ground && !is_ground) {
            this.is_ground = false;
            this.falling_timer = Date.now();
        } else {
            this.is_ground = is_ground;
        }*/
    }
}


