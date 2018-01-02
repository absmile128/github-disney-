/**
 * User: wyh
 * Date: 13-4-17
 * Time: 上午9:32
 * Desc:
 */
//cy   var earthArray = [];
var planArr = [];
var bollonArr = [];
//已看
function unloadEarth() {
    seearth.Suicide();
}
/**
 * 弹出气泡
 */
function onPoiClicked( pVal ){

	var htmlObj=parent.htmlBalloon;
	var posX = parseInt(pVal.substring(pVal.indexOf("<posX>")+6, pVal.indexOf("</posX>")));
	var posY = parseInt(pVal.substring(pVal.indexOf("<posY>")+6, pVal.indexOf("</posY>")));
	var loaclUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
    var url = loaclUrl + "/res/content.htm";
	var html = "";
	html += "<html>";
	html += "<bodys>";
	html += "<table>";
	html += "<tr><td align='right'>";
	html += "<img id='dlg_close' src='" + loaclUrl + "/res/x.png'/>";
	html += "</td></tr>";
	html += "<tr><td>";
	html += "<iframe src='" + url + "' width='320px' height='400px' border='1' frameborder='1' scrolling=auto></iframe>";
	html += "</td></tr>";
	html += "</table>";
	//html += "<iframe src='" + url + "' width='320px' height='400px' border='1' frameborder='1' scrolling=auto></iframe>";
	html += "</body>";
	html += "</html>";

    if(htmlBalloons){
        htmlBalloons.DestroyObject();
        htmlBalloons=null;
    }
    var geoPoint = seearth.GlobeObserver.Pick(posX,posY);
    var guid = seearth.Factory.CreateGuid();
    htmlBalloons = seearth.Factory.CreateHtmlBalloon(guid, "balloon");
    htmlBalloons.SetSphericalLocation(geoPoint.Longitude, geoPoint.Latitude, geoPoint.Altitude);
    htmlBalloons.SetRectSize(380, 400);
    var color = parseInt("0xffffff00");//0xccc0c0c0
    htmlBalloons.SetTailColor(color);
    htmlBalloons.SetIsAddCloseButton(true);
    htmlBalloons.SetIsAddMargin(true);
    htmlBalloons.SetIsAddBackgroundImage(true);
    htmlBalloons.SetIsTransparence(true);
    htmlBalloons.SetBackgroundAlpha(0xcc);
    htmlBalloons.ShowHtml(html);
    seearth.Event.OnHtmlBalloonFinished = function(){
        if(htmlBalloons!=null){
            htmlBalloons.DestroyObject();
            htmlBalloons=null;
        }
        seearth.Event.OnHtmlBalloonFinished = function(){};
    }
}

/**已看
 *  * 设置多屏(方案比选)
 * @param n 屏幕数
 */
function setScreen(n, data, projManager, projectId, currentLayerObjList) {
    planArr = data;
    if (n == 1) {
        $("#earthDiv0,#earthDiv1,#earthDiv2").removeClass("s1 s2 s3 s4").addClass("hide");
        $("#earthDiv0").removeClass("hide").addClass("s1");
        for (var i = parent.earthArray.length - 1; i > 0; i--) {
            parent.earthArray[i].Suicide();
            parent.earthArray.pop();
        }
        if(bollonArr&&bollonArr.length>0){
            for(var i=0;i<bollonArr.length;i++){
                if( bollonArr[i].Guid!=""){
                    bollonArr[i].DestroyObject();
                }
            }
        }
        bollonArr = [];
        $("#earthDiv2, #earthDiv1").empty();
        document.getElementById("earthDiv0").style.width="100%";
        document.getElementById("earthDiv0").style.height="100%";
    } else if (n == 2) {
        $("#earthDiv0,#earthDiv1,#earthDiv2").removeClass("hide s1 s2 s3 s4");
        //第一个球往左缩小
        //$("#earthDiv0").addClass("s2");//此行代码有时不起作用 div并没有缩小 因此采用下面两行代码强行设置宽高比例!
        document.getElementById("earthDiv0").style.width="50%";
        document.getElementById("earthDiv0").style.height="100%"; 
        document.getElementById("earthDiv1").style.width="50%";
        document.getElementById("earthDiv1").style.height="100%"; 
        //第二个球加载在右边
        $("#earthDiv1").addClass("s2");
        //隐藏第三个球
        $("#earthDiv2").addClass("hide");

        createEarth("earth1", document.getElementById("earthDiv1"), data, projManager, projectId, currentLayerObjList);
    } else if (n == 3) {
        $("#earthDiv0,#earthDiv1,#earthDiv2").removeClass("hide s1 s2 s4").addClass("s3");
        document.getElementById("earthDiv0").style.width="33.3%";
        document.getElementById("earthDiv0").style.height="100%"; 
        document.getElementById("earthDiv1").style.width="33.3%";
        document.getElementById("earthDiv1").style.height="100%"; 
        document.getElementById("earthDiv2").style.width="33.3%";
        document.getElementById("earthDiv2").style.height="100%"; 
        createEarth("earth1", document.getElementById("earthDiv1"), data, projManager, projectId, currentLayerObjList, true);
    }
};

