import { Sprite} from "./sprite.js";
import { Keyboard} from "./keyboard.js";
import {norm} from "./vector_func.js";
import {draw_color_circle} from "./color_effects.js";
import {Character} from "./character.js"
import { particle_burst } from "./particles.js";

export class Player extends Character {
    constructor(x, y, groups, collision_group) {
        super(x, y, "player", groups, collision_group);

        this.loaded  = 0;
        let self = this;

        function load() {
            self.loaded += 1
        }

        function switch_spell() {
            self.selected_spell = (self.selected_spell + 1) % self.spells.length;
        }
        let keyup_switch_spell = {key: 'c', func: switch_spell};
        this.keyboard = new Keyboard();
        this.keyboard.firefunctions.push(keyup_switch_spell);
        
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


        this.direction = "down";
        this.status = "idle";
        this.speed = 40;
        //this.jump = 250; 
        this.magic_value = 100;
        this.current_animation = "idle_down";

        this.use_magic_trigger = -1000;
        this.use_magic_cooldown = 500;

        // Triggers and timeouts
        this.invincibility_time = -1000;
        this.invincibility_timeout = 100;

        this.kind = "player";

        this.spells = ['heal', 'invisiblility'];
        this.spell_cooldowns = [1000, 5000];
        this.mana_consumption = [30, 15];
        this.selected_spell = 0;
        this.visible_group = null;
    }

    is_loaded() {
        if (this.loaded === 4) return true;
        return false;
    }


    setup_collider() {
        if (this.image !== null) {
            let collider = this.imagerect.inflate(0.8, 0.5);
            collider.midbottom = this.imagerect.midbottom;
            this.colliders = [collider];
        }
    }

    update_status() {
        // For now nothing
        this.current_animation = this.status + "_" + this.direction;
    }

    update_controls() {
        // Avoid giving access to controls if the player is stunned
        if (this.stunned) return;

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

        // Activate the current spell 
        if (this.keyboard.keys[" "]) {
            // Use magic
            this.use_magic();
        } 
    }

    use_magic() {
        let time = Date.now();

        // Check if we can use the magic
        if (time - this.use_magic_trigger > this.use_magic_cooldown) {
            // Activate the spell only if there is enough mana
            if (this.mana > this.mana_consumption[this.selected_spell]) {
                this.mana -= this.mana_consumption[this.selected_spell]

                this.use_magic_trigger = time;
                this.use_magic_cooldown = this.spell_cooldowns[this.selected_spell];


                if (this.spells[this.selected_spell] === 'heal') {
                    // TODO: Animate heal
                    particle_burst(this.center, 50, this.particle_model, 30, this.visible_group);

                    this.current_hp += 10;
                    if (this.current_hp > this.hp) this.current_hp = this.hp;
                } else if (this.spells[this.selected_spell] === 'invisiblility') {
                    this.set_invisibility();
                }
            } else {
                // TODO: add a sound to suggest that the mana is ended
            }
        }
    }

    update(dt) {
        // Check if the status needs to be updated
        if (this.colliders.length === 0) this.setup_collider();

        // Call the update of the upper function
        super.update(dt);

        this.update_controls();

        // Change the animation to be played
        this.update_status();
    }

}