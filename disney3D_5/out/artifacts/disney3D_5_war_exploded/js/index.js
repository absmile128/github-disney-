/**
 * User: wyh
 * Date: 12-11-22
 * Time: 下午12:00
 * Desc:
 */
var earth = null;    // 全局球体对象
var earthToolsBalloon = null;//cy 工具条
// var earthToolWidth = 407;
var earthToolWidth = 490;
var earthToolHeight = 38
var earthArray = [];
var analysis = null, projManager = null, projImport = null,layerManager = null, searchAnaly = null,attachment=null;
var editTool = null;
var timmerRoadName;

var databaseLayers = {};
var databaseLayersArr=[];
var editLayers = {};//记录数据库中所有图层
var ploygonLayersVcts3 = {};//规划用地
var ParceLayer = []; //用地图层
var ctrPlanLayer = [];//控规图层
var currentLayerIdList = [];//记录现状图层ID列表
var currentLayerIdListTemp = {};//记录现状图层ID列表(便于判断在方案比选功能中)
var projectLayerIdList = [];//记录项目图层ID列表
var otherLayerIdList = [];//记录其他图层ID列表
var currentLayerChecked = false;//记录选中现状图层显示、隐藏状态
var currentLayerObjList = {};//项目现状图层Obj列表
var checkedStatusList = [];//记录复选框状态
var surroundingLayer = [];//周边查询图层
var approveCurrentLayerId = null;//审批中的现状图层ID
var currentSelectedNode = null;//当前选中的审批树节点ID
var indicatorAccountingLayer = [];//指标查看图层
var removeAnalysisLayer = [];//拆迁分析图层



var currentLayerObjs = [];

var SYSTEMPARAMS = null; //系统参数对象
var PROJECTLIST = [];//工程列表
var currentPrjGuid = null;//当前工程的guid
var currentApproveProjectGuid = null;       //当前审批项目的的guid（初始化时从approve.xml读取）
var parceLayerObj = null;//记录现状图层中的对象集合
var currentPrjDepth = 10;//当前项目的默认开挖深度 默认值是10 该值不保存到本地
var parcelLayerGuid = null;//用地图层的guid
var isImportLoop = 0;
var planLayerIDs = {};
var passedPlanObj = {};

var bolonArr =[];
var AnalineObj = null;
var htmlBalloons=null;
//五个分析功能的气泡
var htmlBalloonMove=null;
//雨雪雾功能气泡
var transparencyBalloons = null;
var transparencyBalloonsHidden = false;
//截屏气泡
var picturesBalloons = null;
//量算气泡
var htmlBal = null;
//现状图层的guid
var parcelLayerGuid2 = null;
var demObj = null;
var vectLayers = [];
var prjTreeData;
var isInit = false;
var isLoadCurrentLayers = false;//是否获取到现状数据
var isInit = false;

var lgttag=0;   //cy0918:拉杆条类型

var seHistorySliderMgr = null;





var CoverIconObjArr=[];   //标绘字典   key:图层guid value：该图层的icon标绘对象数组
var coverlayerDataArr=[]; //图层字典   key:图层guid value：该图层的对象数组




// var loaclUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
// var xmlpath = loaclUrl +"/partlist.xml"; //ShowNavigate只能用绝对路径
// var partmanager=  PART.PartManager(xmlpath);
var clearHtmlBallon = function(htmlBall){
    if (htmlBall != null){
        htmlBall.DestroyObject();
    }
};



// region 初始化图层树、项目树和初始位置，由3D窗口在地球加载完成后调用
function init() {
    earth.Environment.Mode2DEnable = false; //初始显示为三维地图
    projManager = CITYPLAN.ProjectManager(earth, document.getElementById("dataProcess"));
    projImport = CITYPLAN.ProjImport(earth, document.getElementById("dataProcess"), document.getElementById("generateEdit"));
    layerManager = CITYPLAN.LayerManager(earth);
    editTool = CITYPLAN.EditTool(earth,document.getElementById("generateEdit"));
    searchAnaly = CITYPLAN.searchAnalysis(earth);
    analysis=CITYPLAN.Analysis(earth);
    attachment =   CITYPLAN.Attachment(earth);





    // setTimeout(initLayerTree, 200);//延迟加载，等待加载现状数据
    initPosition();
    initcurrentProjectGuid();
    initMapMgr(true);   //字段映射初始化
    //设置左侧窗口地址
    if(CITYPLAN_config.disney.cover_layerid!=null&CITYPLAN_config.disney.cover_layerid!=""){

        // showLargeDialog('"html/layer/layer.html'图层');
        // showLittleDialog( "html/cover/CoverInfo.html","园区市政传感器概况") ;
    }

    $("#fixediframe").attr("src", "html/layer/layer.html"  );

    //设置功能可用性 按钮可见性控制
      setFunEnabled();


}






function initMapMgr(reloadEditLayer){
    try{
        //var fXmlUrl = "C:\\Users\\Administrator\\Desktop\\FieldMapCityPlan.config";
        //fXmlUrl = earth.UserDocument.LoadXmlFile(fXmlUrl);

        var fXmlUrl = earth.LayerManager.GetLayerByGuid(currentPrjGuid).ProjectSetting.FieldMapFile;
        //fXmlUrl = 'http://' + fXmlUrl.substr(2).replace("/", "/sde?/") + "_sde";
        earth.Event.OnEditDatabaseFinished = function(pRes, pFeature){
            earth.Event.OnEditDatabaseFinished = function(){};
            if (pRes.ExcuteType == "27") {
                SYSTEMPARAMS.pipeFieldMap = loadXMLStr(pRes.AttributeName); //初始化编码映射文件对象
            }
            var fieldXml = pRes.AttributeName;

            mapMgr.init(undefined,fieldXml);

            if(reloadEditLayer){
                getEditLayerListLoaded();
            }
        }

        earth.DatabaseManager.GetXml(fXmlUrl);
        //var fieldXml = loadXMLStr(fXmlUrl);

        //mapMgr.init(undefined,fieldXml);
    }catch(e){

    }
}

function setFunEnabled(){
     if(  earth.LayerManager.GetLayerByGUID(CITYPLAN_config.disney.SEVIEWsxt_layerid)!=null){
      //视频监控
        setBtnDisabled(false,"#shipinjiankong");
        setBtnDisabled(false,"#shipinjiankong2");
    }
    else{
        setBtnDisabled(true,"#shipinjiankong");
        setBtnDisabled(true,"#shipinjiankong2");

    }

    if(  earth.LayerManager.GetLayerByGUID(CITYPLAN_config.disney.cover_layerid)!=null){
        //井盖
        setBtnDisabled(false,"#shipinjiankong");
        setBtnDisabled(false,"#shipinjiankong2");
    }
    else{
        setBtnDisabled(true,"#shipinjiankong");
        setBtnDisabled(true,"#shipinjiankong2");

    }


};
/**
 * 初始化基础图层树
 */
