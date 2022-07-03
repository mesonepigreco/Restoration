import { Sprite } from "./sprite.js";
import {File} from "./filesystem.js"

export class TileMap {
    constructor(json_url, background_group, visible_group, obstacle_group) {

        this.background_group = background_group
        this.visible_group = visible_group;
        this.obstacle_group = obstacle_group;

        this.total_width = 0;
        this.total_height = 0;
        this.tilewidth = 0;
        this.full_loaded = false;

        this.tileset = [];

        this.file = new File(json_url, "json", this.init.bind(this));
        this.base_url = get_basename(json_url);
    }

    init() {
        console.log("HERE:", this);
        let data =  this.file.data;
        this.total_height = data.height;
        this.total_width = data.width;
        this.tilewidth = data.tilewidth;

        // Load the tilesets
        var current_index;
        var start_id = 0;
        for (var i = 0; i < data.tilesets.length; ++i) {
            let tset = data.tilesets[i];
            start_id = tset.firstgid;

            for (var j = 0; j < tset.tiles.length; ++j) {
                let tile = new MapTile(this.base_url + "/" + tset.tiles[j].image, 
                    tset.tiles[j].id + start_id,
                    tset.tiles[j].imagewidth,
                    tset.tiles[j].imageheight);
                
                // TODO: Add here the colliers of the object
                this.tileset.push(tile);
            }
        }

        for (var i = 0; i < data.layers.length; ++i) {
            let layer = data.layers[i];
            var lheight = layer.height;
            var lwidth = layer.width;
            for (var j = 0; j < layer.data.length; ++j) {
                var x = (j % lwidth) * this.tilewidth;
                var y = Math.floor(j / lwidth) * this.tilewidth;

                let tile = this.get_tile(layer.data[j]);
                if (tile === null) {
                    console.log("ERROR while loading tile: id = ", layer.data[j], " layer ",  i, "position", j);
                } else if (tile !== 0) {
                    let tile_sprite = tile.generate_sprite(x, y, "map");
                    if (layer.name.toLowerCase() === "background")
                        this.background_group.add(tile_sprite);
                    else
                        this.visible_group.add(tile_sprite);

                        
                    // TODO: add here the collisions
                }
            }
        }
        this.full_loaded = true;
    }

    get_tile(id) {
        if (id === 0) return 0;
        for (var i = 0; i < this.tileset.length; ++i) {
            if (this.tileset[i].reference_id === id) return this.tileset[i];
        }
        return null;
    }
}


function get_basename(url) {
    var index = 0;
    for (var i = 0; i < url.length; ++i) {
        if (url[i] === "/") index = i;
    }
    return url.substring(0, index);
}

export class MapTile {
    constructor(img_src, reference_id, width, height) {

        // Load the image
        this.loaded = false;
        let self = this;
        this.image = new Image();
        console.log("Loading image at:", img_src);
        this.image.src = img_src;
        this.image.addEventListener("load", function() {
            self.loaded = true;
        }, false);
        this.reference_id = reference_id
    }

    generate_sprite(x, y, kind) {
        let sprite = new Sprite(x, y, kind);
        sprite.image = this.image;
        return sprite;
    }
}