/**
 * User: gyc
 * Date: 14-1-22
 * Time: 下午5:54
 * Desc:
 */
if( !CITYPLAN ){
    var CITYPLAN = {};
}

CITYPLAN.EditTool = function (earth,generateEdit){
    var editTool = {};
    var curEditingPoint = null;   // 当前正在编辑的节点对象

    /**
     * 数据库服务操作通用功能
     * @param url 服务地址
     * @param xml POST内容：xml格式
     * @return {String} 直接返回服务所返回的内容：xml格式的字符串
     */
    var dbUtil = function(url, xml){
        var res = "";
        $.ajaxSetup({
            async : false  // 将ajax请求设为同步
        });
        $.post(url, xml, function(data){
            res = data;
        });
        return res;
    };

    var browse=function(){
        earth.SelectSet.UnLockSelectSet();
        earth.ToolManager.SphericalObjectEditTool.Browse();
    }

    var select = function (){
        browse();
        earth.ToolManager.SphericalObjectEditTool.Select();
    };

    // region 对象编辑
    var updateObject = function (model){
        var info = earth.Factory.CreateDbEleInfo(model.Guid, model.Name);
        info.SphericalTransform.SetLocation(model.SphericalTransform.GetLocation());
        info.SphericalTransform.SetRotation(model.SphericalTransform.GetRotation());
        info.SphericalTransform.SetScale(model.SphericalTransform.GetScale());
        earth.DatabaseManager.UpdateElementPose(model.GetParentNode().Guid, model.Guid, info);
    };
    var updateModel = function (model){
        if (model){
            var baseobj = earth.Factory.CreateDataBaseObject(model.Guid, model.Name);
            baseobj.SphericalTransform.SetLocation(model.SphericalTransform.GetLocation());
            baseobj.SphericalTransform.SetRotation(model.SphericalTransform.GetRotation());
            baseobj.SphericalTransform.SetScale(model.SphericalTransform.GetScale());

            var box = model.GetBBox();
            baseobj.BBox.SetExtent(box.MinVec, box.MaxVec);
            earth.DatabaseManager.UpdateSpatialPose(model.GetParentNode().Guid, model.Guid, baseobj);
//            earth.DatabaseManager.UpdateSpatialPosebox(model.GetParentNode().Guid, model.Guid, baseobj);
        }
    };
    var updateSelectedObject = function (){
        var model = null;
        if(earth.SelectSet.GetCount() <= 0){
            earth.SelectSet.UnLockSelectSet();
            return;
        }
        for (var i = 0; i < earth.SelectSet.GetCount(); i++){
            model = earth.SelectSet.GetObject(i);
            if (model){
                updateChangeHeightObject(model);
            }
        }
    };
    var updateChangeHeightObject=function(model){
            if (model){
                if(model.Rtti == 280){  // SimpleBuilding
                    updateObject(model);
                }else if(model.Rtti == 229){ // EditModel
                    updateModel(model);
                }
            }
    };

    var onPoseChanged = function (pTranslation, pRotation, pScaling){
        //alert('onposechanged')
        earth.Event.OnPoseChanged = function(){};
        earth.Event.OnEditDatabaseFinished = function (){
            //alert("edit database ok");
        };
        updateSelectedObject();
        // updateLonLat(null);
    };
    var move = function (){
        browse();
        earth.Event.OnPoseChanged = onPoseChanged;
        earth.Event.OnSelectChanged = function(){
            showMoveHtml("move");
            earth.Event.OnSelectChanged=function(){}
        };
        earth.Event.OnRBDown=function(){
            clearHtmlBallon(htmlBalloonMove);
        }
        earth.ToolManager.SphericalObjectEditTool.Move(7);   // SEAxisStatus.EnableAxisAll
    };
    var rotate = function (){
        browse();
        earth.Event.OnPoseChanged = onPoseChanged;
        earth.Event.OnSelectChanged = function(){
            showMoveHtml("rotate");
            earth.Event.OnSelectChanged=function(){}
        };
        earth.Event.OnRBDown=function(){
            clearHtmlBallon(htmlBalloonMove);
        }
        earth.ToolManager.SphericalObjectEditTool.Rotate(7);   // SEAxisStatus.EnableAxisAll
    };
    var scale = function (){
        browse();
        earth.Event.OnPoseChanged = onPoseChanged;
        earth.Event.OnSelectChanged = function(){
            showMoveHtml("scale");
            earth.Event.OnSelectChanged=function(){}
        };
        earth.Event.OnRBDown=function(){
            clearHtmlBallon(htmlBalloonMove);
        }
        earth.ToolManager.SphericalObjectEditTool.Scale(7);   // SEAxisStatus.EnableAxisAll
    };
    var removeObj = function (){
        if(earth.SelectSet.GetCount() <= 0){
            earth.SelectSet.UnLockSelectSet();
            alert("请选择删除物体！");
            return;
        }
        var deleteObjectLayersGuid=[];
        var eObjList=[];
        for (var i = 0; i < earth.SelectSet.GetCount(); i++){
            var selObj = earth.SelectSet.GetObject(i);
            if (selObj){
                var selObjLayer = selObj.GetParentNode();
                if(selObjLayer&&selObjLayer.Editable){
                    eObjList.push(selObj);
                    deleteObjectLayersGuid.push(selObjLayer.Guid);
                    //写法有问题 删除第二个后就卡死
                   /* selObjLayer.BeginUpdate();
                    selObjLayer.DetachObject(selObj);//从球上移除
                    if(selObj.Rtti == 280){  // SimpleBuilding
                        earth.DatabaseManager.DeleteElementInLayer(selObjLayerGuid, selObjGuid);
                    }else if(selObj.Rtti == 229){ // EditModel
                        earth.DatabaseManager.DeleteRecordInLayer(selObjLayerGuid, selObjGuid);
                    }
                    selObjLayer.EndUpdate();
                    browse();
                    if(parent.editLayers[selObjLayerGuid]){
                        delete  parent.editLayers[selObjLayerGuid];//从EditLayer中移除
                    }*/
                }else{
                    alert("删除失败，图层处于不可编辑状态！");
                    return;
                }
            }
        }
        if (eObjList.length&&!confirm("是否确定要删除？")) {
            return;
        }
        for(var e=0;e<deleteObjectLayersGuid.length;e++){
            var delGuid=deleteObjectLayersGuid[e];
            if(parent.editLayers[delGuid]){
                parent.editLayers[delGuid].BeginUpdate();
            }
        }
        earth.SelectSet.Clear();
        for(var l=0;l<eObjList.length;l++){
            var eObj = eObjList[l];
            var layer = eObj.GetParentNode();
            layer.DetachObject(eObj);
            if(eObj.Rtti == 280){  // SimpleBuilding
                earth.DatabaseManager.DeleteElementInLayer(layer.Guid, eObj.Guid);
            }else if(eObj.Rtti == 229){ // EditModel
                earth.DatabaseManager.DeleteRecordInLayer(layer.Guid, eObj.Guid);
            }
        }
        for(var e=0;e<deleteObjectLayersGuid.length;e++){
            var delGuid=deleteObjectLayersGuid[e];
            if(parent.editLayers[delGuid]){
                parent.editLayers[delGuid].EndUpdate();
                //delete  parent.editLayers[delGuid];//从EditLayer中移除
            }
        }
        deleteObjectLayersGuid=[];
        eObjList=[];
    };
    var textureEdit=function(){
        earth.Event.OnMaterialSelectChanged = onResetMaterial;
        earth.SelectSet.LockSelectSet();
        earth.ToolManager.MaterialEditTool.Select();
    };
    var onResetMaterial=function(){
        earth.SelectSet.UnLockSelectSet();

        var texturePath = earth.UserDocument.OpenFileDialog("", "JPEG(*.jpg;jpeg)|*.jpg;*.jpeg|BMP(*.bmp)|*.bmp|PNG(*.png)|*.png|TGA(*.tga)|*.tga");    // 选择项目文件完整路径
        if (!texturePath) {
            //清除选中状态
            browse();
            return;
        }
        var imgType=texturePath.substr(texturePath.lastIndexOf(".")+1,texturePath.length);
        var img=new Image();
        img.src=texturePath;
        var width=img.width;
        var height=img.height;
        //if(check2n(width)&&check2n(height)){
            var material = earth.ToolManager.MaterialEditTool.GetSelectedMaterial();
            material.RefreshDiffuseTexture();
            var textureid = material.DiffuseTexture;//GetTexture(SETextureType.TT_Difuse);//need changed，类型需要从层获取
            var eObj = earth.SelectSet.GetObject(0);
            var pObj = eObj.GetParentNode();
            var logPath= earth.RootPath + "temp\\editgenerate.log";
            earth.Event.OnEditDatabaseFinished = function (){
                //UpdateTexture(layer_id, pic_path, res_id, v_type, v_width, v_height)
                /*earth.Event.OnEditDatabaseFinished = function (){};
                var material = earth.ToolManager.MaterialEditTool.GetSelectedMaterial();
                material.RefreshDiffuseTexture();
                earth.SelectSet.UnLockSelectSet();
                browse();*/
            };
            var isValid=generateEdit.check_texture_log(pObj.Guid,CITYPLAN_config.server.serviceIP, texturePath, textureid, logPath);
            if(!isValid){
                var type = generateEdit.get_pic_type();
                var swidth = generateEdit.get_pic_width();
                var sheight = generateEdit.get_pic_height();
                // 判断类型和大小是否一致，如果类型不一致没有办法转，如果大小不一致则可以
                if(type==4&&(imgType.toLowerCase()=="jpg"||imgType.toLowerCase()=="jpeg"||imgType.toLowerCase()=="bmp")){
                    alert("图片类型与原材质不符，只能使用png或tga类型的图片");
                    return;
                }else if(type==3&&(imgType.toLowerCase()=="png"||imgType.toLowerCase()=="tga")){
                    alert("图片类型与原材质不符，只能使用jpg或bmp类型的图片");
                    return;
                }else if(swidth!=width||sheight!=height){
                    alert("图片类型与原材质宽高("+sheight+"*"+swidth+")不相等");
                    return;
                }
            }else{
                changedTexture(material,pObj.Guid,texturePath,textureid,logPath);
            }
        //}
    }
    var changedTexture=function(material,objGuid,texturepath,textureid,logpath){
        var result = generateEdit.change_texture_log(objGuid, CITYPLAN_config.server.serviceIP, texturepath, textureid, logpath);
        if (result){
            material.RefreshDiffuseTexture();

            earth.SelectSet.UnLockSelectSet();
            earth.ToolManager.SphericalObjectEditTool.Select();
            browse();
        }else{
            alert("纹理替换失败");
        }
    }
    var check2n = function (num) {
        if (num < 1) {
            return false;
        }
        else {
            return ((num & (num - 1)) == 0) ? true : false;
        }
    };
    var moveByValue = function (dx,dy,dz){
        earth.ToolManager.SphericalObjectEditTool.MoveSelectObject(dx,dy,dz);
        updateSelectedObject();
    };
    var rotateByValue = function (dx,dy,dz){
        earth.ToolManager.SphericalObjectEditTool.RotateSelectObject(dx,dy,dz);
        updateSelectedObject();
    };
    var scaleByValue = function (dx,dy,dz){
        earth.ToolManager.SphericalObjectEditTool.ScaleSelectObject(dx,dy,dz);
        updateSelectedObject();
    };
    /**
     * 贴地
     */
    var alignGround = function (){
        //先选中再贴地
        var isSelected = false;
        if(earth.SelectSet.GetCount() == 0){

        }else{
            isSelected = true;
        }

        if(isSelected){
            earth.ToolManager.SphericalObjectEditTool.AlignGround();
            updateSelectedObject();
        }else{
            earth.Event.OnSelectChanged = function(){
                earth.Event.OnSelectChanged=function(){};
                for (var i = 0; i < earth.SelectSet.GetCount(); i++){
                    model = earth.SelectSet.GetObject(i);
                    if (model){
                        updateChangeHeightObject(model);
                    }
                }
            };
            earth.ToolManager.SphericalObjectEditTool.AlignGround();
        }
    };

    var htmlBalloonMove=null;
    var showMoveHtml = function(type){
        earth.Event.OnHtmlNavigateCompleted = function (){};
        var loaclUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
        var url = "";
        var title=""
        var width =260,height = 200;
        if(type === "move"){
            url = loaclUrl + "/html/edit/objectEdit.html?action=move";
            title="移动";
            //move();
        }else if(type==="rotate"){
            url = loaclUrl + "/html/edit/objectEdit.html?action=rotate";
            title="旋转";
            //rotate();
        }else if(type==="scale"){
            url = loaclUrl + "/html/edit/objectEdit.html?action=scale";
            title="缩放";
           //scale();
        }else if(type==="heightChange"){
            height=150;
            url=loaclUrl+"/html/investigate/changeHeight.html";
            title="高度调整";
        }


        if(url===""){
            return;
        }
        if (htmlBalloonMove != null){
            htmlBalloonMove.DestroyObject();
            htmlBalloonMove = null;
        }
        htmlBalloonMove = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), title);
        htmlBalloonMove.SetScreenLocation(0,0);//earth.offsetHeight
        htmlBalloonMove.SetRectSize(width,height);
        htmlBalloonMove.SetIsAddBackgroundImage(false);
        htmlBalloonMove.ShowNavigate(url);
        earth.Event.OnHtmlNavigateCompleted = function (){
            earth.htmlBallon =htmlBalloonMove;
            earth.ifEarth = window.frames.ifEarth;
            //earth.lastPlanHeight = top.lastPlanHeight;
            earth.userdataTree=parent.$.fn.zTree.getZTreeObj("userdataTree");
            if(htmlBalloonMove === null){
                return;
            }
            setTimeout(function(){
                htmlBalloonMove.InvokeScript("getEarth", earth);
                htmlBalloonMove.InvokeScript("getEditLayers", parent.editLayers);
            },100);
        };
        earth.Event.OnHtmlBalloonFinished = function(id){
            if (htmlBalloonMove != null&&id===htmlBalloonMove.Guid){
                htmlBalloonMove.DestroyObject();
                htmlBalloonMove = null;
                earth.Event.OnHtmlBalloonFinished = function(){};
            }
        };
    };
    var clearHtmlBallon = function(htmlBall){
        if (htmlBall != null){
            htmlBall.DestroyObject();
            htmlBall = null;
        }
    } ;
    // endregion

    // region 顶点编辑
    /**
     * 保存更新后的SimpleBuilding属性数据
     * @param building SESimpleBuildingClass类型
     * @return {Boolean} 保存成功返回true，否则返回false
     */
    var saveDataToDb = function (building){
        var baseArea = building.GetBottomArea();   // 建筑基底面积
        var totalArea = building.GetBottomArea() * building.GetFloorsCount();  // 建筑总面积
        var xmlUpdate = "<CPSIMPLEBUILDING><CONDITION><ID> ='" + building.Guid + "' </ID>" +
            "</CONDITION>" +
            "<CONTENT>" +
                "<TOTALAREA>" + totalArea + "</TOTALAREA>" +
                "<BASEAREA>" + baseArea + "</BASEAREA>" +
            "</CONTENT>" +
        "</CPSIMPLEBUILDING>";
        var res = dbUtil(CITYPLAN_config.service.update, xmlUpdate);
        return /true/.test(res);
    };
    /**
     * 保存更新后的SimpleBuilding
     * @param building SESimpleBuildingClass类型
     */
    var updateSimpleBuilding = function(building){
        var info = earth.Factory.CreateDbEleInfo(building.Guid, building.Name);
        var infolist = earth.Factory.CreateDbEleInfoList();
        infolist.AddItem(info);

        var polygon = building.GetPolygon(1);   // SECoordinateUnit.Degree
        var vecs = polygon.GetRingAt(0);

        info.SphericalVectors.Add(vecs);
        info.height = building.GetFloorHeight() * building.GetFloorsCount() + building.GetRoofHeight();
        info.SphericalTransform.Longitude = building.SphericalTransform.Longitude;
        info.SphericalTransform.Latitude = building.SphericalTransform.Latitude;
        info.SphericalTransform.Altitude = building.SphericalTransform.Altitude;
        info.RoofType = building.GetRoofType();

        //更新SimpleBuilding属性数据
        if (saveDataToDb(building)){
            //保存到图形数据库
            earth.DatabaseManager.UpdateElementParam(building.GetParentNode().Guid, building.Guid, info);
        }
    };
    var onEditFinished = function (){
        earth.Event.OnEditFinished = function(){};

        if (earth.SelectSet.GetCount() <= 0){
            earth.SelectSet.UnLockSelectSet();
            return;
        }

        var building = earth.SelectSet.GetObject(0);
        if (building){
            updateSimpleBuilding(building);
            earth.SelectSet.UnLockSelectSet();
        }
    };
    var addVertex = function (){
        earth.SelectSet.LockSelectSet();
        earth.Event.OnEditFinished = onEditFinished;
        earth.ToolManager.ElementEditTool.InsertPoint();
    };
    var deleteVertex = function (){
        earth.SelectSet.LockSelectSet();
        earth.Event.OnEditFinished = onEditFinished;
        earth.Event.OnGeometryDeletePoint = function (){
            earth.Event.OnGeometryDeletePoint = function (){};
            earth.ToolManager.ElementEditTool.DeleteSelectedPoint();
        };
        earth.ToolManager.ElementEditTool.DeletePoint();
    };
    var moveVertex = function (){
        earth.SelectSet.LockSelectSet();
        earth.Event.OnEditFinished = onEditFinished;
        earth.Event.OnControlPointSelectChanged = function(point){
            if(point){   // point.ValueXEnable == true为顶点，false为中心点
                window.hideLargeDialog();
                curEditingPoint = point;
                window.showLittleDialog("html/edit/moveVertex.html?centerPoint=" + !point.ValueXEnable, "顶点定量移动");
            }
        };
        earth.ToolManager.ElementEditTool.ShapeEdit();
    };
    var moveVertexByValue = function (dx, dy, dz){
        if(curEditingPoint.ValueXEnable == true){
            curEditingPoint.translate(dx || 0, dy || 0, dz || 0);
        }else{
            curEditingPoint.Stretch(dz || 0);
        }
    };
    // endregion	
   /**
	 * 边拉伸
	 */
	var SegmentExtrude=function(){
		var menuXYZDivObj = document.getElementById("extrudeMenuDiv");
		menuXYZDivObj.style.display="none";
		earth.ToolManager.ElementEditTool.SegmentExtrude();
	};
	/**
	* Volume边拉伸
	*/
	var VolumeSegmentExtrude=function(){
		var menuXYZDivObj = document.getElementById("extrudeMenuDiv");
		menuXYZDivObj.style.display="none";
		earth.ToolManager.ElementEditTool.VolumeSegmentExtrude();
	};
	var createShape = function(flag){
		var ipData = {action:"add"};
		earth.ShapeCreator.Clear();
		if(flag=="model"){
			earth.Event.OnLBUp =function (pVal){
			ipData.path = earth.Environment.RootPath;
			ipData.win = window;
			var rValue = showModalDialog("html/edit/Model.html", ipData,"dialogWidth=370px;dialogHeight=240px;status=no");
			if (!ipData.name){
				earth.ShapeCreator.Clear();
				return;
			}
			var guid = earth.Factory.CreateGuid();
			var obj = {};
			obj.id = guid;
			obj.name = ipData.name;
			obj.link = ipData.link;
			obj.type="model";
			var position = earth.GlobeObserver.Pick(pVal.X, pVal.Y);
			obj.longitude = position.Longitude;
			obj.latitude = position.Latitude;
			obj.altitude = position.Altitude;
			createIconObj(obj);
			addShapeToDb(obj);//保存到数据库
			}
		}else if (flag == "building"){
			earth.Event.OnCreateGeometry = function(pVal,type){
			ipData.path = earth.Environment.RootPath;
			ipData.floorsAllHeight = pVal.Height;
			ipData.win = window;
			var rValue = showModalDialog("html/edit/SimpleBuiliding.html", ipData,"dialogWidth=370px;dialogHeight=400px;status=no");
			if (!ipData.name){
				Shape.clearShape();
				return;
			}
			var guid = earth.Factory.CreateGUID();
			var obj = {};
			obj.id = guid;
			obj.name = ipData.name;
			obj.type="building";
			obj.floorCount = ipData.floorCount;
			obj.floorHeight = ipData.floorHeight;
			obj.floorColor = ipData.floorColor;
			obj.floorTexture = ipData.floorTexture;
			obj.roofType = ipData.roofType;
			obj.roofColor = ipData.roofColor;
			obj.roofTexture = ipData.roofTexture;
			obj.vector3s = pVal.Vector3s;
			obj.longitude = pVal.Longitude;
			obj.latitude = pVal.Latitude;
			obj.altitude = pVal.Altitude;
			createIconObj(obj);
			earth.ShapeCreator.Clear();
			addShapeToDb(obj);
		};
		earth.ShapeCreator.CreateVolume(0xffff0000);
		}
	};
	/**
	* 构建地标对象
	*/
	function createIconObj(obj){
		var iconObj = null;
		var e = earth;
		var id=obj.id;
		var type=obj.type;
		if("model" == type){
			var strLink = obj.link;
			var model = e.Factory.CreateEditModelByLocal(id, "model", strLink,3);
			model.SphericalTransform.SetLocationEx(obj.longitude,obj.latitude,obj.altitude);
			model.Name=obj.name;
			e.AttachObject(model);
		}else if("building" == type){
			var simpleBuilding = e.factory.CreateSimpleBuilding(id,"building");
			simpleBuilding.SphericalTransform.SetLocationEx(obj.longitude,obj.latitude,obj.altitude);
		    simpleBuilding.BeginUpdate();
			var polygon = e.factory.CreatePolygon();
			polygon.AddRing(obj.vector3s);
			simpleBuilding.SetPolygon(0,polygon);
			var floorCount = parseInt(obj.floorCount);
			var floorHeight = parseFloat(obj.floorHeight);
			simpleBuilding.SetFloorsHeight(floorHeight * floorCount);
			simpleBuilding.SetFloorHeight(floorHeight);
            simpleBuilding.SetRoofType(obj.roofType);
            var floorMats = simpleBuilding.GetFloorsMaterialStyles();
            floorMats.Items(0).DiffuseTexture = obj.roofTexture;
            floorMats.Items(1).DiffuseTexture = obj.roofTexture;
            for(var i=2; i<floorMats.Count; i++){
            	floorMats.Items(i).DiffuseTexture = obj.floorTexture;
            }  	
            var roofMats = simpleBuilding.GetRoofMaterialStyles();
            //for(var i=0; i<roofMats.Count; i++){
            roofMats.Items(1).DiffuseTexture = obj.roofTexture;
            //}
            	
			simpleBuilding.EndUpdate();
			e.AttachObject(simpleBuilding); 
		}
	}
	function addShapeToDb(obj){
		/*var type = "ATTACHMENT";
	    //var id = earth.Factory.CreateGUID();
	    var xmlAdd = "<ATTACHMENT>" +
	                "<ID>$ID</ID>" +
	                "<PLANID>$PLANID</PLANID>" +
	                "<NAME>$NAME</NAME>" +
	                "<TYPE>$TYPE</TYPE>" +
					 "<OBJ>$OBJ</OBJ>" +
	                "</ATTACHMENT>";
	    if(obj){
	        if(/\d$/.test(obj.type)){// 以数字结尾
	            type = obj.type;
	        }
	        xmlAdd = xmlAdd.replace("$ID", obj.id).replace("$NAME", obj.name).replace("$PLANID", "11")
	                 .replace("$OBJ","").replace("$TYPE", obj.type);
	        $.post(CITYPLAN_config.service.add,
	                    xmlAdd,
	                    function (data){
					if(data.indexOf("true") > -1){
						alert("ok")//addModel成功后一些操作的代码
	                   
	                }else{
	                    alert("添加模型失败！");
	                }
	            });
	        }      */
		
	}
	
    editTool.select = select;
    editTool.showMoveHtml = showMoveHtml;
    editTool.clearHtmlBallon=clearHtmlBallon;
    editTool.move=move;
    editTool.rotate = rotate;
    editTool.scale = scale;
    editTool.removeObj=removeObj;
    editTool.textureEdit=textureEdit;
    editTool.moveByValue = moveByValue;
    editTool.rotateByValue = rotateByValue;
    editTool.scaleByValue = scaleByValue;
    editTool.alignGround = alignGround;
    editTool.updateChangeHeightObject=updateChangeHeightObject;

    editTool.addVertex = addVertex;
    editTool.deleteVertex = deleteVertex;
    editTool.moveVertex = moveVertex;
    editTool.moveVertexByValue = moveVertexByValue;
	editTool.VolumeSegmentExtrude = VolumeSegmentExtrude;
	editTool.SegmentExtrude = SegmentExtrude;
	editTool.createShape=createShape;
    return editTool;
};