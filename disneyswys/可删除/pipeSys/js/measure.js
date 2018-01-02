
/**
 * 功能：清除测量结果
 * 参数：无
 * 返回值：无
 */
var clearMeasureResult = function() {
    earth.Measure.Clear();
};

/**
 * 功能：显示测量结果
 * 参数：result-测量结果; type-测量类型(1为空间距离测量，2为地表距离测量，3为垂直距离测量，4为投影面积测量，5为水平距离测量)
 * 返回值：无
 */
var bolonArr = [];
var SurfaceAreaResult;
var showMeasureResult = function(result, type) {
    /*if(result == 0){
		clearMeasureResult();
		return;
	}*/
    var unit = "";
    var title = "";
    if (type === 4) { //投影面积测量
        unit = "平方千米";
        if (result < 1) {
            result = result * 1000000;
            unit = "平方米";
        }
        title = "水平面积为：";
    } else if (type >= 300 && type < 400) {
        unit = "米";
        if (type === 300) {
            //title = "管线相交,管间水平距离为：";
            title = "管间水平距离为：";
        } else if (type === 301) {
            //title = " 管线不相交, 管间水平距离为：";
            title = "管间水平距离为：";
        } else if (type === 302) {
            //title = " 管线相交,管间垂直距离为：";
            title = "管间垂直距离为：";
        } else if (type === 303) {
            //title = " 管线不相交,管间垂直距离为：";
            title = "管间垂直距离为：";
        } else if (type === 304) {
            title = " 管间空间距离为：";
        }
    } else if (type === 400) {
        unit = "度";
        title = "平面角度：";
    } else if (type === 401) {
        unit = "平方米";
        title = "地表面积：";
        //SurfaceAreaResult = result;
    } else { //其它测量
        unit = "千米";
        if (result < 1) {
            result = result * 1000;
            unit = "米";
        }
        if (type === 1) {
            title = "空间距离为：";
        } else if (type === 2) {
            title = "地表距离为：";
        }
        if (type === 3) {
            title = "垂直距离为：";
        }
        if (type === 5) {
            title = "水平距离为：";
        }
    }
    result = result.toFixed(3);
    var resultVal = title + result + unit; //style='background-color: #404040; color: #ffffff; font-weight: bold; margin: 0; padding: 2px;'
    if (parent.transparencyBalloons && parent.transparencyBalloons != null) {
        parent.transparencyBalloons.DestroyObject();
        parent.transparencyBalloons = null;
    }
    var html = "<html><body style='color: #fffffe; font-weight: bold; margin: 8; padding: 2px;'>" +
        "<div style='position:absolute;top:20%;text-align:center;' ><span>" +
        resultVal + "</span></div></body></html>";
    //earth.HtmlBalloon.Transparence = true;
    var id = earth.Factory.CreateGuid();
    var htmlBal = earth.Factory.CreateHtmlBalloon(id, "量算窗体");
    htmlBal.SetScreenLocation(0, 0);
    htmlBal.SetRectSize(250, 150);
    htmlBal.SetIsAddCloseButton(true);
    htmlBal.SetIsAddMargin(true);
    htmlBal.SetIsAddBackgroundImage(true);
    //htmlBal.SetBackgroundAlpha(0xcc);
    //htmlBal.SetBlendColor(0x303030);
    // htmlBal.SetBackgroundRGB(0x00000000);
    //htmlBalloons[3].SetTailColor(0x6cac99ff);
    htmlBal.SetIsTransparence(true);
    htmlBal.SetBackgroundAlpha(0);
    htmlBal.ShowHtml(html);
    bolonArr.push(htmlBal);

    //deleted by zhangd-2015-03-12-13:53--所有气泡关闭事件均修改为下面的回调方式
    // earth.Event.OnHtmlBalloonFinished = function(gid) {
    //     if (id === gid) {
    //         hideBollon();
    //         clearMeasureResult();
    //         if (resultRes) {
    //             resultRes.ClearRes();
    //             earth.ShapeCreator.Clear();
    //         }

    //     }
    // };
    OnHtmlBalloonFinishedFunc(id,function(gid){
        if (id === gid) {
            hideBollon();
            clearMeasureResult();
            if (resultRes) {
                resultRes.ClearRes();
                earth.ShapeCreator.Clear();
            }
        }
    });
    // measureOperCancel();
};

