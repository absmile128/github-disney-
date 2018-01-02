if( !Query ){
     var Query = {};
}
Query.PageHelper = function(curEarth){

 	var helper = {};

	var currentPage = 0;
	var totalPage = 0;
	var pageSize = 20;
	var totalRecode = 0;
	var params = null;
	
	//var jsons = [];
	var allRecords = [];//废弃
	var results = [];
	var pageRecord = [];
	var earth = curEarth;
	//键值对 [result --- layername]
	var resultName;
	//键值对 [record --- layername]
	var recordName;
	//键值对 [layername --- layerID]
	var layerGuids;
	//键值对 [record --- type]
	var recordType;
	//缓存池对象
	var pageRecords;

	//根据layerID获取其请求参数 param
	var paramsDic;
	var beginResultIndex, endResultIndex, beginPageIndex, endPageIndex, beginPageRecordIndex, endPageRecordIndex;
	//result的索引---result的记录数
	var resultIndexToRecs;
	//reslut的索引---reslut的param
	var resultIndexToParam;

	var urlParams = null;
	var layerNames = null;
	var paramLen = 0;
	var recordGuids;
	var compCondition;
	var fHeader;
	var htmlBalloons;
	//var htmlStr;
	var bShow = false;
	var htmlStr;
	var allWidth2;
	var isLoop = false;
	var highLightObjs = [];
	/**
	 * 初始化参数
	 * @param  {[type]} layerIDs       [description]
	 * @param  {[type]} feature        [description]
	 * @param  {[type]} filter         [description]
	 * @param  {[type]} queryTypes     [description]
	 * @param  {[type]} queryTableType [description]
	 * @return {[type]}                [description]
	 */
	var _initParams = function(layerIDs, layerName, feature, filter, queryTypes, queryTableType, header, aliasHeader, compoundCondition, formatHeader, allWidth){
        if(parent.htmlBalloons){
            parent.htmlBalloons.DestroyObject();
            parent.htmlBalloons=null;
        }
		//实例化
        var importExcelBtn = $("#importExcelBtn");
        importExcelBtn.attr("disabled",true);

		resultName = new ActiveXObject("Scripting.Dictionary");
		recordName = new ActiveXObject("Scripting.Dictionary"); 
		recordType = new ActiveXObject("Scripting.Dictionary"); 
		pageRecords = new ActiveXObject("Scripting.Dictionary"); 
		layerGuids = new ActiveXObject("Scripting.Dictionary"); 
		results = new ActiveXObject("Scripting.Dictionary"); 
		recordGuids = new ActiveXObject("Scripting.Dictionary"); 

		paramsDic = new ActiveXObject("Scripting.Dictionary"); 
		resultIndexToRecs = new Array; 
		resultIndexToParam = new Array; 
		compCondition = compoundCondition;
		params = [];
		fHeader = formatHeader;
		//支持只传入一个type [0]或者[1]
		if (layerIDs && layerIDs.length > 0) {
			for (var i = 0; i < layerIDs.length; i++) {
				for (var j = 0; j < queryTableType.length; j++) {
					params.push({
						layerID : layerIDs[i],
						feature : feature,
						filter : filter,
						queryType : queryTypes,
						queryTableType : queryTableType[j]
					});
				};
			};
		}

		//把layerID与name对应起来
		bingdingLayerGuids(layerIDs, layerName);
		layerNames = layerName;
		allWidth2 = allWidth;
		//先获取总数 获取到counts(记录总数)
		getPageNum(params);
		//alert("记录总数为:" + counts); 
		totalPage = Math.ceil(counts / pageSize);
		//获取到beginIndex与endIndex
		getIndexs(0);
		getAllByIndexs(resultIndexToRecs, beginIndex, endIndex);
		var records = getRecords();
		pageRecords.item(0) = records;
		//分页
		initDataGrid(header, aliasHeader, records,importExcelBtn);
	};

	var setShow = function(isShow){
		if(isShow){
			bShow = true;
		}else{
			bShow = false;
		}
	};

	/**
	 * 绑定图层的guid与图层的name
	 * @param  {[type]} layerIDs   [description]
	 * @param  {[type]} layerNames [description]
	 * @return {[type]}            [description]
	 */
	var bingdingLayerGuids = function(layerIDs, layerNames){
		//先判断是否有重复元素
		var tempDic = new ActiveXObject("Scripting.Dictionary");
		var layerNum = layerNames.length;
		for(var i = 0 ; i < layerNum; i++){
			var lName = layerNames[i];
			if(tempDic.item(lName)){
				isLoop = true;
				break;
			}else{
				tempDic.item(lName) = lName;
				isLoop = false;
			}
		}
		if(isLoop){
			var tempNum = layerNum / 2;
			for (var i = 0; i < tempNum; i++) {
				var layerN = layerNames[2 * i];
				layerGuids.item(layerIDs[i]) = layerN;//增加新项 
			};
		}else{
			for (var i = 0; i < layerNum; i++) {
				var layerN = layerNames[i];
				layerGuids.item(layerIDs[i]) = layerN;//增加新项 
			};
		}
	};
	var columnName;
	var aliasColumnName;
	var getFieldValue = function(header, aliasHeader, pageRecord){
		//alert(parent.getName("US_KEY", 1, true));
		var values= [];
		columnName = [];
		aliasColumnName = [];
		if(pageRecord && pageRecord.length > 0){
			//遍历每一个Record
			for (var i = 0; i < pageRecord.length; i++) {
				var record = pageRecord[i];
				var layerGuid = recordGuids.item(record);
    			var layerObj = earth.LayerManager.GetLayerByGUID(layerGuid);
    			var layerCode = layerObj.PipeLineType;
				var resType = recordType.item(record);
				if (record) {
					//图层名
					var layerName = recordName.item(record);
					var row = {};
					for (var j = 0; j < header.length; j++) {
						var key = header[j];
						if(key === undefined){
							continue;
						}
						var keyUpper;
						keyUpper = key.toLocaleUpperCase();
						if(key != "US_FEATURE" && key != "layerName"){
							if(resType === "管点"){
								key = parent.getName(key, 0, true);
							}else{
								key = parent.getName(key, 1, true);
							}
						}
						
	                    if(key && (record[key] != undefined || record[keyUpper] != undefined)){
	                    	if(i===0){
	                    		columnName.push(key);
	                    		aliasColumnName.push(aliasHeader[j]);
	                    	}
	                   		row[key] = record[key]?record[key]:record[keyUpper];
	                   		if(key === "US_LTTYPE"){//埋设方式
	                   			row[key] = FieldValueStringMap.GetFieldValueString("US_LTTYPE",record.US_LTTYPE);//埋设类型
	                   		}
	                   		if(key === "US_PDIAM"){//管线管径
	                   			if(Number(record.US_PDIAM) > 0){
	                   				row[key] = Number(record.US_PDIAM).toFixed(2);
	                   			}else{
	                   				row[key] = record.US_PWIDTH + "X" + record.US_PHEIGHT;
	                   			}
	                   		}
                            if(key === "US_PWIDTH"){  //US_PDIAM并不是所有的管线都有这个地段
                                row[key] = record.US_PWIDTH + "X" + record.US_PHEIGHT;
                            }
	                   		if(keyUpper === "US_EDEEP"){
	                   			row[key] = Number(record.US_EDEEP).toFixed(2);
	                   		}
	                   		if(keyUpper === "US_SDEEP"){
	                   			row[key] = Number(record.US_SDEEP).toFixed(2);
	                   		}
	                   		if(keyUpper === "US_PT_ALT"){
	                   			row[key] = Number(record.US_PT_ALT).toFixed(2);
	                   		}
	                   		if(keyUpper === "US_BD_TIME"){
	                   			row[key] = record.US_BD_TIME>0?parseFloat(record.US_BD_TIME).toFixed(2):"";
	                   		}
	                   		if(keyUpper == "US_PT_TYPE"){
	                   			row[key] = parent.getCaptionByCustomValue(layerCode, "PointType", row[key]);
	                   		}else if(keyUpper == "US_ATTACHMENT"){
	                   			row[key] = parent.getCaptionByCustomValue(layerCode, "Attachment", row[key]);
	                   		}else if(keyUpper == "US_PRESSUR"){
	                   			row[key] = parent.getCaptionByCustomValue(layerCode, "Pressure", row[key]);
	                   		}else if(keyUpper == "US_LTTYPE"){
	                   			row[key] = parent.getCaptionByCustomValue(layerCode, "LayoutType", row[key]);
	                   		}else if(keyUpper == "US_LTYPE"){
	                   			row[key] = parent.getCaptionByCustomValue(layerCode, "LineType", row[key]);
	                   		}else if(keyUpper == "US_PMATER"){
	                   			row[key] = parent.getCaptionByCustomValue(layerCode, "MaterialType", row[key]);
	                   		}
	                   		//这里增加对管点或者管线的判断
	                   		if(resType === "管点"){
	                   			if(key != "US_FEATURE"){
			                    	var keyCode = row[key];
			                    	row[key] = keyCode;
			                    }else{//当传入的是us_feature时
			                    	var keyCode = record["US_ATTACHMENT"];
			                    	var keyAtt = "AttachmentCode";
			                    	if(keyCode === undefined || keyCode === "" || keyCode === "0" || keyCode === null || keyCode === "null"){
			                    		keyCode = record["US_PT_TYPE"];
			                    		keyAtt = "CPointCodes";
			                    		if(keyCode === undefined || keyCode === ""){
			                    			row[key] = "管点";
			                    			continue;
			                    		}
			                    	}
			                    	//row[key] = StatisticsMgr.getValueByCode(keyAtt, keyCode);
			                    	row[key] = keyCode;
			                    }
	                    	} else {
			                    	var keyCode = row[key];
			                    	row[key] = keyCode;
	                    	}
	                    }else{
	                    	if(i===0){
	                    		columnName.push(key);
	                    		aliasColumnName.push(aliasHeader[j]);
	                    	}
	                    	if(key === "US_FEATURE"){
	                    		row[key] = recordType.item(record);
	                    		if(resType === "管点"){
									var usType = parent.getName("US_PT_TYPE", 0, true);
									var usAttach = parent.getName("US_ATTACHMENT", 0, true);
									var usWell = parent.getName("US_WELL", 0, true);
									//TODO:需要根据井类型做更加合理的判断处理......
									if(record[usType]){
										row[key] = parent.getCaptionByCustomValue(layerCode, "PointType", record[usType]);
									}else if(record[usAttach]){
										row[key] = parent.getCaptionByCustomValue(layerCode, "Attachment", record[usAttach]);
									}else if(record[usWell]){
										row[key] = record[usWell];
									}else{
										row[key] = "管点";
									} 
								}else{
									row[key] = "管线";
								}
	                    	}else if(keyUpper === "LAYERNAME"){
	                    		row[key] = layerName;
	                    	}else{
	                    		if(record[key] != undefined){
	                    			row[key] = record[key];
	                    		}
	                    	}
	                    }
					}
	                values.push(row);
				};
			};
		}
		return values;
	};

	var initDataGrid = function(header, aliasHeader, pageRecord,importExcelBtn){
		if(pageRecord === undefined || pageRecord.length === 0){
            totalPage = 1;
            if(importExcelBtn){
                importExcelBtn.attr("disabled",true);
            }
            $("#dg").datagrid({
	            pagination:false
	        });
	        $('#dg').datagrid('loadData', { total: 0, rows: [] });
			alert("无查询数据!");
			return;
		}else{
            if(importExcelBtn){
                importExcelBtn.attr("disabled",false);
            }
        }
		//todo:优化 其他所有的宽度都传进来....
		var endV;
		if(fHeader){
			endV = fHeader[fHeader.length - 1];
		}
		//解析record
		var values = getFieldValue(header, aliasHeader, pageRecord);
		//处理列合并格式
		if(fHeader){
			for (var i = 0; i < values.length; i++) {
				var rowV = values[i];
				var beginV = fHeader[0];
				var endV =  fHeader[1];
                var newV = "";
                if(beginV === "US_PDIAM"){
                    newV = rowV[beginV];
                } else{
                    if(rowV[beginV]){
                        var rowCount = rowV[beginV].split("X");
                        if(rowCount.length>1){
                            newV = rowV[beginV];
                        } else{
                            newV = rowV[beginV] + " X " + rowV[endV];
                        }
                    }
                }


				if(rowV[beginV] === "0" && rowV[endV] === "0"){
					rowV[beginV] = pageRecord[i].US_SIZE;
				}else{
					rowV[beginV] = newV;
				}
			}
		}
		
		var originWidth = (224 - 20) / aliasHeader.length;
		var originWidth2;
		if(allWidth2){
			originWidth2 = (allWidth2 - 20) / aliasHeader.length;
		}
		var column = [];
		for (var k = 0; k < columnName.length; k++) {
			if(k === 0){
				columnName[0] = "US_KEY";
			}
			//第一个参数是属性表中的字段名称 第二个参数是显示名称 第三个参数是表格列宽
			if(columnName[k] != endV){
				if(allWidth2){
					column.push({field:columnName[k], title:aliasColumnName[k],width:originWidth2});
				}else{
					column.push({field:columnName[k], title:aliasColumnName[k], width:originWidth});
				}
			}
		};


		//给数据表格设置表头
		$("#dg").datagrid({
  			pageSize : 20,
  			singleSelect:true,                
            pagination:true,
  			columns:[column],
  			fitColumns: true,
  			onRowContextMenu: function(e, rowIndex, rowData){
                e.preventDefault();
            },
            onHeaderContextMenu: function(e, field){
                e.preventDefault();
            },
            onDblClickRow: function(rowIndex, rowData){
				var options = $('#dg').datagrid('getPager').data("pagination").options;
				var curr = options.pageNumber; 
				var currentRecord = pageRecords.Item(curr - 1)[rowIndex];

				var type = recordType.item(currentRecord);
				var key;
				var guid;
				if(type === "管线"){
					key = parent.getName("US_KEY", 1, true);
					guid = parent.getName("US_ID", 1, true);
				}else{
					key = parent.getName("US_KEY", 0, true);
					guid = parent.getName("US_ID", 0, true);
				}
				key = currentRecord[key];
				if(key==undefined)
				{
					key = currentRecord["PIPEID"];			
				}
				guid = currentRecord[guid];
				//alert(key + " " + guid);
				var layerName = recordName.item(currentRecord);
				//有问题
				var layerID = recordGuids.item(currentRecord);//type
				if(bShow){
                    //显示气泡  word-break: break-all;word-wrap: break-word; 内容自动换行
                    htmlStr = '<div style="word-break:keep-all;white-space:nowrap;overflow:auto;width:265px;height:310px;margin-top:25px;margin-bottom:25px"><table style="font-size:16px;background-color: #ffffff; color: #fffffe">';
                    var mid;
                    if(type != "管线"){
                    	initPointValue(layerID, currentRecord, layerName, type, guid, key);
                    }else{
                        mid = initLineValue(layerID, currentRecord, layerName);
                        htmlStr = htmlStr + mid + '</table></div>';
                        //高亮
                        highlightObject(layerID, type, guid, key);
                    }
                }else{
                    //高亮
                    highlightObject(layerID, type, guid, key);
                }
			},
			nowrap:false            
  		});

        ///////////////////////////////////位置移动begin////////////////////////////////////////////////
        //单独处理us_key的问题
        if(values && values.length){
            var standardLineKey = parent.getName("US_KEY", 1, true);
            var standardPointKey = parent.getName("US_KEY", 0, true);
            for(var i = 0; i < values.length; i++){
                var item = values[i];
                for(var key in item){
                    if(key === standardLineKey || key === standardPointKey){
                        values[i]["US_KEY"] = item[key];
                    }
                }
            }

        }
        //加载数据
        var data = {"total":counts,"rows":values};
        $('#dg').datagrid('loadData',data);
        //分页属性设置
        var pager = $('#dg').datagrid('getPager');
        pager.pagination({
            showPageList:false,
            showRefresh:false,
            beforePageText: "",
            afterPageText: "" + totalPage + "页",
            displayMsg: '',
            onSelectPage:function(pageNum, pageSize){
                //$('#dg').clearSelections();
                //$('#dg').unselectAll();
                var records;
                var keys = pageRecords.Keys().toArray();
                for(var i = 0; i < keys.length; i++){
                    if(pageRecords.Exists(keys[i]) && i === (pageNum - 1)){
                        records = pageRecords.item(i);
                    }
                }
                if (records === undefined) {
                    getIndexs(pageNum - 1);
                    getAllByIndexs(resultIndexToRecs, beginIndex, endIndex);
                    records = getRecords(bResultIndex, beginPageInd, beginResInd, eResultIndex, endPageInd, endResInd);
                    //pageRecords.add(pageNum - 1, records);
                    pageRecords.item(pageNum - 1) = records;
                }
                var values = getFieldValue(header, aliasHeader, records);
                //单独处理us_key的问题
                if(values && values.length){
                    var standardLineKey = parent.getName("US_KEY", 1, true);
                    var standardPointKey = parent.getName("US_KEY", 0, true);
                    for(var i = 0; i < values.length; i++){
                        var item = values[i];
                        for(var key in item){
                            if(key === standardLineKey || key === standardPointKey){
                                values[i]["US_KEY"] = item[key];
                            }
                        }
                    }
                }
                //当所有的页面都遍历后 第二次就不用添加了 其他地方也直接从字典里获取即可
                var data = {"total":counts,"rows":values};
                $('#dg').datagrid('loadData', data);
            }
        });
        ///////////////////////////////////位置移动end////////////////////////////////////////////////
	};

	// var formatColspan = function(beginField, endField){
	// 	var rows = $('#dg').datagrid('getRows');
	// 	if(rows && rows.length > 0){
	// 		for(var i = 0; i < rows.length; i++){
	// 			var beginValue = rows[i][beginField];
	// 			var endValue = rows[i][endField];
	// 			var newValue = beginValue + " X " + endValue;
	// 			$('#dg').datagrid('updateRow',{
	// 				index: i,
	// 				row: {
	// 					beginField: newValue						
	// 				}
	// 			});
	// 		}
	// 	}
	// };

	///////////////////////////////////////////////////////////
	//	双击获取属性
	//////////////////////////////////////////////////////////
	function getPlaneCoordinates(layerID,data,usKey){
        var Record=null;
        var jsonData = $.xml2json(data);
        var us_key = parent.getName("US_KEY", 0, true);
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

    function loadXMLStr(xmlStr){
		var xmlDoc;
		try {
			if (window.ActiveXObject || window.ActiveXObject.prototype) {
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
	}
    var originCoord;
    
    var initPointValue = function (layerID, record, layerName, type, guid, key){
        var strKey=record[parent.getName("US_KEY",0,true)];
        var v3s=null;
        var us_key = parent.getName("US_KEY",0,true);
        var strPara = "(and,equal," +us_key+",";
        strPara += strKey;
        strPara += ")";
        var layer = earth.LayerManager.GetLayerByGUID(layerID);
        var layerCode = layer.PipeLineType;
        var strConn = layer.GISServer + "dataquery?service=" + layerID + "&qt=17&dt=point&pc="+strPara+"&pg=0,100";
        earth.Event.OnEditDatabaseFinished = function(pRes, pFeature){
            if (pRes.ExcuteType == parent.excuteType){
                var xmlStr = pRes.AttributeName;
                var xmlDoc = loadXMLStr(xmlStr);
                v3s = getPlaneCoordinates(layerID,xmlDoc,strKey);
                var tv3s = v3s["datumCoord"];
                originCoord = v3s["originCoord"];
                var X = "";
                var Y = "";
                if(tv3s){
                    X=(parseFloat(tv3s.X)).toFixed(3);
                    Y=(parseFloat(tv3s.Y)).toFixed(3);
                }

                var us_well=record[parent.getName("US_WELL",0,true)];
                var fieldArr = [];
                // if(us_well){//井类型
                	fieldArr = parent.PS2_config.PointProperty.DEFAULTPOINT;
                // }else{
                // 	fieldArr = parent.PS2_config.PointProperty.DEFAULTPOINT;
                // }
                var str = "";
                for(var i = 0 ; i < fieldArr.length; i++){
                	var fieldCaption = parent.getName(fieldArr[i],0,false);	//显示字段
		        	var fieldName = parent.getName(fieldArr[i],0,true);//数据库字段
		        	var fieldValue = record[fieldName]||"";
		        	var fieldType = "";
		        	if(fieldArr[i] == "US_PT_TYPE"){
		        		fieldType = "PointType";
		        		fieldValue = parent.getCaptionByCustomValue(layerCode, fieldType, fieldValue);
		        	}else if(fieldArr[i] == "US_ATTACHMENT"){
		        		fieldType = "Attachment";
		        		fieldValue = parent.getCaptionByCustomValue(layerCode, fieldType, fieldValue);
		        	}else if(fieldArr[i] == "US_PRESSUR"){
		        		fieldType = "Pressure";
		        		fieldValue = parent.getCaptionByCustomValue(layerCode, fieldType, fieldValue);
		        	}else if(fieldArr[i] == "US_LTTYPE"){
		        		fieldType = "LayoutType";
		        		fieldValue = parent.getCaptionByCustomValue(layerCode, fieldType, fieldValue);
		        	}else if(fieldArr[i] == "US_LTYPE"){
		        		fieldType = "LineType";
		        		fieldValue = parent.getCaptionByCustomValue(layerCode, fieldType, fieldValue);
		        	}else if(fieldArr[i] == "US_PMATER"){
		        		fieldType = "MaterialType";
		        		fieldValue = parent.getCaptionByCustomValue(layerCode, fieldType, fieldValue);
		        	}
		        	
		        	// if(!fieldValue && (fieldArr[i] == "US_WELL" || fieldArr[i] == "US_NDEEP" 
		        	// 	|| fieldArr[i] == "US_WDEEP" || fieldArr[i] == "US_WDIA"  || fieldArr[i] == "US_WDIA"
		        	// 	|| fieldArr[i] == "US_PLATE" || fieldArr[i] == "US_PSIZE" || fieldArr[i] == "US_PMATER"
		        	// 	|| fieldArr[i] == "US_WMATER"|| fieldArr[i] == "US_ANGLE"|| fieldArr[i] == "US_OFFSET")){
		        	// 	continue;
		        	// }
		        	if(fieldArr[i] == "X"){
		        		fieldCaption = "X坐标";
		        		fieldValue = X;
		        	}else if(fieldArr[i] == "Y"){
		        		fieldCaption = "Y坐标";
		        		fieldValue = Y;
		        	}
		        	if(Number(fieldValue) && (fieldArr[i] == "US_PT_ALT" || fieldArr[i] == "US_NDEEP"
		        		|| fieldArr[i] == "US_WDEEP" || fieldArr[i] == "US_PSIZE" || fieldArr[i] == "US_WDIA"
		        		|| fieldArr[i] == "US_ANGLE")){
		        		fieldValue = parseFloat(fieldValue).toFixed(3);
		        	}
		        	str += '<tr><td  width="100">&nbsp;&nbsp;&nbsp;&nbsp;' + fieldCaption +'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(fieldValue||"")+'</td></tr>';
                }
                htmlStr = htmlStr + str + '</table></div>';
                //高亮
                highlightObject(layerID, type, guid, key);
            }
        }
        earth.DatabaseManager.GetXml(strConn);
    };

    var initLineValue = function (layerID, record, layerName){
    	var layer=earth.LayerManager.GetLayerByGUID(layerID);
        var intLayerCode = layer.PipeLineType;
        var fieldArr = [];
        if(intLayerCode >= 1000 && intLayerCode < 2000){//电力管线
        	fieldArr = parent.PS2_config.LineProperty.DLLINE;
        }else if(intLayerCode >= 2000 && intLayerCode < 3000){//电信
        	fieldArr = parent.PS2_config.LineProperty.DXLINE;
        }else if(intLayerCode >= 3000 && intLayerCode < 4000){//给水
        	fieldArr = parent.PS2_config.LineProperty.JSLINE;
        }else if(intLayerCode >= 4000 && intLayerCode < 5000){//排水
        	fieldArr = parent.PS2_config.LineProperty.PSLINE;
        }else if(intLayerCode >= 5000 && intLayerCode < 6000){//燃气
        	fieldArr = parent.PS2_config.LineProperty.RQLINE;
        }else if(intLayerCode >= 6000 && intLayerCode < 7000){//热力
        	fieldArr = parent.PS2_config.LineProperty.RLLINE;
        }else if(intLayerCode >= 7000 && intLayerCode < 8000){//工业
        	fieldArr = parent.PS2_config.LineProperty.GYLINE;
        }else{//其他
			fieldArr = parent.PS2_config.LineProperty.DEFAULTLINE;
        }

        var str = "";
        for(var i = 0; i < fieldArr.length; i++){
        	var fieldCaption = parent.getName(fieldArr[i],1,false);	//显示字段
        	var fieldName = parent.getName(fieldArr[i],1,true);//数据库字段
        	var fieldValue = record[fieldName]||"";
        	var fieldType = "";
        	if(fieldArr[i] == "US_PT_TYPE"){
        		fieldType = "PointType";
        		fieldValue = parent.getCaptionByCustomValue(intLayerCode, fieldType, fieldValue);
        	}else if(fieldArr[i] == "US_ATTACHMENT"){
        		fieldType = "Attachment";
        		fieldValue = parent.getCaptionByCustomValue(intLayerCode, fieldType, fieldValue);
        	}else if(fieldArr[i] == "US_PRESSUR"){
        		fieldType = "Pressure";
        		fieldValue = parent.getCaptionByCustomValue(intLayerCode, fieldType, fieldValue);
        	}else if(fieldArr[i] == "US_LTTYPE"){
        		fieldType = "LayoutType";
        		fieldValue = parent.getCaptionByCustomValue(intLayerCode, fieldType, fieldValue);
        	}else if(fieldArr[i] == "US_LTYPE"){
        		fieldType = "LineType";
        		fieldValue = parent.getCaptionByCustomValue(intLayerCode, fieldType, fieldValue);
        	}else if(fieldArr[i] == "US_PMATER"){
        		fieldType = "MaterialType";
        		fieldValue = parent.getCaptionByCustomValue(intLayerCode, fieldType, fieldValue);
        	}
        	
        	if(fieldArr[i] == "US_SIZE" && fieldValue.indexOf('X') == -1){
        		fieldValue = parseFloat(parseFloat(fieldValue).toFixed(2));
        	}
        	str += '<tr><td  width="100">&nbsp;&nbsp;&nbsp;&nbsp;' + fieldCaption +'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(fieldValue||"")+'</td></tr>';
        }

        return str;
    };

    var stopHighLight = function(){
    	for(var k = 0;parent.earth!=null&&k < highLightObjs.length; k++){
			var currentObj = highLightObjs[k];
			currentObj.StopHighLight();
			highLightObjs.splice(k, 1);
		}
		StatisticsMgr.detachShere();
    };

	var highlightObject = function (layerID, type, guid, key) {

		if(type === "管点"){
			type = "point";
		}
        var layer = earth.LayerManager.GetLayerByGUID(layerID);
        var i = 0;
        var subLayer = null;
        var searchResult = null;
        var obj = null;

    	for (i = 0; i < layer.GetChildCount(); i++) {
            subLayer = layer.GetChildAt(i);
            if (type === "point" || type === "管点") {
                if (subLayer.LayerType === "Container" || subLayer.LayerType === "Vector" || subLayer.LayerType === "Model_container" || subLayer.LayerType === "Well") {//过滤掉缓冲区图层
                    continue;
                }
            } else if (type === "line" || type === "管线") {
                if ((subLayer.LayerType !== "Container" && subLayer.LayerType !== "Container_Og" && subLayer.LayerType !== "Model_container") || subLayer.LayerType === "Vector") continue;
            }
            
            var dt = subLayer.LocalSearchParameter.ReturnDataType;
            subLayer.LocalSearchParameter.ClearSpatialFilter();
        	// subLayer.LocalSearchParameter.ReturnDataType = 0;//0 返回所有数据，1 返回xml数据，2 返回渲染数据
        	subLayer.LocalSearchParameter.ReturnDataType = 1;
        	subLayer.LocalSearchParameter.PageRecordCount = 100;
          
            subLayer.LocalSearchParameter.SetFilter(key, "");
         
            subLayer.LocalSearchParameter.HasDetail = false;
            subLayer.LocalSearchParameter.HasMesh = false;
            searchResult = subLayer.SearchFromLocal();
            subLayer.LocalSearchParameter.ReturnDataType = dt;
            if (searchResult.RecordCount < 1) {
                continue;
            }
            subLayer.LocalSearchParameter.ReturnDataType =1;
            obj = filterByKey(searchResult, key);
            subLayer.LocalSearchParameter.ReturnDataType = dt;
            if (obj != null) {
				//清除其他的高亮
				stopHighLight();
            	//var vecCenter=earth.Facrory.CreateVect3();
               /* var vecCenter = obj.GetLonLatRect().Center;
                earth.GlobeObserver.GotoLookat(vecCenter.X, vecCenter.Y, vecCenter.Z, 50.0, 45.3, 0, 20);   hr 2015年1月19日10:56:00*/
               //cy 清除
                // earth.GlobeObserver.GotoLookat(obj.SphericalTransform.Longitude, obj.SphericalTransform.Latitude, obj.SphericalTransform.Altitude,0, 90, 0, 30);
                obj.ShowHighLight();
                highLightObjs.push(obj);
                //显示气泡
                if(bShow){
                    parent.showHtmlBalloon(obj.SphericalTransform.Longitude, obj.SphericalTransform.Latitude, obj.SphericalTransform.Altitude, htmlStr);
                }
                return;
            }
        }
        //这里有问题 应该是先判断是哪个子图层 然后再把对应的sublayer传递进来 而不是只把最后的一个sublayer传递进来
		//cy去除
        // if (obj == null && type === "point") {
        //    // StatisticsMgr.sphereGotoLookat(guid, subLayer, layerID, key);
        //     StatisticsMgr.sphereGotoLookat(guid, layer.GetChildAt(0), layerID, key, bShow, originCoord, htmlStr);
        // }
        //if (obj == null && type === "管线")
        //{
        //    StatisticsMgr.sphereGotoLookat(guid, layer.GetChildAt(1), layerID, key, bShow, originCoord, htmlStr);
        //}
    };

    var filterByKey = function (searchResult, key) {
        var obj = null;
        if (searchResult.RecordCount === 0) {
            return null;
        }
        searchResult.gotopage(0);
        for (var i = 0; i < searchResult.RecordCount; i++) {
            var objKey = searchResult.GetLocalObjectKey(i);
            if (objKey == key) {
            	obj = searchResult.GetLocalObject(i);
                obj.Underground = true;    // SEObjectFlagType.ObjectFlagUnderground
                return obj;
            }
        }
        return null;
    };

	//根据记录总数与当前页数获取起始索引与结束索引
	var getIndexs = function(index){
		//counts pageIndex
		var pageNum = Math.ceil(counts / pageSize);
		if(index < pageNum){
			beginIndex = index * pageSize;
			endIndex = (index + 1) * pageSize - 1;
			if(index === pageNum - 1 && counts <= endIndex){//如果是尾页
				endIndex = counts - 1;
			}
		}else{
			//页数超过范围
		}
	};

	var bResultIndex;//起始result
	var brecIndex;
	var eResultIndex;
	var eresIndex;

	var beginPageInd;
	var endPageInd;
	var beginResInd;
	var endResInd;
	//获取 起始reslut的起始page页面索引与起始record索引, 结束同理
	var getAllByIndexs = function(resultIndexToRecs, beginIndex, endIndex){
		//resultIndexToRecs 索引与记录个数
		var cot = 0;
		for (var i in resultIndexToRecs) {
			cot += resultIndexToRecs[i];
			if(beginIndex < cot){
				bResultIndex = i;
				brecIndex = beginIndex - (cot - resultIndexToRecs[i]);
				//todo:根据该result的个数计算起始索引所在的页面索引
				break;
			}
		};

		cot = 0;
		for (var i in resultIndexToRecs) {
			cot += resultIndexToRecs[i];
			if(endIndex < cot){
				eResultIndex = i;
				eresIndex = resultIndexToRecs[i] - (cot - endIndex);
				//根据i位置计算页面索引与起始索引
				break;
			}
		};

		//起始:根据reslut与其中的位置来获取第几页的第几个索引值
		if(bResultIndex != undefined && brecIndex != undefined){
			var resultC = resultIndexToRecs[bResultIndex];
			var pageN = Math.ceil(resultC / pageSize);
			for (var m = 0; m < pageN; m++) {
				if( brecIndex < ((m +1) * pageSize) && brecIndex >= m * pageSize){
					//当前页面索引为m
					beginPageInd = m;
					beginResInd = brecIndex - m * pageSize;
				}
			};
		}

		//结束:根据reslut与其中的位置来获取第几页的第几个索引值
		if(eResultIndex != undefined && eresIndex != undefined){
			var eResultC = resultIndexToRecs[eResultIndex];
			var ePageN = Math.ceil(eResultC / pageSize);
			for (var n = 0; n < ePageN; n++) {
				if( eresIndex < ((n +1) * pageSize) && eresIndex >= n * pageSize){
					//当前页面索引为m
					endPageInd = n;
					endResInd = eresIndex - n * pageSize;
				}
			};
		}

		//起始:bResultIndex beginPageInd beginResInd
		//结束:eResultIndex endPageInd endResInd
		//alert(bResultIndex + " " +  beginPageInd  + " " +  beginResInd  + " " +  eResultIndex  + " " +  endPageInd  + " " +  endResInd);
		
	};

	//根据result的索引等获取record记录[获取所有record的入口]
	//bResultIndex, beginPageInd, beginResInd, eResultIndex, endPageInd, endResInd
	var getRecords = function(){
		//同一页面
		if(bResultIndex != undefined && bResultIndex === eResultIndex){
			return getReordsByIndex(bResultIndex);
		}else{//跨页
			return getReordsByIndexs();
		}
	};

	var getReordsByIndex = function(reslutIndex){//reslutIndex, beginPageInd, beginResInd, endPageInd, endResInd
		var param = resultIndexToParam[reslutIndex];
		var layerName = layerGuids.item(param.layerID);
		var result = getQueryHandler(param);
		var records = getRecordsByPage(result, beginPageInd, endPageInd, beginResInd, endResInd, layerName, param.layerID);
		return records;
	};

	//建立键值对关系 获取所有的param与对应的layerName
	var setParams = function(){
		urlParams = [];
		//layerNames = [];
		for (var i = 0; i < resultIndexToParam.length; i++) {
			if( i >= bResultIndex && i <= eResultIndex){
				urlParams.push(resultIndexToParam[i]);
				//layerNames.push(layerGuids.item(resultIndexToParam[i].layerID));
			}
		};
		return [urlParams, layerNames];
	};

	var getReordsByIndexs = function(){//bResultIndex, beginPageInd, beginResInd, eResultIndex, endPageInd, endResInd
		var pms = setParams();
		//var paramLen = pms[0].length;
		paramLen = urlParams.length;
		getInternalResult();
		return internalRecords;
	};

	var getInternalResult = function(){
		internalRecords = [];
		afterRecords = [];
		totalRecords = [];
		beforeRecords = [];
		getResultsHandler();
		//internalRecords = internalRecords.concat(afterRecords, totalRecords, beforeRecords);
		//return internalRecords;
	};

	var loop = 0;
	var internalRecords = [];
	var afterRecords = [];
	var beforeRecords = [];
	var totalRecords = [];

	var getResultsHandler = function(){
		if(urlParams.length === 0 ){
			loop = 0;
			//alert("当前页的记录数目为:" + internalRecords.length);
		}
		if(urlParams && urlParams.length > 0) {//这里的循环控制有问题......
			var perQueryParam = urlParams.shift();//这里要根据索引来计算
			//var layerName = layerNames[loop];
			var indexParam = 0;
			for (var i = resultIndexToParam.length - 1; i >= 0; i--) {
				if(resultIndexToParam[i] === perQueryParam) {
					indexParam = i;
				}
			};
			//var paramIndex = resultIndexToParam.
			var floorNum = Math.floor(indexParam / 2);
			var layerName = layerNames[indexParam];//这里的取值有问题？
			var keys = layerGuids.Keys().toArray();//将obj对象的键值转换成数组   
			var layerGuid;
			//对应图层的guid 很关键......
		    for(var i = 0;i < keys.length; i++){
		    	if(isLoop){
		    		layerGuid = keys[floorNum];//如果layerNames有重复值
		    	}else{
		    		layerGuid = keys[indexParam];//如果layerNames没有重复值
		    	}
		    }    
			var records;
			if(loop === 0){          //首页
				getAfterRecord(perQueryParam, layerName, beginPageInd, beginResInd, layerGuid);
			}else if (loop === paramLen - 1) {        //尾页
				getBeforeRecord(perQueryParam, layerName, endPageInd, endResInd, layerGuid);
			}else {         //中间页
				getTotalRecord(perQueryParam, layerName, layerGuid);
			}
		}		 
	};

	//获取一个result完整的record
	var getTotalRecord = function(perQueryParam, layerName, layerGuid){
		getTotalQueryHandler(perQueryParam, layerName, layerGuid);
	};

	var getTotalQueryHandler = function(perQueryParam, layerName, layerGuid){
		var layerID = perQueryParam.layerID;
		var feature =  perQueryParam.feature;
		var filter = perQueryParam.filter;
		var queryType = perQueryParam.queryType;
		var queryTableType = perQueryParam.queryTableType;

		var layer = earth.LayerManager.GetLayerByGUID(layerID);
        var subLayer = null;
        for(var i= 0, len=layer.GetChildCount(); i<len; i++){
            subLayer = layer.GetChildAt(i);
            if(subLayer.LayerType == "Container" || subLayer.LayerType == "Container_Og" || subLayer.LayerType === "Model_container"){
                break;
            }
        }
        if(subLayer == null){
            return;
        }

        var param = subLayer.QueryParameter;
        if (param == null) {
            return null;
        }
        param.ClearCompoundCondition();
        param.ClearSpatialFilter();
        param.ClearRanges();
        param.Filter = "";
        if(filter!=null){
           	if(typeof(filter)=="object"){
        		param.Filter = filter[queryTableType];
        	}else{
        		param.Filter = filter;
        	}
        }
        if(feature!=null){
            param.SetSpatialFilter(feature);
        }
        if (compCondition != null) {
            var cc = compCondition.split(",");
            param.SetCompoundCondition(cc[0], cc[1], parseFloat(cc[2]).toFixed(3));
        }
        if(queryTableType!=null){
            param.QueryTableType=queryTableType;//[0] [0,1]
        }
        param.QueryType = queryType;
        param.PageRecordCount = pageSize;
        var result = new Object();
        result = subLayer.SearchFromGISServer();
        if(result){
        	if(result.RecordCount != 0){
        		getTotalRecord2(result, layerName, layerGuid);
        	}
	    	loop += 1;
	    	internalRecords = [];
	    	internalRecords = internalRecords.concat(afterRecords, totalRecords, beforeRecords);
	    	getResultsHandler();
        }
	};

	var getTotalRecord2 = function(result, layerName, layerGuid){
		var recordNum = result.RecordCount;
		var pageNum = Math.ceil(recordNum / pageSize);
		if(pageNum > 0){
			for (var i = 0; i < pageNum; i++) {
				var currentRecords = getRecordByPage(result, i, layerName, layerGuid);
				totalRecords = totalRecords.concat(currentRecords);
			};
		}
		loop += 1;
    	getResultsHandler();
	};

	var getRecordByPage = function(result, pageIndex, layerName, layerGuid){
		var bPage = result.gotoPage(pageIndex);
		var json = parent.$.xml2json(bPage);
        var records = json.Result.Record;
        if(records == undefined){
        	return;
        }
        var type = json.Result.geometry;
        var displayType = type === "point" ? "管点" : "管线";
        type = type === "point" ? "point" : "line";
        var bRecords = [];
        if(records.length && records.length > 0){
	        for (var i = 0; i < records.length; i++) {
	        	bRecords.push(records[i]);
	        	//绑定每一个layer的名称到Record
	        	recordName.item(records[i]) = layerName;
	        	recordType.item(records[i]) = displayType;
	        	recordGuids.item(records[i]) = layerGuid;
	        	if(records[i].US_FEATURE === ""){
	        		records[i].US_FEATURE = displayType;
	        	}
	        }
	    }else {//说明只有一个record记录 这个时候不会返回数组(xml2json的bug)
    		bRecords.push(records);
    		//绑定每一个layer的名称到Record
    		recordName.item(records) = layerName;
    		recordType.item(records) = displayType;
    		recordGuids.item(records) = layerGuid;
    		if(records.US_FEATURE === ""){
    			records.US_FEATURE = displayType;
    		}
        }
        return bRecords;
	}

	var getBeforeRecord = function(perQueryParam, layerName, endPageInd, endResInd, layerGuid){
		getBeforeQueryHandler(perQueryParam, layerName, endPageInd, endResInd, layerGuid);
	};

	var getBeforeQueryHandler = function(perQueryParam, layerName, endPageInd, endResInd, layerGuid){
		var layerID = perQueryParam.layerID;
		var feature =  perQueryParam.feature;
		var filter = perQueryParam.filter;
		var queryType = perQueryParam.queryType;
		var queryTableType = perQueryParam.queryTableType;

		var layer = earth.LayerManager.GetLayerByGUID(layerID);
        var subLayer = null;
        for(var i= 0, len=layer.GetChildCount(); i<len; i++){
            subLayer = layer.GetChildAt(i);
            if(subLayer.LayerType == "Container" || subLayer.LayerType == "Container_Og" || subLayer.LayerType === "Model_container"){
                break;
            }
        }
        if(subLayer == null){
            return;
        }

        var param = subLayer.QueryParameter;
        if (param == null) {
            return null;
        }
        param.ClearCompoundCondition();
        param.ClearSpatialFilter();
        param.ClearRanges();
        param.Filter = "";
        if(filter!=null){
            if(typeof(filter)=="object"){
        		param.Filter = filter[queryTableType];
        	}else{
        		param.Filter = filter;
        	}
        }
        if(feature!=null){
            param.SetSpatialFilter(feature);
        }
        if (compCondition != null) {
            var cc = compCondition.split(",");
            param.SetCompoundCondition(cc[0], cc[1], parseFloat(cc[2]).toFixed(3));
        }
        if(queryTableType!=null){
            param.QueryTableType=queryTableType;//[0] [0,1]
        }
        param.QueryType = queryType;
        param.PageRecordCount = pageSize;
        var result = new Object();
        result = subLayer.SearchFromGISServer();
        if(result){
        	if(result.RecordCount != 0){
        		beforeRecords = getBeforeRecord2(result, endPageInd, endResInd, layerName, layerGuid);
        	}
	    	loop += 1;
	    	internalRecords = [];
	    	internalRecords = internalRecords.concat(afterRecords, totalRecords, beforeRecords);
	    	getResultsHandler();
        }
	};

	var getBeforeRecord2 = function(result, pageIndex, endIndex, layerName, layerGuid){
		var pageNum = Math.ceil(result.RecordCount / pageSize);
		var bRecords = [];
		for (var i = 0; i < pageNum; i++) {
			if(i < pageIndex){//处理起始所有
				var bPage = result.gotoPage(i);
				var json = parent.$.xml2json(bPage);
		        var records = json.Result.Record;
		        if(records == undefined){
		        	continue;
		        }
		        var type = json.Result.geometry;
		        var displayType = type === "point" ? "管点" : "管线";
		        type = type === "point" ? "point" : "line";
		        if(records.length && records.length > 0){
		        	for (var j = 0; j < records.length; j++) {
			        	var res = records[j];
		        		bRecords.push(res);
		        		//绑定每一个layer的名称到Record
		        		recordName.item(res) = layerName;
		        		recordType.item(res) = displayType;
		        		recordGuids.item(res) = layerGuid;
		        		if(res.US_FEATURE === ""){
		        			res.US_FEATURE = displayType;
		        		}
			        }
		        } else {//说明只有一个record记录 这个时候不会返回数组(xml2json的bug)
		        		bRecords.push(records);
		        		//绑定每一个layer的名称到Record
		        		recordName.item(records) = layerName;
		        		recordType.item(records) = displayType;
		        		recordGuids.item(records) = layerGuid;
		        		if(records.US_FEATURE === ""){
		        			records.US_FEATURE = displayType;
		        		}
		        }
			}
			if( i === pageIndex){
				var bPage = result.gotoPage(pageIndex);
				var json = parent.$.xml2json(bPage);
		        var records = json.Result.Record;
		        if(records == undefined){
		        	continue;
		        }
		        var type = json.Result.geometry;
		        var displayType = type === "point" ? "管点" : "管线";
		        type = type === "point" ? "point" : "line";
		        if(records.length && records.length > 0){
			        for (var k = 0; k < records.length; k++) {
			        	if (k <= endIndex) {
			        		var res = records[k];
			        		bRecords.push(res);
			        		//绑定每一个layer的名称到Record
			        		recordName.item(res) = layerName;
			        		recordType.item(res) = displayType;
			        		recordGuids.item(res) = layerGuid;
			        		if(res.US_FEATURE === ""){
			        			res.US_FEATURE = displayType;
			        		}
			        		//records[i].US_FEATURE ? records.US_FEATURE : displayType
			        	}
			        }
		        }else {
	        		bRecords.push(records);
	        		//绑定每一个layer的名称到Record
	        		recordName.item(records) = layerName;
	        		recordType.item(records) = displayType;
	        		recordGuids.item(records) = layerGuid;
	        		if(records.US_FEATURE === ""){
	        			records.US_FEATURE = displayType;
	        		}
		        }
			}
		};
        return bRecords;
	};

	var getAfterRecord = function(perQueryParam, layerName, beginPageInd, beginResInd, layerGuid){
		getAfterQueryHandler(perQueryParam, layerName, beginPageInd, beginResInd, layerGuid);
	};

	var getAfterQueryHandler = function(perQueryParam, layerName, beginPageInd, beginResInd, layerGuid){
		var layerID = perQueryParam.layerID;
		var feature =  perQueryParam.feature;
		var filter = perQueryParam.filter;
		var queryType = perQueryParam.queryType;
		var queryTableType = perQueryParam.queryTableType;

		var layer = earth.LayerManager.GetLayerByGUID(layerID);
        var subLayer = null;
        for(var i= 0, len=layer.GetChildCount(); i<len; i++){
            subLayer = layer.GetChildAt(i);
            if(subLayer.LayerType == "Container" || subLayer.LayerType == "Container_Og" || subLayer.LayerType === "Model_container"){
                break;
            }
        }
        if(subLayer == null){
            return;
        }

        var param = subLayer.QueryParameter;
        if (param == null) {
            return null;
        }
        param.ClearCompoundCondition();
        param.ClearSpatialFilter();
        param.ClearRanges();
        if (compCondition != null) {
            var cc = compCondition.split(",");
            param.SetCompoundCondition(cc[0], cc[1], parseFloat(cc[2]).toFixed(3));
        }
        param.Filter = "";
        if(filter!=null){
            if(typeof(filter)=="object"){
        		param.Filter = filter[queryTableType];
        	}else{
        		param.Filter = filter;
        	}
        }
        if(feature!=null){
            param.SetSpatialFilter(feature);
        }
        if(queryTableType!=null){
            param.QueryTableType=queryTableType;//[0] [0,1]
        }
        param.QueryType = queryType;
        param.PageRecordCount = pageSize;
        var result = new Object();
        result = subLayer.SearchFromGISServer();
        if(result){
        	if(result.RecordCount != 0){
        		afterRecords = getAfterRecord2(result, beginPageInd, beginResInd, layerName, layerGuid);
        	}
	    	loop += 1;
	    	internalRecords = [];
	    	internalRecords = internalRecords.concat(afterRecords, totalRecords, beforeRecords);
	    	getResultsHandler();
        }
	};

	var getAfterRecord2 = function(result, pageIndex, beginIndex, layerName, layerGuid){
		var pageNum = Math.ceil(result.RecordCount / pageSize);
		var bRecords = [];
		for (var i = 0; i < pageNum; i++) {
			if(i === pageIndex){
				var bPage = result.gotoPage(i);
				var json = parent.$.xml2json(bPage);
		        var records = json.Result.Record;
		        if(records == undefined){
		        	continue;
		        }
		        var type = json.Result.geometry;
		        var displayType = type === "point" ? "管点" : "管线";
		        type = type === "point" ? "point" : "line";
		        if(records.length && records.length > 0){
		        	for (var j = 0; j < records.length; j++) {
			        	if (j >= beginIndex) {
			        		var res = records[j];
			        		bRecords.push(res);
			        		//绑定每一个layer的名称到Record
			        		recordName.item(res) = layerName;
			        		recordType.item(res) = displayType;
			        		recordGuids.item(res) = layerGuid;
			        		if(res.US_FEATURE === ""){
			        			res.US_FEATURE = displayType;
			        		}
			        	}
		        	}
		        }else {//说明只有一个record记录 这个时候不会返回数组(xml2json的bug)
	        		bRecords.push(records);
	        		//绑定每一个layer的名称到Record
	        		recordName.item(records) = layerName;
	        		recordType.item(records) = displayType;
	        		recordGuids.item(records) = layerGuid;
	        		if(records.US_FEATURE === ""){
	        			records.US_FEATURE = displayType;
	        		}
		        }
			}
			if(i > pageIndex){
				var bPage = result.gotoPage(i);
				var json = parent.$.xml2json(bPage);
		        var records = json.Result.Record;
		        var type = json.Result.geometry;
		        var displayType = type === "point" ? "管点" : "管线";
		        type = type === "point" ? "point" : "line";
		        if(records.length && records.length > 0){
			        for (var j = 0; j < records.length; j++) {
			        	var res = records[j];
		        		bRecords.push(res);
		        		//绑定每一个layer的名称到Record
		        		recordName.item(res) = layerName;
		        		recordType.item(res) = displayType;
		        		recordGuids.item(res) = layerGuid;
		        		if(res.US_FEATURE === ""){
		        			res.US_FEATURE = displayType;
		        		}
			        }
			    }else {//说明只有一个record记录 这个时候不会返回数组(xml2json的bug)
	        		bRecords.push(records);
	        		//绑定每一个layer的名称到Record
	        		recordName.item(records) = layerName;
	        		recordType.item(records) = displayType;
	        		recordGuids.item(records) = layerGuid;
	        		if(records.US_FEATURE === ""){
	        			records.US_FEATURE = displayType;
	        		}
		        }
			}
		};
        return bRecords;
	};

	var getQueryHandler = function(perQueryParam){
		var layerID = perQueryParam.layerID;
		var feature =  perQueryParam.feature;
		var filter = perQueryParam.filter;
		var queryType = perQueryParam.queryType;
		var queryTableType = perQueryParam.queryTableType;

		var layer = earth.LayerManager.GetLayerByGUID(layerID);
        var subLayer = null;
        for(var i= 0, len=layer.GetChildCount(); i<len; i++){
            subLayer = layer.GetChildAt(i);
            if(subLayer.LayerType == "Container" || subLayer.LayerType == "Container_Og" || subLayer.LayerType === "Model_container"){
                break;
            }
        }
        if(subLayer == null){
            return;
        }

        var param = subLayer.QueryParameter;
        if (param == null) {
            return null;
        }
        param.ClearCompoundCondition();
        param.ClearSpatialFilter();
        param.ClearRanges();
        param.Filter = "";
        if(filter!=null){
            if(typeof(filter)=="object"){
        		param.Filter = filter[queryTableType];
        	}else{
        		param.Filter = filter;
        	}
        }
        if (compCondition != null) {
            var cc = compCondition.split(",");
            param.SetCompoundCondition(cc[0], cc[1], parseFloat(cc[2]).toFixed(3));
        }
        if(feature!=null){
            param.SetSpatialFilter(feature);
        }
        if(queryTableType!=null){
            param.QueryTableType=queryTableType;//[0] [0,1]
        }
        param.QueryType = queryType;
        param.PageRecordCount = pageSize;
        var result = new Object();
        result = subLayer.SearchFromGISServer();
        return result;
	};
//生意人，商人，企业家
	var getRecordsByPage = function(result, beginPageIndex, endPageIndex, beginIndex, endIndex, layerName, layerGuid){
		//起始页
		var bPage = result.gotoPage(beginPageIndex);
		if(result.RecordCount > 0){

		var json = parent.$.xml2json(bPage);
        var records = json.Result.Record;
        if(records == undefined|| records == "undefined"){
    		return;
        }
        var type = json.Result.geometry;
        var displayType = type === "point" ? "管点" : "管线";
        type = type === "point" ? "point" : "line";
        var bRecords = [];

        if(beginPageIndex === endPageIndex){ //endIndex >= beginIndex
        	if(records.length && records.length > 0){
	        	for (var i = 0; i < records.length; i++) {
		        	if (i >= beginIndex && i <=  endIndex) {
		        		//alert(beginIndex + " " + endIndex);
		        		bRecords.push(records[i]);
		        		//绑定每一个layer的名称到Record
	        			recordName.item(records[i]) = layerName;
	        			recordType.item(records[i]) = displayType;
	        			recordGuids.item(records[i]) = layerGuid;
		        		if(records[i].US_FEATURE === ""){
			        		records[i].US_FEATURE = displayType;
			        	}
		        	}
		        }
		    }else {//说明只有一个record记录 这个时候不会返回数组(xml2json的bug)
	    		bRecords.push(records);
	    		//绑定每一个layer的名称到Record
	    		recordName.item(records) = layerName;
	    		recordType.item(records) = displayType;
	    		recordGuids.item(records) = layerGuid;
	    		if(records.US_FEATURE === ""){
	    			records.US_FEATURE = displayType;
	    		}
	        }
        } else {
        	//起始页
        	if(records.length && records.length > 0){
	        	for (var i = 0; i < records.length; i++) {
		        	if (i >= beginIndex) {
		        		bRecords.push(records[i]);
		        		//绑定每一个layer的名称到Record
	        			recordName.item(records[i]) = layerName;
	        			recordType.item(records[i]) = displayType;
	        			recordGuids.item(records[i]) = layerGuid;
		        		if(records[i].US_FEATURE === ""){
			        		records[i].US_FEATURE = displayType;
			        	}
		        	}
		        }
		    }else {//说明只有一个record记录 这个时候不会返回数组(xml2json的bug)
	    		bRecords.push(records);
	    		//绑定每一个layer的名称到Record
	    		recordName.item(records) = layerName;
	    		recordType.item(records) = displayType;
	    		recordGuids.item(records) = layerGuid;
	    		if(records.US_FEATURE === ""){
	    			records.US_FEATURE = displayType;
	    		}
	        }

	        var mRecords = [];
	        var intervalPage = endPageIndex - beginPageIndex;
	        if (intervalPage > 1) {//至少有一个完整页(这里只处理完整页 首页与尾页单独处理)
	        	for (var k = 1; k < intervalPage; k++) {
	        		var mPage = result.gotoPage(k+beginPageIndex);
	        		var mjson = parent.$.xml2json(mPage);
	        		var mRes = mjson.Result.Record;
	        		if(mRes.length && mRes.length > 0){
		        		for (var m = 0; m < mRes.length; m++) {
		        			mRecords.push(mRes[m]);
		        			//绑定每一个layer的名称到Record
	        				recordName.item(mRes[m]) = layerName;
	        				recordType.item(mRes[m]) = displayType;
	        				recordGuids.item(mRes[m]) = layerGuid;
		        			if(mRes[m].US_FEATURE === ""){
				        		mRes[m].US_FEATURE = displayType;
				        	}
		        		}
		        	}else {//说明只有一个record记录 这个时候不会返回数组(xml2json的bug)
			    		mRecords.push(mRes);
			    		//绑定每一个layer的名称到Record
			    		recordName.item(mRes) = layerName;
			    		recordType.item(mRes) = displayType;
			    		recordGuids.item(mRes) = layerGuid;
			    		if(mRes.US_FEATURE === ""){
			    			mRes.US_FEATURE = displayType;
			    		}
	        		}
	        	};
	        }

	        //结束页
			var ePage = result.gotoPage(endPageIndex);
			var ejson = parent.$.xml2json(ePage);
	        var res = ejson.Result.Record;
	        var eRecords = [];
	        if(res.length && res.length > 0){
		        for (var j = 0; j < res.length; j++) {
		        	if (j <= endIndex) { // j <= endIndex
		        		eRecords.push(res[j]);
		        		//绑定每一个layer的名称到Record
	        			recordName.item(res[j]) = layerName;
	        			recordType.item(res[j]) = displayType;
	        			recordGuids.item(res[j]) = layerGuid;
		        		if(res[j].US_FEATURE === ""){
				        	res[j].US_FEATURE = displayType;
				        }
		        	}
		        }
		    }else {//说明只有一个record记录 这个时候不会返回数组(xml2json的bug)
	    		eRecords.push(res);
	    		//绑定每一个layer的名称到Record
	    		recordName.item(res) = layerName;
	    		recordType.item(res) = displayType;
	    		recordGuids.item(res) = layerGuid;
	    		if(res.US_FEATURE === ""){
	    			res.US_FEATURE = displayType;
	    		}
    		}
	        bRecords = bRecords.concat(mRecords, eRecords);
        }
    }
        //该页面全部记录集
        return bRecords;
	};

	///////////////////////////////////////////////////////
	//获取总记录数
	///////////////////////////////////////////////////////
	var getPageNum = function(){
		getNum();
	};

	var getNum = function(){
		_query();
	};

	var indRes = 0;
	var counts = 0;
	var _query = function(){
		if(params && params.length > 0) {
			var perQueryParam = params.shift();
			resultIndexToParam[indRes] = perQueryParam;
			loopControl(perQueryParam);
		}
	};
	var paramsLayerNames = [];
	/**
	 * 第一次遍历查询 为了获取结果集中的记录总数 便于后续的分页计算
	 * @param  {[type]} perQueryParam [description]
	 * @return {[type]}               [description]
	 */
	var loopControl = function(perQueryParam){
		
		var layerID = perQueryParam.layerID;
		var feature = perQueryParam.feature;
		var filter = perQueryParam.filter;
		var queryType = perQueryParam.queryType;
		var queryTableType = perQueryParam.queryTableType;

		var layer = earth.LayerManager.GetLayerByGUID(layerID);
		paramsLayerNames.push({layerName:layer.name, param:perQueryParam});
        var subLayer = null;
        for(var i= 0, len=layer.GetChildCount(); i<len; i++){
            subLayer = layer.GetChildAt(i);
            if(subLayer.LayerType == "Container" || subLayer.LayerType == "Container_Og" || subLayer.LayerType === "Model_container"){
                break;
            }
        }
        if(subLayer == null){
            return;
        }

        var param = subLayer.QueryParameter;
        if (param == null) {
            return null;
        }
        param.ClearCompoundCondition();
        param.ClearSpatialFilter();
        param.ClearRanges();
        if (compCondition != null) {
            var cc = compCondition.split(",");
            param.SetCompoundCondition(cc[0], cc[1], parseFloat(cc[2]).toFixed(3));
            //param.SetCompoundCondition("road",京哈路,"50.000000");
        }
        param.Filter = "";
        if(filter!=null){
        	if(typeof(filter)=="object"){
        		param.Filter = filter[queryTableType];
        	}else{
        		param.Filter = filter;
        	}
        }
        if(feature!=null){
            param.SetSpatialFilter(feature);
        }
        if(queryTableType!=null){
            param.QueryTableType=queryTableType;//[0] [0,1]
        }
        param.QueryType = queryType;
        param.PageRecordCount = 1;
        var result = new Object();
        result = subLayer.SearchFromGISServer();
        if(result.RecordCount < 0){
        	counts += 0;
        	resultIndexToRecs[indRes] = 0;
        	indRes += 1;
        }else{
        	counts += result.RecordCount;
        	resultIndexToRecs[indRes] = result.RecordCount;
        	indRes += 1;
        }
        _query();
	};
	///////////////////////////////////////////////////////
	//获取总记录数完毕!
	///////////////////////////////////////////////////////

	/**
	 * 根据页面索引获取该页面所有的record(记录)
	 * 起始索引的判断有问题...todo
	 * @param  {Number} index 页面索引
	 * @return {Array}       
	 */
	var beginIndex;
	var endIndex;
	var getIndex = function(index){
		beginIndex = index * pageSize;
		endIndex = (index + 1) * pageSize - 1;
		_query(beginIndex, endIndex);
		//根据位置获取records
		var records = getRecordByIndexs(beginResultIndex, endResultIndex, beginPageIndex, endPageIndex, beginPageRecordIndex, endPageRecordIndex);
		return records;
	};
    var getTotalNum = function(){
        return counts;
    };
    helper.getTotalNum = getTotalNum;
	helper.initParams = _initParams;
	helper.setShow = setShow;
	helper.stopHighLight = stopHighLight;
	//cy加
	helper.highlightObject = highlightObject;
	return helper;
};
