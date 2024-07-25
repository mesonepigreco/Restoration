import { Sprite } from './sprite.js';
import { Rect } from './rect.js';

export class Item{
	constructor() {
		this.name = "item";

		// Art for the item
		this.portrait = null;
		this.image_front = null;
		this.image_back = null;
		this.image_left = null;
		this.image_right = null;

		this.damage = 0;
		this.front_range = 10; // Front damage range
		this.area_range = 5; // Surrounding damage
		this.spin_range = 5; // Spin damage range
		this.spin_clockwise = true; // Spin direction
		this.cooldown = 0;

	}

	attack_animation(owner) {
	}

	attack_damage(owner, targets) {
		// Look for a target to attack
		// Loop over all possible targets
		for (var i = 0; i < targets.length; ++i) {
			let target = targets[i];
			let rect = null;

			// Generate the damage rect
			if (owner.direction === "up") {
				rect = new Rect(owner.rect.x, owner.rect.y - this.front_range, owner.rect.x + owner.rect.width, owner.rect.y);
			} else if (owner.direction === "down") {
				rect = new Rect(owner.rect.x, owner.rect.y + owner.rect.height, owner.rect.x + owner.rect.width, owner.rect.y + owner.rect.height + this.front_range);
			}
			else if (owner.direction === "left") {
				rect = new Rect(owner.rect.x - this.front_range, owner.rect.y, owner.rect.x, owner.rect.y + owner.rect.height);
			}
			else if (owner.direction === "right") {
				rect = new Rect(owner.rect.x + owner.rect.width, owner.rect.y, owner.rect.x + owner.rect.width + this.front_range, owner.rect.y + owner.rect.height);
			}

			// Add the area damage
			let area_rect = new Rect(owner.rect.center.x - this.area_range / 2, owner.rect.center.y - this.area_range / 2, owner.rect.center.x + this.area_range / 2, owner.rect.center.y + this.area_range / 2);

			// TODO: Add the spin rect

			if (rect.colliderect(target.rect) || area_rect.colliderect(target.rect)) {
					target.take_damage(this.damage);
					target.push_back({x: -this.x + target.x, y: -this.y + target.y}, this.strenght / target.strenght * 100);
					particle_burst(target.center, 30, this.blood_particle_model, 10, this.visible_group);

					// Control the damage
					let damage = this.damage * owner.strenght - target.armor;
					if (damage < 1) damage = 1;
				}
			}
		}
	}

}
