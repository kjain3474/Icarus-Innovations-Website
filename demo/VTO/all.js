function takeScreenshot( width, height ) {

    const dataURL = THREERENDERER.domElement.toDataURL( 'image/png' );

    // save
    saveDataURI(defaultFileName( '.png' ), dataURL);

  
 }

document.querySelector( '#screenshot' ).addEventListener( 'click', () => {
  takeScreenshot( 1024, 1024);
} );


document.querySelector( '#change' ).addEventListener( 'click', () => {
  change();
} );



function getMobileOperatingSystem() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }

        return "unknown";
    }

function dataURIToBlob( dataURI ) {
  const binStr = window.atob( dataURI.split( ',' )[1] );
  const len = binStr.length;
  const arr = new Uint8Array( len );
  for ( let i = 0; i < len; i++ ) {
    arr[i] = binStr.charCodeAt( i );
  }
  return new window.Blob( [arr] );
}



function saveDataURI( name, dataURI ) {
	var os=getMobileOperatingSystem();

    if(os=="iOS")
    {

			var w = window.open('', 'ScreenShot');
			w.document.title = name;
			var img = new Image();
			w.document.write('<html><head><title>ScreenShot!</title></head><body>');
			w.document.write('<p>Long Press on Image to Save!</p>');
			w.document.write('</body></html>');
			img.src = renderer.domElement.toDataURL();
			img.download = name;
			w.document.body.appendChild(img);  

   }
 else {

          const blob = dataURIToBlob( dataURI );
          const link = document.createElement( 'a' );
		  link.download = name;
		  link.href = window.URL.createObjectURL( blob );
		  link.onclick = () => {
			window.setTimeout( () => {
			  window.URL.revokeObjectURL( blob );
			  link.removeAttribute( 'href' );
			}, 500 );

		  };
		  link.click(); 
    }	
}

function defaultFileName (ext) {
  const str = `${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}${ext}`;
  return str.replace(/\//g, '-').replace(/:/g, '.');
}


