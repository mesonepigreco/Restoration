import { Sprite } from "./sprite.js";

export class Character extends Sprite {
    constructor(x, y, kind, groups) {
        super(x, y, kind, groups);

        // Here the stats of the character
        this.hp = 100;
        this.speed = 5;
        this.strenght = 12;
        this.intelligence = 12;
        this.wisdom = 12;
        this.armor = 0;
        
        // Here additional things about the character
        this.equipment = [];
        this.holding = null;
        this.clothes = [];
        this.spells = [];
    }
}