function createEarth3(id, div, data, projManager, projectId, currentLayerObjList){
    var earth = document.createElement("object");
   
    earth.id = id;
    earth.name = id;
    earth.classid = "CLSID:EA3EA17C-5724-4104-94D8-4EECBD352964";
    earth.style.width = "100%";
    earth.style.height = "100%";
    div.appendChild(earth);
    earth.Event.OnCreateEarth = function (searth) {
        earth.Event.OnCreateEarth = function () {};
        parent.earthArray.push(searth);
        searth.Event.OnDocumentChanged = function (){
            searth.Event.OnDocumentChanged = function (){};

            //先隐藏所有的图层 只显示数据库图层
            if(parent.currentPrjGuid){
                var layer = searth.LayerManager.LayerList;
                if(layer){
                    var childCount = layer.GetChildCount();
                    for (var i = 0; i < childCount; i++) {
                        var childLayer = layer.GetChildAt(i);
                        if (childLayer.Guid == parent.currentPrjGuid) {
                            childLayer.Visibility = false;
                        }   
                    }
                }
            }
            
            //这里面就可以获取到earth.LayerManager 及其下属的属性与方法
            if(data && data.length){
                //searth加载数据
                var thirdId = data[2].id;
                var xzId = parent.parcelLayerGuid2;
                //parent.planLayerIDs;
                if(thirdId == xzId){
                    //说明是现状
                    parent.loadXZLayers(true, earth2);
                }else{
                    //说明是方案
                    setTimeout(function(){
                        //earth1 加载方案2图层
                        var layerIDs = projManager.getLayerIdsByPlanId(thirdId);
                        parent.applyRecords(true, layerIDs, earth2, parent.parcelLayerGuid, false);
                    },400);
                }
            }
      
      //cy 20150508 加
       shareDigLayer(searth);
            var pose = getPose(parent.earth);
            searth.GlobeObserver.GotoLookat(pose.longitude, pose.latitude, pose.altitude,
                    pose.heading, pose.tilt, pose.roll, 0);
      
      
        };
        searth.Load(CITYPLAN_config.server.ip, CITYPLAN_config.server.screen);
    //    searth.Environment.SetDatabaseLink(CITYPLAN_config.server.dataServerIP);
    };
}




/**已看
 * 共享开挖地形
 * @return {[type]} [description]
 */
function shareDigLayer(curEarth){
    //开挖图层共享
    if(parent.demObj && parent.demObj.length){
        var guid = curEarth.Factory.CreateGuid();
        var tempDemPath = curEarth.RootPath + "temp\\terr\\terrain\\";
        var rect = parent.demObj[0];
        var levelMin = parent.demObj[1];
        var levelMax = parent.demObj[2];
        var demTempLayer = curEarth.Factory.CreateDEMLayer(guid,
            "TempTerrainLayer",
            tempDemPath,
            rect,
            levelMin,
            levelMax, 1000);
        demTempLayer.Visibility = true;
        curEarth.AttachObject(demTempLayer);
    }
};
/**已看  y

/**已看
 /**
 * 根据id和div容器创建Earth对象，并返回创建的对象
 * @param id
 * @param div
 */
