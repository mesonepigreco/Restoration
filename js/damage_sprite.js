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
		this.parent_sprite = null;
		this.delta_x = 0;	
		this.delta_y = 0;
	}

	set_image(owner, spawn_images) {
		// Set the image of the sprite
		if (owner.direction === "up") {
			this.image = spawn_images[0];
		}
		else if (owner.direction === "down") {
			this.image = spawn_images[1];
		}
		else if (owner.direction === "left") {
			this.image = spawn_images[2];
		}
		else if (owner.direction === "right") {
			this.image = spawn_images[3];
		}
	}

	set_attack_position(owner) {
		let x = 0;
		let y = 0;
		if (owner.direction === "up") {
			x = owner.center.x - this.my_width / 2; 
			y = owner.y - this.my_height;
		}
		else if (owner.direction === "down") {
			x = owner.bottomcenter.x - this.my_width / 2;
			y = owner.bottomcenter.y;
		}
		else if (owner.direction === "left") {
			x = owner.x - this.my_width;
			y = owner.center.y;
		}
		else if (owner.direction === "right") {
			x = owner.rightcenter.x;
			y = owner.rightcenter.y;
		}

		this.x = x;
		this.y = y;

		if (this.parent_sprite) {
			this.delta_x = this.parent_sprite.x - this.x;
			this.delta_y = this.parent_sprite.y - this.y;
		}

		return {x: x, y: y};
	}

	bind_sprite(sprite) {
		this.parent_sprite = sprite;
		this.delta_x = this.parent_sprite.x - this.x;
		this.delta_y = this.parent_sprite.y - this.y;
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
			if (this.collidewith(target) && !target.invulnerable) {
				target.push_back({x: -this.center.x + target.center.x, y: -this.center.y + target.center.y}, this.damage / target.strength * 4);
				target.current_hp -= this.damage / target.strength;
				target.attack_trigger = Date.now(); // Stop the attack of the enemy
				target.set_invulnerability();
				console.log("Damage: ", this.damage/ target.strength, "remaining life: ", target.current_hp);
				// this.kill();
			}
		}
	}

	update(dt) {
		super.update(dt);

		// Update the position with the parent sprite
		if (this.parent_sprite) {
			this.x = this.parent_sprite.x - this.delta_x;
			this.y = this.parent_sprite.y - this.delta_y;
		}

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
