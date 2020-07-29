/* Model Matching Spec */
var modelSpec = 
{
	'jacketEntity':{

				'singleButton':'1bj.glb',
				'twoButton' : '2bj.glb',
				'threeButton' : '3bj.glb',
				'fourButtonDoubleBreasted' : '4bj.glb',
				'sixButtonDoubleBreasted' : '6bj.glb'

			},
	'lapelEntity' :{

		 		'notch':
		 		{
		 			'sb' : 'notchsb.glb',
		 			'db' : 'notchdb.glb'
		 		},
		 		'peak':
		 		{
		 			'sb' : 'peaksb.glb',
		 			'db' : 'peakdb.glb'
		 		},
		 		'shawl': {

		 			'sb' : 'shawlsb.glb',
		 			'db' : 'shawldb.glb'
		 		}
			},
	'pocketEntity' :{
				'straightPocketWithTicket' : {
		 			'sb' : 'str8pcktwtsb.glb',
		 			'db' : 'str8pcktwtdb.glb'
		 		},
				'standardPocket' : {
		 			'sb' : 'stdpocketsb.glb',
		 			'db' : 'stdpocketdb.glb'
		 		},
				'standardPocketWithTicket' :{
		 			'sb' : 'stdpocketwtsb.glb',
		 			'db' : 'stdpocketwtdb.glb'
		 		},
				'patchPocket' : {
		 			'sb' : 'patchpocketsb.glb',
		 			'db' : 'patchpocketdb.glb'
		 		}
			},
	'ventEntity' :{

			'singleVent' : 'svj.glb',
			'doubleVent' : 'dvj.glb',
			'noVent' : 'nvj.glb'
		}
}


/* option spec with model objects list*/
var optionSpec = {

	//where lapel and pocket has dependency on suitType sb = single breasted db = double breasted
	suitType : 'sb',
	jacketEntity : 'singleButton',
	lapelEntity : 'notch',
	pocketEntity : 'straightPocketWithTicket',
	ventEntity : 'singleVent'

};

/* option spec with fabric selected list*/
var fabricSpec = 
{

	'jacket' :{

		'src':'',
		'data':''

	}

}


var sceneEl;
//working magic for stability
document.addEventListener('DOMContentLoaded', function(evt) {
    sceneEl = document.querySelector('a-scene');

    sceneEl.addEventListener('loaded', function(evt) {


		console.log("loaded");

    });
});


//id = entity id , value = object type data, type = sb or db
function updateOptionSpec(id,value,type){

		//if type is given its for entities dependent on jacket type sb or db

		if(id != 'suitType' && type == ''){

			optionSpec[id] = value;

			changeModel(id,modelSpec[id][value])

			if(id == 'jacketEntity'){

				changeModel('lapelEntity', modelSpec['lapelEntity'][optionSpec.lapelEntity][optionSpec.suitType])
				changeModel('pocketEntity', modelSpec['pocketEntity'][optionSpec.pocketEntity][optionSpec.suitType])

			}

		}
		else if (id != 'suitType' && type != ''){

			optionSpec[id] = value;

			changeModel(id,modelSpec[id][value][type])

		}
		else{

			optionSpec[id] = value;
		}

}

//id = a-entity id , value = model path
function changeModel(id, value)
{

		var model = sceneEl.querySelector('#' + id);
		var url = 'models/' + value;
		model.removeAttribute('gltf-model');
		model.setAttribute('gltf-model', 'url('+url+')');

}

var selectedFabricList = {};