function createEarth(id, div, data, projManager, projectId, currentLayerObjList, isThird) {
    var earth = document.createElement("object");
    
    earth.id = id;
    earth.name = id;
    earth.classid = "CLSID:EA3EA17C-5724-4104-94D8-4EECBD352964";
    earth.style.width = "100%";
    earth.style.height = "100%";
    div.appendChild(earth);
    earth.Event.OnCreateEarth = function (searth) {
        earth.Event.OnCreateEarth = function () {};
        parent.earthArray.push(searth);
        searth.Event.OnDocumentChanged = function (){
            searth.Event.OnDocumentChanged = function (){};
            if(isThird){//创建第三个球
                createEarth3("earth2", document.getElementById("earthDiv2"), data, projManager, projectId, currentLayerObjList);
            }
            //先隐藏所有的图层 只显示数据库图层
            if(parent.currentPrjGuid){
                var layer = searth.LayerManager.LayerList;
                if(layer){
                    var childCount = layer.GetChildCount();
                    for (var i = 0; i < childCount; i++) {
                        var childLayer = layer.GetChildAt(i);
                        if (childLayer.Guid == parent.currentPrjGuid) {
                            childLayer.Visibility = false;
                        }
                    }
                }
            }

            //这里面就可以获取到earth.LayerManager 及其下属的属性与方法
            //控制数据显示
            if(data && data.length){
                //searth加载数据
                var firstId = data[0].id;
                var secordId = data[1].id;
                var xzId = parent.parcelLayerGuid2;
                //parent.planLayerIDs;
                if(firstId == xzId){
                    //第一个是现状


                }else if(secordId == xzId){
                    //加载第一个方案 firstId
                    setTimeout(function(){
                        projManager.showAll(projectId, firstId, true, true, false, false,true);
                    },100);
                    //第二个是现状 secordId 需要把现状数据库图层的都加上即可
                    parent.loadXZLayers(true, earth1);

                }else{
                    //两个都是方案
                    setTimeout(function(){
                        projManager.showAll(projectId, firstId, true, true, false, false,true);
                    },100);

                    setTimeout(function(){
                        //earth1 加载方案2图层
                        var layerIDs = projManager.getLayerIdsByPlanId(secordId);
                        parent.applyRecords(true, layerIDs, earth1, parent.parcelLayerGuid, false);
                    },200);
                }
            }
            shareDigLayer(searth);
            //同步视角
            var pose = getPose(parent.earth);
            searth.GlobeObserver.GotoLookat(pose.longitude, pose.latitude, pose.altitude,
                pose.heading, pose.tilt, pose.roll, 0);

        };
        searth.Load(CITYPLAN_config.server.ip, CITYPLAN_config.server.screen);
    //    searth.Environment.SetDatabaseLink(CITYPLAN_config.server.dataServerIP);
    };
}

var htmlArr=[];
function showPlanData(data,seearth,planData){
    var path = location.pathname.substring(0, location.pathname.lastIndexOf("/"));
    var url = location.protocol + "//" + location.hostname + path +
        "/html/investigate/planData.html?id="+data.id;
    var htmlBalloon = null;
    var guid = seearth.Factory.CreateGuid();
    htmlBalloon = seearth.Factory.CreateHtmlBalloon(guid, "balloon");
    htmlBalloon.SetScreenLocation(0,0);
    htmlBalloon.SetRectSize(290,290);
    htmlBalloon.SetIsAddMargin(true);
    htmlBalloon.SetIsAddBackgroundImage(true);
    htmlBalloon.ShowNavigate(url);
    bollonArr.push(htmlBalloon);
    seearth.Event.OnHtmlNavigateCompleted = function (htmlId){
        htmlArr.push({id:htmlId,obj:htmlBalloon});
        setTimeout(function(){
            htmlBalloon.InvokeScript("setTranScroll", planData);
        },100);
        //earth.Event.OnHtmlNavigateCompleted = function (){};
    };
    seearth.Event.OnHtmlBalloonFinished = function(){
        if(htmlBalloon!=null){
            htmlBalloon.DestroyObject();
            htmlBalloon=null;
        }
        seearth.Event.OnHtmlBalloonFinished = function(){};
    }
}
//已看
function showIndex(tag,planData){
    //earthArray
    if(tag){
        for(var i=0;i<planArr.length;i++){
            showPlanData(planArr[i], parent.earthArray[i],planData);
        }
    } else{
        if(bollonArr&&bollonArr.length>0){
            for(var i=0;i<bollonArr.length;i++){
                if( bollonArr[i].Guid!=""){
                    bollonArr[i].DestroyObject();
                }

            }
        }
        bollonArr = [];
    }

}
/* 设置联动
 * @param bSync 等于true时表示联动
 */