/**
 * 功能：点击鼠标右键取消分析/测量操作
 * 参数：无
 * 返回值：无
 */
var measureOperCancel = function() {
    earth.Event.OnRBDown = function() {
        earth.ShapeCreator.Clear();
        earth.Event.OnRBDown = function() {};
    };
};
var hideBollon = function() {
        if (bolonArr.length > 0) {
            for (var i = 0; i < bolonArr.length; i++) {
                if (bolonArr[i]) {
                    bolonArr[i].DestroyObject();
                    bolonArr[i] = null;
                }
            }
        }
        if (resultRes) {
            resultRes.ClearRes();
            resultRes = null;
        }
    }
    /**
     * 地面不参与
     * bTerrain 全局变量默认为true 即地形参与量算
     *
     */
var bTerrainClick = function() {
        if (bTerrain) {
            bTerrain = false;
            $("div[tag='BTerrain']").addClass("selected");
        } else {
            bTerrain = true;
            $("div[tag='BTerrain']").removeClass("selected");
        }
    }
    /**
     * 功能：“水平距离”菜单点击事件
     * 参数：无
     * 返回：无
     */
var horizontalDisClick = function() {
    hideBollon();
    earth.Event.OnMeasureFinish = showMeasureResult;
    setTimeout(function() {
        earth.Measure.MeasureHorizontalDistance(bTerrain);
    }, 100);


    //measureOperCancel();
};

/**
 * 功能：“垂直距离”菜单点击事件
 * 参数：无
 * 返回：无
 */
var verticalDisClick = function() {
    hideBollon();
    earth.Event.OnMeasureFinish = showMeasureResult;

    setTimeout(function() {
        earth.Measure.MeasureHeight(bTerrain);
    }, 100);

    //measureOperCancel();
};

/**
 * 功能：“空间距离”菜单点击事件
 * 参数：无
 * 返回：无
 */
var spaceDisClick = function() {
    hideBollon();
    earth.Event.OnMeasureFinish = showMeasureResult;

    setTimeout(function() {
        earth.Measure.MeasureLineLength(bTerrain);
    }, 100);

    //measureOperCancel();
};

/**
 * 功能：“地表距离”菜单点击事件
 * 参数：无
 * 返回：无
 */
var surfaceDisClick = function() {
    hideBollon();
    earth.Event.OnMeasureFinish = showMeasureResult;

    setTimeout(function() {
        earth.Measure.MeasurePathLength();
    }, 100);

    //measureOperCancel();
};

//----------------------------------------------------------------------
// 管线测量 - 开始
//----------------------------------------------------------------------
/**
 * 管线测量对象
 */
