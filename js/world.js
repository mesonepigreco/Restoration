import { Camera } from "./camera.js";
import { Group, YSortedGroup } from "./groups.js"
import { Player } from "./player.js";
import { Sprite } from "./sprite.js"
import { TileMap } from "./tilemap.js";
import { draw_color_circle } from "./color_effects.js";
export class World {
    constructor(canvas, context) {
        this.background_group = new Group();
        this.visible_group = new YSortedGroup();
        this.collision_group = new Group();
        this.tilemap = null;
        this.canvas = canvas;
        this.context = context;

        this.player = new Player(70, 100, [], this.collision_group);
        this.camera = new Camera(this.player, canvas);
        this.visible_group.add(this.player);
    }

    draw() {
        this.background_group.draw(this.context, this.camera);
        this.visible_group.draw(this.context, this.camera);


        // Draw the color circle
        const center = this.player.imagerect.center;
        const position = {
            x :  this.player.x + center.x - this.camera.x,
            y :  this.player.y + center.y - this.camera.y
        };

        draw_color_circle(this.context, this.canvas, position, 60);
    }

    update(dt) {
        this.visible_group.update(dt);
        this.camera.update(dt);
    }

    is_loaded() {
        if (!this.tilemap.full_loaded) return false;
        if (!this.player.is_loaded()) return false;
        return true;
    }

    create_from_tilemap(url) {
        this.tilemap = new TileMap(url, this.background_group, this.visible_group, this.collision_group);
    }
}