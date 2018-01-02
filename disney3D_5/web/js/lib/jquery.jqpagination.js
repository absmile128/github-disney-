/*!
 * jqPagination, a jQuery pagination plugin (obviously)
 *
 * Copyright (C) 2011 Ben Everard
 *
 * http://beneverard.github.com/jqPagination
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *     
 */

(function ($) {
    "use strict";

    $.jqPagination = function (el, opt) {


        $el = $(el);

        $currentpage    = $el.find('.currentpageli');
        $totalpage = $el.find('.totalpageli');
        $firstpage = $el.find('.firstpageli'); //��ҳ��ť
        $prepage = $el.find('.prepageli'); //��һҳ��ť
        $nextpage = $el.find('.nextpageli'); //��һҳ��ť
        $endpage = $el.find('.endpageli'); //ĩҳ��ť



        //��ʼ��
        init = function () {

            options = null;


            options = $.extend({}, $.jqPagination.defaultOptions, opt);



            // if the user hasn't provided a max page number in the options try and find
            // the data attribute for it, if that cannot be found, use one as a max page number

            if (options.max_page === null) {

                options.max_page = 0;


            }
            if (options.current_page === null) {

                options.current_page = 0;

            }


            // if the current_page data attribute is specified this takes priority
            // over the options passed in, so long as it's a number


            // remove the readonly attribute as JavaScript must be working by now ;-)
            //$pagelist.removeAttr('readonly');

            // set the initial input value
            // pass true to prevent paged callback form being fired
            initcurrentpage();
            inittotalpage();
            //updateInput(true);


            //***************
            // ȥ��ԭ�Ȱ��¼���ȷ���¶������ظ������¼�
            $firstpage.unbind("click");
            $prepage.unbind("click");
            $nextpage.unbind("click");
            $endpage.unbind("click");

            // BIND EVENTS
            $firstpage.on('click', function (event) {

                var currentpageindex = options.current_page;
                var max_page = options.max_page;



                if (currentpageindex > 1) {


                    newpage(1);
                }



            });
            $prepage.on('click', function (event) {




                var currentpageindex = options.current_page;

                var max_page = options.max_page;


                if (currentpageindex > 1) {

                    currentpageindex = currentpageindex - 1;
                        newpage(currentpageindex );

                }



            });
            $nextpage.on('click', function (event) {

                var currentpageindex = options.current_page;
                var max_page = options.max_page;

                        if (currentpageindex + 1 <= max_page) {


                            currentpageindex = currentpageindex + 1;
                            newpage(currentpageindex);

                }


            });
            $endpage.on('click', function (event) {


              
                var currentpageindex = options.current_page;
                var max_page = options.max_page;



                if (currentpageindex < max_page) {

                    newpage(max_page);

                }

            });




        };
        // ATTN this isn't really the correct name is it?
        //updateInput = function (prevent_paged) {
        initcurrentpage = function () {

            var max_page = parseInt(options.max_page, 10);

            if (max_page == 0) {
                setcurrentpage(  0);
            }
            else {
                    setcurrentpage(1 );


            }







            /* 				
            // set the input value
            setInputValue(current_page);
			
            // set the link href attributes
            setLinks(current_page);
			
            // we may want to prevent the paged callback from being fired
            if (prevent_paged !== true) {

            // fire the callback function with the current page
            options.paged(current_page);
			
            } */

        };
        inittotalpage = function () {

            var max_page = parseInt(options.max_page, 10);

            if (max_page == 0) {
                settotalpage(  0);
            }
            else {
                settotalpage(max_page );


            }







            /*
             // set the input value
             setInputValue(current_page);

             // set the link href attributes
             setLinks(current_page);

             // we may want to prevent the paged callback from being fired
             if (prevent_paged !== true) {

             // fire the callback function with the current page
             options.paged(current_page);

             } */

        };
        setcurrentpage = function (currentpage ) {


          

            options.current_page  = currentpage ;


            $currentpage .html("");

            var htmlstr =    "  <input   style='width:20px;'    onchange='newpage( $(this).val())'   value='"+  currentpage.toString() + "'/>";

            $currentpage .html(htmlstr);



        };
        settotalpage = function (totalpage ) {

            options.max_page  = totalpage ;
            $totalpage .html(totalpage.toString());




        };

        newpage = function (pageindex) {


            options.current_page =pageindex;
            restylecurrentpageindex(pageindex);
            // alert(options.current_page);
            // options.outfunc

            var c = options.outerfunc;
            c(options.current_page);

            // options.outerfunc(options.current_page);//��ӿں���
            //  getreliclist(options.current_page);//��ӿں���
        };

        //设置当前选中页码样式
        restylecurrentpageindex = function (pageindex) {

            setcurrentpage (pageindex);

        };



        init();

    };

    $.jqPagination.defaultOptions = {

        current_page: 0,
        max_page: null,
        currentlp: 0,
        currentfp: 0,
        firstpage: 0,
        lastpage: 0,


        outerfunc: function () { }
    };

    $.fn.jqPagination = function () {



        var args = Array.prototype.slice.call(arguments);
        // $.jqPagination(this, args[0]);
        // if we're not dealing with a method, initialise plugin
        return this.each(function () {
            ($.jqPagination(this, args[0]));
        });

    };

})(jQuery);

// polyfill, provide a fallback if the console doesn't exist
if (!console) {

	var console	= {},
		func	= function () { return false; };

	console.log		= func;
	console.info	= func;
	console.warn	= func;
	console.error	= func;

}
