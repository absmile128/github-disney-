/**
 * User: wyh
 * Date: 12-12-12
 * Time: 上午10:03
 * Desc: 项目管理，依赖jquery和xml2json，CITYPLAN_config.js
 */

if (!CITYPLAN) {
    var CITYPLAN = {};
}

// region 业务类
CITYPLAN.CityPlanParcel = function (feature) {
    this.m_guid = earth.Factory.CreateGUID();
    this.m_projectID = "";
    this.m_parcelID = "";
    this.m_name = "Parcel";
    this.m_area = 0;
    this.m_buildingDensity = 0;
    this.m_volumeRate = 0;
    this.m_greenRate = 0;
    this.m_hightLimit = 0;

    var index = 0;
    if (feature) {
        index = feature.GetFieldIndex("PARCELID");
        this.m_parcelID = feature.GetFieldAsString(index);

        index = feature.GetFieldIndex("PROJECTID");
        this.m_projectID = feature.GetFieldAsString(index);

        index = feature.GetFieldIndex("AREA");
        this.m_area = feature.GetFieldAsDouble(index);

        index = feature.GetFieldIndex("BUILDINGDENSITY");
        this.m_buildingDensity = feature.GetFieldAsDouble(index);

        index = feature.GetFieldIndex("VOLUMERATE");
        this.m_volumeRate = feature.GetFieldAsDouble(index);

        index = feature.GetFieldIndex("GREENRATE");
        this.m_greenRate = feature.GetFieldAsDouble(index);

        index = feature.GetFieldIndex("HIGHTLIMIT");
        this.m_hightLimit = feature.GetFieldAsDouble(index);
    }
};
CITYPLAN.CityPlanParcel.prototype.saveToDB = function () {
    var result = false;

    var xml = "<CPPARCEL>" +
        "<ID>" + this.m_guid + "</ID>" +
        "<PROJECTID>" + this.m_projectID + "</PROJECTID>" +
        "<PARCELID>" + this.m_parcelID + "</PARCELID>" +
        "<AREA>" + this.m_area + "</AREA>" +
        "<BUILDDENS>" + this.m_buildingDensity + "</BUILDDENS>" +
        "<VOLUMERATE>" + this.m_volumeRate + "</VOLUMERATE>" +
        "<GREENRATE>" + this.m_greenRate + "</GREENRATE>" +
        "<HIGHTLIMIT>" + this.m_hightLimit + "</HIGHTLIMIT>" +
        "</CPPARCEL>";
    $.ajaxSetup({
        async: false  // 将ajax请求设为同步
    });
    $.post(CITYPLAN_config.service.add, xml, function (data) {
        if (/true/.test(data)) {
            result = true;
        }
    }, "text");

    return result;
};
CITYPLAN.CityPlanParcel.prototype.getId = function () {
    return this.m_guid;
};
CITYPLAN.CityPlanParcel.prototype.getName = function () {
    return this.m_name;
};

CITYPLAN.CityPlanRoadLine = function (feature) {
    this.m_guid = earth.Factory.CreateGUID();
    this.m_projectID = "";
    this.m_code = "";
    this.m_name = "RoadLine";
    this.m_type = "";
    this.m_distance = 0;

    var index = 0;
    if (feature) {
        index = feature.GetFieldIndex("CODE");
        this.m_code = feature.GetFieldAsString(index);

        index = feature.GetFieldIndex("PROJECTID");
        this.m_projectID = feature.GetFieldAsString(index);

        index = feature.GetFieldIndex("TYPE");
        this.m_type = feature.GetFieldAsDouble(index);

        index = feature.GetFieldIndex("DISTANCE");
        this.m_distance = feature.GetFieldAsDouble(index);

        index = feature.GetFieldIndex("LAYERID");
        this.m_layerID = feature.GetFieldAsDouble(index);
    }
};
CITYPLAN.CityPlanRoadLine.prototype.saveToDB = function () {
    var result = false;

    var xml = "<CPROADLINE>" +
        "<ID>" + this.m_guid + "</ID>" +
        "<PROJECTID>" + this.m_projectID + "</PROJECTID>" +
        "<CODE>" + this.m_code + "</CODE>" +
        "<TYPE>" + this.m_type + "</TYPE>" +
        "<DISTANCE>" + this.m_distance + "</DISTANCE>" +
        "</CPROADLINE>";
    $.ajaxSetup({
        async: false  // 将ajax请求设为同步
    });
    $.post(CITYPLAN_config.service.add, xml, function (data) {
        if (/true/.test(data)) {
            result = true;
        }
    }, "text");

    return result;
};
CITYPLAN.CityPlanRoadLine.prototype.getId = function () {
    return this.m_guid;
};
CITYPLAN.CityPlanRoadLine.prototype.getName = function () {
    return this.m_name;
};

CITYPLAN.CityPlanSimpleBuilding = function (feature) {
    this.m_guid = earth.Factory.CreateGUID();
    this.m_planID = "";
    this.m_name = "SimpleBuilding";
    this.m_floor = 0;
    this.m_floorHeight = 0;
    this.m_totalArea = 0;
    this.m_baseArea = 0;
    this.m_roofType = 0;
    var index = 0;
    if (feature) {
        index = feature.GetFieldIndex("PLANID");
        this.m_planID = feature.GetFieldAsString(index);

        index = feature.GetFieldIndex("NAME");
        this.m_name = feature.GetFieldAsString(index);

        index = feature.GetFieldIndex("FLOOR");
        this.m_floor = feature.GetFieldAsDouble(index);

        index = feature.GetFieldIndex("FLOORHIGHT");
        this.m_floorHeight = feature.GetFieldAsDouble(index);

        index = feature.GetFieldIndex("BASEAREA");
        this.m_baseArea = feature.GetFieldAsDouble(index);

        index = feature.GetFieldIndex("TOTALAREA");
        this.m_totalArea = feature.GetFieldAsDouble(index);

        index = feature.GetFieldIndex("ROOFTYPE");
        this.m_roofType = feature.GetFieldAsInteger(index);
    }
};
CITYPLAN.CityPlanSimpleBuilding.prototype.saveToDB = function () {
    var result = false;

    var xml = "<CPSIMPLEBUILDING>" +
        "<ID>" + this.m_guid + "</ID>" +
        "<PLANID>" + this.m_planID + "</PLANID>" +
        "<NAME>" + this.m_name + "</NAME>" +
        "<FLOOR>" + this.m_floor + "</FLOOR>" +
        "<FLOORHIGHT>" + this.m_floorHeight + "</FLOORHIGHT>" +
        "<TOTALAREA>" + this.m_totalArea + "</TOTALAREA>" +
        "<BASEAREA>" + this.m_baseArea + "</BASEAREA>" +
        "<ROOFTYPE>" + this.m_roofType + "</ROOFTYPE>" +
        "</CPSIMPLEBUILDING>";
    $.ajaxSetup({
        async: false  // 将ajax请求设为同步
    });
    $.post(CITYPLAN_config.service.add, xml, function (data) {
        if (/true/.test(data)) {
            result = true;
        }
    }, "text");

    return result;
};
CITYPLAN.CityPlanSimpleBuilding.prototype.getId = function () {
    return this.m_guid;
};
CITYPLAN.CityPlanSimpleBuilding.prototype.getName = function () {
    return this.m_name;
};
CITYPLAN.CityPlanSimpleBuilding.prototype.getRoofType = function () {
    return this.m_roofType;
};
CITYPLAN.CityPlanSimpleBuilding.prototype.getFloor = function () {
    return this.m_floor;
};
CITYPLAN.CityPlanSimpleBuilding.prototype.getFloorHeight = function () {
    return this.m_floorHeight;
};

CITYPLAN.CityPlanGreenLand = function (feature) {
    this.m_guid = earth.Factory.CreateGUID();
    this.m_planID = "";
    this.m_area = "";
    this.m_name = "GreenLand";

    var index = 0;
    if (feature) {
        index = feature.GetFieldIndex("ID");
        this.m_guid = feature.GetFieldAsString(index);

        index = feature.GetFieldIndex("PLANID");
        this.m_planID = feature.GetFieldAsString(index);

        index = feature.GetFieldIndex("AREA");
        this.m_area = feature.GetFieldAsDouble(index);
    }
};
CITYPLAN.CityPlanGreenLand.prototype.saveToDB = function () {
    var result = false;

    var xml = "<CPGREEN>" +
        "<ID>" + this.m_guid + "</ID>" +
        "<PLANID>" + this.m_planID + "</PLANID>" +
        "<AREA>" + this.m_code + "</AREA>" +
        "</CPGREEN>";
    $.ajaxSetup({
        async: false  // 将ajax请求设为同步
    });
    $.post(CITYPLAN_config.service.add, xml, function (data) {
        if (/true/.test(data)) {
            result = true;
        }
    }, "text");

    return result;
};
CITYPLAN.CityPlanGreenLand.prototype.getId = function () {
    return this.m_guid;
};
CITYPLAN.CityPlanGreenLand.prototype.getName = function () {
    return this.m_name;
};

// endregion

/**
 * 将一个文件的完整路径拆分为文件夹路径和文件名（含后缀）两个部分，作为数组返回
 * @param fullPath
 * @return {Array}
 */
function splitFilePath(fullPath) {
    var res = [];
    if (!fullPath) {
        throw {name: '参数错误', message: '路径参数不合格'};
    }
    var pathArray = fullPath.split("\\");
    if (!pathArray || pathArray.length < 2) {
        throw {name: '参数错误', message: '请传入文件的完整路径'};
    }
    res[0] = pathArray.slice(0, pathArray.length - 1).join('\\');
    res[1] = pathArray[pathArray.length - 1];
    return res;
}

