AFRAME.registerComponent('markerhandler1', {
	
	init: function(){
		var scene = this.el.sceneEl;
		var el = this.el;
		
		let btn =  document.getElementById('playVideo');
		let options =  document.getElementById('scanPrompt');
		let animatedMarker = document.querySelector('#animated-marker1');
		
		let geometry = new THREE.PlaneBufferGeometry( 2.5, 2.5, 4, 4);
		let video = document.getElementById( 'video' );
		let texture = new THREE.VideoTexture( video );
		
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.format = THREE.RGBFormat;
		let material = new THREE.MeshBasicMaterial( { map: texture } );
	
		let mesh = new THREE.Mesh( geometry, material );
		
		/* to get el children use this */
		el.object3D.children[0].el.setObject3D('mesh', mesh);
		
		el.setAttribute('emitevents', 'true');

		el.addEventListener('markerFound', function() {
			options.classList.add('hidden');
			btn.classList.remove('hidden');
			btn.addEventListener('click', function(){
				btn.classList.add('hidden');
				video.play();
			});
		});
		
		el.addEventListener('markerLost', function() {
			options.classList.remove('hidden');
			btn.classList.add('hidden');
			video.pause();	
		});
	
	}
 });
 
 
 var count = 0;
 AFRAME.registerComponent('markerhandler2', {
	
	init: function(){
		var scene = this.el.sceneEl;
		var el = this.el;
		var foundonce = false;

		let options =  document.getElementById('scanPrompt');
		let bird = document.querySelector('#bird');
		let flapSrc =  document.querySelector('#flapSrc').components.sound;
		let gb1 = document.querySelector("#gb1");
		let gb2 = document.querySelector("#gb2");
		let gb3 = document.querySelector("#gb3");
		
		let t1 = document.querySelector("#t1");
		let t2 = document.querySelector("#t2");
		let t3 = document.querySelector("#t3");
		
		let main1 = document.querySelector("#main1");
		let main2 = document.querySelector("#main2");
		let main3 = document.querySelector("#main3");
		
		this.cursor = document.querySelector("#cursor");
		this.cursortext = document.querySelector('#cursortext');
		let openbox = document.querySelector('#openBox');
		
		el.setAttribute('emitevents', 'true');
		

		el.addEventListener('markerFound', function() {
		options.classList.add('hidden');
		cursor.setAttribute("visible",true);
		
		if(foundonce!=true){
			foundonce = true;
			flapSrc.playSound();
			
			gb1.setAttribute('visible',true);
			gb2.setAttribute('visible',true);
			gb3.setAttribute('visible',true);
			
			gb1.setAttribute('opacity-color',0);
			gb2.setAttribute('opacity-color',0);
			gb3.setAttribute('opacity-color',0);
			
			setTimeout(function(){
				 gb1.setAttribute('animation__opacity', {
					property: 'opacity-color',
					dur: 5000,
					easing: 'easeInOutQuad',
					loop: false,
					to: '1'
					});
					
				gb2.setAttribute('animation__opacity', {
					property: 'opacity-color',
					dur: 5000,
					easing: 'easeInOutQuad',
					loop: false,
					to: '1'
					});
					
				gb3.setAttribute('animation__opacity', {
					property: 'opacity-color',
					dur: 5000,
					easing: 'easeInOutQuad',
					loop: false,
					to: '1'
					});
		
			},3000);
			
			
			gb1.addEventListener('animationcomplete', function (e) {
				if (e.detail.name == 'animation__opacity') {
					
				cursortext.setAttribute('visible', true);

				setTimeout(function(){
					t1.setAttribute('visible',true);
					
				},200);
				
				setTimeout(function(){
					t2.setAttribute('visible',true);
					
				},400);
				
				setTimeout(function(){
					t3.setAttribute('visible',true);
					
				},600);
				
				
				//for mouse click
				gb1.addEventListener('mouseenter',function(){
					openBox.classList.remove('hidden');
				});

				gb1.addEventListener('mouseleave',function(){
					openBox.classList.add('hidden');
				});
				
				gb1.addEventListener('animation-finished',function(){
					t1.setAttribute('visible',false);
					gb1.setAttribute('visible',false);
				});	
		
				gb1.addEventListener('click',function(){
					count = count + 1;
					t1.setAttribute('visible',false);
					main1.setAttribute('visible',true);
					
					main1.setAttribute('animation__scale', {
					property: 'scale',
					dur: 2000,
					easing: 'easeInOutQuad',
					loop: false,
					to: '6 6 1'
					});
					
					gb1.setAttribute('animation-mixer', {
						clip: '*',
						loop: 'once'
					});
					
				});
				
				//for mouse click
				gb2.addEventListener('mouseenter',function(){
					openBox.classList.remove('hidden');
				});

				gb2.addEventListener('mouseleave',function(){
					openBox.classList.add('hidden');
				});
				
				gb2.addEventListener('animation-finished',function(){
					t2.setAttribute('visible',false);
					gb2.setAttribute('visible',false);
				});	
		
				gb2.addEventListener('click',function(){
					count= count + 1;
					t2.setAttribute('visible',false);
					main2.setAttribute('visible',true);
					
					main2.setAttribute('animation__scale', {
					property: 'scale',
					dur: 2000,
					easing: 'easeInOutQuad',
					loop: false,
					to: '6 6 1'
					});
					
					gb2.setAttribute('animation-mixer', {
						clip: '*',
						loop: 'once'
					});
				
				});
				
				//for mouse click
				gb3.addEventListener('mouseenter',function(){
					openBox.classList.remove('hidden');
				});

				gb3.addEventListener('mouseleave',function(){
					openBox.classList.add('hidden');
				});
				
				gb3.addEventListener('animation-finished',function(){
					t3.setAttribute('visible',false);
					gb3.setAttribute('visible',false);
				});	
		
				gb3.addEventListener('click',function(){
					count= count + 1;
					t3.setAttribute('visible',false);
					main3.setAttribute('visible',true);
					
					main3.setAttribute('animation__scale', {
					property: 'scale',
					dur: 2000,
					easing: 'easeInOutQuad',
					loop: false,
					to: '6 6 1'
					});
					
					gb3.setAttribute('animation-mixer', {
						clip: '*',
						loop: 'once'
					});
				
				});
	
 
				}
			});
		}
		
		
		setTimeout(function(){
		   bird.setAttribute('visible',false);
		   flapSrc.stopSound();
		},8000);
		
		});
		
		el.addEventListener('markerLost', function() {
			options.classList.remove('hidden');	
			cursor.setAttribute("visible",false);
		});
	
	},
	
	tick: function(){

		if(count == 3)
		{
			this.cursor.setAttribute('visible',false);
			this.cursortext.setAttribute('visible',false);
		}
	
	}
 });
 
 
//working magic for stability
 document.addEventListener('DOMContentLoaded', function(evt) {

    var sceneEl = document.querySelector('a-scene');

    sceneEl.addEventListener('loaded', function(evt) {
        var newCamera = new THREE.PerspectiveCamera();
        newCamera.near = 1;
        newCamera.far = 100;
        sceneEl.camera = newCamera;
    });
});

AFRAME.registerComponent('opacity-color', {
  schema: {
    default: 0.0
  },
  init: function init() {
    var originalcolor;
  },
  
  update: function update() {
    var mesh = this.el.getObject3D('mesh');
    var data = this.data;

    if (!mesh) {
      return;
    }

    mesh.traverse(function (node) {
      if (node.isMesh) {
        //capture starting color
       node.material.opacity = data;
        node.material.transparent = data < 1.0;
        node.material.needsUpdate = true;
      }
    });
  }
});