function setSync(bSync) {
    var i = 0;
    var emptyFunction = function () {
    };
    if (bSync) {        //联动
        while (i < parent.earthArray.length) {
            parent.earthArray[i].Event.OnLBDown = setFocus(i);    // 注册每个球的OnLBDown事件【左键】
            parent.earthArray[i].Event.OnMBDown = setFocus(i);    // 注册每个球的OnMBDown事件 【中键】
            i += 1;
        }
        gotoPose(0)();    // 将其他屏定位到第一屏的位置
    } else {
        if(bollonArr&&bollonArr.length>0){
            for(var s=0;s<bollonArr.length;s++){
                if(bollonArr[s].Guid&&bollonArr[s].Guid!=""){
                    bollonArr[s].DestroyObject();
                }
            }

        }
        while (i < parent.earthArray.length) {      // 注销每个球绑定的事件
            parent.earthArray[i].Event.OnLBDown = emptyFunction;
            parent.earthArray[i].Event.OnMBDown = emptyFunction;
            parent.earthArray[i].Event.OnObserverChanged = emptyFunction;
            i += 1;
        }
        gotoPose(0)();    // 将其他屏定位到第一屏的位置
    }
}
/**已看
 * 设置联动
 * 注册当前球的OnObserverChanged事件
 * 注销其他球的OnObserverChanged事件，给其他球的OnLBDown绑定事件，似的在左键点击时称为当前球
 */
function setFocus(i) {
    return function () {
        parent.earthArray[i].Event.OnObserverChanged = gotoPose(i);
        for (var j = 0; j <  parent.earthArray.length; j++) {
            if (i != j) {
                parent.earthArray[j].Event.OnObserverChanged = function () { };
                parent.earthArray[j].Event.OnLBDown = setFocus(j);
                parent.earthArray[j].Event.OnMBDown = setFocus(j);
            }
        }
    };
}
/**已看
 * 将所有非主球都定位到主球i的当前位置
 * @param i
 * @return {Function}
 */
function gotoPose(i) {
    setTimeout(  function () {
        var pose = getPose( parent.earthArray[i]);
        var j = 0;
        while (j <  parent.earthArray.length) {
            if (j != i) {
                parent.earthArray[j].GlobeObserver.GotoLookat(pose.longitude, pose.latitude, pose.altitude,
                    pose.heading, pose.tilt, pose.roll, 0);
            }
            j += 1;
        }
        setFocus(i);
    },500);
    return function () {
        var pose = getPose( parent.earthArray[i]);
        var j = 0;
        while (j <  parent.earthArray.length) {
            if (j != i) {
                parent.earthArray[j].GlobeObserver.GotoLookat(pose.longitude, pose.latitude, pose.altitude,
                    pose.heading, pose.tilt, pose.roll, 4);
            }
            j += 1;
        }
        setFocus(i);
    }
}
/**
 * 获得earthObj的当前位置
 * @param earthObj
 * @return {Object}
 */
