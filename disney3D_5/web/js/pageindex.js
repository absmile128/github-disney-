$(function(){
	submenu();
	// cont_width();
   // $(".submenu li a").click(function(){
	//   var bachilda=$(this).text();
	//   })
})
function submenu(){
	var btn = $('#mainmenu > li');
	var submenu = $('.submenu');
	submenu.hide();
	submenu.eq(0).show();
	btn.hover(function(){
		submenu.hide();
		$(this).find('.submenu').show();
	})
}
// function cont_width(){
// 	var conr = $('#conr');
// 	var conlw = $('#conl').width();
// 	var conmw = $('#conm').width();
// 	var conw = $('#content').width();
// 	conr.width(conw-conmw-conlw-2);
// 	$('#btn').click(function(){
// 		if($('#conl').width()!=0){
// 			$('#conl').width(0);
// 			$('#conr').width(conw-conmw-2);
// 			$(this).css('background','url(image/pageimg/btn1.png)');
// 		}
// 		else{
// 			$('#conl').width(250);
// 			$('#conr').width(conw-conmw-conlw-2);
// 			$(this).css('background','url(image/pageimg/btn.png)');
// 		}
//
// 	})
// }


	