function initLayerTree() {
    var setting = {
        check: {
            enable: true, //是否显示checkbox或radio
            chkStyle: "checkbox" //显示类型,可设置(checbox,radio)
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        view: {
            dblClickExpand: false, //双击节点时，是否自动展开父节点的标识
            expandSpeed: "", //节点展开、折叠时的动画速度, 可设置("","slow", "normal", or "fast")
            selectedMulti: false //设置是否允许同时选中多个节点
        },
        callback: {
            onCheck: onCheckClick,
            onDblClick: function (event, treeId, node) {
                if (node && node.id) {
                    if (node.type.indexOf("BASE") !== -1) {
                        var layer = earth.LayerManager.GetLayerByGUID(node.id);
                        if (layer && layer.LayerType) {
                            layerManager.flyToLayer(layer); //定位图层
                        }
                    } else if (node.type.indexOf("OLD") !== -1) {
                        if (editLayers[node.id]) {
                            layerManager.flyToLayer(editLayers[node.id]); //定位图层
                        }
                    }
                }
            }
        }
    };

    var zNodes = [];
    zNodes.push({id: 1, pId: 0, name: "基础数据", open: true, nocheck: false, type: "DATA"});

    zNodes.push({id: 2, pId: 1, name: "浏览数据", open: false, nocheck: false, type: "BASE"});
    var baseLayerDatas = layerManager.getLayerData(null);
    zNodes = zNodes.concat(baseLayerDatas);
 return zNodes;



}
/**
 * 基础数据控制按钮
 * @param node
 * @param type
 */
function showDatas(node) {

    if (node && node.id) {
        if (node.children && node.children.length > 0) {
            for (var i = 0; i < node.children.length; i++) {
                this.showDatas( node.children[i]);
            }
        } else {
            var id = node.id;
            var layerObj = earth.LayerManager.GetLayerByGUID(id);
            layerObj.Visibility = node.checked;
        }
    }

}
function controlCarveCurrentLayer() {
    if (approveCurrentLayerId) {
        var eList = currentLayerObjList[approveCurrentLayerId];
        if (eList) {
            var count = eList.Count;
            for (var j = 0; j < count; j++) {
                var obj = eList.Items(j);
                obj.Visibility = currentLayerChecked;
            }
        }
    }
}
/**
* 复选框 控制图层的隐藏和显示
* @param event
* @param treeId
* @param node
*/
function onCheckClick(event, treeId, node) {
    if (node.type === "OLD01") {
        showDatas(node, node.type);
    } else if (node.type === "OLD") {
        showDatas(node, node.type);
    } else if (node.type === "BASEO1") {
        var layer = earth.LayerManager.GetLayerByGUID(node.id);
        if (layer) {
            layer.Visibility = node.checked;
        }
    } else if (node.type === "BASE") {
        showDatas(node, node.type);
    } else if (node.type === "DATA") {
        showDatas(node, "OLD");
        showDatas(node, "BASE");
    }
}



/**
 * 单独处理方案比选中地球加载方案数据
 */
function getLayerLoaded(bShow, layerIds, earthCopy, databaseLayersArr, XZLayerGuid, isHideXZ) {
    var ids =  earthCopy.databaseLayersArr;
    if (ids.length) {
        for (var i = 0; i < ids.length; i++) {
            var layer = ids[i];
            var layerId = layer.Guid;
            if($.isArray(layerIds)){
                if ($.inArray(layerId, layerIds) === -1) {   // 不在数组中才返回-1
                    earth.event.OnEditDatabaseFinished = function(pRes,pFeat){
                        var pLayerGuid = result.LayerGuid;
                        if(result.ExcuteType == 43){
                            onDatabaseListLoaded2(pLayerGuid,feature,bShow, earthCopy, XZLayerGuid, isHideXZ);
                        }else if(result.ExcuteType == 47){
                            onElementListLoaded2(pLayerGuid,feature,bShow, earthCopy, XZLayerGuid, isHideXZ);
                        }
                    };
                    if (layer.LayerType == 1 || layer.LayerType == 2 || layer.LayerType == 3 || layer.LayerType == 11 || layer.LayerType == 9) { // ModelObject,BillBoardObject,MatchModelObject
                   // OnDatabaseListLoaded
                        /*
                        earthCopy.Event.OnEditDatabaseFinished = function (pRes, pFeat) {
                            var pLayerGuid = pRes.LayerGuid;
                            onDatabaseListLoaded2(pLayerGuid, pFeat, bShow, earthCopy, XZLayerGuid, isHideXZ);
                       }
                        */
			 // layer.ApplyDataBaseRecords();
			 earthCopy.DatabaseManager.GetDataBaseRecords(CITYPLAN_config.server.dataServerIP,layer.Guid);
                    } else {
                      // OnElementListLoaded
                        /*
                        earthCopy.Event.OnEditDatabaseFinished = function (pRes, pFeat) {
                            var pLayerGuid = pRes.LayerGuid;
                            onElementListLoaded2(pLayerGuid, pFeat, bShow, earthCopy, XZLayerGuid, isHideXZ);
                        }
                        */
                         // layer.ApplyElementRecords(layer.LayerType);
                        earthCopy.DatabaseManager.GetElements(CITYPLAN_config.server.dataServerIP,layer.Guid,layer.LayerType);
                    }
                }
            }else{
                if(layerId==layerIds){
                      earthCopy.event.OnEditDatabaseFinished = function(pRes,pFeat){
                        var pLayerGuid = pRes.LayerGuid;
                        if(pRes.ExcuteType == 43){
                            onDatabaseListLoaded2(pLayerGuid,pFeat,bShow, earthCopy, XZLayerGuid, isHideXZ);
                        }else if(pRes.ExcuteType == 47){
                            onElementListLoaded2(pLayerGuid,pFeat,bShow, earthCopy, XZLayerGuid, isHideXZ);
                        }

                        if(isHideXZ !== undefined){
                            hideEarthCurrentLayer(earthCopy, isHideXZ);
                        }else{
                            hideEarthCurrentLayer(earthCopy, bShow);
                        }
                    };
                    if (layer.LayerType == 1 || layer.LayerType == 2 || layer.LayerType == 3 || layer.LayerType == 11 || layer.LayerType == 9 ) { // ModelObject,BillBoardObject,MatchModelObject
  /*
                        earthCopy.Event.OnEditDatabaseFinished = function (pRes, pFeat) {
                            var pLayerGuid = pRes.LayerGuid;
                            onDatabaseListLoaded2(pLayerGuid, pFeat, bShow, earthCopy, XZLayerGuid, isHideXZ);
                            if(isHideXZ !== undefined){
                                hideEarthCurrentLayer(earthCopy, isHideXZ);
                            }else{
                                hideEarthCurrentLayer(earthCopy, bShow);
                            }
                        }
                        */
                        // layer.ApplyDataBaseRecords();
                        earthCopy.DatabaseManager.GetDataBaseRecords(CITYPLAN_config.server.dataServerIP,layer.Guid);
                    } else {
                        /*
                        earthCopy.Event.OnEditDatabaseFinished = function (pRes, pFeat) {
                            var pLayerGuid = pRes.LayerGuid;
                            onElementListLoaded2(pLayerGuid, pFeat, bShow, earthCopy, XZLayerGuid, isHideXZ);
                            if(isHideXZ !== undefined){
                                hideEarthCurrentLayer(earthCopy, isHideXZ);
                            }else{
                                hideEarthCurrentLayer(earthCopy, bShow);
                            }
                        }
                        */
			  // layer.ApplyElementRecords(layer.LayerType);
                        earthCopy.DatabaseManager.GetElements(CITYPLAN_config.server.dataServerIP,layer.Guid,layer.LayerType);
                    }
                }
            }
        }
    }
};

/**
 * 第二个方案加载入口
 * @param  {[type]}  bShow       [description]
 * @param  {[type]}  layerIds    [description]
 * @param  {[type]}  earthCopy   [description]
 * @param  {[type]}  XZLayerGuid [description]
 * @param  {Boolean} isHideXZ    [description]
 * @return {[type]}              [description]
 */
function applyRecords(bShow, layerIds, earthCopy, XZLayerGuid, isHideXZ) {
    var databaseLayersArr=[];
    var XZLayerGuids = [];
   earthCopy.Event.OnEditDatabaseFinished = function (pRes,pFeature) {
        earthCopy.Event.OnEditDatabaseFinished = function () {};
        var layer = null;
        for (var i = 0; i < pFeature.GetChildCount(); i++) {
            layer = pFeature.GetChildAt(i);
            databaseLayersArr.push(layer);
            if(layer.GroupID == -3){
                XZLayerGuids.push(layer.Guid);
            }
        }
        var editLayers2 = {};
        earthCopy.XZLayerGuids = XZLayerGuids;
        earthCopy.editLayers = editLayers2;
        earthCopy.databaseLayersArr = databaseLayersArr;
        //加载editLayers图层 后面的现状图层隐藏需要用到
        if(XZLayerGuids.length){
            for(var i=0;i<XZLayerGuids.length;i++){
                var currLayer=XZLayerGuids[i];
                getLayerLoaded(true,currLayer,earthCopy, databaseLayersArr, XZLayerGuid, false);
            }
        }

        setTimeout(function(){
            //加载方案图层
            $.each(layerIds, function (i, layerId) {
                getLayerLoaded(bShow, layerId, earthCopy, databaseLayersArr, XZLayerGuid, isHideXZ);
            });
        },500);

        // setTimeout(function(){
            // //隐藏现状图层
            // if(parent.parcelLayerGuid2){//现状图层  bShow, layerIds, earthCopy
            //     var ids=earthCopy.XZLayerGuids;//获取现状图层的guids
            //     for(var i=0;i<ids.length;i++){
            //         var cid=ids[i];
            //         var currentlayer=earthCopy.editLayers[cid];
            //         if(currentlayer){
            //             var ploygonVects3=parent.ploygonLayersVcts3[parcelLayerGuid2];
            //             if(ploygonVects3){
            //                 currentlayer.LayerIsPrior=false;
            //                 var eList=currentlayer.ClipByRegion(ploygonVects3);
            //                 earthCopy.XZObjs = eList;
            //                 if(eList && eList.Count){
            //                     var count=eList.Count;
            //                     for (var j = 0; j < count; j++){
            //                         var obj = eList.Items(j);
            //                         obj.Visibility = false;
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }
        // },500);
    }
    // earthCopy.LayerManager.ApplyEditLayerList();
       earthCopy.DatabaseManager.GetAllLayer(CITYPLAN_config.server.dataServerIP);
};

//只加载现状数据库图层
function loadXZLayers(bShow, earthCopy){
    var databaseLayersArr=[];
    var XZLayerGuids = [];
    earthCopy.Event.OnEditDatabaseFinished = function (pRes,pFeature) {
        earthCopy.Event.OnEditDatabaseFinished = function () {};
        var layer = null;
        for (var i = 0; i < pFeature.GetChildCount(); i++) {
            layer = pFeature.GetChildAt(i);
            databaseLayersArr.push(layer);
            if(layer.GroupID == -3){
                XZLayerGuids.push(layer.Guid);
            }
        }
        earthCopy.XZLayerGuids = XZLayerGuids;
        earthCopy.editLayers = {};
        earthCopy.databaseLayersArr = databaseLayersArr;
        //加载editLayers图层 后面的现状图层隐藏需要用到
        if(XZLayerGuids.length){
            for(var i=0;i<XZLayerGuids.length;i++){
                var currLayer=XZLayerGuids[i];
                getLayerLoaded(bShow,currLayer,earthCopy);
            }
        }
    }
     // earthCopy.LayerManager.ApplyEditLayerList();
    earthCopy.DatabaseManager.GetAllLayer(CITYPLAN_config.server.dataServerIP);
    };

//加载现状模型
function loadCurrentLayers2(layerIdList){
    if(layerIdList.length){
        for(var i=0;i<layerIdList.length;i++){
            var currLayer=layerIdList[i];
            applyDataBaseRecords(true,currLayer);
        }
    }
}

