import { Sprite } from "./sprite.js";
import { Rect } from "./rect.js";


class DamageSprite  extends Sprite{
	constructor(x, y, kind, groups, damage_group) {
		super(x, y, kind, groups);

		// Store the group of sprites that take damage
		this.damage = 10;
		this.damage_group = damage_group;
		this.trigger = Date.now();
		this.alive_timer = 1000;
		this.physical_body = true;
		this.loaded = true;
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
				target.push_back({x: -this.center.x + target.center.x, y: -this.center.y + target.center.y}, this.damage / target.strength * 4);
				target.current_hp -= this.damage / target.strength;
				target.attack_trigger = Date.now(); // Stop the attack of the enemy
				console.log("Damage: ", this.damage/ target.strength, "remaining life: ", target.current_hp);
				// this.kill();
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
		console.log("Creating sword inside SwordDamage");
		console.log("The groups are:", groups);
		super(x, y, "sword_damage", groups, damage_group);
		this.damage = 10;
		this.alive_timer = 300;
		console.log("Sword created");
	}

	update(dt) {
		this.update_collider();
		super.update(dt);
	}
}


export { DamageSprite, SwordDamage};
