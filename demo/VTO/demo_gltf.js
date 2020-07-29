//SETTINGS of this demo :
var SETTINGS={
    gltfModelURL: 'face/face.glb',
    cubeMapURL: 'Bridge2/',
    rotationOffsetX: 0, //negative -> look upper. in radians
    cameraFOV: 40,      //in degrees, 3D camera FOV
    pivotOffsetYZ: [0.2, -1.8], //XYZ of the distance between the center of the cube and the pivot
    detectionThreshold: 0.75, //sensibility, between 0 and 1. Less -> more sensitive
    detectionHysteresis: 0.05,
    offsetYZ: [0.2,-2.1], //offset of the model in 3D along vertical and depth axis
    scale: 2.0 //width in 3D of the GLTF model
};

//some globalz :
var THREEVIDEOTEXTURE, THREERENDERER, THREEFACEOBJ3D, THREEFACEOBJ3DPIVOTED, THREESCENE, THREECAMERA, CANVASELEMENT;
var ISDETECTED=false;

//callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback(isDetected){
    if (isDetected){
        //THREEFACEOBJ3D.visible=true;
        console.log('INFO in detect_callback() : DETECTED');
    } else {
        //THREEFACEOBJ3D.visible=false;
        console.log('INFO in detect_callback() : LOST');
    }
}

var x, y, z;
var green1;
var green2;
var x2, y2, z2;
var count = 2;

function change(){

        if(count == 5)
        {
            count = 1;
        }

        for (var i = green1.children.length - 1; i >= 0; i--) {
            green1.remove(green1.children[i]);
        }

        for (var i = green2.children.length - 1; i >= 0; i--) {
            green2.remove(green2.children[i]);
        }

        var loader = new THREE.TextureLoader().load('image/'+ count+'.png');

        // Load an image file into a custom material
        var material = new THREE.MeshBasicMaterial({
          map: loader,
          color: '#FFF',
          shader: 'flat',
          side: 'double',
          transparent: true,
          alphaTest: 0.5
        });

        // create a plane geometry for the image with a width of 10
        // and a height that preserves the image's aspect ratio
        var geometry = new THREE.PlaneGeometry(1, 2);

        // combine our image geometry and material into a mesh
        var mesh = new THREE.Mesh(geometry, material);
        mesh.name="right"

        // set the position of the image mesh in the x,y,z dimensions
        mesh.position.set(x - 0.11,y + 0.5,z-0.9);

        mesh.rotation.set(1.4443595413034305,0,0);

        mesh.scale.multiplyScalar(1);

         //dispatch the model
        green1.add( mesh ); 

            
        var loader = new THREE.TextureLoader().load('image/'+ count+'.png');

        // Load an image file into a custom material
        var material = new THREE.MeshBasicMaterial({
          map: loader,
          color: '#FFF',
          shader: 'flat',
          side: 'double',
          transparent: true,
          alphaTest: 0.5
        });

        // create a plane geometry for the image with a width of 10
        // and a height that preserves the image's aspect ratio
        var geometry = new THREE.PlaneGeometry(1, 2);

        // combine our image geometry and material into a mesh
        var mesh = new THREE.Mesh(geometry, material);
        mesh.name="left"

        // set the position of the image mesh in the x,y,z dimensions
        mesh.position.set(x + 0.11,y + 0.5,z-0.9);

        mesh.rotation.set(1.444359541303435,0,0);

        mesh.scale.multiplyScalar(1);

         //dispatch the model
        green2.add( mesh );

        count++;
}