var PipelineMeasure = {
    coordinate1: null, //管线坐标1
    coordinate2: null, //管线坐标2
    datumConfigLink: null, //字段映射文件的地址
    datum: null, //空间坐标转换对象
	onHighLightObjs: [],//add by JIARONG, NOV16 2015

	//拾取管线时，停止闪烁。add by JIARONG, NOV16 2015
	initonHighLightObjs: function() {
		var m = new Array();
		this.onHighLightObjs=m;
	},
	stoppipeHighLights:function(){
		var len = this.onHighLightObjs.length;
		if(len>0){
			for(var i=0; i<len; i++){
				var obj = this.onHighLightObjs[i];
				obj.StopHighLight();
			}
			if(i==len){
				this.initonHighLightObjs();
			}
			
		}
	},
    /**
     * 功能：初始化空间坐标转换对象
     * 参数：无
     * 返回：无
     */
    initDatum: function(layerId) {
        var layer = earth.LayerManager.GetLayerByGUID(layerId);
        var projectSetting = layer.ProjectSetting;
        var layerLink = projectSetting.SpatialRefFile;
        if (this.datumConfigLink == layerLink) {
            return;
        }
        this.datumConfigLink = layerLink;
        var spatialUrl = "http://" + layerLink.substr(2).replace("/", "/sde?") + "_sde";
        spatialUrl = spatialUrl.replace("http:", "").replace("/sde?", "");
        spatialUrl = spatialUrl.substr(0, spatialUrl.length - 4);
        while (spatialUrl.indexOf("/")>-1) {
            spatialUrl = spatialUrl.replace("/", "\\");
        }
        this.datum = CoordinateTransform.createDatum(spatialUrl);
    },

    /**
     * 功能：根据管线的图层ID，搜索管线信息
     * 参数：pipelineId - 管线的图层Id; filter - 搜索条件; queryType - 搜索类型; queryTableType - 搜索表类型；spatial-空间搜索对象
     * 返回：搜索结果
     */

    getPipelineInfo: function(pipelineId, filter, queryType, queryTableType, spatial, contain) {
        var pipeLayer = earth.LayerManager.GetLayerByGUID(pipelineId);
        if (pipeLayer == null) {
            return null;
        }
        var subLayer = null;
        for (var i = 0, len = pipeLayer.GetChildCount(); i < len; i++) {
            subLayer = pipeLayer.GetChildAt(i);
            if (subLayer.Name == contain) { // 使用具体的_container图层
                break;
            }
        }
        if (subLayer == null) {
            return;
        }
        var params = subLayer.QueryParameter;
        if (params == null) {
            return null;
        }
        params.ClearRanges();
        params.ClearCompoundCondition();
        params.ClearSpatialFilter();
        params.Filter = "";
        params.Filter = filter;
        params.ClearSpatialFilter();
        if (spatial != null) {
            params.SetSpatialFilter(spatial);
        }
        params.QueryType = queryType;
        params.QueryTableType = queryTableType; //0为点表搜索；1为线表搜索
        var result = subLayer.SearchFromGISServer();
        return result;
    },

    /**
     * 功能：根据管线的图层ID和关键字，搜索管线信息
     * 参数：pipelineId - 管线的图层Id; key - 对象的关键字，即US_KEY值;
     * 返回：搜索结果
     */
    getPipeLocalInfo: function(pipelineId, key) {
        var pipeLayer = earth.LayerManager.GetLayerByGUID(pipelineId);
        if (pipeLayer == null) {
            return null;
        }
        var params = pipeLayer.LocalSearchParameter;
        if (params == null) {
            return null;
        }
        params.ClearSpatialFilter();
        params.ReturnDataType = 0; //0 返回所有数据，1 返回xml数据，2 返回渲染数据
        params.PageRecordCount = 100;
        params.SetFilter(key, "");
        params.HasDetail = false;
        params.HasMesh = false;
        var result = pipeLayer.SearchFromLocal();
        return result;
    },

    /**
     * 功能：根据搜索结果提取管线的坐标信息
     * 参数：result - 搜索结果
     * 返回：坐标信息对象
     */
    getPipelineCoord: function(result, layerGuid, key) {
        if (result == null) {
            return null;
        }
        var resultXml = result.GotoPage(0);
        var resultDoc = loadXMLStr(resultXml);
        var resultRoot = resultDoc.documentElement;
        if (resultRoot == null) {
            return null;
        }
        var recordRoot = resultRoot.firstChild;
        if (recordRoot.childNodes.length <= 0) {
            return null;
        }

        var recordNode = recordRoot.firstChild;
        var coordType = recordRoot.getAttribute("geometry");
        var shapeNode = recordNode.selectSingleNode("SHAPE");
        var shapeXml = shapeNode.xml;
        var coordBeginIndex = shapeXml.indexOf("<Coordinates>") + "<Coordinates>".length;
        var coordEndIndex = shapeXml.indexOf("</Coordinates>");
        var coordStr = shapeXml.substr(coordBeginIndex, coordEndIndex - coordBeginIndex);
        var coordArr = coordStr.split(",");
        var us_SDEEP = parent.getName("US_SALT", 1, true);
        var us_EDEEP = parent.getName("US_EALT", 1, true);
        var us_SDEEP_value = parseFloat(recordRoot.getElementsByTagName(us_SDEEP)[0].text); //起点高程
        var us_EDEEP_value = parseFloat(recordRoot.getElementsByTagName(us_EDEEP)[0].text); //止点高程
        //排水时管底，非排水是管顶
        var us_Size = parent.getName("US_SIZE",1,true);
        var us_Size_value = recordRoot.getElementsByTagName(us_Size)[0].text;
        var pipeHeight = us_Size_value;
        var pipeWidth = us_Size_value;
        if(us_Size_value.indexOf('X') > -1){
            pipeWidth = us_Size_value.split("X")[0] * 0.001;
            pipeHeight = us_Size_value.split("X")[1] * 0.001;
        }else{
            pipeWidth = us_Size_value * 0.001;
            pipeHeight = us_Size_value * 0.001;
        }
        var layer = earth.LayerManager.GetLayerByGUID(layerGuid);
        if(!layer){
            return;
        }
        var layerType = layer.PipeLineType;
        if(layerType >= 4000 && layerType <= 4306){//排水
            us_SDEEP_value = us_SDEEP_value + pipeHeight * 0.5;
            us_EDEEP_value = us_EDEEP_value + pipeHeight * 0.5;
        }else{
            us_SDEEP_value = us_SDEEP_value - pipeHeight * 0.5;
            us_EDEEP_value = us_EDEEP_value - pipeHeight * 0.5;
        }
        
        coordArr.splice(2, 1, us_SDEEP_value);
        coordArr.splice(5, 1, us_EDEEP_value);
        var coordList = [];
        var vect3s = earth.Factory.CreateVector3s();
        for (var i = 0; i < coordArr.length; i = i + 3) {
            //空间坐标转换，将经纬度坐标转换为空间坐标
            var coordPoint = this.datum.des_BLH_to_src_xy(coordArr[i], coordArr[i + 1], coordArr[i + 2]);
            coordList.push(coordPoint);
            var vect = earth.Factory.CreateVector3();
            vect.X = coordArr[i];
            vect.Y = coordArr[i + 1];
            vect.Z = coordArr[i + 2];
            vect3s.AddVector(vect);
        }

        //新增获取管线的mesh顶点，用于两个mesh求最短距离
        var meshV3s = this.getPipeLineMeshVertices(layer,key);

        var coordObject = {
            coordType: coordType,
            coordList: coordList,
            centerLineVect3s: vect3s,
            lineMeshV3s: meshV3s,
            pipeHeight: pipeHeight,
            pipeWidth: pipeWidth
        };
        return coordObject;
    },

    /**
     * 功能：判断两个坐标点是否相同
     * 参数：coordPoint1 - 坐标点1；coordPoint1-坐标点2
     * 返回：比较结果（true为相同；false为不相同）
     */
    isCoordPointEqual: function(coordPoint1, coordPoint2) {
        if ((coordPoint1 == null) || (coordPoint2 == null)) {
            return false;
        }

        if ((coordPoint1.X === coordPoint2.X) &&
            (coordPoint1.Y === coordPoint2.Y) &&
            (coordPoint1.Z === coordPoint2.Z)) {
            return true;
        } else {
            return false;
        }
    },
    getPipeLineMeshVertices: function(layer, key){
        var curlayer = null;
        for (var i = 0, len = layer.GetChildCount(); i < len; i++) {
            curlayer = layer.GetChildAt(i);
            if (curlayer.LayerType === "Container") { // 使用具体的_container图层
                break;
            }
        }
        if (curlayer == null) {
            return;
        }
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
        var meshV3s = null;
        for (var i = 0; i < localresult.RecordCount; i++) {
            var lobjKey = localresult.GetLocalObjectKey(i);
            if(lobjKey != key){
                continue;
            }
            var lobj = localresult.GetLocalObject(i);
            if (!lobj) {
                continue;
            }
            meshV3s = lobj;
            // meshV3s = localresult.GetMeshVertices(i);
            // if(meshV3s == null){
            //     continue;
            // }
        }
        return meshV3s;
    },

    /**
     * 功能：添加OnPickObjectEx监听事件，选取两条管线
     * 参数：callback - 事件的回调函数
     * 返回：无
     */
    onPickObjectEvent: function(callback) {
        earth.Event.OnPickObjectEx = function(obj) {
            obj.Underground = true; // SEObjectFlagType.ObjectFlagUnderground

			var parentLayerId = obj.GetParentLayerName();
			SYSTEMPARAMS.project = parentLayerId.split("=")[1].split("_")[0];//对应的管线图层，赋值给系统参数SYSTEMPARAMS
			SystemSetting.getProjectConfig();//初始化系统配置文件配置
			
 //           setTimeout(function() {
                var parentLayerArr = parentLayerId.split("_");
                var searchLayerId = parentLayerArr[0];
                var useKey = top.getName("US_KEY", 1, true);
                var searchFilter = "(and,equal," + useKey + "," + obj.GetKey() + ")";
                var queryType = 17;
                var queryTableType = 1; //线表搜索
                var result = PipelineMeasure.getPipelineInfo(searchLayerId.split("=")[1], searchFilter, queryType, queryTableType, null, parentLayerArr[1]);
                PipelineMeasure.initDatum(searchLayerId.split("=")[1]); //初始化空间坐标转换对象
                var coordObj = PipelineMeasure.getPipelineCoord(result, searchLayerId.split("=")[1],obj.GetKey());
                if (coordObj == null) {
                    earth.Query.FinishPick();
                    PipelineMeasure.clearPipelineMeasure();
                    alert("未能查询到选定对象的信息");
                    return;
                }
                if (PipelineMeasure.coordinate1 == null) {
                    PipelineMeasure.coordinate1 = coordObj;
                    obj.ShowHighLight();
					PipelineMeasure.onHighLightObjs.push(obj);

                } else {
                    PipelineMeasure.coordinate2 = coordObj;
                    obj.ShowHighLight();
					PipelineMeasure.onHighLightObjs.push(obj);
                    earth.Query.FinishPick();
                    callback(); //回调处理函数
                    //
                    PipelineMeasure.coordinate1 = null;
                    PipelineMeasure.coordinate2 = null;
                }
  //          }, 100);
        };
        earth.Query.PickObjectEx(24); // SEPickObjectType.PickAllObject
    },

    /**
     * 功能：清除管线测量数据
     * 参数：无
     * 返回：无
     */
    clearPipelineMeasure: function() {
        this.coordinate1 = null;
        this.coordinate2 = null;
		this.stoppipeHighLights();
    }
};

