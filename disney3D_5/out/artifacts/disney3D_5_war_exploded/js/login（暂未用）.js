$(function(){
    var loadEarth = function(dx_username,dx_password,swkjstyle){


        $("#earthtemp").show();
        $("#earthtemp").html('<object id="tearth" classid="clsid:EA3EA17C-5724-4104-94D8-4EECBD352964" ' +
            'data="data:application/x-oleobject;base64,Xy0TLBTXH0q8GKFyFzl3vgAIAADYEwAA2BMAAA==" ' +
            'width="100%" height="100%"></object>');
        tearth.Event.OnCreateEarth = function () {
            tearth.Event.OnCreateEarth = function () {};

            var userName = dx_username;
            var password  =dx_password;

            userLogin(userName,password,swkjstyle);
            return;
        };
    }

    var userLogin = function(userName,password,swkjstyle){
        debugger;
        var url = CITYPLAN_config.service.authentication
            + '&u='+ escape(userName)
            + '&pwd=' + escape(password);

        tearth.Event.OnEditDatabaseFinished = function(response){
            tearth.Event.OnEditDatabaseFinished = function(){};

            $('#earthtemp').hide();

            var menuAuthXml = response.AttributeName;

            var menuAuthJson = $.xml2json(menuAuthXml);
            if(menuAuthJson == undefined){
                alert('用户名或密码错误');
                return;
            }else{
                if(menuAuthJson.result <= 0){
                    alert('用户名或密码错误');
                    return;
                }

                //   authMgr.init(true);
                // authMgr.setMenus(menuAuthJson);

                authMgr.setCookie('userName', userName, 24);
                authMgr.setCookie('password', password, 24);

                jumpToMain();
            }
        }
        tearth.DatabaseManager.GetXml(url);
        $('#earthtemp').hide();
    }

    var clearIpt = function(){
        $('#iptUserName').val('');
        $('#iptPwd').val('');
    }

    var jumpToMain = function(){
        try{
            var url = top.location.href;
            url = url.substring(0,url.lastIndexOf('/')) + '/mian2.html';
            top.location.assign(url);
        }catch(e){

        }
    }

//	var init = function(){
//		if(!CITYPLAN_config.auth.enableAuth){
//			jumpToMain();
//		}else{
//    		//$('#login').width('100%').height($(document).height());
//
//            document.title = CITYPLAN_config.auth.loginTitle;
//            $('#caption').text(CITYPLAN_config.auth.loginCaption);
//            $('#middle').css('background-image','url(\'' + CITYPLAN_config.auth.loginImg + '\')').css('background-repeat','no-repeat');
//
//            $('#iptUserName')[0].focus();
//
//    		$('#btnOk').click(function(){
//    			loadEarth();
//    		});
//
//    		$('#btnCle').click(function(){
//    			clearIpt();
//    		});
//
//            $(document).keydown(function(event){
//                if(event.keyCode == 13){
//                    loadEarth();
//                }
//            });
//		}
//	}
//
//	init();




//    //cy:登录系统（swf的函数接口）
//    //swkjstyle：登录哪个系统（地上or地下）
    var dx_login=function(dx_username,dx_password,swkjstyle){
        debugger;
        alert("cycy") ;
        loadEarth(dx_username,dx_password,swkjstyle);


    }
    //cy:
    var dx_pw=function(){
        alert("忘记密码，请联系管理员！");
    }

    //cy:
  //   dx_login("cy","123456")  ;

});