function onDatabaseListLoaded2(pLayerGuid, pFeat, bShow, earthCopy, XZLayerGuid, isHideXZ) {
    var databaseLayer = databaseLayers[pLayerGuid];
    if (!databaseLayer || null == pFeat) {
        return;
    }
   // var m_editLayer = earthCopy.Factory.CreateEditLayer(databaseLayer.Guid, databaseLayer.Name, databaseLayer.LonLatRect, 0, 4.5);    // m_databaseLayer.MaxVisibleHeight);
    var m_editLayer = earthCopy.Factory.CreateEditLayer(databaseLayer.Guid, databaseLayer.Name, databaseLayer.LonLatRect, 0, 4.5, CITYPLAN_config.server.dataServerIP);
    earthCopy.editLayers[databaseLayer.Guid] = m_editLayer;
    m_editLayer.DataLayerType = databaseLayer.LayerType;
    m_editLayer.Visibility = bShow;
    m_editLayer.Editable = true;
    earthCopy.AttachObject(m_editLayer);
    m_editLayer.BeginUpdate();
    for (var i = 0; i < pFeat.Count; i++) {
        var obj = pFeat.Items(i);
        if (!obj) {
            continue;
        }
        var editmodel = earthCopy.Factory.CreateEditModelByDatabase(obj.Guid, obj.Name, obj.MeshID, databaseLayer.LayerType);
        editmodel.BeginUpdate();
        editmodel.SetBBox(obj.BBox.MinVec, obj.BBox.MaxVec);
        editmodel.SphericalTransform.SetLocation(obj.SphericalTransform.GetLocation());
        editmodel.SphericalTransform.SetRotation(obj.SphericalTransform.GetRotation());
        editmodel.SphericalTransform.SetScale(obj.SphericalTransform.GetScale());
        editmodel.Editable = true;
        editmodel.Selectable = true;
        editmodel.EndUpdate();
        m_editLayer.AttachObject(editmodel);
    }
    m_editLayer.EndUpdate();
    m_editLayer.Editable = true;
    m_editLayer.Selectable = true;
     // earthCopy.DatabaseManager.UpdateLayerLonLatRect(CITYPLAN_config.server.dataServerIP,pLayerGuid, m_editLayer.LonLatRect);
    earthCopy.DatabaseManager.UpdateLayerLonLatRect(CITYPLAN_config.server.dataServerIP,pLayerGuid, m_editLayer.LonLatRect, m_editLayer.MaxHeight);

    //隐藏现状图层
    if(databaseLayer.Guid == XZLayerGuid){
        // alert("大概大概");
    }
};

