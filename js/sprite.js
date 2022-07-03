
export class Sprite {
    constructor(x, y, kind, groups = []) {
        this.x = x;
        this.y = y;
        this.kind = kind;
        this.current_frame = 0;
        this.scale_factor = 1;
        this.flipX = false;
        this.flipY = false;
        this.groups = groups;

        // Add the sprite to the groups
        for (var i = 0; i < groups.length; ++i) {
            let group = groups[i];
            group.add(this);
        }

        this.gravity = 0;
        this.animations = {};
        this.image = null;
        this.rect = null;
        this.current_animation = null;
        this.loaded_animations = {
        };
        this.loaded = false;
        this.frame_rate = 10;

        this.velocity = {
            x: 0,
            y: 0
        };

    }

    get center() {
        return {
            x : this.x + this.image.width / 2,
            y : this.y + this.image.height / 2
        }
    }

    set_all_animations(list_of_animations) {
        // Specify the name of all the animations of the sprite
        for (var i = 0; i < list_of_animations.length; ++i) {
            this.loaded_animations[list_of_animations[i]] = false;
            this.animations[list_of_animations[i]] = [];
        }
    }


    load_frame(waiter_function, src_img, animation) {
        const img = new Image();
        img.src = src_img;
        this.animations[animation].push(img);
        img.addEventListener("load", function() {
            waiter_function();
        }, false);
    }

    load_static_image(src_img, waiter_function) {
        const img = new Image();
        img.src = src_img;
        this.image = img;
        img.addEventListener("load", function() {
            waiter_function();
        }, false);
    }

    load_animation(animation_name, directory, frame_start, frame_end, zero_pad_lenght, extension = ".png") {
        var self = this;
        var n_frames = frame_end - frame_start;
        var loaded = 0;
        function loader_function() {
            loaded ++;
            console.log("anim load: " + loaded);
            if (loaded == n_frames) {
                self.loaded_animations[animation_name] = true;
                self.current_animation = animation_name;
                var length = 0;
                for (const key in self.loaded_animations) {
                    if (self.loaded_animations[key]) length++;
                }
    
                if (length === Object.keys(self.loaded_animations).length) {
                    self.loaded = true;
                }
            }
            self.image = self.animations[animation_name][0];
        };

        // Load all the frames
        for (var frame_id = frame_start; frame_id < frame_end; ++frame_id) {
            var frame_name = directory + "/" + animation_name + frame_id.toString().padStart(zero_pad_lenght, "0") + extension;
            this.load_frame(loader_function, frame_name, animation_name);
        }
    }

    update_animation(dt) {
        // Update the frame
        this.current_frame += dt * this.frame_rate;
        let anim = this.animations[this.current_animation]
        

        // Update the image
        var cf = Math.floor(this.current_frame)
        if (cf >= anim.length) {
            cf = 0;
            this.current_frame = 0;
        }
        this.image = anim[cf];

        //console.log("Animation:", this.current_animation, "IMG:", this.image);

        
    }

    update(dt) {
        // Update the animation (if any)
        if (this.current_animation !== null)
            this.update_animation(dt);

        // Update the gravity
        //this.velocity.y += this.gravity * dt;
    }

    collidewith(sprite) {
        // Return true if there is a collision between this and the other sprite
        if ((this.x + this.image.width > sprite.x &&
             this.x < sprite.x + sprite.image.width) && 
            (this.y + this.image.height > sprite.y &&
             this.y < sprite.y + sprite.image.height))  
            return true;
        return false;
    }

    draw(context, camera) {
        //console.log("Drawing at: " + this.x + " " + this.y + " img: " + this.image + " kind:" + this.kind);
        // TODO: if the image needs to be flipped
        context.save();
        var scalex = 1;
        var scaley = 1;
        if (this.flipX) scalex = -1;
        if (this.flipY) scaley = -1;
        
        context.scale(scalex, scaley);
        context.drawImage(this.image, Math.floor(this.x - camera.x), Math.floor(this.y - camera.y));
        context.restore();
    }

    kill() {
        // Remove from the groups
        for (var i = 0; i < this.groups.length; ++i) {
            let group = this.groups[i];
            group.remove(this);
        }
    }
}
