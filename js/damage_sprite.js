import { Sprite } from "./sprite.js";
import { Rect } from "./rect.js";


class DamageSprite  extends Sprite{
	constructor(x, y, kind, groups, damage_group) {
		super(x, y, kind, groups);

		// Store the group of sprites that take damage
		this.damage = 10;
		this.damage_group = damage_group;
		this.trigger = 0;
		this.alive_timer = 1000;
	}

	check_alive() {
		let now = Date.now();
		if (now > this.trigger + this.alive_timer) {
			this.kill();
		}
	}

	update_collision() {
		for (var i = 0; i < this.damage_group.length; ++i) {
			let target = this.damage_group.sprites[i];
			if (this.collidewith(target)) {
				target.push_back({x: this.x - target.x, y: this.y - target.y}, this.damage / target.strength * 4);
				target.current_hp -= this.damage;
				this.kill();
			}
		}
	}

	update(dt) {
		super.update(dt);

		// Check if it does damage to someone
		this.update_collision();

		// Check if the sprite is still alive
		this.check_alive();
	}
}

class SwordDamage extends DamageSprite {
	constructor(x, y, groups, damage_group) {
		super(x, y, "sword_damage", groups, damage_group);
		this.damage = 20;
		this.alive_timer = 100;
	}
}


export { DamageSprite, SwordDamage};
