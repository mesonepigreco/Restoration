import { Rect } from "./rect.js";

export class UI {
    constructor(player, canvas) {
		this.player = player;
		this.canvas = canvas;

		this.rel_life_pos = {
			x: .2,
			y: .8
		};
		this.height_ratio = .1;
		
    }

    get_back_rect() {
		let back_rect = new Rect(this.canvas.width* (.5 - 2 * this.rel_life_pos.x),
					this.canvas.height * this.height_ratio);
		back_rect.x = this.canvas.x * this.rel_life_pos.x;
		back_rect.y = this.canvas.y * this.rel_life_pos.y;
		return back_rect.inflate_absolute(20, 20); 
    }

    get_life_rect() {
		let width = this.canvas.width* (.5 - 2 * this.rel_life_pos.x) * this.player.current_hp / this.player.hp;
			
		let life_rect = new Rect(width,
					this.canvas.height * this.height_ratio);
		life_rect.x = this.canvas.x * this.rel_life_pos.x;
		life_rect.y = this.canvas.y * this.rel_life_pos.y;
		return life_rect;
    }

	draw_life(context) {
		context.save();
		context.fillStyle = "#000";
		let black_rect = this.get_back_rect();
		context.fillRect(black_rect.x, black_rect.y, black_rect.width, black_rect.height);

		context.fillStyle = "#f00";
		let red_rect = this.get_life_rect();
		context.fillRect(red_rect.x, red_rect.y, red_rect.width, red_rect.height);

		context.restore();
	}

	draw(context) {
		this.draw_life(context);
	}
}
