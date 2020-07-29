var sizingDict = {}

$('#submit').click(function () {
  var encoded = $(".sizingForm").serializeArray(); // Serialize form Data
  sizingDict = encoded;

  $('#saveButton').click();
  return false; 
}); 

//scroll bar addition
// $("#sizing_info").mCustomScrollbar({
//         theme:"minimal-dark",
//         scrollInertia:100,
//         advanced:{
//             updateOnBrowserResize:true,
//             updateOnContentResize:true
//         },
//         callbacks:{
//             onScroll:function(){
              
//             }
//         }
// });
