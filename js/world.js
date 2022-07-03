import { Group, YSortedGroup } from "./groups.js"
import { Player } from "./player.js";
import { Sprite } from "./sprite.js"
import { TileMap } from "./tilemap.js";

export class World {
    constructor(canvas, context) {
        this.background_group = new Group();
        this.visible_group = new YSortedGroup();
        this.collision_group = new Group();
        this.tilemap = null;
        this.canvas = canvas;
        this.context = context;

        this.camera = {
            x : 0, y : 0
        };
        this.camera_velocity = {
            x : 0, y : 0
        };
        this.camera_speed = 4;

        this.player = new Player(100, 100, [], this.collision_group);
        this.visible_group.add(this.player);
    }

    draw() {
        this.background_group.draw(this.context, this.camera);
        this.visible_group.draw(this.context, this.camera);
    }

    update_camera(dt) {
        this.camera_velocity.x = this.camera_speed *( (this.player.x - this.canvas.width / 2) - this.camera.x);
        this.camera_velocity.y = this.camera_speed *((this.player.y - this.canvas.height / 2) - this.camera.y);
        this.camera.x += this.camera_velocity.x * dt
        this.camera.y += this.camera_velocity.y * dt
    }

    update(dt) {
        this.visible_group.update(dt);
        this.update_camera(dt);
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