function onElementListLoaded2(pLayerGuid, pFeat, bShow, earthCopy, XZLayerGuid, isHideXZ) {
    var databaseLayer = databaseLayers[pLayerGuid];
    if (!databaseLayer || null == pFeat) {
        return;
    }
    // var m_editLayer = earthCopy.Factory.CreateEditLayer(databaseLayer.Guid, databaseLayer.Name, databaseLayer.LonLatRect, 0, 4.5);    // m_databaseLayer.MaxVisibleHeight);
    var m_editLayer = earthCopy.Factory.CreateEditLayer(databaseLayer.Guid, databaseLayer.Name, databaseLayer.LonLatRect, 0, 4.5, CITYPLAN_config.server.dataServerIP);    m_editLayer.DataLayerType = databaseLayer.LayerType;
    m_editLayer.DataLayerType = databaseLayer.LayerType;
    earthCopy.editLayers[databaseLayer.Guid] = m_editLayer;
    m_editLayer.Visibility = bShow;
    m_editLayer.Editable = true;
    earthCopy.AttachObject(m_editLayer);
    m_editLayer.BeginUpdate();
    var vect3 = null, newPolygon = null;
    for (var i = 0; i < pFeat.Count; i++) {
        var obj = pFeat.Items(i);
        if (null == obj || obj.SphericalVectors.Count <= 0) {
            continue;
        }
        switch (databaseLayer.LayerType) {
            case 6:   // SEObjectType.ElementBoxObject
                break;
            case 7:   // SEObjectType.ElementVolumeObject
                var volume = earthCopy.Factory.CreateElementVolume(obj.Guid, obj.Name);
                vect3 = obj.SphericalTransform.GetLocation();
                volume.BeginUpdate();
                newPolygon = earthCopy.Factory.CreatePolygon();
                newPolygon.AddRing(obj.SphericalVectors.Items(0));
                volume.SetPolygon(1, newPolygon);   // SECoordinateUnit.Degree
                volume.height = obj.Height;
                if (pLayerGuid == CITYPLAN_config.constant.g_boxLayerGuid) {
                    volume.height = obj.height;
                    volume.FillColor = obj.StyleInfoList.Item(0).FillColor;
                }
                volume.EndUpdate();
                if (projManager.IsValid(vect3)) {
                    volume.SphericalTransform.SetLocationEx(vect3.X, vect3.Y, vect3.Z);
                }
                volume.SphericalTransform.SetRotation(obj.SphericalTransform.GetRotation());
                volume.SphericalTransform.SetScale(obj.SphericalTransform.GetScale());
                m_editLayer.AttachObject(volume);
                break;
            case 5:   // SEObjectType.PolygonObject
                var polygon = earthCopy.Factory.CreateElementPolygon(obj.Guid, obj.Name);
                vect3 = obj.SphericalTransform.GetLocation();
                polygon.BeginUpdate();
                polygon.SetExteriorRing(obj.SphericalVectors.Items(0));
                polygon.AltitudeType = 1;   // SEAltitudeType.ClampToTerrain
                polygon.FillStyle.FillColor = obj.StyleInfoList.Items(0).SecondColor;
                polygon.LineStyle.LineColor = obj.StyleInfoList.Items(0).FirstColor;
                polygon.LineStyle.LineWidth = obj.StyleInfoList.Items(0).LineWidth;
                polygon.EndUpdate();
                if (projManager.IsValid(vect3)) {
                    polygon.SphericalTransform.SetLocationEx(vect3.X, vect3.Y, vect3.Z);
                }
                polygon.SphericalTransform.SetRotation(obj.SphericalTransform.GetRotation());
                polygon.SphericalTransform.SetScale(obj.SphericalTransform.GetScale());
                m_editLayer.AttachObject(polygon);
                break;
            case 4:   // SEObjectType.PolylineObject
                var line = earthCopy.Factory.CreateElementLine(obj.Guid, obj.Name);
                vect3 = obj.SphericalTransform.GetLocation();

                line.BeginUpdate();
                line.SetPointArray(obj.SphericalVectors.Items(0));
                line.AltitudeType = 1;   // SEAltitudeType.ClampToTerrain
                line.LineStyle.LineColor = obj.StyleInfoList.Items(0).FirstColor;// 道路红线默认为红色
                line.EndUpdate();
                if (projManager.IsValid(vect3)) {
                    line.SphericalTransform.SetLocationEx(vect3.X, vect3.Y, vect3.Z);
                }
                line.SphericalTransform.SetRotation(obj.SphericalTransform.GetRotation());
                line.SphericalTransform.SetScale(obj.SphericalTransform.GetScale());
                m_editLayer.AttachObject(line);
                break;
            case 8:    // SEObjectType.SimpleBuildingObject
                var building = earthCopy.Factory.CreateSimpleBuilding(obj.Guid, obj.Name);
                vect3 = obj.SphericalTransform.GetLocation();

                building.BeginUpdate();
                newPolygon = earthCopy.Factory.CreatePolygon();
                newPolygon.AddRing(obj.SphericalVectors.Items(0));
                building.SetPolygon(1, newPolygon); 
                building.SetFloorsHeight(obj.height);
                building.SetFloorHeight(2.8);
                building.SetRoofType(1);
                var BuildingMaterial = building.GetFloorsMaterialStyles();
                BuildingMaterial.Items(0).DiffuseTexture = "";
                BuildingMaterial.Items(1).DiffuseTexture = "";

                for (var j = 2; j < BuildingMaterial.Count; ++j) {
                    BuildingMaterial.Items(j).DiffuseTexture = "";
                }
                building.EndUpdate();
                if (projManager.IsValid(vect3)) {
                    building.SphericalTransform.SetLocationEx(vect3.X, vect3.Y, vect3.Z);
                }
                building.SphericalTransform.SetRotation(obj.SphericalTransform.GetRotation());
                building.SphericalTransform.SetScale(obj.SphericalTransform.GetScale());
                m_editLayer.AttachObject(building);
                break;
            default:
                break;
        }
    }
    m_editLayer.EndUpdate();
    m_editLayer.Editable = false;
    earthCopy.DatabaseManager.UpdateLayerLonLatRect(CITYPLAN_config.server.dataServerIP,pLayerGuid, m_editLayer.LonLatRect, m_editLayer.MaxHeight);

    //隐藏现状图层
    if(databaseLayer.Guid == XZLayerGuid){
        // alert("大概大概");
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 加载数据库图层
 */
function getEditLayerListLoaded() {
    currentLayerDatas = [];
    currentLayerIdList=[];
    currentLayerIdListTemp = {};
    projectLayerIdList=[];
    otherLayerIdList=[];
    databaseLayersArr=[];
    databaseLayers={};
    currentLayerObjs = [];
    // editLayers = {};
  earth.Event.OnEditDatabaseFinished = function (pRes,pFeature) {   // pFeature的类型为ISEDatabaseLayer
    
        isLoadCurrentLayers = true;
	var layer = null;
         earth.Event.OnEditDatabaseFinished = function () {
        };
        for (var i = 0; i < pFeature.GetChildCount(); i++) {
            layer = pFeature.GetChildAt(i);   // ISEDatabaseLayer


            if (layer.GroupID == -3) {//现状相关的图层
                var data = {
                    "id": layer.Guid,
                    "pId": 2,
                    "name": layer.Name,
                    "checked": true,
                    "type": "OLD01"
                };
                //currentLayerObjs.push(layer);
                currentLayerDatas.push(data);
                currentLayerIdList.push(layer.Guid);
                currentLayerIdListTemp[layer.Guid] = layer;
            } else if (layer.GroupID == -2) {//项目相关的图层
                projectLayerIdList.push(layer.Guid);
            } else {
                otherLayerIdList.push(layer.Guid);
            }
            databaseLayers[layer.Guid] = layer;
            databaseLayersArr.push(layer);
        }
	 if(isLoadCurrentLayers){
            loadCurrentLayers();  //cy:加载现状数据 ，放到地球上
        }
         
    };
   // earth.LayerManager.ApplyEditLayerList();
      earth.DatabaseManager.GetAllLayer(CITYPLAN_config.server.dataServerIP);

}
function applyDataBaseRecords(bShow, layerIds, isCreated) {

    var ids = databaseLayersArr;

    if (ids.length) {
        for (var i = 0; i < ids.length; i++) {
            var layer = ids[i];
            var layerId = layer.Guid;
            if($.isArray(layerIds)){

                if ($.inArray(layerId, layerIds) === -1) {   //layer.LayerType == 9 表示数据库水面图层类型
                  earth.event.OnEditDatabaseFinished = function(pRes,pFeat){
                        var pLayerGuid = pRes.LayerGuid;
                        if(pRes.ExcuteType == 43){
                            onDatabaseListLoaded(pLayerGuid,pFeat,bShow);
                        }else if(pRes.ExcuteType == 47){
                            onElementListLoaded(pLayerGuid,pFeat,bShow);
                        }
                    };
                    if (layer.LayerType == 1 || layer.LayerType == 2 || layer.LayerType == 3 || layer.LayerType == 11 || layer.LayerType == 9) { // ModelObject,BillBoardObject,MatchModelObject
                        /*
                        earth.Event.OnEditDatabaseFinished = function (pRes, pFeat) {
                            var pLayerGuid = pRes.LayerGuid;
                            onDatabaseListLoaded(pLayerGuid, pFeat, bShow);
                        }
                        */
                        // layer.ApplyDataBaseRecords();
                        earth.DatabaseManager.GetDataBaseRecords(CITYPLAN_config.server.dataServerIP,layer.Guid);
                    } else {
                        /*
                        earth.Event.OnEditDatabaseFinished = function (pRes, pFeat) {
                            var pLayerGuid = pRes.LayerGuid;
                            onElementListLoaded(pLayerGuid, pFeat, bShow);
                        }
                        */
                        // layer.ApplyElementRecords(layer.LayerType);
                        earth.DatabaseManager.GetElements(CITYPLAN_config.server.dataServerIP,layer.Guid,layer.LayerType);
                    }
                }
            }else{
                if(layerId==layerIds){
                       earth.event.OnEditDatabaseFinished = function(pRes,pFeat){
                        var pLayerGuid = pRes.LayerGuid;
                        if(pRes.ExcuteType == 43){
                            onDatabaseListLoaded(pLayerGuid,pFeat,bShow);
                        }else if(pRes.ExcuteType == 47){
                            onElementListLoaded(pLayerGuid,pFeat,bShow);
                            if(parcelLayerGuid2 == pLayerGuid || isCreated){
                                //抠掉现状图层
                                projManager.showCurrentLayers(false, currentPrjGuid, pLayerGuid);
                                //alert(currentPrjGuid + " " + pLayerGuid);
                            }
                        }
                    };
                    if (layer.LayerType == 1 || layer.LayerType == 2 || layer.LayerType == 3 || layer.LayerType == 11 || layer.LayerType == 9) { // ModelObject,BillBoardObject,MatchModelObject
                        /*
                        earth.Event.OnEditDatabaseFinished = function (pRes, pFeat) {
                            var pLayerGuid = pRes.LayerGuid;
                            onDatabaseListLoaded(pLayerGuid, pFeat, bShow);
                        }
                        */
                        // layer.ApplyDataBaseRecords();
                        earth.DatabaseManager.GetDataBaseRecords(CITYPLAN_config.server.dataServerIP,layer.Guid);
                    } else {
                        /*
                        earth.Event.OnEditDatabaseFinished = function (pRes, pFeat) {
                            var pLayerGuid = pRes.LayerGuid;
                            onElementListLoaded(pLayerGuid, pFeat, bShow);
                            if(parcelLayerGuid2 == pLayerGuid || isCreated){
                                //抠掉现状图层
                                projManager.showCurrentLayers(false, currentPrjGuid, pLayerGuid);
                                //alert(currentPrjGuid + " " + pLayerGuid);
                            }
                        }
                        */
                        // layer.ApplyElementRecords(layer.LayerType);
                        earth.DatabaseManager.GetElements(CITYPLAN_config.server.dataServerIP,layer.Guid,layer.LayerType);
                                       }
                }
            }
        }
    }
}
function onDatabaseListLoaded(pLayerGuid, pFeat, bShow) {
    var databaseLayer = databaseLayers[pLayerGuid];
    if (!databaseLayer || null == pFeat) {
        return;
    }
    // var m_editLayer = earth.Factory.CreateEditLayer(databaseLayer.Guid, databaseLayer.Name, databaseLayer.LonLatRect, 0, 4.5);    // m_databaseLayer.MaxVisibleHeight);
    var m_editLayer = earth.Factory.CreateEditLayer(databaseLayer.Guid, databaseLayer.Name, databaseLayer.LonLatRect, 0, 4.5, CITYPLAN_config.server.dataServerIP);
    editLayers[databaseLayer.Guid] = m_editLayer;
    //m_editLayer.IsIllumination = databaseLayer.IsIllumination;
    m_editLayer.DataLayerType = databaseLayer.LayerType;
    m_editLayer.Visibility = bShow;
    m_editLayer.Editable = true;
    earth.AttachObject(m_editLayer);
    //现状图层 在分析中使用(通视,视域与阴影分析)
    if(databaseLayer.GroupID == -3){
        currentLayerObjs.push(m_editLayer);
    }

    m_editLayer.BeginUpdate();
    // 只有建筑模型参与分析（LineSight、ViewShed和Shinning），其他类型不参与
    if (databaseLayer.LayerType == 1){
        m_editLayer.Analyzable = true;
    }else{
        m_editLayer.Analyzable = false;
    }
    for (var i = 0; i < pFeat.Count; i++) {
        var obj = pFeat.Items(i);
        if (!obj) {
            continue;
        }

        //var editmodel = earth.Factory.CreateEditModel(obj.Guid, obj.Name);
        //var editmodel = earth.Factory.CreateEditModelByDatabase(obj.Guid, obj.Name, obj.MeshID, 1);
        //注意这里的图层类型(最后一个参数) 否则树模型就不跟着视点选择了 ModelObject = 1,BillBoardObject = 2,，，，等类型 2014-06-12
        var editmodel = earth.Factory.CreateEditModelByDatabase(obj.Guid, obj.Name, obj.MeshID, databaseLayer.LayerType);
        editmodel.BeginUpdate();
//            editmodel.MeshID = obj.MeshID;
//            editmodel.BlockID = obj.BlockID;
        editmodel.SetBBox(obj.BBox.MinVec, obj.BBox.MaxVec);
        editmodel.SphericalTransform.SetLocation(obj.SphericalTransform.GetLocation());
        editmodel.SphericalTransform.SetRotation(obj.SphericalTransform.GetRotation());
        editmodel.SphericalTransform.SetScale(obj.SphericalTransform.GetScale());
        editmodel.Editable = true;
        editmodel.Selectable = true;
        editmodel.EndUpdate();

        m_editLayer.AttachObject(editmodel);
    }
    m_editLayer.EndUpdate();
    m_editLayer.Editable = false;
    // m_editLayer.Editable = true;
    m_editLayer.Selectable = true;

    earth.DatabaseManager.UpdateLayerLonLatRect(CITYPLAN_config.server.dataServerIP,pLayerGuid, m_editLayer.LonLatRect, m_editLayer.MaxHeight);

    //当现状图层加载完毕 并且规划用地图层也加载完毕 再派发事件到项目管理页面 进行是否扣除现状图层的逻辑
    var isAll = true;
    // if(parcelLayerGuid2 && parcelLayerGuid2 == databaseLayer.Guid){
    //     isAll = true;
    // }else{
    //     isAll = false;
    //     return;
    // }
    for(var j = 0; j < currentLayerIdList.length; j++){
        if(!editLayers[currentLayerIdList[j]]){
            isAll = false;
        }
    }



};
function onElementListLoaded(pLayerGuid, pFeat, bShow) {
    var databaseLayer = databaseLayers[pLayerGuid];
    if (!databaseLayer || null == pFeat) {
        return;
    }
    // var m_editLayer = earth.Factory.CreateEditLayer(databaseLayer.Guid, databaseLayer.Name, databaseLayer.LonLatRect, 0, 4.5);    // m_databaseLayer.MaxVisibleHeight);
    var m_editLayer = earth.Factory.CreateEditLayer(databaseLayer.Guid, databaseLayer.Name, databaseLayer.LonLatRect, 0, 4.5, CITYPLAN_config.server.dataServerIP);
    editLayers[databaseLayer.Guid] = m_editLayer;

    m_editLayer.DataLayerType = databaseLayer.LayerType;
    m_editLayer.Visibility = bShow;
    m_editLayer.Editable = true;
    //m_editLayer.LayerIsPrior = false;
    earth.AttachObject(m_editLayer);

    m_editLayer.BeginUpdate();
    var vect3 = null, newPolygon = null;
    for (var i = 0; i < pFeat.Count; i++) {
        var obj = pFeat.Items(i);
        if (null == obj || obj.SphericalVectors.Count <= 0) {
            continue;
        }

        switch (databaseLayer.LayerType) {
            case 6:   // SEObjectType.ElementBoxObject
                break;
            case 7:   // SEObjectType.ElementVolumeObject
                var volume = earth.Factory.CreateElementVolume(obj.Guid, obj.Name);
                vect3 = obj.SphericalTransform.GetLocation();

                volume.BeginUpdate();
                newPolygon = earth.Factory.CreatePolygon();
                newPolygon.AddRing(obj.SphericalVectors.Items(0));
                volume.SetPolygon(1, newPolygon);   // SECoordinateUnit.Degree
                volume.height = obj.Height;
                //volume.height = 0.2;
                if (pLayerGuid == CITYPLAN_config.constant.g_boxLayerGuid) {
                    volume.height = obj.height;
                    volume.FillColor = obj.StyleInfoList.Item(0).FillColor;
                }
                volume.EndUpdate();
                if (projManager.IsValid(vect3)) {
                    volume.SphericalTransform.SetLocationEx(vect3.X, vect3.Y, vect3.Z);
                }
                volume.SphericalTransform.SetRotation(obj.SphericalTransform.GetRotation());
                volume.SphericalTransform.SetScale(obj.SphericalTransform.GetScale());
                m_editLayer.AttachObject(volume);
                break;
            case 5:   // SEObjectType.PolygonObject
                var polygon = earth.Factory.CreateElementPolygon(obj.Guid, obj.Name);
                vect3 = obj.SphericalTransform.GetLocation();
                polygon.BeginUpdate();
                polygon.SetExteriorRing(obj.SphericalVectors.Items(0));
                polygon.AltitudeType = 1;   // SEAltitudeType.ClampToTerrain
                polygon.FillStyle.FillColor = obj.StyleInfoList.Items(0).SecondColor;
                polygon.LineStyle.LineColor = obj.StyleInfoList.Items(0).FirstColor;
                polygon.LineStyle.LineWidth = obj.StyleInfoList.Items(0).LineWidth;
                polygon.EndUpdate();
                if (projManager.IsValid(vect3)) {
                    polygon.SphericalTransform.SetLocationEx(vect3.X, vect3.Y, vect3.Z);

                }
                polygon.SphericalTransform.SetRotation(obj.SphericalTransform.GetRotation());
                polygon.SphericalTransform.SetScale(obj.SphericalTransform.GetScale());
                m_editLayer.AttachObject(polygon);
                ploygonLayersVcts3[databaseLayer.Guid] = polygon.GetExteriorRing();//保存规划用的的范围，控制现状的显示。隐藏
                //if(pLayerGuid==parcelId){
                //    parcelPloygonVcts3 =
                //  }
//                    polygon.SetParentNode(m_editLayer);
                break;
            case 4:   // SEObjectType.PolylineObject
                var line = earth.Factory.CreateElementLine(obj.Guid, obj.Name);
                vect3 = obj.SphericalTransform.GetLocation();

                line.BeginUpdate();
                line.SetPointArray(obj.SphericalVectors.Items(0));
                line.AltitudeType = 1;   // SEAltitudeType.ClampToTerrain
                line.LineStyle.LineColor = obj.StyleInfoList.Items(0).FirstColor;// 道路红线默认为红色
                line.EndUpdate();
                if (projManager.IsValid(vect3)) {
                    line.SphericalTransform.SetLocationEx(vect3.X, vect3.Y, vect3.Z);
                }
                line.SphericalTransform.SetRotation(obj.SphericalTransform.GetRotation());
                line.SphericalTransform.SetScale(obj.SphericalTransform.GetScale());
                m_editLayer.AttachObject(line);
//                    line.SetParentNode(m_editLayer);
                break;
            case 8:    // SEObjectType.SimpleBuildingObject
                var building = earth.Factory.CreateSimpleBuilding(obj.Guid, obj.Name);
                vect3 = obj.SphericalTransform.GetLocation();

                building.BeginUpdate();
                newPolygon = earth.Factory.CreatePolygon();
                newPolygon.AddRing(obj.SphericalVectors.Items(0));
                //newPolygon.AddRing(obj.SphericalVectors);
                building.SetPolygon(1, newPolygon);   // SECoordinateUnit.Degree
                building.SetFloorsHeight(obj.height);
                building.SetFloorHeight(2.8);
//                    building.SetParentNode(m_editLayer);
                // todo 屋顶设置有问题
                //building.SetRoofType(obj.RoofType);// 屋顶
                building.SetRoofType(1);
                // 贴材质
                var BuildingMaterial = building.GetFloorsMaterialStyles();
                BuildingMaterial.Items(0).DiffuseTexture = "";
                BuildingMaterial.Items(1).DiffuseTexture = "";

                for (var j = 2; j < BuildingMaterial.Count; ++j) {
                    BuildingMaterial.Items(j).DiffuseTexture = "";
                }
                building.EndUpdate();
                // SetLocationEx方法调用必须放在EndUpdate函数之后
                if (projManager.IsValid(vect3)) {
                    building.SphericalTransform.SetLocationEx(vect3.X, vect3.Y, vect3.Z);
                }
                building.SphericalTransform.SetRotation(obj.SphericalTransform.GetRotation());
                building.SphericalTransform.SetScale(obj.SphericalTransform.GetScale());
                m_editLayer.AttachObject(building);
                break;
            default:
                break;
        }
    }

    m_editLayer.EndUpdate();
    m_editLayer.Editable = false;
     earth.DatabaseManager.UpdateLayerLonLatRect(CITYPLAN_config.server.dataServerIP,pLayerGuid, m_editLayer.LonLatRect, m_editLayer.MaxHeight);

  //当现状图层加载完毕 并且规划用地图层也加载完毕 再派发事件到项目管理页面 进行是否扣除现状图层的逻辑
    var isAll = true;
    // if(parcelLayerGuid2 && parcelLayerGuid2 == databaseLayer.Guid){
    //     isAll = true;
    // }else{
    //     isAll = false;
    //     return;
    // }
    for(var j = 0; j < currentLayerIdList.length; j++){
        if(!editLayers[currentLayerIdList[j]]){
            isAll = false;
        }
    }
    if(isAll){
         //派发事件 或 直接在此处启动项目管理界面
        // setFunEnabled();                                                       
        // $("#prjIframe").attr("src", "html/investigate/projectManagement.html?earth="+earth);
    }
}
//加载现状模型
function loadCurrentLayers(){
 if(isLoadCurrentLayers){
    if(currentLayerIdList.length){
        for(var i=0;i<currentLayerIdList.length;i++){
            var currLayer=currentLayerIdList[i];

            applyDataBaseRecords(true,currLayer);
        }
  }
        isLoadCurrentLayers = false;
    }
}
/**
 * @param bShow
 * @param id
 */
var setBtnDisabled=function(bShow,id){


    $(id).attr("disabled", bShow);
    var imagepath=  $(id).find("img").attr("src")   ;
    if(!imagepath)  {return;}
    var pos=imagepath.lastIndexOf('/');
    var imagename= imagepath.substring(pos+1);
    var imagepath1=imagepath.substring(0,pos+1);

    if(bShow)
    {
        if(imagename.substring(0,5)=="undo_")
        {return;}
        $(id).find("img").attr("src",imagepath1+"undo_"+imagename);//控高分析不可见
    }
    else
    {     if(imagename.substring(0,5)=="undo_")
       {
           $(id).find("img").attr("src",imagepath1+imagename.substring(5));//控高分析可见
       }

    }
}
setBtnDisabled(true,"#SchemeindexInfoDIV");//指标查看不可见



/**
 * 清除所有已经创建的editlayer
 */
var removeEditLayers = function () {
    /*var id, editLayer, i, count, obj;
     for (id in editLayers) {
     if (editLayers.hasOwnProperty(id)) {
     editLayer = editLayers[id];
     if (editLayer != null) {
     earth.DetachObject(editLayer);
     }
     }
     }
     editLayers = {};   // 清空editLayers*/
};
/**
 * 控制图层的显示隐藏
 */
function showHideEditLayer(bShow, layerIds) {
    if (projectLayerIdList && projectLayerIdList.length > 0) {
        for (var i = 0; i < projectLayerIdList.length; i++) {
            var layerId = projectLayerIdList[i];
            if ($.inArray(layerId, layerIds) === -1) {   // 不在数组中才返回-1
                if (editLayers[layerId]) {
                    editLayers[layerId].Visibility = bShow;
                }
            }
        }
    }
}
/**
 *图层可见性控制
 * @param bShow
 */
function initEditLayerEditable(bShow) {
    if (projectLayerIdList && projectLayerIdList.length > 0) {
        for (var i = 0; i < projectLayerIdList.length; i++) {
            var layerId = projectLayerIdList[i];
            if (editLayers[layerId]) {
                editLayers[layerId].Editable = bShow;
            }
        }
    }
}

// 获取当前工程guid
function initcurrentProjectGuid() {
    SYSTEMPARAMS =  getSystemConfig();
    // if(SYSTEMPARAMS.project != ""){
    //     currentPrjGuid = SYSTEMPARAMS.project;
    //
    // }
    currentPrjGuid=CITYPLAN_config.disney.currentPrjGuid;//当前工程
}





function initTree(prjGuid){
    var setting = {
        check: {
            enable: true, //是否显示checkbox或radio
            chkStyle: "checkbox" //显示类型,可设置(checbox,radio)
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        view: {
            dblClickExpand: false, //双击节点时，是否自动展开父节点的标识
            expandSpeed: "", //节点展开、折叠时的动画速度, 可设置("","slow", "normal", or "fast")
            selectedMulti: false //设置是否允许同时选中多个节点
        },
        callback: {
            onDblClick: function (event, treeId, node) {
                if (node && node.id) {
                    var layer = earth.LayerManager.GetLayerByGUID(node.id);
                    if (layer && layer.LayerType) {
                        layerManager.flyToLayer(layer); //定位图层
                    }
                }
            },
            onCheck: function (event, treeId, node) {
                var layer = earth.LayerManager.GetLayerByGUID(node.id);
                layer.Visibility = node.checked;
            }
        }
    };
    var layer = earth.LayerManager.GetLayerByGUID(prjGuid);
    link2D = layer.ProjectSetting.MapServer;
    //alert(link2D);
    if(link2D){
        $("#ViewScreen2D").removeAttr("disabled");
        $("#ViewScreen2DLink").removeAttr("disabled");
    } else{
        $("#ViewScreen2D").attr("disabled","disabled");
        $("#ViewScreen2DLink").attr("disabled","disabled");
    }
 //cy20150508
     vectLayers = [];
    ctrPlanLayer = [];
    ParceLayer = [];
    indicatorAccountingLayer = [];
    removeAnalysisLayer = [];
    greenbeltAnalysisLayer = [];
    surroundingLayer =[];
    var treeData = [];
    treeData.push({id: layer.Guid, pId: 0, name: layer.Name, open: true, nocheck: false, type: "currentproject"});

    layerManager.getCurrentProjectLayerData(treeData, layer, layer.Guid);
     return treeData;
  //  $.fn.zTree.init($("#planTree"), setting, treeData);
};

function initSystemConfig(id){
    var configXml = '<xml>';
    if(id){
        configXml = configXml + '<Ip>'+CITYPLAN_config.server.ip+'</Ip>'; //ip
        configXml = configXml + '<Project>'+id+'</Project>'; //project
        configXml = configXml + '<Position></Position>';
    }else{
        configXml = configXml + '<Ip></Ip>'; //ip
        configXml = configXml + '<Project></Project>'; //project
        configXml = configXml + '<Position></Position>';
    }
    configXml = configXml + '</xml>';
    return configXml;
};
function setSystemConfig(systemData){
    var rootPath = earth.Environment.RootPath + "temp\\SystemConfig";
    var configPath = rootPath + ".xml";
    var configXml = earth.UserDocument.LoadXmlFile(configPath);
    var systemDoc = loadXMLStr(configXml);
    var root = systemDoc.documentElement;
    (root.getElementsByTagName("Project")[0]).text = systemData.project;
    (root.getElementsByTagName("Ip")[0]).text = CITYPLAN_config.server.ip;
    earth.UserDocument.SaveXmlFile(rootPath,systemDoc.xml);
};
function getSystemConfig(){
    var rootPath = earth.Environment.RootPath + "temp\\SystemConfigSZ";
    var configPath = rootPath + ".xml";
    var configXml = earth.UserDocument.LoadXmlFile(configPath);
    if(configXml === ""){
        configXml = this.initSystemConfig();
        earth.UserDocument.SaveXmlFile(rootPath,configXml);
    }else{
        PROJECTLIST = initPipePjoList();
    }
    var systemDoc = loadXMLStr(configXml);
    var systemJson=$.xml2json(systemDoc);
    if(systemJson==null){
        return false;
    }
    for(var key in systemJson){ //如果不是最新格式xml，删掉  写入最新格式xml
        if(key != "Ip" && key != "Project" && key != "Position" ){
            earth.UserDocument.DeleteXmlFile(configPath);
            configXml = this.initSystemConfig();
            earth.UserDocument.SaveXmlFile(rootPath,configXml);
            systemDoc = loadXMLStr(configXml);
            systemJson=$.xml2json(systemDoc);
        }else if(systemJson.Ip != CITYPLAN_config.server.ip){
            earth.UserDocument.DeleteXmlFile(configPath);
            configXml = this.initSystemConfig();
            earth.UserDocument.SaveXmlFile(rootPath,configXml);
            systemDoc = loadXMLStr(configXml);
            systemJson=$.xml2json(systemDoc);
        }
    }
    var tempLayer;
    if(systemJson.Project){
        tempLayer = earth.LayerManager.GetLayerByGUID(systemJson.Project);
    }
    if(!tempLayer || systemJson.Project===""||systemJson.Project===null||systemJson.Project==="undefined"){ //如果工程不存在，默认选第一个
        var pipeProjArr = initPipePjoList();
        PROJECTLIST = pipeProjArr;
       if(pipeProjArr.length>0){
           var obj = {
                ip:CITYPLAN_config.server.ip,
                project:pipeProjArr[0].id
            };
           earth.UserDocument.DeleteXmlFile(configPath);
           var newXml=this.initSystemConfig(pipeProjArr[0].id) ;
           earth.UserDocument.SaveXmlFile(rootPath,newXml);

           systemDoc = loadXMLStr(newXml);
           systemJson=$.xml2json(systemDoc);
        }
    }
    //////////////////////////////////////////////////////////
    //IE9 不支持selectSingleNode
    //////////////////////////////////////////////////////////
    /*var root = systemDoc.documentElement;*/
    var systemData = {};
    systemData.project =systemJson.Project;
    // currentPrjGuid = systemJson.Project;
    return systemData;
};

function initPipePjoList(){
    //PROJECTLIST = [];
    var pipeProjectList = [];
    var rootLayerList = earth.LayerManager.LayerList;
    var projectCount = rootLayerList.GetChildCount();
    for (var i = 0; i < projectCount; i++) {
        var childLayer = rootLayerList.GetChildAt(i);
        var layerType = childLayer.LayerType;
        if (layerType === "Project") {  //17
            var projectId = childLayer.Guid;
            var projectName = childLayer.Name;
            //PROJECTLIST.push({'id':projectId, 'name':projectName, 'server':childLayer.GISServer, 'pltype':childLayer.PipeLineType}) ;
            var chlildrenCount = childLayer.GetChildCount();
            var pipeTag = false;
            for (var x = 0; x < chlildrenCount; x++) {
                var pipechildLayer = childLayer.GetChildAt(x);
                var pipelayerType = pipechildLayer.LayerType;
                if (pipelayerType === "Pipeline") {
                    pipeTag = true;
                }
                if (pipelayerType === "Folder") {
                    var threeLayerCount = pipechildLayer.GetChildCount();
                    for (var s = 0; s < threeLayerCount; s++) {
                        var threechildLayer = pipechildLayer.GetChildAt(s);
                        var threepipelayerType = threechildLayer.LayerType;
                        if (threepipelayerType === "Pipeline") {
                            pipeTag = true;
                        }
                    }
                }
            }
            if (pipeTag) {
                pipeProjectList.push({id: projectId, name: projectName});
            }
        }
    }
    return pipeProjectList;
};

/**
 * 定位到保存的默认视点位置
 */
function initPosition() {

    // var xml = earth.UserDocument.LoadXmlFile(earth.Environment.RootPath + CITYPLAN_config.constant.StartupPositionPath + ".xml");
    // if (xml) {
    //     var pos = $.xml2json(xml);
    //     if (pos && pos["position"]) {
    //         pos = eval('(' + pos["position"] + ')');
    //         earth.GlobeObserver.GotoLookat(pos.Lon, pos.Lat, pos.Lat, pos.Heading, pos.Pitch, pos.Roll, pos.Range);
    //     }
    // }
   var centerX = 121.66447902272362;
   var centerY = 31.14292053030718;
   var width = 0.011943260715634451;
   var range = width / 180 * Math.PI * 6378137 / Math.tan(22.5 / 180 * Math.PI);
   earth.GlobeObserver.GotoLookat(centerX, centerY, 0, 0, 70, 0, range);


}
/**
 * 保存当前位置到XML文件
 */
function savePosition() {
    // <xml><position>{"Lon":124.35859262113378,"Lat":43.15853161377651,"Alt":444.017236779473,
    // "Heading":340.81310029546904,"Pitch":47.89326780699343,"Roll":0,"Range":368.2009209488024}</position></xml>
  if(earth && earth.GlobeObserver){
    var targetPose = earth.GlobeObserver.TargetPose;
    var pose = earth.GlobeObserver.Pose;
    var xml = '<xml><position>{"Lon":' + targetPose.Longitude + ',"Lat":' + targetPose.Latitude + ',"Alt":' + targetPose.Altitude + ',';
    xml += '"Heading":' + pose.Heading + ',"Pitch":' + pose.Tilt + ',"Roll":0,"Range":' + pose.Range + '}</position></xml>';
    var xmlPath = earth.Environment.RootPath + CITYPLAN_config.constant.StartupPositionPath;

    earth.UserDocument.SaveXmlFile(xmlPath, xml);
}
}

$(window).unload(function () {
    savePosition();

});
// endregion

// region 书签控制
/**
 * 获取基础图层树中所有被选中的叶子节点的ID数组
 * @return {Array}
 */
function getVisibleLeafLayerIds() {
    var res = [];
    var tree = $.fn.zTree.getZTreeObj("layerTree");
    var nodes = tree.getCheckedNodes(true);
    $.each(nodes, function (i, node) {
        if (!node.children) {
            res.push(node.id);
        }
    });
    return res;
}
/**
 * 仅显示传入的图层ID数组对应的图层
 * 方法：先关闭所有图层，然后去显示指定的图层
 * 图层树表现：先将所有的节点全都不勾选，然后去勾选显示图层的节点
 * @param layerIds 图层ID数组
 */
function checkLayerByIds(layerIds) {
    var node = null;
    var tree = $.fn.zTree.getZTreeObj("layerTree");
    tree.checkAllNodes(false);
    earth.LayerManager.LayerList.Visibility = false;
    for (var i = 0; i < layerIds.length; i++) {
        node = tree.getNodeByParam("id", layerIds[i]);
        if (node) {
            tree.checkNode(node, true, true, true);
        }
    }
}
// endregion


function checkLayer(id, bCheck) {
    var layer = earth.LayerManager.GetLayerByGUID(id);
    var tree = $.fn.zTree.getZTreeObj("layerTree");
    var treeNode = tree.getNodeByParam("id", id);
    if (layer) {
        layer.Visibility = bCheck;
        if (treeNode) {
            tree.checkNode(treeNode, bCheck, true, true);
        }
    }
}



//视频监控2     (视频放入三维场景)
function     shipinjiankong2_Click(){
    var eventObj = $("#shipinjiankong2");
    if(eventObj.attr("disabled") == "disabled"){
        return;
    }
    showLargeDialog('html/media/shexiangtouSearch3_pt.html', '视频监控');
};

//slider气泡   加:20150917

function tranSettingClick(tag) {
    earth.Event.OnDocumentReadyCompleted = function() {};

    if (tag === "transparency") {
        if(lgttag==1){
            setSlidersVisible(0);
        }else{
            setSlidersVisible(1);
        }
    }


};




var setSlidersVisible = function(flag){
    var st = [{
        id:'terrainTransparency',
        type:'transparency'
    },{
        id:'mRain',
        type:'rain'
    },{
        id:'snow',
        type:'snow'
    },{
        id:'fog',
        type:'fog'
    }];
    sliderMgr.init(earth, false, function(type){
        for(var i in st){
            if(st[i].type == type){
                $('#' + st[i].id).removeClass('selected');
            }
        }
    });
    for(var i = 0;i < st.length;i++){
        sliderMgr.setVisible(st[i].type,flag & Math.pow(2,i));
    }
}

function pictureHtml(tag){
    earth.Event.OnHtmlNavigateCompleted = function (){};
    var loaclUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
    var url="";
    var dval;
    var ztree =  $.fn.zTree.getZTreeObj("userdataTree");
    var width =270,height = 240;
    if(tag === "mScreenShot"){
        url = loaclUrl + "/html/scene2/screenShot.html";//截屏气泡
        dval = earth;
    }
    if (picturesBalloons != null){
        picturesBalloons.DestroyObject();
        picturesBalloons = null;
    }
    if (transparencyBalloons != null){
        transparencyBalloons.DestroyObject();
        transparencyBalloons = null;
    }
    picturesBalloons = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), "屏幕坐标窗体URL");
    picturesBalloons.SetScreenLocation(0,0);
    picturesBalloons.SetRectSize(width,height);
    picturesBalloons.SetIsAddBackgroundImage(false);
    picturesBalloons.ShowNavigate(url);
    earth.Event.OnHtmlNavigateCompleted = function (){
        dval.htmlBallon = picturesBalloons;
        setTimeout(function(){
            picturesBalloons.InvokeScript("setTranScroll", dval);
        },100);
    };
    earth.Event.OnHtmlBalloonFinished = function (id){
        if (picturesBalloons != null&&id===picturesBalloons.Guid){
            picturesBalloons.DestroyObject();
            picturesBalloons = null;
        }
        earth.Event.OnHtmlBalloonFinished = function (){};
    };
};







// region 多屏对比中间接口，调用3DMain.html中定义的方法
function setScreen(n, planIdArr, projManager, currentApproveProjectGuid, currentLayerObjList) {
    parent.ifEarth.setScreen(n, planIdArr, projManager, currentApproveProjectGuid, currentLayerObjList);
}
function showIndexes(bShowIndex, planDataArr) {
    parent.ifEarth.showIndex(bShowIndex, planDataArr);
}
function setSync(bSync) {
    parent.ifEarth.setSync(bSync);
}
// endregion

// region UI控制

$(function () {


    // region 界面控制
        var panelMenu = $("#container").layout("panel", "west");
        var headerHeight = panelMenu.panel("header").outerHeight(); //panel面板头的高度
        // var funPenel  = $("#divWest").layout("panel", "center");  //左边上   侧面板
        // var infoPanel  = $("#divWest").layout("panel", "south");  //左边下侧面板


    var headerHeight = panelMenu.panel("header").outerHeight(); //panel面板头的高度
    var winWidth=window.document.body.offsetWidth;
    var winHeight=window.document.body.offsetHeight;


//     //窗口变化后，尺寸调整
    window.onresize = function(){
        resizeEarthToolWindow();
    }  ;
// //        var StandardTblWidth = 1250;  //600(左侧文字)+650（右侧tab）
//         var StandardTblWidth = 1480;  //580(左侧文字)+900（右侧tab）  <!--cy:10.31   改右侧tab宽度为700px-->
//
//         var TblTop=document.getElementById ("TopMenuTbl");
//         var TopLeft=document.getElementById ("topTblLeft");
//
//         winWidth=window.document.body.offsetWidth;
//         winHeight=window.document.body.offsetHeight;
//
//
//         //cy:如果浏览器>1200,   左侧最大不超过800px;如果<1200,左侧600px；右侧出现滚动条
//
//         if (winWidth > StandardTblWidth){
//             TblTop.width = (winWidth).toString() + "px";
//            var width_temp= winWidth-StandardTblWidth;
//             if(width_temp>=200){TopLeft.width="780px;"}
//             else
//             {
//                 TopLeft.width=580+width_temp+"px";
//
//             }
//         }
//         else
//         {
//             TblTop.width= StandardTblWidth.toString() + "px";
//             TopLeft.width="580px";
//         }
//
// //        var TopRight=document.getElementById ("topTblRight");
// //        TopRight.width="200px";
// //        winWidth=window.document.body.offsetWidth;
// //        winHeight=window.document.body.offsetHeight;
//
//     };
//
    $(window).trigger("resize");











    /**
     * 显示系统左侧菜单面板
     */
    var openMenuPanel = function () {

        if (panelMenu.panel("options").collapsed) {

            $("#container").layout("expand", "west");
        }
    };

    // 必须提前初始化对话框面板窗口，不然layout收缩会报错
    // 延迟1秒等待3D插件加载
    // dialog打开后需要关闭（仅针对IE 6）
    setTimeout(function () {
        $("#dlgResult").dialog({}).dialog("close");
    }, 1000);

    /**
     * 显示菜单面板下半部分的小面板
     * @param src 面板加载网页的地址
     * @param title 面板的标题
     */
    window.showLittleDialog = function (src, title) {
        var funcPanel = $("#divWest").layout("panel", "south");
        funcPanel.panel({
            title:title
        });
        var origSrc = $("#infoPanel").attr("src");
        if (origSrc != src) {
            $("#infoPanel").attr("src", src);
        }


        openMenuPanel();
        if (funcPanel.panel("options").collapsed) {
            $("#divWest").layout("expand", "south");
        }

    };

    /**
     * 页面刷新或者关闭的时候执行 关闭当前的窗体
     * @return {[type]} [description]
     */
    window.onunload=function(){
        if(htmlBalloonMove){
            htmlBalloonMove.DestroyObject();
        }
        if(transparencyBalloons){
            transparencyBalloons.DestroyObject();
        }
        if(picturesBalloons){
            picturesBalloons.DestroyObject();
        }
        if(htmlBal){
            htmlBal.DestroyObject();
            clearMeasureResult();
             hideBollon();
        }
   if(editTool){
            editTool.clearHtmlBallon();
        }
    };

    /**
     * 隐藏菜单面板下半部分的小面板
     */
    window.hideLittleDialog = function () {
        $("#divMenu").layout("collapse", "south");
    };
    window.showRegionWest = function(src, title) {

        // earth.ShapeCreator.Clear();
        // 对话框关闭时卸载页面，页面自身按需要清除临时数据
        openMenuPanel();
        panelMenu.panel({
            title:title
        });
        // $("#funPenel").attr("src", src);
        var oldsrc =   $("#fixediframe").attr("src" );
        if(oldsrc!=src) {
            $("#fixediframe").attr("src", src);
        }




    };
    /**
     * 显示左侧面板，覆盖在左侧菜单面板之上
     * @param src 面板加载网页的地址
     * @param title 面板的标题
     */
    window.showLargeDialog = function (src, title) {
        openMenuPanel();

        $("#dlgResult").dialog({
            shadow: false,
            draggable: false,
            title: title,
            onClose: function () {  // 对话框窗口关闭时清除临时图形
                earth.ShapeCreator.Clear();
                // 对话框关闭时卸载页面，页面自身按需要清除临时数据
                $("#ifResult").attr("src", "");
            }
        }).panel({height: panelMenu.height()-infoPanel.height() ,width:panelMenu.width()})
            .panel("move", {top: "113px", left: "0px"});
        $("#ifResult").attr("src", src);
    };

    /**
     * 隐藏左侧大面板
     */
    window.hideLargeDialog = function () {
        $("#dlgResult").dialog({}).dialog("close");
    };
    // endregion
    if ($.browser.msie) {
        window.setInterval("CollectGarbage();", 1000);
    }
    jQuery.support.cors = true; //开启jQuery跨域支持
    $("#ifEarth").attr("src", "3DMain.html");
});




function resizeEarthToolWindow(){//工具栏重新调整窗口
    var earthframeheight=document.getElementById ("ifEarth").clientWidth;
    if(earthToolsBalloon!=null) {
        if (earthToolsBalloon && earthframeheight < earthToolHeight) {
            var temHeight = parseInt((earthframeheight - 32 - 22) / 45) * 45 + 32 + 22;
            earthToolsBalloon.SetRectSize(earthToolWidth, temHeight);
            var earthToolHeightTemp = temHeight;
        } else if (earthToolsBalloon && earthToolHeightTemp < earthToolHeight) {
            earthToolsBalloon.SetRectSize(earthToolWidth, earthToolHeight);
        }
        var earthframewidth = document.getElementById("ifEarth").clientWidth;
        var locationx = earthframewidth / 2;
        var locationy = 0;

        earthToolsBalloon.SetScreenLocation(locationx, locationy);//earth.offsetHeight
    }
}
//弹出工具栏菜单
function showEarthTools(){
    if (earthToolsBalloon != null){
        earthToolsBalloon.DestroyObject();
    }

    earthToolsBalloon = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), "功能菜单");

    var earthframewidth=document.getElementById ("ifEarth").clientWidth;
    var  locationx= earthframewidth/2;
    var locationy=0;

    earthToolsBalloon.SetScreenLocation(locationx,locationy);//earth.offsetHeight
    earthToolsBalloon.SetRectSize(earthToolWidth, earthToolHeight);
    earthToolsBalloon.SetIsAddCloseButton(false);
    earthToolsBalloon.SetIsAddMargin(true);
    earthToolsBalloon.SetIsAddBackgroundImage(true);
    earthToolsBalloon.SetIsTransparence(true);
    earthToolsBalloon.SetBackgroundAlpha(100);
    var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    var url = windowUrl + '/earthTools.html';
    earth.Event.OnDocumentReadyCompleted = function(guid){
        if(guid == earthToolsBalloon.guid){
            var funcPara = {};
            funcPara.clickItem = clickItem;
            // funcPara.updateEarthToolsDiv = updateEarthToolsDiv;
            funcPara.earthToolHeight = earthToolHeight-32;
            earthToolsBalloon.InvokeScript('setFunc', funcPara);
        }
    }
    earthToolsBalloon.ShowNavigate(url);
      resizeEarthToolWindow();
}
//弹出工具栏菜单消防栓
function showEarthTools_xfs(){
    if (earthToolsBalloon != null){
        earthToolsBalloon.DestroyObject();
    }

    earthToolsBalloon = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), "功能菜单");

    var earthframewidth=document.getElementById ("ifEarth").clientWidth;
    var  locationx= earthframewidth/2;
    var locationy=0;

    earthToolsBalloon.SetScreenLocation(locationx,locationy);//earth.offsetHeight
    earthToolsBalloon.SetRectSize(earthToolWidth, earthToolHeight);
    earthToolsBalloon.SetIsAddCloseButton(false);
    earthToolsBalloon.SetIsAddMargin(true);
    earthToolsBalloon.SetIsAddBackgroundImage(true);
    earthToolsBalloon.SetIsTransparence(true);
    earthToolsBalloon.SetBackgroundAlpha(100);
    var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    var url = windowUrl + '/earthTools_xfs.html';
    earth.Event.OnDocumentReadyCompleted = function(guid){
        if(guid == earthToolsBalloon.guid){
            var funcPara = {};
            funcPara.clickItem = clickItem;
            // funcPara.updateEarthToolsDiv = updateEarthToolsDiv;
            funcPara.earthToolHeight = earthToolHeight-32;
            earthToolsBalloon.InvokeScript('setFunc_xfs', funcPara);
        }
    }
    earthToolsBalloon.ShowNavigate(url);
    resizeEarthToolWindow();
}
function clickItem(toolid, toolsDiv){
    earthToolsDiv = toolsDiv;
    try{
        if(typeof window[ "funcClicked"] == "function"){
            window[ "funcClicked"](toolid);


        }else{
            alert("请先定义" +   "funcClicked方法");
        }
    }catch(e){
        alert(  "funcClicked方法异常！");
    }
}


