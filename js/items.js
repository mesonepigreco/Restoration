import { Sprite } from './sprite.js';
import { Rect } from './rect.js';
import { particle_burst } from './particles.js';
import { SwordDamage } from './damage_sprite.js';

class Item{
	constructor() {
		this.name = "item";

		// Art for the item
		this.portrait = new Image();
		this.portrait.src = "assets/weapons/Sword_icon.png";

		// Attack art
		this.image_front = null;
		this.image_back = null;
		this.image_left = null;
		this.image_right = null;

		this.spawn_images = [];

		this.damage = 0;
		this.front_range = 10; // Front damage range
		this.area_range = 5; // Surrounding damage
		this.spin_range = 5; // Spin damage range
		this.spin_clockwise = true; // Spin direction
		this.cooldown = 0.5;
		this.trigger = 0;
	}


	load_spawn_image(image_path, waiter_function) {
		const img = new Image();
		img.src = image_path;
		this.spawn_images.push(img);
		img.addEventListener("load", function() {
			waiter_function();
		});
	}

	attack_animation(owner) {
		console.log("animation");
	}

	


	attack_damage(owner, targets) {
		// Look for a target to attack
		// Loop over all possible targets
		// console.log("Targets: ", targets);
		// console.log("Owner: ", owner);
		// console.log("Owner rect: ", owner.rect);
		let now = Date.now() / 1000;
		if (now > this.trigger + this.cooldown) {
			console.log("attack: trigger ", this.trigger, now, this.cooldown);
			this.trigger = now;
			this.attack_animation(owner);
			/*
			for (var i = 0; i < targets.length; ++i) {
				let target = targets.sprites[i];
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
					// Specify the collision type
					if (rect.colliderect(target.rect)) {
						console.log("Front collision");
					}
					else {
						console.log("Area collision");
					}
					target.push_back({x: -owner.rect.x + target.rect.x, y: -owner.rect.y + target.rect.y}, this.damage * owner.strenght / target.strenght * 4);

					// Control the damage
					let damage = this.damage * owner.strenght - target.armor;
					if (damage < 1) damage = 1;

					// Apply the damage
					target.current_hp -= damage;
					// target.kill();
					console.log("Damage: ", damage, "remaining life: ", target.current_hp);
					console.log("Target:", target);
				}
			}
			*/
		}
	}
}

class Sword extends Item {
	constructor() {
		super();
		this.name = "sword";
		this.damage = 20;
		this.front_range = 10;
		this.area_range = 5;
		this.cooldown = .5;

		// Create the sword image
		this.loaded = false;
		let nload = 0;

		
		this.load_spawn_image("assets/weapons/sword_front.png", () => {
			nload++;
			if (nload >= 4) this.loaded = true;

			this.my_width = this.spawn_images[0].width;
			this.my_height = this.spawn_images[0].height;
		});
		this.load_spawn_image("assets/weapons/sword_back.png", () => {
			nload++;
			if (nload >= 4) this.loaded = true;
			
			this.my_width = this.spawn_images[0].width;
			this.my_height = this.spawn_images[0].height;
		});
		this.load_spawn_image("assets/weapons/sword_left.png", () => {
			nload++;
			if (nload >= 4) this.loaded = true;
			
			this.my_width = this.spawn_images[0].width;
			this.my_height = this.spawn_images[0].height;
		});
		this.load_spawn_image("assets/weapons/sword_right.png", () => {
			nload++;
			if (nload >= 4) this.loaded = true;
			
			this.my_width = this.spawn_images[0].width;
			this.my_height = this.spawn_images[0].height;
		});
	}

	// Blit the sword image
	attack_animation(owner) {
		super.attack_animation(owner);

		// Get the attack position
		// let attack_pos = this.get_attack_position(owner);
		// let x = attack_pos.x;
		// let y = attack_pos.y;

		// Get the position of the sword based on the owner orientation
		let world = owner.world;

		let damage = owner.strength * this.damage;

		// Create the sword image
		let sword = new SwordDamage(0, 0, [], world.enemy_group);
		world.visible_group.add(sword);	
		sword.set_image(owner, this.spawn_images);
		sword.set_attack_position(owner);
		sword.bind_sprite(owner);
		//sword.image = this.spawn_images[attack_pos.orientation];
		sword.damage = damage;
	}
}
class Punch extends Item {
	constructor() {
		super();
		this.name = "punch";
		this.damage = 5;
		this.front_range = 5;
		this.area_range = 2;
		this.cooldown = 0.3;
	}
}



export { Sword, Punch };