AFRAME.registerComponent('modify-materials', {
    init: function () {
      // Wait for model to load.
      this.el.addEventListener('model-loaded', () => {

        // Grab the mesh / scene.
        const obj = this.el.getObject3D('mesh');

        // Go over the submeshes and modify materials we want.
        obj.traverse(node => {
        	if(node.isMesh && node.name.includes('shirt')){

        		var texture = new THREE.TextureLoader().load('img/suit/white.jpg');
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
				texture.repeat.set(18, 18);
				texture.anisotropy = 16;
				

				node.material.map = texture;
				node.material.side = THREE.DoubleSide;
	        	node.material.needsUpdate = true;
	        	node.castShadow = true; //default is false
				node.receiveShadow = true;
     		 }

     		 if(node.isMesh && (node.name.includes('jacket') || node.name.includes('pant') || node.name.includes('lapel') || node.name.includes('pocket') || node.name.includes('vent'))){

        		var texture = new THREE.TextureLoader().load('img/suit/darkgrey.jpg');
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
				texture.repeat.set(20,20);
				texture.anisotropy = 16;

				node.material.map = texture;
				node.material.side = THREE.DoubleSide;
	        	node.material.needsUpdate = true;
	        	node.castShadow = true; //default is false
				node.receiveShadow = true;

				if(fabricSpec['jacket']['src'] != '')
				{

					var texture = new THREE.TextureLoader().load(fabricSpec['jacket']['src']);
					texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
					texture.repeat.set(20,20);
					texture.anisotropy = 16;

					node.material.map = texture;
					node.material.side = THREE.DoubleSide;
		        	node.material.needsUpdate = true;
		        	node.castShadow = true; //default is false
					node.receiveShadow = true;


				}

     		 }

     		 if(node.isMesh && node.name.includes('tie')){

        		var texture = new THREE.TextureLoader().load('img/suit/crimson.jpg');
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
				texture.repeat.set(10,10);
				texture.anisotropy = 16;

				node.material.map = texture;
				node.material.side = THREE.DoubleSide;
	        	node.material.needsUpdate = true;
	        	node.castShadow = true; //default is false
				node.receiveShadow = true;
     		 }
			 
			 if(node.isMesh && node.name.includes('shoes')){

        		var texture = new THREE.TextureLoader().load('img/suit/brown.jpg');
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
				texture.repeat.set(10,10);
				texture.anisotropy = 16;

				var material = new THREE.MeshPhongMaterial( { map: texture, shininess: 100 } );

				node.material = material;
				node.material.side = THREE.DoubleSide;
	        	node.material.needsUpdate = true;
	        	node.castShadow = true; //default is false
				node.receiveShadow = true;
     		 }


        });
   	});
  }
});

AFRAME.registerComponent('texturechange', {

	init: function () {
       sceneEl.addEventListener('changeTexture', function(event) {
       		
       			var img = new Image();
				img.onload = function() {
				
						var loader = document.getElementById('loader');

						loader.style.display = 'block';
						
						var sceneEl = document.querySelector('a-scene');

						var part = event.detail.part;

						var entity = event.detail.entity;

						var extraentity = event.detail.extraenitity;


						if( part == 'jacket')
						{

							var mesh = sceneEl.querySelector('#'+entity).getObject3D('mesh');

							var texture = new THREE.TextureLoader().load(img.src);
							texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
								
								if(this.width > this.height){
									
									texture.repeat.set(16, 20);
										
								}
								else if(this.width < this.height){
									
									texture.repeat.set(20, 16);
									
								}else{
									
									texture.repeat.set(20, 20);

								}	


						mesh.traverse(function (node) {
						  if (node.isMesh) {
					
								try{

									delete selectedFabricList[part];

								}catch(error)
								{

								}

								if(node.name.includes(part)){ 
								node.material.map = texture;
								node.material.side = THREE.DoubleSide;
								node.castShadow = true; //default is false
								node.receiveShadow = true;
								node.material.needsUpdate = true;

								}
							}
						});

						for (index = 0; index < extraentity.length; index++)
						{

		
						 var mesh = sceneEl.querySelector('#'+extraentity[index]).getObject3D('mesh');
						 	mesh.traverse(function (node) {
						  		if (node.isMesh) {

									if(node.name.includes('vent') || node.name.includes('lapel') ||  node.name.includes('pocket')  ||  node.name.includes('pant')){ 
									node.material.map = texture;
									node.material.side = THREE.DoubleSide;
									node.castShadow = true; //default is false
									node.receiveShadow = true;
									node.material.needsUpdate = true;

									}
								}
							});

						}

						fabricSpec[part]['src'] = event.detail.src;
						fabricSpec[part]['data'] = event.detail.data;

					} 

					else if( part == 'pant')
						{

							var mesh = sceneEl.querySelector('#'+entity).getObject3D('mesh');

							var texture = new THREE.TextureLoader().load(img.src);
							texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
								
								if(this.width > this.height){
									
									texture.repeat.set(16, 20);
										
								}
								else if(this.width < this.height){
									
									texture.repeat.set(20, 16);
									
								}else{
									
									texture.repeat.set(20, 20);

								}	


						mesh.traverse(function (node) {
						  if (node.isMesh) {
					
								try{

									delete selectedFabricList[part];

								}catch(error)
								{

								}

								if(node.name.includes(part)){ 
								node.material.map = texture;
								node.material.side = THREE.DoubleSide;
								node.castShadow = true; //default is false
								node.receiveShadow = true;
								node.material.needsUpdate = true;

								}
							}
						});

					}

					else if( part == 'shirt')
						{

							var mesh = sceneEl.querySelector('#'+entity).getObject3D('mesh');

							var texture = new THREE.TextureLoader().load(img.src);
							texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
							texture.repeat.set(18, 18);


						mesh.traverse(function (node) {
						  if (node.isMesh) {
					
								try{

									delete selectedFabricList[part];

								}catch(error)
								{

								}

								if(node.name.includes(part)){ 
								node.material.map = texture;
								node.material.side = THREE.DoubleSide;
								node.castShadow = true; //default is false
								node.receiveShadow = true;
								node.material.needsUpdate = true;

								}
							}
						});
						
					}


					else if( part == 'tie')
						{

							var mesh = sceneEl.querySelector('#'+entity).getObject3D('mesh');

							var texture = new THREE.TextureLoader().load(img.src);
							texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
							texture.repeat.set(10, 10);


							mesh.traverse(function (node) {
						 	 if (node.isMesh) {
					
								try{

									delete selectedFabricList[part];

								}catch(error)
								{

								}

								if(node.name.includes(part)){ 
								node.material.map = texture;
								node.material.side = THREE.DoubleSide;
								node.castShadow = true; //default is false
								node.receiveShadow = true;
								node.material.needsUpdate = true;

								}
							}
						});
						
					}

					else if( part == 'shoes')
						{

							var mesh = sceneEl.querySelector('#'+entity).getObject3D('mesh');

							var texture = new THREE.TextureLoader().load(img.src);
							texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
							texture.repeat.set(10, 10);


							mesh.traverse(function (node) {
						 	 if (node.isMesh) {
					
								try{

									delete selectedFabricList[part];

								}catch(error)
								{

								}

								if(node.name.includes(part)){ 
								node.material.map = texture;
								node.material.side = THREE.DoubleSide;
								node.castShadow = true; //default is false
								node.receiveShadow = true;
								node.material.needsUpdate = true;

								}
							}
						});
						
					}


					// else{

					// 	var mesh = sceneEl.querySelector('#'+event.detail.part).getObject3D('mesh');

					// 		var texture = new THREE.TextureLoader().load(img.src);
					// 		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
								
					// 			if(this.width > this.height){
									
					// 				texture.repeat.set(16, 20);
										
					// 			}
					// 			else if(this.width < this.height){
									
					// 				texture.repeat.set(20, 16);
									
					// 			}else{
									
					// 				texture.repeat.set(20, 20);

					// 			}	


					// 	mesh.traverse(function (node) {
					// 	  if (node.isMesh) {
			

					// 			if(node.name.includes('lapel') || node.name.includes('pocket') || node.name.includes('vent')){ 
					// 			node.material.map = texture;
					// 			node.material.side = THREE.DoubleSide;
					// 			node.castShadow = true; //default is false
					// 			node.receiveShadow = true;
					// 			node.material.needsUpdate = true;

					// 				}
					// 		}
					// 	});

					// }
	

					selectedFabricList[event.detail.part] = event.detail.data;
					loader.style.display = 'none';
			
				}
				img.src = event.detail.src;

			});
   }
});
	





