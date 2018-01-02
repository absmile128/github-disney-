var GeneralQuery = {};
var pipeConfigDoc = null;
var pipeConfigLink = null;
var pipeDatum = null;
var queryHtmlBalloon = null;
var queryHtmlBalloonHidden = false;
var key;
var parentLayerName;




(function () {
    var onPickObjectEx_build = function (pObj) {
        //pObj.SetObjectFlags(2);
        pObj.Underground = true;   // SEObjectFlagType.ObjectFlagUnderground
//        debugger;
//       pObj.ShowHighLight();
        parentLayerName = pObj.GetParentLayerName();
        if (parentLayerName == "" || parentLayerName == null) {
            alert("获得父层名称失败！");
            return false;
        }
        key = pObj.GetKey();
        showpropertyQuery(earth,parentLayerName,key,pObj,"buildAttr")  ;
        //var url = "html/search/propertyQuery.html?parentLayerName=" + parentLayerName + "&key=" + key;
        //showLargeDialog(url, "属性信息");
        earth.Event.OnPickObjectEx = function () {
        };
        earth.Query.FinishPick();
    };
    /**
     * 属性查询
     */
    var propertyQuery = function () {
        earth.Event.OnPickObjectEx = onPickObjectEx_build;
        earth.Query.PickObjectEx(127);  // SEPickObjectType.PickAllObject
    };
    GeneralQuery.propertyQuery = propertyQuery;

      //cy加：对bim模型查询
    var propertyQuery_BIM = function () {


        var begin = true;
        earth.Event.OnPickObjectEx = onPickObjectEx_BIM;
        earth.Event.OnPickObject = onPickObject_BIM;

        //将鼠标设置为箭头状
        earth.Environment.SetCursorStyle(32512);
        earth.Event.OnLBDown = function(p2) {
            function _onlbd(p2) {
                earth.Event.OnLBUp = function(p2) {
                    earth.Event.OnLBDown = function(p2) {
                        _onlbd(p2);
                    };
                };
                if(begin){
                    earth.Query.PickObject(511, p2.x, p2.y);
                    earth.Environment.SetCursorStyle(209);
                }
                begin = false;
            }
            _onlbd(p2);
        };
    };
    GeneralQuery.propertyQuery_BIM = propertyQuery_BIM;


    //cy加：只对发布模型点击生效
    var propertyQuery_Part = function() {
        var begin = true;      //是否点击图标，点击过了，才执行，否则不执行


     earth.Event.OnPickObjectEx = onPickObjectEx_part;

        //将鼠标设置为箭头状
        earth.Environment.SetCursorStyle(32512);
        earth.Event.OnLBDown = function(p2) {
            function _onlbd(p2) {
                earth.Event.OnLBUp = function(p2) {
                    earth.Event.OnLBDown = function(p2) {
                        _onlbd(p2);
                    };
                };

                if(begin){

                    earth.Query.PickObject(511, p2.x, p2.y);
                    earth.Environment.SetCursorStyle(209);

                }

                   begin = false;
            }
            _onlbd(p2);
        };









































//
//
//
//
//
//        var begin = true;      //是否点击图标，点击过了，才执行，否则不执行
//
//
//        earth.Event.OnPickObjectEx = onPickObjectEx_Part;
//        earth.Event.OnPickObject = onPickObject_part;
//
//        //将鼠标设置为箭头状
//        earth.Environment.SetCursorStyle(32512);
//        earth.Event.OnLBDown = function(p2) {
//            function _onlbd(p2) {
//                earth.Event.OnLBUp = function(p2) {
//                    earth.Event.OnLBDown = function(p2) {
//                        _onlbd(p2);
//                    };
//                };
//
//                if(begin){
//
//                    earth.Query.PickObject(511, p2.x, p2.y);
//                    earth.Environment.SetCursorStyle(209);
//
//                }
//
//                begin = false;
//            }
//            _onlbd(p2);
//        };

    };
    GeneralQuery.propertyQuery_Part = propertyQuery_Part;
})();
function showpropertyQuery(earth,parentLayerName,key,pObj,tag){
    function parseLocation()  {
        var  results={};
        results[key] = parentLayerName;
        return results;
    };
    var isJsonType = (CITYPLAN_config.server.returnDataType != undefined && CITYPLAN_config.server.returnDataType == 'json');
    var params = parseLocation();
    var cArr=parentLayerName.split("=");
    var cArr = cArr[1].split("_");
    var layer = earth.LayerManager.GetLayerByGUID(cArr[0]);
    if(cArr.length>1){

        var strPara = "(and,equal,US_KEY," + key + ")"; // + "&pg=0,30";
        var bLine = parentLayerName.indexOf("container") > -1;
        var param = layer.QueryParameter;
        param.Filter = strPara;
//    param.ClearSpatialFilter();
        param.QueryType = 16;   // SE_AttributeData
        param.QueryTableType = (bLine ? 1 : 0);
        param.PageRecordCount = 1;
        var result = layer.SearchFromGISServer();
        query(result.GotoPage(0), layer.Guid, layer.Name, bLine);
    }else{
        $("#divPointResult").show();
        $("#divLineResult").hide();
        initObjValue(key,layer,tag);
    }

    function getCoordinates2  (layerID, str1, str2) {
        var strPara = "(or,equal,US_KEY," + str1 + "),(or,equal,US_KEY," + str2 + ")";
        var layer = earth.LayerManager.GetLayerByGUID(layerID);
        var strConn = layer.GISServer + "dataquery?service=" + layerID + "&qt=17&dt=point&pc=" + strPara + "&pg=0,100";
        var xmlDoc = loadXMLStr(strConn);
        return xmlDoc;
    };

    function getCoordinates (xmlDoc, layerID, str) {
        var v3s = null;
        v3s = getPlaneCoordinates(layerID, xmlDoc, str);
        return v3s;
    };

    function  getTempParams (xmlDoc, str) {
        var params = parseResult2(xmlDoc, str);
        return params;
    };

    function getPointCoordinates(layerID, str) {
        var v3s = null;
        var strPara = "(and,equal,US_KEY,";
        strPara += str;
        strPara += ")";
        var layer = earth.LayerManager.GetLayerByGUID(layerID);
        var strConn = layer.GISServer + "dataquery?service=" + layerID + "&qt=1&dt=point&pc=" + strPara + "&pg=0,100";
        var xmlDoc = loadXMLStr(strConn);
        v3s = getPlaneCoordinates(layerID, xmlDoc, str);
        return v3s;
    };
    function initObjValue (key, layer,tag) {
        if(pObj!=null){
            if(queryHtmlBalloon){
                queryHtmlBalloon.DestroyObject();
                queryHtmlBalloonHidden = false;
                queryHtmlBalloon=null;
            }
            //earth.HtmlBalloon.Hide();
            var rect = pObj.GetLonLatRect();
            var north = rect.North;
            var south = rect.South;
            var east = rect.East;
            var west = rect.West;
            var top = rect.MaxHeight;
            var bottom = rect.MinHeight;

            var centerX = (east + west) / 2;
            var centerY = (north + south) / 2;
            var centerZ = (top + bottom) / 2;
            var location=new Object();
            location.centerX=centerX;
            location.centerY=centerY;
            location.centerZ=centerZ;

            //TODO 读取建筑属性
         //     alert(CITYPLAN_config.disney.moduleAttrserverUrl);
            if(tag=="buildAttr")
            {
            $.post( CITYPLAN_config.disney.moduleAttrserverUrl,
                    {  guid: key },
                function(data){


                    if(data){

                        setform(data,location);
                    }
                    else
                    {
                        alert("查询失败！");
                    }

                }
            );

            }
            else if (tag=="partAttr")   {


                var attrData = layer.SearchResultFromLocal.GotoPage(0);
                if(isJsonType){
                    attrData = JSON.parse(attrData).Json;
                }else{
                    attrData = $.xml2json(attrData);
                }
                if(attrData.SearchResult != null && attrData.SearchResult.total > 0){
                    if(attrData.SearchResult.ModelResult != null){
                        attrData = attrData.SearchResult.ModelResult.ModelData;
                    }else if(attrData.SearchResult.VectorResult != null){
                        attrData = attrData.SearchResult.VectorResult.VectorData;
                    }
                    if($.isArray(attrData)){
                        attrData = attrData[0];
                    }
                } else{
                    attrData = null;
                }
                setform(attrData,location,tag);
            }
        }


    }

          function    setform(data,location,tag)
             {
                 var fileurl ="";
                 var size=new Object();
              if (tag=="buildAttr")
              {
                  fileurl =  "html/view/ModelAttrTable.html"; //ShowNavigate只能用绝对路径
                  size.width=300;
                  size.height=280;
              }
              else if (tag=="partAttr"){
                   fileurl = "html/part/partsearchDataTable.html"; //ShowNavigate只能用绝对路径
                  size.width=400;
                  size.height=500;
              }
                 var loaclUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
                 var url = loaclUrl +"/"+ fileurl; //ShowNavigate只能用绝对路径



            var guid = earth.Factory.CreateGuid();
            queryHtmlBalloon = earth.Factory.CreateHtmlBalloon(guid, "balloon");
            queryHtmlBalloon.SetSphericalLocation(location.centerX, location.centerY, location.centerZ);
            queryHtmlBalloon.SetRectSize( size.width,  size.height);
           var color = parseInt("0xccffffff");//0xccc0c0c0
            queryHtmlBalloon.SetTailColor(color);
            queryHtmlBalloon.SetIsAddCloseButton(true);
            queryHtmlBalloon.SetIsAddMargin(true);
            queryHtmlBalloon.SetIsAddBackgroundImage(true);
            queryHtmlBalloon.SetBackgroundAlpha(0xcc);
              queryHtmlBalloon.ShowNavigate(url);

              earth.Event.OnHtmlNavigateCompleted = function (){
                  setTimeout(function(){
                           data.earth=earth;
                      try{


                      queryHtmlBalloon.InvokeScript("postData", data);
                      }
                  catch (e) {

                  }

                  },100);
                  earth.Event.OnHtmlNavigateCompleted = function (){};
              };
            earth.Event.OnHtmlBalloonFinished = function(){
                if(queryHtmlBalloonHidden == false && queryHtmlBalloon!=null){
                    queryHtmlBalloon.DestroyObject();
                    queryHtmlBalloon=null;
                    earth.Event.OnHtmlBalloonFinished = function(){};
                }
            }


       }

    var showLineHtml = "";
    function initPointValue (layerID, record, layerName, layerID) {
        if(queryHtmlBalloon){
            queryHtmlBalloon.DestroyObject();
            queryHtmlBalloonHidden = false;
            queryHtmlBalloon=null;
        }
        var rect = pObj.GetLonLatRect();
        var north = rect.North;
        var south = rect.South;
        var east = rect.East;
        var west = rect.West;
        var top = rect.MaxHeight;
        var bottom = rect.MinHeight;
        var centerX = (east + west) / 2;
        var centerY = (north + south) / 2;
        var centerZ = (top + bottom) / 2;

        var str = record.US_KEY;

        initPipeConfigDoc(layerID, true, true); //初始化编码映射文件对象, 不初始化空间坐标转换对象
        var v3s = getPointCoordinates(layerID, str);

        //var v3s =  transformToPlaneCoordinates(layerID, [centerX,centerY,centerZ]);
        var X =""; var Y="";
        if(v3s){
            X = (parseFloat(v3s.X)).toFixed(3);
            Y = (parseFloat(v3s.Y)).toFixed(3);
        }

        var altitude = (parseFloat(record.US_PT_ALT)).toFixed(3);
        var showLineHtml = '<div style="width:100%;height:280px;overflow:auto;">';
        showLineHtml = showLineHtml+'<table style="width:100%;height:280px;font-size:14px;text-align:center;overflow:auto;color:#000000">';
        //var showLineHtml = '<table style=" width: 100%; height:280;border-collapse: collapse;border-spacing: 0;font-size:14px;text-align:center;overflow-y:auto;color:#000000">';
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">所属图层:</td>';
        showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + layerName + '</td>';
        showLineHtml = showLineHtml + '</tr>';
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">管线标识:</td>';
        showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + record.US_KEY + '</td>';
        showLineHtml = showLineHtml + '</tr>';
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">地面高程:</td>';
        showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + altitude + '</td>';
        showLineHtml = showLineHtml + '</tr>';

        var pointType = getValueByCode("CPointCodes", record.US_PT_TYPE);
        if (pointType != "") {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">特征:</td>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + pointType + '</td>';
            showLineHtml = showLineHtml + '</tr>';
        }
        var attachment = getValueByCode("AttachmentCode", record.US_ATTACHM);
        if (attachment != "") {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">附属物:</td>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + attachment + '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#tblPointResult").append('<tr><td class="col w40p">附属物</td><td class="col w60p">' + attachment + '</td></tr>');
        }
        // TODO: 道路名称字段需要动态获取
        if (record.PROAD != null || record.PROAD != undefined) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">道路名称:</td>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' +  record.PROAD + '</td>';
            showLineHtml = showLineHtml + '</tr>';
        }
        if (record.US_WELL) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">井形状:</td>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + record.US_WELL+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        if (record.US_WELL_ID) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">井标志:</td>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + record.US_WELL_ID+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        if (record.US_FEATURE) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">关联模型:</td>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + record.US_FEATURE+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        if (record.US_ANGLE) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">弯管角度:</td>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + parseInt(record.US_ANGLE)+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        if (record.US_IS_SCRA) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">废弃年代:</td>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + parseFloat(record.US_IS_SCRA).toFixed(2)+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        if (record.US_BD_TIME) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">创建年代:</td>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + parseFloat(record.US_BD_TIME).toFixed(2)+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        if (record.US_FX_YEAR) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">使用年限:</td>';
            showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + record.US_FX_YEAR+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">X坐标:</td>';
        showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + X+ '</td>';
        showLineHtml = showLineHtml + '</tr>';
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">Y坐标:</td>';
        showLineHtml = showLineHtml + '<td style=" width: 40%;text-align: left;">' + Y + '</td>';
        showLineHtml = showLineHtml + '</tr>';
        showLineHtml = showLineHtml + '</table>';
        showLineHtml = showLineHtml + '</div>';
        //if(pObj!=null){

        var guid = earth.Factory.CreateGuid();
        queryHtmlBalloon = earth.Factory.CreateHtmlBalloon(guid, "balloon");
        queryHtmlBalloon.SetSphericalLocation(centerX, centerY, centerZ);
        queryHtmlBalloon.SetRectSize(350, 370);
        var color = parseInt("0xccffffff");//0xccc0c0c0
        queryHtmlBalloon.SetTailColor(color);
        queryHtmlBalloon.SetIsAddCloseButton(true);
        queryHtmlBalloon.SetIsAddMargin(true);
        queryHtmlBalloon.SetIsAddBackgroundImage(true);
        //queryHtmlBalloon.SetIsTransparence(true);
        queryHtmlBalloon.SetBackgroundAlpha(0xcc);
        queryHtmlBalloon.ShowHtml(showLineHtml);
        earth.Event.OnHtmlBalloonFinished = function(){
            if(queryHtmlBalloonHidden == false && queryHtmlBalloon!=null){
                queryHtmlBalloon.DestroyObject();
                queryHtmlBalloon=null;
                earth.Event.OnHtmlBalloonFinished = function(){};
            }
        }
        //earth.HtmlBalloon.ShowHtml(showLineHtml, centerX, centerY, centerZ, 310, 300, true);
        //}
    };
    function initPointOnLineValue (layerID, record, layerName, type, tableName, v3s, params) {

        //StatisticsMgr.initPipeConfigDoc(layerID, true, true); //初始化编码映射文件对象, 不初始化空间坐标转换对象
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td class="font" >-----------------</td>';
        showLineHtml = showLineHtml + '<td class="font" >---------------------------</td>';
        showLineHtml = showLineHtml + '</tr>';
        if(type === 0){
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td class="font" >起点属性:</td>';
            showLineHtml = showLineHtml + '</tr>';
        }else if(type === 1){
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td class="font">终点属性:</td>';
            showLineHtml = showLineHtml + '</tr>';
        }
        var pointType = getValueByCode("CPointCodes", params.US_PT_TYPE);
        var X =""; var Y="";
        if(v3s){
            X = (parseFloat(v3s.X)).toFixed(3);
            Y = (parseFloat(v3s.Y)).toFixed(3);
        }
        var altitude = (parseFloat(params.US_PT_ALT)).toFixed(3);
        var sdeep = (parseFloat(record.US_SDEEP)).toFixed(3);
        var edeep = (parseFloat(record.US_EDEEP)).toFixed(3);
        var sAlt = (parseFloat(record.US_SALT)).toFixed(3);
        var eAlt = (parseFloat(record.US_EALT)).toFixed(3);

        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td>管点标识:</td>';
        showLineHtml = showLineHtml + '<td>' + (type == 0 ? record.US_SPT_KEY : record.US_EPT_KEY)+ '</td>';
        showLineHtml = showLineHtml + '</tr>';
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td>地面高程:</td>';
        showLineHtml = showLineHtml + '<td>' + altitude+ '</td>';
        showLineHtml = showLineHtml + '</tr>';
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td>特征:</td>';
        showLineHtml = showLineHtml + '<td>' + pointType+ '</td>';
        showLineHtml = showLineHtml + '</tr>';
       /* $("#" + tableName).append('<tr><td class="col w75p">所属图层</td><td class="col w25p">' + layerName + '</td></tr>');
        $("#" + tableName).append('<tr><td class="col w75p">管点标识</td><td class="col w25p">' + (type == 0 ? record.US_SPT_KEY : record.US_EPT_KEY) + '</td></tr>');
        $("#" + tableName).append('<tr><td class="col w75p">地面高程</td><td class="col w25p">' + altitude + '</td></tr>');
        $("#" + tableName).append('<tr><td class="col w75p">特征</td><td class="col w25p">' + pointType + '</td></tr>');*/
        if (record.US_ATTACHM) {
            var attachment = getValueByCode("AttachmentCode", record.US_ATTACHM);
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>附属物:</td>';
            showLineHtml = showLineHtml + '<td>' + attachment+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        if (record.US_WELL) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>井形状:</td>';
            showLineHtml = showLineHtml + '<td>' + record.US_WELL+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        if (record.US_WELL_ID) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>井标志:</td>';
            showLineHtml = showLineHtml + '<td>' + record.US_WELL_ID+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        if (record.US_FEATURE) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>关联模型:</td>';
            showLineHtml = showLineHtml + '<td>' + record.US_FEATURE+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        if (record.US_ANGLE) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>弯管角度:</td>';
            showLineHtml = showLineHtml + '<td>' + parseInt(record.US_ANGLE)+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        if (record.US_IS_SCRA) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>废弃年代:</td>';
            showLineHtml = showLineHtml + '<td>' + parseFloat(record.US_IS_SCRA).toFixed(2)+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        if (record.US_BD_TIME) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>创建年代:</td>';
            showLineHtml = showLineHtml + '<td>' + parseFloat(record.US_BD_TIME).toFixed(2)+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
        if (record.US_FX_YEAR) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>使用年限:</td>';
            showLineHtml = showLineHtml + '<td>' + record.US_FX_YEAR+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">附属物</td><td class="col w25p">' + attachment + '</td></tr>');
        }
       /* var road = null;
        if (!record.PROAD) {
            road = "";
        } else {
            road = record.PROAD;
        }
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td>道路名称:</td>';
        showLineHtml = showLineHtml + '<td>' + road+ '</td>';
        showLineHtml = showLineHtml + '</tr>';*/
        //$("#" + tableName).append('<tr><td class="col w75p">道路名称</td><td class="col w25p">' + road + '</td></tr>');
       /* if (type == 0) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>起点埋深:</td>';
            showLineHtml = showLineHtml + '<td>' + sdeep+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>管顶/底高程:</td>';
            showLineHtml = showLineHtml + '<td>' + sAlt+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">起点埋深</td><td class="col w25p">' + sdeep + '</td></tr>');
            //$("#" + tableName).append('<tr><td class="col w75p">管顶/底高程</td><td class="col w25p">' + sAlt + '</td></tr>');
        } else {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>终点埋深:</td>';
            showLineHtml = showLineHtml + '<td>' + edeep+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>管顶/底高程:</td>';
            showLineHtml = showLineHtml + '<td>' + eAlt+ '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#" + tableName).append('<tr><td class="col w75p">终点埋深</td><td class="col w25p">' + edeep + '</td></tr>');
            //$("#" + tableName).append('<tr><td class="col w75p">管顶/底高程</td><td class="col w25p">' + eAlt + '</td></tr>');
        }*/
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td>X坐标:</td>';
        showLineHtml = showLineHtml + '<td>' + X+ '</td>';
        showLineHtml = showLineHtml + '</tr>';
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td>Y坐标:</td>';
        showLineHtml = showLineHtml + '<td>' + Y+ '</td>';
        showLineHtml = showLineHtml + '</tr>';
        //$("#" + tableName).append('<tr><td class="col w75p">X坐标</td><td class="col w25p">' + X + '</td></tr>');
        //$("#" + tableName).append('<tr><td class="col w75p">Y坐标</td><td class="col w25p">' + Y + '</td></tr>');
    };
    var showLineHtml = "";
    function initLineValue (layerID, record, layerName) {
        if(queryHtmlBalloonHidden == false && queryHtmlBalloon){
            queryHtmlBalloon.DestroyObject();
            queryHtmlBalloon=null;
        }
        var rect = pObj.GetLonLatRect();
        var north = rect.North;
        var south = rect.South;
        var east = rect.East;
        var west = rect.West;
        var top = rect.MaxHeight;
        var bottom = rect.MinHeight;
        var centerX = (east + west) / 2;
        var centerY = (north + south) / 2;
        var centerZ = (top + bottom) / 2;

        initPipeConfigDoc(layerID, true, true); //初始化编码映射文件对象, 不初始化空间坐标转换对象
        var material = getValueByCode("Materials", record.US_PMATER);//管线材质
        var lineType = FieldValueStringMap.GetFieldValueString("US_LTTYPE", record.US_LTTYPE);//埋设类型
        var diam = parseInt(record.US_PDIAM);
        var width = (parseFloat(record.US_PWIDTH)).toFixed(3);
        var height = (parseFloat(record.US_PHEIGHT)).toFixed(3);
        showLineHtml = '<div style="width:100%;height:280px;overflow:auto;">';
        showLineHtml = showLineHtml+'<table style="width:100%;height:280px;font-size:14px;text-align:center;overflow:auto;color:#000000">';
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td class="font" >管线属性:</td>';
        showLineHtml = showLineHtml + '</tr>';
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td>所属图层:</td>';
        showLineHtml = showLineHtml + '<td>' + layerName + '</td>';
        showLineHtml = showLineHtml + '</tr>';
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td>管线标识:</td>';
        showLineHtml = showLineHtml + '<td>' + record.US_KEY + '</td>';
        showLineHtml = showLineHtml + '</tr>';
       /* $("#tblLineResult").append('<tr><td class="col w75p">所属图层</td><td class="col w25p">' + layerName + '</td></tr>');
        $("#tblLineResult").append('<tr><td class="col w75p">管线标识</td><td class="col w25p">' + record.US_KEY + '</td></tr>');*/
        if (record.US_PDIAM != 0) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>圆管半径:</td>';
            showLineHtml = showLineHtml + '<td>' + diam + '</td>';
            showLineHtml = showLineHtml + '</tr>';
            //$("#tblLineResult").append('<tr><td class="col w75p">圆管半径</td><td class="col w25p">' + diam + '</td></tr>');
        } else {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>方管宽度:</td>';
            showLineHtml = showLineHtml + '<td>' + width + '</td>';
            showLineHtml = showLineHtml + '</tr>'
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>方管高度:</td>';
            showLineHtml = showLineHtml + '<td>' + height + '</td>';
            showLineHtml = showLineHtml + '</tr>'

            /*$("#tblLineResult").append('<tr><td class="col w75p">方管宽度</td><td class="col w25p">' + width + '</td></tr>');
            $("#tblLineResult").append('<tr><td class="col w75p">方管高度</td><td class="col w25p">' + height + '</td></tr>');*/
        }
        // TODO: 需要将编码转为中文说明
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td>管道材质:</td>';
        showLineHtml = showLineHtml + '<td>' + material + '</td>';
        showLineHtml = showLineHtml + '</tr>'
        showLineHtml = showLineHtml + '<tr>';
        showLineHtml = showLineHtml + '<td>埋设方式:</td>';
        showLineHtml = showLineHtml + '<td>' + lineType + '</td>';
        showLineHtml = showLineHtml + '</tr>'
       /* $("#tblLineResult").append('<tr><td class="col w75p">管道材质</td><td class="col w25p">' + material + '</td></tr>');
        $("#tblLineResult").append('<tr><td class="col w75p">埋设方式</td><td class="col w25p">' + lineType + '</td></tr>');*/
        if (record.SURVEY_DAT != null || record.SURVEY_DAT != undefined) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>普查年代:</td>';
            showLineHtml = showLineHtml + '<td>' + parseFloat(record.SURVEY_DAT).toFixed(2) + '</td>';
            showLineHtml = showLineHtml + '</tr>'
            //$("#tblLineResult").append('<tr><td class="col w75p">普查年代</td><td class="col w25p">' + record.SURVEY_DAT + '</td></tr>');
        }
        if (record.US_OWNER != null || record.US_OWNER != undefined) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>权属单位:</td>';
            showLineHtml = showLineHtml + '<td>' + record.US_OWNER + '</td>';
            showLineHtml = showLineHtml + '</tr>'
            //$("#tblLineResult").append('<tr><td class="col w75p">权属单位</td><td class="col w25p">' + record.BELONG + '</td></tr>');
        }
        if (record.US_IS_SCRA != null || record.US_IS_SCRA!= undefined) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>废弃年代:</td>';
            showLineHtml = showLineHtml + '<td>' + parseFloat(record.US_IS_SCRA).toFixed(2) + '</td>';
            showLineHtml = showLineHtml + '</tr>'
            //$("#tblLineResult").append('<tr><td class="col w75p">权属单位</td><td class="col w25p">' + record.BELONG + '</td></tr>');
        }
        if (record.US_BD_TIME != null || record.US_BD_TIME != undefined) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>建设年代:</td>';
            showLineHtml = showLineHtml + '<td>' + parseFloat(record.US_BD_TIME).toFixed(2)+ '</td>';
            showLineHtml = showLineHtml + '</tr>'
            //$("#tblLineResult").append('<tr><td class="col w75p">权属单位</td><td class="col w25p">' + record.BELONG + '</td></tr>');
        }
        if (record.US_FX_YEAR != null || record.US_FX_YEAR != undefined) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>使用年限:</td>';
            showLineHtml = showLineHtml + '<td>' + record.US_FX_YEAR + '</td>';
            showLineHtml = showLineHtml + '</tr>'
            //$("#tblLineResult").append('<tr><td class="col w75p">权属单位</td><td class="col w25p">' + record.BELONG + '</td></tr>');
        }
        if (record.US_ROAD != null || record.US_ROAD != undefined) {
            showLineHtml = showLineHtml + '<tr>';
            showLineHtml = showLineHtml + '<td>道路名称:</td>';
            showLineHtml = showLineHtml + '<td>' + record.US_ROAD + '</td>';
            showLineHtml = showLineHtml + '</tr>'
            //$("#tblLineResult").append('<tr><td class="col w75p">权属单位</td><td class="col w25p">' + record.BELONG + '</td></tr>');
        }
        var layer = earth.LayerManager.GetLayerByGUID(layerID);
        var intLayerCode = layer.PipeLineType;
        if (intLayerCode >= 6000 && intLayerCode < 7000) {
            if (record.US_FLOWDIR != null || record.US_FLOWDIR != undefined) {
                showLineHtml = showLineHtml + '<tr>';
                showLineHtml = showLineHtml + '<td>管内流向:</td>';
                showLineHtml = showLineHtml + '<td>' + record.US_FLOWDIR + '</td>';
                showLineHtml = showLineHtml + '</tr>'
                //$("#tblLineResult").append('<tr><td class="col w75p">管内流向</td><td class="col w25p">' + record.US_FLOWDIR + '</td></tr>');
            }
        }
        //电信
        if (intLayerCode >= 2000 && intLayerCode < 3000) {
            if (record.CAB_NUM != null || record.US_FLOWDIR != undefined) {
                showLineHtml = showLineHtml + '<tr>';
                showLineHtml = showLineHtml + '<td>电缆条数:</td>';
                showLineHtml = showLineHtml + '<td>' + record.CAB_NUM + '</td>';
                showLineHtml = showLineHtml + '</tr>'
                //$("#tblLineResult").append('<tr><td class="col w75p">电缆条数</td><td class="col w25p">' + record.CAB_NUM + '</td></tr>');
            }
            if (record.TOTAL_HOLE != null || record.TOTAL_HOLE != undefined) {
                showLineHtml = showLineHtml + '<tr>';
                showLineHtml = showLineHtml + '<td>总孔数:</td>';
                showLineHtml = showLineHtml + '<td>' + record.TOTAL_HOLE + '</td>';
                showLineHtml = showLineHtml + '</tr>'
                //$("#tblLineResult").append('<tr><td class="col w75p">总孔数</td><td class="col w25p">' + record.TOTAL_HOLE + '</td></tr>');
            }
            if (record.USED_HOLE != null || record.USED_HOLE != undefined) {
                showLineHtml = showLineHtml + '<tr>';
                showLineHtml = showLineHtml + '<td>已用孔数:</td>';
                showLineHtml = showLineHtml + '<td>' + record.USED_HOLE + '</td>';
                showLineHtml = showLineHtml + '</tr>'
                //$("#tblLineResult").append('<tr><td class="col w75p">已用孔数</td><td class="col w25p">' + record.USED_HOLE + '</td></tr>');
            }
        }
        //电力
        if (intLayerCode >= 1000 && intLayerCode < 2000) {
            if (record.VOLTAGE != null || record.VOLTAGE != undefined) {
                showLineHtml = showLineHtml + '<tr>';
                showLineHtml = showLineHtml + '<td>压力/电压:</td>';
                showLineHtml = showLineHtml + '<td>' + record.VOLTAGE + '</td>';
                showLineHtml = showLineHtml + '</tr>'
                //$("#tblLineResult").append('<tr><td class="col w75p">压力/电压</td><td class="col w25p">' + record.VOLTAGE + '</td></tr>');
            }
            if (record.CAB_NUM != null || record.US_FLOWDIR != undefined) {
                showLineHtml = showLineHtml + '<tr>';
                showLineHtml = showLineHtml + '<td>电缆条数:</td>';
                showLineHtml = showLineHtml + '<td>' + record.CAB_NUM + '</td>';
                showLineHtml = showLineHtml + '</tr>'
                //$("#tblLineResult").append('<tr><td class="col w75p">电缆条数</td><td class="col w25p">' + record.CAB_NUM + '</td></tr>');
            }
            if (record.TOTAL_HOLE != null || record.TOTAL_HOLE != undefined) {
                showLineHtml = showLineHtml + '<tr>';
                showLineHtml = showLineHtml + '<td>总孔数:</td>';
                showLineHtml = showLineHtml + '<td>' + record.TOTAL_HOLE + '</td>';
                showLineHtml = showLineHtml + '</tr>'
                //$("#tblLineResult").append('<tr><td class="col w75p">总孔数</td><td class="col w25p">' + record.TOTAL_HOLE + '</td></tr>');
            }
            if (record.USED_HOLE != null || record.USED_HOLE != undefined) {
                showLineHtml = showLineHtml + '<tr>';
                showLineHtml = showLineHtml + '<td>已用孔数:</td>';
                showLineHtml = showLineHtml + '<td>' +  record.USED_HOLE + '</td>';
                showLineHtml = showLineHtml + '</tr>'
                //$("#tblLineResult").append('<tr><td class="col w75p">已用孔数</td><td class="col w25p">' + record.USED_HOLE + '</td></tr>');
            }
        }
        //排水
        if (intLayerCode >= 4000 && intLayerCode < 5000) {
            if (record.US_FLOWDIR != null || record.US_FLOWDIR != undefined) {
                showLineHtml = showLineHtml + '<tr>';
                showLineHtml = showLineHtml + '<td>管内流向:</td>';
                showLineHtml = showLineHtml + '<td>' + record.US_FLOWDIR + '</td>';
                showLineHtml = showLineHtml + '</tr>'
                //$("#tblLineResult").append('<tr><td class="col w75p">管内流向</td><td class="col w25p">' + record.US_FLOWDIR + '</td></tr>');
            }
        }
        //工业
        if (intLayerCode >= 7000 && intLayerCode < 8000) {
            if (record.VOLTAGE != null || record.VOLTAGE != undefined) {
                showLineHtml = showLineHtml + '<tr>';
                showLineHtml = showLineHtml + '<td>压力/电压:</td>';
                showLineHtml = showLineHtml + '<td>' + record.VOLTAGE + '</td>';
                showLineHtml = showLineHtml + '</tr>'
                //$("#tblLineResult").append('<tr><td class="col w75p">压力/电压</td><td class="col w25p">' + record.VOLTAGE + '</td></tr>');
            }
            if (record.US_FLOWDIR != null || record.US_FLOWDIR != undefined) {
                showLineHtml = showLineHtml + '<tr>';
                showLineHtml = showLineHtml + '<td>管内流向:</td>';
                showLineHtml = showLineHtml + '<td>' + record.US_FLOWDIR + '</td>';
                showLineHtml = showLineHtml + '</tr>'
                //$("#tblLineResult").append('<tr><td class="col w75p">管内流向</td><td class="col w25p">' + record.US_FLOWDIR + '</td></tr>');
            }
        }
        //燃气
        if (intLayerCode >= 5000 && intLayerCode < 6000) {
            if (record.VOLTAGE != null || record.VOLTAGE != undefined) {
                showLineHtml = showLineHtml + '<tr>';
                showLineHtml = showLineHtml + '<td>压力/电压:</td>';
                showLineHtml = showLineHtml + '<td>' + record.VOLTAGE + '</td>';
                showLineHtml = showLineHtml + '</tr>'
                //$("#tblLineResult").append('<tr><td class="col w75p">压力/电压</td><td class="col w25p">' + record.VOLTAGE + '</td></tr>');
            }
        }
        initCustomValue(layerID, record);
        var str1 = record.US_SPT_KEY;
        var str2 = record.US_EPT_KEY;
        var xmlDoc = getCoordinates2(layerID, str1, str2);
         if(xmlDoc){
             var v3s1 =getCoordinates(xmlDoc, layerID, str1);
             var params1 = getTempParams(xmlDoc, str1);

             var v3s2 =getCoordinates(xmlDoc, layerID, str2);
             var params2 = getTempParams(xmlDoc, str2);

             initPointOnLineValue(layerID, record, layerName, 0, showLineHtml, v3s1, params1);
             initPointOnLineValue(layerID, record, layerName, 1, showLineHtml, v3s2, params2);
         }

        showLineHtml = showLineHtml + '</table>';
        showLineHtml =showLineHtml + '</div>';
        var guid = earth.Factory.CreateGuid();
        queryHtmlBalloon = earth.Factory.CreateHtmlBalloon(guid, "balloon");
        queryHtmlBalloon.SetSphericalLocation(centerX, centerY, centerZ);
        queryHtmlBalloon.SetRectSize(350, 370);
        var color = parseInt("0xccffffff");//0xccc0c0c0
        queryHtmlBalloon.SetTailColor(color);
        queryHtmlBalloon.SetIsAddCloseButton(true);
        queryHtmlBalloon.SetIsAddMargin(true);
        queryHtmlBalloon.SetIsAddBackgroundImage(true);
        //queryHtmlBalloon.SetIsTransparence(true);
        queryHtmlBalloon.SetBackgroundAlpha(0xcc);
        queryHtmlBalloon.ShowHtml(showLineHtml);
        earth.Event.OnHtmlBalloonFinished = function(){
            if(queryHtmlBalloonHidden == false && queryHtmlBalloon!=null){
                queryHtmlBalloon.DestroyObject();
                queryHtmlBalloon=null;
                earth.Event.OnHtmlBalloonFinished = function(){};
            }
        }
        //earth.HtmlBalloon.ShowHtml(showLineHtml, centerX, centerY, centerZ,450,800, true);
    };

    function initCustomValue(layerID, record) {
        var configUrl = "http://" + pipeConfigLink.substr(2).replace("/", "/sde?").replace("PipeConfig.config", "FieldMap.config") + "_sde";
        var systemDoc = loadXMLStr(configUrl);
        var jsonData = $.xml2json(systemDoc);
        if (jsonData != null) {
            var lineFieldMap = jsonData.LineFieldMap;
            if (lineFieldMap.UserDefine != null && lineFieldMap.UserDefine != undefined && lineFieldMap.UserDefine.FieldMapItem != null && lineFieldMap.UserDefine.FieldMapItem != undefined) {
                var count = lineFieldMap.UserDefine.FieldMapItem.length;
                if (count == 0 || count == undefined) {
                    //for(var i=0;i<lineFieldMap.UserDefine.FieldMapItem.length;i++){
                    var fidldCaption = lineFieldMap.UserDefine.FieldMapItem.FieldCaption;
                    var fieldMapitem = lineFieldMap.UserDefine.FieldMapItem.FieldName;
                    fieldMapitem = fieldMapitem.toUpperCase();
                    if (record[fieldMapitem] != "") {
                        $("#tblLineResult").append('<tr><td class="col w75p">' + fidldCaption + '</td><td class="col w25p">' + record[fieldMapitem] + '</td></tr>');
                    }
                    // }
                } else {
                    for (var i = 0; i < lineFieldMap.UserDefine.FieldMapItem.length; i++) {
                        var fidldCaption = lineFieldMap.UserDefine.FieldMapItem[i].FieldCaption;
                        var fieldMapitem = lineFieldMap.UserDefine.FieldMapItem[i].FieldName;
                        fieldMapitem = fieldMapitem.toUpperCase();
                        if (record[fieldMapitem] != "") {
                            if (parseInt(record[fieldMapitem]) == 0) {
                                $("#tblLineResult").append('<tr><td class="col w75p">' + fidldCaption + '</td><td class="col w25p"></td></tr>');
                            } else {
                                $("#tblLineResult").append('<tr><td class="col w75p">' + fidldCaption + '</td><td class="col w25p">' + record[fieldMapitem] + '</td></tr>');
                            }
                        }
                        else {
                            $("#tblLineResult").append('<tr><td class="col w75p">' + fidldCaption + '</td><td class="col w25p">   </td></tr>');
                        }
                    }
                }

            }
        }
    }
    /**
     *获取平面坐标
     */
    function getPlaneCoordinates(layerID, data, usKey) {
        var Record = null;
        var jsonData = $.xml2json(data);
        if ( jsonData == null||!jsonData.Result || jsonData.Result.num == 0 ) {
            return;
        } else if (jsonData.Result.num == 1) {
            Record = jsonData.Result.Record;
            /*if (jsonData.Result.Record.US_KEY != usKey) {
                return false;
            }*/
        } else if (jsonData.Result.num > 1) {
            for (var i = 0; i < jsonData.Result.num; i++) {
               if (jsonData.Result.Record[i].US_KEY != usKey) {
                   continue;
               } else {
                    Record = jsonData.Result.Record[i];
              }
            }
        }
        var Coordinates = Record.SHAPE.Point.Coordinates;
        var coord = Coordinates.split(" ");
        var coordinate1 = coord[0].split(",");
        var Coordinate = transformToPlaneCoordinates(layerID, coordinate1);
        return Coordinate;
    }

    function parseResult2(data, usKey) {
        var Record = null;
        var json = $.xml2json(data);
        if (json == null || !json.Result) {
            //alert("查询结果不存在，请重新查询！");
            return false;
        }
        var count = json.Result.num;
        if (count == 0) {
            //alert("查询结果不存在，请重新查询！");
            return false;
        } else if (count == 1) {
            Record = json.Result.Record;
            if (json.Result.Record.US_KEY != usKey) {
                return false;
            }
        } else {
            for (var i = 0; i < count; i++) {
                if (json.Result.Record[i].US_KEY != usKey) {
                    continue;
                } else {
                    Record = json.Result.Record[i];
                }
            }
        }
        if (Record == null) {
            return false;
        }
        return Record;
    }

    /**
     *经纬度转平面坐标
     */
    function transformToPlaneCoordinates(layerId, coord) {
        var datum = pipeDatum;
        /*  var datum = CoordinateTransform.createDatum(); */
        var v3s1 = datum.des_BLH_to_src_xy(coord[0], coord[1], coord[2]);//经纬度转平面坐标
        return v3s1;
    }

    /**
     * 发送异步请求，查询符合条件的管线数据
     * @param queryURL   查询地址
     * @param type       类型：point或者line
     * @param layerID    图层GUID
     */
    /*function loadXMLStr(xmlStr) {
        var xmlDoc;
        try {
            if (window.ActiveXObject) {
                var activeX = ['Microsoft.XMLDOM', 'MSXML5.XMLDOM', 'MSXML.XMLDOM', 'MSXML2.XMLDOM', 'MSXML2.DOMDocument'];
                for (var i = 0; i < activeX.length; i++) {
                    xmlDoc = new ActiveXObject(activeX[i]);
                    xmlDoc.async = false;
                    break;
                }
                if (/http/ig.test(xmlStr.substring(0, 4))) {
                    xmlDoc.load(xmlStr);
                } else {
                    xmlDoc.loadXML(xmlStr);
                }
            } else if (document.implementation && document.implementation.createDocument) {
                xmlDoc = document.implementation.createDocument('', '', null);
                xmlDoc.loadXml(xmlStr);
            } else {
                xmlDoc = null;
            }
        } catch (exception) {
            xmlDoc = null;
        }

        return xmlDoc;
    }*/
    function loadXMLStr(xmlStr){
        var xmlDoc;

        try {
            if(window.ActiveXObject) {
                var activeX = ['Microsoft.XMLDOM', 'MSXML5.XMLDOM', 'MSXML.XMLDOM', 'MSXML2.XMLDOM','MSXML2.DOMDocument'];
                for (var i=0; i<activeX.length; i++){
                    xmlDoc = new ActiveXObject(activeX[i]);
                    xmlDoc.async = false;
                    break;
                }
                if (/http/ig.test(xmlStr.substring(0,4))){
                    xmlDoc.load(xmlStr);
                }else{
                    xmlDoc.loadXML(xmlStr);
                }
            } else if (document.implementation && document.implementation.createDocument) {
                xmlDoc = document.implementation.createDocument('', '', null);
                xmlDoc.loadXml(xmlStr);
            } else {
                xmlDoc = null;
            }
        }catch (exception){
            xmlDoc = null;
        }
        return xmlDoc;
    };

    function query(queryURL, layerID, layerName, bLine) {
//        $("#QueryProperty").removeClass("selected");
        var xmlDoc = loadXMLStr(queryURL);
        var json = $.xml2json(xmlDoc);
        if (json == null || !json.Result) {
            alert("查询结果不存在，请重新查询！");
            return;
        }
        var records = null;
        var num = json.Result.num;
        if (num == 0) {
            alert("查询结果不存在，请重新查询！");
            return;
        } else if (num == 1) {
            records = json.Result.Record;
        } else {
            records = json.Result.Record[0];
        }
        if (bLine) {
            $("#divPointResult").hide();
            $("#divLineResult").show();
            initLineValue(layerID, records, layerName);
        } else {
            $("#divPointResult").show();
            $("#divLineResult").hide();
            initPointValue(layerID, records, layerName, layerID);
        }
    };


    /**
     * 功能：根据管线图层ID初始化该管线的编码映射文件对象和空间参考对象
     * 参数：layerId - 管线图层ID; isInitDoc-是否初始化管线的编码映射文件对象; isInitDatum-是否初始化管线的空间参考对象
     * 返回：无
     */
    function initPipeConfigDoc(layerId, isInitDoc, isInitDatum) {
        if (layerId.indexOf("_") > 0) {
            layerId = layerId.split("_")[0];
        }
        var layer = earth.LayerManager.GetLayerByGUID(layerId);
        var projectSetting = layer.ProjectSetting;
        var layerLink = projectSetting.PipeConfigFile;
        pipeConfigLink = layerLink;
        if (isInitDoc == true) { //初始化管线编码映射文件对象
            var configUrl = "http://" + layerLink.substr(2).replace("/", "/sde?") + "_sde";
            pipeConfigDoc = loadXMLStr(configUrl); //初始化编码映射文件对象
        }

        if (isInitDatum == true) { //初始化管线空间参考对象
            var spatialUrl = "http://" + projectSetting.SpatialRefFile.substr(2).replace("/", "/sde?") + "_sde";
            pipeDatum = createDatum(spatialUrl);
        }
    }

    /**
     * 功能：创建空间坐标转换对象
     */
    function createDatum(url) {
        if (url == null) {
            url = "http://" + CoordinateTransform.getRootPath() + "/config/spatial.xml";
        }
        var dataProcess = document.getElementById("dataProcess");
        dataProcess.Load();
        var datum = dataProcess.CoordFactory.CreateDatum();  //earth.Factory.CreateDatum();
        datum.InitFromFile(url);
        return datum;
    }

    /**
     * 功能：根据编码，获取编码对应的详细值
     * 参数：type-编码类型；codeId - 编码ID
     * 返回：编码对应的详细值
     */
    function getValueByCode(type, codeId) {
        var value = "";
        var nodes = pipeConfigDoc.getElementsByTagName(type);
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var codeNode = node.selectSingleNode("Code");
            if (parseFloat(codeNode.text) == parseFloat(codeId)) {
                value = node.selectSingleNode("Name").text;
                break;
            }
        }
        return value;
    }
} ;