//build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec){


    CANVASELEMENT=spec.canvasElement;

    //INIT THE THREE.JS context
    THREERENDERER=new THREE.WebGLRenderer({
        context: spec.GL,
        canvas: CANVASELEMENT
    });

    //COMPOSITE OBJECT WHICH WILL FOLLOW THE HEAD
    //in fact we create 2 objects to be able to shift the pivot point
    THREEFACEOBJ3D=new THREE.Object3D();
    THREEFACEOBJ3D.frustumCulled=true;
    THREEFACEOBJ3DPIVOTED=new THREE.Object3D();
    THREEFACEOBJ3DPIVOTED.frustumCulled=true;
    THREEFACEOBJ3DPIVOTED.position.set(0, -SETTINGS.pivotOffsetYZ[0], -SETTINGS.pivotOffsetYZ[1]);
    THREEFACEOBJ3D.add(THREEFACEOBJ3DPIVOTED);
	
	 const mat=new THREE.ShaderMaterial({
                    vertexShader: THREE.ShaderLib.basic.vertexShader,
                    fragmentShader: "precision lowp float;\n void main(void){\n gl_FragColor=vec4(1.,0.,0.,1.);\n }",
                    uniforms: THREE.ShaderLib.basic.uniforms,
                    colorWrite: false
                });

    //IMPORT THE GLTF MODEL
    //from https://threejs.org/examples/#webgl_loader_gltf
    var gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load( SETTINGS.gltfModelURL, function ( gltf ) {

        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh && child.name == "mesh_1") {
                //occluderGeometry.computeVertexNormals(); mat=new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
                child.renderOrder=-1; //render first
                child.material=mat;
				child.material.transparent = true;
				child.material.opacity = 0.4;
            }
			if ( child.isMesh && child.name == "mesh_0") {
					var l = new THREE.Vector3();
					l = child.getWorldPosition();
					
					var c = new THREE.Vector3();
					c = child.localToWorld(l);
					
					x = c.x;
					y = c.y;
					z = c.z;
				   
					green1 = child;
					child.material=mat;
					
            }
			
			if ( child.isMesh && child.name == "mesh_2") {
					var l = new THREE.Vector3();
					l = child.getWorldPosition();
					
					var c = new THREE.Vector3();
					c = child.localToWorld(l);
					
					x2 = c.x;
					y2 = c.y;
					z2 = c.z;
				   
					green2 = child;
					child.material=mat;
					
            }
			if ( child.isMesh && child.name == "mesh_3") {
					child.material=mat;
					
            }
        } );
        gltf.scene.frustumCulled=false;
        
        //center and scale the object
        var bbox=new THREE.Box3().expandByObject(gltf.scene);

        //center the model :
        var centerBBox=bbox.getCenter(new THREE.Vector3());

        gltf.scene.position.add(new THREE.Vector3(0,SETTINGS.offsetYZ[0], SETTINGS.offsetYZ[1]));

        //scale the model according to its width
        var sizeX=bbox.getSize(new THREE.Vector3()).x;
        gltf.scene.scale.multiplyScalar((SETTINGS.scale/sizeX) * 1.05);

        //dispatch the model
        THREEFACEOBJ3DPIVOTED.add( gltf.scene );


        var loader = new THREE.TextureLoader().load('image/1.png');

        // Load an image file into a custom material
        var material = new THREE.MeshBasicMaterial({
          map: loader,
          color: '#FFF',
          shader: 'flat',
          side: 'double',
          transparent: true,
          alphaTest: 0.5
        });

        // create a plane geometry for the image with a width of 10
        // and a height that preserves the image's aspect ratio
        var geometry = new THREE.PlaneGeometry(1, 2);

        // combine our image geometry and material into a mesh
        var mesh = new THREE.Mesh(geometry, material);

        // set the position of the image mesh in the x,y,z dimensions
        mesh.position.set(x - 0.11,y + 0.5,z-0.9);

        mesh.rotation.set(1.4443595413034305,0,0);

        mesh.scale.multiplyScalar(1);

         //dispatch the model
        green1.add( mesh ); 

            
        var loader = new THREE.TextureLoader().load('image/1.png');

        // Load an image file into a custom material
        var material = new THREE.MeshBasicMaterial({
          map: loader,
          color: '#FFF',
          shader: 'flat',
          side: 'double',
          transparent: true,
          alphaTest: 0.5
        });

        // create a plane geometry for the image with a width of 10
        // and a height that preserves the image's aspect ratio
        var geometry = new THREE.PlaneGeometry(1, 2);

        // combine our image geometry and material into a mesh
        var mesh = new THREE.Mesh(geometry, material);

        // set the position of the image mesh in the x,y,z dimensions
        mesh.position.set(x + 0.10,y + 0.5,z-0.9);

        mesh.rotation.set(1.444359541303435,0,0);

        mesh.scale.multiplyScalar(1);

         //dispatch the model
        green2.add( mesh );

    }); //end gltfLoader.load callback

    //CREATE THE SCENE
    THREESCENE=new THREE.Scene();
    THREESCENE.add(THREEFACEOBJ3D);


    //init video texture with red
    THREEVIDEOTEXTURE=new THREE.DataTexture( new Uint8Array([255,0,0]), 1, 1, THREE.RGBFormat);
    THREEVIDEOTEXTURE.needsUpdate=true;

    //CREATE THE VIDEO BACKGROUND
    var videoMaterial=new THREE.RawShaderMaterial({
        depthWrite: false,
        depthTest: false,
        vertexShader: "attribute vec2 position;\n\
            varying vec2 vUV;\n\
            void main(void){\n\
                gl_Position=vec4(position, 0., 1.);\n\
                vUV=0.5+vec2(-0.5,0.5)*position; //inverse X axis for mirror\n\
            }",
        fragmentShader: "precision lowp float;\n\
            uniform sampler2D samplerVideo;\n\
            varying vec2 vUV;\n\
            void main(void){\n\
                gl_FragColor=texture2D(samplerVideo, vUV);\n\
            }",
         uniforms:{
            samplerVideo: {value: THREEVIDEOTEXTURE}
         }
    });
    var videoGeometry=new THREE.BufferGeometry()
    var videoScreenCorners=new Float32Array([-1,-1,   1,-1,   1,1,   -1,1]);
    videoGeometry.addAttribute( 'position', new THREE.BufferAttribute( videoScreenCorners, 2 ) );
    videoGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0,1,2, 0,2,3]), 1));
    var videoMesh=new THREE.Mesh(videoGeometry, videoMaterial);
    videoMesh.onAfterRender=function(){
        //replace THREEVIDEOTEXTURE.__webglTexture by the real video texture
        THREERENDERER.properties.update(THREEVIDEOTEXTURE, '__webglTexture', spec.videoTexture);
        THREEVIDEOTEXTURE.magFilter=THREE.LinearFilter;
        THREEVIDEOTEXTURE.minFilter=THREE.LinearFilter;
        delete(videoMesh.onAfterRender);
    };
    videoMesh.renderOrder=-1000; //render first
    videoMesh.frustumCulled=false;
    THREESCENE.add(videoMesh);
    
    //CREATE THE CAMERA
    THREECAMERA=new THREE.PerspectiveCamera(SETTINGS.cameraFOV, 1, 0.1, 100);
    set_fullScreen();
} //end init_threeScene()

