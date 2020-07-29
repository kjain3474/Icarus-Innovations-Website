(function() {
    "use strict";
    var container;
    var camera, scene, renderer, composer, controls;
    var loader, mesh;
	var engine;
    var light1, light2, light3, light4;
    var mouseX = 0,
        mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
	
	//call the render function for particles
        var step = 0;

        var knot;		
		
    init();
	
	
      // setup the control gui for particles
        var controls = new function () {
            // we need the first child, since it's a multimaterial
            this.radius = 40;
            this.tube = 40;
            this.radialSegments = 70;
            this.tubularSegments = 10;
            this.p = 1;
            this.q = 4;
            this.heightScale = 5;
            this.asParticles = true;
            this.rotate = true;

            this.redraw = function () {
                // remove the old plane
                if (knot) scene.remove(knot);
                // create a new one
                var geom = new THREE.TorusKnotGeometry(controls.radius, controls.tube, Math.round(controls.radialSegments), Math.round(controls.tubularSegments), Math.round(controls.p), Math.round(controls.q));
				
				geom.scale(4,4,4);

                if (controls.asParticles) {
                    knot = createParticleSystem(geom);
                } else {
                    knot = createMesh(geom);
                }

                // add it to the scene.
                scene.add(knot);
            };

        }
		
	 controls.redraw();
	 
	 animate();
	 
	 // from THREE.js examples
    function generateSprite() {

            var canvas = document.createElement('canvas');
            canvas.width = 4;
            canvas.height = 4;

            var context = canvas.getContext('2d');
            var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
            gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
            gradient.addColorStop(1, 'rgba(0,0,0,1)');

            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);

            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;

        }
		
	function createParticleSystem(geom) {
            var material = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 1,
                transparent: true,
                blending: THREE.AdditiveBlending,
                map: generateSprite()
            });

            var system = new THREE.Points(geom, material);
            system.sortParticles = true;
            return system;
    }
	
	function createMesh(geom) {

            // assign two materials
            var meshMaterial = new THREE.MeshNormalMaterial({});
            meshMaterial.side = THREE.DoubleSide;

            // create a multimaterial
            var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

            return mesh;
    }

    function init() {
        var hero = document.getElementById("hero");
        var container = document.createElement("div");
        container.className = "hero__three-container";
        hero.appendChild(container);
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1500);
        camera.position.z = 400;
        scene = new THREE.Scene();
        var light = new THREE.AmbientLight(0x959595, .01);
        scene.add(light);
        light1 = new THREE.PointLight(0xffffff, .15, 0, Math.PI / 2, 1);
        light1.position.set(0, -80, 500);
        scene.add(light1);
        light2 = new THREE.PointLight(0xffffff, .35, 0, Math.PI / 2, 1);
        light2.position.set(0, 500, 0);
        scene.add(light2);
        light3 = new THREE.PointLight(0xffffff, .32, 0, Math.PI / 2, 1);
        light3.position.set(-500, 0, 10);
        scene.add(light3);
        light4 = new THREE.PointLight(0xffffff, .2, 0, Math.PI / 2, 1);
        light4.position.set(500, 0, 10);
        scene.add(light4);
        loader = new THREE.GLTFLoader();
        loader.load('3d/human/scene.gltf', function(gltf) {
			mesh = gltf.scene.children[ 0 ];
            mesh.position.y = 1;
            mesh.scale.set(0.4, 0.4, 0.4);
            scene.add(mesh);
        });
        renderer = new THREE.CanvasRenderer({
            alpha: true
        });

	
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        document.addEventListener("mousemove", onDocumentMouseMove, false);
        window.addEventListener("resize", onWindowResize, false);
		
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / 4;
        mouseY = (event.clientY - windowHalfY) / 4;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        camera.position.x += (-mouseX - camera.position.x) * .03;
        camera.position.y += (mouseY - 80 - camera.position.y) * .03;
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
		
		if (controls.rotate) {
           knot.rotation.y = step += 0.005;
        }

    }
})();