function getPose(earthObj) {
    var data = {};
    if (earthObj) {
        data.longitude = earthObj.GlobeObserver.Pose.Longitude;
        data.latitude = earthObj.GlobeObserver.Pose.Latitude;
        data.altitude = earthObj.GlobeObserver.Pose.Altitude;
        data.heading = earthObj.GlobeObserver.Pose.heading;
        data.tilt = earthObj.GlobeObserver.Pose.tilt;
        data.roll = earthObj.GlobeObserver.Pose.roll;
    }
    return data;
}
	/**
	 * 功能：隐藏剖面分析图
	 * 参数：无
	 * 返回值：无
	 */
	function hidenHtmlWindow() {
		seearth.ShapeCreator.Clear();
	    testDiv.style.top = "55%";
	    testDiv.style.display = "none";
	    htmlWin.style.display = "none";
	    earthDiv0.style.height = "100%";
	}
	
	var chart = null; //剖面分析图对象
	var POINTARR = null; //剖面分析数据集
	/**
	 * 功能：显示剖面分析图
	 * 参数：xCategories-X轴标注数字；serieList-剖面图数据序列数组
	 * 返回值：无
	 */
	function showProfileResult(xCategories,serieList,pointArr){
		var v_rate = 1.0;
		var v_height = document.body.clientHeight;
		var v_flag = testDiv.style.top;
		if (v_flag.indexOf("px") == -1) {
			v_rate = parseFloat(v_flag) * 0.01;
		} else {
			v_rate = parseInt(v_flag) / v_height;
		}
		earthDiv0.style.height = v_rate * 100.0 + "%";
		testDiv.style.display = "block";
		var v_htmlwin_top = v_rate * v_height + 12;
		htmlWin.style.top = v_htmlwin_top + "px";
		var v_htmlwin_height = v_height - v_htmlwin_top;
		htmlWin.style.height = v_htmlwin_height + "px";
		htmlWin.style.display = "block";
		
		if(chart != null){
			chart.destroy();
		}
		chart = createChart(xCategories,serieList);
		POINTARR = pointArr;
    }
    
    /**
	 * 功能：创建剖面分析图
	 * 参数：xCategories-X轴标注数字；serieList-剖面图数据序列数组
	 * 返回值：剖面分析图对象
	 */
    function createChart(xCategories,serieList){
    		var minValue = null;
    		var maxValue = null;
    		for(var i=0; i<serieList.length; i++){
    			var dataList = serieList[i].data;
    			for(var k=0; k<dataList.length; k++){
    				var dataValue = dataList[k];
    				if(minValue == null){
    					minValue = dataValue;
    				}else{
	    				if(dataValue < minValue){
	    					minValue = dataValue;
	    				}
    				}
    				if(maxValue == null){
    					maxValue = dataValue;
    				}else{
	    				if(dataValue > maxValue){
	    					maxValue = dataValue;
	    				}
    				}
    			}
    		}
	    	var chart = new Highcharts.Chart({
	            chart: {
	                renderTo: 'htmlWin',
	                reflow: false,
					type: "areaspline",
					zoomType: 'xy', //xy均可以鼠标拖动缩放
					//animation: false, //更新的时候，是否有动画效果。
	                margin: [ 50, 50, 50, 70]
	            },
	            credits: {
	                enabled: false
	            },
	            title: {
	                text: '剖面分析图'
	            },
	            xAxis: {
	                title: {
	                    text: ''
	                },
	                //tickInterval: 10, //控制X轴步长
	                allowDecimals: false, //X轴不允许有小数标值
	                //gridLineWidth: 1,	//X轴网格线宽
	                //categories: xCategories, //X轴标值列表
	                labels: {
	                    rotation: -45,
	                    align: 'right'
	                }
	            },
	            yAxis: {
	                title: {
	                    text: '高程(米)'
	                },
	                //tickInterval: 10,
                	min: minValue,
                	max: maxValue,
                	allowDecimals: false
	            },
	            tooltip: {
	                formatter: function() {	                	
		                if(POINTARR == null){
		                    return;
		                }
		                var index = this.x * 3;
		                var lon = POINTARR[index];
		                var lat = POINTARR[index + 1];
		                var alt = this.y;
		                var formatStr = '<b>样点'+ this.x + ': <br/>';
		                formatStr = formatStr + '经度: ' + lon + '<br/>';
		                formatStr = formatStr + '纬度: ' + lat + '<br/>';
		                formatStr = formatStr + '高程: ' + alt + '</b>';
	                    return formatStr;
	                }
	            },
	            legend: {
	                enabled: false
	            },
	            plotOptions: {
	                series: {
	                	animation: false, //初始化时，是否有动画效果     
	                	cursor: 'pointer',
		                events: {
		                    click: function(e) {
		                    	if(POINTARR == null){
		                    		return;
		                    	}
		                        var index = e.point.x * 3;
		                        var lon = POINTARR[index];
		                        var lat = POINTARR[index + 1];
		                        var alt = e.point.y;
		                        seearth.GlobeObserver.FlytoLookat(lon, lat, alt, 0, 90, 0, 100,5);
		                    }
		                },	                	      	
	                    marker: {
	                        enabled: false,
	                        states: {
	                            hover: {
	                                enabled: true,
	                                radius: 3
	                            }
	                        }
	                    }
	                }
	            },
	            series: serieList,
	            exporting: {
	                enabled: false
	            }
	        });
	        return chart;
	}