$( document ).ready(function() {
	
	
		function inactivate(){
			$('#fabric_rightside').find('.sidebar-toggle.styling-menu').trigger( "click" );
		}
    
		//jacket model selection
  		$('#jacketStyleList').on('click','.center-block',function(){
            $(this).parents('#jacketStyleList').find('.load_fabric').removeClass('active');
            $(this).parents('#jacketStyleList .load_fabric').addClass('active');

            if($(this).data('value').includes("Double")){

                updateOptionSpec('suitType','db');

            }else{

                updateOptionSpec('suitType','sb');
            }

            updateOptionSpec('jacketEntity',$(this).data('value'),'');
			
			inactivate();

    	});


    	//lapel model selection
  		$('#lapelStyleList').on('click','.center-block',function(){
            $(this).parents('#lapelStyleList').find('.load_fabric').removeClass('active');
            $(this).parents('#lapelStyleList .load_fabric').addClass('active');

            updateOptionSpec('lapelEntity',$(this).data('value'),optionSpec.suitType);
			
			inactivate();


    	});


    	//pocket model selection
  		$('#pocketStyleList').on('click','.center-block',function(){
            $(this).parents('#pocketStyleList').find('.load_fabric').removeClass('active');
            $(this).parents('#pocketStyleList .load_fabric').addClass('active');

            updateOptionSpec('pocketEntity',$(this).data('value'),optionSpec.suitType);
			
			inactivate();


    	});


    	//vent model selection
  		$('#ventStyleList').on('click','.center-block',function(){
            $(this).parents('#ventStyleList').find('.load_fabric').removeClass('active');
            $(this).parents('#ventStyleList .load_fabric').addClass('active');

            updateOptionSpec('ventEntity',$(this).data('value'),'');
			
			inactivate();

    	});

		
});