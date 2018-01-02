/**
 * User: wyh
 * Date: 12-12-18
 * Time: 下午4:10
 * Desc:
 */
if (!CITYPLAN) {
    var CITYPLAN = {};
}
CITYPLAN.LayerManager = function (earth) {
    var layerManager = {};
    /**
     * 根据图层类型，获取图标路径
     * @param layerType 图层类型
     * @return 图标样式
     */
    var _getLayerIcon = function (layerType) {
        var icon = "";
        if (layerType != "Folder") {
            icon = 'images/layer/layer_' + layerType.toLowerCase() + '.gif';
        }
        return icon;
    };
    /**
     * 将管线子图层中的英文名标识改为中文标识
     * @param name
     * @return {*}
     */
    var _enName2cnName = function (name) {
        var map = {
            "equipment": "附属",
            "container": "管线",
            "well": "井",
            "joint": "附属点",
            "plate": "井盖"
        };
        if (map[name]) {
            name = map[name];
        }
        return name;
    };
    /**
     * 获取图层数据
     * @param layer 图层根节点
     * @return 图层数据数组
     */
    var getLayerData = function (layer, str,currentPrjGuid) {
        if (!layer) {
            layer = earth.LayerManager.LayerList;
        }
        var layerData = [];
        var childCount = layer.GetChildCount();
        for (var i = 0; i < childCount; i++) {
            var childLayer = layer.GetChildAt(i);

             //cy20170506
            if(childLayer.LocalSearchParameter != null){
                if(childLayer.LayerType == 'POI'){
                    childLayer.LocalSearchParameter.ReturnDataType = 1;
                }else{
                   childLayer.LocalSearchParameter.ReturnDataType = 4;
                    //   childLayer.LocalSearchParameter.ReturnDataType = 6;
                }
            }




            // 在图层树上不显示的图层节点
            var data;

            if (childLayer.Guid == currentPrjGuid) {
                childLayer.Visibility = false;
            }
            var name = _enName2cnName(childLayer.Name);

            data = {
                "id": childLayer.Guid,
                "pId": 3,
                "name": name,
                "checked": childLayer.Visibility,
                "type":"BASEO1",
                "icon": _getLayerIcon(childLayer.LayerType)
            };
            if(str == "currentPrj"){


                if(childLayer.DataType=="CurrentLand"||childLayer.DataType=="PlanLand"){
//                    for(var i=0;i<parent.ctrPlanLayer.length;i++)
//                    {
//                        if(data.id==parent.ctrPlanLayer[i].id)  {continue;}
//                        else{ parent.ctrPlanLayer.push(data);}
//                    }
                }

                if(childLayer.DataType=="RegulatoryFigure" || childLayer.DataType === "TotalFigure"){

                    if(parent.ctrPlanLayer.length==0)
                    { parent.ctrPlanLayer.push(data);}
                    for(var i1=0;i1<parent.ctrPlanLayer.length;i1++)
                    {
                        if(data.id==parent.ctrPlanLayer[i1].id)  {continue;}
                        else{ parent.ctrPlanLayer.push(data);}
                    }
                }
//                if(childLayer.DataType.toLowerCase()=="currentbuilding" || childLayer.DataType.toLowerCase() == "planbuilding"){
////                    parent.indicatorAccountingLayer.push(data);
////                    parent.removeAnalysisLayer.push(data);
//                    if(parent.indicatorAccountingLayer.length==0)
//                    { parent.indicatorAccountingLayer.push(data);}
//                    for(var i=0;i<parent.indicatorAccountingLayer.length;i++)
//                    {
//                        if(data.id==parent.indicatorAccountingLayer[i].id)  {continue;}
//                        else{ parent.indicatorAccountingLayer.push(data);}
//                    }
//                    if(parent.removeAnalysisLayer.length==0)
//                    { parent.removeAnalysisLayer.push(data);}
//                    for(var i=0;i<parent.removeAnalysisLayer.length;i++)
//                    {
//                        if(data.id==parent.removeAnalysisLayer[i].id)  {continue;}
//                        else{ parent.removeAnalysisLayer.push(data);}
//                    }
//
//                }


                if(childLayer.DataType.toLowerCase()=="currentgreenbelt" || childLayer.DataType.toLowerCase() == "plangreenbelt"){
                    if(parent.greenbeltAnalysisLayer.length==0)
                    { parent.greenbeltAnalysisLayer.push(data);}
                    for(var i2=0;i2<parent.greenbeltAnalysisLayer.length;i2++)
                    {
                        if(data.id==parent.greenbeltAnalysisLayer[i2].id)  {continue;}
                        else{ parent.greenbeltAnalysisLayer.push(data);}
                    }

                }
                if(childLayer.LayerType.toLowerCase() == "wms" ){

                    if(parent.WMSLayerArray.length==0)
                    { parent.WMSLayerArray.push(data);}

                    for(var i3=0;i3<parent.WMSLayerArray.length;i3++)
                    {
                        if(data.id==parent.WMSLayerArray[i3].id)  {continue;}
                        else{ parent.WMSLayerArray.push(data);}
                    }
                }
//                if(childLayer.LayerType.toLowerCase() == "gispoi" || childLayer.LayerType.toLowerCase() == "gisvector" || childLayer.LayerType.toLowerCase() == "gispolyline" || childLayer.LayerType.toLowerCase() == "gispolygon"){
//                    layerData.push(data);
//                }
                if(childLayer.LayerType.toLowerCase() == "wms" ||childLayer.LayerType.toLowerCase() == "gispoi" || childLayer.LayerType.toLowerCase() == "gisvector" || childLayer.LayerType.toLowerCase() == "gispolyline" || childLayer.LayerType.toLowerCase() == "gispolygon"){
                    layerData.push(data);
                }
            }
            if (childLayer.GetChildCount() > 0) {
                data.children = getLayerData(childLayer);
            }
            if(str != "currentPrj"){
                layerData.push(data);
            }
        }

        return layerData;
    };


    var getCurrentProjectLayerData = function (res,layer) {

        if (!layer) {
            layer = earth.LayerManager.LayerList;
        }
        var layerData = [];
        var childCount = layer.GetChildCount();
        var pId=layer.Guid;
        for (var i = 0; i < childCount; i++) {
            var childLayer = layer.GetChildAt(i);
            var name = _enName2cnName(childLayer.Name);
            var data = {
                "id": childLayer.Guid,
                "pId": pId,
                "name": name,
                "checked": childLayer.Visibility,
                "type":"currentchilddata",
                "icon": _getLayerIcon(childLayer.LayerType)
            };
            // if(childLayer.DataType=="CurrentLand"||childLayer.DataType=="PlanLand"){
            //     parent.ParceLayer.push(data);
            // }
            // if(childLayer.DataType=="RegulatoryFigure" || childLayer.DataType === "TotalFigure"){
            //     parent.ctrPlanLayer.push(data);
            // }
            // if(childLayer.DataType.toLowerCase()=="currentbuilding" || childLayer.DataType.toLowerCase() === "planbuilding"){
            //     parent.indicatorAccountingLayer.push(data);
            // }
            // if(childLayer.DataType.toLowerCase()=="currentbuilding" || childLayer.DataType.toLowerCase() === "planbuilding"){
            //     parent.removeAnalysisLayer.push(data);
            // }
            // if(childLayer.DataType.toLowerCase()=="currentgreenbelt" || childLayer.DataType.toLowerCase() === "plangreenbelt"){
            //     parent.greenbeltAnalysisLayer.push(data);
            // }
            if (childLayer.GetChildCount() > 0) {
                data.children = getLayerData(childLayer, "currentPrj");
            }
            if(data.children && data.children.length) //有子元素的时候加上上级文件夹
            {
                res.push(data);
            }
        }
        return layerData;
    };
    var getCurrentProjectLayerData2 = function (layer) {

        if (!layer) {
            layer = earth.LayerManager.LayerList;
        }
        var layerData = [];
        var childCount = layer.GetChildCount();
        var pId=layer.Guid;
        for (var i = 0; i < childCount; i++) {
            var childLayer = layer.GetChildAt(i);
            var name = _enName2cnName(childLayer.Name);
            var data = {
                "id": childLayer.Guid,
                "pId": pId,
                "name": name,
                "checked": childLayer.Visibility,
                "type":"currentchilddata",
                "icon": _getLayerIcon(childLayer.LayerType)
            };
            // if(childLayer.DataType=="CurrentLand"||childLayer.DataType=="PlanLand"){
            //     parent.ParceLayer.push(data);
            // }
            // if(childLayer.DataType=="RegulatoryFigure" || childLayer.DataType === "TotalFigure"){
            //     parent.ctrPlanLayer.push(data);
            // }
            // if(childLayer.DataType.toLowerCase()=="currentbuilding" || childLayer.DataType.toLowerCase() === "planbuilding"){
            //     parent.indicatorAccountingLayer.push(data);
            // }
            // if(childLayer.DataType.toLowerCase()=="currentbuilding" || childLayer.DataType.toLowerCase() === "planbuilding"){
            //     parent.removeAnalysisLayer.push(data);
            // }
            // if(childLayer.DataType.toLowerCase()=="currentgreenbelt" || childLayer.DataType.toLowerCase() === "plangreenbelt"){
            //     parent.greenbeltAnalysisLayer.push(data);
            // }
            if (childLayer.GetChildCount() > 0) {
                data.children = getLayerData(childLayer, false);
            }
//            if(data.children && data.children.length) //有子元素的时候加上上级文件夹
//            {
//                res.push(data);
//            }

            layerData.push(data);
        }
        return layerData;
    };
    /**
     * 加载 现状数据
     * @type {{}}
     */
    var getOldData = function (res) {
        var layerData = [];
        earth.Event.OnEditLayerListLoaded = function (pFeature) {   // pFeature的类型为ISEDatabaseLayer
            var layer = null;
            earth.Event.OnEditLayerListLoaded = function () {};
            for (var i = 0; i < pFeature.GetChildCount(); i++) {
                layer = pFeature.GetChildAt(i);   // ISEDatabaseLayer
                if (layer.GroupID == -3) {
                    var data = {
                        "id": layer.Guid,
                        "pId": 2,
                        "name": layer.Name,
                        "checked": false,
                        "icon": _getLayerIcon("Folder")
                    };
                    res.push(data);
                }
            }
        };
        earth.LayerManager.ApplyEditLayerList();
        return layerData;
        /*var bExist = false;
         var layerIds = [];
         var layerData = [];
         if (bShow) {
         $.each(layerIds, function (i, layerId) {
         if (editLayers[layerId]) {
         editLayers[layerId].Visibility = true;
         bExist = true;
         }
         });
         if (!bExist) {
         earth.Event.OnEditLayerListLoaded = function (pFeature) {   // pFeature的类型为ISEDatabaseLayer
         var layer = null;
         earth.Event.OnEditLayerListLoaded = function () {
         };
         for (var i = 0; i < pFeature.GetChildCount(); i++) {
         layer = pFeature.GetChildAt(i);   // ISEDatabaseLayer
         if (layer.GroupID == -3) {
         var data = {
         "id": layer.Guid,
         "pId": 2,
         "name": layer.Name,
         "checked": false,
         "icon": _getLayerIcon("Folder")
         };
         //layer.Visible = false;
         //layer.LayerIsPrior = false;
         res.push(data);
         editLayers[layer.Guid] = layer;
         }
         }
         };
         earth.LayerManager.ApplyEditLayerList();
         }
         } else {
         $.each(layerIds, function (i, layerId) {
         if (editLayers[layerId]) {
         editLayers[layerId].Visibility = false;
         }
         });
         }
         return layerData;*/
    };
    /**
     * 定位到经纬度范围
     */
    var flyToLayer = function (layer) {
        if(!layer){return;}
        var lonLatRect = layer.LonLatRect;
        if(projManager.IsValid(lonLatRect)){
            var centerX = (lonLatRect.East + lonLatRect.West) / 2;
            var centerY = (lonLatRect.North + lonLatRect.South) / 2;
            var width = (parseFloat(lonLatRect.North) - parseFloat(lonLatRect.South)) / 2;
            var range = width / 180 * Math.PI * 6378137 / Math.tan(22.5 / 180 * Math.PI);
            earth.GlobeObserver.FlytoLookat(centerX, centerY, 0, 0, 90, 0, range, 4);
        }
    };
    var getPoiLayers = function(flag) {
        poiLayers = [];
        getLayerData();
        var _poiLayers = [];
        var _gispoiLayers = [];
        var _allLayers = [];
        for (var i = 0; i < poiLayers.length; i++) {
            var layerObj = poiLayers[i];
            if (layerObj.type.toLowerCase() == 'poi') {
                _poiLayers.push(layerObj);
            } else if (layerObj.type.toLowerCase() == 'gispoi') {
                _gispoiLayers.push(layerObj);
            }
            _allLayers.push(layerObj);
        }
        if (flag == 1) {
            return _poiLayers;
        } else if (flag == 2) {
            return _gispoiLayers;
        } else {
            return _allLayers;
        }
    }

    layerManager.flyToLayer = flyToLayer; // 定位到图层
    layerManager.getPoiLayers = getPoiLayers; //获取poi类型的图层数据

    layerManager.getLayerData = getLayerData;      // 获取图层数据
    layerManager.getCurrentProjectLayerData=getCurrentProjectLayerData;//获取当前项目图层数据
    layerManager.getCurrentProjectLayerData2=getCurrentProjectLayerData2;//获取当前项目图层数据
    layerManager.getOldData = getOldData;
    return layerManager;
};