//update the resolution of the canvas
//can be used for your other fullscreen demos
function set_fullScreen(){
    var timerResize=false;
    function on_canvasResizeCSS(){
        var canvasRect=CANVASELEMENT.getBoundingClientRect();
        CANVASELEMENT.width=Math.round(canvasRect.width);
        CANVASELEMENT.height=Math.round(canvasRect.height);
        var aspecRatio=CANVASELEMENT.width / CANVASELEMENT.height;
        THREECAMERA.aspect=aspecRatio;
        THREECAMERA.updateProjectionMatrix();
        JEEFACEFILTERAPI.resize();

    
        THREERENDERER.setSize(CANVASELEMENT.width, CANVASELEMENT.height, false);
        THREERENDERER.setViewport(0,0, CANVASELEMENT.width, CANVASELEMENT.height);
    }
    function on_canvasResizeCSSTimeout(){ //to avoid to resize the canvas too often
        if (timerResize){
            clearTimeout(timerResize);
        }
        timerResize = setTimeout(function(){
            on_canvasResizeCSS();
            timerResize=false;
        }, 100);
    }
    on_canvasResizeCSS();
    window.addEventListener('resize', on_canvasResizeCSSTimeout, false);

} //end set_fullScreen()

var D = 0; 
//launched by body.onload() :
function main(){
	var face = document.getElementById('facecut');
    JEEFACEFILTERAPI.init({ 
        videoSettings:{ //increase the default video resolution since we are in full screen
            'idealWidth': 1280,  //ideal video width in pixels
            'idealHeight': 800, //ideal video height in pixels
            'maxWidth': 1920,   //max video width in pixels
            'maxHeight': 1920   //max video height in pixels
        },
		followZRot: true,
        canvasId: 'jeeFaceFilterCanvas',
        NNCpath: 'dist/', //root of NNC.json file
        callbackReady: function(errCode, spec){
            if (errCode){
                console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
                return;
            }

            console.log('INFO : JEEFACEFILTERAPI IS READY');
            init_threeScene(spec);
        }, //end callbackReady()

        //called at each render iteration (drawing loop)
        callbackTrack: function(detectState){
            if (ISDETECTED && detectState.detected<SETTINGS.detectionThreshold-SETTINGS.detectionHysteresis){
                //DETECTION LOST
                detect_callback(false);
                ISDETECTED=false;
            } else if (!ISDETECTED && detectState.detected>SETTINGS.detectionThreshold+SETTINGS.detectionHysteresis){
                //FACE DETECTED
                detect_callback(true);
                ISDETECTED=true;
            }

            if (ISDETECTED){
                //move the cube in order to fit the head
                var tanFOV=Math.tan(THREECAMERA.aspect*THREECAMERA.fov*Math.PI/360);
				//tan(FOV/2), in radians
                var W=detectState.s;  //relative width of the detection window (1-> whole width of the detection window)
                D=1/(2*W*tanFOV); //distance between the front face of the cube and the camera
				
				
				//console.log(D);
                
                //coords in 2D of the center of the detection window in the viewport :
                var xv=-detectState.x;
                var yv=detectState.y;
                
                //coords in 3D of the center of the cube (in the view coordinates system)
                var z=-D-0.5;   // minus because view coordinate system Z goes backward. -0.5 because z is the coord of the center of the cube (not the front face)
                var x=xv*D*tanFOV;
                var y=yv*D*tanFOV/THREECAMERA.aspect;
				

		
                //move and rotate the cube
                THREEFACEOBJ3D.position.set(x ,y+SETTINGS.pivotOffsetYZ[0],z+SETTINGS.pivotOffsetYZ[1]);
				
                THREEFACEOBJ3D.rotation.set(detectState.rx+SETTINGS.rotationOffsetX, -detectState.ry, -detectState.rz, "XYZ");
				//console.log(detectState.rx+"--"+" -"+detectState.ry+"--"+" -"+-detectState.rz); 
				
				if(D <= 3.5)
				{
					face.classList.remove("hidden");
					THREEFACEOBJ3D.visible = false;
				}else if (D >= 3.6 && D <= 5.5 ){
					face.classList.add("hidden");
					THREEFACEOBJ3D.visible = true;

				}else if (D >= 5.6){
					face.classList.remove("hidden");
					THREEFACEOBJ3D.visible = false;
				}
	
            }

            //reinitialize the state of THREE.JS because JEEFACEFILTER have changed stuffs
            THREERENDERER.state.reset();
			
            //trigger the render of the THREE.JS SCENE
            THREERENDERER.render(THREESCENE, THREECAMERA);
	
        } //end callbackTrack()
    }); //end JEEFACEFILTERAPI.init call
} //end main()