function funcClicked(toolid) {
    if(toolid=="CoverSituation") {
        analysis.showMoveHtml(toolid, "已安装井盖");
    }else  if(toolid=="CoverAlarmSituation") {
        analysis.showMoveHtml(toolid, "报警井盖");
    } else  if(toolid=="XFSSituation") {
        analysis.showMoveHtml(toolid, "已安装消防栓");
    }else  if(toolid=="XFSAlarmSituation") {
        analysis.showMoveHtml(toolid, "报警消防栓");
    } else  if(toolid=="HistoryAlarmCoverSituation") {
        analysis.showMoveHtml(toolid, "历史故障信息");
    } else  if(toolid=="HistoryAlarmXFSSituation") {
        analysis.showMoveHtml(toolid, "历史故障信息");
    } else  if(toolid=="UserSituation") {
        analysis.showMoveHtml(toolid, "人员信息列表");
    }
    else  if(toolid=="CloseearthTools") {
        if (earthToolsBalloon != null){
            earthToolsBalloon.DestroyObject();
        }
    }





    else if(toolid=="CoverInfo") {
        analysis.showMoveHtml(toolid, "智能市政简介");
    }else if(toolid=="HistoryCaseSituation") {
        analysis.showMoveHtml(toolid, "事件处理");
    }
}