var poiLayers = null;



//cy 加

var onPickObjectEx_BIM = function(pObj) {
    showBIMpropertyQuery(earth, pObj);
    earth.Environment.SetCursorStyle(209);
    earth.Event.OnPickObjectEx = function () { };
    earth.Event.OnLBDown = function () { };
    earth.Event.OnLBUp = function () { };
};

var onPickObject_BIM = function(param1, param2) {
    earth.Environment.SetCursorStyle(209);
    //高亮闪烁显示
    param1.ShowHighLight();
    showBIMpropertyQuery(earth,param1);
    earth.Event.OnPickObjectEx = function() {};
    earth.Event.OnPickObject = function() {};
    earth.Event.OnLBDown = function() {};
    earth.Event.OnLBUp = function() {};
}

//cy改
var onPickObjectEx_part  = function(pObj) {


    if(poiLayers == null){
        var layerManager = new CITYPLAN.LayerManager(earth);
        poiLayers = layerManager.getPoiLayers(1);
    }
    var ispoi = false;
    var poiLayerId = '';
    for(var i=0; i<poiLayers.length; i++){
        if(pObj.ParentGuid == poiLayers[i].name){
            ispoi = true;
            poiLayerId = poiLayers[i].id;
            break;
        }
    }
    if(!ispoi){
        pObj.Underground = true;

        parentLayerName = pObj.GetParentLayerName();
        if (parentLayerName == "" || parentLayerName == null) {
            alert("获得父层名称失败！");
            return false;
        }

        var cArr = parentLayerName.split("=");
        var cArr = cArr[1].split("_");
        var layerGuid =  cArr[0];

        var flag=false;
        for (var y=0;y<parent.partlayerGuidArr.length;y++)
        {
            if(parent.partlayerGuidArr[y]==layerGuid)  {flag=true;break;}
        }

        if(flag==false){
             alert("请点击网格部件！");
            return false;
        }
        pObj.ShowHighLight();
        key = pObj.GetKey();
        showpropertyQuery(earth, parentLayerName, key, pObj,"partAttr");
    } else {
        showpropertyQuery(earth, poiLayerId, 'poi', pObj,"partAttr");
    }
    earth.Environment.SetCursorStyle(209);

    earth.Event.OnPickObjectEx  =  function() {};

};





