
;(function() {
	
var baseURL = 'https://manderbykarn3d.000webhostapp.com';

$('.preloader-wrapper').show();
var page = 1;
var pagelimit = 20;
var totalrecord = 0;
var filterData;

setParams({});

setFilter();

function setParams(filterData){

  var params = "";
  var pageData = { page: page, pagelimit: pagelimit, category: 'shirt'};

  if(filterData == null){
      params = pageData;
  }else{

      params = Object.assign({}, pageData, filterData);
  }


  if(params != ""){
      fetchData(params);
    }

}

function fetchData(params){

$('.preloader-wrapper').show();

$.ajax({
  url: baseURL + "/php/retrieve.php",
  beforeSend: function( xhr ) {
    xhr.overrideMimeType( "application/json; charset=x-user-defined" );
  },
  type: 'GET',
  data: params
  })
  .done(function( data ) {
      dataHandler(data);
  });

function dataHandler(data){

if(data.success){

    totalrecord = data.success.totalrecord;


    data.success.data.forEach(fillData);

    function fillData(item, index){

        var _Html = '';
        var imgUrl = '';


        imgUrl = baseURL + '/swatches/shirt/' + item.ID + '.jpg';

        item['url'] = imgUrl;

          //escape characters
        var jsonStr = "";
        jsonStr = JSON.stringify(item);
       
        var myEscapedJSONString = jsonStr
                                      .replace(/ /g,"\\t")
                                      .replace(/\\n/g, "\\n")
                                      .replace(/\\'/g, "\\'")
                                      .replace(/\\"/g, '\\"')
                                      .replace(/\\&/g, "\\&")
                                      .replace(/\\r/g, "\\r")
                                      .replace(/\\t/g, "\\t")
                                      .replace(/\\b/g, "\\b")
                                      .replace(/\\f/g, "\\f");

         _Html += '<div class="col-md-4 col-sm-4 col-xs-6 col-lg-4"><div class="border_image"><a class="load_fabric" href="javascript:void(0);"><i class="ion-ios-checkmark"></i>';
         _Html += '<div class="hover-btns"></div><img class="center-block"  data-value='+myEscapedJSONString+' src="'+imgUrl+'"></a><span>'+item.ID+'</span></div></div>';
     
          $('#favourite_list .clearfix').append(_Html);

          if(index == ( data.success.fetched - 1))
          {
            $('#favourite_list .clearfix').imagesLoaded( function() {
                $('.preloader-wrapper').hide();
              });
          }
      }

    }



else if(data.error){

      $('#favourite_list .clearfix').append('<div style="margin-left:45%; margin-top:50px;">'+data.error+'</div>');
      $('.preloader-wrapper').hide();
    }

  }

}

  //click action on fabric
  $('#favourite_list').on('click','.center-block',function(){
            $('#fabric_rightside').find('.sidebar-toggle.favourite-menu').trigger( "click" );
            var url =  $(this).attr('src');
            var dictionary = $(this).data('value');
            //main call
            sceneEl.emit('changeTexture', {src: url, part:'shirt', entity:'shirtpantEntity', data: dictionary}, false);

            $(this).parents('#favourite_list').find('.load_fabric').removeClass('active');
            $(this).parents('#favourite_list .load_fabric').addClass('active');

    });


  $('#favourite_list').on('scroll', function() {
/*         if($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight -1)) {
            if (page * pagelimit < totalrecord) {
                page++;
                setParams(filterData);
                console.log("Next Page: " + page);
              }
            
          } */
    })



function setFilter(){

  setFilterOptions();

  $('#filterShirtData').click(function () {

  //cleardata
  filterData = {};

  resetPageData();

  var filter = $("#shirtFilterForm").serializeArray(); // Serialize form Data

  filter.forEach(createdict);

  function createdict(item, index){


    if(!(item.name in filterData)){
      filterData[item.name] = [];
      filterData[item.name].push(item.value);
    }else{
      filterData[item.name].push(item.value);
    }

    }

    setParams(filterData);

  }); 

}


function resetPageData(){

  $('#favourite_list .clearfix').html('');

  page = 1;

  totalrecord = 0;

}


function setFilterOptions(){

  $('#shirtbook').multiselect();
  $('#shirtpattern').multiselect();

  $.ajax({
  url: baseURL + "/php/filteroptions.php",
  type : 'GET',
  beforeSend: function( xhr ) {
     xhr.overrideMimeType( "application/json; charset=x-user-defined" );
   },
  data: {category:'shirt'},
  dataType:'json',
    success : function(data) {  

        var bookopts = [];
        var patternopts = [];

        $.each(data.success.book, function (index, value) {
            bookopts.push({name:value, value: value})
        });

        $('#shirtbook').multiselect('loadOptions', bookopts);

        $.each(data.success.pattern, function (index, value) {
            patternopts.push({name:value, value: value})
        });

        $('#shirtpattern').multiselect('loadOptions', patternopts);
    
    },
    error : function(request,error)
    {
        alert("Request: "+JSON.stringify(request));
    }
  })
  
}


})()



