document.addEventListener('DOMContentLoaded', function () {
	
	/*for debug*/
	var option = window.localStorage.getItem('option');
	
	/* photo uri */
	var snap;

	//var option = "camera";
	
	
	//data 
	const data = 
			{
				'grant_type': 'client_credentials',
				'client_id': '3VI3rMoSb4BXCTuEYqsHmRDE34IRAurCEISpH5Bd',
				'client_secret': 'UvW68u5M2ujk16d3JvcuNwJ9PcBXAuGdfHfKOGG6Cgz2BwCyhAlFTZ5eEXQQPK2S848LjW8pVpHQnaq8iRPlM62N4UT8rXK8Kudt7FOVfnCLGiKUzkaZkHruekSHnOn4'
			}
			
	let AuthHeader = null;
	let PlayerHeader = null;
	let AvatarId = null;
	
	const tokenUrl = 'https://api.avatarsdk.com/o/token/';
	
	let avatar_status_url = null;
	
	let access_token = null;
    let token_type = null;
	
	let streamObj = null;
	
	
	// References to all the element we will need.
    var video = document.querySelector('#camera-stream'),
        image = document.querySelector('#snap'),

        controls = document.querySelector('.controls'),
        take_photo_btn = document.querySelector('#take-photo'),
        delete_photo_btn = document.querySelector('#delete-photo'),
        download_photo_btn = document.querySelector('#download-photo'),
		
        error_message = document.querySelector('#error-message'),
		
		pic = document.querySelector('#pic');
		upload = document.querySelector('#upload');
	
	if(option == "camera"){
    // The getUserMedia interface is used for handling camera input.
    // Some browsers need a prefix so here we're covering all the options
	
	 navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
	  streamObj = stream;
      video.srcObject = stream;
      video.play();
	  video.onplay = function() {
                    showVideo();
                };
    })
    .catch(function(err) {
      console.log("An error occurred: " + err);
    });
	}
	else if(option == "photo"){
	  image.classList.add("visible");
	  upload.classList.remove('hidden');
		
	 var inputs = document.querySelectorAll('.file-input');
	 
	 var el = inputs[0];
	 
	  const fileInput = el.querySelector('[type="file"]')
	  const label = el.querySelector('[data-js-label]')
	  
	  fileInput.onchange =
	  fileInput.onmousedown = function () {
		if (!fileInput.value) return
		
		var value = fileInput.value.replace(/^.*[\\\/]/, '')
		el.className += ' -chosen'
		label.innerText = value
		
		readImage(fileInput.files[0]);
	  }

    var hidden_canvas = document.querySelector('canvas'),
    context = hidden_canvas.getContext('2d');
	
	function readImage(img) {
		if ( img ) {
			var FR= new FileReader();
			FR.onload = function(e) {
			   var img = new Image();
			   img.onload = function() {
				  var height = img.height;
                  var width = img.width;
				  
				  // Setup a canvas with the same dimensions as the video.
				  hidden_canvas.width = width;
				  hidden_canvas.height = height;

					// Make a copy of the current frame in the video on the canvas.
				  context.drawImage(img, 0, 0, hidden_canvas.width, hidden_canvas.height);
				  
				  snap = hidden_canvas.toDataURL('image/jpeg');
				  pic.setAttribute('src', snap);

				  showPhotoUI();
			   };
			   img.src = e.target.result;
			  
			};       
			FR.readAsDataURL( img );

		}
	}
}


			
	
    take_photo_btn.addEventListener("click", function(e){
        e.preventDefault();
		
		if(option == "camera"){

			snap = takeSnapshot();

			// Show image. 
			image.setAttribute('src', snap);
			image.classList.add("visible");

			// Enable delete and save buttons
			delete_photo_btn.classList.remove("disabled");
			download_photo_btn.classList.remove("disabled");
			take_photo_btn.classList.add("disabled");

			// Pause video playback of stream.
			video.pause();
		}

    });
	

    delete_photo_btn.addEventListener("click", function(e){

        e.preventDefault();

		if(option == "camera"){
			
			take_photo_btn.classList.remove("disabled");

			// Hide image.
			image.setAttribute('src', "");
			image.classList.remove("visible");

			// Disable delete and save buttons
			delete_photo_btn.classList.add("disabled");
			download_photo_btn.classList.add("disabled");

			// Resume playback of stream.
			video.play();
			
			removeScript();
		}
		else if(option == "photo"){
			
			// Hide image.
			pic.setAttribute('src', "");
			pic.classList.add("hidden");

			// Disable delete and save buttons
			delete_photo_btn.classList.add("disabled");
			download_photo_btn.classList.add("disabled");
			
			hideUI();
			
			upload.classList.remove('hidden');
			
			
			const fileInput = el.querySelector('[type="file"]')
			fileInput.value = '';
			
			const label = el.querySelector('[data-js-label]')
			label.innerText = "No file selected";
			
			removeScript();
		}

    });

    function showVideo(){
        // Display the video stream and the controls.

        hideUI();
        video.classList.add("visible");
        controls.classList.add("visible");
    }
	
	//for photo upload
	function showPhotoUI (){
		
		pic.classList.remove('hidden');
		upload.classList.add('hidden');
		controls.classList.add("visible");
		take_photo_btn.classList.add('hidden');
		take_photo_btn.classList.add('disabled');
		// Enable delete and save buttons
        delete_photo_btn.classList.remove("disabled");
        download_photo_btn.classList.remove("disabled")
		
	}


    function takeSnapshot(){
        // Here we're using a trick that involves a hidden canvas element.  

        var hidden_canvas = document.querySelector('canvas'),
            context = hidden_canvas.getContext('2d');

        var width = video.videoWidth,
            height = video.videoHeight;

        if (width && height) {

            // Setup a canvas with the same dimensions as the video.
            hidden_canvas.width = width;
            hidden_canvas.height = height;

            // Make a copy of the current frame in the video on the canvas.
            context.drawImage(video, 0, 0, width, height);

            // Turn the canvas image into a dataURL that can be used as a src for our photo.
            return hidden_canvas.toDataURL('image/jpeg'); 
        }
    }


    function displayErrorMessage(error_msg, error){
        error = error || "";
        if(error){
            console.error(error);
        }

        error_message.innerText = error_msg;

        hideUI();
        error_message.classList.add("visible");
    }

   
    function hideUI(){
        // Helper function for clearing the app UI.

        controls.classList.remove("visible");

        video.classList.remove("visible");
        image.classList.remove("visible");
		pic.classList.add("hidden");
    }
	
	function insertScript(){
		newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.src = 'assets/js/nobackpress.js';
		document.getElementsByTagName("head")[0].appendChild(newScript);
	}
	
	function removeScript(){
		$("script[src='assets/js/nobackpress.js']").remove()
	}
	
    function showLoader(){
        // Helper function for clearing the app UI.
	
		document.querySelector('#loader').classList.remove('hidden');
        document.querySelector('#loadertext').classList.remove('hidden');
		insertScript();
    }
	
	function stopVideo(){
		var track = streamObj.getTracks()[0];  // if only one media track
		track.stop();
		streamObj = null;
	}
	
		
    // Set the href attribute of the download button to the snap url.
    download_photo_btn.addEventListener("click",function (){
		hideUI();
		showLoader();
		if(option == "camera"){
			stopVideo();
		}

						$.ajax({
							url: tokenUrl,
							type: 'POST',
							data: data,
							success: function (data, status, xhr) {
								access_token = data['access_token'];
								token_type = data['token_type'];
								AuthHeader = token_type + " " + access_token;
								localStorage.setItem('Authorization', AuthHeader)
								createPlayer();
								
							},
							error: function () { },
						});
	});
	
	function createPlayer(){
		
				$.ajax({
				url: 'https://api.avatarsdk.com/players/',
				type: 'POST',
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', AuthHeader);
				},
				data: {'comment': 'test_py'},
				success: function (data, status, xhr) {
					updateLoader(33,'Sending image to server');
					PlayerHeader = data['code'];
					localStorage.setItem('X-PlayerUID', PlayerHeader );
					sendDataToCloud(snap);
				},
				error: function () { },
				});

	}
		

	
	function sendDataToCloud(snap){
		
		var blobBin = atob(snap.split(',')[1]);
		var array = [];
		for(var i = 0; i < blobBin.length; i++) {
			array.push(blobBin.charCodeAt(i));
		}
		var file=new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
		
		let formData = new FormData();
		formData.append("photo", file);
		formData.append("name","valji");
		formData.append("pipeline","head_1.1");
		formData.append("resources","{}");
		
		//const data = {'name': 'test', 'pipeline': 'head_1.1', 'resources': '{}', 'photo': formData.serialize};

		
		$.ajax({
					url: 'https://api.avatarsdk.com/avatars/',
					type: 'POST',
					data: formData,
					contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
					processData: false, // NEEDED, DON'T OMIT THIS
					beforeSend: function (xhr) {
								xhr.setRequestHeader('Authorization',  AuthHeader);
								xhr.setRequestHeader('X-PlayerUID',  PlayerHeader);
					},
					success: function (data, status, xhr) {
						updateLoader(66,'Creating your face model');
						avatar_status_url = data['url'];
						console.log("avatar_url---"+avatar_status_url);
						updateSelfieStatus();
					},
					error: function (errorThrown) {
						console.log("Snding data to server failed -- " + errorThrown);
					},
				});
	}
	
	function updateSelfieStatus(){
		console.log("inUpdateSelfie");
		var interval = null;
		interval = window.setInterval(
			checkForStatus,
			5000,
			function(){ return interval; }
		);
	}
	
	
	function checkForStatus(intervalGetter){
		
		$.ajax({
					url: avatar_status_url ,
					type: 'GET',
					beforeSend: function (xhr) {
								xhr.setRequestHeader('Authorization',  AuthHeader);
								xhr.setRequestHeader('X-PlayerUID',  PlayerHeader);
					},
					success: function (data, status, xhr) {
						
						console.log(data['status']);
						if(data['status'] == 'Completed')
						{
							updateLoader(99,'Downloading your face model');
							console.log("Completed");
							clearInterval(intervalGetter());
							setMeshData(data['texture'], data['mesh']);
							
						}
						else if(data['status'] == 'Failed' || data['status'] == "Timed Out")
						{
							console.log(data['status']);
							clearInterval(intervalGetter());
							removeSelfie();
						}
					},
					error: function (errorThrown) {
						console.log(errorThrown);
						removeSelfie();
					},
				});	

		}
		
		function removeSelfie(){
			
			updateLoader(100,'Error! No Face Found, Try Again');
			
			$.ajax({
					url: avatar_status_url ,
					type: 'DELETE',
					beforeSend: function (xhr) {
								xhr.setRequestHeader('Authorization',  AuthHeader);
								xhr.setRequestHeader('X-PlayerUID',  PlayerHeader);
					},
					success: function (data, status, xhr) {
						console.log("deleted");
					},
					error: function (errorThrown) {
						console.log(errorThrown);
					},
				});
				
			setTimeout(function(){
				
				console.log('back');
				
				removeScript();
				
				window.history.go(-2);
				
			}, 3000);
			
		}
		
		function setMeshData(textureUrl, meshUrl){
				localStorage.setItem("textureUrl", textureUrl);
                localStorage.setItem("meshUrl", meshUrl);
				
				setTimeout(function(){
					updateLoader(100,'Done! Lets get going');
				},1000);		
				
				setTimeout(function(){
					location.href="../../configurator/";
				},3000);
		
			}
		


});

function updateLoader(percent, stage){
$("#loader").percircle({
  progressBarColor: "#555555",
  percent: percent,
});

document.querySelector('#loadertext').innerHTML = stage;
}

//intit loader
$("#loader").percircle({
  progressBarColor: "#555555",
  percent: 0.1,
});
