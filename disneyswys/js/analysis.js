/**
 * User: wyh
 * Date: 12-12-18
 * Time: 上午10:17
 * Desc:
 */
if (!CITYPLAN) {
    var CITYPLAN = {};
}

CITYPLAN.Analysis = function (earth) {
    var isCreated = false;
    var analysis = {};
    var _result = null;      // 分析结果
    var _tempLayer = null;   // 临时地形图层
    var _tempModel = null;   // 临时填挖模型

    /**
     * 清除临时结果：绘制的辅助线、测量结果和分析结果
     */
    // var lightsightClear=false;
    // var clearLinesight=function(){
    //     lightsightClear=true;
    //     clear();
    // }
    var resArr=[];
    var clear = function () {

        if(earth === ""||earth === undefined){
            return;
        }
        if(earth.ShapeCreator){
            earth.ShapeCreator.Clear();
        }
        earth.Measure.Clear();
        earth.TerrainManager.ClearTempLayer();
//        hideBollon();

        if (_result) {
            _result.ClearRes();
        }
        if (lightSightRes.length!=0) {
            for(var i=0;i<lightSightRes.length;i++){
                lightSightRes[i].ClearRes();
            }
            lightSightRes = [];
        }
        if (_tempLayer) {
            earth.DetachObject(_tempLayer);
        }
        if (_tempModel) {
            earth.DetachObject(_tempModel);
        }
    };

    var hideBollon = function (){
        //量算窗体气泡
        // if(bolonArr && bolonArr.length>0){
        //     for(var i=0;i< bolonArr.length;i++){
        //         bolonArr[i].DestroyObject();
        //     }
        // }
        // //量算窗体内绘制的点线面要素对象
        // if(AnalineObj){
        //     earth.DetachObject(AnalineObj);
        //     AnalineObj = null;
        // }
        // bolonArr =[];
    }
    var showMoveHtml = function(anaLysisChk){
        earth.Event.OnHtmlNavigateCompleted = function (){};
        var loaclUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
        var url = "";
        var width =280,height = 220;

        if(anaLysisChk=="importUSB4"){
            width = 700;
            height =400;

            url=loaclUrl+"/importUSB4.html";
            title="导入BIM模型";
        }
        if(url==""){
            return;
        }
        if (parent.picturesBalloons != null){
            parent.picturesBalloons.DestroyObject();
            parent.picturesBalloonsHidden = false;
            parent.picturesBalloons = null;
        }
        if (parent.transparencyBalloons != null){
            if(parent.transparencyBalloons.Name != "transparency"){
                parent.transparencyBalloons.DestroyObject();
                parent.transparencyBalloonsHidden = false;
                parent.transparencyBalloons = null;
            }
        }
        if(parent.htmlBalloonXY!=null){
            parent.htmlBalloonXY.DestroyObject();
            parent.htmlBalloonXYHidden = false;
            parent.htmlBalloonXY=null;
        }
        if ( parent.htmlBalloonMove != null){
            parent.htmlBalloonMove.DestroyObject();
            parent.htmlBalloonMoveHidden = false;
            parent.htmlBalloonMove = null;
        }
        parent.htmlBalloonMove = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), "屏幕坐标窗体");
        parent.htmlBalloonMove.SetScreenLocation(0,0);//earth.offsetHeight
        parent.htmlBalloonMove.SetRectSize(width,height);
        parent.htmlBalloonMove.SetIsAddBackgroundImage(false);
        parent.htmlBalloonMove.ShowNavigate(url);
        earth.Event.OnDocumentReadyCompleted = function (guid){
            earth.htmlBallon =parent.htmlBalloonMove;
            earth.analysisObj = CITYPLAN.Analysis(earth);
            earth.ifEarth = window.frames.ifEarth;
            earth.userdataTemp=parent.userdataTemp;
            earth.spatial=CITYPLAN_config.spatial;
//            earth.userdataTree=parent.$.fn.zTree.getZTreeObj("userdataTree");
            earth.addEditLayer = parent.addEditLayer;
            earth.editLayerName = parent.editLayerName;
            earth.params = CITYPLAN_config.server;

            earth._BIMaddEditLayer = _BIMaddEditLayer;
           // earth._initImportTree = parent._initImportTree;
            earth.BIMeditLayerList = BIMeditLayerList;
            earth.BIMeditLayerPositionList = BIMeditLayerPositionList;
            //htmlBapdatelloonMove.InvokeScript("getEarth", earth);
            //earth.Event.OnHtmlNavigateCompleted = function (){};
            if(parent.htmlBalloonMove === null){
                return;
            }
            if (parent.htmlBalloonMove.Guid == guid){
                parent.htmlBalloonMove.InvokeScript("getEarth", earth);
                //htmlBalloonMove.InvokeScript("getAnalysis", STAMP.Analysis(earth));
            }
        };
        earth.Event.OnHtmlBalloonFinished = function(id){
            if (parent.htmlBalloonMoveHidden == false && parent.htmlBalloonMove != null && id===parent.htmlBalloonMove.Guid){
                parent.htmlBalloonMove.DestroyObject();
                parent.htmlBalloonMove = null;
                earth.Event.OnHtmlBalloonFinished = function(){};
            }
        };
    };
    var showMoveHtml2222 = function(anaLysisChk){
         earth.Event.OnHtmlNavigateCompleted = function (){};
         var loaclUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
         var url = "";
        var title=""
         var width =260,height = 200;
          if(anaLysisChk=="importUSB4"){
            width = 700;
            height = 350;

            url=loaclUrl+"/html/Bim/importUSB4.html";
            title="导入BIM模型";
        }
// else if(anaLysisChk === "mShinning"){
//             url = loaclUrl + "/html/analysis/shinning.html";
//         } else if(anaLysisChk === "mViewshed"){
//             url = loaclUrl + "/html/analysis/viewshed.html";
//         } else if(anaLysisChk === "mSkyline"){
//             url = loaclUrl + "/html/analysis/skyline.html";
//         } else if(anaLysisChk === ""){
//             url = loaclUrl + "/html/analysis/shinning.html";
//         } else if(anaLysisChk === "mFixedObserver"){
//             url = loaclUrl + "/html/analysis/pointview.html";
//             height=160;
//         } else if(anaLysisChk === "mExcavationAndFill"){
//             url = loaclUrl + "/html/analysis/excavationAndFill.html";
//         }else if(anaLysisChk === "submerge"){
//             url = loaclUrl + "/html/analysis/submerge.html";
//             width=285;
//         }else if(anaLysisChk === "valley"){
//             url = loaclUrl + "/html/analysis/valley.html";
//         }else if(anaLysisChk === "bestPath"){
//             url = loaclUrl + "/html/analysis/best_path.html";
//         } else if(anaLysisChk === "profile"){
//             url = loaclUrl + "/html/analysis/profile.html";
//             height=160;
//         }else if(anaLysisChk === "importVector"){ //导入导出
//             url = loaclUrl + "/html/userdata/importVector.html";
//         }else if(anaLysisChk === "exportSHP"){
//             url = loaclUrl + "/html/userdata/exportSHP.html";
//         }else if(anaLysisChk === "terrainSmooth"){
//             url = loaclUrl + "/html/userdata/terrainSmooth.html";
//             height=170;
//         }else if(anaLysisChk === "impBuilding2"){
//             url = loaclUrl + "/html/scene/importBuilding.html";
//             height = 250;
//         }else if(anaLysisChk === "impModel2"){
//             url = loaclUrl + "/html/scene/importUSB.html";
//             height = 170;
//         } else if(anaLysisChk === "exportObj"){
//             url = loaclUrl + "/html/userdata/exportObj.html";
//             height = 210;
//         } else if(anaLysisChk === "coordlocation"){
//             url = loaclUrl + "/html/search/coordLocation.html";
//             width = 270;
//         }
         if(url===""){
             return;
         }
         if (parent.picturesBalloons != null){
             parent.picturesBalloons.DestroyObject();
             parent.picturesBalloons = null;
         }
         if (parent.transparencyBalloons != null){
             parent.transparencyBalloons.DestroyObject();
             parent.transparencyBalloons = null;
         }
         // if(parent.htmlBalloonXY!=null){
         //     parent.htmlBalloonXY.DestroyObject();
         //     parent.htmlBalloonXY=null;
         // }
         if (htmlBalloonMove != null){
             htmlBalloonMove.DestroyObject();
             htmlBalloonMove = null;
         }
         htmlBalloonMove = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), "屏幕坐标窗体");
         htmlBalloonMove.SetScreenLocation(0,0);//earth.offsetHeight
         htmlBalloonMove.SetRectSize(width,height);
         htmlBalloonMove.SetIsAddBackgroundImage(false);
         htmlBalloonMove.ShowNavigate(url);
         earth.Event.OnDocumentReadyCompleted = function (guid){
             earth.htmlBallon =htmlBalloonMove;
             earth.ifEarth = window.frames.ifEarth;
             earth.analysis = CITYPLAN.Analysis(earth);
             earth.userdataTree=parent.$.fn.zTree.getZTreeObj("userdataTree");
             if(htmlBalloonMove === null){
                 return;
             }
             earth.currentLayer = currentLayerObjs;
             if(htmlBalloonMove.Guid == guid){
                 htmlBalloonMove.InvokeScript("getEarth", earth);
             }
         };
         earth.Event.OnHtmlBalloonFinished = function(id){
             if (htmlBalloonMove != null&&id===htmlBalloonMove.Guid){
                 htmlBalloonMove.DestroyObject();
                 htmlBalloonMove = null;
                 earth.Event.OnHtmlBalloonFinished = function(){};
             }
         };
    };

    /**
     * 测量结果格式化，保留三位有效数字
     */
    var _parseMeasureResult = function (mtype,result, type) {
        var unit = "";
        var resultHeader="";
        if(mtype == "HorizontalDistance" ){
            resultHeader = "水平距离";
        }else if(mtype == "Height" ){
            resultHeader = "垂直距离";
        }else if(mtype == "Area" ){
            resultHeader = "水平面积";
        }else if(mtype == "SpatialArea" ){
            resultHeader = "空间面积";
        }else if(mtype == "VerticalArea" ){
            resultHeader = "立面面积";
        }else if(mtype == "PathLength" ){
            resultHeader = "地表距离";
        }else if(mtype == "PlaneAngle" ){
            resultHeader = "平面角度";
        }else if(mtype == "LineLength" ){
            resultHeader = "空间距离";
        }
        if (type === 9) { // 角度
            unit = "度";
        } else if (type === 4 || type === 7 || type === 8) {  //投影面积测量、空间面积、立面面积
            unit = "平方千米";
            if (result < 1) {
                result = result * 1000000;
                unit = "平方米";
            }
        } else { //其它测量
            unit = "千米";
            if (result < 1) {
                result = result * 1000;
                unit = "米";
            }
        }
        return resultVal =resultHeader+ "：" + result.toFixed(3) + unit;
    };
    /**
     * 在球上以HtmlBalloon的形式显示测量结果
     */
    var _showMeasureResult = function (resultVal) {
//        var html = "<html><body style='color: #fffffe; font-weight: bold; margin: 0; padding: 2px;'><p style='text-align:center;margin-top:30px;]' >" +
//            result + "</p></body></html>";
//        var id = earth.Factory.CreateGuid();
//        var htmlBal = earth.Factory.CreateHtmlBalloon(id, "量算窗体");
//        htmlBal.SetScreenLocation(0,0);
//        htmlBal.SetRectSize(250,150);
//        htmlBal.SetIsAddCloseButton(true);
//        htmlBal.SetIsAddMargin(true);
//        htmlBal.SetIsAddBackgroundImage(true);
//        htmlBal.SetIsTransparence(true);
//        htmlBal.SetBackgroundAlpha(0);



        var html = "<html><body style='background-color: #ffffff; color: #000000;  '>" +
            "<div style='width:100%;height:100%;text-align:center;  vertical-align:middle;font-size:15px;' ><span>" +
            resultVal + "</span></div></body></html>";
        //earth.HtmlBalloon.Transparence = true;
        var id = earth.Factory.CreateGuid();
        var   htmlBal = earth.Factory.CreateHtmlBalloon(id, "量算窗体");
        htmlBal.SetScreenLocation(0,0);
        htmlBal.SetRectSize(250,150);
        var color = parseInt("0xccc0c0c0");//0xccc0c0c0 //e4e4e4 //0xcc4d514a
        htmlBal.SetTailColor(color);
        htmlBal.SetIsAddCloseButton(true);
        htmlBal.SetIsAddMargin(true);
        htmlBal.SetIsAddBackgroundImage(true);
        htmlBal.SetIsTransparence(false);




        htmlBal.ShowHtml(html);
        bolonArr.push(htmlBal);









    };

    /**
     * 测量：水平、垂直、空间距离，平面面积
     * @param earth
     * @param measureType
     * @param callback 测量完成回调函数，如果为空，调用默认的回调函数，将测量结果在球上输出
     */
    var measure = function (measureType, callback) {
        hideBollon();
        earth.Event.OnMeasureFinish = function (result, type) {
            earth.ShapeCreator.Clear();
            if (callback && typeof callback == "function") {
                callback(_parseMeasureResult(measureType,result, type));
            } else {
                _showMeasureResult(_parseMeasureResult(measureType,result, type));
            }
            earth.Event.OnHtmlBalloonFinished= function () {
                clear();
            };
            earth.Event.OnMeasureFinish = function () {};
        };
        setTimeout(function(){ //延迟否则与OnHtmlBalloonFinished冲突
            switch (measureType) {
                case "HorizontalDistance"://水平距离
                    earth.Measure.MeasureHorizontalDistance();
                    break;
                case "Height":
                    earth.Measure.MeasureHeight();
                    break;
                case "Area":
                    earth.Measure.MeasureArea();
                    break;
                case "SpatialArea":
                    earth.Measure.MeasureSpatialArea();
                    break;
                case "VerticalArea":
                    earth.Measure.MeasureVerticalArea();
                    break;
                case "PathLength":
                    earth.Measure.MeasurePathLength();  // 球面距离
                    break;
                case "LineLength":
                    earth.Measure.MeasureLineLength();  // 直线距离
                    break;
                case "PlaneAngle":
                    earth.Measure.MeasurePlaneAngle();  // 平面角度
                    break;
            }
        },100);

    };
    /**
     * 坡度测量：计算两点之间的坡度和坡角
     */
    var measureSlope = function (callback) {
        _clear();
        hideBollon();
        earth.Event.OnCreateGeometry = function (pFeat) {
            var height = earth.GeometryAlgorithm.CalcHeight(pFeat);
            var length = earth.GeometryAlgorithm.CalculatePolylineLength(pFeat);
            var slope = height / (Math.sqrt(length * length - height * height));
            var angle = Math.atan(slope) * 180 / Math.PI;
            var result = "坡度：" + slope.toFixed(3) + "；坡角：" + angle.toFixed(1) + "°";
            if (callback && typeof callback == "function") {
                callback(result);
            } else {
                _showMeasureResult(result);
            }
        };
        setTimeout(function(){ //延迟否则与OnHtmlBalloonFinished冲突
            earth.ShapeCreator.CreateLine();
        },100);
    };

    /**
     * 通视分析
     * @param startHeight 视线起点高度
     * @param endHeight 视线终点高度
     */
    var  lightSightRes=[]; //存放分析res数组f ，右键取消显示高度会生成res
    var lineOfSight = function (startHeight, endHeight,analysisTag, btnAry) {
        clear();
        if (lightSightRes.length!=0) {
            for(var i=0;i<lightSightRes.length;i++){
                lightSightRes[i].ClearRes();
            }
            lightSightRes = [];
        }
        earth.Event.OnAnalysisFinished = function (res) {
            //_result = res;
            lightSightRes.push(res);
            resArr.push(res);
            for (var i = btnAry.length - 1; i >= 0; i--) {
                btnAry[i].removeAttr("disabled");
            };
        };
        var lineArr=[];
        earth.Event.OnCreateGeometry = function (p, cType) {
            // earth.Event.OnRBDown = function () {
            // };
            if(p.Count<2){
                for (var i = btnAry.length - 1; i >= 0; i--) {
                    btnAry[i].removeAttr("disabled");
                };
            }
            lineArr.push(p);
            earth.ShapeCreator.Clear();
            var type  = 3;
            if(analysisTag === "checked"){
                type = 2;
                //这里要开启现状图层的编辑状态
                if(earth.currentLayer && earth.currentLayer.length){
                    for (var i = earth.currentLayer.length - 1; i >= 0; i--) {
                        var editLayer = earth.currentLayer[i];
                        if(editLayer){
                            editLayer.Analyzable = false;
                            editLayer.Intersectable = false;
                        }
                    };
                }
            }else{
                //这里要关闭现状图层的编辑状态
                if(earth.currentLayer && earth.currentLayer.length){
                    for (var i = earth.currentLayer.length - 1; i >= 0; i--) {
                        var editLayer = earth.currentLayer[i];
                        if(editLayer){
                            editLayer.Analyzable = true;
                            editLayer.Intersectable = true;
                        }
                    };
                }
            }
            earth.Analysis.LineSight(3, parseFloat(startHeight), parseFloat(endHeight),lineArr[0],type); //最后参数：1代表只进行服务端分析，2代表只进行本地分析，3代表二者都参与
        };
        earth.ShapeCreator.CreateLine();
    };
    /**
     * 通视控高
     */
    var showHeightLine = function () {
        if (lightSightRes[0] && lightSightRes[0].LineSightRes) {
            earth.ShapeCreator.HeightLimit(lightSightRes[0].LineSightRes);
            /*  earth.Event.OnRBDown = function (){
             earth.Event.OnRBDown = function (){};
             earth.ShapeCreator.Clear();
             };*/
        }
    };
    /**
     * 视域分析
     * @param type 类型
     * @param angle 视域角度
     * @param height 视点高度
     */
    var sp = null;
    var st = 3;
    var viewShedPolygon=function(angle,analysisTag, btn){
        clear();
        earth.Event.OnCreateGeometry = function (p, cType) {
            var type = 3;
            if(analysisTag === "checked"){
                type = 2;
                //这里要开启现状图层的编辑状态
                if(earth.currentLayer && earth.currentLayer.length){
                    for (var i = earth.currentLayer.length - 1; i >= 0; i--) {
                        var editLayer = earth.currentLayer[i];
                        if(editLayer){
                            editLayer.Analyzable = false;
                        }
                    };
                }
            }else{
                //这里要关闭现状图层的编辑状态
                if(earth.currentLayer && earth.currentLayer.length){
                    for (var i = earth.currentLayer.length - 1; i >= 0; i--) {
                        var editLayer = earth.currentLayer[i];
                        if(editLayer){
                            editLayer.Analyzable = true;
                        }
                    };
                }
            }
            btn.removeAttr("disabled");
            //$("evtTarget").trigger("myClick", ["a","b"]);
            // isCreated = true;
            sp = p;
            st = type;
        };
        earth.ShapeCreator.CreateSector(angle);
    }