/**
 * 管线测量算法
 */
var PipelineMeasureAlgorithm = {
    /**
     * 功能：判断两条线段是否相交
     * 参数：p1 - 线段1端点, p2 - 线段1端点, q1 - 线段2端点, q2 - 线段2端点
     * 返回：是否相交结果（true表示相交，false表示不相交）
     */
    IsSegmentIntersect: function(p1, p2, q1, q2) {
        //
        //	每个线段的两点都在另一个线段的左右不同侧，则能断定线段相交
        //	公式对于向量(x1,y1)->(x2,y2),判断点(x3,y3)在向量的左边,右边,还是线上.
        //	p=x1(y3-y2)+x2(y1-y3)+x3(y2-y1).p<0 左侧,	p=0 线上, p>0 右侧
        //
        var line1, line2;

        //	判断q1和q2是否在p1->p2两侧
        line1 = p1.X * (q1.Y - p2.Y) + p2.X * (p1.Y - q1.Y) + q1.X * (p2.Y - p1.Y);
        line2 = p1.X * (q2.Y - p2.Y) + p2.X * (p1.Y - q2.Y) + q2.X * (p2.Y - p1.Y);

        //符号位异或为0:q1和q2在p1->p2同侧
        if (((line1 * line2) >= 0) && !(line1 == 0 && line2 == 0)) {
            return false;
        }

        // 判断p1和p2是否在q1->q2两侧
        line1 = q1.X * (p1.Y - q2.Y) + q2.X * (q1.Y - p1.Y) + p1.X * (q2.Y - q1.Y);
        line2 = q1.X * (p2.Y - q2.Y) + q2.X * (q1.Y - p2.Y) + p2.X * (q2.Y - q1.Y);

        //符号位异或为0:p1和p2在q1->q2同侧
        if (((line1 * line2) >= 0) && !(line1 == 0 && line2 == 0)) {
            return false;
        }

        //判为相交
        return true;
    },

    /**
     * 功能：获取两条线的交点
     * 参数：p1 - 线段1端点, p2 - 线段1端点, q1 - 线段2端点, q2 - 线段2端点
     * 返回：两条线的交点
     */
    segmentIntersect: function(p1, p2, q1, q2) {
        //根据两点式化为标准式，进而求线性方程组
        var cross_point = earth.Factory.CreateVector2();
        var temp_left, temp_right;

        //求X坐标
        temp_left = (q2.X - q1.X) * (p1.Y - p2.Y) - (p2.X - p1.X) * (q1.Y - q2.Y);
        temp_right = (p1.Y - q1.Y) * (p2.X - p1.X) * (q2.X - q1.X) + q1.X * (q2.Y - q1.Y) * (p2.X - p1.X) - p1.X * (p2.Y - p1.Y) * (q2.X - q1.X);
        cross_point.X = temp_right / temp_left;

        //求Y坐标
        temp_left = (p1.X - p2.X) * (q2.Y - q1.Y) - (p2.Y - p1.Y) * (q1.X - q2.X);
        temp_right = p2.Y * (p1.X - p2.X) * (q2.Y - q1.Y) + (q2.X - p2.X) * (q2.Y - q1.Y) * (p1.Y - p2.Y) - q2.Y * (q1.X - q2.X) * (p2.Y - p1.Y);
        cross_point.Y = temp_right / temp_left;

        return cross_point;
    },

    /**
     * 功能：二维向量的相减
     * 参数：v1 - 二维向量1, v2 - 二维向量2
     * 返回：相减后的结果向量
     */
    Vector2Sub: function(v1, v2) {
        var resVec = earth.Factory.CreateVector2();
        resVec.X = v1.X - v2.X;
        resVec.Y = v1.Y - v2.Y;
        return resVec;
    },

    /**
     * 功能：三维向量的相减
     * 参数：v1 - 三维向量1, v2 - 三维向量2
     * 返回：相减后的结果向量
     */
    VectorSub: function(v1, v2) {
        var resVec = earth.Factory.CreateVector3();
        resVec.X = v1.X - v2.X;
        resVec.Y = v1.Y - v2.Y;
        resVec.Z = v1.Z - v2.Z;
        return resVec;
    },

    /**
     * 功能：判断空间线段是否共面
     * 参数：p1 - 线段1端点, p2 - 线段1端点, q1 - 线段2端点, q2 - 线段2端点
     * 返回：true为共面，false为不共面
     */
    IsInterface: function(p1, p2, q1, q2) {
        var tempV = this.VectorSub(p1, q1); //p1 - q1;
        var line1 = this.VectorSub(p1, p2); //p1 - p2;
        var line2 = this.VectorSub(q1, q2); //q1 - q2;
        return (tempV.Dot(line1.Cross(line2)) == 0);
    },

    /**
     * 功能：计算空间点到线段的最小距离垂线的垂足
     * 参数：q - 空间点, p1 - 线段2端点, p2 - 线段2端点
     * 返回：空间点到线段的最小距离垂线的垂足
     */
    Point2LineFoot: function(q, p1, p2) {
        var footP = earth.Factory.CreateVector3();
        var v12 = this.VectorSub(p1, p2); //p1-p2
        var l = v12.Length * v12.Length;
        var k = -((p1.X - q.X) * (p2.X - p1.X) + (p1.Y - q.Y) * (p2.Y - p1.Y) + (p1.Z - q.Z) * (p2.Z - p1.Z)) / l;
        footP.X = k * (p2.X - p1.X) + p1.X;
        footP.Y = k * (p2.Y - p1.Y) + p1.Y;
        footP.Z = k * (p2.Z - p1.Z) + p1.Z;
        return footP;
    },

    /**
     * 功能：求空间直线公垂线的两个垂足点
     * 参数：p1 - 线段1端点, p2 - 线段1端点, q1 - 线段2端点, q2 - 线段2端点
     * 返回：空间直线公垂线的两个垂足点
     */
    Line2LineFoot: function(p1, p2, q1, q2) {
        var foots = [];
        var ab = this.VectorSub(p2, p1); //p2-p1;
        var cd = this.VectorSub(q2, q1); //q2-q1;
        var f1ab = ab.Length * ab.Length;
        var f1cd = cd.Length * cd.Length;
        var f2 = ab.Dot(cd);
        var f3ab = ab.Dot(this.VectorSub(q1, p1));
        var f3cd = cd.Dot(this.VectorSub(q1, p1));
        var t1 = (f3ab * f1cd - f3cd * f2) / (f1ab * f1cd - f2 * f2);
        var t2 = (f3cd * f1ab - f2 * f3ab) / (f2 * f2 - f1ab * f1cd);

        var foot1 = earth.Factory.CreateVector3();
        foot1.X = t1 * (p2.X - p1.X) + p1.X;
        foot1.Y = t1 * (p2.Y - p1.Y) + p1.Y;
        foot1.Z = t1 * (p2.Z - p1.Z) + p1.Z;
        foots.push(foot1);

        var foot2 = earth.Factory.CreateVector3();
        foot2.X = t2 * (q2.X - q1.X) + q1.X;
        foot2.Y = t2 * (q2.Y - q1.Y) + q1.Y;
        foot2.Z = t2 * (q2.Z - q1.Z) + q1.Z;
        foots.push(foot2);
        //验证是否是公垂线
        return foots;
    },

    /**
     * 功能：计算空间点到线段的最小距离
     * 参数：q - 空间点, p1 - 线段2端点, p2 - 线段2端点
     * 返回：空间点到线段的最小距离
     */
    Point2Line: function(q, p1, p2) {
        var foot = this.Point2LineFoot(q, p1, p2);
        //判断垂足点是否在线段内
        if (Math.min(p1.X, p2.X) <= foot.X && foot.X <= Math.max(p1.X, p2.X) &&
            Math.min(p1.Y, p2.Y) <= foot.Y && foot.Y <= Math.max(p1.Y, p2.Y) &&
            Math.min(p1.Z, p2.Z) <= foot.Z && foot.Z <= Math.max(p1.Z, p2.Z)) {
            ///空间三角求点到该线段所在直线的最小距离
            //double p = ((p1 - p2).Length + (p1 - q).Length + (p2 - q).Length) / 2;
            //double s = Math.Sqrt(p * (p - (p1 - p2).Length) * (p - (p1 - q).Length) * (p - (p2 - q).Length));
            //return 2 * s / (p2 - p1).Length;

            ///垂线长
            var vFootP = this.VectorSub(foot, q); //(foot - q).Length;
            var verticalLineLength = vFootP.Length;
            return verticalLineLength;
        } else {
            //点到线段两端点的最小距离
            var vp1 = this.VectorSub(q, p1); //q - p1
            var vp2 = this.VectorSub(q, p2); //q - p2
            return Math.min(vp1.Length, vp2.Length);
        }
    },

    /**
     * 功能：求空间两直线的最短距离，即公垂线长
     * 参数：p1 - 线段1端点, p2 - 线段1端点, q1 - 线段2端点, q2 - 线段2端点
     * 返回：公垂线长
     */
    CommonLine: function(p1, p2, q1, q2) {
        var line1 = this.VectorSub(p2, p1); //p2 - p1;
        var line2 = this.VectorSub(q2, q1); //q2 - q1;
        var commonline = line1.Cross(line2);
        var lenght = Math.abs(commonline.Dot(this.VectorSub(q1, p1)) / commonline.Length);
        return lenght;
    },

    /**
     * 功能：求空间线段的最小距离
     * 参数：p1 - 线段1端点, p2 - 线段1端点, q1 - 线段2端点, q2 - 线段2端点
     * 返回：空间线段的最小距离
     */
    SegmentMinDistance: function(p1, p2, q1, q2) {
        //判断是否共面
        if (this.IsInterface(p1, p2, q1, q2) == true) {
            ///
            ///判断是否相交,可以省去
            ///
            var d1 = this.Point2Line(p1, q1, q2);
            var d2 = this.Point2Line(p2, q1, q2);
            var d3 = this.Point2Line(q1, p1, p2);
            var d4 = this.Point2Line(q2, p1, p2);
            var minDistance = Math.min(d1, d2);
            minDistance = Math.min(minDistance, d3);
            minDistance = Math.min(minDistance, d4);
            return minDistance;
        } else {
            var foot = this.Line2LineFoot(p1, p2, q1, q2);
            //判断线段p1、p2直线上的垂足foot[0]是否在线段上
            if (Math.min(p1.X, p2.X) <= foot[0].X && foot[0].X <= Math.max(p1.X, p2.X) &&
                Math.min(p1.Y, p2.Y) <= foot[0].Y && foot[0].Y <= Math.max(p1.Y, p2.Y) &&
                Math.min(p1.Z, p2.Z) <= foot[0].Z && foot[0].Z <= Math.max(p1.Z, p2.Z)) {
                //判断线段q1、q2直线上的垂足foot[1]是否在线段上
                if (Math.min(q1.X, q2.X) <= foot[1].X && foot[1].X <= Math.max(q1.X, q2.X) &&
                    Math.min(q1.Y, q2.Y) <= foot[1].Y && foot[1].Y <= Math.max(q1.Y, q2.Y) &&
                    Math.min(q1.Z, q2.Z) <= foot[1].Z && foot[1].Z <= Math.max(q1.Z, q2.Z)) {
                    return this.CommonLine(p1, p2, q1, q2);
                } else { //p1、p2直线上的垂足foot[0]到q1、q2线段的最小距离
                    var d1 = this.Point2Line(p1, q1, q2);
                    var d2 = this.Point2Line(p2, q1, q2);
                    var d3 = this.Point2Line(foot[0], q1, q2);
                    var min = Math.min(d1, d2);
                    return Math.min(min, d3);
                }
            } else if (Math.min(q1.X, q2.X) <= foot[1].X && foot[1].X <= Math.max(q1.X, q2.X) &&
                Math.min(q1.Y, q2.Y) <= foot[1].Y && foot[1].Y <= Math.max(q1.Y, q2.Y) &&
                Math.min(q1.Z, q2.Z) <= foot[1].Z && foot[1].Z <= Math.max(q1.Z, q2.Z)) {
                var d1 = this.Point2Line(q1, p1, p2);
                var d2 = this.Point2Line(q2, p1, p2);
                var d3 = this.Point2Line(foot[1], p1, p2);
                var min = Math.min(d1, d2);
                return Math.min(min, d3);
            } else {
                //两个垂足点都不在两根管段上
                var d1 = this.Point2Line(p1, q1, q2);
                var d2 = this.Point2Line(p2, q1, q2);
                var d3 = this.Point2Line(q1, p1, p2);
                var d4 = this.Point2Line(q2, p1, p2);
                var minDistance = Math.min(d1, d2);
                minDistance = Math.min(minDistance, d3);
                minDistance = Math.min(minDistance, d4);
                return minDistance;
            }
        }
    }
};

