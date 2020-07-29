//"order tab click get all info

$('#orderTab').click(function(){

$(".preloader-wrapper").show();

$("#measurementValues").html("");

$(".list-group").html("");

var link;
var doc;

setTimeout(function(){

    initPDF();

    takeScreenShot();

    getFabrics();

    getMeasurements();

    sendPdf();

}, 200);


})

function initPDF(){

    doc = new jsPDF('p', 'pt','a4',true);

    doc.setFontSize(28);

    var text = "Suit View",
    xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * doc.internal.getFontSize() / 2); 
    doc.text(text, xOffset, 60);

}


function takeScreenShot(){

    var scene  = document.querySelector('a-scene');

    
    var iheight = 1280;
    var iwidth  = 916;

    scene.camera.aspect = iwidth/iheight;
    scene.camera.updateProjectionMatrix();
    scene.renderer.setSize(  iwidth, iheight );
  
    var sc = scene.components.screenshot;

    sc.data.height = iheight;
    sc.data.width  = iwidth;

    canvas = sc.getCanvas('perspective');

    link = canvas.toDataURL();

    window.dispatchEvent(new Event('resize'));

    document.getElementById('preview')
    .setAttribute(
        'src', link)


    doc.addImage(link, 'JPEG', 60, 100, 480, 640,'', 'FAST');

    $(".preloader-wrapper").hide();


}



function getFabrics(){

    if(Object.keys(selectedFabricList).length > 0 ){
    doc.addPage();

    var text = "Fabric Details",
    xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * doc.internal.getFontSize() / 2); 
    doc.text(text, xOffset, 60);

    var col = ["Garment","Book","Pattern", "ID"];
    var rows = [];

    for (var item in selectedFabricList) {  

    var fabric = selectedFabricList[item];

    var temp = [];
    try {
     temp = [item.toUpperCase(), fabric['Book'].replace(/[\t]/gi, ' '), fabric['Pattern'].replace(/[\t]/gi, ' '), fabric['ID']];
    }
    catch(error) {
     temp = [item.toUpperCase(), "N/A", "N/A", fabric['ID']];
    }

    
    rows.push(temp);

    var _Html = '';
    _Html += '<li class="list-group-item"><div class="parent"><div class="img"><img src='+fabric['url']+' alt="" /></div>';
    _Html += '<div class="text"><span>Garment</span>: '+item+' <br><br> <span>Fabric Book</span>: '+fabric['Book']+' <br><br> <span>Fabric Pattern</span>: '+fabric['Pattern']+' <br><br> <span>Fabric ID</span>: '+fabric['ID']+'</div></div> </li>';

    $('.list-group').append(_Html);

    }

    doc.autoTable(col, rows,{ margin: { top: 100, left: 45 } } );
}

}


function getMeasurements(){

    if(jQuery.isEmptyObject(sizingDict))
    {
        $('#measurements .header').hide();

    }else{

        $('#measurements .header').show();
       
        doc.addPage();

        var text = "Sizing Details",
        xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * doc.internal.getFontSize() / 2); 
        doc.text(text, xOffset, 60);

        var col = ["Metric", "Value"];
        var rows = [];

        for (msmt in sizingDict){
            
            var temp = [sizingDict[msmt]['name'], sizingDict[msmt]['value']];
            rows.push(temp);


            if(sizingDict[msmt]['value'] != ''){
                var _Html = '';
                _Html += '<div class="row content"><div class="col-sm-4 col-xs-4"><p>'+ sizingDict[msmt]['name'] +'</p></div><div class="col-sm-8 col-xs-8"><p>'+ sizingDict[msmt]['value'] +'</p></div></div>';

                $('#measurements #measurementValues').append(_Html);
           }
        }

         doc.autoTable(col, rows,{ margin: { top: 100, left: 45 } } );

    }
}


function sendPdf(){

    $('#sendPdf').click(function () {

        var dets = $(".pdfForm").serializeArray();

        if(dets[0].value != '' &&  dets[1].value != ''){

            $("#pdfModal .close").click();

            var pdf =  doc.output('datauristring');

            var telephone = "-";

            if(dets[2].value != '')
            {   

                telephone = dets[2].value; 
            }


            var data = {
                name: dets[0].value.trim(),
                email: dets[1].value.trim(),
                telephone: telephone,
                pdf: pdf
            };

            $.ajax({
              url: "https://manderbykarn3d.000webhostapp.com/php/sendmail.php",
              type: 'POST',
              data: data
              })
              .done(function( data ) {
                  console.log(data);
              });

        }


        }); 

}