
/**
 * 功能：清除测量结果
 * 参数：无
 * 返回值：无
 */
var clearMeasureResult = function(){
	earth.Measure.Clear();
};

/**
 * 功能：显示测量结果
 * 参数：result-测量结果; type-测量类型(1为空间距离测量，2为地表距离测量，3为垂直距离测量，4为投影面积测量，5为水平距离测量)
 * 返回值：无
 */
var bolonArr = [];
var showMeasureResult = function(result, type){
	/*if(result == 0){
		clearMeasureResult();
		return;
	}*/
	var unit = "";
	var title = "";
	if(type === 4){  //投影面积测量
		unit = "平方千米";
	    if( result < 1 ) {
	    	result = result * 1000000;
			unit = "平方米";
		}
	    title = "水平面积为：";
	}else if(type >= 300 && type <400 ){
        unit = "米";
        if(type === 300){
            title = "管线相交,管间水平距离为：";
        }else if(type === 301){
            title = " 管线不相交, 管间水平距离为：";
        } else if(type === 302){
            title = " 管线相交,管间垂直距离为：";
        } else if(type === 303){
            title = " 管线不相交,管间垂直距离为：";
        } else if(type === 304){
            title = " 管间空间距离为：";
        }
    }else if(type === 400){
        unit = "度";
        title  = "平面角度：";
    }else if(type === 401){
        unit = "平方米";
        title = "地表面积：";
    } else{ //其它测量
        unit = "千米";
        if( result < 1 ) {
            result = result * 1000;
            unit = "米";
        }
        if(type === 1){
            title = "空间距离为：";
        }else if(type === 2){
            title = "地表距离为：";
        }if(type === 3){
            title = "垂直距离为：";
        }if(type === 5){
            title ="水平距离为：";
        }
    }
	result = result.toFixed(3);
	var resultVal = title + result + unit; //style='background-color: #404040; color: #ffffff; font-weight: bold; margin: 0; padding: 2px;'


//    var html = "<html><body style='background-color: #ffffff; color: #000000;  '>" +
//        "<div style='position:absolute;top:20%;text-align:center;  font-size:15px;' ><span>" +
//        resultVal + "</span></div></body></html>";

    var html = "<html><body style='background-color: #ffffff; color: #000000;  '>" +
        "<div style='width:100%;height:100%;text-align:center;  vertical-align:middle;font-size:15px;' ><span>" +
        resultVal + "</span></div></body></html>";
    //earth.HtmlBalloon.Transparence = true;
    var id = earth.Factory.CreateGuid();
    htmlBal = earth.Factory.CreateHtmlBalloon(id, "量算窗体");
    htmlBal.SetScreenLocation(0,0);
    htmlBal.SetRectSize(320,150);
    var color = parseInt("0xccc0c0c0");//0xccc0c0c0 //e4e4e4 //0xcc4d514a
    htmlBal.SetTailColor(color);
    htmlBal.SetIsAddCloseButton(true);
    htmlBal.SetIsAddMargin(true);
    htmlBal.SetIsAddBackgroundImage(true);
    htmlBal.SetIsTransparence(false);
    htmlBal.ShowHtml(html);






    bolonArr.push(htmlBal) ;
    earth.Event.OnHtmlBalloonFinished= function () {
        hideBollon();
        clearMeasureResult();
        if(resultRes){
            resultRes.ClearRes();
            earth.ShapeCreator.Clear();
        }
        earth.Event.OnHtmlBalloonFinished= function () {};
    };
    // measureOperCancel();
};

/**
 * 功能：点击鼠标右键取消分析/测量操作
 * 参数：无
 * 返回值：无
 */
