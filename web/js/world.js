var world = {};

function worldSetup() {
	// Simulation for each individual world will go here.

	world.space = {
		local: new GLOW.Node(), // Node for local world space
		ui: new GLOW.Node() // Node for UI space
	};

	world.update = function(dt) {
		for (var s in world.space) {
			world.space[s].update(dt);
		}
	};
}