/*!
devtools-detect
Detect if DevTools is open
https://github.com/sindresorhus/devtools-detect
By Sindre Sorhus
MIT License
*/
(function () {
	'use strict';
	
	const devtools = {
		isOpen: false,
		orientation: undefined
	};

	const threshold = 160;

	const emitEvent = (isOpen, orientation) => {
		window.dispatchEvent(new CustomEvent('devtoolschange', {
			detail: {
				isOpen,
				orientation
			}
		}));
	};

	setInterval(() => {
		const widthThreshold = window.outerWidth - window.innerWidth > threshold;
		const heightThreshold = window.outerHeight - window.innerHeight > threshold;
		const orientation = widthThreshold ? 'vertical' : 'horizontal';

		if (
			!(heightThreshold && widthThreshold) &&
			((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)
		) {
			if (!devtools.isOpen || devtools.orientation !== orientation) {
				emitEvent(true, orientation);
			}

			devtools.isOpen = true;
			devtools.orientation = orientation;
		} else {
			if (devtools.isOpen) {
				emitEvent(false, undefined);
			}

			devtools.isOpen = false;
			devtools.orientation = undefined;
		}
	}, 500);

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = devtools;
	} else {
		window.devtools = devtools;
	}
	})();

		// Check if it's open
		if(window.devtools.isOpen){
			console.clear();
			window.close();
		}

		// Get notified when it's opened/closed or orientation changes
		window.addEventListener('devtoolschange', event => {
			 if(event.detail.isOpen){
				console.clear();
				clearHTML();
			 }
		});
		
	//f12
	$(document).keydown(function(e){
			if(e.which === 123){
 
			return false;
	
		}
 
		});
	
	//right click
	$(document).bind("contextmenu",function(e) { 
	e.preventDefault();
 
	});
	
	function clearHTML(){
		 document.body.innerHTML = '';
		 document.head.innerHTML = '';
	}

