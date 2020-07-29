
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
  var pageData = { page: page, pagelimit: pagelimit, category: 'suit'};

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


        imgUrl = baseURL + '/swatches/suit/' + item.ID + '.jpg';

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
     
          $('#trouser_list .clearfix').append(_Html);

          if(index == ( data.success.fetched - 1))
          {
            $('#trouser_list .clearfix').imagesLoaded( function() {
                $('.preloader-wrapper').hide();
              });
          }
      }

    }



else if(data.error){
      $('#trouser_list .clearfix').append('<div style="margin-left:45%; margin-top:50px;">'+data.error+'</div>');
      $('.preloader-wrapper').hide();
    }

  }

}

  //click action on fabric
  $('#trouser_list').on('click','.center-block',function(){
            $('#fabric_rightside').find('.sidebar-toggle.trouser-menu').trigger( "click" );
            var url =  $(this).attr('src');
            var dictionary = $(this).data('value');
            
            //main call
            sceneEl.emit('changeTexture', {src: url, part:'pant', entity:'shirtpantEntity', data: dictionary}, false);

            $(this).parents('#trouser_list').find('.load_fabric').removeClass('active');
            $(this).parents('#trouser_list .load_fabric').addClass('active');

    });


  $('#trouser_list').on('scroll', function() {
        //error in mobile so did (-1)
        if($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight -1)) {
            if (page * pagelimit < totalrecord) {
                page++;
                setParams(filterData);
                console.log("Next Page: " + page);
              }
            
          }
    })



function setFilter(){

  setFilterOptions();

  $('#filterTrouserData').click(function () {

  //cleardata
  filterData = {};

  resetPageData();

  var filter = $("#trouserFilterForm").serializeArray(); // Serialize form Data

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

  $('#trouser_list .clearfix').html('');

  page = 1;

  totalrecord = 0;

}


function setFilterOptions(){

  $('#trouserbook').multiselect();
  $('#trouserpattern').multiselect();

  $.ajax({
  url: baseURL + '/php/filteroptions.php',
  type : 'GET',
  beforeSend: function( xhr ) {
     xhr.overrideMimeType( "application/json; charset=x-user-defined" );
   },
  data: {category:'suit'},
  dataType:'json',
    success : function(data) {  

        var bookopts = [];
        var patternopts = [];

        $.each(data.success.book, function (index, value) {
            bookopts.push({name:value, value: value})
        });

        $('#trouserbook').multiselect('loadOptions', bookopts);


        $.each(data.success.pattern, function (index, value) {
            patternopts.push({name:value, value: value})
        });

        $('#trouserpattern').multiselect('loadOptions', patternopts);

    
    },
    error : function(request,error)
    {
        alert("Request: "+JSON.stringify(request));
    }
  })
  
}


})()