/**
 * 功能：“水平面积”菜单点击事件
 * 参数：无
 * 返回：无
 */
var flatAreaClick = function() {
    hideBollon();
    earth.Event.OnMeasureFinish = showMeasureResult;
    setTimeout(function() {
        earth.Measure.MeasureArea();
    }, 100);

    //measureOperCancel();
};

/**
 * 功能：初始化分析服务
 * 参数：无
 * 返回值：无
 */
var initAnalysisServer = function() {
    hideBollon();
    var analysisServer = window.ifEarth.params.ip;
    earth.Analysis.AnalysisServer = analysisServer;
    //	earth.Analysis.Synchronization = false;
    earth.Event.OnAnalysisFinished = showAnalysisResult;
};

/**
 * 功能：显示分析结果
 * 参数：result-分析结果; alt-为挖填方断面分析基准高程
 * 返回值：无
 */
/*var showAnalysisResult = function(result){
	var resultVal = "";
	if("SurfaceArea" === result.Type){//地表面积分析结果
		resultVal = "地表面积为：" + result.TerrainSurfaceArea.toFixed(3) + "平方米";
	}
    var html = "<html><body style='background-color: #404040; color: #ffffff; font-weight: bold; margin: 0; padding: 2px;'><p>" +
        resultVal + "</p></body></html>";
    
    //earth.HtmlBalloon.Transparence = true;
    earth.HtmlBalloon.ShowHtmlInRect(html, 0, 0, 250, 150, true);
    earth.Event.OnHtmlBalloonFinished= function () {
        clearMeasureResult();
        clearAnalysisResult(result);
        earth.Event.OnHtmlBalloonFinished= function () {};
    };

};*/