//定位到迪士尼区域
function flytodisneyClick ()
{

    earth.GlobeObserver.GotoLookat(121.664479, 31.142907 ,5, 359, 60, 0.0, 4000);

};
//地面透明度
window.TerrainTransparency_Click=function(){
    if($("#TerrainTransparency").attr("disabled")=="disabled"){
        return;
    }
    tranSettingClick("transparency");
}





//地下浏览

window.ViewUndergroundMode_Click=function()
{

    var eventObj =$("#ViewUndergroundMode").find("img");
    if(eventObj.attr("alt") ==="开启地下浏览"){

        undergroundModeCtrl();
        eventObj.attr("alt","关闭地形浏览");
        eventObj.attr("title","关闭地形浏览");
        eventObj.attr("src","css/images/toolbar/cancel_tab_pro_pipe.png");
    } else {

        undergroundModeCancel();
        eventObj.attr("alt","开启地下浏览");
        eventObj.attr("title","开启地下浏览");
        eventObj.attr("src","css/images/toolbar/tab_pro_pipe.png");
    }
}




window.modelAlt=function(){

    var eventObj =   $("#modelAlt").find("img");//控高分析不可见;
    if(eventObj.attr("alt") ==="关闭所有模型"){
        setalllayersvisibility(false);
        eventObj.attr("alt","还原已关闭模型");
        eventObj.attr("title","还原已关闭模型");
        eventObj.attr("src","css/images/toolbar/cancel_tab_pro_building.png");
    }else{


        for(var i=0;i<hidedlayers.length;i++)
        {
            var layer=  hidedlayers[i];
            layer.Visibility=true;

        }

        //cy:10.10

        var elistarray1= currentLayerObjList[currentApproveProjectGuid];
        if(elistarray1!=null&&elistarray1.length>0){
            hideXZ(); //抠现状
        }
        //cy:10.10

        eventObj.attr("alt","关闭所有模型");
        eventObj.attr("title","关闭所有模型");
        eventObj.attr("src","css/images/toolbar/tab_pro_building.png");
    }


}