var measureOperCancel = function(){
    
	earth.Event.OnRBDown = function(){
		earth.ShapeCreator.Clear();
		earth.Event.OnRBDown = function(){};
	};
};
var hideBollon = function (){
	if (parent.transparencyBalloons != null){
        parent.transparencyBalloons.DestroyObject();
        parent.transparencyBalloons = null;
    }
    if(bolonArr.length>0){
       for(var i=0;i< bolonArr.length;i++){
           bolonArr[i].DestroyObject();
       }
    }
    if(resultRes){
        resultRes.ClearRes();
        earth.ShapeCreator.Clear();
    }
}
/**
 * 功能：“水平距离”菜单点击事件
 * 参数：无
 * 返回：无
 */
var horizontalDisClick = function(){
    hideBollon();
	earth.Event.OnMeasureFinish = showMeasureResult;
    setTimeout(function(){
        earth.Measure.MeasureHorizontalDistance();
    },100);


	//measureOperCancel();
};

/**
 * 功能：“垂直距离”菜单点击事件
 * 参数：无
 * 返回：无
 */
var verticalDisClick = function(){
    hideBollon();
	earth.Event.OnMeasureFinish = showMeasureResult;

    setTimeout(function(){
        earth.Measure.MeasureHeight();
    },100);

    //measureOperCancel();
};

/**
 * 功能：“空间距离”菜单点击事件
 * 参数：无
 * 返回：无
 */
var spaceDisClick = function(){
    hideBollon();
	earth.Event.OnMeasureFinish = showMeasureResult;

    setTimeout(function(){
        earth.Measure.MeasureLineLength();
    },100);

    //measureOperCancel();
};

/**
 * 功能：“楼间距”菜单点击事件
 * 参数：无
 * 返回：无
 */
var FloorToFloor_Click = function(){
    if($("#FloorToFloor").attr("disabled")=="disabled"){
        return;
    }
    var analysis =   CITYPLAN.Analysis(earth);
    analysis.buidTobuid();

};



/**
 * 功能：“地表距离”菜单点击事件
 * 参数：无
 * 返回：无
 */
var surfaceDisClick = function(){
    hideBollon();
	earth.Event.OnMeasureFinish = showMeasureResult;

    setTimeout(function(){
        earth.Measure.MeasurePathLength();
    },100);

    //measureOperCancel();
};

/**
 * 功能：“水平面积”菜单点击事件
 * 参数：无
 * 返回：无
 */
var flatAreaClick = function(){
    hideBollon();
	earth.Event.OnMeasureFinish = showMeasureResult;
    setTimeout(function(){
        earth.Measure.MeasureArea();
    },100);

	//measureOperCancel();
};
/**
 * 功能：“地表面积”菜单点击事件
 * 参数：无
 * 返回：无
 */
var resultRes = null;
var surfaceAreaClick = function(){
    hideBollon();
    earth.Event.OnCreateGeometry = function(pval,type){
        earth.Event.OnAnalysisFinished = function (result) {
            resultRes = result;
            earth.ShapeCreator.Clear();
            showMeasureResult(result.TerrainSurfaceArea,401);
        };
        earth.Analysis.SurfaceArea(pval);

        //measureOperCancel();

        earth.Event.OnCreateGeometry = function(){};
    };
    setTimeout(function(){
        earth.ShapeCreator.CreatePolygon();
    },100);


};

/**
 * 功能：初始化分析服务
 * 参数：无
 * 返回值：无
 */
//var initAnalysisServer = function(){
//    hideBollon();
//	var analysisServer = window.ifEarth.params.ip;
//	earth.Analysis.AnalysisServer = analysisServer;
////	earth.Analysis.Synchronization = false;
//	earth.Event.OnAnalysisFinished = showAnalysisResult;
//};


/**
 * 功能：“平面角度”菜单点击事件
 * 参数：无
 * 返回：无
 */
//var mPlaneAngleClick = function(){
//    hideBollon();
//    earth.Event.OnMeasureFinish = function (pval, type) {
//        var showResult = "平面角度:" + pval+"度";
//        showMeasureResult(pval,400);
//        earth.Event.OnMeasureFinish = function () { };
//    };
//    setTimeout(function(){
//        earth.Measure.MeasurePlaneAngle();  // 平面角度
//    },100);
//
//};