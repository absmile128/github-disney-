/**
 * Created with IntelliJ IDEA.
 * User: chenwei
 * Date: 14-1-14
 * Time: 下午4:44
 */
if( !CITYPLAN ){
    var CITYPLAN = {};
}
CITYPLAN.searchAnalysis = function(earth){
    var searchAnalysis = {};
    var htmlBallon = null;//弹出气泡对象
    var location = {};
    jQuery.support.cors = true; //开启jQuery跨域支持
    var prePickObj;
     //已看 调用气泡方法

    var createHtmlBollon = function(path,obj,position,width,height,isScreenLocation){

        var loaclUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
        var url = loaclUrl +"/"+ path; //ShowNavigate只能用绝对路径

        debugger;
        if(htmlBallon){
            htmlBallon.DestroyObject();
            htmlBallon=null;
        }
        //earth.HtmlBalloon.Transparence = true;
        var guid = earth.Factory.CreateGuid();
        htmlBallon = earth.Factory.CreateHtmlBalloon(guid, "balloon");
        if(isScreenLocation)     //屏幕位置
        {


            htmlBallon.SetScreenLocation(position.screenx,position.screeny);
        }
        else    //所选中物体的所在位置
        {
        htmlBallon.SetSphericalLocation( position.lon ,  position.lat, position.alt);
        }
        htmlBallon.SetRectSize(width,height);
        var color = parseInt("0xccc0c0c0");//0xccc0c0c0 //e4e4e4 //0xcc4d514a

        htmlBallon.SetTailColor(color);
        htmlBallon.SetIsAddCloseButton(true);
        htmlBallon.SetIsAddMargin(true);
        htmlBallon.SetIsAddBackgroundImage(true);
        htmlBallon.SetIsTransparence(false);
        htmlBallon.ShowNavigate(url);

        //气泡的url网页加载完成事件
        earth.Event.OnHtmlNavigateCompleted = function (){
            setTimeout(function(){

               htmlBallon.InvokeScript("postData", obj);

            },100);
            earth.Event.OnHtmlNavigateCompleted = function (){};
        };
        //气泡隐藏或关闭事件
        earth.Event.OnHtmlBalloonFinished = function(){
            if(htmlBallon!=null){
                htmlBallon.DestroyObject();
                htmlBallon=null;
            }
            earth.ToolManager.SphericalObjectEditTool.Browse() ;//退出编辑工具，恢复浏览
            earth.Event.OnSelectChanged=function(){};
            //earth.attachEvent("onPoiClicked",parent.ifEarth.onPoiClicked);
            earth.Event.OnHtmlBalloonFinished = function(){};
        }
    }
    //已看 清除气泡
    var clear = function(){
        if(htmlBallon){
            htmlBallon.DestroyObject();
            htmlBallon=null;
        }
    }


    /* ------------------------------------------------------------------------*/
    //建筑查询开始
    /* ------------------------------------------------------------------------*/

    //已看 通过建筑id从数据库查询建筑属性
    var searchBuildingData = function (buildId){
        var xml ='<QUERY>' +
            '<CONDITION><AND>' +
            '<ID tablename="CPBUILDING">=\''+buildId+'\'</ID>' +
            '</AND></CONDITION>' +
            '<RESULT><CPBUILDING /></RESULT>' +
            '</QUERY>';
        $.post(CITYPLAN_config.service.query, xml, function(data){
            var record = $.xml2json(data).record;
            if(record){
                var url =  "html/investigate/BuildTable.html"; //ShowNavigate只能用绝对路径
                createHtmlBollon(url,record,location,450,355,false);
            }
        }, "text");
    };
    var  searchBuildingDataByAnaly = function(){
        /*var pLayer  = element.GetParentNode();
        if (pLayer != null){
            element.HightLightIsFlash(false);
            element.ShowHighLight();
        }
        earth.OnEditDatabaseFinished = function(obj,e){  //todo: 解析返回数据并显示
            alert(1)
            earth.OnEditDatabaseFinished=function(){};
            earth.OnEditDatabaseFinished =function(obj,e){
                earth.OnEditDatabaseFinished =function(){};
               var attributelist = e.pFeature;
            }
            earth.DatabaseManager.GetAttributeByGuid(pLayer.Guid,element.Guid);
        }
        earth.DatabaseManager.GetAttributeColInfo(pLayer.Guid);*/
        earth.Event.OnPickObjectEx = function(pObj){
            alert("demo");
            if(pObj==null){
                alert("对象不存在");
                return;
            }
            pObj.Underground = true;   // SEObjectFlagType.ObjectFlagUnderground
            pObj.ShowHighLight();
            var parentLayerName = pObj.GetParentLayerName();
            if (parentLayerName == "" || parentLayerName == null) {
                alert("获得父层名称失败！");
                return false;
            }

            var key = pObj.GetKey();
            var pObjGUID = pObj.Guid;
            var cArr=parentLayerName.split("=");
            var cArr = cArr[1].split("_");


                        //var layer = earth.LayerManager.GetLayerByGUID(cArr[0]);
            earth.OnEditDatabaseFinished = function(obj,e){
                earth.OnEditDatabaseFinished=function(){};
                earth.OnEditDatabaseFinished =function(obj,e){
                    earth.OnEditDatabaseFinished =function(){};
                    var attributelist = e.pFeature;
                }
                earth.DatabaseManager.GetAttributeByGuid(pLayer.Guid,element.Guid);
            }
            earth.DatabaseManager.GetAttributeColInfo(cArr[0]);
        };
        earth.Event.OnSelectChanged=function(x){
            if(prePickObj){
                prePickObj.StopHighLight();
            }
            
            earth.Event.OnSelectChanged=function(x){};
            var selectSet = earth.SelectSet;
            if(selectSet.GetCount() == 1){
                var pEObject = earth.SelectSet.GetObject(0);
                var pLayer = pEObject.GetParentNode();
                earth.SelectSet.Clear();
                //只允许选中现状图层 top.currentLayerIdList IE8下array 不支持indexOf
                var isContain = false;
                if(parent.currentLayerIdList){
                    for(var h = 0; h < parent.currentLayerIdList.length; h++){
                        if(parent.currentLayerIdList[h] == pLayer.Guid){
                            isContain = true;
                        }
                    }
                }
                if(pLayer != null && isContain){
                    pEObject.HightLightIsFlash(false);
                    pEObject.ShowHighLight();
                    prePickObj = pEObject;
                    earth.ToolManager.SphericalObjectEditTool.Browse();
                    //弹出气泡显示属性
                    var layer = top.editLayers[pLayer.Guid];
                    if (layer != null){
                        var m_layerid = layer.Guid;
                        showProperty(pEObject, m_layerid);
                    }
                }else{
                    alert("请选择现状建筑模型!");
                    earth.ToolManager.SphericalObjectEditTool.Browse();
                }
            }else{
                earth.SelectSet.Clear();
                earth.ToolManager.SphericalObjectEditTool.Browse();
            }
           
        }
        earth.ToolManager.SphericalObjectEditTool.Select();
        //earth.Query.PickObjectEx(127);  // SEPickObjectType.PickAllObject
    };

    var showProperty = function(pEObject, m_layerid){
        earth.Event.OnEditDatabaseFinished=function(pRes, pLayer){
            var types;
            var fieldLength;
            var columnName;
            if(pLayer.Count){
                types = [], fieldLength =[], columnName=[];
                for(var i = 0; i < pLayer.Count; i++){
                    var columnInfo = pLayer.Items(i);
                    types.push(columnInfo.iType);
                    fieldLength.push(columnInfo.len);
                    columnName.push(columnInfo.Name);
                }
            }
            // C_INT_TYPE = 1000,  C_UINT64_TYPE = 1001, C_STRING_TYPE = 1002,C_BLOB_TYPE = 1003,C_BYTE_TYPE = 1004,C_DOUBLE_TYPE = 1005,
            earth.Event.OnEditDatabaseFinished = function(pResult, pLyr){
                earth.Event.OnEditDatabaseFinished = function(){};
                var allAttrs = [];
                for(var i = 0; i < pLyr.Count; i++){
                    var seAttribute = pLyr.Items(i);
                    var attrs = [];
                    var offset = 0;
                    for(var j = 0; j < types.length; j++){
                        var tAttr = types[j];
                        switch(tAttr){
                            case 1000:
                                attrs[j] = seAttribute.IntValue(offset,fieldLength[j]);
                                break;
                            case 1002:
                                attrs[j] = seAttribute.StringValue(offset,fieldLength[j]);
                                break;
                            case 1003:
                                attrs[j] = seAttribute.BoleanValue(offset,fieldLength[j]);
                                break;
                            case 1005:
                                attrs[j] = seAttribute.DoubleValue(offset,fieldLength[j]);
                                break;
                            default:
                                break;    
                        }
                        offset += fieldLength[j];
                    }
                    allAttrs.push(attrs);
                }
                var lon = pEObject.GetLonLatRect().Center.X;
                var lat = pEObject.GetLonLatRect().Center.Y;
                var alt = pEObject.GetLonLatRect().Center.Z;
                var attrStr = getAttrStr(allAttrs, columnName);
                showHtmlBalloon(lon, lat, alt, attrStr, columnName.length - 1);
            }
            earth.DatabaseManager.GetAttributeByGuid(m_layerid, prePickObj.Guid);
        }
        earth.DatabaseManager.GetAttributeColInfo(m_layerid);
    };

    var getAttrStr = function(allAttrs, columnName){
        var htmlStr = '<div style="overflow:auto;width:280px;margin-top:20px"><table style="font-size:16px;background-color: #ffffff; color: #fffffe">';
        if(columnName && columnName.length){
            for(var i = 0; i < columnName.length; i++){
                if(columnName[i].toUpperCase() != "GUID"){
                    htmlStr += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+getAlias(columnName[i])+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+allAttrs[0][i]+'</td></tr>';
                }
            }
        }
        htmlStr += '</table></div>';
        return htmlStr;
    };

    var htmlBalloons;
    var showHtmlBalloon =  function(vecCenterX, vecCenterY, vecCenterZ, htmlStr, numHeight){
        if(htmlBalloons){
            htmlBalloons.DestroyObject();
            htmlBalloons=null;
        }
        var guid = earth.Factory.CreateGuid();
        htmlBalloons = earth.Factory.CreateHtmlBalloon(guid, "balloon");
        htmlBalloons.SetSphericalLocation(vecCenterX, vecCenterY, vecCenterZ);
        htmlBalloons.SetRectSize(280, numHeight * 50);
        var color = parseInt("0xffffff00");
        htmlBalloons.SetTailColor(color);
        htmlBalloons.SetIsAddCloseButton(true);
        htmlBalloons.SetIsAddMargin(true);
        htmlBalloons.SetIsAddBackgroundImage(true);
        htmlBalloons.SetIsTransparence(true);
        htmlBalloons.SetBackgroundAlpha(0xcc);
        htmlBalloons.ShowHtml(htmlStr);
        earth.Event.OnHtmlBalloonFinished = function(){
            if(htmlBalloons!=null){
                htmlBalloons.DestroyObject();
                htmlBalloons=null;
            }
            if(prePickObj){
                prePickObj.StopHighLight();
            }
            earth.Event.OnHtmlBalloonFinished = function(){};
        }
    };

    var getAlias = function(srcName){
        var result = srcName;
        if (srcName.toUpperCase() == "CODE"){
            result = "建筑编号";
        }
        else if (srcName.toUpperCase() == "NAME"){
            result = "建筑名称";
        }
        else if (srcName.toUpperCase() == "JZXZ"){
            result = "建筑性质";
        }
        else if (srcName.toUpperCase() == "JZJDMJ"){
            result = "建筑基底面积";
        }
        else if (srcName.toUpperCase() == "ZJZMJ"){
            result = "总建筑面积";
        }
        else if (srcName.toUpperCase() == "JZGD"){
            result = "建筑高度";
        }
        else if (srcName.toUpperCase() == "JZCS"){
            result = "建筑层数";
        }
        else if (srcName.toUpperCase() == "JSND"){
            result = "建设年代";
        }
        return result;
    };

    //已看 点选建筑属性查询
    var buildingData = function(aOrs){
        earth.ToolManager.SphericalObjectEditTool.Select();
        var dataArr=[];
        earth.Event.OnSelectChanged=function(x){
            var selectSet = earth.SelectSet;
            for(var i=0; i<selectSet.GetCount(); i++){
                var element = selectSet.GetObject(i);
                var rect = element.GetLonLatRect();
                var north = rect.North;
                var south = rect.South;
                var east = rect.East;
                var west = rect.West;
                var top = rect.MaxHeight;
                var bottom = rect.MinHeight;
                var centerX = (east + west) / 2;
                var centerY = (north + south) / 2;
                var centerZ = (top + bottom) / 2;
                location.lon=centerX;
                location.lat=centerY;
                location.alt=centerZ;
                if(aOrs == "s"){
                    searchBuildingData(element.Guid);
                }else if(aOrs == "a"){
                    searchBuildingDataByAnaly(element);
                }

            }
            earth.ToolManager.SphericalObjectEditTool.Browse() ;
            earth.Event.OnSelectChanged=function(){};
        }
    };
    /* ------------------------------------------------------------------------*/
    //建筑查询结束
    /* ------------------------------------------------------------------------*/

    /* ------------------------------------------------------------------------*/
    //用地查询开始
    /* ------------------------------------------------------------------------*/
    var parcelSeach = function(){
         window.showLargeDialog("html/investigate/parcelSearch.html", "用地查询");
    };
    /* ------------------------------------------------------------------------*/
    //用地查询结束
    /* ------------------------------------------------------------------------*/

    /* ------------------------------------------------------------------------*/
    //控规询开始
    /* ------------------------------------------------------------------------*/
    var ctrPlanSeach = function(){
        window.showLargeDialog("html/investigate/ctrPlanSeach.html", "控规查询");
    }
    /* ------------------------------------------------------------------------*/
    //控规询结束
    /* ------------------------------------------------------------------------*/
    /* ------------------------------------------------------------------------*/
    //周边询开始
    /* ------------------------------------------------------------------------*/
    var surroundingSeach = function(){
        window.showLargeDialog("html/investigate/surroundingSeach.html", "周边查询");
    }
    /* ------------------------------------------------------------------------*/
    //周边询结束
    /* ------------------------------------------------------------------------*/
    //周边询开始
    /* ------------------------------------------------------------------------*/
    var spatialSeach = function(){
        window.showLargeDialog("html/investigate/spatialSearch.html", "空间查询");
    }
    /* ------------------------------------------------------------------------*/
    //周边询结束
    /* ------------------------------------------------------------------------*/
    /* ------------------------------------------------------------------------*/
    //基本询开始
    /* ------------------------------------------------------------------------*/
    var baseSeach = function(){
        window.showLargeDialog("html/investigate/baseSearch.html", "简单查询");
    }
    /* ------------------------------------------------------------------------*/
    //基本询结束
    /* ------------------------------------------------------------------------*/

    //关键字查询开始
    /* ------------------------------------------------------------------------*/
    var keywordSeach = function(){
        window.showLargeDialog("html/investigate/keywordSearch.html", "关键字查询");
    }
    /* ------------------------------------------------------------------------*/
    //关键字查询结束
    /* ------------------------------------------------------------------------*/
    //坐标查询开始
    /* ------------------------------------------------------------------------*/
    var locationSeachSeach = function(){
        earth.ToolManager.SphericalObjectEditTool.Browse();
        earth.ShapeCreator.Clear();
        earth.Event.OnCreateGeometry =function(pVal,type){
            earth.Event.OnCreateGeometry=function(){};
            earth.ShapeCreator.Clear();
            var position = {
                lon:pVal.Longitude,
                lat:pVal.Latitude,
                alt:pVal.Altitude
            } ;
            var obj={
               earth:earth,
               projId:parent.currentPrjGuid ,
               location :position
            } ;
            createHtmlBollon("html/investigate/locationSearch.html",obj,position,255,200) ;
        };
        earth.ShapeCreator.CreatePoint();
        //window.showLargeDialog("html/investigate/locationSearch.html", "坐标查询");
    }
    /* ------------------------------------------------------------------------*/
    //坐标查询结束
    /* ------------------------------------------------------------------------*/

    /* ------------------------------------------------------------------------*/
    //复合查询开始
    /* ------------------------------------------------------------------------*/
    var complexSeach = function(){
        window.showLargeDialog("html/investigate/complexSearch.html", "复合查询");
    }
    /* ------------------------------------------------------------------------*/
    //复合查询结束
    /* ------------------------------------------------------------------------*/
    //复合查询开始
    /* ------------------------------------------------------------------------*/
    var indicatorsAnalysis = function(){
        window.showLargeDialog("html/investigate/zhibiaoAnalysis.html", "指标核算");
    }
    /* ------------------------------------------------------------------------*/
    //复合查询结束
    /* ------------------------------------------------------------------------*/
    //拆迁分析开始
    /* ------------------------------------------------------------------------*/
    var removeAnalysis = function(){
        window.showLargeDialog("html/investigate/removeAnalysis.html", "拆迁分析");
    }
    /* ------------------------------------------------------------------------*/
    //拆迁分析结束
    /* ------------------------------------------------------------------------*/
    //绿地分析开始
    /* ------------------------------------------------------------------------*/
    var greenLandAnalysis = function(){
        window.showLargeDialog("html/investigate/greenLandAnalysis.html", "绿地分析");
    }
    /* ------------------------------------------------------------------------*/
    //绿地分析结束
    /* ------------------------------------------------------------------------*/
    /* ------------------------------------------------------------------------*/
    //限高分析开始
    /* ------------------------------------------------------------------------*/
    var ctrHeightAnalysis = function(){
        window.showLargeDialog("html/investigate/ctrHeightAnalysis.html", "限高分析");
    }
    /* ------------------------------------------------------------------------*/
    //限高分析结束
    /* ------------------------------------------------------------------------*/




    //writer:cy 方案属性查询
    var IndexplanData = function(planId){
        var planData=projManager.getPlanById(planId);
        var htmlbollonwidth=600;
        var htmlbollonheight=500;

        if(planData.length==1){

//           var url =  "html/investigate/indexPlan.html";
            var url =  "html/investigate/indexPlan.html";
            var height=  window.parent.document.getElementById("ifEarth").clientHeight;
            var width= window.parent.document.getElementById("ifEarth").clientWidth;
            //    location.screenx=width/2-htmlbollonwidth/2;
                 location.screenx=0;
            //   location.screeny=height/2-htmlbollonheight/2;
             location.screeny=0;
            createHtmlBollon(url,planData[0],location,htmlbollonwidth,htmlbollonheight,true);
            }




    };

      //writer:cy :项目指标查询
    var ProjectIndexData = function(prjid){

        var htmlbollonwidth=600;
        var htmlbollonheight=550;


        var ParcelData = projManager.getProjectData({id:prjid});
        var roadLineData=projManager.getRoadLineData(prjid);

        var Data={};
        if(ParcelData.length==1){
        Data.ParcelData=ParcelData;
        }
        if(roadLineData.length>0){
        Data.roadLineData=roadLineData;
        }


        if(Data!=null){

            var url =  "html/investigate/indexProject.html";
            var height=  window.parent.document.getElementById("ifEarth").clientHeight;
            var width= window.parent.document.getElementById("ifEarth").clientWidth;


//            var ifEarthDoc = window.ifEarth.document;
//            var earthWidth = ifEarthDoc.body.clientWidth/2;
//            var earthHeight = ifEarthDoc.body.clientHeight + 1;

            //     location.screenx=earthWidth/2-htmlbollonwidth/2;
             location.screenx=0;
            // location.screeny=earthHeight/2-htmlbollonheight/2;
             location.screeny=0;
            createHtmlBollon(url,Data,location,htmlbollonwidth,htmlbollonheight,true);
        }




    };
       //指标比对
    var indexInvestigate = function(prjid,planid){
        var htmlbollonwidth=600;
        var htmlbollonheight=320;

        var Data={};
        var ParcelData = projManager.getProjectData({id:prjid});
        var SchemeData=projManager.getPlanById(planid);
        var buildingData=projManager.getBuildingDataByPlanId(planid);

        var Data={};
        if(ParcelData.length==1){
            Data.ParcelData=ParcelData[0];
        }
        if(SchemeData.length==1){
            Data.SchemeData=SchemeData[0];
        }
        if(buildingData.length>0){
            Data.BuildingData=buildingData;
        }


        if(Data!=null){

            var url =  "html/investigate/indexInvestigate.html";
            var height=  window.parent.document.getElementById("ifEarth").clientHeight;
            var width= window.parent.document.getElementById("ifEarth").clientWidth;


//            var ifEarthDoc = window.ifEarth.document;
//            var earthWidth = ifEarthDoc.body.clientWidth/2;
//            var earthHeight = ifEarthDoc.body.clientHeight + 1;

            //     location.screenx=earthWidth/2-htmlbollonwidth/2;
            location.screenx=0;
            // location.screeny=earthHeight/2-htmlbollonheight/2;
            location.screeny=0;

            createHtmlBollon(url,Data,location,htmlbollonwidth,htmlbollonheight,true);
        }


    } ;


    var shenpi = function(){
        window.showModalDialog('html/investigate/shenpijiyao.html',earth,'dialogWidth=300px;dialogHeight=300px;status=no;')
    }
    searchAnalysis.buildingData=buildingData;
    searchAnalysis.searchBuildingData=searchBuildingData;
    searchAnalysis.parcelSeach=parcelSeach;
    searchAnalysis.ctrPlanSeach=ctrPlanSeach;
    searchAnalysis.surroundingSeach= surroundingSeach;
    searchAnalysis.createHtmlBollon=createHtmlBollon;
    searchAnalysis.spatialSeach=spatialSeach;
    searchAnalysis.baseSeach=baseSeach;
    searchAnalysis.keywordSeach=keywordSeach;
    searchAnalysis.locationSeachSeach=locationSeachSeach;
    searchAnalysis.complexSeach=complexSeach;
    searchAnalysis.indicatorsAnalysis=indicatorsAnalysis;
    searchAnalysis.removeAnalysis=removeAnalysis;
    searchAnalysis.greenLandAnalysis=greenLandAnalysis;
    searchAnalysis.ctrHeightAnalysis=ctrHeightAnalysis;
    searchAnalysis.shenpi = shenpi;
    searchAnalysis.searchBuildingDataByAnaly=searchBuildingDataByAnaly;
    searchAnalysis.clear=clear;

    //writer:cy
    searchAnalysis.IndexplanData=IndexplanData;
    searchAnalysis.ProjectIndexData=ProjectIndexData;
    searchAnalysis.indexInvestigate=indexInvestigate ;
  //  searchAnalysis.searchCameraDataByAnaly=searchCameraDataByAnaly;
    return searchAnalysis;
};