window.recoverclosemodel=function(){

    for(var i=0;i<hidedlayers.length;i++)
    {
        var layer=  hidedlayers[i];
        layer.Visibility=true;

    }
    //抠现状
  //cy:10.10  hideXZ();


}




    /**
     * 功能：地下浏览模式
     * 参数：无
     * 返回：无
     */
    var undergroundModeCtrl = function() {
        earth.GlobeObserver.UndergroundMode = true;
    }

    /**
     * 功能：取消地下浏览模式
     * 参数：无
     * 返回：无
     */
    var undergroundModeCancel = function() {
        earth.GlobeObserver.UndergroundMode = false;
        earth.Event.OnObserverChanged = function() {};
    }
/**
 * 根据标准名称返回显示字段名称
 * @param  {[type]} standardName     标准字段名称
 * @param  {[type]} pipeType         管线类型 1 -- 管线 0 -- 管点
 * @param  {[type]} returnFiledName  true返回FiledName false返回CaptionName
 * @return {[type]}                  显示名称
 */
function getName(standardName, pipeType, returnFiledName) {
    if (standardName === "" || standardName === undefined) {
        return;
    }
    if (pipeType === "" || pipeType === undefined) {
        return;
    }
    var configXML = SYSTEMPARAMS.pipeFieldMap;
    if (configXML == null) {
        return;
    }
    var lineData;
    if (pipeType === 1 || pipeType === "1") {
        lineData = configXML.getElementsByTagName("LineFieldInfo")[0] ? configXML.getElementsByTagName("LineFieldInfo")[0].getElementsByTagName("SystemFieldList")[0] : null;
    } else if (pipeType === 0 || pipeType === "0") {
        lineData = configXML.getElementsByTagName("PointFieldInfo")[0] ? configXML.getElementsByTagName("PointFieldInfo")[0].getElementsByTagName("SystemFieldList")[0] : null;
    }
    if (lineData && lineData.childNodes.length) {
        for (var i = lineData.childNodes.length - 1; i >= 0; i--) {
            var item = lineData.childNodes[i];
            if (item.getAttribute("StandardName").toUpperCase() == standardName.toUpperCase()) {
                if (returnFiledName) {
                    return item.getAttribute("FieldName").toUpperCase();
                } else {
                    return item.getAttribute("CaptionName");
                }
            }
        };
    }
};