/**
 * 功能：清除测量结果或分析结果
 * 参数：result-分析结果
 * 返回值：无
 */
/*
var clearAnalysisResult = function(result){
	if(result != null){
		result.ClearRes();
	}
};
*/

/**
 * 功能：“地表面积”菜单点击事件
 * 参数：无
 * 返回：无
 */
var resultRes = null;
var surfaceAreaClick = function() {
    hideBollon();
    earth.Event.OnCreateGeometry = function(pval, type) {
        earth.Event.OnAnalysisFinished = function(result) {
            resultRes = result;
            earth.ShapeCreator.Clear();
            showMeasureResult(result.TerrainSurfaceArea, 401);
        };
        earth.Analysis.SurfaceArea(pval);

        //measureOperCancel();

        earth.Event.OnCreateGeometry = function() {};
    };
    setTimeout(function() {
        earth.ShapeCreator.CreatePolygon();
    }, 100);


};
/**
 * 功能：“平面角度”菜单点击事件
 * 参数：无
 * 返回：无
 */
var mPlaneAngleClick = function() {
    hideBollon();
    earth.Event.OnMeasureFinish = function(pval, type) {
        var showResult = "平面角度:" + pval + "度";
        showMeasureResult(pval, 400);
        earth.Event.OnMeasureFinish = function() {};
    };
    setTimeout(function() {
        earth.Measure.MeasurePlaneAngle(); // 平面角度
    }, 100);

};
