 $(function() {
     $.fn.extend({
        customAttr: function(a, b) {
              
                if (b != undefined && (b!=""||typeof(b)=="boolean")){

                      $(this).attr(a, b); 
            }
            else
            {
                 return $(this).attr(a);
            }
        }
    });
 });