function getNameNoIgnoreCase(standardName, pipeType, returnFiledName) {
    if (standardName === "" || standardName === undefined) {
        return;
    }
    if (pipeType === "" || pipeType === undefined) {
        return;
    }
    var configXML = SYSTEMPARAMS.pipeFieldMap;
    var lineData;
    if (pipeType === 1 || pipeType === "1") {
        lineData = configXML.getElementsByTagName("LineFieldInfo")[0] ? configXML.getElementsByTagName("LineFieldInfo")[0].getElementsByTagName("SystemFieldList")[0] : null;
    } else if (pipeType === 0 || pipeType === "0") {
        lineData = configXML.getElementsByTagName("PointFieldInfo")[0] ? configXML.getElementsByTagName("PointFieldInfo")[0].getElementsByTagName("SystemFieldList")[0] : null;
    }
    if (lineData && lineData.childNodes.length) {
        for (var i = lineData.childNodes.length - 1; i >= 0; i--) {
            var item = lineData.childNodes[i];
            if (item.getAttribute("StandardName") == standardName) {
                if (returnFiledName) {
                    return item.getAttribute("FieldName");
                } else {
                    return item.getAttribute("CaptionName");
                }
            }
        };
    }
};

function jump2Login(){

    try{
        var url = top.location.href;
         url = url.substring(0,url.lastIndexOf('/')) + '/login.html';
         top.location.assign(url);
    }catch(e){

    }
}
function  logout(){
    try{
        authMgr.delCookie('username');
        authMgr.delCookie('userpwd');
         if(earth && earth.UserLog.NeedSecurity(CITYPLAN_config.server.ip)){
       // cy：20160304 关闭satamp的权限控制
         earth.UserLog.Logout();

          }

        authMgr.clearAll(); //清理缓存的权限信息 add by zc 2014-08-18 13:51:37
        jump2Login();
    }catch(e){

    }
}
//掘路审批中用到
var clearHtmlBalloons = function(){
    if (htmlBalloons != null){
        htmlBalloons.DestroyObject();
    }
};
//掘路审批中用到
var showHtmlBalloon = function(vecCenterX, vecCenterY, vecCenterZ, htmlStr, width, height) {
    if (htmlBalloons) {
        htmlBalloons.DestroyObject();
        htmlBalloons = null;
    }
    var w = 240;
    var h = 330;
    if(width){
        w = width;
    }
    if(height){
        h = height;
    }
    var guid = earth.Factory.CreateGuid();
    htmlBalloons = earth.Factory.CreateHtmlBalloon(guid, "balloon");
    htmlBalloons.SetSphericalLocation(vecCenterX, vecCenterY, vecCenterZ);
    htmlBalloons.SetRectSize(w, h);
    var color = parseInt("0xccc0c0c0");//0xccc0c0c0 //e4e4e4 //0xcc4d514a
    htmlBalloons.SetTailColor(color);
    htmlBalloons.SetIsAddCloseButton(true);
    htmlBalloons.SetIsAddMargin(true);
    htmlBalloons.SetIsAddBackgroundImage(true);
    htmlBalloons.SetIsTransparence(false);
    htmlBalloons.SetBackgroundAlpha(0xcc);
    htmlBalloons.ShowHtml(htmlStr);





    //deleted by zhangd-2015-03-12-13:53--所有气泡关闭事件均修改为下面的回调方式
    earth.Event.OnHtmlBalloonFinished = function() {
        if (htmlBalloons != null) {
            htmlBalloons.DestroyObject();
            htmlBalloons = null;
        }
        earth.Event.OnHtmlBalloonFinished = function() {};
    }
    // OnHtmlBalloonFinishedFunc(guid,function(closeBid){
    //     if (htmlBalloons != null) {
    //         htmlBalloons.DestroyObject();
    //         htmlBalloons = null;
    //     }
    // })
};