function getPolygonInfo(layer, filter, queryType, queryTableType, spatial){

    if(layer == null){
        return null;
    }
    var params = layer.QueryParameter;
    if(params == null){
        return null;
    }
    if(filter != null){
        params.Filter = filter;
    }
    if(spatial != null){
        params.SetSpatialFilter(spatial);
    }
    if(queryType != null){
        params.QueryType = queryType;
    }
    if(queryTableType != null){
        params.QueryTableType = queryTableType; //0为点表搜索；1为线表搜索
    }
    var result = layer.SearchFromGISServer();
    return result;
}


//展示
function showBIMpropertyQuery(earth, pObj) {
   var ServerIp=CITYPLAN_config.server.ip;
    var layers = [];
    var Fields = [];
    var Lens = [];
    var Types = [];
    var Values = [];
    var _index = 0; //所在图层

    getProperty();

    function getProperty() {
        //获取图层列表
        earth.Event.OnEditDatabaseFinished = function (pRes, Feature) {
            earth.Event.OnEditDatabaseFinished = function (pRes, Feature) { }
            var data = [];
            if(Feature!=null){
            for (var i = 0; i < Feature.GetChildCount(); i++) {
                var templayer = Feature.GetChildAt(i);
                layers.push(templayer.Guid);
            }
            }
            getLayer();
        }
        earth.DatabaseManager.GetAllLayer(ServerIp);
    }

    //获取所在图层
    function getLayer() {
        var i = 0;
        earth.Event.OnEditDatabaseFinished = function (pRes, Feature) {
            if(Feature!=null){
            for (var j = 0; j < Feature.Count; j++) {
                var item = Feature.Items(j);
                if (item.Guid == pObj.Guid) {
                    _index = i;
                    break;
                }
            }
            }
            i++;
            if (i < layers.length) {
                earth.DataBaseManager.GetDataBaseRecords(ServerIp, layers[i]);
            } else {
                getCols(_index);
            }
        }
        earth.DataBaseManager.GetDataBaseRecords(ServerIp, layers[i]);
    }

    //获取图层下的所有列
    function getCols(i) {
        earth.Event.OnEditDatabaseFinished = function (pRes, Feature) {
            earth.Event.OnEditDatabaseFinished = function (pRes, Feature) { }
            if(Feature!=null){
            for (var k = 0; k < Feature.Count; k++) {
                var item = Feature.Items(k);
                Fields.push(item.Name);
                Lens.push(item.Len);
                Types.push(item.Type);
            }
            }
            getVals(_index);
        }
        earth.DataBaseManager.GetAttributeColInfo(ServerIp, layers[i]);
    }

    //获取模型所有列值
    function getVals(i) {
        earth.Event.OnEditDatabaseFinished = function (pRes, Feature) {
            earth.Event.OnEditDatabaseFinished = function (pRes, Feature) { }
            if(Feature!=null){
            for (var m = 0; m < Feature.Count; m++) {
                var item = Feature.Items(m);
                var offset = 0;
                for (var n = 0; n < Fields.length; n++) {
                    Values.push(item.StringValue(offset, Lens[n]));
                    offset += Lens[n];
                }
            }
            }
            showProperty();
        }
        earth.DataBaseManager.GetAttributeByGuid(ServerIp, layers[i], pObj.Guid);
    }

    //显示属性
    function showProperty() {
        _initObjNormal(pObj.GetLonLatRect());
    }

    //显示一般的数据气泡
    function _initObjNormal(rect, type) {
        if (queryHtmlBalloonHidden == false && queryHtmlBalloon) {
            queryHtmlBalloon.DestroyObject();
            queryHtmlBalloon = null;
        }

        if (type == 'point') {
            var centerX = rect.Longitude;
            var centerY = rect.Latitude;
            var centerZ = rect.Altitude;
        } else {
            var north = rect.North;
            var south = rect.South;
            var east = rect.East;
            var west = rect.West;
            var top = rect.MaxHeight;
            var bottom = rect.MinHeight;
            var centerX = (east + west) / 2;
            var centerY = (north + south) / 2;
            var centerZ = (top + bottom) / 2;
        }
        var loaclUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/"));

        var url = loaclUrl +"/"+  "BimAttrTable.html"; ; //ShowNavigate只能用绝对路径

        var guid = earth.Factory.CreateGuid();
        queryHtmlBalloon = earth.Factory.CreateHtmlBalloon(guid, "balloon");


        queryHtmlBalloon.SetRectSize(410, 345);
        queryHtmlBalloon.SetIsTransparence(false);
        queryHtmlBalloon.SetSphericalLocation(centerX, centerY, centerZ);
        var color = parseInt("0xccffffff");//0xccc0c0c0
        queryHtmlBalloon.SetTailColor(color);
        queryHtmlBalloon.SetIsAddCloseButton(true);
        queryHtmlBalloon.SetIsAddMargin(true);
        queryHtmlBalloon.SetIsAddBackgroundImage(true);
        queryHtmlBalloon.SetBackgroundAlpha(0xcc);


        queryHtmlBalloon.ShowNavigate(url);
        earth.Event.OnHtmlNavigateCompleted = function (){
            setTimeout(function(){

                try{

                        var data=new Object();

                    data.fields=   Fields ;
                    data.values=  Values ;

                    queryHtmlBalloon.InvokeScript("postData", data);
                }
                catch (e) {

                }

            },100);
            earth.Event.OnHtmlNavigateCompleted = function (){};
        };
        earth.Event.OnHtmlBalloonFinished = function(){
            if(queryHtmlBalloonHidden == false && queryHtmlBalloon!=null){
                queryHtmlBalloon.DestroyObject();
                queryHtmlBalloon=null;
                earth.Event.OnHtmlBalloonFinished = function(){};
            }
        }


    }

    }


/**
 * 功能：根据点生成空间对象
 */
 function generateGeoPoints (geoPoint){
    var geoPoints = earth.Factory.CreateVector3s();
    //geoPoints.Add(geoPoint.Longitude,geoPoint.Latitude,geoPoint.altitude);
    geoPoints.Add(geoPoint.Longitude-0.00001,geoPoint.Latitude+0.00001,geoPoint.altitude);
    geoPoints.Add(geoPoint.Longitude+0.00001,geoPoint.Latitude+0.00001,geoPoint.altitude);
    geoPoints.Add(geoPoint.Longitude+0.00001,geoPoint.Latitude-0.00001,geoPoint.altitude);
    geoPoints.Add(geoPoint.Longitude-0.00001,geoPoint.Latitude-0.00001,geoPoint.altitude);
    return geoPoints;

}

//writer:cy end

