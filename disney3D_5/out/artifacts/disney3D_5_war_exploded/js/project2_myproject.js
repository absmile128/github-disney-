/**
 * User: wyh
 * Date: 12-12-12
 * Time: 上午10:03
 * Desc: 项目管理，依赖jquery和xml2json，CITYPLAN_config.js
 */

if (!CITYPLAN) {
    var CITYPLAN = {};
}


CITYPLAN.ProjImport = function (earth, dataProcess, generateEdit) {
    var projManager = {};
    var generateEditDll = generateEdit;
    var imgPathMgr = "../../image/project/";    // 方案树图标路径，相对管理页面的路径
    var imgPathInves = "image/project/";         // 方案树图标路径，相对审批树页面的路径（即index页面）
    var sep = "-";    // 分隔符，特殊节点（如规划专题、方案的阶段）ID由项目ID+sep+编码组成
    var parcelPloygonVcts3 = {}; //创建的规划用地
    var pjFolderLink = earth.RootPath + "temp\\";
    var pjPath;
    var planPrjName;
    var m_importLayerParams = new ActiveXObject("Scripting.Dictionary");
    var m_projectOffsetList = new ActiveXObject("Scripting.Dictionary");
    //常量
    var FileNameProjectInfo = "项目信息.xml";
    var FileNameSpatialInfo = "空间参考.spatial";
    var FileNameSchemeInfo = "方案信息.xml";
    var FileNameBuildingInfo = "建筑属性.xml";
    var DirectoryNameProjectTheme = "项目专题";
    var FileNameRoadRedLine = "道路红线.shp";
    var FileNamePlanUseLand = "规划用地.shp";
    var FileNameshpBuilding = "建筑.shp";
    var FileNameshpGreen = "绿地.shp";
    var FileNameshpBox = "控规盒.shp";
    var FileNameshpRoad = "道路中心线.shp";
    var FileExtensionshp = ".shp";
    var FileExtensionusb = ".usb";
    var FileExtensionusx = ".usx";
    var FileExtensionjpg = ".jpg";
    var FileExtensiondwg = ".dwg";

    var LayerNameBuildings = "buildingsmodel";
    var LayerNameGround = "groundmodel";
    var LayerNameBillBoard = "billboard";
    var LayerNameMatch = "matchmodel";

    var spatialRef;
     var spatialRefFile;
    /**
    * 保存每一个添加到数据库中图层的辅助信息：键值为图层guid
    * shp类型数据：对象包括ogr图层、datum和类型（parcel,roadline,simplebuilding和greenland）
    * 模型类型数据：对象包括文件路径、模型文件夹名称和类型（buildingmodel和groundmodel）
    */
    var addedLayerInfo = {};
    /**
    * 保存所有需要的数据库中的空间图层属性信息，键值为图层guid
    */
    var editLayers = parent.editLayers;
    $.support.cors = true; //开启jQuery跨域支持
    $.ajaxSetup({
        async: false  // 将ajax请求设为同步
    });
    var getSep = function () {
        return sep;
    };
    /**
    * 删除数组中的重复元素
    * @return {Array} 返回一个新的数组
    */
    var makeUnique = function (arr) {
        var result = [];
        for (var i = 0; i < arr.length; i++) {
            if ($.inArray(arr[i], result) == -1) {
                result.push(arr[i]);
            }
        }
        return result;
    };
    var arr_del = function (arr, d) {
        return arr.slice(0, d - 1).concat(arr.slice(d));
    }
    /**
    * 数据库服务操作通用功能
    * @param url 服务地址
    * @param xml POST内容：xml格式
    * @return {String} 直接返回服务所返回的内容：xml格式的字符串
    */
    var dbUtil = function (url, xml) {
        var res = "";
        $.ajaxSetup({
            async: false  // 将ajax请求设为同步
        });
        $.post(url, xml, function (data) {
            res = data;
        });
        return res;
    };
    /**
    * 从数据库中查询数据
    * @param serviceUrl 查询服务地址
    * @param xmlQuery 查询XML语句
    * @return {Array} 返回结果，如果没有查到符合条件的内容，返回空数组
    * @private
    */
    var _queryData = function (serviceUrl, xmlQuery) {
        var result = [];
        var res = dbUtil(serviceUrl, xmlQuery);
        res = $.xml2json(res).record;
        if (res) {
            if ($.isArray(res)) {
                result = res;
            } else {
                result.push(res);
            }
        }
        return result;
    };


    /**
    * 封装装载XML的方法,并返回XML文档的根元素节点。
    * @param flag true时参数xml表示xml文档的名称；false时参数xml是一个字符串，其内容是一个xml文档
    * @param xml 根据flag参数的不同表示xml文档的名称或一个xml文档的字符串表示
    */
    //    var loadXML = function(flag,xml){
    //        var xmlDoc;
    //        //针对IE浏览器
    //        if(window.ActiveXObject){
    //        var aVersions = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0","MSXML2.DOMDocument.4.0","MSXML2.DOMDocument.3.0",
    //        "MSXML2.DOMDocument","Microsoft.XmlDom"];
    //        for (var i = 0; i < aVersions.length; i++) {
    //        try {
    //        //建立xml对象
    //        xmlDoc = new ActiveXObject(aVersions[i]);
    //        break;
    //        } catch (oError) {
    //        }
    //        }
    //        if(xmlDoc != null){
    //        //同步方式加载XML数据
    //        xmlDoc.async = false;
    //        //根据XML文档名称装载
    //        if(flag == true){
    //        xmlDoc.load(xml);
    //        } else{
    //        //根据表示XML文档的字符串装载
    //        xmlDoc.loadXML(xml);
    //        }
    //        //返回XML文档的根元素节点。
    //        return xmlDoc.documentElement;
    //        }
    //        } else{
    //        //针对非IE浏览器
    //        if(document.implementation && document.implementation.createDocument){
    //        /*
    //        第一个参数表示XML文档使用的namespace的URL地址
    //        第二个参数表示要被建立的XML文档的根节点名称
    //        第三个参数是一个DOCTYPE类型对象，表示的是要建立的XML文档中DOCTYPE部分的定义，通常我们直接使用null
    //        这里我们要装载一个已有的XML文档，所以首先建立一个空文档，因此使用下面的方式
    //        */
    //        xmlDoc = document.implementation.createDocument("","",null);
    //        if(xmlDoc != null){
    //        //根据XML文档名称装载
    //        if(flag == true){
    //        //同步方式加载XML数据
    //        xmlDoc.async = false;
    //        xmlDoc.load(xml);
    //        } else{
    //        //根据表示XML文档的字符串装载
    //        var oParser = new DOMParser();
    //        xmlDoc = oParser.parseFromString(xml,"text/xml");
    //        }
    //        //返回XML文档的根元素节点。
    //        return xmlDoc.documentElement;
    //        }
    //        }
    //        }
    //        return null;
    //    };
    //
    var internalFun = function () {
        top.$('#impDialog').dialog({
            closed: false,
            modal: true
        });

       earth.GlobeObserver.Stop();
       
        earth.GlobeObserver.EnablePan = false;
        earth.GlobeObserver.EnableRotate = false;
        earth.GlobeObserver.EnableZoom = false;
        earth.GlobeObserver.EnablePanAuto = false;
        earth.GlobeObserver.EnableRotateAuto = false;
        //window.showModalDialog("html/view/modal.html",null,"dialogWidth=200px;dialogHeight=100px");
        //setTimeout("msgFrm.location.reload();",1500); 
    };

    /**
    * 导入项目(功能入口)
    */
    var importProject = function () {

        var projectPath = earth.UserDocument.OpenFileDialog("", "项目文件(*.planPrj)|*.planPrj");    // 选择项目文件完整路径
        if (!projectPath) {
            return;
        }

        //弹出气泡窗体...
        internalFun();
        dataProcess.Load();
        //解压该文件
        var texttrue = projectPath.split("\\");
        var planPrj = texttrue[texttrue.length - 1];
        planPrjName = planPrj.split(".")[0];
        pjPath = pjFolderLink + planPrjName;
        dataProcess.BaseFileProcess.FileUnPackage(projectPath, pjPath);
        parent.isImportLoop = 0;
        var projectGUID;
        var projectNAME;
        //"项目信息.xml"
        var proInfofile = pjPath + "\\项目信息.xml";
        //var proXML = loadXML(true, proInfofile);
        //alert(proXML.xml);
        //此处的xml要采用ANSI编码 否则LoadXmlFile得到的字符串为乱码
        var configXml = earth.UserDocument.LoadXmlFile(proInfofile);
        //alert(configXml);
        if (configXml) {
            //if(proXML && proXML.xml){
            earth.Event.OnEditDatabaseFinished = Earth_OnEditDatabaseFinished;
            var xmlDoc = top.loadXMLStr(configXml);
            var xmlJSON = $.xml2json(xmlDoc);
            //项目ID
            projectGUID = xmlJSON.ID;
            //项目NAME 2014-4-18
            projectNAME = xmlJSON.NAME;
            //projectNAME = planPrjName;
            if (projectGUID === "" || projectGUID === undefined) {
                return;
            }
            //检查数据库中是否已经存在相同GUID的项目
            var returnPJxml = checkPeojectGUID(projectGUID);
            if (returnPJxml != "") {
                //判断是否包含有record节点 
                top.$('#impDialog').dialog({
                    closed: true,
                    modal: true
                });
                top.$('#impDialog').dialog('close');
                alert("已经包含了该项目!请删除后再进行导入操作!");
                earth.GlobeObserver.EnablePan = true;
                earth.GlobeObserver.EnableRotate = true;
                earth.GlobeObserver.EnableZoom = true;
                earth.GlobeObserver.EnablePanAuto = true;
                earth.GlobeObserver.EnableRotateAuto = true;
                //关闭遮罩层
                return;
            }

            //投影文件 后续图层初始化时候需要用到...
            if (xmlJSON.PROJECTIONFILE) {
                var spatialPath = xmlJSON.PROJECTIONFILE.PATH;
                spatialRef = dataProcess.CoordFactory.CreateSpatialRef();
                if (spatialPath) {
                  //  spatialRef.InitFromFile(pjPath + spatialPath);
		    	spatialRefFile = pjPath + spatialPath;
                    spatialRef.InitFromFile(spatialRefFile);
                }
            }
            //从[项目信息.xml]中获取[用地信息.xml]并解析(从中获取ID跟NAME)
            var parcelPath = xmlJSON.PARCEL.PATH;
            var veprjPath = xmlJSON.DATA.PATH;
            var parcelConfigXml = earth.UserDocument.LoadXmlFile(pjPath + parcelPath);
            // var parcelConfigXml = loadXML(true, pjPath + parcelPath);
            var parcelDoc = top.loadXMLStr(parcelConfigXml);
            var parcelJSON = $.xml2json(parcelDoc);
            var parcelID = parcelJSON.ID;
            var parcelNAME = parcelJSON.YDNAME;
            //导入项目信息(其中包含规划用地 在用地信息.xml中) 
            var importPJ = ImportProjectInfo(projectGUID, projectNAME, parcelNAME, parcelJSON);
            //项目信息导入成功才进行其他数据的导入
            if (importPJ) {

                // 导入方案信息,方案附件,方案总平面图
                var schemePathFinally = [];
                var objTemp = {};
                var schemePath = xmlJSON.SCHEMES.PATH;
                if (!isArray(schemePath)) {
                    //schemePath = [pjFolderLink + planPrjName +  schemePath];
                    schemePathFinally = [pjFolderLink + planPrjName + schemePath];
                } else {
                    for (var h = 0; h < schemePath.length; h++) {
                        var schItem = schemePath[h];
                        if (objTemp[schItem]) {
                            continue;
                        } else {
                            //schemePath[h] = pjFolderLink + planPrjName  + schemePath[h];
                            schemePathFinally.push(pjFolderLink + planPrjName + schemePath[h]);
                            objTemp[schItem] = h;
                        }
                    }
                }
                ImportScheme(pjFolderLink, schemePathFinally, projectGUID, projectNAME);

                // 导入道路红线
                var roadLinePath = xmlJSON.ROADLINE.PATH;
                ImportRoadRedLineInfo(pjFolderLink, pjFolderLink + planPrjName + roadLinePath, projectGUID);

                // 导入项目附件
                var projectPath = xmlJSON.ATTACHMENTS.PATH;
                if (!isArray(projectPath)) {
                    projectPath = [pjPath + projectPath];
                } else {
                    for (var h = 0; h < projectPath.length; h++) {
                        projectPath[h] = pjPath + projectPath[h];
                    }
                }
                ImportAttachments(projectPath, projectGUID, false);

                // 导入方案空间数据，即解析.veprj文件 需要在回调函数里处理 TODO:
                var veprjPath = pjPath + "\\" + veprjPath;
                ImportSpatialData(projectGUID, planPrjName, veprjPath, pjFolderLink);
            }
            //alert("导入完毕!");
        }
    };

    var isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    /**
    *已看
    * 导入项目空间数据,解析
    * @return 
    */
    var ImportSpatialData = function (projectGuid, planPrjName, veprjPath, pjFolderLink) {
        // var veprjConfigXml = loadXML(true, veprjPath);
        var veprjConfigXml = earth.UserDocument.LoadXmlFile(veprjPath);
        //解析xml
        var xmlDoc = top.loadXMLStr(veprjConfigXml);
        var xmlJSON = $.xml2json(xmlDoc);
        var coordinateOffset = xmlJSON.VEProject.CoordinateOffset;  //cy:偏移量
        var offsetx = coordinateOffset.OffsetX;
        var offsety = coordinateOffset.OffsetY;
        var vec2 = earth.Factory.CreateVector2();
        vec2.X = offsetx;
        vec2.Y = offsety;
        //cy0513
         vec2.X = 0;
        vec2.Y = 0;

        m_projectOffsetList.item(projectGuid)  = vec2;

        //获取方案节点
        var scheme = xmlJSON.VEProject.VEScheme;
        if (scheme.length === undefined) {
            scheme = [scheme];
        }
        ImportEachScheme(scheme, xmlJSON, projectGuid, planPrjName, veprjPath, pjFolderLink);
    };
    //已看
    var ImportEachScheme = function (scheme, xmlJSON, projectGuid, planPrjName, veprjPath, pjFolderLink) {

        for (var k = 0; k < scheme.length; k++) {
            //alert(scheme[i].name);
            var schemeGuid = scheme[k].id;
            var veGroup = scheme[k].VEGroup; //只有一个group,需要放在数组中
            var groupNum = veGroup.length;
            //项目名称
            var projectName = xmlJSON.VEProject.name;
            //方案名称
            var schemeName = scheme[k].name;
            var layerIDs = [];
            for (var i = 0; i < groupNum; i++) {
                var group = veGroup[i];
                var groupID = group.id;
                var groupNAME = group.name;
                var type;
                var layerName;
                switch (groupNAME) {
                    case "建筑模型":
                        type = 1;
                        layerName = projectName + "_" + schemeName + "_" + "buildingsmodel";
                        break;
                    case "地面模型":
                        type = 11;
                        layerName = projectName + "_" + schemeName + "_" + "groundmodel";
                        break;
                    case "树":
                        type = 2;
                        layerName = projectName + "_" + schemeName + "_" + "billboard";
                        break;
                    case "小品":
                        type = 3;
                        layerName = projectName + "_" + schemeName + "_" + "matchmodel";
                        break;
                }
                var meshDic = pjFolderLink + planPrjName + "\\" + schemeName + "\\" + groupNAME;
                AddLayer(projectGuid, groupID, layerName, type, group, meshDic, layerIDs);
            }

            var ids = "";
            for (var j = 0; j < layerIDs.length; j++) {
                var temp = layerIDs[j] + ",";
                if (j === layerIDs.length - 1) {
                    ids += layerIDs[j];
                } else {
                    ids += temp;
                }
            }
            Update("CPPLAN", schemeGuid, "LAYERIDS", ids);
        }
        // 导入道路红线
        var redLineNode = xmlJSON.VEProject.VERoadRedLine;
        if (redLineNode) {
            var roadLayerGuid = redLineNode.id;
            var roadLayerName = projectName + "_" + "roadredline";
            AddLayer2(projectGuid, roadLayerGuid, roadLayerName, 4, redLineNode);
            Update("CPPROJECT", projectGuid, "ROADLINELAYERID", roadLayerGuid);
        }

        // 导入规划用地
        var plotPlanNode = xmlJSON.VEProject.VEPlotPlan;
        if (plotPlanNode) {
            var plotPlanGuid = plotPlanNode.id;
            var plotPlanName = projectName + "_" + "parcel";
            AddLayer2(projectGuid, plotPlanGuid, plotPlanName, 5, plotPlanNode);
            Update("CPPROJECT", projectGuid, "PARCELLAYERID", plotPlanGuid);
        }

        // 导入地形平整
        var smoothLineNode = xmlJSON.VEProject.VESmoothLine;
        if (smoothLineNode) {
            var smoothLineGuid = smoothLineNode.id;
            var smoothLineName = projectName + "_" + "smoothline";
            AddLayer2(projectGuid, smoothLineGuid, smoothLineName, 5, smoothLineNode);
            Update("CPPROJECT", projectGuid, "SMOOTHLAYERID", smoothLineGuid);
        }
    };



    //已看
    var AddLayer2 = function (projectGuid, guid, name, type, node) {
        //TODO:注意layerIDS变量的作用域范围......

        var layerIDs = [];

        AddLayer(projectGuid, guid, name, type, node, "", layerIDs);
    };

    /**已看
    * 更新数据库中表数据(添加图层之后执行)
    * 2014.1.10
    */
    var Update = function (tableName, id, fieldName, value) {
        var xml =
            "<" + tableName + ">" +
            "<CONDITION>" +
            "<ID> ='" + id + "' </ID>" +
            "</CONDITION>" +
            "<CONTENT>" +
            "<" + fieldName + ">" + value + "</" + fieldName + ">" +
            "</CONTENT>" +
            "</" + tableName + ">";

        $.ajaxSetup({
            async: false
        });
        $.post(CITYPLAN_config.service.update, xml, function (data) {
            if (/true/.test(data)) {
                result = true;
            }
        }, "text");
    };

    var UpdateAttachment = function (tableName, fieldName1, value1, fieldName2, value2) {
        var xml =
            "<" + tableName + ">" +
            "<CONDITION>" +
            "<" + fieldName1 + ">='" + value1 + "'</" + fieldName1 + ">" +
            "</CONDITION>" +
            "<CONTENT>" +
            "<" + fieldName2 + ">" + value2 + "</" + fieldName2 + ">" +
            "</CONTENT>" +
            "</" + tableName + ">";

        $.ajaxSetup({
            async: false
        });
        $.post(CITYPLAN_config.service.update, xml, function (data) {
            if (/true/.test(data)) {
                result = true;
            }
        }, "text");
    };


    //已看
    var AddLayer = function (projectGuid, groupID, layerName, type, group, meshDic, layerIDs) {

        var datum = dataProcess.CoordFactory.CreateDatum();
        if (spatialRef) {
            datum.Init(spatialRef);
        }

        var importParam = {
            guid: groupID,
            name: layerName,
            type: type,
            node: group,
            ProjectGuid: projectGuid,
            Datum: datum,
            MeshDic: meshDic,
            SpatialRef:spatialRefFile
        };

        m_importLayerParams.item(groupID) = importParam;

        var param = earth.Factory.CreateLayerParameter();
        param.Guid = groupID;
        param.Name = layerName;
        param.Type = type;
        param.Status = 1;
        //alert(groupID + " " + layerName + " " + type + " " + "1");
        // -2表示图层是规划项目(即方案、规划用地和道路红线等图层)相关的;-1表示是编辑平台添加的图层；-3表示用地现状相关的，但也需要从编辑平台中添加

       earth.DatabaseManager.AddLayerInDatabaseIncludeGroupID(CITYPLAN_config.server.dataServerIP,param, -2);
        layerIDs.push(groupID);
    };

    /**      已看
    * 导入道路红线
    * @param  {[type]} folderPath   [description]
    * @param  {[type]} roadLinePath [description]
    * @param  {[type]} projectGuid  [description]
    * @return {[type]}              [description]
    */
    var ImportRoadRedLineInfo = function (folderPath, roadLinePath, projectGuid) {
        // var roadLineConfigXml = loadXML(true, roadLinePath);
        var roadLineConfigXml = earth.UserDocument.LoadXmlFile(roadLinePath);
        var xmlDoc = top.loadXMLStr(roadLineConfigXml);
        var xmlJSON = $.xml2json(xmlDoc);
        var roadLineID = xmlJSON.ROAD;
        if (roadLineID.length === undefined) {
            roadLineID = [roadLineID];
        }
        importRoadRedLineTemp(roadLineID, projectGuid);
    };


    //已看
    var importRoadRedLineTemp = function (roadLineID, projectGuid) {
        for (var i = 0; i < roadLineID.length; i++) {
            var roadLineNAME = roadLineID[i].NAME;
            var roadLineDistance = roadLineID[i].TXJL;
            var roadID = roadLineID[i].ID;
            var xml =
                "<CPROADLINE>" +
                "<ID>" + roadID + "</ID>" +
                "<PROJECTID>" + projectGuid + "</PROJECTID>" +
                "<CODE>" + roadLineNAME + "</CODE>" +
                "<TYPE />" +
                "<DISTANCE>" + roadLineDistance + "</DISTANCE> " +
                "</CPROADLINE>";

            $.ajaxSetup({
                async: false
            });
            $.post(CITYPLAN_config.service.add, xml, function (data) {
                // if (/true/.test(data)) {
                //     //alert("导入道路红线完毕!");
                //     result = true;
                // }
                if (/true/.test(data)) {
                    result = true;
                }
            }, "text");
        }
    };

    /**
    * 从数据库中获取项目的guid
    */
    var checkPeojectGUID = function (GUID) {
        var roadQueryXml =
            '<QUERY><CONDITION><AND>' +
                '<ID tablename="CPPROJECT">=\'' + GUID + '\'</ID>' +
                '</AND></CONDITION>' +
                '<RESULT><CPPROJECT/></RESULT>' +
                '</QUERY>';
        return _queryData(CITYPLAN_config.service.query, roadQueryXml);
    };

    /**已看
    * 导入项目信息 导入成功则返回true
    * 2014.4.21
    */
    var ImportProjectInfo = function (projectGUID, projectNAME, parcelNAME, parcelJSON) {
        var myDate = new Date();
        var tempMonth = myDate.getMonth() + 1;
        var currentMonth = (tempMonth < 10) ? ("0" + tempMonth) : tempMonth;
        var tempDate = myDate.getDate();
        var currentData = (tempDate < 10) ? ("0" + tempDate) : tempDate;
        var projectTime = myDate.getFullYear() + "" + currentMonth + "" + currentData;
        var result = false;
        var xml =
            "<CPPROJECT>" +
                "<ID>" + projectGUID + "</ID>" +
                "<NAME>" + projectNAME + "</NAME>" +
                "<YDNAME>" + parcelNAME + "</YDNAME>" +
                "<YDXZ>" + (parcelJSON.YDXZ ? parcelJSON.YDXZ : "") + "</YDXZ>" +
                "<STAGE>4</STAGE>" +
                "<QSDW>" + (parcelJSON.QSDW ? parcelJSON.QSDW : "") + "</QSDW>" +
                "<PROJDATE>" + projectTime + "</PROJDATE>" +
                "<STATUS>0</STATUS>" +
                "<ISLOAD>0</ISLOAD><PARCELLAYERID></PARCELLAYERID><ROADLINELAYERID></ROADLINELAYERID><SMOOTHLAYERID></SMOOTHLAYERID><DISTRICT></DISTRICT>" +
                "<YDMJ>" + (parcelJSON.YDMJ ? parcelJSON.YDMJ : "") + "</YDMJ>" +
                "<JZMD>" + (parcelJSON.JZMD ? parcelJSON.JZMD : "") + "</JZMD>" +
                "<RJL>" + (parcelJSON.RJL ? parcelJSON.RJL : "") + "</RJL>" +
                "<LDL>" + (parcelJSON.LDL ? parcelJSON.LDL : "") + "</LDL>" +
                "<JZXG>" + (parcelJSON.JZXG ? parcelJSON.JZXG : "") + "</JZXG>" +
                "<BZ>" + (parcelJSON.BZ ? parcelJSON.BZ : "") + "</BZ>" +
            "</CPPROJECT>";
        $.ajaxSetup({
            async: false
        });

        $.post(CITYPLAN_config.service.add, xml, function (data) {
            // if (/true/.test(data)) {
            //     //alert("导入规划用地!");
            //     result = true;
            // }
            if (/true/.test(data)) {//xml, json, script, text, html
                result = true;
            }
        }, "text");
        return result;
    };

    /**已看
    * 导入方案信息和方案附件
    */
    var ImportScheme = function (folderPath, schemePath, projectGuid, projectNAME) {
        for (var i = 0; i < schemePath.length; i++) {
            // var schemeConfigXml = loadXML(true, schemePath[i]);
            var result = false;
            var schemeConfigXml = earth.UserDocument.LoadXmlFile(schemePath[i]);
            if (schemeConfigXml) {
                var xmlDoc = top.loadXMLStr(schemeConfigXml);
                var planJSON = $.xml2json(xmlDoc);
                //                var parcelJSON = $.xml2json(xmlDoc);
                var planID = planJSON.ID;
                var planNAME = planJSON.NAME;
                var totalFile = planJSON.TOTALFLATFIGURE.PATH; //总平面图

                var planAttachments = planJSON.ATTACHMENTS.PATH; //方案附件
                if (planAttachments) {
                    if (!isArray(planAttachments)) {
                        planAttachments = [pjFolderLink + planPrjName + planAttachments];
                    } else {
                        for (var h = 0; h < planAttachments.length; h++) {
                            planAttachments[h] = pjFolderLink + planPrjName + planAttachments[h];
                        }
                    }
                }


                var xml =
                    "<CPPLAN>" +
                    "<ID>" + planID + "</ID>" +
                    "<PROJECTID>" + projectGuid + "</PROJECTID>" +
                    "<LAYERIDS />" +
                    "<NAME>" + planNAME + "</NAME>" +
//                    "<TYPE>4</TYPE><SJDW />" +
                    "<TYPE>4</TYPE><SJDW >" + (planJSON.SJDW ? planJSON.SJDW : "") + "</SJDW>" +
                        "<GHZYD>" + (planJSON.GHZYD ? planJSON.GHZYD : "") + "</GHZYD>" +
                        "<GHJYD>" + (planJSON.GHJYD ? planJSON.GHJYD : "") + "</GHJYD>" +
                        "<ZZYD>" + (planJSON.ZZYD ? planJSON.ZZYD : "") + "</ZZYD>" +
                        "<GJYD>" + (planJSON.GJYD ? planJSON.GJYD : "") + "</GJYD>" +
                        "<DLYD>" + (planJSON.DLYD ? planJSON.DLYD : "") + "</DLYD>" +
                        "<GGLD>" + (planJSON.GGLD ? planJSON.GGLD : "") + "</GGLD>" +
                        "<ZJZMJ>" + (planJSON.ZJZMJ ? planJSON.ZJZMJ : "") + "</ZJZMJ>" +
                        "<DSJZMJ>" + (planJSON.DSJZMJ ? planJSON.DSJZMJ : "") + "</DSJZMJ>" +
                        "<ZZJZMJ>" + (planJSON.ZZJZMJ ? planJSON.ZZJZMJ : "") + "</ZZJZMJ>" +
                        "<SYJZMJ>" + (planJSON.SYJZMJ ? planJSON.SYJZMJ : "") + "</SYJZMJ>" +
                        "<YEYJZMJ>" + (planJSON.YEYJZMJ ? planJSON.YEYJZMJ : "") + "</YEYJZMJ>" +
                        "<SQFWZXJZMJ>" + (planJSON.SQFWZXJZMJ ? planJSON.SQFWZXJZMJ : "") + "</SQFWZXJZMJ>" +
                        "<DXJZMJ>" + (planJSON.DXJZMJ ? planJSON.DXJZMJ : "") + "</DXJZMJ>" +
                        "<DXSYMJ>" + (planJSON.DXSYMJ ? planJSON.DXSYMJ : "") + "</DXSYMJ>" +
                        "<DXTCCMJ>" + (planJSON.DXTCCMJ ? planJSON.DXTCCMJ : "") + "</DXTCCMJ>" +
                        "<DXQTMJ>" + (planJSON.DXQTMJ ? planJSON.DXQTMJ : "") + "</DXQTMJ>" +
                        "<RJL>" + (planJSON.RJL ? planJSON.RJL : "") + "</RJL>" +
                        "<DSRJL>" + (planJSON.DSRJL ? planJSON.DSRJL : "") + "</DSRJL>" +
                        "<DXRJL>" + (planJSON.DXRJL ? planJSON.DXRJL : "") + "</DXRJL>" +
                        "<JZMD>" + (planJSON.JZMD ? planJSON.JZMD : "") + "</JZMD>" +
                        "<LDL>" + (planJSON.LDL ? planJSON.LDL : "") + "</LDL>" +
                        "<GHHS>" + (planJSON.GHHS ? planJSON.GHHS : "") + "</GHHS>" +
                        "<HJRK>" + (planJSON.HJRK ? planJSON.HJRK : "") + "</HJRK>" +
                        "<GHRS>" + (planJSON.GHRS ? planJSON.GHRS : "") + "</GHRS>" +
                        "<ZTCW>" + (planJSON.ZTCW ? planJSON.ZTCW : "") + "</ZTCW>" +
                        "<DSTCW>" + (planJSON.DSTCW ? planJSON.DSTCW : "") + "</DSTCW>" +
                        "<DXTCW>" + (planJSON.DXTCW ? planJSON.DXTCW : "") + "</DXTCW>" +
                        "<DMTCL>" + (planJSON.DMTCL ? planJSON.DMTCL : "") + "</DMTCL>" +
                //                    "<GHZYD>" +  (parcelJSON.GHZYD?parcelJSON.GHZYD:"") +"</GHZYD>"+
                //                    "<GHJYD>" +  (parcelJSON.GHJYD?parcelJSON.GHJYD:"") +"</GHJYD>"+
                //                    "<ZZYD>" +  (parcelJSON.ZZYD?parcelJSON.ZZYD:"") +"</ZZYD>"+
                //                    "<GJYD>" +  (parcelJSON.GJYD?parcelJSON.GJYD:"") +"</GJYD>"+
                //                    "<DLYD>" +  (parcelJSON.DLYD?parcelJSON.DLYD:"") +"</DLYD>"+
                //                    "<GGLD>" +  (parcelJSON.GGLD?parcelJSON.GGLD:"") +"</GGLD>"+
                //                    "<ZJZMJ>" +  (parcelJSON.ZJZMJ?parcelJSON.ZJZMJ:"") +"</ZJZMJ>"+
                //                    "<DSJZMJ>" +  (parcelJSON.DSJZMJ?parcelJSON.DSJZMJ:"") +"</DSJZMJ>"+
                //                    "<ZZJZMJ>" +  (parcelJSON.ZZJZMJ?parcelJSON.ZZJZMJ:"") +"</ZZJZMJ>"+
                //                    "<SYJZMJ>" +  (parcelJSON.SYJZMJ?parcelJSON.SYJZMJ:"") +"</SYJZMJ>"+
                //                    "<YEYJZMJ>" +  (parcelJSON.YEYJZMJ?parcelJSON.YEYJZMJ:"") +"</YEYJZMJ>"+
                //                    "<SQFWZXJZMJ>" +  (parcelJSON.SQFWZXJZMJ?parcelJSON.SQFWZXJZMJ:"") +"</SQFWZXJZMJ>"+
                //                    "<DXJZMJ>" +  (parcelJSON.DXJZMJ?parcelJSON.DXJZMJ:"") +"</DXJZMJ>"+
                //                    "<DXSYMJ>" +  (parcelJSON.DXSYMJ?parcelJSON.DXSYMJ:"") +"</DXSYMJ>"+
                //                    "<DXTCCMJ>" +  (parcelJSON.DXTCCMJ?parcelJSON.DXTCCMJ:"") +"</DXTCCMJ>"+
                //                    "<DXQTMJ>" +  (parcelJSON.DXQTMJ?parcelJSON.DXQTMJ:"") +"</DXQTMJ>"+
                //                    "<RJL>" +  (parcelJSON.RJL?parcelJSON.RJL:"") +"</RJL>"+
                //                    "<DSRJL>" +  (parcelJSON.DSRJL?parcelJSON.DSRJL:"") +"</DSRJL>"+
                //                    "<DXRJL>" +  (parcelJSON.DXRJL?parcelJSON.DXRJL:"") +"</DXRJL>"+
                //                    "<JZMD>" +  (parcelJSON.JZMD?parcelJSON.JZMD:"") +"</JZMD>"+
                //                    "<LDL>" +  (parcelJSON.LDL?parcelJSON.LDL:"") +"</LDL>"+
                //                    "<GHHS>" +  (parcelJSON.GHHS?parcelJSON.GHHS:"") +"</GHHS>"+
                //                    "<HJRK>" +  (parcelJSON.HJRK?parcelJSON.HJRK:"") +"</HJRK>"+
                //                    "<GHRS>" +  (parcelJSON.GHRS?parcelJSON.GHRS:"") +"</GHRS>"+
                //                    "<ZTCW>" +  (parcelJSON.ZTCW?parcelJSON.ZTCW:"") +"</ZTCW>"+
                //                    "<DSTCW>" +  (parcelJSON.DSTCW?parcelJSON.DSTCW:"") +"</DSTCW>"+
                //                    "<DXTCW>" +  (parcelJSON.DXTCW?parcelJSON.DXTCW:"") +"</DXTCW>"+
                //                    "<DMTCL>" +  (parcelJSON.DMTCL?parcelJSON.DMTCL:"") +"</DMTCL>" +
                    "<BZ /></CPPLAN>";

                $.ajaxSetup({
                    async: false
                });
                $.post(CITYPLAN_config.service.add, xml, function (data) {

                    if (/true/.test(data)) {
                        result = true;
                    }
                }, "text");
                //当方案信息导入成功后 再导入其他信息
                if (result) {
                    //导入建筑信息

                    var buildingPath = planJSON.BUILDINGS.PATH;
                    ImportBuildingsInfo(folderPath + planPrjName + buildingPath, projectGuid, planID, totalFile);
                    //导入方案附件
                    if (planAttachments) {
                        ImportAttachments(planAttachments, planID, false);
                    };
                }
            }
        }
    };

    /**已看
    * 导入建筑信息.xml
    */
    var ImportBuildingsInfo = function (BuildingPath, projectGuid, planID, totalFile) {
        // var buildingConfigXml = loadXML(true, BuildingPath);
        var buildingConfigXml = earth.UserDocument.LoadXmlFile(BuildingPath);
        //alert("建筑信息");
        var xmlDoc = top.loadXMLStr(buildingConfigXml);
        var xmlJSON = $.xml2json(xmlDoc);
        if(!$.isArray(xmlJSON.BUILDING)){
            //仅有一个建筑
            xmlJSON.BUILDING = [xmlJSON.BUILDING];        
	}

        var buildNum = xmlJSON.BUILDING.length;


      

        //遍历每一个建筑节点
        for (var i = 0; i < buildNum; i++) {
            var result = false;
            var  buildNode = xmlJSON.BUILDING[i];


            var buildingID = buildNode.ID;
            var buildingNAME = buildNode.NAME;
           
            var xml =
                "<CPBUILDING>" +
                "<ID>" + buildingID + "</ID>" +
                "<PLANID>" + planID + "</PLANID>" +
                "<NAME>" + buildingNAME + "</NAME>" +
                "<JZXZ />" +
                "<JZJDMJ>" + (buildNode.JZJDMJ ? buildNode.JZJDMJ : 0) + "</JZJDMJ><ZJZMJ>" + (buildNode.ZJZMJ ? buildNode.ZJZMJ : 0) + "</ZJZMJ><DSJZMJ>" + (buildNode.DSJZMJ ? buildNode.DSJZMJ : 0) + "</DSJZMJ><ZZJZMJ>" + (buildNode.ZZJZMJ ? buildNode.ZZJZMJ : 0) + "</ZZJZMJ><SYJZMJ>" + (buildNode.SYJZMJ ? buildNode.SYJZMJ : 0) + "</SYJZMJ><YEYJZMJ>" + (buildNode.YEYJZMJ ? buildNode.YEYJZMJ : 0) + "</YEYJZMJ><SQFWZXJZMJ>" + (buildNode.SQFWZXJZMJ ? buildNode.SQFWZXJZMJ : 0) + "</SQFWZXJZMJ><DXJZMJ>" + (buildNode.DXJZMJ ? buildNode.DXJZMJ : 0) + "</DXJZMJ><DXSYMJ>" + (buildNode.DXSYMJ ? buildNode.DXSYMJ : 0) + "</DXSYMJ><DXTCCMJ>" + (buildNode.DXTCCMJ ? buildNode.DXTCCMJ : 0) + "</DXTCCMJ><DXQTMJ>" + (buildNode.DXQTMJ ? buildNode.DXQTMJ : 0) + "</DXQTMJ><JZGD>" + (buildNode.JZGD ? buildNode.JZGD : 0) + "</JZGD><JZCS>" + (buildNode.JZCS ? buildNode.JZCS : 0) + "</JZCS><DSCS>" + (buildNode.DSCS ? buildNode.DSCS : 0) + "</DSCS><DXCS>" + (buildNode.DXCS ? buildNode.DXCS : 0) + "</DXCS><GHHS>" + (buildNode.GHHS ? buildNode.GHHS : 0) + "</GHHS><HJRK>" + (buildNode.HJRK ? buildNode.HJRK : 0) + "</HJRK><GHRS>" + (buildNode.GHRS ? buildNode.GHRS : 0) + "</GHRS><ZTCW>" + (buildNode.ZTCW ? buildNode.ZTCW : 0) + "</ZTCW><DSTCW>" + (buildNode.DSTCW ? buildNode.DSTCW : 0) + "</DSTCW><DXTCW>" + (buildNode.DXTCW ? buildNode.DXTCW : 0) + "</DXTCW></CPBUILDING>";
            $.ajaxSetup({
                async: false
            });
            $.post(CITYPLAN_config.service.add, xml, function (data) {
                // if (/true/.test(data)) {
                //     result = true;
                // }
                if (/true/.test(data)) {
                    result = true;
                }
            }, "text");

            var bPathStr = BuildingPath.substring(0, BuildingPath.lastIndexOf("\\"));
            //建筑附件
            var attachmentAry = buildNode.ATTACHMENTS.PATH;
            if (attachmentAry) {
                if (!isArray(attachmentAry)) {
                    attachmentAry = [bPathStr + "\\" + attachmentAry];
                } else {
                    for (var k = 0; k < attachmentAry.length; k++) {
                        attachmentAry[k] = bPathStr + "\\" + attachmentAry[k];
                    }
                }
                ImportAttachments(attachmentAry, buildingID, false);
            }
        }
        //导入总平图
        if (totalFile) {
            if (!isArray(totalFile)) {
                totalFile = [pjPath + "\\" + totalFile];
            } else {
                if (attachmentAry) {
                    for (var p = 0; p < attachmentAry.length; p++) {
                        attachmentAry[p] = pjPath + "\\" + attachmentAry[p];
                    }
                }
            }
            ImportAttachments(totalFile, planID, true);
        }
    };

    /**已看
    * todo:导入附属物 如:<PATH>mesh_xyhf1_jz01.USB\建筑附件\xyhf_gh01_211005_1_08.jpg</PATH>
    */
    var ImportAttachments = function (attachmentAry, buildingID, isTotalPlatPicture) {
        for (var i = 0; i < attachmentAry.length; i++) {
            var path = attachmentAry[i];
            var pathStrAry = path.split("\\");
            var pathName = pathStrAry[pathStrAry.length - 1]; // xyhf_gh01_211005_1_08.jpg
            var type = pathName.split(".")[1]; //type
            var id = earth.Factory.CreateGUID();
            //获取name
            //var nameAry = path.split(".")[0].split("\\");
            var name;
            if (isTotalPlatPicture) {
                name = buildingID;
            } else {
                name = pathName.split(".")[0]; //xyhf_gh01_211005_1_08
            }
            var xml =
            "<CPATTACHMENT>" +
            "<ID>" + id + "</ID>" +
            "<PLANID>" + buildingID + "</PLANID>" +
            "<NAME>" + name + "</NAME>" +
            "<TYPE>" + type + "</TYPE>" +
            "</CPATTACHMENT>";
            var result = false;
            $.ajaxSetup({
                async: false
            });
            $.post(CITYPLAN_config.service.add, xml, function (data) {
                // if (/true/.test(data)) {
                //     result = true;
                // }
                if (/true/.test(data)) {
                    result = true;
                }
            }, "text");
            //导入图片二进制数据
            if (result) {
                //这里要区分txt与图片
                earth.DatabaseManager.PostFile(path, CITYPLAN_config.service.addAttachmentObj + id)
            }
        }
    };

    /**
    * 更新项目的审批状态
    * @param id 项目ID
    * @param status 0,1,2
    */
    var updateStatus = function (id, status) {
        xmlUpdate = "<CPPROJECT>" +
            "<CONDITION><ID> ='" + id + "' </ID></CONDITION>" +
            "<CONTENT><STATUS>" + status + "</STATUS></CONTENT>" +
            "</CPPROJECT>";
        $.post(CITYPLAN_config.service.update, xmlUpdate);
    };
    /**
    * 根据项目状态、项目时间和项目名关键字查询得到项目记录
    * @param options.id 项目id
    * @param options.status 项目状态：审批、待审批、已审批
    * @param options.projDate 项目年份
    * @param options.projName 项目名称关键字
    * @return {*} 返回项目记录对象：包含对象的数组
    */
    var getProjectData = function (options) {
        // region 项目查询字符串
        var projectQueryXml =
            '<QUERY>' +
                '<CONDITION><AND>' +
                (options.id ? ("<ID tablename = 'CPPROJECT'>='" + options.id + "'</ID>") : '') +
                (options.status ? ('<STATUS tablename = "CPPROJECT">=' + options.status + '</STATUS>') : '') +
                (options.projDate ? ('<PROJDATE tablename = "CPPROJECT">=' + options.projDate + '</PROJDATE>') : '') +
                (options.projName ? ('<NAME tablename = "CPPROJECT">like \'' + options.projName + '%\'</NAME>') : '') +
                '</AND></CONDITION>' +
                '<RESULT><PROJECT></PROJECT></RESULT>' +
                '</QUERY>';
        // endregion
        return _queryData(CITYPLAN_config.service.query, projectQueryXml);
    };
    /**
    * 获取所有的项目时间
    * @return {*} 返回一个包含所有项目时间的数组
    */
    var getAllProjectDate = function () {
        var result = [];
        // region 项目查询字符串
        var projectQueryXml =
            '<QUERY>' +
                '<CONDITION></CONDITION>' +
                '<RESULT><PROJECT><FIELD>PROJDATE</FIELD></PROJECT></RESULT>' +
                '</QUERY>';
        // endregion
        var res = _queryData(CITYPLAN_config.service.query, projectQueryXml);
        $.each(res, function (i, r) {
            result.push(r["PROJECT.PROJDATE"]);
        });
        return makeUnique(result).sort(function (a, b) {  // 按年份从大到小排列
            return b - a
        });
    };

    // region 删除方案

    /**
    * 删除模型数据类型的方案：详规和单体
    * @param planId 方案ID
    * @private
    */
    var _deleteModelPlan = function (planId) {
        // 删除空间数据
        var xmlQuery = "<QUERY>" +
            "<CONDITION><AND><ID tablename='PLAN'> ='" + planId + "' </ID></AND></CONDITION>" +
            "<RESULT><PLAN></PLAN></RESULT>" +
            "</QUERY>";
        var res = _queryData(CITYPLAN_config.service.query, xmlQuery);
        if (res.length > 0) {
            var layerIds = res[0]["PLAN.LAYERIDS"];
            var layerIdArr = layerIds.split(",");
            $.each(layerIdArr, function (i, id) {
                earth.DatabaseManager.DeleteLayerInDatabase(CITYPLAN_config.server.dataServerIP,id);
            });
        }
        // 删除属性数据
        var xmlDelete = "<BUILDING><PLANID> ='" + planId + "' </PLANID></BUILDING>";
        dbUtil(CITYPLAN_config.service.remove, xmlDelete);
        xmlDelete = "<ATTACHMENT><PLANID> ='" + planId + "' </PLANID></ATTACHMENT>";
        dbUtil(CITYPLAN_config.service.remove, xmlDelete);
        // 删除方案记录
        xmlDelete = "<PLAN><ID> ='" + planId + "' </ID></PLAN>";
        dbUtil(CITYPLAN_config.service.remove, xmlDelete);
    };
    /**
    * 删除Shapefile数据类型的方案：策划和设计
    * @param planId 方案ID
    * @private
    */
    var _deleteShpPlan = function (planId) {
        // 删除空间数据
        var xmlQuery = "<QUERY>" +
            "<CONDITION><AND><ID tablename='PLAN'> ='" + planId + "' </ID></AND></CONDITION>" +
            "<RESULT><PLAN></PLAN></RESULT>" +
            "</QUERY>";
        var res = _queryData(CITYPLAN_config.service.query, xmlQuery);
        if (res.length > 0) {
            var layerIds = res[0]["PLAN.LAYERIDS"];
            var layerIdArr = layerIds.split(",");
            $.each(layerIdArr, function (i, id) {
              earth.DatabaseManager.DeleteLayerInDatabase(CITYPLAN_config.server.dataServerIP,id);
            });
        }
        // 删除属性数据
        var xmlDelete = "<CPSIMPLEBUILDING><PLANID> ='" + planId + "' </PLANID></CPSIMPLEBUILDING>";
        dbUtil(CITYPLAN_config.service.remove, xmlDelete);
        xmlDelete = "<GREEN><PLANID> ='" + planId + "' </PLANID></GREEN>";
        dbUtil(CITYPLAN_config.service.remove, xmlDelete);
        // 删除方案记录
        xmlDelete = "<PLAN><ID> ='" + planId + "' </ID></PLAN>";
        dbUtil(CITYPLAN_config.service.remove, xmlDelete);
    };
    /**
    * 删除方案的视点
    * @param planId 方案ID
    * @private
    */
    var _deleteViewpoint = function (planId) {
        var xml = "<VIEWPOINT><PLANID> ='" + planId + "' </PLANID></VIEWPOINT>";
        dbUtil(CITYPLAN_config.service.remove, xml);
    };

    // endregion

    // region 删除项目
    var _deleteSubjectByProjectId = function (projectId) {
        var xmlQuery = "<QUERY>" +
            "<CONDITION><AND><ID tablename='PROJECT'> ='" + projectId + "' </ID></AND></CONDITION>" +
            "<RESULT><PROJECT><FIELD>PARCELLAYERID</FIELD><FIELD>ROADLINELAYERID</FIELD></PROJECT></RESULT>" +
            "</QUERY>";
        var projects = _queryData(CITYPLAN_config.service.query, xmlQuery);
        if (projects.length <= 0) {
            return;
        }
        var project = projects[0];
        var parcelLayerId = project["PROJECT.PARCELLAYERID"];
        var roadlineLayerId = project["PROJECT.ROADLINELAYERID"];
        var xml = "";
        if (parcelLayerId) {
           earth.DatabaseManager.DeleteLayerInDatabase(CITYPLAN_config.server.dataServerIP,parcelLayerId);
            xml = "<PARCEL><PROJECTID> ='" + projectId + "' </PROJECTID></PARCEL>";
            dbUtil(CITYPLAN_config.service.remove, xml);
        }
        if (roadlineLayerId) {
             earth.DatabaseManager.DeleteLayerInDatabase(CITYPLAN_config.server.dataServerIP,roadlineLayerId);
            xml = "<ROADLINE><PROJECTID> ='" + projectId + "' </PROJECTID></ROADLINE>";
            dbUtil(CITYPLAN_config.service.remove, xml);
        }
    };

    var _deleteConferencesByProjectId = function (projectId) {
        var xml = "<CONFERENCE><PROJECTID> ='" + projectId + "' </PROJECTID></CONFERENCE>";
        dbUtil(CITYPLAN_config.service.remove, xml);
    };
    // endregion

    //显示规划用地，道路红线
    var _getLayerIdByProId = function (projId, type) {
        var layerId = null;
        var xmlQuery = "<QUERY>" +
            "<CONDITION><AND><ID tablename='PROJECT'> ='" + projId + "' </ID></AND></CONDITION>" +
            "<RESULT><PROJECT><FIELD>$FIELD</FIELD></PROJECT></RESULT>" +
            "</QUERY>";
        if (type == "PARCEL") {
            xmlQuery = xmlQuery.replace("$FIELD", "PARCELLAYERID");
        } else if (type == "ROADLINE") {
            xmlQuery = xmlQuery.replace("$FIELD", "ROADLINELAYERID");
        }
        var res = _queryData(CITYPLAN_config.service.query, xmlQuery);
        if (res.length > 0) {
            if (type == "PARCEL") {
                layerId = res[0]["PROJECT.PARCELLAYERID"];
            } else if (type == "ROADLINE") {
                layerId = res[0]["PROJECT.ROADLINELAYERID"];
            }
        }
        return layerId;
    };
    /**
    * 更新图层的经纬度范围
    * @param lonlat SELonLatRect
    * @param basedata SEDbEleInfo
    * @return {*} 重新计算后的经纬度范围
    * @private
    */
    var _updateRectangle = function (lonlat, basedata) {
        if (lonlat.North < basedata.SphericalTransform.GetLocation().Y) {
            lonlat.North = basedata.SphericalTransform.GetLocation().Y;
        }

        if (lonlat.South > basedata.SphericalTransform.GetLocation().Y) {
            lonlat.South = basedata.SphericalTransform.GetLocation().Y;
        }

        if (lonlat.East < basedata.SphericalTransform.GetLocation().X) {
            lonlat.East = basedata.SphericalTransform.GetLocation().X;
        }

        if (lonlat.West > basedata.SphericalTransform.GetLocation().X) {
            lonlat.West = basedata.SphericalTransform.GetLocation().X;
        }

        return lonlat;
    };

    // endregion
    /**
    * 查询项目ID对应的审批会议
    * @param projId
    * @returns {Array}
    * @private
    */
    var _getConferenceData = function (projId) {
        var parcelQueryXml =
            '<QUERY><CONDITION><AND>' +
                '<PROJECTID tablename = "CONFERENCE">=\'' + projId + '\'</PROJECTID>' +
                '</AND></CONDITION>' +
                '><RESULT><CONFERENCE><FIELD>PASSEDPLANID</FIELD></CONFERENCE></RESULT>' +
                '</QUERY>';
        return _queryData(CITYPLAN_config.service.query, parcelQueryXml);
    };
    /**
    * 查询项目ID对应的所有规划用地
    * @param projId
    * @return {Array}
    * @private
    */
    var _getParcelData = function (projId) {
        var parcelQueryXml =
            '<QUERY><CONDITION><AND>' +
                '<PROJECTID tablename = "PARCEL">=\'' + projId + '\'</PROJECTID>' +
                '</AND></CONDITION>' +
                '<RESULT><PARCEL></PARCEL></RESULT>' +
                '</QUERY>';
        return _queryData(CITYPLAN_config.service.query, parcelQueryXml);
    };
    /**
    * 查询项目ID对应的所有道路红线
    * @param projId
    * @return {Array}
    * @private
    */
    var _getRoadLineData = function (projId) {
        var roadQueryXml =
            '<QUERY><CONDITION><AND>' +
                '<PROJECTID tablename = "ROADLINE">=\'' + projId + '\'</PROJECTID>' +
                '</AND></CONDITION>' +
                '<RESULT><ROADLINE></ROADLINE></RESULT>' +
                '</QUERY>';
        return _queryData(CITYPLAN_config.service.query, roadQueryXml);
    };
    // endregion

    // region 项目导入
    /**
    * 创建图层所需的参数对象
    * @param guid
    * @param name
    * @param type  SEObjectType类型
    * @return {*}
    * @private
    */
    var _createParam = function (guid, name, type) {
        var param = earth.Factory.CreateLayerParameter();
        param.Guid = guid;
        param.Name = name;
        param.Type = type;
        param.Status = 1;
        param.IsIllumination = false;

        var buildParam = earth.Factory.CreateBuildParameter();
        if (type == 1) {    // SEObjectType.ModelObject
            param.IsIllumination = false;        // isIlluminiation
            buildParam.TexCompressLevel = 0;
            buildParam.OptimizeMesh = true;
            buildParam.CompressLevel = 2;
            buildParam.MeshReference = 1;
            buildParam.TextureReference = 1;

            buildParam.OptimizeMeshEx = true;
            buildParam.CompressLevelEx = 0;
            buildParam.MeshReferenceEx = 2;
            buildParam.TextrueReferenceEx = 2;

            buildParam.MeshReferenceBase = 1;
            buildParam.TextureReferenceBase = 1;
            buildParam.vertex_formatBase = 1;
            buildParam.GenerateTopologicBase = true;

            buildParam.LodLevelBase = 1;
            buildParam.lodStepBase = 1;

            buildParam.LodLevelBase = 2;
            buildParam.lodStepBase = 2;

            buildParam.MeshReferenceFine = 2;
            buildParam.TextureReferenceFine = 2;
            buildParam.vertex_formatFine = 1;
            buildParam.LodLevelFine = 1;
            buildParam.lodStepFine = 1;
        }
        param.BuildParameter = buildParam;

        return param;
    };
    /**
    * 根据文件路径创建空间参考对象
    * @param path 文件夹路径，必须包含”空间参考.spatial“文件
    * @return {*}
    * @private
    */
    var _createDatum = function (path) {
        if (!path) {
            throw { name: "参数错误", message: "需要传入一个空间参考文件的路径" };
        }
        var datum = dataProcess.CoordFactory.CreateDatum();  //earth.Factory.CreateDatum();
        datum.InitFromFile(path + "\\" + CITYPLAN_config.constant.SpatialRefFileName);
        return datum;
    };

    /**
    * 往id等于layerId的空间数据库图层中导入path\subFolder下面的所有模型，在path下存放空间参考文件
    * @param path 空间参考文件和模型文件夹所在路径
    * @param subFolder 模型所在路径
    * @param layerId 图层ID
    * @private
    */
    var _insertModels = function (path, subFolder, layerId) {
        if (dataProcess) {
            dataProcess.Load();
            var meshConvert = dataProcess.BatchMeshConvert;

            meshConvert.Set_Max_Thread_Num(2);    // 设置最大处理线程数，默认值为4，可以不设置(在Init之前调用)
            meshConvert.Init();    // 初始化
            meshConvert.Set_Illumination(true);    // 保存文件是设置，如果保存到数据库不需要设置此参数（可以从数据库读取）。
            meshConvert.Set_Server_IP(CITYPLAN_config.server.dataServerIP);    //设置服务所在机器
            meshConvert.Set_Layer_GUID(layerId);
            meshConvert.Set_Src_Path(path + "\\" + subFolder);
            //保存文件路径：C:\Documents and Settings\Administrator\Local Settings\Temp\convert
            meshConvert.Set_Reference_file(path + "\\" + CITYPLAN_config.constant.SpatialRefFileName);
            meshConvert.Set_Save_Type(1);    // 0-存文件，1-存数据库，2-both
            meshConvert.Start();
        }
    };
    var _insertGreenland = function (layer, datum, layerId) {
        if (layer != null && datum != null) {
            for (var i = 0; i < layer.GetFeatureCount(); i++) {
                var feature = layer.GetFeature(i);
                var geoType = feature.GetGeometryType();

                if (geoType == 3 || geoType == 403) {   // SEWkbGeometryType.SEWkbPolygon
                    var vects = earth.Factory.CreateVector3s();
                    var polygon = feature.GetPolygon();
                    var line = polygon.GetExteriorRing();

                    for (var j = 0; j < line.GetPointsCount(); j++) {
                        var point = line.GetPoint(j);
                        var sePoint = datum.src_xy_to_des_BLH(point.X, point.Y, point.Z || 0);
                       // var altitude = earth.Measure.MeasureTerrainAltitude(sePoint.X, sePoint.Y, false);
                       var altitude = earth.Measure.MeasureTerrainAltitude(sePoint.X, sePoint.Y);
                        vects.Add(sePoint.X, sePoint.Y, altitude);
                    }

                    if (vects.Count > 0) {
                        var greenLand = new CITYPLAN.CityPlanGreenLand(feature);

                        var info = earth.Factory.CreateDbEleInfo(greenLand.getId(), greenLand.getName());
                        var infolist = earth.Factory.CreateDbEleInfoList();
                        var styleinfo = earth.Factory.CreateStyleInfo();
                        var stylelist = earth.Factory.CreateStyleInfoList();

                        styleinfo.LineWidth = 1;
                        styleinfo.LineColor = 0xccd90c00;
                        styleinfo.FillColor = 0xaaffbf7f;
                        stylelist.AddItem(styleinfo);

                        info.DrawOrder = 1000;
                        info.Type = 7;    // SEObjectType.ElementVolumeObject;
                        info.StyleInfoList = stylelist;
                        info.SphericalVectors.Add(vects);
                        info.AltitudeType = 1;   // SEAltitudeType.ClampToTerrain;
                        infolist.AddItem(info);

                   earth.DatabaseManager.AddElementListInLayer(CITYPLAN_config.server.dataServerIP,layerId, infolist);

                        greenLand.saveToDB();
                    }
                }
            }
        }
    };
    var _insertSimpleBuilding = function (layer, datum, layerId) {
        if (layer != null && datum != null) {
            for (var i = 0; i < layer.GetFeatureCount(); i++) {
                var feature = layer.GetFeature(i);
                var geoType = feature.GetGeometryType();

                if (geoType == 3 || geoType == 403) {   // SEWkbGeometryType.SEWkbPolygon
                    var vects = earth.Factory.CreateVector3s();
                    var polygon = feature.GetPolygon();
                    var sePolygon = earth.Factory.CreatePolygon();
                    var line = polygon.GetExteriorRing();
                    for (var j = 1; j < line.GetPointsCount(); j++) {
                        var point = line.GetPoint(j);
                        var sePoint = datum.src_xy_to_des_BLH(point.X, point.Y, point.Z || 0);
                       // var altitude = earth.Measure.MeasureTerrainAltitude(sePoint.X, sePoint.Y, false);
                      var altitude = earth.Measure.MeasureTerrainAltitude(sePoint.X, sePoint.Y);
                        vects.Add(sePoint.X, sePoint.Y, altitude);
                    }

                    if (vects.Count > 0) {
                        sePolygon.AddRing(vects);
                        var infolist = earth.Factory.CreateDbEleInfoList();
                        var styleinfo = earth.Factory.CreateStyleInfo();
                        styleinfo.LineWidth = 1;
                        styleinfo.LineColor = 0xccd90c00;
                        styleinfo.FillColor = 0xaaffbf7f;
                        var stylelist = earth.Factory.CreateStyleInfoList();
                        stylelist.AddItem(styleinfo);

                        var building = new CITYPLAN.CityPlanSimpleBuilding(feature);
                        var info = earth.Factory.CreateDbEleInfo(building.getId(), building.getName());
                        info.DrawOrder = 1000;
                        info.Type = 8;    // SEObjectType.SimpleBuildingObject;
                        info.StyleInfoList = stylelist;
                        info.SphericalVectors.Add(vects);
                        info.SphericalTransform.SetLocation(sePolygon.GetCenterPoint());
                        info.height = building.getFloor() * building.getFloorHeight();
                        info.AltitudeType = 1;   // SEAltitudeType.ClampToTerrain;
                        info.RoofType = building.getRoofType();
                        info.RoofHeight = 1;
                        infolist.AddItem(info);

                      earth.DatabaseManager.AddElementListInLayer(CITYPLAN_config.server.dataServerIP,layerId, infolist);
                        building.saveToDB();
                    }
                }
            }
        }
    };

    var resolvePositions = function (node, offset) {
        var result = earth.Factory.CreateVector3s();
        if (node != null) {
            var postions = node["Position"];
            var posNum = postions.length ? postions.length : 1;
            for (var i = 0; i < posNum; i++) {
                var node = postions[i] ? postions[i] : postions;
                var x = Number(node.X);
                var y = Number(node.Y);
                var z = Number(node.Z);

            /*
                if (offset != null)
                {
                    var vect3 = earth.Factory.CreateVector3();
                    vect3.X = x + offset.X;
                    vect3.Z = z + offset.Y;
                    vect3.Y = y;
                    result.AddVector(vect3);
                }
                else
                {
                    result.Add(x, y, z);
                }
                */

                result.Add(x, y, z);

                }
            }
        }
        return result;
    };

    // 坐标转换
    var src_xy_to_des_BLH = function (vect3, datum) {
        var result = earth.Factory.CreateVector3();
        var sePoint = datum.src_xy_to_des_BLH(vect3.X, vect3.Z, vect3.Y); // .veprj文件中y和z是互换了
        result.X = sePoint.X;
        result.Y = sePoint.Y;
        result.Z = vect3.Y; //altitude;
        return result;
    };

    // 坐标转换
    var src_xy_to_des_BLH2 = function (vect3s, datum) {
        var result = earth.Factory.CreateVector3s();
        for (var i = 0; i < vect3s.Count; i++) {
            var vect3 = vect3s.Items(i);
            var sePoint = datum.src_xy_to_des_BLH(vect3.X, vect3.Z, vect3.Y); // .veprj文件中y和z是互换了
         //   var altitude = earth.Measure.MeasureTerrainAltitude(sePoint.X, sePoint.Y, false);
            var altitude = earth.Measure.MeasureTerrainAltitude(sePoint.X, sePoint.Y);
            result.Add(sePoint.X, sePoint.Y, altitude);
        }
        return result;
    };

    var CreateEDbEleInfo = function (objGuid, objName, layerType, vects, lineWidth, lineColor, fillColor) {
        var info;
        if (objGuid && vects.length > 0) {
            info = earth.Factory.CreateDbEleInfo(objGuid, objName);
            var styleinfo = earth.Factory.CreateStyleInfo();
            var stylelist = earth.Factory.CreateStyleInfoList();

            styleinfo.LineWidth = lineWidth; // 1;
            styleinfo.FirstColor = lineColor; // 0xccd90c00;
            if (layerType != 4)//PolylineObject
            {
                styleinfo.SecondColor = fillColor; // 0xaaffbf7f;
            }
            stylelist.AddItem(styleinfo);

            info.DrawOrder = 1000;
            info.Type = layerType;
            info.StyleInfoList = stylelist;
            info.SphericalVectors.Add(vects);
            info.AltitudeType = 1;
        }
        return info;
    };

    /**
    * 导入规划用地或地形平整
    */
    var _savePolygonObject = function (param) {
        var stylelist = earth.Factory.CreateStyleInfoList();
        var infolist = earth.Factory.CreateDbEleInfoList();
        var offset = m_projectOffsetList.item(param.ProjectGuid);
        var nodes = param.node;
        //var parentNode = param.InfoNode;
        var nodeNum = nodes.length ? nodes.length : 1;
        for (var i = 0; i < nodeNum; i++) {
            var node = nodes[i] ? nodes[i] : nodes;
            var id = node.id;
            if (node["VEPlotPlan"]) {//规划用地
                var planNodes = node["VEPlotPlan"];
                var planNum = planNodes.length ? planNodes.length : 1;
                for (var p = 0; p < planNum; p++) {
                    var childrenNode = planNodes[p] ? planNodes[p] : planNodes;
                    var name = "parcelitem" + p.toString();
                    var vct3s = resolvePositions(childrenNode, offset);
                    var vects = src_xy_to_des_BLH2(vct3s, param.Datum);
                    if (vects.Count > 0) {
                        var info = CreateEDbEleInfo(id, name, 5, vects, 1, 0xccffff00, 0x0000ff00); //PolygonObject
                        if (info != null) {
                            infolist.AddItem(info);
                        }
                    }
                }

            } else if (node["VESmoothLine"]) {//地形平整
                var planNodes = node["VESmoothLine"];
                var planNum = planNodes.length ? planNodes.length : 1;
                for (var p = 0; p < planNum; p++) {
                    var childrenNode = planNodes[p] ? planNodes[p] : planNodes;
                    var name = "smoothitem" + i.toString();
                    var vct3s = resolvePositions(childrenNode, offset);
                    var vects = src_xy_to_des_BLH2(vct3s, param.Datum);
                    if (vects.Count > 0) {
                        var info = CreateEDbEleInfo(id, name, 5, vects, 1, 0xccd90c00, 0xaaffbf7f); //PolygonObject
                        if (info != null) {
                            //alert("地形平整")
                            infolist.AddItem(info);
                        }
                    }
                }
            }
        }
        if (infolist.Count > 0) {

             earth.DatabaseManager.AddElementListInLayer(CITYPLAN_config.server.dataServerIP,param.guid, infolist);
        }
    };

    /**
    *  导入道路红线
    */
    var _savePolylineObject = function (param) {
        var stylelist = earth.Factory.CreateStyleInfoList();
        var infolist = earth.Factory.CreateDbEleInfoList();
        var offset = m_projectOffsetList.item(param.ProjectGuid);
        var nodes = param.node;
        //var parentNode = param.InfoNode;
        var nodeNum = nodes.length ? nodes.length : 1;
        for (var i = 0; i < nodeNum; i++) {
            var node = nodes[i] ? nodes[i] : nodes;
            var id = node.id;
            if (node["VERoadRedLine"]) {
                var planNodes = node["VERoadRedLine"];
                var planNum = planNodes.length ? planNodes.length : 1;
                for (var p = 0; p < planNum; p++) {
                    var childrenNode = planNodes[p] ? planNodes[p] : planNodes;
                    var childrenNodeId = childrenNode.id;
                    var name = "roadredline" + i.toString();
                    var vct3s = resolvePositions(childrenNode, offset);
                    var vects = src_xy_to_des_BLH2(vct3s, param.Datum);
                    if (vects.Count > 0) {
                        var info = CreateEDbEleInfo(childrenNodeId, name, 4, vects, 1, 0xffff0000, 0xaaffbf7f);
                        if (info != null) {
                            infolist.AddItem(info);
                        }
                    }
                }
            }
        }
        if (infolist.Count > 0) {
            earth.DatabaseManager.AddElementListInLayer(CITYPLAN_config.server.dataServerIP,param.guid, infolist);
        }
    };

    /**
    *  导入方案中的小品
    */
    var _saveMatchModel = function (param) {
        if (param != null && param["type"] == 3) {
            var offset = m_projectOffsetList.item(param.ProjectGuid);
            var nodes = param.node;
            //var parentNode = param.InfoNode;
            var nodeNum = nodes.length ? nodes.length : 1;
            var dic = new ActiveXObject("Scripting.Dictionary");
            for (var i = 0; i < nodeNum; i++) {
                var setNode = nodes[i] ? nodes[i] : nodes;
                if (nodes["VEMatchModelSet"]) {
                    var models = nodes["VEMatchModelSet"];
                    var modelsNum = models.length ? models.length : 1;
                    for (var j = 0; j < modelsNum; j++) {
                        var modelSet;
                        if (modelsNum === 1) {
                            modelSet = models["VEMatchModel"];
                        } else {
                            modelSet = models[j]["VEMatchModel"];
                        }

                        var modelNum = modelSet.length ? modelSet.length : 1;
                        for (var l = 0; l < modelNum; l++) {
                            var modelChild = (modelNum === 1) ? modelSet : modelSet[l];
                            _addRecordInLayer(modelChild, param, offset, dic);
                        }
                    }
                }
            }
        }
    };

    /**
    * 导入方案中的树
    */
    var _saveBillBoard = function (param) {
        if (param != null && param["type"] == 2) {
            var offset = m_projectOffsetList.item(param.ProjectGuid);
            var nodes = param.node;
            var nodeNum = nodes.length ? nodes.length : 1;
            var dic = new ActiveXObject("Scripting.Dictionary");
            for (var i = 0; i < nodeNum; i++) {
                var setNode = nodes[i] ? nodes[i] : nodes;
                if (nodes["VEBillboardSet"]) {
                    //var models = nodes["VEBillboardSet"]["VEBillboard"];
                    var models = nodes["VEBillboardSet"];
                    var modelsNum = models.length ? models.length : 1;
                    for (var j = 0; j < modelsNum; j++) {
                        var modelSet;
                        var modelSet = (modelsNum === 1) ? models["VEBillboard"] : models[j]["VEBillboard"];
                        var mNum = modelSet.length ? modelSet.length : 1;
                        for (var l = 0; l < mNum; l++) {
                            var matchNode = (mNum === 1) ? modelSet : modelSet[l];
                            _addRecordInLayer(matchNode, param, offset, dic);
                        }
                    }
                }
            }
        }
    };

    /**
    * 导入地面模型 (.usb或.usx文件)
    * @param  {[type]} param [description]
    * @return {[type]}       [description]
    */
    var _saveGroundModelObject = function (param) {
        if (param != null && param["type"] == 11) {
            var datum = param.Datum;
            var groupNode = param.InfoNode;
            var serverIP = CITYPLAN_config.server.dataServerIP;
            var offset = m_projectOffsetList.item(param.ProjectGuid);
            var nodeNum = param.node.length ? param.node.length : 1;
            for (var i = 0; i < nodeNum; i++) {
                var node = param.node["VEModel"];
                if (!node) {
                    return;
                }
                var nodeLen = node.length ? node.length : 1;
                if (nodeLen > 0) {
                    var temp;
                    for (var k = 0; k < nodeLen; k++) {
                        if (nodeLen == 1) {
                            temp = node;
                        } else {
                            temp = node[k];
                        }
                        var obj = VEPrjObject(temp);
		    //var location = earth.Factory.CreateVector3();
		    
		    	    
                        var srcLct = earth.Factory.CreateVector3();
                        srcLct.X = obj.Pivot.X + obj.Position.X;
                        srcLct.Y = obj.Pivot.Y + obj.Position.Y;
                        srcLct.Z = obj.Pivot.Z + obj.Position.Z;
                        var location = src_xy_to_des_BLH(srcLct, param.Datum);
                        var guid = "";
                        var server = serverIP;
                        var filepath = param.MeshDic;
                        var filename = temp.name;
                        var modelName = temp.name;
                        var logpath = earth.RootPath + "temp";
                        var savemethod = 1;
                        //alert(param.guid + " " + server + " " + filepath + " " + filename + " " + logpath + " " + savemethod + " " + location.X + " " + location.Y + " " + location.Z);
                       // var result = generateEditDll.run_single_point_no_thread(param.guid, server, filepath, filename, logpath, savemethod, location.X, location.Y, location.Z);
                      //  var result = generateEditDll.run_single_ref_no_thread(param.guid, server, filepath, modelName, param.SpatialRef, logpath, savemethod);                    
                       
		      //  var count = generateEditDll.get_guid_count();
                     //   guid = generateEditDll.get_at(count - 1);
                        //alert(guid);
                      if (result){
                            var count = generateEditDll.get_guid_count();
                            if(count <= 0){
                                continue;
                            }
                            guid = generateEditDll.get_at(count-1);
                            /*
                            try{
                                //new way(after 2014-09-26),but not work in 64 client
                                location.X = generateEditDll.get_x();
                        		location.Y = generateEditDll.get_y();
                        		location.Z = generateEditDll.get_z();

                                //get a unexpected position when having a non-zero Position in veprj
                                //change to old way(before 2014-09-26)
                                var tp = earth.Factory.CreateVector3();
                                tp.X = obj.Pivot.X + offset.X + obj.Position.X;
                                tp.Y = obj.Pivot.Y + obj.Position.Y;
                                tp.Z = obj.Pivot.Z + offset.Y + obj.Position.Z;
                                tp = src_xy_to_des_BLH(tp,param.Datum);

                                location.X = tp.X;
                                location.Y = tp.Y;
                                location.Z = tp.Z;

                                //根据X,Y取该坐标的地面高程作为地面模型高程
                                //2014-11-13 解决地面模型不显示的问题(其实不是不显示，是高程不对，地面模型在地面以下，不确定是否是方案数据问题)
                                //并在下面更新模型位置信息
                                //location.Z = earth.Measure.MeasureTerrainAltitude(location.X,location.Y);
                                //throw new Error(0,'test');
                            }catch(e){
                                //old way(before 2014-09-26)
                                var srcLct = earth.Factory.CreateVector3();
                                srcLct.X = obj.Pivot.X + offset.X + obj.Position.X;
                                srcLct.Z = obj.Pivot.Z + offset.Y + obj.Position.Z;
                                srcLct.Y = obj.Pivot.Y + obj.Position.Y;
                                location = src_xy_to_des_BLH(srcLct, param.Datum);
                            }
                            */
                           // 更新模型的位置信息
                            if (obj.Rotation.X != 0 || obj.Rotation.Y != 0 || obj.Rotation.Z != 0
                                || obj.Scaling.X != 1 || obj.Scaling.Y != 1 || obj.Scaling.Z != 1) {
                                var name = "model" + i;
                                var baseobj = earth.Factory.CreateDataBaseObject(guid, name);
                                baseobj.SphericalTransform.SetLocation(location);
                                baseobj.SphericalTransform.SetRotation(obj.Rotation);
                                baseobj.SphericalTransform.SetScale(obj.Scaling);
                                baseobj.BBox.SetExtent(obj.MinBoundary, obj.MaxBoundary);
                                  earth.DatabaseManager.UpdateSpatialPose(CITYPLAN_config.server.dataServerIP,param.guid, guid, baseobj);
                            }
                        }
                    }
                }
            }
        }
    };

    /**
    * 导入建筑模型
    * @param  {[type]} param [description]
    * @return {[type]}       [description]
    */
    var _saveBuildingModelObject = function (param) {
        if (param != null && param["type"] == 1) {
            var datum = param.Datum;
            var groupNode = param.InfoNode;
            var serverIP = CITYPLAN_config.server.dataServerIP;
            var offset = m_projectOffsetList.item(param.ProjectGuid);
            var nodeNum = param.node.length ? param.node.length : 1;
            for (var i = 0; i < nodeNum; i++) {//VEModel
                var node = param.node["VEBuildingSet"];
                if (!node) {
                    return;
                }
                var veBuildingNum = node.length ? node.length : 1;
                //alert(veBuildingNum);
                for (var p = 0; p < veBuildingNum; p++) {
                    var childNode;
                    if (veBuildingNum == 1) {
                        childNode = node;
                    } else {
                        childNode = node[p];
                    }
                    var obj = VEPrjObject(childNode["VEModel"]);
                  //var location = earth.Factory.CreateVector3();  
                  
                    var srcLct = earth.Factory.CreateVector3();
                    srcLct.X = obj.Pivot.X + obj.Position.X;
                    srcLct.Y = obj.Pivot.Y + obj.Position.Y;
                    srcLct.Z = obj.Pivot.Z + obj.Position.Z;
                    var location = src_xy_to_des_BLH(srcLct, param.Datum);
                    var guid = "";
                    var server = serverIP;
                    var filepath = param.MeshDic;
                    var filename = childNode.name;
                    var modelName = childNode.VEModel.name;
                    var logpath = earth.RootPath + "temp";
                    var savemethod = 1;
                    filepath = filepath + "\\" + filename;
                    //alert(filepath + " " + filename);
                  //  var result = generateEditDll.run_single_point_no_thread(param.guid, server, filepath, modelName, logpath, savemethod, location.X, location.Y, location.Z);
                     var result = generateEditDll.run_single_point_no_thread(param.guid, server, filepath, modelName, logpath, savemethod, location.X, location.Y, location.Z);

		    var count = generateEditDll.get_guid_count();
                    guid = generateEditDll.get_at(count - 1);
                    //alert(result + " " + guid + filepath + " " + filename);
                      if (result){
                    	var count = generateEditDll.get_guid_count();
                        if(count <= 0){
                            continue;
                        }
                        guid = generateEditDll.get_at(count-1);
                        /*
                        try{
                            //new way(after 2014-09-26),but not work in 64 client
                        	location.X = generateEditDll.get_x();
                        	location.Y = generateEditDll.get_y();
                        	location.Z = generateEditDll.get_z();

                            //get a unexpected position when having a non-zero Position in veprj
                            //change to old way(before 2014-09-26)
                            var tp = earth.Factory.CreateVector3();
                            tp.X = obj.Pivot.X + offset.X + obj.Position.X;
                            tp.Y = obj.Pivot.Y + obj.Position.Y;
                            tp.Z = obj.Pivot.Z + offset.Y + obj.Position.Z;
                            tp = src_xy_to_des_BLH(tp,param.Datum);

                            location.X = tp.X;
                            location.Y = tp.Y;
                            location.Z = tp.Z;

                            //根据X,Y取该坐标的地面高程作为地面模型高程
                            //2014-11-13 解决地面模型不显示的问题(其实不是不显示，是高程不对，地面模型在地面以下，不确定是否是方案数据问题)
                            //并在下面更新模型位置信息
                            //location.Z = earth.Measure.MeasureTerrainAltitude(location.X,location.Y);
                            //throw new Error(1,'test');
                        }
                        catch(e){
                            //old way(before 2014-09-26)
                            var srcLct = earth.Factory.CreateVector3();
                            srcLct.X = obj.Pivot.X + offset.X + obj.Position.X;
                            srcLct.Z = obj.Pivot.Z + offset.Y + obj.Position.Z;
                            srcLct.Y = obj.Pivot.Y + obj.Position.Y;
                            location = src_xy_to_des_BLH(srcLct, param.Datum);
                        }
                        */                    
                        // 更新模型的位置信息
                        if (obj.Rotation.X != 0 || obj.Rotation.Y != 0 || obj.Rotation.Z != 0
                            || obj.Scaling.X != 1 || obj.Scaling.Y != 1 || obj.Scaling.Z != 1) {
                            var name = "model" + i;
                            var baseobj = earth.Factory.CreateDataBaseObject(guid, name);
                            baseobj.SphericalTransform.SetLocation(location);
                            baseobj.SphericalTransform.SetRotation(obj.Rotation);
                            baseobj.SphericalTransform.SetScale(obj.Scaling);
                            baseobj.BBox.SetExtent(obj.MinBoundary, obj.MaxBoundary);
                          //  alert(param.Guid);
                          //  alert(guid);
                          //  earth.DatabaseManager.UpdateSpatialPose(param.Guid, guid, baseobj);
                            earth.DatabaseManager.UpdateSpatialPose(CITYPLAN_config.server.dataServerIP,param.guid, guid, baseobj);
                          }
                        // 更新数据库建筑物表中模型的ID
                        Update("CPBUILDING", obj.Guid, "ID", guid);
                        // 更新数据库附件表中建筑附件的模型ID
                        UpdateAttachment("CPATTACHMENT", "PLANID", obj.Guid, "PLANID", guid);
                    }
                }
            }
        }
    };

    var VEPrjObject = function (node) {
        if (node != null) {
            var m_guid = node.id;
            var m_name = node.name;
            var m_visibility = node.Visibility;
            var m_intersectable = node.Intersectable;
            var m_alphaBlend = node.AlphaBlend;
            var m_position;
            var m_quaternion;
            var m_rotation;
            var m_scaling;
            var m_pivot;
            var m_maxBoundary;
            var m_minBoundary;
            if (node.Position) {
                m_position = TransformToVec3(node.Position);
            }
            if (node.Quaternion) {
                m_quaternion = TransformToQuat4(node.Quaternion);
            }
            if (node.Rotation) {
                m_rotation = TransformToVec3(node.Rotation);
            }
            if (node.Scaling) {
                m_scaling = TransformToVec3(node.Scaling);
            }
            if (node.Pivot) {
                m_pivot = TransformToVec3(node.Pivot);
            }
            if (node.BBox) {
                m_maxBoundary = TransformToVec3(node.BBox.MaxBoundary);
                m_minBoundary = TransformToVec3(node.BBox.MinBoundary);
            }
            var m_link = node.Link;
            return {
                Guid: m_guid,
                Name: m_name,
                Visibility: m_visibility,
                Intersectable: m_intersectable,
                AlphaBlend: m_alphaBlend,
                Position: m_position,
                Quaternion: m_quaternion,
                Rotation: m_rotation,
                Scaling: m_scaling,
                Pivot: m_pivot,
                MaxBoundary: m_maxBoundary,
                MinBoundary: m_minBoundary,
                Link: m_link
            };
        }
    };

    var TransformToVec3 = function (node) {
        var result = null;
        var values = node.split(',');
        if (values.length == 3) {
            result = earth.Factory.CreateVector3();
            result.SetValue(Number(values[0]), Number(values[1]), Number(values[2]));
        }
        return result;
    };

    var TransformToQuat4 = function (node) {
        var result = {};
        var values = node.split(',');
        if (values.length == 4) {
            result.X = Number(values[0]);
            result.Y = Number(values[1]);
            result.Z = Number(values[2]);
            result.W = Number(values[3]);
        }
        return result;
    };

    /**
    * 向数据库中添加一条树或小品的记录
    */
    var _addRecordInLayer = function (node, param, offset, dic) {
        var obj = VEPrjObject(node);
        var min = earth.Factory.CreateVector3();
        min.SetValue(1, 1, 1);
        var max = earth.Factory.CreateVector3();
        max.SetValue(2, 2, 2);

        var meshid = -1;
        if (dic.item(obj.Link)) {
            meshid = dic.item(obj.Link);
        } else {
            //"E:\\zengming\\guihua\\Stamp.Desktop\\bin\\Release\\temp\\importprj\\项目20140118 - 副本\\默认方案\\小品\\e90xp_004\\e90xp_004.USX"
            var path = param.MeshDic + "\\" + obj.Link;
            meshid = ImportUsx(dataProcess, CITYPLAN_config.server.dataServerIP, param.guid, path, min, max);
            if (meshid >= 0) {
                dic.item(obj.Link) = meshid;
            }
        }
        if (meshid >= 0) {
            var databasedata = earth.Factory.CreateDataBaseObject(obj.Guid, obj.Name);
            databasedata.MeshID = meshid;
            databasedata.BBox.SetExtent(min, max); // TODO????
            var srcLct = earth.Factory.CreateVector3();
            // srcLct.X = obj.Position.X + offset.X;
            // srcLct.Z = obj.Position.Z + offset.Y;
            srcLct.X = obj.Position.X;
            srcLct.Z = obj.Position.Z;
            srcLct.Y = obj.Position.Y;
            var location = src_xy_to_des_BLH(srcLct, param.Datum);

            var rotation = earth.Factory.CreateVector3();
            rotation.X = -1.0 * obj.Rotation.X;
            rotation.Y = -1.0 * obj.Rotation.Y;
            rotation.Z = -1.0 * obj.Rotation.Z;

            databasedata.SphericalTransform.SetLocation(location);
            // databasedata.SphericalTransform.SetRotation(obj.Rotation);
            databasedata.SphericalTransform.SetRotation(rotation);  
	     databasedata.SphericalTransform.SetScale(obj.Scaling);
            databasedata.Type = param.type;
           earth.DatabaseManager.AddRecordInLayer(CITYPLAN_config.server.dataServerIP,param.guid, databasedata);
        }
    };

    var ImportUsx = function (dataProcess, url, guid, fullpath, min, max) {
        var index = fullpath.lastIndexOf("\\");
        if (index < 0) {
            return -1;
        }
        var name = fullpath.substring(index + 1);
        var path = fullpath.substring(0, index);
        var singleimport = dataProcess.SingleMeshImport;
        singleimport.Set_Server_IP(url);
        singleimport.Set_Layer_GUID(guid);
        singleimport.Set_Illumination(true);
        singleimport.Set_Save_Type(1); //0-存文件，1-存数据库，2-both
        singleimport.Init();
        var id = singleimport.Process_File(path, name);
        return id;
    };

    /**
    * Event.OnEditDatabaseFinished事件处理函数
    * @param pRes 包含ExcuteType属性，标识处理操作类型
    * @param pLayer ISEDatabaseLayer
    */
    var Earth_OnEditDatabaseFinished = function (pRes, pLayer) {
        var layerGUID;
        var isSuccess = false;
        if (pRes.ExcuteType === 1) {//addLayer
            layerGUID = pRes.LayerGuid;
            isSuccess = true;
        } else if (pRes.ExcuteType === 0 && pRes.LayerGuid != "") {
            layerGUID = pRes.LayerGuid;
        } else {
            return;
        }
        //从事件回调中获取图层的guid
        var keys = m_importLayerParams.Keys().toArray();
        //根据guid获取其对应的参数param 来自于layerIDs数组
        var obj;
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === layerGUID) {
                obj = m_importLayerParams.item(layerGUID);
            }
        }
        if (!obj) {
            return;
        }
        //类型
        var type = obj.type;
        if (isSuccess) {
            switch (type) {// 0 1 2 3 
                case 5: // 导入规划专题中的规划用地或地形平整
                    //alert("方案中的规划用地 地形平整");
                    _savePolygonObject(obj);
                    break;
                case 4: // 导入规划专题中的道路红线
                    //alert("方案中的道路红线");
                    _savePolylineObject(obj);
                    break;
                case 3: //导入方案中的小品
                    //alert("方案中的小品");
                    _saveMatchModel(obj);
                    break;
                case 2: //导入方案中的树
                    //alert("方案中的树");
                    _saveBillBoard(obj);
                    break;
                case 11: //导入方案中的.usb或.usx数据(地面模型)
                    //alert("地面模型导入开始");
                    _saveGroundModelObject(obj);
                    break;
                case 1: //导入方案中的.usb或.usx数据(建筑模型)
                    //alert("建筑模型导入开始");
                    _saveBuildingModelObject(obj);
                    break;
                default:
                    break;
            }
        }
        obj.isImported = true;
        //导入完毕 添加一个标记 表示完成导入 以便于最后进行是否导入完毕的判断!
        var isImportFinished = _isCompleted();
        if (isImportFinished) {
            top.$('#impDialog').dialog('close');
            //有些项目这里会弹出来两次 原因待查。。。。。。TODO
            setTimeout(function () {
                if (parent.isImportLoop == 0) {
                    //导入完毕后删除文件夹
                    var prjPath = earth.RootPath + "temp" + "\\" + planPrjName;
                    earth.UserDocument.DeleteDirectory(prjPath);
                    //         //获取数据库中所有的图层
                    //         parent.getEditLayerListLoaded();
                    alert("导入完毕，请刷新网页!");
                    parent.isImportLoop = 1;
 //恢复地球的交互操作
                    earth.GlobeObserver.EnablePan = true;
                    earth.GlobeObserver.EnableRotate = true;
                    earth.GlobeObserver.EnableZoom = true;
                    earth.GlobeObserver.EnablePanAuto = true;
                    earth.GlobeObserver.EnableRotateAuto = true;
                }
                setTimeout(function () {
                    parent.getEditLayerListLoaded();
                }, 300);
            }, 200);
        }
    };
    //var isImportLoop = 0;
    var _isCompleted = function () {
        var keys = m_importLayerParams.Keys().toArray();
        var sum = keys.length;
        var k = 0;
        if (sum) {
            for (var i = 0; i < sum; i++) {
                if (m_importLayerParams.item(keys[i]).isImported) {
                    k++;
                } else {
                    break;
                }
            };
        }
        return (k >= sum) ? true : false;
    };

    /**
    * 导入方案附件
    * @param planPath 方案路径，其中包含附件信息.xml和总平图文件以及效果图文件夹
    * @param planId 方案ID
    */
    var _importAttachment = function (planPath, planId) {
        // var xmlAttachments = loadXML(true, planPath + "\\" + CITYPLAN_config.constant.AttachmentInfoFileName);
        var xmlAttachments = earth.UserDocument.LoadXmlFile(planPath + "\\" + CITYPLAN_config.constant.AttachmentInfoFileName);
        var attachments = $.xml2json(xmlAttachments.xml);
        var id = "";
        var xmlAdd = "";
        if (attachments["CAD"]) {
            id = earth.Factory.CreateGUID();
            xmlAdd = "<ATTACHMENT><ID>" + id + "</ID><PLANID>" + planId + "</PLANID><TYPE>CAD</TYPE><NAME>" +
                attachments["CAD"] +
                "</NAME></ATTACHMENT>";
            $.post(CITYPLAN_config.service.add, xmlAdd, function (data) {
                if (/true/.test(data)) {
                    earth.DatabaseManager.PostFile(planPath + "\\" + attachments["CAD"], CITYPLAN_config.service.addAttachmentObj + id);
                }
            }, "text");
        }
        var pictures = attachments["PICTURES"];
        if (pictures) {
            var pic = pictures["PICTURE"];
            if (typeof (pic) == 'string') {
                id = earth.Factory.CreateGUID();
                xmlAdd = "<ATTACHMENT><ID>" + id + "</ID><PLANID>" + planId + "</PLANID><TYPE>PICTURE</TYPE><NAME>" +
                    pic + "</NAME></ATTACHMENT>";
                $.post(CITYPLAN_config.service.add, xmlAdd, function (data) {
                    if (/true/.test(data)) {
                        earth.DatabaseManager.PostFile(planPath + "\\效果图" + "\\" + pic, CITYPLAN_config.service.addAttachmentObj + id);
                    }
                }, "text");
            } else {
                $.each(pic, function (i) {
                    id = earth.Factory.CreateGUID();
                    xmlAdd = "<ATTACHMENT><ID>" + id + "</ID><PLANID>" + planId + "</PLANID><TYPE>PICTURE</TYPE><NAME>" +
                        pic[i] + "</NAME></ATTACHMENT>";
                    $.post(CITYPLAN_config.service.add, xmlAdd, function (data) {
                        if (/true/.test(data)) {
                            earth.DatabaseManager.PostFile(planPath + "\\效果图" + "\\" + pic[i], CITYPLAN_config.service.addAttachmentObj + id);
                        }
                    }, "text");
                });
            }
        }
    };

    var IsValidForPoint = function (point) {
        var result = false;
        if (point != null
            && point.Z > -15000.0 && point.Z < 10000
            && point.X >= -180 && point.X <= 180
            && point.Y >= -90 && point.Y <= 90) {
            result = true;
        }
        return result;
    }
    var IsValid = function (rect) {
        var result = false;
        if (rect != null
            && rect.North >= -90.0 && rect.North <= 90
            && rect.South >= -90 && rect.South <= 90
            && rect.West >= -180 && rect.West <= 180
            && rect.East >= -180 && rect.East <= 180) {
            result = true;
        }
        return result;
    }

    var loadApproveXML = function () {
        var rootPath = earth.Environment.RootPath + "temp\\approve";
        var configPath = rootPath + ".xml";
        var configXml = earth.UserDocument.LoadXmlFile(configPath);
        if (configXml === "") {
            configXml = initApproveXML();
            earth.UserDocument.SaveXmlFile(rootPath, configXml);
        }
        var systemDoc = loadXMLStr(configXml);
        var systemJson = $.xml2json(systemDoc);
        if (systemJson == null) {
            return false;
        }
        return systemJson.Project;
    };
    var saveApproveXML = function (systemData) {
        var rootPath = earth.Environment.RootPath + "temp\\approve";
        var configPath = rootPath + ".xml";
        var configXml = earth.UserDocument.LoadXmlFile(configPath);
        if (configXml === "") {
            configXml = initApproveXML();
            earth.UserDocument.SaveXmlFile(rootPath, configXml);
        }
        var systemDoc = loadXMLStr(configXml);
        var root = systemDoc.documentElement;
        var projectNode = root.getElementsByTagName("Project");
        projectNode[0].text = systemData.id;
        earth.UserDocument.SaveXmlFile(rootPath, systemDoc.xml);
        parcelPloygonVcts3 = {}; //清空规划用地范围
    }
    var initApproveXML = function (data) {
        var configXml = '<xml>';
        if (data && data.length) {
            for (var i = 0; i < data.length; i++) {
                configXml = configXml + '<Project>' + data[i] + '</Project>'; //project
            }
        }
        configXml = configXml + '</xml>';
        return configXml;
    }
    // endregion

    // region 公共接口

    projManager.getProjectData = getProjectData;
    projManager.getAllProjectDate = getAllProjectDate;
    projManager.updateStatus = updateStatus;
    projManager.getSep = getSep;

    projManager.importProject = importProject;

    projManager.IsValid = IsValid;

    projManager.loadApproveXML = loadApproveXML;
    projManager.saveApproveXML = saveApproveXML;

    return projManager;
};