/* ---------------------------------------------
 Contact form
 --------------------------------------------- */
$(document).ready(function(){
    $("#submit_btn").click(function(){
        
        //get input field values
        var user_name = $('input[name=name]').val();
        var user_email = $('input[name=email]').val();
        var user_message = $('textarea[name=message]').val();
		var user_phone = $('input[name=tel]').val();
		var user_sector = $('#sector option:selected').val();
        
        //simple validation at client's end
        //we simply change border color to red if empty field using .css()
        var proceed = true;
        if (user_name == "") {
            $('input[name=name]').css('border-color', '#e41919');
            proceed = false;
        }
        if (user_email == "") {
            $('input[name=email]').css('border-color', '#e41919');
            proceed = false;
        }
        
        if (user_message == "") {
            $('textarea[name=message]').css('border-color', '#e41919');
            proceed = false;
        }
		
		if (user_phone == "") {
            $('input[name=tel]').css('border-color', '#e41919');
            proceed = false;
        }
		
		
        
        //everything looks good! proceed...
        if (proceed) {
            //data to be sent to server
            post_data = {
                'userName': user_name,
                'userEmail': user_email,
                'userMessage': user_message,
				'userPhone': user_phone,
				'userSector': user_sector
            };
            
       $.ajax({
        url: 'http://icarusinnovations.herokuapp.com/',
        data: post_data,
		callback: '?',
		type: 'GET',
		crossDomain: true,
		dataType: 'jsonp',
		success: function() { alert("Success"); },
		error: function() { alert('Failed!'); },
			});
            
        }
        
        return false;
    });
    
    //reset previously set border colors and hide all message on .keyup()
    $("#contact_form input, #contact_form textarea").keyup(function(){
        $("#contact_form input, #contact_form textarea").css('border-color', '');
        $("#result").slideUp();
    });
    
});