//    var viewShed = function (type, angle, height, btnAry) {
//        // clear();
//        earth.ShapeCreator.Clear();
//        earth.Event.OnAnalysisFinished = function (res) {
//            if(!earth.htmlBallon.Guid){
//                res.ClearRes();
//            }
//            _result = res;
//            resArr.push(res);
//            if(earth.htmlBallon.Guid){
//                for (var i = btnAry.length - 1; i >= 0; i--) {
//                    btnAry[i].removeAttr("disabled") ;
//                };
//            }
//        };
//        if(sp){
//            earth.Analysis.ViewShed(st, angle, height, sp,st);
//        }
//    };
//

    /**
     * 视域分析
     */
    var viewShed = function (type, angle, height,btn) {


        clear();
        earth.Event.OnAnalysisFinished = function (res) {
            //cy：删除
//            if(earth.htmlBallon!=null) {
//            if(earth.htmlBallon.Guid){
                _result = res;
                resArr.push(res);
                for(var i=0; i<btn.length;i++){
                    btn[i].removeAttr("disabled") ;
                }
//            }
//            }
//            else{
//                clear();
//                res.ClearRes();
//                _result = null;
//                resArr = [];
//            }
        };
        earth.Event.OnCreateGeometry = function (p, cType) {
            earth.ShapeCreator.Clear();
            earth.Analysis.ViewShed(type, angle, height, p,3);
        };
        earth.ShapeCreator.CreateSector(angle);
    };
    /**
     * 定点观察
     */
    var fixedObserver = function (height) {
        clear();
        earth.Event.OnCreateGeometry = function (pose) {
            earth.ShapeCreator.Clear();
            earth.Event.OnFixedPointObserveFinished = function () {
                clear();
                $("#btnStop").attr("disabled","disabled");
                $("#btnStart").removeAttr("disabled");
                $("#height").removeAttr("disabled");
            };
            earth.GlobeObserver.FixedPointObserve(pose.Longitude, pose.Latitude,pose.Altitude, pose.heading, pose.tilt, pose.roll);
            //$("#btnStart").attr("disabled","disabled");
            $("#btnStop").removeAttr("disabled");
            earth.Event.OnCreateGeometry = function () {
            };
        };
        earth.ShapeCreator.createPose(height);
    };
    /**
     * 天际线分析
     */
    var skyline = function (type,height,dis, btnary) {
        clear();
        earth.Event.OnCreateGeometry = function (line) {
            earth.Event.OnFixedPointObserveFinished = function () {
                //右键操作后触发这里.
                clear();
                if(earth.htmlBallon.Guid){
                     btnary[0].removeAttr("disabled");
                    btnary[1].removeAttr("disabled");
                    btnary[2].attr("disabled","disabled");
                    //btnary[3].removeAttr("disabled");
                    btnary[3].removeAttr("disabled");
                    btnary[4].removeAttr("disabled");
                    btnary[5].removeAttr("disabled");
                }
                earth.Event.OnFixedPointObserveFinished = function () {};
            }
            earth.ShapeCreator.Clear();
            earth.GlobeObserver.FixedPointObserveEx(line.GetPointAt(0), line.GetPointAt(1), height, dis, type);
            btnary[0].attr("disabled","disabled") ;
            btnary[1].attr("disabled","disabled") ;
            btnary[2].removeAttr("disabled");
            earth.Event.OnCreateGeometry = function () {
            };
        };
        earth.ShapeCreator.CreateLine();
    };
    /**
     * 阴影分析
     * @param tz 时区
     * @param d 日期
     * @param t 时间
     * @param tag 判断是否动态分析()
     */
    var shinning = function (tz, d, t, circle,analysisTag) {
        clear();
        var currDateArr = d.split("-");
        var currTimeArr = t.split(":");
        // 根据日期和时间、地点计算太阳高度角和方位角
        var vector2 = earth.GeometryAlgorithm.CalculateSunElevationAndAzimuthAngle(tz,
            currDateArr[0], currDateArr[1], currDateArr[2],
            currTimeArr[0], currTimeArr[1], currTimeArr[2],
            circle.Longitude, circle.Latitude);
        var elevationAngle = vector2.X;
        var azimuthAngle = vector2.Y;
        if (elevationAngle && azimuthAngle){
    //        earth.Analysis.Synchronization = false;
            var type = 3;
            if(analysisTag === "checked"){
                type = 2;
                //这里要开启现状图层的编辑状态
                if(earth.currentLayer && earth.currentLayer.length){
                    for (var i = earth.currentLayer.length - 1; i >= 0; i--) {
                        var editLayer = earth.currentLayer[i];
                        if(editLayer){
                            editLayer.Analyzable = false;
                        }
                    };
                }
            }else{
                //这里要关闭现状图层的编辑状态
                if(earth.currentLayer && earth.currentLayer.length){
                    for (var i = earth.currentLayer.length - 1; i >= 0; i--) {
                        var editLayer = earth.currentLayer[i];
                        if(editLayer){
                            editLayer.Analyzable = true;
                        }
                    };
                }
            }
            earth.Analysis.Shinning(elevationAngle, azimuthAngle, circle,type);
        }
    };
    var getDateTime = function(date1,time1,step){
        var dates = date1.split("-");
        var times = time1.split(":");
        var curDate = new Date(dates[0],dates[1]-1,dates[2],times[0],times[1],times[2]);
        curDate.setTime(curDate.getTime() + step * 60 * 1000);
        var year = curDate.getFullYear();
        var month = curDate.getMonth()+1;
        var day = curDate.getDate();
        var hour = curDate.getHours();
        var minute = curDate.getMinutes();
        var second = curDate.getSeconds();
        var obj ={
            d:year + "-" + month + "-" + day,
            t:hour + ":" + minute + ":" + second
        }
        return obj;
        //$("#timeSlider").slider({value:(hour-8)*60+minute});
    };
    /**
     * 太阳
     * @param d 日期
     * @param t 时间
     */
    var sun = function ( d, t) {
        clear();
        earth.Event.OnAnalysisFinished = function (res) {
            _result = res;
            resArr.push(res);
        };
        var pose = earth.GlobeObserver.Pose;
        var currDateArr = d.split("-");
        var currTimeArr = t.split(":");
        // 根据日期和时间、地点计算太阳高度角和方位角
        var vector2 = earth.GeometryAlgorithm.CalculateSunElevationAndAzimuthAngle(8,
            currDateArr[0], currDateArr[1], currDateArr[2],
            currTimeArr[0], currTimeArr[1], currTimeArr[2],
            earth.GlobeObserver.TargetPose.Longitude,earth.GlobeObserver.TargetPose.Latitude);
        var elevationAngle = vector2.X;
        var azimuthAngle = vector2.Y;
        if (elevationAngle && azimuthAngle){
            if(elevationAngle >= 0 && elevationAngle <= 180){
                //alert(elevationAngle + " " + azimuthAngle);
                earth.Analysis.BeginShinLightAnaLysis(elevationAngle, azimuthAngle);
            } else{
                earth.Analysis.EndShinLightAnaLysis();
            }
        }
    };
    /**
     * 获取高程
     */
    var getAltitude = function (callback) {
        earth.Event.OnCreateGeometry = function (pval) {
            if(pval === null){
                return;
            }
            var a = earth.GlobeObserver.PickTerrain(pval.Altitude.Longitude,pval.Altitude.latitude).Altitude;
            callback(a.toFixed(3));
            earth.Event.OnCreateGeometry = function () {
            };
            earth.ShapeCreator.Clear();
        };
        earth.ShapeCreator.CreatePoint();
    };
    /**
     * 创建临时地形图层
     */
    var _createNewLayer = function () {
        var tempDemPath = earth.Environment.RootPath + "\\temp\\terrain\\";
        var rect = earth.TerrainManager.GetTempLayerRect();
        var levelMin = earth.TerrainManager.GetTempLayerMinLevel();
        var levelMax = earth.TerrainManager.GetTempLayerMaxLevel();
        var guid = earth.Factory.CreateGUID();

        _tempLayer = earth.Factory.CreateDemLayer(guid, "TempTerrainLayer", tempDemPath, rect, levelMin, levelMax, 1000);
        earth.AttachObject(_tempLayer);
    };
    /**
     * 生成边缘模型
     */
    var _createClipModel = function (args) {
        var modelGuid = earth.Factory.CreateGUID();
        var sideTexturePath = "";//earth.Environment.RootPath + "res\\wall.png";
        var sampArgs = earth.TerrainManager.GenerateSampledCoordinates(args);
        _tempModel = earth.TerrainManager.GenerateClipModel(modelGuid, "ClipModel", args, sampArgs, sideTexturePath, sideTexturePath);
        earth.AttachObject(_tempModel);
    };
    var _createEcavAndFillLayer = function (args, alt,checked) {
        var terrainArgs = earth.Factory.CreateVector3s();
        for (var i = 0; i < args.Count; i++) {
            var argsItem = args.Items(i);
            terrainArgs.Add(argsItem.X, argsItem.Y, alt);
        }

        earth.TerrainManager.SetMinClipLevel(11);
        earth.TerrainManager.ClipTerrainByPolygon(terrainArgs);

        // 创建图层
        _createNewLayer();
        if(checked){
            _createClipModel(terrainArgs);
        }
    };
    /**
     * 挖填方分析
     */
    var excavationAndFill = function (alt,checked, callback) {
        clear();
        earth.Event.OnCreateGeometry = function (pval, type) {
            if (pval.Count < 3) {
                $("#getAltBtn").removeAttr("disabled") ;
                $("#altitude").removeAttr("disabled") ;
                $("#btnStart").removeAttr("disabled") ;
                $("#checkDiv").removeAttr("disabled") ;
                $("#altitudeGround").removeAttr("disabled")
                return;
            }

            earth.Event.OnAnalysisFinished = function (result, alt) {
                // $("#btnStart").attr("disabled","disabled") ;
                var res = "挖方：" + result.Excavation.toFixed(2) + "m<sup>3</sup>; " +"</br>"+ " 填方：" + result.Fill.toFixed(2) + "m<sup>3</sup>";
                _result = result;
                var wf = result.Excavation.toFixed(2) + "立方米"
                $("#wafang").text(wf);
                $("#tianfang").text(result.Fill.toFixed(2) + "立方米");
                //_clear();
                $("#getAltBtn").removeAttr("disabled") ;
                $("#altitude").removeAttr("disabled") ;
                $("#btnStart").removeAttr("disabled") ;
                $("#checkDiv").removeAttr("disabled") ;
                $("#altitudeGround").removeAttr("disabled") ;
                earth.ShapeCreator.Clear();
                if (callback) {
                    callback(res);
                } else {
                    //_showMeasureResult(res);
                }
            };
            _createEcavAndFillLayer(pval, alt,checked);
            earth.Analysis.SurfaceExcavationAndFill(alt, pval);
            earth.Event.OnCreateGeometry = function () {
            };
            //earth.Event.OnAnalysisFinished = function(){};
        };
        setTimeout(function (){ //延迟调用否则与OnHtmlBalloonFinished冲突f
            earth.ShapeCreator.CreatePolygon();
        },100);
        //earth.ShapeCreator.CreatePolygon();
    };
    /**
     * 地表面积测量
     */
    var measureSurfaceArea = function (callback) {
        hideBollon();
        earth.Event.OnCreateGeometry = function (polygon) {
            earth.Event.OnCreateGeometry = function () {
            };
            earth.Event.OnAnalysisFinished = function (result) {
                earth.Event.OnHtmlBalloonFinished= function () {
                    clear();
                    // earth.Event.OnRBDown = function () {
                    // };
                };
                earth.ShapeCreator.Clear();
                earth.Measure.Clear();
                var res = " 地表面积：" + result.TerrainSurfaceArea.toFixed(2) + "m<sup>2</sup>";
                _result = result;
                _clear();
                if (callback) {
                    callback(res);
                } else {
                    _showMeasureResult(res);
                }
            };
            earth.Analysis.SurfaceArea(polygon);
        };
        setTimeout(function(){ //延迟否则与OnHtmlBalloonFinished冲突
            earth.ShapeCreator.CreatePolygon();
        },100);
    };
    /**
     * 面面距离
     */
    var SurfacesToSurfaces=function(){
        hideBollon();
        var pointArr=[];
        var isPolygon=true;
        var lineObj;
        earth.ToolManager.SphericalObjectEditTool.Select();
        earth.Event.OnSelectChanged=function(x){
            var selectSet = earth.SelectSet;
            if(selectSet.GetCount()==0){
                return;
            }
            for(var i=0; i<selectSet.GetCount(); i++){
                var element = selectSet.GetObject(i);
                if(element.Rtti===211){  //211是polygon
                    var vector3s=element.GetExteriorRing();
                    pointArr.push(vector3s);
                }else{
                    isPolygon=false;
                }
            }
            if(!isPolygon||pointArr.length>2){
                alert("请确定选择的是面或选择的面的个数多于2个！");
                earth.ToolManager.SphericalObjectEditTool.Browse() ;
                isPolygon=true;
            }

            if(pointArr.length==2){
                var points= earth.Factory.CreateVector3s();
                ///var pointB= earth.Factory.CreateVector3();
                var result=earth.GeometryAlgorithm.CalculatePolygonDistance(pointArr[0],pointArr[1]);
                if(result.Length==0){
                    pointArr=pointArr.splice(1,1);
                }
                if(result){
                    lineObj = earth.Factory.CreateElementLine(earth.Factory.CreateGUID(),"line");
                    lineObj.BeginUpdate();
                    lineObj.SetPointArray(result);
                    lineObj.Visibility = true;
                    var Linestyle=lineObj.LineStyle;
                    Linestyle.LineWidth = 1;
                    Linestyle.LineColor =  parseInt(0xccff0000);
                    lineObj.AltitudeType = 1;
                    lineObj.EndUpdate();
                    AnalineObj = lineObj;
                    earth.AttachObject(lineObj);
                    var length=result.Length;
                    var showResult="面面距离：" + length.toFixed(3) + "米";
                    _showMeasureResult(showResult);
                    pointArr=[];
                    earth.ToolManager.SphericalObjectEditTool.Browse() ;
                    earth.Event.OnSelectChanged=function(x){};
                }

            }

        }
        earth.Event.OnHtmlBalloonFinished= function () {
            earth.ToolManager.SphericalObjectEditTool.Browse() ;
            earth.Event.OnSelectChanged=function(x){};
            if(lineObj){
                earth.DetachObject(lineObj);
            }
            clear();
            earth.SelectSet.Clear();
            //earth.Event.OnRBDown=function(){};
        };
        // earth.Event.OnRBDown = function(pointX, pointY){
        //     earth.ToolManager.SphericalObjectEditTool.Browse() ;
        //     pointArr=[];
        //     earth.Event.OnSelectChanged=function(x){};
        //     if(lineObj){
        //         earth.DetachObject(lineObj);
        //     }

        //     earth.SelectSet.Clear();
        //     clear();
        //     earth.Event.OnRBDown=function(){};
        // }

    }
    /**
     *点面距离
     */
    var pointToSurfaces=function(){

        var isPolygon =true;
        var lineObj;
        earth.Event.OnCreateGeometry = function(p,t){
            var pointArr=[];
            earth.ToolManager.SphericalObjectEditTool.Select();
            earth.Event.OnSelectChanged=function(x){
                var selectSet = earth.SelectSet;
                if(selectSet.GetCount()==0){
                    return;
                }
                for(var i=0; i<selectSet.GetCount(); i++){
                    var element = selectSet.GetObject(i);
                    if(element.Rtti===211){  //211是polygon
                        var vector3s=element.GetExteriorRing();
                        pointArr.push(vector3s);
                    }else{
                        isPolygon=false;
                    }
                }
                if(!isPolygon||pointArr.length>2){
                    alert("请确定选择的是一个面！");
                    earth.ToolManager.SphericalObjectEditTool.Browse() ;
                    isPolygon=true;
                }else {
                    var result=earth.GeometryAlgorithm.CalculatePointPolygonDistance (pointArr[0],p);
                    if(result){
                        lineObj = earth.Factory.CreateElementLine(earth.Factory.CreateGUID(),"line");
                        lineObj.BeginUpdate();
                        lineObj.SetPointArray(result);
                        lineObj.Visibility = true;
                        var Linestyle=lineObj.LineStyle;
                        Linestyle.LineWidth = 1;
                        Linestyle.LineColor =  parseInt(0xccff0000);
                        lineObj.AltitudeType = 1;
                        lineObj.EndUpdate();
                        earth.AttachObject(lineObj);
                        AnalineObj = lineObj;
                        var length=result.Length;
                        var showResult="点面距离：" + length.toFixed(3) + "米";
                        _showMeasureResult(showResult);
                        pointArr=[];
                        earth.ToolManager.SphericalObjectEditTool.Browse() ;
                        earth.Event.OnSelectChanged=function(x){};
                    }
                }
            }

        };
        hideBollon();
        earth.Event.OnHtmlBalloonFinished= function () {
            earth.ToolManager.SphericalObjectEditTool.Browse() ;
            earth.Event.OnSelectChanged=function(x){};
            if(lineObj){
                earth.DetachObject(lineObj);
            }
            earth.SelectSet.Clear();
            clear();
            //earth.Event.OnRBDown=function(){};
        };
        // earth.Event.OnRBDown = function(pointX, pointY){
        //     earth.ToolManager.SphericalObjectEditTool.Browse() ;
        //     earth.Event.OnSelectChanged=function(x){};
        //     if(lineObj){
        //         earth.DetachObject(lineObj);
        //     }
        //     earth.SelectSet.Clear();
        //     clear();
        //     earth.Event.OnRBDown=function(){};
        // }
        setTimeout(function(){ //延迟否则与OnHtmlBalloonFinished冲突
            earth.ShapeCreator.CreatePoint();
        },100);
    }

    /**
     *线面距离
     */
    var lineToSurfaces=function(){
        hideBollon();
        var isPolygon =true;
        var pointArr=[];
        var linevector3s="";
        var polygonvector3s="";
        var lineObj;
        earth.ToolManager.SphericalObjectEditTool.Select();
        earth.Event.OnSelectChanged=function(x){
            var selectSet = earth.SelectSet;
            if(selectSet.GetCount()==0){
                return;
            }
            var tag=true;
            /*   if(selectSet.GetObject(0).Rtti!=220){
             alert("请先选择一条线");
             tag=false;
             }*/
            if(tag){
                for(var i=0; i<selectSet.GetCount(); i++){
                    var element = selectSet.GetObject(i);
                    if(element.Rtti===220){
                        linevector3s=element.GetPointArray();
                        //pointArr.push(vector3s);
                    } else
                    if(element.Rtti===211){  //211是polygon
                        polygonvector3s=element.GetExteriorRing();
                        //pointArr.push(vector3s);
                    }else{
                        isPolygon=false;
                    }
                }
                if(polygonvector3s&&linevector3s){
                    //debugger
                    var result=earth.GeometryAlgorithm.CalculateLinePolygonDistance (linevector3s,polygonvector3s);
                    if(result){
                        lineObj = earth.Factory.CreateElementLine(earth.Factory.CreateGUID(),"line");
                        lineObj.BeginUpdate();
                        lineObj.SetPointArray(result);
                        lineObj.Visibility = true;
                        var Linestyle=lineObj.LineStyle;
                        Linestyle.LineWidth = 1;
                        Linestyle.LineColor =  parseInt(0xccff0000);
                        lineObj.AltitudeType = 5;
                        lineObj.EndUpdate();
                        earth.AttachObject(lineObj);
                        AnalineObj = lineObj;
                        var length=result.Length;
                        var showResult="线面距离：" + length.toFixed(3) + "米";
                        _showMeasureResult(showResult);
                        pointArr=[];
                        earth.ToolManager.SphericalObjectEditTool.Browse() ;
                        earth.Event.OnSelectChanged=function(x){};
                    }
                }
            }
        }
        earth.Event.OnHtmlBalloonFinished= function () {
            earth.ToolManager.SphericalObjectEditTool.Browse() ;
            pointArr=[];
            clear();
            earth.Event.OnSelectChanged=function(x){};
            if(lineObj){
                earth.DetachObject(lineObj);
            }
            earth.SelectSet.Clear();
            //earth.Event.OnRBDown=function(){};
        };
        // earth.Event.OnRBDown = function(pointX, pointY){
        //     earth.ToolManager.SphericalObjectEditTool.Browse() ;
        //     pointArr=[];
        //     clear();
        //     earth.DetachObject(lineObj);
        //     earth.SelectSet.Clear();
        //     earth.Event.OnRBDown=function(){};
        // }
    }
    /**
     * 建筑物距离
     */
    var buidTobuid=function(){
        hideBollon();
        var modelArr=[];
        var isPolygon=true;
        var lineObj;
        earth.ToolManager.SphericalObjectEditTool.Select();
        earth.Event.OnSelectChanged=function(x){
            var selectSet = earth.SelectSet;
            if(selectSet.GetCount()==0){
                return;
            }
            for(var i=0; i<selectSet.GetCount(); i++){
                var element = selectSet.GetObject(i);
                if(element.Rtti===229){   //280/220    EditModel= 229,
                    modelArr.push(element);
                }else{
                    isPolygon=false;
                }
            }
            if(!isPolygon||modelArr.length>2){
                alert("请确定选择的模型！");
                earth.ToolManager.SphericalObjectEditTool.Browse() ;
                isPolygon=true;
            }
            if(modelArr.length==2){
                var buildingpolygonArr=[];
                for(var m=0;m<modelArr.length;m++){
                    var buildingpolygon=earth.GeometryAlgorithm.CalculateModelContour(modelArr[m].Guid);    //简单计算模型的投影轮廓，生成最小矩形
                    var vector2s=buildingpolygon.Items(0);
                    var vector3s=earth.Factory.CreateVector3s();
                    for(var n=0;n<vector2s.Count;n++){
                        var vector2= vector2s.GetPointAt(n);
                        var v3 = earth.Factory.CreateVector3();
                        v3.X =vector2.Longitude;
                        v3.Y =vector2.Latitude;
                        v3.Z =vector2.Altitude;
                        vector3s.AddVector(v3);
                    }
                    buildingpolygonArr.push(vector3s) ;
                }
                var result=earth.GeometryAlgorithm.CalculatePolygonDistance(buildingpolygonArr[0],buildingpolygonArr[1]);    //两个多边形的最短距离点序列
                if(result.Length==0){
                    modelArr=modelArr.splice(1,1);
                }
                if(result){
                    lineObj = earth.Factory.CreateElementLine(earth.Factory.CreateGUID(),"line");

                    lineObj.BeginUpdate();
                    lineObj.SetPointArray(result);
                    lineObj.Visibility = true;
                    var Linestyle=lineObj.LineStyle;
                    Linestyle.LineWidth = 1;
                    Linestyle.LineColor =  parseInt(0xccff0000);
                    lineObj.AltitudeType = 1;
                    lineObj.EndUpdate();
                    earth.AttachObject(lineObj);
                    AnalineObj = lineObj;
                    var length=result.Length;
                    var showResult="楼间距：" + length.toFixed(3) + "米";
                    _showMeasureResult(showResult);
                    modelArr=[];
                    earth.ToolManager.SphericalObjectEditTool.Browse() ;
                    earth.Event.OnSelectChanged=function(x){};
                }

            }

        }
        earth.Event.OnHtmlBalloonFinished= function () {
            earth.ToolManager.SphericalObjectEditTool.Browse() ;
            earth.Event.OnSelectChanged=function(x){};
            if(lineObj){
                earth.DetachObject(lineObj);
            }
            clear();
            earth.SelectSet.Clear();
            earth.ToolManager.SphericalObjectEditTool.Browse() ;//cy
        };
        // earth.Event.OnRBDown = function(pointX, pointY){
        //     earth.ToolManager.SphericalObjectEditTool.Browse() ;
        //     modelArr=[];
        //     earth.Event.OnSelectChanged=function(x){};
        //     if(lineObj){
        //         earth.DetachObject(lineObj);
        //     }
        //     earth.SelectSet.Clear();
        //     clear();
        //     earth.Event.OnRBDown=function(){};

        // }

    }
    //点到折线距离
    var pointToline = function(){
        hideBollon();
        var isPolygon =true;
        var lineObj;
        earth.Event.OnCreateGeometry = function(p,t){
            var pointArr=[];
            earth.ToolManager.SphericalObjectEditTool.Select();
            earth.Event.OnSelectChanged=function(x){
                var selectSet = earth.SelectSet;
                if(selectSet.GetCount()==0){
                    return;
                }
                for(var i=0; i<selectSet.GetCount(); i++){
                    var element = selectSet.GetObject(i);
                    if(element.Rtti===220){  //211是polygon
                        var vector3s=element.GetPointArray();
                        pointArr.push(vector3s);
                    }else{
                        isPolygon=false;
                    }
                }
                if(!isPolygon||pointArr.length>2){
                    alert("请确定选择的是线！");
                    earth.ToolManager.SphericalObjectEditTool.Browse() ;
                    isPolygon=true;
                }else {
                    var vect3 = earth.Factory.CreateVector3();
                    vect3.X = p.Longitude;
                    vect3.Y = p.Latitude;
                    vect3.Z = p.Altitude;
                    var result=earth.GeometryAlgorithm.CalculatePointPolylineDistance    (pointArr[0],p);
                    if(result){
                        lineObj = earth.Factory.CreateElementLine(earth.Factory.CreateGUID(),"line");
                        lineObj.BeginUpdate();
                        lineObj.SetPointArray(result);
                        lineObj.Visibility = true;
                        var Linestyle=lineObj.LineStyle;
                        Linestyle.LineWidth = 1;
                        Linestyle.LineColor =  parseInt(0xccff0000);
                        lineObj.AltitudeType = 1;
                        lineObj.EndUpdate();
                        earth.AttachObject(lineObj);
                        AnalineObj = lineObj;
                        var length=result.Length;
                        var showResult="点线距离：" + length.toFixed(3) + "米";
                        _showMeasureResult(showResult);
                        pointArr=[];
                        earth.ToolManager.SphericalObjectEditTool.Browse() ;
                        earth.Event.OnSelectChanged=function(x){};
                    }
                }
            }
        };
        earth.Event.OnHtmlBalloonFinished= function () {
            earth.ToolManager.SphericalObjectEditTool.Browse() ;
            earth.Event.OnSelectChanged=function(x){};
            if(lineObj){
                earth.DetachObject(lineObj);
            }
            earth.SelectSet.Clear();
            clear();
            //earth.Event.OnRBDown=function(){};
            earth.Event.OnHtmlBalloonFinished=function(){};
        };

        setTimeout(function(){ //延迟否则与OnHtmlBalloonFinished冲突
            earth.ShapeCreator.CreatePoint();
        },100);
    }
    //点-线段距离
    var pointToZline =function(){
        hideBollon();
        var isPolygon =true;
        var lineObj;
        earth.Event.OnCreateGeometry = function(p,t){
            var pointArr=[];
            earth.ToolManager.SphericalObjectEditTool.Select();
            earth.Event.OnSelectChanged=function(x){
                var selectSet = earth.SelectSet;
                if(selectSet.GetCount()==0){
                    return;
                }
                for(var i=0; i<selectSet.GetCount(); i++){
                    var element = selectSet.GetObject(i);
                    if(element.Rtti===220){  //211是polygon
                        var vector3s=element.GetPointArray();
                        pointArr.push(vector3s);
                    }else{
                        isPolygon=false;
                    }
                }
                if(!isPolygon||pointArr.length>2){
                    alert("请确定选择的是线！");
                    earth.ToolManager.SphericalObjectEditTool.Browse() ;
                    isPolygon=true;
                }else {
                    var vect3 = earth.Factory.CreateVector3();
                    vect3.X = p.Longitude;
                    vect3.Y = p.Latitude;
                    vect3.Z = p.Altitude;
                    var result=earth.GeometryAlgorithm.DistancePointLine   (pointArr[0].Items(0),pointArr[0].Items(pointArr[0].Count-1),vect3);
                    if(result){
                        lineObj = earth.Factory.CreateElementLine(earth.Factory.CreateGUID(),"line");
                        lineObj.BeginUpdate();
                        lineObj.SetPointArray(result);
                        lineObj.Visibility = true;
                        var Linestyle=lineObj.LineStyle;
                        Linestyle.LineWidth = 1;
                        Linestyle.LineColor =  parseInt(0xccff0000);
                        lineObj.AltitudeType = 1;
                        lineObj.EndUpdate();
                        earth.AttachObject(lineObj);
                        AnalineObj = lineObj;
                        var length=result.Length;
                        var showResult="点线距离：" + length.toFixed(3) + "米";
                        _showMeasureResult(showResult);
                        pointArr=[];
                        earth.ToolManager.SphericalObjectEditTool.Browse() ;
                        earth.Event.OnSelectChanged=function(x){};
                    }
                }
            }

        };
        earth.Event.OnHtmlBalloonFinished= function () {
            earth.ToolManager.SphericalObjectEditTool.Browse() ;
            earth.Event.OnSelectChanged=function(x){};
            if(lineObj){
                earth.DetachObject(lineObj);
            }
            clear();
            earth.SelectSet.Clear();
            //earth.Event.OnRBDown=function(){};
        };
        // earth.Event.OnRBDown = function(pointX, pointY){
        //     earth.ToolManager.SphericalObjectEditTool.Browse() ;
        //     earth.Event.OnSelectChanged=function(x){};
        //     if(lineObj){
        //         earth.DetachObject(lineObj);
        //     }
        //     earth.SelectSet.Clear();
        //     clear();
        //     earth.Event.OnRBDown=function(){};
        // }
        setTimeout(function(){ //延迟否则与OnHtmlBalloonFinished冲突
            earth.ShapeCreator.CreatePoint();
        },100);
    }
    //点-线段距离
    var pointToSegment = function (){
        hideBollon();
        var isPolygon =true;
        var lineObj;
        earth.Event.OnCreateGeometry = function(p,t){
            var pointArr=[];
            earth.ToolManager.SphericalObjectEditTool.Select();
            earth.Event.OnSelectChanged=function(x){
                var selectSet = earth.SelectSet;
                if(selectSet.GetCount()==0){
                    return;
                }
                for(var i=0; i<selectSet.GetCount(); i++){
                    var element = selectSet.GetObject(i);
                    if(element.Rtti===220){  //211是polygon
                        var vector3s=element.GetPointArray();
                        pointArr.push(vector3s);
                    }else{
                        isPolygon=false;
                    }
                }
                if(!isPolygon||pointArr.length>2){
                    alert("请确定选择的是线！");
                    earth.ToolManager.SphericalObjectEditTool.Browse() ;
                    isPolygon=true;
                }else {
                    var vect3 = earth.Factory.CreateVector3();
                    vect3.X = p.Longitude;
                    vect3.Y = p.Latitude;
                    vect3.Z = p.Altitude;
                    var result=earth.GeometryAlgorithm.DistancePointSegment    (pointArr[0].Items(0),pointArr[0].Items(pointArr[0].Count-1),vect3);
                    if(result){
                        lineObj = earth.Factory.CreateElementLine(earth.Factory.CreateGUID(),"line");
                        lineObj.BeginUpdate();
                        lineObj.SetPointArray(result);
                        lineObj.Visibility = true;
                        var Linestyle=lineObj.LineStyle;
                        Linestyle.LineWidth = 1;
                        Linestyle.LineColor =  parseInt(0xccff0000);
                        lineObj.AltitudeType = 1;
                        lineObj.EndUpdate();
                        earth.AttachObject(lineObj);
                        AnalineObj = lineObj;
                        var length=result.Length;
                        var showResult="点线距离：" + length.toFixed(3) + "米";
                        _showMeasureResult(showResult);
                        pointArr=[];
                        earth.ToolManager.SphericalObjectEditTool.Browse() ;
                        earth.Event.OnSelectChanged=function(x){};
                    }
                }
            }

        };
        earth.Event.OnHtmlBalloonFinished= function () {
            earth.ToolManager.SphericalObjectEditTool.Browse() ;
            earth.Event.OnSelectChanged=function(x){};
            if(lineObj){
                earth.DetachObject(lineObj);
            }
            clear();
            earth.SelectSet.Clear();
            //earth.Event.OnRBDown=function(){};
        };
        // earth.Event.OnRBDown = function(pointX, pointY){
        //     earth.ToolManager.SphericalObjectEditTool.Browse() ;
        //     earth.Event.OnSelectChanged=function(x){};
        //     if(lineObj){
        //         earth.DetachObject(lineObj);
        //     }
        //     earth.SelectSet.Clear();
        //     clear();
        //     earth.Event.OnRBDown=function(){};
        // }
        setTimeout(function(){ //延迟否则与OnHtmlBalloonFinished冲突
            earth.ShapeCreator.CreatePoint();
        },100);
    };
    //线线距离x
    var lineToline = function(){
        hideBollon();
        var pointArr=[];
        var isPolygon=true;
        var lineObj;
        earth.ToolManager.SphericalObjectEditTool.Select();
        earth.Event.OnSelectChanged=function(x){
            var selectSet = earth.SelectSet;
            if(selectSet.GetCount()==0){
                return;
            }
            for(var i=0; i<selectSet.GetCount(); i++){
                var element = selectSet.GetObject(i);
                if(element.Rtti===220){  //211是polygon
                    var vector3s=element.GetPointArray();
                    pointArr.push(vector3s);
                }else{
                    isPolygon=false;
                }
            }
            if(!isPolygon||pointArr.length>2){
                alert("请确定选择的是线或选择的线的个数多于2个！");
                earth.ToolManager.SphericalObjectEditTool.Browse() ;
                isPolygon=true;
            }

            if(pointArr.length==2){
                var points= earth.Factory.CreateVector3s();
                ///var pointB= earth.Factory.CreateVector3();
                //CalculateLineLineDistance(ISEVector3s *inLineA, ISEVector3s *inLineB, ISEVector3s** outLine)
                var result=earth.GeometryAlgorithm.CalculateLineLineDistance(pointArr[0],pointArr[1]);
                if(result.Length==0){
                    pointArr=pointArr.splice(1,1);
                }
                if(result){
                    lineObj = earth.Factory.CreateElementLine(earth.Factory.CreateGUID(),"line");
                    lineObj.BeginUpdate();
                    lineObj.SetPointArray(result);
                    lineObj.Visibility = true;
                    var Linestyle=lineObj.LineStyle;
                    Linestyle.LineWidth = 1;
                    Linestyle.LineColor =  parseInt(0xccff0000);
                    lineObj.AltitudeType = 1;
                    lineObj.EndUpdate();
                    earth.AttachObject(lineObj);
                    AnalineObj = lineObj;
                    var length=result.Length;
                    var showResult="线线距离：" + length.toFixed(3) + "米";
                    _showMeasureResult(showResult);
                    pointArr=[];
                    earth.ToolManager.SphericalObjectEditTool.Browse() ;
                    earth.Event.OnSelectChanged=function(x){};
                }

            }

        };
        earth.Event.OnHtmlBalloonFinished= function () {
            earth.ToolManager.SphericalObjectEditTool.Browse() ;
            earth.Event.OnSelectChanged=function(x){};
            if(lineObj){
                earth.DetachObject(lineObj);
            }
            clear();
            earth.SelectSet.Clear();
            //earth.Event.OnRBDown=function(){};
        };
    } ;
    //阴影分析
    var shadow = function(btn1,btn2,btn3,dqdate,isChecked){
        clear();
        earth.Event.OnCreateGeometry = function(pval,type){
            earth.Event.OnCreateGeometry = function(){};
            extent = pval;
            if(extent){
                earth.Event.OnAnalysisFinished = function (res) {
                    earth.Event.OnAnalysisFinished = function () {};

                    //cy 删除
                //    if(earth.htmlBallon.Guid){
                        _result = res;
                        resArr.push(_result);
                        for(var i=0; i<btn1.length;i++){
                            btn1[i].removeAttr("disabled") ;
                        }
                        btn2.removeAttr("disabled");
                        btn3.removeAttr("disabled");
//                    }
//                    else{
//                        clear();
//                        res.ClearRes();
//                    }
                };
                var longitude = earth.GlobeObserver.TargetPose.Longitude;
                var latitude = earth.GlobeObserver.TargetPose.latitude;
                var nowTime = btn1[2].val().split(":");
                var currDateArr =dqdate.val().split("-");
                var shineTime = earth.GeometryAlgorithm.CalculateSunriseAndSunset(currDateArr[0], currDateArr[1], currDateArr[2],longitude, latitude);
                var st =Number(nowTime[0])+Number(nowTime[1])/60;
                if(st>=Number(shineTime.X)&&st<=Number(shineTime.Y)){
                    analysis.shinning(8,dqdate.val(),btn1[2].val(),extent,isChecked);
                }  else{
                    for(var i=0; i<btn1.length;i++){
                        btn1[i].removeAttr("disabled") ;
                    }
                    btn2.attr("disabled", "disabled");
                    alert("当前时间不在有效分析范围内！");
                    clear();
                    return;
                }
            }
        }
        earth.ShapeCreator.CreateCircle();
    };
