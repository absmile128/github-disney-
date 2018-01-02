/**
 * 用户菜单权限
 * 依赖jQuery
 * add by zc 2014-08-15 ‏‎14:43:50
 */
 (function(np){
 	if(np == undefined){
		np = {};
	}

	var authMgr = np.authMgr;
	if(authMgr == undefined){
		authMgr = {};
	}

	var menuJson = undefined;
	var menuList = undefined;
	var enableAuth = false;
	var menuAuth = undefined;

	//写cookie
	var _setCookie = function(name, value, hour) {
	    if(isNaN(hour) || hour < 0){
	    	hour = 0;
	    }
	    var exp = new Date();
	    exp.setTime(exp.getTime() + hour * 60 * 60 * 1000);
	    // document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        // cy加，解决跨域
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+"; path=/";
	}

	//读cookie
	var _getCookie = function(name) {
	    var regKey = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
	    var arr = document.cookie.match(regKey);
	    if (arr) {
	        return unescape(arr[2]);
	    } else {
	        return null;
	    }
	}

	//删cookie
	var _delCookie = function(name) {
	    var exp = new Date();
	    exp.setTime(exp.getTime() - 10000);
	    var cval = _getCookie(name);
	    if (cval != null) {
			// document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
			//cy加，解决跨域
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/";
		}

	}

	var _init = function(enable){
		enableAuth = enable;
	}

	var _setMenus = function(menuObj){
		menuJson = menuObj;

		if(menuList != undefined){
			menuList.splice(0,menuList.length);
		}
		menuList = [];
		var menus = menuJson.record;
		if(menus == null){
			menus = [];
		}
		if($.isArray(menus)){
			for(var i = 0;i < menus.length;i++){
				menuList.push(menus[i].functionname);
			}
		}else{
			menuList.push(menus.functionname);
		}

		_setCookie('menus',menuList.join(','),24);
	}

	var _getMenus = function(){
		try{
			var menus = _getCookie('menus');
			menuList = menus.split(',');
			return menuList;
		}catch(e){
			return undefined;
		}
	}

	var _setMenuEnable = function(menuNames,toolbars,flag){
		if(!enableAuth){
			return;
		}

		var menus = menuNames;
		if(menuNames == undefined || menuNames.length == 0){
			menus = [];
		}

		menuAuth = {};
		if(toolbars == undefined){
			toolbars = $('.toolbar-item');
		}
		$.each(toolbars,function(i,n){
			var div = $(n).find('div');
			if(div != undefined && div.text() != ''){
				if($.inArray(div.text(),menus,0) < 0){
					$(n).attr('disabled','disabled');
					menuAuth[i] = false;
				}else{
					if(flag){
						$(n).removeAttr('disabled');
					}
					menuAuth[i] = true;
				}
			}
		});
	}

	var _clearAll = function(){
		menuJson = undefined;
		menuList = undefined;
		menuAuth = undefined;

		_delCookie('menus');
	}

	authMgr.init = _init;
	authMgr.clearAll = _clearAll;
	authMgr.setMenus = _setMenus;
	authMgr.getMenus = _getMenus;

	/**
	 * 设置目标菜单的禁用状态
	 * @param toolbars array (需要禁用(或启用))目标菜单
	 * @param flag,可选值:
	 * true:禁用/启用无/有访问权限的菜单
	 * false | undefined:仅禁用无访问权限的菜单,有访问权限的菜单不修改其状态
	 */
	authMgr.setMenuEnable = function(toolbars,flag){
		var menus = _getMenus();
		_setMenuEnable(menus,toolbars,flag);
	};

	authMgr.isEnableAuth = function(){
		return enableAuth;
	}

	/**
	 * 根据菜单名称检查是否有访问权限
	 */
	authMgr.checkAuthByName = function(menuName){
		if(menuName == undefined || menuName == ''){
			return false;
		}
		return ($.inArray(menuName,menuList,0) >= 0);
	}

	/**
	 * 根据菜顺序称检查是否有访问权限
	 * 不建议使用该方法
	 */
	authMgr.checkAuthByIndex = function(index){
		if(isNaN(index)){
			return false;
		}
		if(index < 0){
			false;
		}
		if(index >= menuAuth.length){
			return false;
		}

		return menuAuth[index];
	}

	authMgr.setCookie = _setCookie;
	authMgr.getCookie = _getCookie;
	authMgr.delCookie = _delCookie;

	np.authMgr = authMgr;
 })(window)