CITYPLAN.ProjectManager = function (earth, dataProcess) {
    var projManager = {};
    var imgPathMgr = "../../image/project/";    // 方案树图标路径，相对管理页面的路径
    var imgPathInves = "image/project/";         // 方案树图标路径，相对审批树页面的路径（即index页面）
    var sep = "-";    // 分隔符，特殊节点（如规划专题、方案的阶段）ID由项目ID+sep+编码组成
    var parcelPloygonVcts3={};//创建的规划用地
    /**
     * 保存每一个添加到数据库中图层的辅助信息：键值为图层guid
     * shp类型数据：对象包括ogr图层、datum和类型（parcel,roadline,simplebuilding和greenland）
     * 模型类型数据：对象包括文件路径、模型文件夹名称和类型（buildingmodel和groundmodel）
     */
    var addedLayerInfo = {};
    /**
     * 保存所有需要的数据库中的空间图层属性信息，键值为图层guid
     */
    var editLayers=parent.editLayers;
    $.support.cors = true; //开启jQuery跨域支持
    $.ajaxSetup({
        async: false  // 将ajax请求设为同步
    });
    var getSep = function () {
        return sep;
    };
    var clearEditLayers = function(){
        editLayers = {};
    };
    var getEditLayers = function(){
        return editLayers;
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
        }, "text");
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

    var getBuildingDataByPlanId=function(planId){
        var  buildingQueryXml =
            '<QUERY>' +
                '<CONDITION><AND>'+
                "<PLANID tablename = 'CPBUILDING'>='" + planId + "'</PLANID>"+
                '</AND></CONDITION>'+
                '<RESULT><CPBUILDING></CPBUILDING></RESULT>' +
                '</QUERY>';
        return _queryData(CITYPLAN_config.service.query, buildingQueryXml);
    }
    /**
     * 根据项目ID查询属于该项目的所有方案
     * @param projId 项目ID
     * @param type 方案类型编码：1,2,3,4
     * @return {*} 返回方案记录对象：包含对象的数组或者单个对象
     */
    var getPlanData = function (projId, type) {
        var planQueryXml =
            '<QUERY><CONDITION><AND>' +
                (projId ? ('<PROJECTID tablename = "CPPLAN">=\'' + projId + '\'</PROJECTID>') : '') +
                (type ? ('<TYPE tablename = "CPPLAN">=' + type + '</TYPE>') : '') +
                '</AND></CONDITION>' +
                '<RESULT><CPPLAN></CPPLAN></RESULT>' +
                '</QUERY>';
        return _queryData(CITYPLAN_config.service.query, planQueryXml);
    };
    var getPlanById = function (id) {
        var planQueryXml =
            '<QUERY>' +
                '<CONDITION><AND><ID tablename = "CPPLAN">=\'' + id + '\'</ID></AND></CONDITION>' +
                '<RESULT><CPPLAN></CPPLAN></RESULT>' +
                '</QUERY>';
        // endregion
        return _queryData(CITYPLAN_config.service.query, planQueryXml);
    };
    /**
     * 根据方案中包含的建筑物数据属性统计方案指标
     * @param planId 方案ID
     * @param projId 项目ID
     * @param planType 方案类型：1,2,3,4
     * @return {*}
     */
    var getPlanIndex = function (planId, projId, planType) {
        var xmlCount = (planType <= 2 ? "<PLAN_TARGET_1>" : "<PLAN_TARGET_2>") +
            "<PROJECT_ID>" + projId + "</PROJECT_ID>" +
            "<PLAN_ID>" + planId + "</PLAN_ID>" +
            (planType <= 2 ? "</PLAN_TARGET_1>" : "</PLAN_TARGET_2>");
        var res = dbUtil(CITYPLAN_config.service.count, xmlCount);
        res = $.xml2json(res);
        if (res) {
            return res;
        }
        return null;
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
                (options.startDate ? ('<PROJDATE tablename = "CPPROJECT">&gt;=' + options.startDate + '</PROJDATE>') : '') +
                (options.endDate ? ('<PROJDATE tablename = "CPPROJECT">&lt;=' + options.endDate + '</PROJDATE>') : '') +
                (options.projName ? ('<NAME tablename = "CPPROJECT">like \'' + options.projName + '%\'</NAME>') : '') +
                (options.projProperty ? ('<YDXZ tablename = "CPPROJECT">' + options.projProperty + '</YDXZ>') : '') +
                '</AND></CONDITION>' +
                '<RESULT><CPPROJECT></CPPROJECT></RESULT>' +
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
                '<RESULT><CPPROJECT><FIELD>PROJDATE</FIELD></CPPROJECT></RESULT>' +
                '</QUERY>';
        // endregion
        var res = _queryData(CITYPLAN_config.service.query, projectQueryXml);
        $.each(res, function (i, r) {
            $.inArray()
            result.push(r["CPPROJECT.PROJDATE"]);
        });
        return makeUnique(result).sort(function (a, b) {  // 按年份从大到小排列
            return b - a
        });
    };
    /**
     * 获得用地性质
     * @param node
     */
    var getProjectYDXZ=function(){
        var result = [];
        // region 项目查询字符串
        var projectQueryXml =
            '<QUERY>' +
                '<CONDITION></CONDITION>' +
                '<RESULT><CPPROJECT><FIELD>YDXZ</FIELD></CPPROJECT></RESULT>' +
                '</QUERY>';
        // endregion
        var res = _queryData(CITYPLAN_config.service.query, projectQueryXml);
        $.each(res, function (i, r) {
            if($.inArray()===-1){
                result.push(r["CPPROJECT.YDXZ"]);
            }
        });
        return result;
    }



    /**   cy
     * 根据项目id得到项目限高
     * @param node
     */
    var getProjectJZXG=function(id){
        var result = [];
        // region 项目查询字符串
        var projectQueryXml =
            '<QUERY>' +
                '<CONDITION><AND><ID tablename = "CPPROJECT">=\'' + id + '\'</ID></AND></CONDITION>' +
                '<RESULT><CPPROJECT><FIELD>JZXG</FIELD></CPPROJECT></RESULT>' +
                '</QUERY>';
        // endregion
        var res = _queryData(CITYPLAN_config.service.query, projectQueryXml);
        $.each(res, function (i, r) {
            if($.inArray()===-1){
                result.push(r["CPPROJECT.JZXG"]);
            }
        });
        return result;
    }










    /**
     * 根据方案id定位到图层
     * @param id
     */
    var locateToLayer = function (node) {
        if (node.type == "PLAN") {
            var layerIds = _getLayerIdsByPlanId(node.id);
            for (var i = 0; i < layerIds.length; i++) {
                var layerId = layerIds[i];
                if (editLayers[layerId]) {
                    var rect = editLayers[layerId].LonLatRect
                    if (IsValid(rect)) {
                        flyToLayer(rect);
                        break;
                    }
                }
            }
        } else if (node.type == "PARCEL" || node.type == "ROADLINE") {
            var layerId = _getLayerIdByProId(node.projectId, node.type);
            if (editLayers[layerId]) {
                var rect = editLayers[layerId].LonLatRect;
                if (IsValid(rect)) {
                    flyToLayer(rect);
                }
            }
        }
    };
    /**
     * 定位到经纬度范围
     */
    var flyToLayer = function (layerLonLatRect) {
        var centerX = (layerLonLatRect.East + layerLonLatRect.West) / 2;
        var centerY = (layerLonLatRect.North + layerLonLatRect.South) / 2;
        var width = (parseFloat(layerLonLatRect.North) - parseFloat(layerLonLatRect.South)) / 2;
        var range = width / 180 * Math.PI * 6378137 / Math.tan(22.5 / 180 * Math.PI);
        earth.GlobeObserver.FlytoLookat(centerX, centerY, 0, 0, 90, 0, range, 4);
    };
    /**
     * 根据方案id定位到图层并自动旋转
     * @param id
     */
    var locateToLayerAndRotate = function (id) {
        var layerIds = _getLayerIdsByPlanId(id);
        earth.Event.OnEditDatabaseFinished = function (pRes,pFeature) {   // ISEDatabaseLayer
            var layer = null;
            earth.Event.OnEditDatabaseFinished = function () {
            };
            for (var i = 0; i < pFeature.GetChildCount(); i++) {
                layer = pFeature.GetChildAt(i);   // ISEDatabaseLayer
                if ($.inArray(layer.Guid, layerIds) != -1) {   // 不在数组中才返回-1
                    var center = layer.LonLatRect.Center;
                    earth.GlobeObserver.GotoLookat(center.X, center.Y, center.Z, 0, 90, 0, 500);
                    // todo 旋转
                    break;
                }
            }
        };
         // earth.LayerManager.ApplyEditLayerList();
        earth.DatabaseManager.GetAllLayer(CITYPLAN_config.server.dataServerIP);
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
            "<CONDITION><AND><ID tablename='CPPLAN'> ='" + planId + "' </ID></AND></CONDITION>" +
            "<RESULT><CPPLAN></CPPLAN></RESULT>" +
            "</QUERY>";
        var res = _queryData(CITYPLAN_config.service.query, xmlQuery);
        if (res.length > 0) {
            var layerIds = res[0]["CPPLAN.LAYERIDS"];
            var layerIdArr = layerIds.split(",");
            $.each(layerIdArr, function (i, id) {
               earth.DatabaseManager.DeleteLayerInDatabase(CITYPLAN_config.server.dataServerIP,id);
                if(editLayers[id]){
  //先在earth上也要删除该id对应的editLayer图层 否则下次导入会无法显示 guid重复！
                    earth.DetachObject(editLayers[id]);
                    delete editLayers[id];
                }
            });
        }
        // 删除属性数据
        var xmlDelete = "<CPBUILDING><PLANID> ='" + planId + "' </PLANID></CPBUILDING>";
        dbUtil(CITYPLAN_config.service.remove, xmlDelete);
        xmlDelete = "<CPATTACHMENT><PLANID> ='" + planId + "' </PLANID></CPATTACHMENT>";
        dbUtil(CITYPLAN_config.service.remove, xmlDelete);
        // 删除属性数据
        xmlDelete = "<CPSIMPLEBUILDING><PLANID> ='" + planId + "' </PLANID></CPSIMPLEBUILDING>";
        dbUtil(CITYPLAN_config.service.remove, xmlDelete);
        xmlDelete = "<CPGREEN><PLANID> ='" + planId + "' </PLANID></CPGREEN>";
        dbUtil(CITYPLAN_config.service.remove, xmlDelete);
        // 删除方案记录
        xmlDelete = "<CPPLAN><ID> ='" + planId + "' </ID></CPPLAN>";
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
            "<CONDITION><AND><ID tablename='CPPLAN'> ='" + planId + "' </ID></AND></CONDITION>" +
            "<RESULT><CPPLAN></CPPLAN></RESULT>" +
            "</QUERY>";
        var res = _queryData(CITYPLAN_config.service.query, xmlQuery);
        if (res.length > 0) {
            var layerIds = res[0]["CPPLAN.LAYERIDS"];
            var layerIdArr = layerIds.split(",");
            $.each(layerIdArr, function (i, id) {
             if(editLayers[id]){
                    //earth.DetachObject(editLayers[id]);
                }
		  earth.DatabaseManager.DeleteLayerInDatabase(CITYPLAN_config.server.dataServerIP,id);

            });
        }
        // 删除属性数据
        var xmlDelete = "<CPSIMPLEBUILDING><PLANID> ='" + planId + "' </PLANID></CPSIMPLEBUILDING>";
        dbUtil(CITYPLAN_config.service.remove, xmlDelete);
        xmlDelete = "<CPGREEN><PLANID> ='" + planId + "' </PLANID></CPGREEN>";
        dbUtil(CITYPLAN_config.service.remove, xmlDelete);
        // 删除方案记录
        xmlDelete = "<CPPLAN><ID> ='" + planId + "' </ID></CPPLAN>";
        dbUtil(CITYPLAN_config.service.remove, xmlDelete);
    };
    /**
     * 删除方案的视点
     * @param planId 方案ID
     * @private
     */
    var _deleteViewpoint = function (planId) {
        var xml = "<CPVIEWPOINT><PLANID> ='" + planId + "' </PLANID></CPVIEWPOINT>";
        dbUtil(CITYPLAN_config.service.remove, xml);
    };
    /**
     * 根据方案的ID和类型，删除方案及相关数据
     * @param id
     * @param type 策划、设计和详规、单体：都包含视点信息
     * 策划和设计：shp类型的数据，包含简单建筑和绿地
     * 详规和单体：模型类型的数据，包括建筑和方案附件
     */
    var deletePlan = function (id, type) {
        _deleteViewpoint(id);
        if (type == 1 || type == 2) {      // 策划或设计
            _deleteShpPlan(id);
        } else if (type == 3 || type == 4) {
            _deleteModelPlan(id);
        }
    };

    // endregion

    // region 删除项目
    var _deleteSubjectByProjectId = function (projectId) {
        var xmlQuery = "<QUERY>" +
            "<CONDITION><AND><ID tablename='CPPROJECT'> ='" + projectId + "' </ID></AND></CONDITION>" +
            "<RESULT><CPPROJECT><FIELD>PARCELLAYERID</FIELD><FIELD>ROADLINELAYERID</FIELD></CPPROJECT></RESULT>" +
            "</QUERY>";
        var projects = _queryData(CITYPLAN_config.service.query, xmlQuery);
        if (projects.length <= 0) {
            return;
        }
        var project = projects[0];
        var parcelLayerId = project["CPPROJECT.PARCELLAYERID"];
        var roadlineLayerId = project["CPPROJECT.ROADLINELAYERID"];
        var xml = "";
        if (parcelLayerId) {
            earth.DatabaseManager.DeleteLayerInDatabase(CITYPLAN_config.server.dataServerIP,parcelLayerId);
            xml = "<CPPARCEL><PROJECTID> ='" + projectId + "' </PROJECTID></CPPARCEL>";
            dbUtil(CITYPLAN_config.service.remove, xml);
            if(editLayers[parcelLayerId]){
         earth.DetachObject(editLayers[parcelLayerId]);
                delete editLayers[parcelLayerId];
            }
        }
        if (roadlineLayerId) {
            earth.DatabaseManager.DeleteLayerInDatabase(CITYPLAN_config.server.dataServerIP,roadlineLayerId);
            xml = "<CPROADLINE><PROJECTID> ='" + projectId + "' </PROJECTID></CPROADLINE>";
            dbUtil(CITYPLAN_config.service.remove, xml);
            if(editLayers[roadlineLayerId]){
 earth.DetachObject(editLayers[roadlineLayerId]);
                delete editLayers[roadlineLayerId];
            }
        }
    };
    var _deletePlansByProjectId = function (projectId) {
        var xmlQuery = "<QUERY>" +
            "<CONDITION><AND><PROJECTID tablename='CPPLAN'> ='" + projectId + "' </PROJECTID></AND></CONDITION>" +
            "<RESULT><CPPLAN><FIELD>ID</FIELD><FIELD>TYPE</FIELD></CPPLAN></RESULT>" +
            "</QUERY>";
        var plans = _queryData(CITYPLAN_config.service.query, xmlQuery);
        $.each(plans, function (i, plan) {
            deletePlan(plan["CPPLAN.ID"], plan["CPPLAN.TYPE"]);
        });
    };
    var _deleteConferencesByProjectId = function (projectId) {
        var xml = "<CPCONFERENCE><PROJECTID> ='" + projectId + "' </PROJECTID></CPCONFERENCE>";
        dbUtil(CITYPLAN_config.service.remove, xml);
    };

    var _deleteAttachmentByProjectId = function(projectId){
         var xmlQuery = "<QUERY>" +
            "<CONDITION><AND><PROJECTID tablename='CPPLAN'> ='" + projectId + "' </PROJECTID></AND></CONDITION>" +
            "<RESULT><CPPLAN><FIELD>ID</FIELD><FIELD>TYPE</FIELD></CPPLAN></RESULT>" +
            "</QUERY>";
        var plans = _queryData(CITYPLAN_config.service.query, xmlQuery);
        var ids = [];
        $.each(plans, function (i, plan) {
            ids.push(plan["CPPLAN.ID"]);
        });
        ids.push(projectId);

        //删除附件
        for (var i = ids.length - 1; i >= 0; i--) {
            var pid = ids[i];
            var xml = "<CPATTACHMENT>" +
            "<PLANID> ='" + pid + "' </PLANID></CPATTACHMENT>"
            dbUtil(CITYPLAN_config.service.remove, xml);
        };
    };

    var deleteProject = function (id) {
        //删除附件表中的附件 根据项目的guid 方案的guid 进行删除
        _deleteAttachmentByProjectId(id);
        _deleteSubjectByProjectId(id);
        _deletePlansByProjectId(id);
        _deleteConferencesByProjectId(id);
        var xml = "<CPPROJECT><ID> ='" + id + "' </ID></CPPROJECT>";
        dbUtil(CITYPLAN_config.service.remove, xml);
   };

    var _deleteEditLayers = function(editLayers){
        //删除图层上的对象 现状之外的图层 parent.currentLayerIdList现状图层guid
        var currentLayers = {};
        for (var i = parent.currentLayerIdList.length - 1; i >= 0; i--) {
            var lyId = parent.currentLayerIdList[i];
            currentLayers[lyId] = lyId;
        };
        if(editLayers){
            for(var layerID in editLayers){
                var layer = editLayers[layerID];
                if(layer && !currentLayers[layerID]){
                    var childCount = layer.GetObjCount();
                    for (var i = childCount - 1; i >= 0; i--) {
                        var obj = layer.GetObjAt(i);
                        if(obj){
                             //layer.DetachObject(obj);
                            //the method 'DetachObject' not existed any more after updating client at 2014-10-29
                            //using the method 'DetachWithDeleteObject' instead
                            layer.DetachWithDeleteObject(obj);
                        }
                    };
                    layer.EndUpdate();
                }
            }
        }
        //删除图层
        // for(var layerID in editLayers){
        //     var layer = editLayers[layerID];
        //     //删除方案相关图层 删除 道路红线图层 删除规划用地图层
        //     parent.planLayerIDs;
        //     //if(layer && !currentLayers[layerID]){
        //     if(layer){
        //         earth.DetachObject(layer);
        //     }
        // }
        // editLayers = {};
    };
    // endregion

    // region 显示方案
    var _getLayerIdsByPlanId = function (id) {
        var layerIds = [];
        var xml = "<QUERY><CONDITION><AND>" +
            "<ID tablename='CPPLAN'> ='" + id + "' </ID></AND></CONDITION>" +
            "<RESULT><CPPLAN><FIELD>LAYERIDS</FIELD></CPPLAN></RESULT>" +
            "</QUERY>";
        var res = _queryData(CITYPLAN_config.service.query, xml);
        if (res.length > 0) {
            layerIds = res[0]["CPPLAN.LAYERIDS"].split(",");
        }
        return layerIds;
    };
    //显示规划用地，道路红线
    var _getLayerIdByProId = function (projId, type) {

        var layerId = null;
        var xmlQuery = "<QUERY>" +
            "<CONDITION><AND><ID tablename='CPPROJECT'> ='" + projId + "' </ID></AND></CONDITION>" +
            "<RESULT><CPPROJECT><FIELD>$FIELD</FIELD></CPPROJECT></RESULT>" +
            "</QUERY>";
        if (type == "PARCEL") {
            xmlQuery = xmlQuery.replace("$FIELD", "PARCELLAYERID");
        } else if (type == "ROADLINE") {
            xmlQuery = xmlQuery.replace("$FIELD", "ROADLINELAYERID");
        }
        var res = _queryData(CITYPLAN_config.service.query, xmlQuery);
        if (res.length > 0) {
            if (type == "PARCEL") {
                layerId = res[0]["CPPROJECT.PARCELLAYERID"];
            } else if (type == "ROADLINE") {
                layerId = res[0]["CPPROJECT.ROADLINELAYERID"];
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
    var showCurrentLayers = function (bShow,treeId,parId) {
              return showCurrentLayers2(bShow, treeId, parId);


        var elistarray1=parent.currentLayerObjList[treeId];
        if(elistarray1){
            var count=elistarray1.length;
            for (var j = 0; j < count; j++){
                var elist=  elistarray1[j];
                var elistcount=   elist.Count;
                for (var jj = 0; jj < elistcount; jj++){

                var obj =elist.Items(jj);
                obj.Visibility = bShow;
                }
            }
        }else{
            var elistarray=[]; //cy:10.10
            var ids=parent.currentLayerIdList;//所有的现状图层id
            for(var i=0;i<ids.length;i++){
                var cid=ids[i];

              //  var currentlayer=parent.editLayers[cid];//从数据库图层中取出现状图层
		  var currentlayer=editLayers[cid];//从数据库图层中取出现状图层
                if(currentlayer){
                    var ploygonVects3=parent.ploygonLayersVcts3[parId];//规划用地的范围即使现状图层的范围，抠出现状图层的范围
                    if(ploygonVects3){
                        currentlayer.LayerIsPrior=false;
                      // cy 20150508
                        //cy:2015.12.25
                      //  var eList=currentlayer.ClipByRegion(ploygonVects3);
                        var eList=currentlayer.ClipByRegion(ploygonVects3 ,false);
                        if(eList!==null&&eList.Count>0){
                            parent.approveCurrentLayerId=treeId;
                            elistarray.push(eList);
                        }

                        var count=eList.Count;

                        for (var j = 0; j < count; j++){
                            var obj = eList.Items(j);
                            obj.Visibility = bShow;
                        }
                        projManager.centerObject=centerObject;
                        //cy:10.10
                        if(elistarray!=null&elistarray.length>0)  {
                        parent.currentLayerObjList[treeId]=elistarray;//存现状图层的obj对象，防止对此重复抠图
                        parent.parceLayerObj = elistarray;
                        }
                        //20150508
//                        var count=eList.Count;
//                        for (var j = 0; j < count; j++){
//                            var obj = eList.Items(j);
//                            obj.Visibility = bShow;
//                        }   projManager.centerObject=centerObject;
                    }
                    }
                }
            }
    parent.currentLayerChecked=bShow;
    };
    var showCurrentLayers2 = function (bShow,treeId,parId) {
        var modelList = parent.currentLayerObjList[treeId];
        if(modelList){
            for(var i in modelList){
                modelList[i].Visibility = bShow;
            }
        }else{
            var ids=parent.currentLayerIdList;//所有的现状图层id
            var ml = [];
            for(var i=0;i<ids.length;i++){
                var cid=ids[i];
                //var currentlayer=parent.editLayers[cid];//从数据库图层中取出现状图层
                var currentlayer=editLayers[cid];//从数据库图层中取出现状图层
                if(currentlayer){
                    var ploygonVects3=parent.ploygonLayersVcts3[parId];//规划用地的范围即使现状图层的范围，抠出现状图层的范围
                    if(ploygonVects3){
                        currentlayer.LayerIsPrior=false;
                        var eList = currentlayer.ClipByRegion(ploygonVects3,false);
                        if(eList != null && eList.Count > 0){
                            for(var j = 0, l = eList.Count;j < l;j++){
                                var model = eList.Items(j);
                                var r = earth.GeometryAlgorithm.GetModelPolygonRelationship(model.Guid, ploygonVects3);
                                if(r < 3){
                                    model.Visibility = bShow;
                                    ml.push(model);
                                }
                            }
                        }
                    }
                }
            }
            parent.currentLayerObjList[treeId] = ml;
        }

        parent.currentLayerChecked=bShow;
    };
    /**
     * 控制项目的显示、隐藏
     * @param projId //项目ID
     * @param bShow 已经创建的是否显示，未创建时不起作用
     * @param isCreatePlan 是否创建方案
     * @param isCreateParcel 是否创建规划用地
     * @param isCreateRoad 是否创建道路红线
     * @param isShow 以创建的方案,规划用地,道路红线是否显示
     */
    var showAll = function (projId, planId, bShow, isCreatePlan, isCreateParcel, isCreateRoad, isShow) {

        var project;
        var projData = getProjectData({id: projId});
        if (projData) {
            $.each(projData, function (i, pData) {
                project = pData;
            });
        } else {
            return;
        }
        var layerIds = [];
        var planData = getPlanData(project["CPPROJECT.ID"]);//方案
        if (planData.length && isCreatePlan) {
            $.each(planData, function (i, pData) {
                var planId_temp = pData["CPPLAN.ID"];
                var planLayers = _getLayerIdsByPlanId(planId_temp);
                if (planId == "all") {
                    if(planLayers && planLayers.length){
                        parent.planLayerIDs[planId_temp] = planLayers;
                    }
                    layerIds = layerIds.concat(planLayers);
                } else if (planId == planId_temp) {
                    if(planLayers && planLayers.length){
                        parent.planLayerIDs[planId_temp] = planLayers;
                    }
                    layerIds = layerIds.concat(planLayers);
                }
            });
        }
        var parcelData = project["CPPROJECT.PARCELLAYERID"]; //规划用地
        parent.planLayerIDs[parcelData] = parcelData;
        if (parcelData && isCreateParcel) {
            layerIds.push(parcelData);
        }
        var roadData = project["CPPROJECT.ROADLINELAYERID"];//道路红线
  parent.planLayerIDs[roadData] = roadData;
        if (roadData && isCreateRoad) {
            layerIds.push(roadData);
        }


        if (layerIds.length > 0) {
            if(planId && planId != "all"){
                //不同方案对应的所有图层id保存起来
                parent.planLayerIDs[planId] = layerIds;
            }
            $.each(layerIds, function (i, layerId) {//已经存在的，控制其显示隐藏
                //var layer = editLayers[layerId];
                // if(earth.LayerManager.GetLayerByGuid(layer)){
                //     alert("eret");
                // }
                var layer = editLayers[layerId];
                if (layer) {
                    layer.Visibility = bShow;
                    if(!bShow){
                        layer.Editable = bShow;
                    }
                }else{
                    parent.applyDataBaseRecords(bShow,layerId);
                }
            });
        }
    };
// endregion

// region 方案树初始化

    /**
     * 向数组插入方案记录，以及方案所属阶段的节点记录
     * @param res
     * @param projId 项目ID，方案所属阶段的节点的ID = 项目ID + 阶段编号
     * @param plan 方案数据：包含对象的数组或者对象
     * @param treeType 0：管理树，1：审批树
     */
    var _appendPlanData = function (res, projId, plan, treeType, passedPlanId,IsBasic,parcelData,roadData) {


        var planType = plan["CPPLAN.TYPE"];     // 1,2,3,4
        var planId=plan["CPPLAN.ID"];
        var stageNodeId = projId + sep + planType; // 方案所属阶段节点ID，由项目ID+阶段标识组成
        var stageExist = false;
        var i = 0;
        while (i < res.length) {
            if (res[i].id == stageNodeId) {
                stageExist = true;
                break;
            }
            i++;
        }
        var nodeIcon = "";
        if (treeType == 0) {
            nodeIcon = imgPathMgr + "stage" + planType + ".gif";
        } else if (treeType == 1) {
            nodeIcon = imgPathInves + "stage" + planType + ".gif";
        }
        if (!stageExist) {
            res.push({
                id: stageNodeId,
                pId: projId,
                name: CODEMAP.Stage[planType],
                icon: nodeIcon,
                nocheck: false,
                loadApprove: IsBasic,
                type: "STAGE"
            });
        }
        var isChecked=false;
        if(IsBasic){
            var checkedtArr=parent.checkedStatusList;
            for(var i=0;i<checkedtArr.length;i++){
                if(checkedtArr[i]===planId){
                    isChecked=true;
                    break;
                }
            }
        }else{
            if(!IsBasic){
                isChecked=(passedPlanId==planId);
            }
        }
        var planLayers = _getLayerIdsByPlanId(planId);
        res.push({
            id: planId,
            pId: stageNodeId,
            name: plan["CPPLAN.NAME"],
            nocheck: false,
            checked: isChecked,
            type: "PLAN",
            cId:planLayers,
            loadApprove: IsBasic,
            parcelId:parcelData,
            roadLine:roadData,
            projectId: projId
        });
    };
    var _appendBasicData = function (res, project) {
        if(parent.currentLayerIdList&&parent.currentLayerIdList.length>0){
            var parcelId=project["CPPROJECT.PARCELLAYERID"];
            var projId=project["CPPROJECT.ID"];
            var subjectNodeId=projId+sep+"03";
            var bExist = false;
            var i = 0;
            while (i < res.length) {
                if (res[i].id == subjectNodeId) {
                    bExist = true;
                    break;
                }
                i++;
            }
            if (!bExist) {
                res.push({
                    id: subjectNodeId,
                    pId: projId,
                    parcelId:parcelId,
                    name: '现状',
                    loadApprove: true,//cy：
                    checked: parent.currentLayerChecked,
                    type: "OLD",
                    projectId:projId,
                    nocheck: false
                });
            }
        }
    };
    /**
     * 向数组插入规划专题信息
     * @param res
     * @param projId
     * @param type "PARCEL"或者"ROADLINE"
     * @param treeType 0：管理树，1：审批树
     */
    var _appendSubjectData = function (res, projId, type, treeType,cId,IsBasic) {
        var subjectNodeId = projId + sep + "0";
        var nodeId = "";
        var nodeName = "";
        var nodeIcon = "";
        var bExist = false;
        var i = 0;
        while (i < res.length) {
            if (res[i].id == subjectNodeId) {
                bExist = true;
                break;
            }
            i++;
        }
        if (!bExist) {
            res.push({
                id: subjectNodeId,
                pId: projId,
                name: '项目专题',
                checked: false,
                type: "SUBJECT",
                loadApprove: IsBasic,//cy：
                nocheck: false
            });
        }

        if (type == "PARCEL") {
            nodeId = projId + sep + "01";
            nodeName = "规划用地";
            if (treeType == 0) {
                nodeIcon = imgPathMgr + "parcel.gif";
            } else if (treeType == 1) {
                nodeIcon = imgPathInves + "parcel.gif";
            }
        } else if (type == "ROADLINE") {
            nodeId = projId + sep + "02";
            nodeName = "道路红线";
            if (treeType == 0) {
                nodeIcon = imgPathMgr + "roadline.gif";
            } else if (treeType == 1) {
                nodeIcon = imgPathInves + "roadline.gif";
            }
        }
        var checkedtArr=parent.checkedStatusList;
        var isChecked=false;
        for(var i=0;i<checkedtArr.length;i++){
            if(checkedtArr[i]===nodeId){
                isChecked=true;
                break;
            }
        }
        res.push({
            id: nodeId,
            pId: subjectNodeId,
            name: nodeName,
            icon: nodeIcon,
            type: type,
            checked:isChecked,
            projectId: projId,
            cId:cId,
            loadApprove: IsBasic,
            nocheck: false
        });
    };
    /**
     * 查询项目ID对应的审批会议
     * @param projId
     * @returns {Array}
     * @private
     */
    var _getConferenceData = function (projId) {
        var parcelQueryXml =
            '<QUERY><CONDITION><AND>' +
                '<PROJECTID tablename = "CPCONFERENCE">=\'' + projId + '\'</PROJECTID>' +
                '</AND></CONDITION>' +
                '><RESULT><CPCONFERENCE><FIELD>PASSEDPLANID</FIELD></CPCONFERENCE></RESULT>' +
                '</QUERY>';
        return _queryData(CITYPLAN_config.service.query, parcelQueryXml);
    };
    var getAllConferenceData = function (projId) {
        var parcelQueryXml =
            '<QUERY><CONDITION><AND>' +
                '<PROJECTID tablename = "CPCONFERENCE">=\'' + projId + '\'</PROJECTID>' +
                '</AND></CONDITION>' +
                '><RESULT><CPCONFERENCE></CPCONFERENCE></RESULT>' +
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
                '<PROJECTID tablename = "CPPARCEL">=\'' + projId + '\'</PROJECTID>' +
                '</AND></CONDITION>' +
                '<RESULT><CPPARCEL></CPPARCEL></RESULT>' +
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
                '<PROJECTID tablename = "CPROADLINE">=\'' + projId + '\'</PROJECTID>' +
                '</AND></CONDITION>' +
                '<RESULT><CPROADLINE></CPROADLINE></RESULT>' +
                '</QUERY>';
        return _queryData(CITYPLAN_config.service.query, roadQueryXml);
    };
    /**
     * 向数组插入项目记录
     * @param res
     * @param project 项目数据：包含对象的数组或者对象
     */
    var appendProjectData = function (res, project, approveProIdList, IsBasic) {

        var projId = project["CPPROJECT.ID"];
        var proStatus = project["CPPROJECT.STATUS"];
        var proName = project["CPPROJECT.NAME"];
        var IsApprove = false;
        if (approveProIdList && approveProIdList.length) {
            for (var i = 0; i < approveProIdList.length; i++) {//多审批处理
                var approveproid = approveProIdList[i];
                if (projId == approveproid) {
                    proName += "(审批中...)";
                    IsApprove = true;
                    break;
                }
            }
        }

        var pIdVal = -1;
        if (proStatus == 1) {//待审
            pIdVal = -2;
            if(!IsApprove){
            }
        }
        var parcelData = project["CPPROJECT.PARCELLAYERID"]; //_getParcelData(projId);
        res.push({
            id: projId,
            pId: pIdVal,
            parcelId:parcelData,
            name: proName,
            icon: imgPathMgr + "stage" + project["CPPROJECT.STAGE"] + ".gif",
            approve: IsApprove,
            expand: !IsApprove,
            nocheck: IsApprove,
            open:IsBasic,
            //checked:!IsApprove,
            loadApprove: IsBasic,
            type: "PROJECT"
        });
        if (parcelData) {
            _appendSubjectData(res, projId, "PARCEL", 0,parcelData,IsBasic);
        }
        var roadData = project["CPPROJECT.ROADLINELAYERID"];//_getRoadLineData(projId);
        if (roadData) {
            _appendSubjectData(res, projId, "ROADLINE", 0,roadData,IsBasic);
        }
        var passedPlanId = null;
        var conferenceData = _getConferenceData(projId);//查询已审批通过的方案
        if(proStatus == 1){//已经审批的项目 才会勾选通过的方案
            if (conferenceData.length) {
                $.each(conferenceData, function (i, passedPlanData) {
                    passedPlanId = passedPlanData["CPCONFERENCE.PASSEDPLANID"];//审批通过方案ID
                    if(passedPlanId){
                        if(!IsApprove&&!IsBasic){
                            showAll(projId, passedPlanId, true, true, false, false, true);//显示已勾选或者以审批通过的方案
                        }
                    }
                });
            }
        }
        var planData = getPlanData(projId);
        if (planData.length) {
            $.each(planData, function (i, pData) {
                _appendPlanData(res, projId, pData, 0, passedPlanId,IsBasic,parcelData,roadData);
            });
        }
        if (IsBasic) {
            _appendBasicData(res, project);
        }
    };
    var checkedPlan=function(projData){
        $.each(projData, function (i, pData) {
            var status = pData["CPPROJECT.STATUS"];
            if (status == 1) {
                var projId = pData["CPPROJECT.ID"];
                var conferenceData = _getConferenceData(projId);
                if (conferenceData.length == 1) {
                    parent.checkedStatusList.push(conferenceData[0]["CPCONFERENCE.PASSEDPLANID"]);
                }
            }
        });
    }
    var getAllPassedPlan=function(){
        var projData = getProjectData({status: 1});
        if (projData) {
            $.each(projData, function (i, pData) {
                var projId = pData["CPPROJECT.ID"];
 var parcelID = pData["CPPROJECT.PARCELLAYERID"];
                var passedPlanId = null;
                var conferenceData = _getConferenceData(projId);
                if (conferenceData.length == 1) {
                    passedPlanId = conferenceData[0]["CPCONFERENCE.PASSEDPLANID"];
                    showAll(projId, passedPlanId, true, true, false, false, true);//显示已勾选或者以审批通过的方案
 if(passedPlanId){
                        passedPlanObj[projId] = passedPlanId;
                    }
                }
                //隐藏现状
                if(parcelID){
                    if(!parent.editLayers[parcelID]){
                        parent.applyDataBaseRecords(false, parcelID, true);
                    }
                }
            });
        }
    }
// endregion

// region 项目导入

    /**
     * 根据文件夹创建OgrDataSource
     * @param folder shp数据所在的文件夹
     * @return {*}
     * @private
     */
    var _getOgrDataSource = function (folder) {
        var dSource = null;
        if (dataProcess) {
            dataProcess.Load();
            var ogrDataProcess = dataProcess.OGRDataProcess;
            var driver = ogrDataProcess.GetDriverByType(44);   // SEOGRRegisterDriverType.Shape
            dSource = driver.Open(folder, 0);
        }
        return dSource;
    };
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
            throw {name: "参数错误", message: "需要传入一个空间参考文件的路径"};
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
                        // params changed after updating client at 2014-10-29
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
                        // params changed after updating client at 2014-10-29
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
    var _insertParcel = function (layer, datum, layerId) {
        if (layer != null && datum != null) {
            for (var i = 0; i < layer.GetFeatureCount(); i++) {
                var feature = layer.GetFeature(i);
                var geoType = feature.GetGeometryType();

                if (geoType == 3 || geoType == 403) {    // SEWkbGeometryType.SEWkbPolygon
                    var vec3s = earth.Factory.CreateVector3s();
                    var polygon = feature.GetPolygon();
                    var line = polygon.GetExteriorRing();
                    var sePolygon = earth.Factory.CreatePolygon();
                    for (var j = 1; j < line.GetPointsCount(); j++) {
                        var point = line.GetPoint(j);
                        var sePoint = datum.src_xy_to_des_BLH(point.X, point.Y, point.Z || 0);
                          // var altitude = earth.Measure.MeasureTerrainAltitude(sePoint.X, sePoint.Y, false);
                        // params changed after updating client at 2014-10-29
                        var altitude = earth.Measure.MeasureTerrainAltitude(sePoint.X, sePoint.Y);
			 vec3s.Add(sePoint.X, sePoint.Y, altitude);
                    }

                    if (vec3s.Count > 0) {
                        sePolygon.AddRing(vec3s);
                        var parcel = new CITYPLAN.CityPlanParcel(feature);

                        var styleinfo = earth.Factory.CreateStyleInfo();
                        styleinfo.LineWidth = 1;
                        styleinfo.LineColor = 0xccd90c00;
                        styleinfo.FillColor = 0xaaffbf7f;
                        var stylelist = earth.Factory.CreateStyleInfoList();
                        stylelist.AddItem(styleinfo);

                        var info = earth.Factory.CreateDbEleInfo(parcel.getId(), parcel.getName());
                        info.DrawOrder = 1000;
                        info.Type = 5;     // SEObjectType.PolygonObject
                        info.StyleInfoList = stylelist;
                        info.SphericalVectors.Add(vec3s);
                        info.SphericalTransform.SetLocation(sePolygon.GetCenterPoint());
                        info.AltitudeType = 1;   // SEAltitudeType.ClampToTerrain;

                        var infolist = earth.Factory.CreateDbEleInfoList();
                        infolist.AddItem(info);

                       earth.DatabaseManager.AddElementListInLayer(CITYPLAN_config.server.dataServerIP,layerId, infolist);
                        parcel.saveToDB();
                    }
                }
            }
        }
    };
    var _insertRoadLine = function (layer, datum, layerId) {
        if (layer != null && datum != null) {
            for (var i = 0; i < layer.GetFeatureCount(); i++) {
                var feature = layer.GetFeature(i);
                var geoType = feature.GetGeometryType();

                if (geoType == 2 || geoType == 402) {    // SEWkbGeometryType.SEWkbLineString
                    var vec3s = earth.Factory.CreateVector3s();
                    var line = feature.GetLineString();

                    for (var j = 0; j < line.GetPointsCount(); j++) {
                        var point = line.GetPoint(j);
                        var sePoint = datum.src_xy_to_des_BLH(point.X, point.Y, point.Z || 0);
                        // var altitude = earth.Measure.MeasureTerrainAltitude(sePoint.X, sePoint.Y, true);
                        // params changed after updating client at 2014-10-29
                        var altitude = earth.Measure.MeasureTerrainAltitude(sePoint.X, sePoint.Y);
			 vec3s.Add(sePoint.X, sePoint.Y, altitude);
                    }

                    if (vec3s.Count > 0) {
                        var roadLine = new CITYPLAN.CityPlanRoadLine(feature);
                        var info = earth.Factory.CreateDbEleInfo(roadLine.getId(), roadLine.getName());
                        var infolist = earth.Factory.CreateDbEleInfoList();
                        var styleinfo = earth.Factory.CreateStyleInfo();
                        var stylelist = earth.Factory.CreateStyleInfoList();

                        styleinfo.LineWidth = 1;
                        styleinfo.LineColor = 3436776448;  // 0xccd90c00
                        stylelist.AddItem(styleinfo);

                        info.DrawOrder = 1000;
                        info.Type = 4;     // SEObjectType.PolylineObject
                        info.StyleInfoList = stylelist;
                        info.SphericalVectors.Add(vec3s);

                        var x = 0;
                        var y = 0;
                        for (var k = 0; k < vec3s.Count; k++) {
                            x += vec3s.Items(k).X;
                            y += vec3s.Items(k).Y;
                        }
                        x = x / vec3s.Count;
                        y = y / vec3s.Count;
                        // var z = earth.Measure.MeasureTerrainAltitude(x, y, false);
                        // params changed after updating client at 2014-10-29
                        var z = earth.Measure.MeasureTerrainAltitude(x, y);
		       var centerPoint = earth.Factory.CreateVector3();
                        centerPoint.SetValue(x, y, z);
                        info.SphericalTransform.SetLocation(centerPoint);
                        info.AltitudeType = 1;   // SEAltitudeType.ClampToTerrain;
                        infolist.AddItem(info);

                         earth.DatabaseManager.AddElementListInLayer(CITYPLAN_config.server.dataServerIP,layerId, infolist);
                        roadLine.saveToDB();
                    }
                }
            }
        }
    };
    var _insertPlanData = function (layer, datum, layerId) {
        if (layer != null && datum != null) {
            for (var i = 0; i < layer.GetFeatureCount(); i++) {
                var feature = layer.GetFeature(i);
                var geoType = feature.GetGeometryType();

                if (geoType == 3 || geoType == 403) {    // SEWkbGeometryType.SEWkbPolygon
                    var vec3s = earth.Factory.CreateVector3s();
                    var polygon = feature.GetPolygon();
                    var line = polygon.GetExteriorRing();
                    var sePolygon = earth.Factory.CreatePolygon();
                    for (var j = 0; j < line.GetPointsCount(); j++) {
                        var point = line.GetPoint(j);
                        var sePoint = datum.src_xy_to_des_BLH(point.X, point.Y, point.Z || 0);
                               // var altitude = earth.Measure.MeasureTerrainAltitude(sePoint.X, sePoint.Y, false);
                        // params changed after updating client at 2014-10-29
                        var altitude = earth.Measure.MeasureTerrainAltitude(sePoint.X, sePoint.Y);
                        vec3s.Add(sePoint.X, sePoint.Y, altitude);
                    }

                    if (vec3s.Count > 0) {
                        var guid = earth.Factory.CreateGUID();
                        var index = feature.GetFieldIndex("NAME");
                        var name = feature.GetFieldAsString(index);

                        index = feature.GetFieldIndex("HEIGHT");
                        var height = feature.GetFieldAsDouble(index);

                        index = feature.GetFieldIndex("MARK");
                        var colorMark = feature.GetFieldAsString(index);
                        var color = CITYPLAN_config.BoxColor[colorMark];

                        var info = earth.Factory.CreateDbEleInfo(guid, name);
                        var infolist = earth.Factory.CreateDbEleInfoList();
                        var styleinfo = earth.Factory.CreateStyleInfo();
                        var stylelist = earth.Factory.CreateStyleInfoList();

                        sePolygon.AddRing(vec3s);

                        styleinfo.LineWidth = 1;
                        styleinfo.LineColor = 0xccd90c00;
                        styleinfo.FillColor = color;   //0xaaffbf7f;
                        stylelist.AddItem(styleinfo);

                        info.DrawOrder = 1000;
                        info.Type = 7;    // SEObjectType.ElementVolumeObject
                        info.StyleInfoList = stylelist;
                        info.SphericalVectors.Add(vec3s);
                        info.SphericalTransform.SetLocation(sePolygon.GetCenterPoint());

                        info.height = height;
                        info.AltitudeType = 1;   // SEAltitudeType.ClampToTerrain
                        infolist.AddItem(info);

                       earth.DatabaseManager.AddElementListInLayer(CITYPLAN_config.server.dataServerIP,layerId, infolist);
                    }
                }
            }
        }
    };
    /**
     * Event.OnEditDatabaseFinished事件处理函数
     * @param pRes 包含ExcuteType属性，标识处理操作类型
     * @param pLayer ISEDatabaseLayer
     */
    var onAddLayerInDatabase = function (pRes, pLayer) {
        if (pRes.ExcuteType != 1 || !pLayer) {   // SEDatabaseExcuteType.AddLayer
            return;
        }
        var obj = addedLayerInfo[pLayer.Guid];
        if (!obj) {
            return;
        }
        var type = obj["type"];
        // shp类型数据
        var ogrLayer = obj["layer"];
        var datum = obj["datum"];
        // 模型类型数据
        var path = obj["path"];
        var folderName = obj["folder"];
        switch (type) {
            case "parcel":
                _insertParcel(ogrLayer, datum, pLayer.Guid);
                break;
            case "roadline":
                _insertRoadLine(ogrLayer, datum, pLayer.Guid);
                break;
            case "simplebuilding":
                _insertSimpleBuilding(ogrLayer, datum, pLayer.Guid);
                break;
            case "greenland":
                _insertGreenland(ogrLayer, datum, pLayer.Guid);
                break;
            case "buildingmodel":
                _insertModels(path, folderName, pLayer.Guid);
                break;
            case "groundmodel":
                _insertModels(path, folderName, pLayer.Guid);
                break;
            case CITYPLAN_config.constant.g_boxLayerName:    // 控规盒数据
                _insertPlanData(ogrLayer, datum, pLayer.Guid);
                break;
        }
    };

    /**
     * 导入方案目录下的地面模型
     * @param planPath 方案文件夹，其中包含方案信息、建筑属性和空间参考文件以及地面模型子文件夹
     * @private
     */
    var _importGroundModel = function (planPath, layerIdArr) {
        var guid = earth.Factory.CreateGUID(), param, name = "GroundModel";
        earth.Event.OnEditDatabaseFinished = onAddLayerInDatabase;
        addedLayerInfo[guid] = {};
        addedLayerInfo[guid]["type"] = "groundmodel";
        addedLayerInfo[guid]["path"] = planPath;
        addedLayerInfo[guid]["folder"] = CITYPLAN_config.constant.GroundModelFolderName;
        param = _createParam(guid, name, 1);   // SEObjectType.ModelObject
        earth.DatabaseManager.AddLayerInDatabase(CITYPLAN_config.server.dataServerIP,param);
        layerIdArr.push(guid);
    };
    /**
     * 导入方案目录下的建筑模型
     * @param planPath 方案文件夹，其中包含方案信息、建筑属性和空间参考文件以及建筑模型子文件夹
     * @private
     */
    var _importBuildingModel = function (planPath, layerIdArr) {
        var guid = earth.Factory.CreateGUID(), param = null, name = "BuildingModel";
        var xmlBuildings = earth.UserDocument.LoadXmlFile(planPath + "\\" + CITYPLAN_config.constant.BuildingAttributeFileName);
        $.post(CITYPLAN_config.service.add, xmlBuildings, function (data) {    // 插入建筑物信息
            earth.Event.OnEditDatabaseFinished = onAddLayerInDatabase;
            addedLayerInfo[guid] = {};
            addedLayerInfo[guid]["type"] = "buildingmodel";
            addedLayerInfo[guid]["path"] = planPath;
            addedLayerInfo[guid]["folder"] = CITYPLAN_config.constant.BuildingModelFolderName;
            param = _createParam(guid, name, 1);   // SEObjectType.ModelObject
            earth.DatabaseManager.AddLayerInDatabase(CITYPLAN_config.server.dataServerIP,param);
        }, "text");
        layerIdArr.push(guid);
    };
    /**
     * 导入方案目录下的建筑物和绿地,为每个shp文件创建一个空间图层，记录这些图层的id
     * @param planPath 方案文件夹
     * @param layerIdArr
     * @private
     */
    var _importSimpleBuildingAndGreen = function (planPath, layerIdArr) {
        var guid = "", name = "", param = null;
        var dataSource = _getOgrDataSource(planPath);
        var datum = _createDatum(planPath);
        for (var i = 0; i < dataSource.GetLayerCount(); i++) {
            var ogrLayer = dataSource.GetLayer(i);
            var type = ogrLayer.GetGeometryType();
            guid = earth.Factory.CreateGUID();

            if (type == 3 || type == 403) {
                if (/建筑/.test(ogrLayer.Name)) {
                    earth.Event.OnEditDatabaseFinished = onAddLayerInDatabase;

                    name = "SimpleBuilding";
                    addedLayerInfo[guid] = {};
                    addedLayerInfo[guid]["type"] = "simplebuilding";
                    addedLayerInfo[guid]["layer"] = ogrLayer;
                    addedLayerInfo[guid]["datum"] = datum;
                    param = _createParam(guid, name, 8);   // SEObjectType.SimpleBuildingObject
                   earth.DatabaseManager.AddLayerInDatabase(CITYPLAN_config.server.dataServerIP,param);
                    layerIdArr.push(guid);
                } else if (/绿地/.test(ogrLayer.Name)) {
                    earth.Event.OnEditDatabaseFinished = onAddLayerInDatabase;

                    name = "GreenLand";
                    addedLayerInfo[guid] = {};
                    addedLayerInfo[guid]["type"] = "greenland";
                    addedLayerInfo[guid]["layer"] = ogrLayer;
                    addedLayerInfo[guid]["datum"] = datum;
                    param = _createParam(guid, name, 7);     // SEObjectType.ElementVolumeObject);
                   earth.DatabaseManager.AddLayerInDatabase(CITYPLAN_config.server.dataServerIP,param);
                    layerIdArr.push(guid);
                }
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
    /**
     * 导入控规数据
     */
    var importPlanData = function () {
        var fileFullPath = earth.UserDocument.OpenFileDialog("", "*.shp|*.SHP"); // 文件完整路径
        if (fileFullPath) {
            _importPlanData(splitFilePath(fileFullPath)[0]);
        }
    };
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
        parcelPloygonVcts3={};//清空规划用地范围
        /* var proIdList=[];
         if(projectNode&&projectNode.length){
         for(var i=0;i<projectNode.length;i++){
         var node=projectNode[i];
         if(node.text){
         proIdList.push(node.text);
         }
         }
         }
         proIdList.push(systemData.id);
         earth.UserDocument.DeleteXmlFile(configPath);
         var newXML=initApproveXML(proIdList);
         earth.UserDocument.SaveXmlFile(rootPath,newXML);*/
    }
    var initApproveXML = function (data) {
        var configXml = '<xml>';
        configXml = configXml + '<Project></Project>'; //project
        /*if (data && data.length) {
            for (var i = 0; i < data.length; i++) {
                configXml = configXml + '<Project>' + data[i] + '</Project>'; //project
            }
        }*/
        configXml = configXml + '</xml>';
        return configXml;
    }
    var cancelApproveProject=function(){
        var projectIds = loadApproveXML();
        if (projectIds) {
            if (typeof(projectIds) == "string") {
                var projData = getProjectData({id: projectIds});
                if (projData) {
                    $.each(projData, function (i, pData) {
                        var proStatu=pData["CPPROJECT.STATUS"];
                        if(proStatu==1){
                            saveApproveXML({id:""});
                        }
                    });
                }
            }
        }else{
            parent.setBtnDisabled(true,"#heightChangeDIV");
        }

    }
    //获取项目路径
    var getRootPath=function(){
        var pathName=window.document.location.pathname;
        var localhost=window.location.host;
        var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
        return(localhost+projectName);
    }
    var updateConference = function(proId,planId,date,p,d){
        var xml ='<CPCONFERENCE>' +
            '<CONDITION>' +
            '<PROJECTID>=\''+proId+'\'</PROJECTID>' +
            '</CONDITION>' +
            '<CONTENT>' +
            '<PASSEDPLANID>'+planId+'</PASSEDPLANID>' +
            '<CONFDATE>'+date+'</CONFDATE>' +
            '<STAFF>'+p+'</STAFF>' +
            '<DETAIL>'+d+'</DETAIL>' +
            '<STAGE>'+4+'</STAGE>' +
            '</CONTENT>' +
            '</CPCONFERENCE>';
        $.post(CITYPLAN_config.service.update, xml);
    }
    var saveConference = function(proId,planId,date,p,d){
        var xml ='<CPCONFERENCE>' +
            '<PROJECTID>'+proId+'</PROJECTID>' +
            '<PASSEDPLANID>'+planId+'</PASSEDPLANID>' +
            '<CONFDATE>'+date+'</CONFDATE>' +
            '<STAFF>'+p+'</STAFF>' +
            '<DETAIL>'+d+'</DETAIL>' +
            '<STAGE>'+4+'</STAGE>' +
            '</CPCONFERENCE>';
        $.post(CITYPLAN_config.service.add, xml, function(data){
            if (/true/.test(data)) {
            }  else{
               alert("保存失败！");
            }
        }, "text");
    }

 	var centerObject = function (obj) {
        var lonlat = obj.GetLonLatRect();
        var north = lonlat.North;
        var south = lonlat.South;
        var east = lonlat.East;
        var west = lonlat.West;
        var top_height = lonlat.MaxHeight;
        var bottom_height = lonlat.MinHeight;
        var MaxValue = 0;
        if (Math.abs(north - south) > Math.abs(east - west)) {
            MaxValue = Math.abs(north - south) * 100000;
        }
        else {
            MaxValue = Math.abs(east - west) * 100000;
        }
        if (MaxValue < Math.abs(top_height - bottom_height)) {
            MaxValue = Math.abs(top_height - bottom_height);
        }
        earth.SelectSet.Clear();
        earth.SelectSet.Add(obj.Guid);
        earth.GlobeObserver.GotoLookat((east + west) / 2, (north + south) / 2, (top_height + bottom_height) / 2, 0, 45, 0, MaxValue * 3);
    }

    var changeHeight=function(heightValue,layerIds,editLayers){
        var eObjList=[];
        if(layerIds.length){
            for(var i=0;i<layerIds.length;i++){
                if(editLayers[layerIds[i]]){
                    var count=editLayers[layerIds[i]].GetObjCount();
                    var oldEditable=editLayers[layerIds[i]].Editable;
                    if(editLayers[layerIds[i]].Editable==false){
                        editLayers[layerIds[i]].Editable=true;
                    }
                    editLayers[layerIds[i]].BeginUpdate();
                    if(count>0){
                        for (var j = count - 1; j >= 0; j--){
                            var eObj = editLayers[layerIds[i]].GetObjAt(j);
                            if (eObj != null && eObj.SphericalTransform != null)
                            {
                                var loc = eObj.SphericalTransform.GetLocation();
                                loc.Z = loc.Z + parseFloat(heightValue);
                                eObj.SphericalTransform.SetLocation(loc);
                                eObjList.push(eObj);
                            }
                        }
                    }
                    editLayers[layerIds[i]].EndUpdate();
                    editLayers[layerIds[i]].Editable=oldEditable;
                }
            }
            if(eObjList.length){// 数据库更新
                for(var e=0;e<eObjList.length;e++){
                    var eObj=eObjList[e];
                    parent.editTool.updateChangeHeightObject(eObj);
                }
            }
        }
    }

    /**
     * 根据审批树设置按钮状态
     * @return {[type]} [description]
     */
    var checkButtonStatus_bak = function(treeObj, node){


        var zTree = treeObj;
        if(zTree && zTree.getNodeIndex(node) >= 0){
         var eventObj = top.$("#planCheckTag");//总评审核
            var planViewPointObj = top.$("div.toolbar-item[tag='planViewPoint']");//方案视点
          var buildingAttributeObj = top.$("#buildingAttribute");//建筑属性
            var SchemeindexInfoDIVObj = top.$("#SchemeindexInfoDIV");//指标查看
            if(node.level === 3 && node.getParentNode().name === CODEMAP.Stage[4] && node.checked){
//               eventObj.removeAttr("disabled");
//                parent.setBtnDisabled(false,"#planCheckTag");//cy:加 总平图查看 不可见
                // planViewPointObj.removeAttr("disabled");
            }else{
//                eventObj.attr("disabled", "disabled");
                parent.setBtnDisabled(true,"#planCheckTag");//cy:加 总平图查看 不可见
                if(eventObj.hasClass("selected") ){
                    eventObj.removeClass("selected");
                    //关闭"总评审核"的选中状态
                    var ifEarthDoc =top.$("#ifEarth");
                    $("#earthDiv0",ifEarthDoc).css("width","100%");   //根据iframename取得其中ID为"earthDiv0"元素

                    top.$("#dlgScreen2D").dialog({}).dialog("close");
                    top.$("#ifScreen2D").attr("src", "");


                }




                eventObj.removeClass("selected");
                // planViewPointObj.attr("disabled", "disabled");
                // planViewPointObj.removeClass("selected");
                var ifEarthDoc = top.window.ifEarth.document;
                top.$("#earthDiv0",ifEarthDoc).css("width","100%");
            }

            //是否勾选
            if(node.checked){
                if(zTree.getSelectedNodes() && zTree.getSelectedNodes()[0] && (zTree.getSelectedNodes()[0].id == node.id)){
                    planViewPointObj.removeAttr("disabled");
//                    buildingAttributeObj.removeAttr("disabled");
                    parent.setBtnDisabled(false, "#buildingAttribute");//cy:加建筑属性查看可见
                 //   SchemeindexInfoDIVObj.removeAttr("disabled");
                   parent.setBtnDisabled(false,"#SchemeindexInfoDIV");//cy:加方案指标查看可见
                    parent.setBtnDisabled(false,"#indexInvestigateDIV");//cy:加指标比对可见
                    parent.setBtnDisabled(false,"#planCheckTag");//cy:加 总平图查看 可见
                }else{
                    planViewPointObj.attr("disabled", "disabled");
                    planViewPointObj.removeClass("selected");
//                    buildingAttributeObj.attr("disabled", "disabled");
                    parent.setBtnDisabled(true, "#buildingAttribute");//cy:加建筑属性查看可见
                    buildingAttributeObj.removeClass("selected");
//                    SchemeindexInfoDIVObj.attr("disabled", "disabled");
                    parent.setBtnDisabled(true,"#SchemeindexInfoDIV");//cy:加指标查看可见
                    parent.setBtnDisabled(true,"#indexInvestigateDIV");//cy:加指标比对可见

//                    SchemeindexInfoDIVObj.removeClass("selected");
                }
            }

            //是否选中

            if(zTree==null){return;}//cy
            if(zTree.getSelectedNodes() && (zTree.getSelectedNodes()[0])){
                if(node.checked && (zTree.getSelectedNodes()[0].id == node.id)){
                    planViewPointObj.removeAttr("disabled");
//                    buildingAttributeObj.removeAttr("disabled");
                    parent.setBtnDisabled(false, "#buildingAttribute");//cy:加建筑属性查看可见
//                    SchemeindexInfoDIVObj.removeAttr("disabled");
                    parent.setBtnDisabled(false,"#SchemeindexInfoDIV");//cy:加指标查看可见
                    parent.setBtnDisabled(false,"#indexInvestigateDIV");//cy::加指标比对可见

                }else{
                    planViewPointObj.attr("disabled", "disabled");
                    planViewPointObj.removeClass("selected");
//                    buildingAttributeObj.attr("disabled", "disabled");
//                    buildingAttributeObj.removeClass("selected");
                    parent.setBtnDisabled(true, "#buildingAttribute");//cy:加建筑属性查看可见
//                    SchemeindexInfoDIVObj.attr("disabled", "disabled");
                    parent.setBtnDisabled(true,"#SchemeindexInfoDIV");//cy:加指标查看可见
                    parent.setBtnDisabled(true,"#indexInvestigateDIV");//cy:加指标比对可见
//                    SchemeindexInfoDIVObj.removeClass("selected");
                }
		            }
        }
    };




    /**cy
     * 根据审批树设置按钮状态
     * @return {[type]} [description]
     */
    var checkButtonStatus = function(treeObj, node){

        var zTree = treeObj;
        if(zTree && zTree.getNodeIndex(node) >= 0){
            var eventObj = top.$("#planCheckTag");//总评审核
            var planViewPointObj = top.$("div.toolbar-item[tag='planViewPoint']");//方案视点
            if(node.level === 3 && node.getParentNode().name === CODEMAP.Stage[4] && node.checked){
//               eventObj.removeAttr("disabled");
//                parent.setBtnDisabled(false,"#planCheckTag");//cy:加 总平图查看 不可见
                // planViewPointObj.removeAttr("disabled");
            }else{

                parent.setBtnDisabled(true,"#planCheckTag");//cy:加 总平图查看 不可见
                parent.setBtnDisabled(true,"#heightControlDIV");//cy:加 控高分析 不可见
                parent.setBtnDisabled(true,"#roadDistanceDIV");//cy:加 红线分析 不可见


                }



            }

            //是否勾选
            if(node.checked){
                if(zTree.getSelectedNodes() && zTree.getSelectedNodes()[0] && (zTree.getSelectedNodes()[0].id == node.id)){
                    planViewPointObj.removeAttr("disabled");
                    parent.setBtnDisabled(false, "#buildingAttribute");//cy:加建筑属性查看可见
                    parent.setBtnDisabled(false,"#SchemeindexInfoDIV");//cy:加方案指标查看可见
                    parent.setBtnDisabled(false,"#indexInvestigateDIV");//cy:加指标比对可见
                    parent.setBtnDisabled(false,"#planCheckTag");//cy:加 总平图查看 可见
                }else{
                    planViewPointObj.attr("disabled", "disabled");
                    planViewPointObj.removeClass("selected");
                    parent.setBtnDisabled(true, "#buildingAttribute");//cy:加建筑属性查看可见
                    parent.setBtnDisabled(true,"#SchemeindexInfoDIV");//cy:加指标查看可见
                    parent.setBtnDisabled(true,"#indexInvestigateDIV");//cy:加指标比对可见
                }
            }

            //是否选中
        if(zTree==null){return;}   //cy
            if(zTree.getSelectedNodes() && (zTree.getSelectedNodes()[0])){
                if(node.checked && (zTree.getSelectedNodes()[0].id == node.id)){
                    planViewPointObj.removeAttr("disabled");
                    parent.setBtnDisabled(false, "#buildingAttribute");//cy:加建筑属性查看可见
                    parent.setBtnDisabled(false,"#SchemeindexInfoDIV");//cy:加指标查看可见
                    parent.setBtnDisabled(false,"#indexInvestigateDIV");//cy::加指标比对可见

                }else{
                    planViewPointObj.attr("disabled", "disabled");
                    planViewPointObj.removeClass("selected");
                    parent.setBtnDisabled(true, "#buildingAttribute");//cy:加建筑属性查看可见
                    parent.setBtnDisabled(true,"#SchemeindexInfoDIV");//cy:加指标查看可见
                    parent.setBtnDisabled(true,"#indexInvestigateDIV");//cy:加指标比对可见

                }
            }

    };

    var checkAttachmeng = function(){
        //"附件查看"按钮
        var fujianObj = top.$("div.toolbar-item[tag='attachmentTag']");
        fujianObj.removeAttr("disabled");
    }

// endregion

// region 公共接口
projManager.checkButtonStatus = checkButtonStatus;
projManager.getProjectData = getProjectData;
projManager.getPlanData = getPlanData;
projManager.getPlanById = getPlanById;
projManager.getPlanIndex = getPlanIndex;
projManager.getAllProjectDate = getAllProjectDate;
projManager.getProjectYDXZ=getProjectYDXZ;
projManager.getRoadLineData=_getRoadLineData;
projManager.getBuildingDataByPlanId=getBuildingDataByPlanId;
projManager.updateStatus = updateStatus;
projManager.locateToLayer = locateToLayer;
projManager.locateToLayerAndRotate = locateToLayerAndRotate;
projManager.getSep = getSep;
projManager.getLayerIdsByPlanId = _getLayerIdsByPlanId;

projManager.appendProjectData = appendProjectData;                           // 为管理树添加项目数据
projManager.importPlanData = importPlanData;
projManager.deleteProject = deleteProject;
projManager.deletePlan = deletePlan;

projManager.checkedPlan=checkedPlan;
projManager.IsValid = IsValid;
projManager.showAll = showAll;
projManager.showCurrentLayers = showCurrentLayers;
projManager.getAllPassedPlan=getAllPassedPlan;

projManager.loadApproveXML = loadApproveXML;
projManager.saveApproveXML = saveApproveXML;

projManager.getAllConferenceData=getAllConferenceData;
projManager.saveConference=saveConference;
projManager.updateConference=updateConference;

projManager.centerObject=centerObject;

projManager.cancelApproveProject=cancelApproveProject;

projManager.changeHeight=changeHeight;
projManager.clearEditLayers = clearEditLayers;
projManager.getEditLayers = getEditLayers;

projManager.getProjectJZXG  =   getProjectJZXG;
// endregion

return projManager;
}
;