//    //阴影分析   废弃
//    var shadow = function(btn1,btn2,btn3,dqdate,extent, isChecked){
//
//        clear();
//        if(extent){
//            earth.Event.OnAnalysisFinished = function (res) {
//                earth.Event.OnAnalysisFinished = function () {};
////                if(earth.htmlBallon.Guid){
//                    _result = res;
//                    resArr.push(_result);
//                    for(var i=0; i<btn1.length;i++){
//                        btn1[i].removeAttr("disabled") ;
//                    }
//                    btn2.removeAttr("disabled");
//                    btn3.removeAttr("disabled");
////                }
////                else{
////                    clear();
////                    res.ClearRes();
////                }
//            };
//            var longitude = earth.GlobeObserver.TargetPose.Longitude;
//            var latitude = earth.GlobeObserver.TargetPose.latitude;
//            var nowTime = btn1[2].val().split(":");
//            var currDateArr =dqdate.split("-");
//            var shineTime = earth.GeometryAlgorithm.CalculateSunriseAndSunset(currDateArr[0], currDateArr[1], currDateArr[2],longitude, latitude);
//            var st =Number(nowTime[0])+Number(nowTime[1])/60;
//            if(st>=Number(shineTime.X)&&st<=Number(shineTime.Y)){
//                analysis.shinning(8,dqdate,btn1[2].val(),extent,isChecked);
//            }  else{
//                for(var i=0; i<btn1.length;i++){
//                    btn1[i].removeAttr("disabled") ;
//                }
//                btn2.attr("disabled", "disabled");
//                alert("当前时间不在有效分析范围内！");
//                clear();
//                return;
//            }
//        }
//    };
    //阴影动态模拟结束事件
    var simulation = function(btn1,btn2,dqdate,startShingTime,endShingTime,isChecked){
        earth.Event.OnAnalysisFinished = function (res) {
//            if(earth.htmlBallon.Guid){
                if(_result){
                    _result.ClearRes();
                }
                resArr.push(res);
                clear();
                var dates = dqdate.val().split("-");   //年月日
                var times = btn1[2].val().split(":");  //时分
                var curDate = new Date(dates[0],dates[1]-1,dates[2],times[0],times[1],00);
                curDate.setTime(curDate.getTime() + btn1[3].val() * 60 * 1000);//步长30分
                setDateTime(curDate,btn1,dqdate);

                var timeN = btn1[2].val().split(":");
                var st =Number(timeN[0])+Number(timeN[1])/60;
                var startTime = startShingTime.split(":");
                var endTime = endShingTime.split(":");
                var stStart = Number(startTime[0])+Number(startTime[1])/60;
                var stEnd = Number(endTime[0])+Number(endTime[1])/60;

                //endTimeTag = st;
                if(extent!=null&&st<stEnd&&st>stStart){
                    if(resArr.length>1){
                        resArr[resArr.length-2].ClearRes();
                        if(btn1[0].text() == "动态模拟"){
                            resArr[resArr.length-1].ClearRes();
                            setDateTime(new Date(),btn1,dqdate);
                            return;
                        }
                    }
                    btn1[5].attr("disabled","disabled");
                    btn1[6].attr("disabled","disabled");
                    shinning(8,dqdate.val(),btn1[2].val(),extent,isChecked);
                    //clear();
                }
                else{
                    btn1[0].text("动态模拟");
                    btn2.removeAttr("disabled","disabled");
                    btn1[5].removeAttr("disabled");
                    btn1[6].removeAttr("disabled");
                    setDateTime(new Date(),btn1,dqdate);
                    clear();
                    for(var i=0;i<resArr.length;i++){
                        resArr[i].ClearRes();
                    }
                    resArr = [];
                }
//            }
//            else{
//                clear();
//                res.ClearRes();
//                for(var i=0;i<resArr.length;i++){
//                    resArr[i].ClearRes();
//                }
//                resArr = [];
//            }
        };
        shinning(8,dqdate.val(),btn1[2].val(),extent,isChecked);
    }    ;
        var clearHtmlBallon = function(htmlBall){
            if (htmlBall != null){
                htmlBall.DestroyObject();
                //htmlBall = null;
            }
        } ;
     // 清除临时数据
    // analysis.clearHtmlBallon = clearHtmlBallon;
    // analysis.clearLinesight=clearLinesight;
    // analysis.hideBollon=hideBollon;
    analysis.clear = clear; 
    analysis.showMoveHtml = showMoveHtml;

    analysis.measure = measure;                           // 距离、面积测量
    analysis.measureSurfaceArea = measureSurfaceArea;   // 地表面积测量
    analysis.measureSlope = measureSlope;                // 坡度测量
    analysis.fixedObserver = fixedObserver;              // 定点观察
    analysis.lineOfSight = lineOfSight;                  // 视线分析
    analysis.showHeightLine = showHeightLine;            // 通视控高
    analysis.viewShed = viewShed;                        // 视域分析
    analysis.skyline = skyline;                          // 天际线
    analysis.shinning = shinning;                        // 日照
    analysis.getAltitude = getAltitude;                 // 获取高程
    analysis.excavationAndFill = excavationAndFill;    // 挖填方
    analysis.shadow = shadow;              //阴影分析
    analysis.simulation = simulation;              //阴影动态模拟

    analysis.pointToline = pointToline; //点线距离  d
    analysis.pointToSegment = pointToSegment;
    analysis.pointToZline = pointToZline;
    analysis.lineToline = lineToline;   //线线距离x
    analysis.SurfacesToSurfaces = SurfacesToSurfaces;//面面距离
    analysis.pointToSurfaces = pointToSurfaces;//点面距离
    analysis.lineToSurfaces = lineToSurfaces;//线面距离
    analysis.buidTobuid = buidTobuid;//建筑物间距离
    analysis.sun=sun;//建筑物间距离
    analysis.viewShedPolygon=viewShedPolygon;//视域分析


    analysis.clearHtmlBallon =   clearHtmlBallon;
    return analysis;
};