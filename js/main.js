import { World } from "./world.js";

// Create the canvas
const canvas = document.getElementById("main-window");
const context = canvas.getContext("2d");

const world = new World(canvas, context);

// Load a trial level
world.create_from_tilemap("tiled-level/new_level.json");

function auto_rescale_window(fixed = false) {
    /*
     * If fixed is true, the style of the canvas is set to match
     * exactly with the resolution.
     */

    // Get the current aspect ratio
    let aspect_ratio = canvas.width / canvas.height;
    let good_height = window.innerWidth / aspect_ratio;

    // Set the window that keeps the same aspect ratio fitting the browser
    var width = 0;
    var height = 0;
    if (good_height <= window.innerHeight) {
        width =  window.innerWidth;
        height = good_height;
    } else {
        width =  window.innerHeight * aspect_ratio;
        height =  window.innerHeight;
    }

    if (fixed) {
        width = canvas.width;
        height = canvas.height;
    }

    canvas.style.width = "" + width + "px";
    canvas.style.height = "" + height + "px";

    // Set the position to always be at the center of the screen
    canvas.style.left = ""  + Math.floor(window.innerWidth/2 -  width / 2) + "px";
    canvas.style.top = ""  + Math.floor(window.innerHeight/2 - height / 2) + "px";
}


let lastTime = 0;
const maxFPS = 120;
const minFrameTime = 1000 / maxFPS;
const speedUp = 2;

function animate(currentTime) {
    // Stabilize to avoid jumps
	const deltaTime = currentTime - lastTime;
    let dt = deltaTime / 1000;
	dt *= speedUp;
    if (dt > 0.05) dt = 0.05;

    
    if (world.is_loaded() && deltaTime > minFrameTime) {
		auto_rescale_window();
		context.clearRect(0,0, canvas.width, canvas.height);

        world.update(dt);
        world.draw();
		lastTime = currentTime;
		// console.log("FPS: " + 1000 / deltaTime);
    }

    /*
    context.fillStyle = "#000";
    context.fillRect(0,0, canvas.width, canvas.height);
    context.fillStyle = "#fff";
    context.fillRect(100,100, canvas.width/2, canvas.height/2);*/

    requestAnimationFrame(animate);
}

animate();
