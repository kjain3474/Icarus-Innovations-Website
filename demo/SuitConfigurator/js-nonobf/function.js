(function() {
    
    //$.fatNav();
    
}());

$(window).resize(function () {
    var viewportWidth = $(window).width();
    if (viewportWidth > 767) {
            $(".main_window").removeClass("main_window").addClass("main_window1");
    }
});



$(document).ready(function () {
    var dataid;
    sidebarStatus = false;
    sidebarStatus1 = false;
    var old_select = '';
    var fabric_tab = '';

    
    $('#rightside').on('click','.sidebar-toggle',function () {
        var dataid = $(this).attr('data-id');

        if (old_select != '' && old_select != dataid) {
                sidebarStatus = false;
        }
        else if(old_select == ''){
            sidebarStatus = true;
        }

        old_select = dataid;

        $('#style_tab .sidebar-list').hide();
        $('#' + dataid).show();
        $('#style_tab .sidebar-toggle').removeClass('active');
        if (sidebarStatus == false) {
            $('#style_tab.sidebar').animate({
                marginLeft: "0px",
                opacity: "1"
                //zIndex: "99999"
            }, 1000);

            sidebarStatus = true;
            $(this).addClass('active');
        }
        else {

            $('#style_tab.sidebar').animate({
                marginLeft: "-100%",
                opacity: "1"
            }, 1000);

            sidebarStatus = false;
            $(this).removeClass('active');
        }
    });


    //for opening and closing tabs for fabrics
    $('#fabric_rightside').on('click','.sidebar-toggle',function () {

        dataid = $(this).attr('data-id');

        console.log(dataid);

        if (fabric_tab != '' && fabric_tab != dataid) {
            sidebarStatus1 = false;

        }
        else if(fabric_tab == ''){
            sidebarStatus1 = true;
        }

        fabric_tab = dataid;

        console.log(sidebarStatus1)
        $('#fabric_tab .sidebar-list').hide();
        $('#' + dataid).show();
        $('#fabric_tab .sidebar-toggle').removeClass('active');
        if (sidebarStatus1 == false) {
            console.log("open");
            $('#fabric_tab.sidebar').animate({
                marginLeft: "0px",
                opacity: "1"
                //zIndex: "99999"
            }, 1000);

            sidebarStatus1 = true;
            $(this).addClass('active');
        }
        else {
            console.log("close")
            $('#fabric_tab.sidebar').animate({
                marginLeft: "-100%",
                opacity: "1"
            }, 1000);

            sidebarStatus1 = false;
            $(this).removeClass('active');
        }
    });
});


// tool tips

$('.tooltips').tooltip();

// popovers

$('.popovers').popover();



//resize event 
$(window).resize(function() {
var heights = window.innerHeight;
var listheights = heights - $('#tabs').height() - 60 ;
$('.sidebar-list .content').height(listheights - 10);
$('.sidebar .sizing').height(listheights + 40);
$('.sidebar .order_info').height(listheights + 40);
$('#fabric_rightside').height(listheights);
 });

//setting scrollbar height for designs 
var heights = window.innerHeight;
var listheights = heights - $('#tabs').height() - 60 ;
$('.sidebar-list .content').height(listheights - 10);
$('.sidebar .sizing').height(listheights + 40);
$('.sidebar .order_info').height(listheights + 40);
$('#fabric_rightside').height(listheights);