export class Spell {
    constructor() {
        this.trigger = -1000;
        this.cooldown_time = 0;
        this.mana_cost = 10;
        this.character = null;
    }

    generate_effect() {
        // NULL 
    }

    draw() {
        // NULL
    }

    update() {
        var time = Date.now();
        if (time - this.trigger < this.cooldown_time) {
            // HERE THE EFFECT
            this.generate_effect();
        }
    }
}