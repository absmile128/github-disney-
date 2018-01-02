var TerrainExcavate = {};
(function () {
    var resultHtml = "";
    var _result = null;      // 分析结果
    var tempClipModel = null,
        tempClipLayer = null,
        tempClipGuid = null,
        clipDepth = 0,
        level = 11,
        bufDist = 10,
        depth = 0,
        imgLocation = "http://" + getRootPath() + "/image/PipeMaterial/",
        profileTexturePath = imgLocation + "bottom.jpg";
    bottomTexturePath = imgLocation + "profile.jpg";
    function getRootPath() {
        var pathName = window.document.location.pathname;
        var localhost = window.location.host;
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return(localhost + projectName);
    }
    /**
     * 高亮闪烁显示
     * 作为表格的行的双击事件处理函数，其可见范围需在window全局作用域！
     * @param layerID  图层ID
     * @param type     对象类型：point / line
     * @param guid     对象的GUID
     * @param key      对象的US_KEY值
     */
    var northArr =[];
    var southArr =[];
    var eastArr =[];
    var westArr =[];
    var hideHigh = [];
    var  chkArr  =[];
    var chkTag = "false";
    var showTag = false;
    var dbClickHighLight=[];//双击高亮记录

    window.highlightTeObject = function (layerID, type, guid, key, flag) {
        var checkTag=$('input:checkbox[name="showResult"]').is(":checked");
        if(checkTag){
            chkTag = "true";
        }
        var layer = earth.LayerManager.GetLayerByGUID(layerID);
        var i = 0;
        var subLayer = null;
        var searchResult = null;
        var obj = null;
        for (i = 0; i < layer.GetChildCount(); i++) {
            subLayer = layer.GetChildAt(i);
            if (type === "point") {
                if (subLayer.LayerType === "Container"||subLayer.LayerType === "Vector") continue;
            } else if (type === "line") {
                if (subLayer.LayerType !== "Container"||subLayer.LayerType === "Vector") continue;
            }
            subLayer.LocalSearchParameter.ClearSpatialFilter();
            subLayer.LocalSearchParameter.ReturnDataType = 0;//0 返回所有数据，1 返回xml数据，2 返回渲染数据
            subLayer.LocalSearchParameter.PageRecordCount = 100;
            subLayer.LocalSearchParameter.SetFilter(key, "");
            subLayer.LocalSearchParameter.HasDetail = false;
            subLayer.LocalSearchParameter.HasMesh = false;
            searchResult = subLayer.SearchFromLocal();

            if (searchResult.RecordCount < 1) {
                continue;
            } else {
                obj = filterByKey(searchResult, key);
                if (obj != null) {
                    var vecCenter = obj.SphericalTransform;
                    northArr.push(obj.GetLonLatRect().North);
                    southArr.push(obj.GetLonLatRect().South);
                    eastArr.push(obj.GetLonLatRect().East);
                    westArr.push(obj.GetLonLatRect().West);
                    earth.GlobeObserver.GotoLookat(vecCenter.Longitude, vecCenter.Latitude, vecCenter.Altitude + 30, 0.0, 89.0, 0, 4);
                    if(chkTag === "true"){
                        if(flag === "true"){
                            obj.HightLightIsFlash (false);
                            obj.ShowHighLight();
                        }else {
                            if(chkArr&&chkArr.length>0){
                                var ck = true;
                                for(var j=0;j<chkArr.length;j++ ){
                                    if(chkArr[j].key === obj.GetKey()){
                                        ck = false;
                                        obj.HightLightIsFlash (true);
                                        setTimeout(function(){
                                            obj.HightLightIsFlash (false);
                                            obj.ShowHighLight();
                                        },100);
                                    }
                                }
                                if(ck){
                                    obj.HightLightIsFlash (true);
                                    obj.ShowHighLight();
                                }
                            } else{
                                obj.HightLightIsFlash (true);
                                obj.ShowHighLight();
                            }
                            //obj.ShowHighLight();
                        }
                    } else {
                        clearHighLight();
                        obj.HightLightIsFlash (true);
                        obj.ShowHighLight();
                        dbClickHighLight.splice(0,1);
                        dbClickHighLight.push(obj);
                    }
                    if(showTag){
                        showTag = false;
                        northArr.sort();
                        southArr.sort();
                        eastArr.sort();
                        westArr.sort();
                        var TO_RADIAN = 0.017453292519943295769236907684886;
                        var  SemiMajor = 6378.137;
                        var width = Math.abs(eastArr[0]-westArr[westArr.length-1] );
                        var height = Math.abs(northArr[0]-southArr[southArr.length-1]) ;
                        var x = Math.abs((eastArr[0]+westArr[westArr.length-1])/2);
                        var y = Math.abs((northArr[0]+southArr[southArr.length-1])/2);
                        var vAltitude = earth.Measure.MeasureTerrainAltitude(x,y);
                        var  vAspect1 = width / height;
                        var  vAspect = earth.offsetWidth /earth.offsetHeight;
                        var  vRange = 100;
                        if (vAspect1 > vAspect){
                            vRange = width * TO_RADIAN *SemiMajor * 1000 / Math.tan(22.5* vAspect * TO_RADIAN );//* vAspect * TO_RADIAN
                            //y=y+0.0012;
                        }
                        else {
                            vRange = height * TO_RADIAN * SemiMajor * 1000 / Math.tan(22.5* TO_RADIAN);//* TO_RADIAN
                        }
                        //(northArr[northArr.length-1]+southArr[southArr.length-1])/2
                        //var point = earth.GlobeObserver.PickTerrain((eastArr[eastArr.length-1]+westArr[westArr.length-1])/2,(northArr[northArr.length-1]+southArr[southArr.length-1])/2);
                        earth.GlobeObserver.GotoLookat(x,y,vAltitude, 0, 89.0, 0, vRange+50);
                    }

                    if(!isShowResult && bShow){
                        var parentLayerName = obj.GetParentLayerName();
                        var cArr=parentLayerName.split("=");
                        var cArr = cArr[1].split("_");
                        var layer2 = earth.LayerManager.GetLayerByGUID(cArr[0]);
                        if(cArr.length>1){
                                var bLine = parentLayerName.indexOf("container") > -1 ? 1:0;
                                var filed = top.getName("US_KEY", bLine, true);
                                            var strPara2 = "(and,equal," + filed + "," + key + ")"; // + "&pg=0,30";
                            var param = layer2.QueryParameter;
                            param.Filter = strPara2;
                            param.QueryType = 16;   // SE_AttributeData
                            param.QueryTableType = bLine;
                            param.PageRecordCount = 1;
                            var result = layer2.SearchFromGISServer();
                            if(result.RecordCount > 0)
                            {
                                    var currentRecord = parent.$.xml2json(result.gotoPage(0)).Result.Record;
                                    //显示气泡  word-break: break-all;word-wrap: break-word; 内容自动换行
                                    htmlStr = '<div style="word-break:keep-all;white-space:nowrap;overflow:auto;width:265px;height:310px;margin-top:25px;margin-bottom:25px"><table style="font-size:16px;background-color: #ffffff; color: #fffffe">';
                                    var mid;
                                    if(type != "line"){
                                        initNotLineValue(layerID,currentRecord,obj);
                                    }
                                    else {
                                        mid = initLineValue(layerID, currentRecord, parentLayerName);
                                        htmlStr = htmlStr + mid + '</table></div>';
                                        var vecCenter = obj.SphericalTransform;
                                        top.showHtmlBalloon(vecCenter.Longitude, vecCenter.Latitude, vecCenter.Altitude, htmlStr);
                                    }
                            }
                        }           
                    }

                    hideHigh.push(obj);
                    return;
                }
            }
        }
        if (obj == null&&type === "point") {
            clearHighLight();
            StatisticsMgr.sphereGotoLookat(guid, subLayer, layerID, key, bShow, null, null);
        }
    };

    ///////////////////////////////////////////////////////////
    //  双击获取属性
    //////////////////////////////////////////////////////////
    function getPlaneCoordinates(layerID,data,usKey){
        var Record=null;
        var jsonData = $.xml2json(data);
        var us_key = top.getName("US_KEY", 0, true);
        if(jsonData==null||!jsonData.Result||jsonData.Result.num==0){
            return;
        } else if(jsonData.Result.num==1){
            Record =jsonData.Result.Record;
            if(jsonData.Result.Record[us_key]!=usKey){
                return false;
            }
        }else if(jsonData.Result.num>1){
            for(var i=0;i<jsonData.Result.num;i++){
                if(jsonData.Result.Record[i][us_key]!=usKey){
                    continue;
                }else{
                    Record =jsonData.Result.Record[i];
                }
            }
        }
        var Coordinates=Record.SHAPE.Point.Coordinates;
        var coord=Coordinates.split(" ");
        var coordinate1=coord[0].split(",");
        var Coordinate=transformToPlaneCoordinates(layerID,coordinate1);
        return Coordinate;
    }

    function  transformToPlaneCoordinates(layerId,coord){
        var datum=  parent.SYSTEMPARAMS.pipeDatum;
        /*  var datum = CoordinateTransform.createDatum(); */
        var v3s1=datum.des_BLH_to_src_xy(coord[0],coord[1],coord[2]);//经纬度转平面坐标
        return {datumCoord:v3s1,originCoord:coord};
    }

var initNotLineValue = function (layerID, record, obj){
                                var strKey=record[top.getName("US_KEY",0,true)];
                                var road=record[top.getName("US_ROAD",0,true)];
                                var isScra=record[top.getName("US_IS_SCRA",0,true)];
                                var bdTime=record[top.getName("US_BD_TIME",0,true)];
                                var fxYear=record[top.getName("US_FX_YEAR",0,true)];
                                var owner=record[top.getName("US_OWNER",0,true)];
                                var state=record[top.getName("US_UPDATE",0,true)];
                                var update=record[top.getName("US_UPDATE",0,true)];
                                var altitude=(parseFloat(record[top.getName("US_PT_ALT",0,true)])).toFixed(3);
                                var attachment = record[top.getName("US_ATTACHMENT",0,true)];
                                var pointType = record[top.getName("US_PT_TYPE",0,true)];

                                var str_caption=top.getNameNoIgnoreCase("US_KEY",0,false);
                                var road_caption=top.getNameNoIgnoreCase("US_ROAD",0,false);
                                var isScra_caption=top.getNameNoIgnoreCase("US_IS_SCRA",0,false);
                                var bdTime_caption=top.getNameNoIgnoreCase("US_BD_TIME",0,false);
                                var fxYear_caption=top.getNameNoIgnoreCase("US_FX_YEAR",0,false);
                                var owner_caption=top.getNameNoIgnoreCase("US_OWNER",0,false);
                                var state_caption=top.getNameNoIgnoreCase("US_UPDATE",0,false);
                                var update_caption=top.getNameNoIgnoreCase("US_UPDATE",0,false);
                                var altitude_caption=top.getNameNoIgnoreCase("US_PT_ALT",0,false);
                                var attachment_caption = top.getNameNoIgnoreCase("US_ATTACHMENT",0,false);
                                var pointType_caption = top.getNameNoIgnoreCase("US_PT_TYPE",0,false);

                                //井类型 井直径 井脖深 井底深 井盖类型  井盖规格 井盖材质  井材质  旋转角度  偏心井点号
                                var us_well=record[top.getName("US_WELL",0,true)];
                                var us_wdia=record[top.getName("US_WDIA",0,true)];
                                var us_ndeep=(parseFloat(record[top.getName("US_NDEEP",0,true)])).toFixed(3);
                                var us_wdeep=(parseFloat(record[top.getName("US_WDEEP",0,true)])).toFixed(3);
                                var us_plate=record[top.getName("US_PLATE",0,true)];
                                var us_psize=(parseFloat(record[top.getName("US_PSIZE",0,true)])).toFixed(3);
                                var us_pmater=record[top.getName("US_PMATER",0,true)];
                                var us_wmater=record[top.getName("US_WMATER",0,true)];
                                var us_angle=record[top.getName("US_ANGLE",0,true)];
                                var us_offset=record[top.getName("US_OFFSET",0,true)];

                                var us_well_caption=top.getNameNoIgnoreCase("US_WELL",0,false);
                                var us_wdia_caption=top.getNameNoIgnoreCase("US_WDIA",0,false);
                                var us_ndeep_caption=top.getNameNoIgnoreCase("US_NDEEP",0,false);
                                var us_wdeep_caption=top.getNameNoIgnoreCase("US_WDEEP",0,false);
                                var us_plate_caption=top.getNameNoIgnoreCase("US_PLATE",0,false);
                                var us_psize_caption=top.getNameNoIgnoreCase("US_PSIZE",0,false);
                                var us_pmater_caption=top.getNameNoIgnoreCase("US_PMATER",0,false);
                                var us_wmater_caption=top.getNameNoIgnoreCase("US_WMATER",0,false);
                                var us_angle_caption=top.getNameNoIgnoreCase("US_ANGLE",0,false);
                                var us_offset_caption=top.getNameNoIgnoreCase("US_OFFSET",0,false);

                                if(road==undefined){
                                    road="";
                                }
                                if(isScra==undefined){
                                    isScra="";
                                }
                                if(bdTime==undefined){
                                    bdTime="";
                                }
                                if(fxYear==undefined){
                                    fxYear="";
                                }
                                if(owner==undefined){
                                    owner="";
                                }
                                if(state==undefined){
                                    state="";
                                }
                                if(update==undefined){
                                    update="";
                                }
                                var v3s=null;
                                var us_key = top.getName("US_KEY",0,true);
                                var strPara = "(and,equal," +us_key+",";
                                strPara += strKey;
                                strPara += ")";
                                var layer = earth.LayerManager.GetLayerByGUID(layerID);
                                var strConn=layer.GISServer + "dataquery?service=" + layerID + "&qt=17&dt=point&pc="+strPara+"&pg=0,100";
                                earth.Event.OnEditDatabaseFinished = function(pRes, pFeature){
                                    if (pRes.ExcuteType == parent.excuteType){
                                        var xmlStr = pRes.AttributeName;
                                        var xmlDoc=loadXMLStr(xmlStr);
                                        v3s=getPlaneCoordinates(layerID,xmlDoc,strKey);
                                        var tv3s = v3s["datumCoord"];
                                        originCoord = v3s["originCoord"];
                                        var X="";
                                        var Y="";
                                        if(tv3s){
                                            X=(parseFloat(tv3s.X)).toFixed(3);
                                            Y=(parseFloat(tv3s.Y)).toFixed(3);
                                        }
                                        var str = "";
                                        str += '<tr><td style="word-wrap:break-word;" width="100">&nbsp;&nbsp;&nbsp;&nbsp;'+str_caption+'</td><td style="word-wrap:break-word;" width="150">&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +record[top.getName("US_KEY",0,true)]+'</td></tr>';
                                        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;X坐标</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +X+'</td></tr>';
                                        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;Y坐标</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +Y+'</td></tr>';
                                        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+altitude_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+altitude+'</td></tr>';
                                        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+pointType_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(pointType==undefined?"":pointType)+'</td></tr>';
                                        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+attachment_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(attachment==undefined?"":attachment)+'</td></tr>';
                                        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+road_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+road+'</td></tr>';
                                        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+owner_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+owner+'</td></tr>';
                                        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+bdTime_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+bdTime+'</td></tr>';
                                        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+state_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+state+'</td></tr>';
                                        //alert("大概");
                                        //井相关字段处理
                                        if(us_well){
                                            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_well_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_well+'</td></tr>';
                                        }
                                        if(us_wdia && Number(us_wdia)){
                                            us_wdia = Number(us_wdia).toFixed(3);
                                            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_wdia_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_wdia+'</td></tr>';
                                        }
                                        if(us_ndeep && Number(us_ndeep)){
                                            us_ndeep = Number(us_ndeep).toFixed(3);
                                            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_ndeep_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_ndeep+'</td></tr>';
                                        }
                                        if(us_wdeep && Number(us_wdeep)){
                                            us_wdeep = Number(us_wdeep).toFixed(3);
                                            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_wdeep_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_wdeep+'</td></tr>';
                                        }
                                        if(us_plate){
                                            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_plate_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_plate+'</td></tr>';
                                        }
                                        if(us_psize){
                                            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_psize_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_psize+'</td></tr>';
                                        }
                                        if(us_pmater){
                                            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_pmater_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_pmater+'</td></tr>';
                                        }
                                        if(us_wmater){
                                            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_wmater_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_wmater+'</td></tr>';
                                        }
                                        if(us_angle && Number(us_angle)){
                                            us_angle = Number(us_angle).toFixed(3);
                                            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_angle_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_angle+'</td></tr>';
                                        }
                                        if(us_offset){
                                            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_offset_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_offset+'</td></tr>';
                                        }
                                        htmlStr = htmlStr + str + '</table></div>';

                                        var vecCenter = obj.SphericalTransform;
                                        top.showHtmlBalloon(vecCenter.Longitude, vecCenter.Latitude, vecCenter.Altitude, htmlStr);
                                    }
                                }
                                earth.DatabaseManager.GetXml(strConn);
}

var initLineValue = function (layerID, record, layerName){
        var US_PMATER=(top.getName("US_PMATER",1,true));
        var us_pmater_caption=(top.getName("US_PMATER",1,false));
        var material = record[US_PMATER];//管线材质

        var US_LTTYPE=(top.getName("US_LTTYPE",1,true));
        var US_LTTYPE_caption=(top.getName("US_LTTYPE",1,false));
        var lineType=record[US_LTTYPE];//埋设类型

        var US_PDIAM=(top.getName("US_SIZE",1,true));
        var US_PDIAM_caption=(top.getName("US_SIZE",1,false));
        var diam=record[US_PDIAM];
        if(diam.indexOf("X") == -1){
        	diam = parseFloat(parseFloat(diam).toFixed(2));
        }

        var US_IS_SCRA=(top.getName("US_IS_SCRA",1,true));
        var US_IS_SCRA_caption=(top.getName("US_IS_SCRA",1,false));
        var isScra=record[US_IS_SCRA];
        var US_BD_TIME=(top.getName("US_BD_TIME",1,true));
        var US_BD_TIME_caption=(top.getName("US_BD_TIME",1,false));
        var bdTime=record[US_BD_TIME];

        var US_FX_YEAR=(top.getName("US_FX_YEAR",1,true));
        var US_FX_YEAR_caption=(top.getName("US_FX_YEAR",1,false));

        var US_STATE=(top.getName("US_STATUS",1,true));
        var US_STATE_caption=(top.getName("US_STATUS",1,false));
        var state=record[US_STATE];

        var US_UPDATE=(top.getName("US_UPDATE",1,true));
        var US_UPDATE_caption=(top.getName("US_UPDATE",1,false));
        var update= record[US_UPDATE];

        var US_OWNER=(top.getName("US_OWNER",1,true));
        var US_OWNER_caption=(top.getName("US_OWNER",1,false));
        var owner=record[US_OWNER];

        var US_ROAD=(top.getName("US_ROAD",1,true));
        var US_ROAD_caption=(top.getName("US_ROAD",1,false));
        var road=record[US_ROAD];
        var str_caption=top.getNameNoIgnoreCase("US_KEY",1,false);
        if(bdTime==undefined){
            bdTime="";
        }
        if(state==undefined){
            state="";
        }
        if(update==undefined){
            update="";
        }
        if(isScra==undefined){
            isScra="";
        }
        if(owner==undefined){
            owner="";
        }
        if(road==undefined){
            road="";
        }
        var str = "";
        str += '<tr><td  width="100">&nbsp;&nbsp;&nbsp;&nbsp;' + str_caption +'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+record[top.getName("US_KEY",1,true)]||""+'</td></tr>';
        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+US_LTTYPE_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+lineType+'</td></tr>';
        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_pmater_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(material==undefined?"":material)+'</td></tr>';
        if(diam!= 0){
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+US_PDIAM_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+diam+'</td></tr>';
        }
        var layer=earth.LayerManager.GetLayerByGUID(layerID);
        var intLayerCode = layer.PipeLineType;
        //燃气、热力、工业管线显示
        if ((intLayerCode >= 5000 && intLayerCode < 6000)||(intLayerCode >= 6000 && intLayerCode < 7000)||(intLayerCode >= 7000 && intLayerCode < 8000)){
            var pressur= record[top.getName("US_PRESSUR",1,true)];//压力
            var pressur_caption= top.getName("US_PRESSUR",1,false);
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+pressur_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(pressur!=undefined?pressur:"")+'</td></tr>';
        }
        //压力
        if(intLayerCode >= 1000 && intLayerCode < 2000){
            var voltage= record[top.getName("US_PRESSUR",1,true)];
            var voltage_caption= top.getName("US_PRESSUR",1,false);
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+voltage_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(voltage==undefined?"":voltage)+'</td></tr>';
        }
        //排水和工业管道显示
        if ((intLayerCode >= 4000 && intLayerCode < 5000)||(intLayerCode >= 7000 && intLayerCode < 8000)){
            var flower=record[top.getName("US_FLOWDIR",1,true)];
            var flower_caption=top.getName("US_FLOWDIR",1,false);
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+flower_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(flower==undefined?"":flower)+'</td></tr>';
        }
        //电力、电信
        if ((intLayerCode >= 1000 && intLayerCode < 2000)||(intLayerCode >= 2000 && intLayerCode < 3000)){
            var ventnum=record[top.getName("US_VENTNUM",1,true)];
            var holeto=record[top.getName("US_HOLETOL",1,true)];
            var holeused=record[top.getName("US_HOLEUSE",1,true)];
            var ventnum_caption=top.getName("US_VENTNUM",1,false);
            var holeto_caption=top.getName("US_HOLETOL",1,false);
            var holeused_caption=top.getName("US_HOLEUSE",1,false);
            //电压值
            var US_PSVALUE=(top.getName("US_PSVALUE",1,true));
            var US_PSVALUE_caption=(top.getName("US_PSVALUE",1,false));
            var psvalue=record[US_PSVALUE];

            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ventnum_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(ventnum==undefined?"":ventnum)+'</td></tr>';
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+holeto_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(holeto==undefined?"":holeto)+'</td></tr>';
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+holeused_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(holeused==undefined?"":holeused)+'</td></tr>';
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+US_PSVALUE_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(psvalue==undefined?"":psvalue)+'</td></tr>';
        }

        $("#tblLineResult").append('<tr><td class="col w75p">'+US_ROAD_caption+'</td><td class="col w25p">'+road+'</td></tr>');
        $("#tblLineResult").append('<tr><td class="col w75p">'+US_OWNER_caption+'</td><td class="col w25p">'+owner+'</td></tr>');
        $("#tblLineResult").append('<tr><td class="col w75p">'+US_BD_TIME_caption+'</td><td class="col w25p">'+bdTime+'</td></tr>');
        $("#tblLineResult").append('<tr><td class="col w75p">'+US_STATE_caption+'</td><td class="col w25p">'+state+'</td></tr>');


        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+US_ROAD_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+road+'</td></tr>';
        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+US_OWNER_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+owner+'</td></tr>';
        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+US_BD_TIME_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+bdTime+'</td></tr>';
        str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+US_STATE_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+state+'</td></tr>';
        return str;
    }

    //清除双击高亮
    var clearHighLight=function(){
        if(dbClickHighLight.length>0&&parent.earth!=null){
            dbClickHighLight[0].StopHighLight();
        }
        StatisticsMgr.detachShere();
    }
    /**
     * 在搜索的结果集中根据key值确定具体的对象
     * @param searchResult  搜索结果集
     * @param key           对象的US_KEY值
     * @return {*}          返回匹配的对象
     */
    var filterByKey = function (searchResult, key) {
        var obj = null;
        if (searchResult.RecordCount === 0) {
            return null;
        }
        searchResult.GotoPage(0);
        for (var i = 0; i < searchResult.RecordCount; i++) {
            obj = searchResult.GetLocalObject(i);
            if (null == obj) continue;
            if (obj.GetKey() == key) {
                obj.Underground = true;   // SEObjectFlagType.ObjectFlagUnderground
                return obj;
            }
        }
        return null;
    };
    var clear = function () {
        earth.ShapeCreator.Clear();
        earth.Event.OnCreateGeometry = function () {
        };
    };
    var tempClipLayersList = [];
    //开挖
    var createNewLayer = function () {
        earth.Event.OnAnalysisFinished = function (res) {
            _result = res;
        };
        var tempDemPath = earth.Environment.RootPath + "\\temp\\terrain\\";
        var tempPolyPath = earth.Environment.RootPath + "\\temp\\polygon\\";
        var rect = earth.TerrainManager.GetTempLayerRect();
        var levelMin = earth.TerrainManager.GetTempLayerMinLevel();
        var levelMax = earth.TerrainManager.GetTempLayerMaxLevel();

        var guid = earth.Factory.CreateGUID();
        if (tempClipLayer != null) {
            earth.DetachObject(tempClipLayer);
            tempClipLayer = null;
        }
        tempClipLayer = earth.Factory.CreateDemLayer(guid, "TempTerrainLayer", tempDemPath,
            rect, levelMin, levelMax, 1000);
        earth.AttachObject(tempClipLayer);
        //tempClipLayersList.push(tempClipLayer);
    };
    var clipModelList = [];
    var createClipModel = function (args, modelGuid, modelName) {
        if (modelGuid == null) {
            modelGuid = earth.Factory.CreateGUID();
        }
        if (modelName == null) {
            modelName = "ClipModel";
        }
        var terrain = earth.TerrainManager;
        var sampArgs = terrain.GenerateSampledCoordinates(args);
        tempClipModel = terrain.GenerateClipModel(modelGuid, modelName, args, sampArgs, profileTexturePath, bottomTexturePath);

        earth.AttachObject(tempClipModel);
        clipModelList.push(tempClipModel);
        return tempClipModel;
    };

    // var createClipTerrainModel = function(pval, modelName){
    //     earth.TerrainManager.ClipTerrainByPolygonEx(earth.Factory.CreateGUID(), pval);
    //     var outSampledCoords = earth.TerrainManager.GenerateSampledCoordinates(pval);
    //     var model = earth.TerrainManager.GenerateClipModel(earth.Factory.CreateGUID(), "ClipModel", pval, outSampledCoords, "", "");
    //     earth.AttachObject(model);
    //     clipModelList.push(tempClipModel);
    // }

    var polygonAlt = 0;
    var  roadVec3s = null;
    var btmAttitude = 0;//开挖后的底面的高程值
    var onCreatePolyline = function (pFeat, geoType) {
        clear();
        var pntNum = pFeat.Count;
        if (pntNum < 2) {
            alert("应至少取两个点以进行开挖!");
            return;
        }
        var gpts0 = earth.Factory.CreateGeoPoints();
        for (var i = 0; i < pntNum; i++) {
            gpts0.Add(pFeat.Items(i).X, pFeat.Items(i).Y, pFeat.Items(i).Z);
        }
        var vec3s0 = earth.Factory.CreateVector3s();
        var vecTest = earth.GeometryAlgorithm.CreatePolygonFromPolylineAndWidth(gpts0, bufDist, bufDist);
        for (var i = 0; i < vecTest.Count-1; i++) {
            vec3s0.Add(vecTest.GetPointAt(i).Longitude, vecTest.GetPointAt(i).Latitude, vecTest.GetPointAt(i).Altitude);
        }
        roadVec3s = vec3s0;

        var height = pFeat.Items(0).Z;
        polygonAlt = height;
        clipDepth = height - depth;
        var vec3 = null;
        var gpts = earth.Factory.CreateGeoPoints();
        for (var i = 0; i < pntNum; i++) {
            vec3 = pFeat.Items(i);
            gpts.Add(vec3.X, vec3.Y, clipDepth);
        }
        var bufferedPts = earth.GeometryAlgorithm.CreatePolygonFromPolylineAndWidth(gpts, bufDist, bufDist);

        var vec3s = earth.Factory.CreateVector3s();
        for (var i = 0; i < bufferedPts.Count; i++) {
            var pt = bufferedPts.GetPointAt(i);
            vec3s.Add(pt.Longitude, pt.Latitude, pt.Altitude);
        }
        //roadVec3s = vec3s;
        //var modelGuid = earth.Factory.CreateGUID();
        earth.TerrainManager.SetMinClipLevel(level);

        if(checkExcave1){
            tempClipGuid = earth.Factory.CreateGUID();
            earth.TerrainManager.ClipTerrainByPolygonEx(tempClipGuid,vec3s);
        }else{
            earth.TerrainManager.ClipTerrainByPolygon(vec3s);
        }
        
        createNewLayer();
        if(checkTag1){
            var clipModel = createClipModel(vec3s);
        }

      /*  var id = clipModel.Guid;嘎嘎嘎                                                                                                              
        var name = clipModel.Name;*/
        earth.Event.OnAnalysisFinished = function (result, alt) {
            // $("#btnStart").customAttr("disabled","disabled") ;
            var res = result.Excavation.toFixed(2) + "m<sup>3</sup>";
            labelObj.html(res);

        };
        //setTimeout(function (){
            earth.Analysis.SurfaceExcavationAndFill(clipDepth, vec3s);
        //},100);

        //createClipTerrainNode(id, name, level, vec3s);
        earth.ShapeCreator.Clear();
        earth.Event.OnCreateGeometry = function () {
        };
        analysisRS.removeAttr("disabled");
        $("div[tag=EditHideTempTerrain]").customAttr("disabled", false);
        $("div[tag=EditDeleteTempTerrain]").customAttr("disabled", false);
    };
    var roadAnalysis = function(){
        clearHighLight();
        resultArr = [];
        $.each(pipelineList, function (i, v) {
            var vv = $(v);
            var guid = vv[0].id;  // checkbox的value值
            var name = vv[0].name;
            var layer = earth.LayerManager.GetLayerByGUID(guid);
			if(layer.Visibility){		
				var subLayer = null;
				for(var pipelnType in [0,1]){
					for (var i = 0, len = layer.GetChildCount(); i < len; i++) {
						subLayer = layer.GetChildAt(i);
						if(pipelnType == 0){//管点
							if (subLayer.LayerType === "Container" || subLayer.LayerType === "Vector" || subLayer.LayerType === "Plate") {//过滤掉缓冲区图层 和井盖图层（井盖图层Plate 和井图层Well 重复）ADD BY JIARONG NOV27，2015
								continue;
							}
						}else{//管线
							if (subLayer.LayerType != "Container") {
								continue;
							}
						}

						if (subLayer == null || subLayer.QueryParameter == null) {
							return;
						}
						var param = subLayer.QueryParameter;
						param.Filter = "";
						param.QueryType = 17;   // 空间数据属性数据都返回
						param.SetSpatialFilter(roadVec3s);
						param.PageRecordCount = 200;//设置每一页显示的数据为200
						param.QueryTableType = pipelnType;
						var result = subLayer.SearchFromGISServer();
						if (result.RecordCount > 0) {
							parseResult(result.GotoPage(0), guid, name, layer.PipeLineType, subLayer);
						}
					}
				}
			}
        });
        showResultPage(1);
    };
    /**
     * 道路开挖
     */
    var roadClip = function (pDepth, pLevel, dist) {
        // deleteTempTerrain();
        earth.Event.OnCreateGeometry = onCreatePolyline;
        earth.ShapeCreator.Clear();
        depth = parseFloat(pDepth);
        level = parseFloat(pLevel);
        bufDist = dist;
        earth.ShapeCreator.CreatePolyline(2, 255);
    };
    /**
     * 功能：获取指定图层下的所有管线图层列表
     * 参数：layer-指定图层
     * 返回：指定图层下的所有管线图层列表
     */
    var getPipeListByLayer = function(layer){
        var pipelineArr = [];
        var count = layer.GetChildCount();
        for(var i = 0; i < count; i++){
            var childLayer = layer.GetChildAt(i);
            var layerType = childLayer.LayerType;
            if(layerType === "Pipeline"){
                var pipelineId = childLayer.Guid;
                var pipelineName = childLayer.Name;
                var pipelineServer=childLayer.GISServer;
                pipelineArr.push({id : pipelineId, name : pipelineName,server:pipelineServer});
            }else{
                var childCount = childLayer.GetChildCount();
                if(childCount > 0){
                    var childPipelineArr = getPipeListByLayer(childLayer);
                    for(var k = 0; k < childPipelineArr.length; k++){
                        pipelineArr.push(childPipelineArr[k]);
                    }
                }
            }
        }
        return pipelineArr;
    };
    /**
     * 道路开挖
     */
    var projectId = "";
    var pipelineList= [];
    var labelObj ;
    var showTable ="";
    var importTable = "";
    var checkTag1;
    var checkExcave1;
    var analysisRS=null;
    var mObjs = [];
    var roadClipAnaly = function (pDepth, pLevel, dist,id,html,roadInfo,show,importObj,checkTag,checkExcave,analysisR) {
        analysisRS = analysisR;
        checkTag1 = checkTag;
        checkExcave1 = checkExcave;
        showTable = show;
        importTable = importObj;
        deleteTempTerrainAnaly();
        labelObj = roadInfo;
        projectId = id;
        resultHtml = html;
        analysisRS.customAttr("disabled","disabled");
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        pipelineList = getPipeListByLayer(layer);
        // deleteTempTerrain();
        earth.Event.OnCreateGeometry = onCreatePolyline;
        earth.ShapeCreator.Clear();
        depth = parseFloat(pDepth);
        level = parseFloat(pLevel);
        bufDist = dist;
        earth.ShapeCreator.CreatePolyline(2, 255);
        resultArr = [];
    };
    //导入坐标
    var importClipAnaly = function (vector3s,pDepth, pLevel,id,html,roadInfo,show,importObj,checkTag,checkExcave,analysisR){
        analysisRS = analysisR;
        checkTag1 = checkTag;
        checkExcave1 = checkExcave;
        showTable = show;
        importTable = importObj;
        labelObj = roadInfo;
        projectId = id;
        resultHtml = html;
        analysisRS.customAttr("disabled","disabled");
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        pipelineList = getPipeListByLayer(layer);
        // deleteTempTerrain();
        earth.ShapeCreator.Clear();
        depth = parseFloat(pDepth);
        level = parseFloat(pLevel);
        onCreatePolygon(vector3s);
    }
    //自定义开挖
    var onCreatePolygon = function (pFeat, geoType) {
        //var  pFeat1= pFeat;
        clear();
        var pntNum = pFeat.Count;

        if (pntNum < 3) {
            alert("应至少取三个点以进行开挖!");
            return;
        }
        
        var height = pFeat.Items(0).Z;
        polygonAlt = height;
        clipDepth = height - depth;
        roadVec3s = pFeat.Clone();

        //计算绘制面的中心点坐标 进而计算出开挖后的底面的高程值
        var v3s = earth.Factory.CreateVector3s();
        for(var j = 0; j<pntNum; j++){
            var v3 = earth.Factory.CreateVector3();
            v3.X = pFeat.Items(i).X;
            v3.Y = pFeat.Items(i).Y;
            v3.Z = 0;
            v3s.AddVector(v3);
        }
        var bufPolygon = earth.Factory.CreateElementPolygon(earth.Factory.CreateGUID(), "");
        bufPolygon.BeginUpdate();
        bufPolygon.SetExteriorRing(v3s);
        bufPolygon.AltitudeType = 1;
        bufPolygon.visibility = false;
        bufPolygon.EndUpdate();
        var polyCenter = bufPolygon.SphericalTransform;
        //alert(polyCenter.X + " " + polyCenter.Y);
        var alt = earth.Measure.MeasureTerrainAltitude(polyCenter.Longitude, polyCenter.Latitude);//返回指定地理位置的高程值，忽略除地形外其他地物（如建筑物）。 如果是True，只通过本地数据获取高程值。如果是False，将通过服务获取高程值
        btmAttitude = alt - depth;
        //alert("底面高程值:" + btmAttitude + " " + alt + " " + depth);
        for (var i = 0; i < pntNum; i++) { 
            pFeat.SetAt(i, pFeat.Items(i).X, pFeat.Items(i).Y, clipDepth);
        }
        earth.TerrainManager.SetMinClipLevel(level);
        //earth.TerrainManager.ClipTerrainByPolygon(pFeat);
        if(checkExcave1){
            tempClipGuid = earth.Factory.CreateGUID();
            earth.TerrainManager.ClipTerrainByPolygonEx(tempClipGuid,pFeat);    
        }else{
            earth.TerrainManager.ClipTerrainByPolygon(pFeat);
        }
        
        if (tempClipLayer != null) {
            earth.DetachObject(tempClipLayer);
            tempClipLayer = null;
        }
        createNewLayer();

        if(checkTag1){
            var clipModel = createClipModel(pFeat);
        }
        earth.Event.OnAnalysisFinished = function (result, alt) {
            // $("#btnStart").customAttr("disabled","disabled") ;
            var res = result.Excavation.toFixed(2) + "m<sup>3</sup>";
            labelObj.html(res);

        };
        //第一个参数 是高程值 第二个参数是多边形
        earth.Analysis.SurfaceExcavationAndFill(clipDepth, pFeat);
        earth.ShapeCreator.Clear();
        earth.Event.OnCreateGeometry = function () {
        };
        analysisRS.removeAttr("disabled");
        $("div[tag=EditHideTempTerrain]").customAttr("disabled", false);
        $("div[tag=EditDeleteTempTerrain]").customAttr("disabled", false);

    };

    //采用体与体求交的方式判断开挖模型是否与管线观点相交
    var bIntersectTandT = function(curlayer, key){
        curlayer.LocalSearchParameter.ClearSpatialFilter();
        curlayer.LocalSearchParameter.ReturnDataType = 0;//0 返回所有数据，1 返回xml数据，2 返回渲染数据
        curlayer.LocalSearchParameter.PageRecordCount = 100;
        curlayer.LocalSearchParameter.SetFilter(key, "");
        curlayer.LocalSearchParameter.HasDetail = true;
        curlayer.LocalSearchParameter.HasMesh = true;
        var localresult = curlayer.SearchFromLocal();
        if(localresult == null){
            return false;
        }
        localresult.GotoPage(0);
        for (var i = 0; i < localresult.RecordCount; i++) {
            var lobjKey = localresult.GetLocalObjectKey(i);
            if(lobjKey != key){
                continue;
            }
            var lobj = localresult.GetLocalObject(i);
            if (!lobj) {
                continue;
            }
            var meshV3s = localresult.GetMeshVertices(i);
            if(meshV3s == null){
                continue;
            }
            var alt = roadVec3s.Items(0).Z;//与开挖时高程保持一致
            alt = alt - depth;
            var bResult = false;
            bResult = earth.GeometryAlgorithm.GetPolygonPointSetRelationship(roadVec3s, alt, meshV3s);
            if (bResult) {
                return true;
            }
            else{
                return false;
            }
        }
        return false;
    }

    /**
     * 解析查询结果，添加到结果表格中
     * 开挖分析 这里要把查询到的管线进行比对 用管线的高程与埋深跟开挖深度比较 只有排水类的埋深是从管子的底部开始的 
     * 先计算出挖后的地面的高程 然后用管段的起点高程与止点高程与之比对 在其之间就列举出来
     * todo......
     * @param result 查询结果
     * @param guid 图层ID
     * @param name 图层名
     */
    var resultArr = [];
    var parseResult = function (result, guid, name, pipeType, clayer) {
        if (result == "" || result == null) {
            return;
        }
        var json = $.xml2json(result);
        var type = json.Result.geometry;
        var displayType = type === "point" ? "管点" : "管线";
        type = type === "point" ? "point" : "line";
        var nameType=1;
        nameType = type === "point"?0:1;
        var records = json.Result.Record;
        if(records){
            if (json.Result.num <= 0) {
                return;
            } else if (json.Result.num == 1) {
                var key=records[top.getName("US_KEY",nameType,true)];
                if(bIntersectTandT(clayer,key)){
					if(type=="point"){//管点，则获取具体类型
						if(json.Result.Record.WELLTYPE !=""){
							displayType =json.Result.Record.WELLTYPE; 
						}else{
							displayType =json.Result.Record.POINTTYPE;
						}
						
					}
					resultArr.push({record:records,name:name,guid:guid,key:key,type:type,displayType:displayType});
                }
            } else {
                for (var i = 0; i < records.length; i++) {
                    var rescord = records[i];
                    var key=rescord[top.getName("US_KEY",nameType,true)];
                    if(bIntersectTandT(clayer,key)){
						if(type=="point"){//管点，则获取具体类型
							if(json.Result.Record[i].WELLTYPE !=""){
								displayType =json.Result.Record[i].WELLTYPE; 
							}else{
								displayType =json.Result.Record[i].POINTTYPE;
							}
							
						}						
                        resultArr.push({record:rescord,name:name,guid:guid,key:key,type:type,displayType:displayType});
                    }
                }
            }
        }
    };
    var pageNum = 0;
    var showResultPage = function (page){
        pageNum = page;
        resultHtml.empty();
        var template = '<tr ondblclick=highlightTeObject("$LayerID","$TYPE","$GUID","$KEY","$DISPLAYTYPE")' +
            '><td class="col1">$INDEX</td><td class="col2">$DISPLAYTYPE2</td><td class="col3">$LAYER</td></tr>';
        //for(var i=(page-1)*10;i<page*10;i++){
        var nameType=1;
        var indexs = [];
        for(var i=0;i<resultArr.length;i++){
            if(i > resultArr.length - 1){
                resultHtml.append("");
            } else {
                if(resultArr[i].displayType === "管线"){
                    nameType=1;
                }else{
                    nameType=0;
                }
                if(resultArr[i].record[top.getName("US_KEY",nameType,true)] in indexs){
                   continue;
                }
                else{
                    indexs.push(resultArr[i].record[top.getName("US_KEY",nameType,true)]);
                }
                resultHtml.append(template.replace("$INDEX", resultArr[i].record[top.getName("US_KEY",nameType,true)])
                    .replace("$DISPLAYTYPE", resultArr[i].record[top.getName("US_FEATURE",nameType,true)] ? resultArr[i].record[top.getName("US_FEATURE",nameType,true)] : resultArr[i].displayType)
                    .replace("$DISPLAYTYPE2", resultArr[i].record[top.getName("US_FEATURE",nameType,true)] ? resultArr[i].record[top.getName("US_FEATURE",nameType,true)] : resultArr[i].displayType)
                    .replace("$LAYER", resultArr[i].name)
                    .replace("$LayerID", resultArr[i].guid)
                    .replace("$TYPE", resultArr[i].type)
                    .replace("$GUID", resultArr[i].record[top.getName("US_KEY",nameType,true)])
                    .replace("$KEY", resultArr[i].record[top.getName("US_KEY",nameType,true)]));
            }
        }
        importTable.customAttr("disabled",false);
        showTable.customAttr("disabled", false);
    }
    var getResultArr = function(){
        return resultArr;
    }
    var highlightObjectFromTunnel = function (flag){
        northArr =[];
        southArr =[];
        eastArr =[];
        westArr =[];
        if(flag === "true"){
            chkTag = "true";
            chkArr = resultArr;
            if(resultArr.length != 0){
                for (var i=0;i<resultArr.length;i++){
                    if(i===resultArr.length-1){
                        showTag = true;
                    }
                    var nameType=0;
                    if(resultArr[i].displayType === "管线"){
                        nameType=1;
                    }
                    highlightTeObject(resultArr[i].guid, resultArr[i].type,resultArr[i].record[top.getName("US_KEY",nameType,true)],resultArr[i].record[top.getName("US_KEY",nameType,true)],"true") ;
                }
            }
        }else {
            showTag = false;
            chkTag = "false";
            if( hideHigh.length != 0&&parent.earth!=null){
                for (var i=0;i< hideHigh.length;i++){
                    hideHigh[i].StopHighLight();
                }
            }
        }
    };
    /**
     * 自定义开挖
     */
    var customClip = function (pDepth, pLevel) {
        //deleteTempTerrain();

        earth.Event.OnCreateGeometry = onCreatePolygon;
        earth.ShapeCreator.Clear();
        depth = parseFloat(pDepth);
        level = parseFloat(pLevel);
        earth.ShapeCreator.CreatePolygon();
    };
    var customClipAnaly = function (pDepth, pLevel,id,html,roadInfo,show,importObj,checkTag,checkExcave,analysisR) {
        analysisRS =analysisR;
        checkTag1=checkTag;
        checkExcave1=checkExcave;
        showTable = show;
        importTable = importObj;
        deleteTempTerrainAnaly();
        labelObj = roadInfo;
        projectId = id;
        resultHtml = html;
        analysisRS.customAttr("disabled","disabled");
//ADD by JIARONG 循环所有工程==================
		StatisticsMgr.getProjectList();
		pipelineList=[];
		var pipeprojects = StatisticsMgr.projectList;
		for(var i=0; i< pipeprojects.length; i++){
			projectId = pipeprojects[i].projectId;
			var layer = earth.LayerManager.GetLayerByGUID(projectId);
			pipelineList = pipelineList.concat(getPipeListByLayer(layer));
		}
		//alert(pipelineList);
        earth.Event.OnCreateGeometry = onCreatePolygon;
        earth.ShapeCreator.Clear();
        depth = parseFloat(pDepth);
        level = parseFloat(pLevel);
        earth.ShapeCreator.CreatePolygon();
    };
    /**
     * 删除临时地形
     */
    var deleteTempTerrainAnaly = function () {
        earth.ShapeCreator.Clear();
        earth.TerrainManager.ClearTempLayer();
        if(tempClipGuid != null){
            earth.TerrainManager.DeletePolygonByGUID(tempClipGuid);
            tempClipGuid = null;
        }
        if (_result) {
            _result.ClearRes();
            _result = null;
        }
        if (clipModelList.length > 0) {
            for (var i = 0; i < clipModelList.length; i++) {
                var tempClipModel = clipModelList[i];
                if (tempClipModel != null) {
                    earth.DetachObject(tempClipModel);
                    tempClipModel = null;
                }
            }
        }
        clipModelList.splice(0, clipModelList.length);
        if (tempClipLayer != null) {
            earth.DetachObject(tempClipLayer);
            tempClipLayer = null;
        }

        tempClipLayersList.splice(0, tempClipLayersList.length);
    };
    /**
     * 隐藏临时地形
     */
    var hideTempTerrain = function () {
        var toolItem = $("div[tag=EditHideTempTerrain]");
        toolItem.toggleClass("selected");
        if (toolItem.hasClass("selected")) {
            setClipTerrainVis(false);
        } else {
            setClipTerrainVis(true);
        }
    };

    /**
     * 设置地形的可见性
     */
    var setClipTerrainVis = function (visibility) {
        for (var i = 0; i < clipModelList.length; i++) {
            var tempClipModel = clipModelList[i];
            tempClipModel.Visibility = visibility;
        }
        if (visibility == true) {
            earth.AttachObject(tempClipLayer);
        } else {
            earth.DetachObject(tempClipLayer);
        }
    };

    /**
     * 删除临时地形
     */
    var deleteTempTerrain = function () {
        earth.ShapeCreator.Clear();
        earth.TerrainManager.ClearTempLayer();
        if (_result) {
            _result.ClearRes();
            _result = null;
        }
        if (clipModelList.length > 0) {
            for (var i = 0; i < clipModelList.length; i++) {
                var tempClipModel = clipModelList[i];
                if (tempClipModel != null) {
                    earth.DetachObject(tempClipModel);
                    deleteClipTerrainNode(tempClipModel.Guid);
                    tempClipModel = null;
                }
            }
        }
        clipModelList.splice(0, clipModelList.length);
        if (tempClipLayer != null) {
            earth.DetachObject(tempClipLayer);
            tempClipLayer = null;
        }

        tempClipLayersList.splice(0, tempClipLayersList.length);
        $("div[tag=EditHideTempTerrain]").customAttr("disabled", true);
        $("div[tag=EditDeleteTempTerrain]").customAttr("disabled", true);
        var toolItem = $("div[tag=EditHideTempTerrain]");
        if (toolItem.hasClass("selected")) {
            toolItem.removeClass("selected");
        }
    };

    /**
     * 功能：保存开挖信息信息
     * 参数：docXml-要保存的开挖信息信息
     * 返回：无
     */
    var saveClipTerrainFile = function (docXml) {
        var savePath = earth.Environment.RootPath + "temp\\clipterrain";
        earth.UserDocument.SaveXmlFile(savePath, docXml);
    };

    /**
     * 功能：创建开挖信息文档
     * 参数：无
     * 返回：新建创建的文档内容
     */
    var createClipTerrainFile = function () {
        var xmlStr = '<xml></xml>';
        saveClipTerrainFile(xmlStr);
        return xmlStr;
    };

    /**
     * 功能：获取开挖信息文档对象
     * 参数：无
     * 返回：开挖信息文档对象
     */
    var getClipTerrainFile = function () {
        var loadPath = earth.Environment.RootPath + "temp\\clipterrain.xml";
        var docXml = earth.UserDocument.LoadXmlFile(loadPath);
        if ((docXml == null) || (docXml == "")) {
            docXml = createClipTerrainFile();
        }
        var clipTerrainDoc = loadXMLStr(docXml);
        return clipTerrainDoc;
    };

    /**
     * 功能：创建开挖对象节点
     * 参数：id-开挖的模型对象的编号；name-开挖的模型对象的名称；minLevel-开挖地形的最小级别；clipVec3s-开挖地形的范围点集
     * 返回：开挖对象节点
     */
    var createClipTerrainNode = function (id, name, minLevel, clipVec3s) {
        var attrArr = [
            {name: "id", value: id},
            {name: "name", value: name}
        ];
        var clipCoordinate = "";
        for (var i = 0; i < clipVec3s.Count; i++) {
            var pt = clipVec3s.Items(i);
            if (clipCoordinate == "") {
                clipCoordinate = pt.X + "," + pt.Y + "," + pt.Z;
            } else {
                clipCoordinate = clipCoordinate + "," + pt.X + "," + pt.Y + "," + pt.Z;
            }
        }
        var clipTerrainDoc = TerrainExcavate.clipTerrainDoc;
        var clipTerrainNode = createElementNode("ClipTerrain", attrArr, clipTerrainDoc);
        clipTerrainNode.appendChild(createElementText("ClipCoordinate", clipCoordinate, clipTerrainDoc));
        clipTerrainNode.appendChild(createElementText("MinClipLevel", minLevel, clipTerrainDoc));
        clipTerrainDoc.documentElement.appendChild(clipTerrainNode);
        saveClipTerrainFile(clipTerrainDoc.xml);
        return clipTerrainNode;
    };

    /**
     * 功能：删除开挖对象节点
     * 参数：id-开挖的ID编号
     * 返回：无
     */
    var deleteClipTerrainNode = function (id) {
        var clipTerrainNode = lookupNodeById(TerrainExcavate.clipTerrainDoc, id);
        clipTerrainNode.parentNode.removeChild(clipTerrainNode);
        saveClipTerrainFile(TerrainExcavate.clipTerrainDoc.xml);
    };

    /**
     * 功能：初始化开挖列表，从开挖文档中读取信息并将信息转化成开挖对象
     * 参数：clipTerrainDoc-开挖文档对象
     * 返回：无
     */
    var initClipTerrainObj = function (clipTerrainDoc) {
        var clipTerrainRoot = clipTerrainDoc.documentElement;
        for (var i = 0; i < clipTerrainRoot.childNodes.length; i++) {
            var clipTerrainNode = clipTerrainRoot.childNodes[i];
            var id = clipTerrainNode.getAttribute("id");
            var name = clipTerrainNode.getAttribute("name");
            var clipCoordinate = clipTerrainNode.selectSingleNode("ClipCoordinate").text;
            var minClipLevel = parseFloat(clipTerrainNode.selectSingleNode("MinClipLevel").text);
            var vec3s = earth.Factory.CreateVector3s();
            var clipCoordArr = clipCoordinate.split(",");
            for (var k = 0; k < clipCoordArr.length; k = k + 3) {
                vec3s.Add(clipCoordArr[k], clipCoordArr[k + 1], clipCoordArr[k + 2]);
            }
            earth.TerrainManager.SetMinClipLevel(minClipLevel);
            //earth.TerrainManager.ClipTerrainByPolygon(vec3s);
            if(checkExcave1){
                tempClipGuid = earth.Factory.CreateGUID();
                earth.TerrainManager.ClipTerrainByPolygonEx(tempClipGuid,vec3s);
            }else{
                earth.TerrainManager.ClipTerrainByPolygon(vec3s);
            }
            createNewLayer();
            createClipModel(vec3s, id, name);
        }

        if (clipModelList.length > 0) {
            $("div[tag=EditHideTempTerrain]").customAttr("disabled", false);
            $("div[tag=EditDeleteTempTerrain]").customAttr("disabled", false);
        }
    };

    /**
     * 功能：获取开挖地形树的数据
     * 参数：clipTerrainDoc-开挖文档对象
     * 返回：无
     */
//	var getClipTerrainData = function(){
//		var obj = {
//			id: 'userData',
//		 	name: '用户数据',
//			checked : true,
//			open:true,
//			isParent:true,
//			children: []
//		};
//		for(var i=0; i<clipModelList.length; i++){
//			var clipModel = clipModelList[i];
//			var clipTreeNode = {
//				id: clipModel.Guid,
//				name: clipModel.Name,
//				checked: clipModel.Visibility
//			};
//			obj.children.push(clipTreeNode);
//		}
//		var clipTerrainData = [obj];
//		return clipTerrainData;
//	};

//	var getClipModelIndexById = function(modelId){
//		var clipModelIndex = -1;
//		for(var i=0; i<clipModelList.length; i++){
//			if(clipModelList[i].Guid == modelId){
//				clipModelIndex = i;
//				break;
//			}
//		}
//		return clipModelIndex;
//	};

//	var getClipModelById = function(modelId){
//		var clipModel = null;
//		var clipModelIndex = getClipModelIndexById(modelId);
//		if(clipModelIndex != -1){
//			clipModel = clipModelList[clipModelIndex];
//		}
//		return clipModel;
//	};
//
//	var getClipLayerById = function(modelId){
//		var clipLayer = null;
//		var clipModelIndex = getClipModelIndexById(modelId);
//		if(clipModelIndex != -1){
//			clipLayer = tempClipLayersList[clipModelIndex];
//		}
//		return clipLayer;
//	};

//	var deltetClipTerrainById = function(modelId){
//		var clipModelIndex = getClipModelIndexById(modelId);
//		if(clipModelIndex != -1){
//			earth.DetachObject(clipModelList[clipModelIndex]);
//			earth.DetachObject(tempClipLayersList[clipModelIndex]);
//			clipModelList.splice(clipModelIndex, 1);
//			tempClipLayersList.splice(clipModelIndex, 1);
//			deleteClipTerrainNode(modelId);
//		}
//	};

    TerrainExcavate.roadClip = roadClip;
    TerrainExcavate.customClip = customClip;
    TerrainExcavate.roadClipAnaly = roadClipAnaly;
    TerrainExcavate.customClipAnaly = customClipAnaly;
    TerrainExcavate.deleteTempTerrainAnaly=deleteTempTerrainAnaly ;
    TerrainExcavate.highlightObjectFromTunnel=highlightObjectFromTunnel;
    TerrainExcavate.hideTempTerrain = hideTempTerrain;
    TerrainExcavate.deleteTempTerrain = deleteTempTerrain;
    //added by yamin
    TerrainExcavate.clipTerrainDoc = null;
    TerrainExcavate.getClipTerrainFile = getClipTerrainFile;
    TerrainExcavate.initClipTerrainObj = initClipTerrainObj;
    TerrainExcavate.roadAnalysis =roadAnalysis;
    TerrainExcavate.importClipAnaly=importClipAnaly;
    TerrainExcavate.getResultArr=getResultArr;
    TerrainExcavate.clearHighLight=clearHighLight;
//	TerrainExcavate.getClipTerrainData=getClipTerrainData;
//	TerrainExcavate.getClipModelById=getClipModelById;
//	TerrainExcavate.getClipLayerById=getClipLayerById;
//	TerrainExcavate.deltetClipTerrainById=deltetClipTerrainById;
//	TerrainExcavate.setClipTerrainVis=setClipTerrainVis;
})();