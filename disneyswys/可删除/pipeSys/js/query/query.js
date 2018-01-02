var bufPolygon = null;
var selectedObj=null;
var radius=3;
var pageCount = 1;//用于道路查询、行政查询等过滤按钮查询列表进行分页，pageCount为查询结果的总页数；
//参数：radius--道路缓冲半径，主要用于分析
var timer = null;
var QueryObject = {
    setRadius:function(r){
        radius=r;
    }, 
    getPageCount: function(){
        return pageCount;
    },
    getTypeQuery: function (tab, service, canton, projectId, cross,ns,nc) {
        var dataGridArr = {
            totleCount:"",
            dataArr:[],
            coordinatesArr:[]
        };
        var numStart = ns?ns:0;//快速定位每页开始index
        var numCount = nc?nc:1000; //快速定位每页显示条数
        var mQueryString;
        if(canton === "" || canton === null || canton === undefined){//查询所有
            mQueryString = params.ip + "/dataquery?service=" + service + "&qt=17&fd=NAME&project=" + projectId;
        }else{//模糊查询
            mQueryString = params.ip + "/dataquery?service=" + service + "&qt=17&fd=NAME&project=" + projectId + "&pc=(and,like,NAME," + canton + ")";
        }
        mQueryString += "&pg="+numStart+","+numCount;
        earth.Event.OnEditDatabaseFinished = function(pRes, pFeature){
            if (pRes.ExcuteType == parent.excuteType){
                var xmlStr = pRes.AttributeName;
                var xmlDoc = loadXMLStr(xmlStr);
                var json = $.xml2json(xmlDoc);
                if (json == null) {
                    alert("请配置数据!");
                    return null;
                }
                var records = json.Result.Record;
                dataGridArr.totleCount= json.Result.num;
                var pointType;
                if (json.Result.num <= 0) {
                    return null;
                } else if (json.Result.num == 1) {
                    var coordinatesType = records.SHAPE.Polygon;
                    pointType = "Polygon";
                    if (!coordinatesType) {
                        coordinatesType = records.SHAPE.Polyline;
                        pointType = "Polyline";
                    }
                    if (!coordinatesType) {
                        coordinatesType = records.SHAPE.Point;
                        pointType = "Point";
                    }
                    var coordinates = coordinatesType.Coordinates;
                    var template = '<tr ondblclick=QueryObject.flyToBuffer("$COORDINATES","'+service+'") onclick=QueryObject.selectTr(this,"'+cross+'","'+projectId+'") >' +
                        '<td value='+coordinates+' class="trbg" ' + ' style="width: 100px">'
                        + records.NAME + '' +
                        '</td>' +
                        '</tr>';
                    template = template.replace("$COORDINATES", coordinates);
                    if((nc&&nc>=0)&&(ns>=0)){
                        //var dataId = earth.Factory.CreateGUID();
                        dataGridArr.dataArr.push({"listNum":numStart,"name":records.NAME,id:records.OBJECTID});
                        dataGridArr.coordinatesArr[records.OBJECTID] = coordinates;
                    } else{
                        tab.append(template);
                    }
                } else {
                    var isAddBackground=true;
                    for (var i = 0; i < records.length; i++) {
                        var record = records[i];
                        var coordinatesType = record.SHAPE.Polygon;
                        pointType = "Polygon";
                        if (!coordinatesType) {
                            coordinatesType = record.SHAPE.Polyline;
                            pointType = "Polyline";
                        }
                        if (!coordinatesType) {
                            coordinatesType = record.SHAPE.Point;
                            pointType = "Point";
                        }
                        var coordinates = coordinatesType.Coordinates;
                        if(record.NAME!=""){
                            var template='';
                            if(isAddBackground){
                                template = '<tr ondblclick=QueryObject.flyToBuffer("$COORDINATES","'+service+'")><td value='+coordinates+' onclick=QueryObject.selectTr(this,"'+cross+'","'+projectId+'") ' + ' style="width: 100px" class="trbg">' + record.NAME + '</td></tr>';
                                isAddBackground=false;
                            }else{
                                template = '<tr ondblclick=QueryObject.flyToBuffer("$COORDINATES","'+service+'")><td value='+coordinates+' onclick=QueryObject.selectTr(this,"'+cross+'","'+projectId+'") ' + ' style="width: 100px">' + record.NAME + '</td></tr>';
                            }
                            template = template.replace("$COORDINATES", coordinates);
                            if((nc&&nc>=0)&&(ns>=0)){
                                dataGridArr.dataArr.push({"listNum":numStart*numCount+i+1,"name":records[i].NAME,id:records[i].OBJECTID});
                                dataGridArr.coordinatesArr[records[i].OBJECTID] = coordinates;
                            } else{
                                tab.append(template);
                            }
                        }
                    }
                    QueryObject.getRoadCross($(".trbg").html(),projectId);
                }
                //return dataGridArr;
            }
        }
        earth.DatabaseManager.GetXml(mQueryString);
    },
    getTypeQuery2: function (tab, service, canton, projectId, cross, ns, nc, bClickFilter, pagePagination, pageIndex2, pagePagination2) {//道路查询、行政查询等区域查询用到
        var numStart = ns?ns:0;//快速定位第几页
        var numCount = nc?nc:1000; //快速定位每页显示条数
        var mQueryString;
        if(canton === "" || canton === null || canton === undefined){//查询所有
            mQueryString = params.ip + "/dataquery?service=" + service + "&qt=16&fd=NAME&project=" + projectId;
        }else{//模糊查询
            mQueryString = params.ip + "/dataquery?service=" + service + "&qt=16&fd=NAME&project=" + projectId + "&pc=(and,like,NAME," + canton + ")";
        }
        mQueryString += "&pg="+numStart+","+numCount;
        earth.Event.OnEditDatabaseFinished = function(pRes, pFeature){
            if (pRes.ExcuteType == parent.excuteType){
                var xmlStr = pRes.AttributeName;
                var xmlDoc = loadXMLStr(xmlStr);
                var json = $.xml2json(xmlDoc);
                if (json == null) {
                    alert("请配置数据!");
                    return null;
                }
                var records = json.Result.Record;
                var pointType;
                if (json.Result.num <= 0) {
                    return null;
                } else if (json.Result.num == 1) {
                    pageCount = 1;
                    var template = '<tr ondblclick=QueryObject.QuerySelectedArea("'+service + '","' + projectId + '","' + records.NAME +'") >' +
                        '<td id="tdid" class="trbg" ' + ' style="width: 125px">'
                        + records.NAME + '' +
                        '</td>' +
                        '</tr>';
                    tab.append(template);
                    $("#tdid").live("click", function(){
                        var me = this;
                        if(timer){
                            clearTimeout(timer);     
                        }
                        timer = setTimeout(function () { 
                            QueryObject.selectTr(me,cross,projectId,pageIndex2,numCount,pagePagination2,true);
                        }, 300);
                    });
                } else {
                    pageCount = Math.ceil(json.Result.num/numCount);
                    var isAddBackground=true;
                    for (var i = 0; i < records.length; i++) {
                        var record = records[i];
                        if(record.NAME!=""){
                            var template='';
                            var tdid = "tdtd" + i;
                            if(isAddBackground){
                                var tdid = "tdtd" + i;
                                template = '<tr ondblclick=QueryObject.QuerySelectedArea("'+service+ '","' + projectId + '","' + record.NAME+'") ><td id="' + tdid + '" style="width: 125px" class="trbg">' + record.NAME + '</td></tr>';
                                isAddBackground=false;
                            }else{
                                template = '<tr ondblclick=QueryObject.QuerySelectedArea("'+service+ '","' + projectId + '","' + record.NAME+'") ><td id="' + tdid + '" style="width: 125px">' + record.NAME + '</td></tr>';
                            }
                            tab.append(template);
                            $("#" + tdid).live("click", function(){
                                var me = this;
                                if(timer){
                                    clearTimeout(timer);
                                }
                                timer = setTimeout(function () { 
                                    QueryObject.selectTr(me,cross,projectId,pageIndex2,numCount,pagePagination2,true);
                                }, 300);
                            });
                        }
                    }
                }
                if(cross){
                    QueryObject.getRoadCross($(".trbg").html(),projectId, pageIndex2, numCount, pagePagination2, true);    
                }
                if(bClickFilter){
                    pagePagination(json.Result.num, pageCount);    
                }
            }
        }
        earth.DatabaseManager.GetXml(mQueryString);
    },
    QuerySelectedArea: function(service, projectId,selName){//双击定位查询（qt=17）
        var mQueryString = params.ip + "/dataquery?service=" + service + "&qt=17&fd=NAME&project=" + projectId + "&pc=(and,equal,NAME," + selName + ")&pg=0,10";
        earth.Event.OnEditDatabaseFinished = function(pRes, pFeature){
            if (pRes.ExcuteType == parent.excuteType){
                var xmlStr = pRes.AttributeName;
                var xmlDoc = loadXMLStr(xmlStr);
                var json = $.xml2json(xmlDoc);
                if (json == null) {
                    return null;
                }
                var records = json.Result.Record;
                var pointType;
                if (json.Result.num <= 0) {
                    return null;
                }else if(json.Result.num == 1){
                    pageCount = 1;
                    if(records == null || records.SHAPE == null){
                        return;
                    }
                    var coordinatesType = records.SHAPE.Polygon;
                    pointType = "Polygon";
                    if (!coordinatesType) {
                        coordinatesType = records.SHAPE.Polyline;
                        pointType = "Polyline";
                    }
                    if (!coordinatesType) {
                        coordinatesType = records.SHAPE.Point;
                        pointType = "Point";
                    }
                    var coordinates = coordinatesType.Coordinates;
                    QueryObject.flyToBuffer(coordinates,service);
                } 
                else{
                    pageCount = 1;
                    var record = records[0];
                    if(record == null || record.SHAPE == null){
                        return;
                    }
                    var coordinatesType = record.SHAPE.Polygon;
                    pointType = "Polygon";
                    if (!coordinatesType) {
                        coordinatesType = record.SHAPE.Polyline;
                        pointType = "Polyline";
                    }
                    if (!coordinatesType) {
                        coordinatesType = record.SHAPE.Point;
                        pointType = "Point";
                    }
                    var coordinates = coordinatesType.Coordinates;
                    QueryObject.flyToBuffer(coordinates,service);
                }
            }
        }
        earth.DatabaseManager.GetXml(mQueryString);
    },
    selectTr: function (id, cross,projectId, pageIndex2, pageCount, pagePagination2, bRefresh) {
        if($(id).hasClass('trbg')){
            return;
        }
        $(".trbg").each(function () {
            $(this).removeClass("trbg");
        });
        $(id).addClass("trbg");
        if (cross != null) {
            var roadName=$(id).html();
            this.getRoadCross(roadName, projectId, pageIndex2, pageCount, pagePagination2, bRefresh);
        }
    },
    selectTr2: function (id) {
        $(".trbg2").each(function () {
            $(this).removeClass("trbg2");
        });
        $(id).addClass("trbg2");

    },
    getRoadCross: function (roadName,projectId, pageIndex2, pageCount, pagePagination2, bRefresh) {   //交叉口查询
        var numStart = pageIndex2?pageIndex2:0;//快速定位第几页
        var numCount = pageCount?pageCount:1000; //快速定位每页显示条数
        var url = params.ip;
        var tab=$("#tabList2");
        tab.empty();
        url += "/dataquery?service=road";
        url += "&qt=16";
        url += "&project="+projectId;
        url += "&cc=(road,"+roadName+",1)";
        url += "&pg=" + numStart + "," + numCount;
        earth.Event.OnEditDatabaseFinished = function(pRes, pFeature){
            if (pRes.ExcuteType == parent.excuteType){
                tab.empty();
                var xmlStr = pRes.AttributeName;
                var xmlDoc = loadXMLStr(xmlStr);
                var json = $.xml2json(xmlDoc);
                if (json == null) {
                    return;
                }
                var records = json.Result.Record;
                if (json.Result.num <= 0) {
                    return;
                } else if (json.Result.num == 1) {
                    var template = '<tr ondblclick=QueryObject.QuerySelectedArea("road","' + projectId + '","' + records.NAME+'")><td class="trbg2" onclick=QueryObject.selectTr2(this)'+' style="width: 125px">' + records.NAME + '</td></tr>';
                    tab.append(template);
                } else {
                    var isAddBackground=true;
                    for (var i = 0; i < records.length; i++) {
                        var record = records[i];
                        if(record.NAME!=""){
                            var template;
                            if(isAddBackground){
                                template = '<tr ondblclick=QueryObject.QuerySelectedArea("road","' + projectId + '","' + record.NAME+'") ><td class="trbg2" onclick=QueryObject.selectTr2(this) ' + ' style="width: 125px">' + record.NAME + '</td></tr>';
                                isAddBackground=false;
                            }else{
                                template = '<tr ondblclick=QueryObject.QuerySelectedArea("road","' + projectId + '","' + record.NAME+'") ><td onclick=QueryObject.selectTr2(this) ' + ' style="width: 125px">' + record.NAME + '</td></tr>';
                            }
                            tab.append(template);
                        }
                    }
                }
                if(bRefresh && pagePagination2){
                    pageCount = Math.ceil(json.Result.num/numCount);
                    pagePagination2(json.Result.num, pageCount, projectId);    
                }
            }
        }
        earth.DatabaseManager.GetXml(url);
    },
    flyToBuffer: function (coordinates,service) {
        //alert(type);
        coordinates = coordinates.split(",");
        selectedObj = earth.Factory.CreateGeoPoints();
        if(coordinates.length === 3){//认为是点 后期优化....
            //点处理 后期优化判断类型 todo:
            for (var j = 0; j < coordinates.length; j ++) {
                selectedObj.Add(coordinates[j], coordinates[j + 1], coordinates[j + 2]);
                this.createBufferFromCircle(coordinates);
            }
            //return;
        }else{
            for (var i = 0; i < coordinates.length; i += 3) {
                selectedObj.Add(coordinates[i], coordinates[i + 1], coordinates[i + 2]);
            }
            this.createBufferFromLine(radius,service,coordinates);
        }

    },

    //单位查询处理点的情况
    createBufferFromCircle : function (coords) {
        if (selectedObj == null) {
            return;
        }
        var vec3s = earth.Factory.CreateVector3s();
        var pt = null;
        //var radius = 3/*$("#radius").val()*/;
        // var bufGeoPoints = earth.GeometryAlgorithm.CreatePolygonFromPolylineAndWidth(selectedObj,
        //         radius, radius);

        // for (var i = 0; i < bufGeoPoints.Count; i++) {
        //     pt = bufGeoPoints.GetPointAt(i);
        //     vec3s.Add(pt.Longitude, pt.Latitude, pt.Altitude);
        // }
        this.clearBuffer();
        var guid = earth.Factory.CreateGuid();
        bufPolygon = earth.Factory.CreateElementCircle(guid, "circle");
        var tran = bufPolygon.SphericalTransform;
        tran.SetLocationEx(coords[0],coords[1],coords[2]);
        bufPolygon.BeginUpdate();

        //传入半径
        bufPolygon.Radius = radius;
        bufPolygon.LineStyle.LineWidth = 1;
        bufPolygon.LineStyle.LineColor = parseInt("0xFFFF0000");
        bufPolygon.FillStyle.FillColor = parseInt("0x2500FF00");
        bufPolygon.AltitudeType = 1;   // SEAltitudeType.ClampToTerrain
        bufPolygon.EndUpdate();
        earth.AttachObject(bufPolygon);
        bufPolygon.ShowHighLight();
        //飞行定位到该点
        this.flyToPoint(coords[0],coords[1]);
    },

    flyToPoint : function(x, y) {
        earth.GlobeObserver.FlytoLookat(x, y, 100, 0, 90, 0, 100, 3);
    },

    createBufferFromLine: function (r,service,coordinates) {
        if (selectedObj == null) {
            return;
        }
        var vec3s = earth.Factory.CreateVector3s();
        if(service=="road"){
            var pt = null;
            var bufGeoPoints = earth.GeometryAlgorithm.CreatePolygonFromPolylineAndWidthWithHead(selectedObj, r, r);

            for (var i = 0; i < bufGeoPoints.Count; i++) {
                pt = bufGeoPoints.GetPointAt(i);
                vec3s.Add(pt.Longitude, pt.Latitude, pt.Altitude);
            }
        }else if(service=="canton3" || service=="company" || service=="SurveyArea"){
            var pt = null;
            for (var i = 0; i < selectedObj.Count; i++) {
                pt = selectedObj.GetPointAt(i);
                vec3s.Add(pt.Longitude, pt.Latitude, pt.Altitude);
            }
            vec3s = earth.GeometryAlgorithm.CreateParallelPolygon(vec3s, r, 1);
        }else{
            if(coordinates){
                for (var i = 0; i < coordinates.length; i += 3) {
                    vec3s.Add(coordinates[i], coordinates[i + 1], coordinates[i + 2]);
                }
            }

        }
        this.clearBuffer();
        bufPolygon = earth.Factory.CreateElementPolygon(earth.Factory.CreateGUID(), "");
        bufPolygon.BeginUpdate();
        bufPolygon.SetExteriorRing(vec3s);   // SECoordinateUnit.Degree
        bufPolygon.LineStyle.LineWidth = 1;
        bufPolygon.LineStyle.LineColor = parseInt("0xFFFF0000");
        bufPolygon.FillStyle.FillColor = parseInt("0x2500FF00");
        bufPolygon.AltitudeType = 1;   // SEAltitudeType.ClampToTerrain
        bufPolygon.EndUpdate();
        earth.AttachObject(bufPolygon);
        bufPolygon.ShowHighLight();
        this.flyToModel(bufPolygon);
       /* var location=bufPolygon.SphericalTransform.GetLocation();
        earth.GlobeObserver.GotoLookat(location.X, location.Y, location.Z, 0, 90, 0.0, location.length+100);*/
    },
    flyToModel : function(obj) {
        var rect = obj.GetLonLatRect();
        if (rect == null || rect == undefined) return;
        var north = Number(rect.North);
        var south = Number(rect.South);
        var east = Number(rect.East);
        var west = Number(rect.West);
        var topHeight = Number(rect.MaxHeight);
        var bottomHeight = Number(rect.MinHeight);

        var lon = (east+west)/2;
        var lat = (south+north)/2;
        var alt = (topHeight+bottomHeight)/2;
        var width = (parseFloat(north) - parseFloat(south)) / 2;
        var range = width / 180 * Math.PI * 6378137 / Math.tan(22.5 / 180 * Math.PI);
        range += 100;
        earth.GlobeObserver.FlytoLookat(lon, lat, alt, 0, 60, 0, range, 3);
    },
    clearBuffer: function () {
        if (bufPolygon != null) {
            earth.DetachObject(bufPolygon);
            bufPolygon = null;
        }
    },
    paramQueryALL:function(pFeat,guid,filter,queryType,queryTableType,compoundCondition,total,standardName){
        var layer = earth.LayerManager.GetLayerByGUID(guid);
        var subLayer = null;
        for(var i= 0, len=layer.GetChildCount(); i<len; i++){
            subLayer = layer.GetChildAt(i);
            if(subLayer.LayerType == "Container"){  // 使用具体的_container图层
                break;
            }
        }
        if(subLayer == null){
            return;
        }
        var param = subLayer.QueryParameter;
        if(!param){
           return;
        }
        param.ClearRanges();
        param.ClearCompoundCondition();
        param.ClearSpatialFilter();
        if(filter!=null){
            param.Filter = filter;
        }else{
            param.Filter="";
        }
        if(pFeat!=null){
            param.SetSpatialFilter(pFeat);
        }
        if(queryTableType!=null){
            param.QueryTableType=queryTableType; // 0：SE_Table_Point，1：SE_Table_Line
        }
        if(compoundCondition!=null){
            var cc=compoundCondition.split(",");
            param.SetCompoundCondition(cc[0],cc[1],parseFloat(cc[2]).toFixed(3));
        }
        param.QueryType = queryType;   // SE_AttributeData
        param.PageRecordCount = total||2000;
        var result = subLayer.SearchFromGISServer();
        if(result!==null){
            this.parseResult(result.GotoPage(0),layer,standardName);
        }
        return result;
    },
    parseResult : function (result,layer,standardName) {
        if(result==null||result=="error"){
            return;
        }

        var json = $.xml2json(result);
        var type = json.Result.geometry;
        var displayType = "管线";
        type = type === "point" ? "point" : "line";
        var template = '<tr>';
        if(standardName&&standardName.length>0){
            for(var i=0;i<standardName.length;i++){
                template += '<td>$'+standardName[i]+'</td>';
            }
        }
        template += '</tr>';
        var records = json.Result.Record;
        if (json.Result.num <= 0) {
            return;
        } else if (json.Result.num == 1) {
            //只有一个记录
            if(type=="point"){
                var us_key_point = parent.getName("US_KEY",0,true);
                var pointType="管点";
                var usType = parent.getName("US_PT_TYPE", 0, true);
                var usAttach = parent.getName("US_ATTACHMENT", 0, true);
                var usWell = parent.getName("US_WELL", 0, true);
                if(records[usType]){
                    typeText = records[usType];
                }else if(records[usAttach]){
                    typeText = records[usAttach];
                }else if(records[usWell]){
                    typeText = records[usWell];
                }else{
                    typeText = pointType;
                }
                $("#importResult>tbody").append(template.replace("$INDEX", records[us_key_point])
                    .replace("$DISPLAYTYPE",typeText)
                    .replace("$US_KEY",records[parent.getName("US_KEY",0,true)])//编号
                    .replace("$LAYER",layer.Name));
            }else{
                var us_key_line = parent.getName("US_KEY",1,true);
                $("#importResult>tbody").append(template.replace("$INDEX", records[us_key_line])
                    .replace("$DISPLAYTYPE", displayType)
                    .replace("$US_KEY", us_key_line)//编号
                    .replace("$US_SIZE", records[parent.getName("US_SIZE",1,true)])//管径
                    .replace("$US_PMATER", records[parent.getName("US_PMATER",1,true)])//材质
                    .replace("$US_LTTYPE", records[parent.getName("US_LTTYPE",1,true)])//埋设方式
                    .replace("$US_STATUS", records[parent.getName("US_STATUS",1,true)])//废弃==状态
                    .replace("$LAYER",layer.Name));
            }
        } else {
            //多条记录
            for (var i = 0; i < records.length; i++) {
                if(type=="point"){
                    var pointType="管点";
                    var us_key_point = parent.getName("US_KEY",0,true);
                    var usType = parent.getName("US_PT_TYPE", 0, true);
                    var usAttach = parent.getName("US_ATTACHMENT", 0, true);
                    var usWell = parent.getName("US_WELL", 0, true);
                    if(records[i][usType]){
                        pointType = records[i][usType];
                    }else if(records[i][usAttach]){
                        pointType = records[i][usAttach];
                    }else if(records[i][usWell]){
                        pointType = records[i][usWell];
                    }
                    $("#importResult>tbody").append(template.replace("$INDEX", records[i][us_key_point])
                        .replace("$DISPLAYTYPE",pointType)//类型
                        .replace("$US_KEY",records[i][parent.getName("US_KEY",0,true)])//编号
                        //.replace("$US_PMATER",records[i][parent.getName("US_PMATER",0,true)])
                        .replace("$LAYER",layer.Name));
                }else{
                    var us_key_line = parent.getName("US_KEY",1,true);
                    $("#importResult>tbody").append(template.replace("$INDEX", records[i][us_key_line])
                        .replace("$DISPLAYTYPE", displayType)//类型
                        .replace("$US_KEY", us_key_line)//编号
                        .replace("$US_SIZE", records[i][parent.getName("US_SIZE",1,true)])//管径
                        .replace("$US_PMATER", records[i][parent.getName("US_PMATER",1,true)])//材质
                        .replace("$US_LTTYPE", records[i][parent.getName("US_LTTYPE",1,true)])//埋设方式
                        .replace("$US_STATUS", records[i][parent.getName("US_STATUS",1,true)])//废弃==状态
                        .replace("$LAYER",layer.Name));
                }
            }
        }
    }
};