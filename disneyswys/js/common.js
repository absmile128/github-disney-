/**
 * 打开子窗口
 * @param url - 子窗口地址
 * @param params - 父窗口传给子窗口的参数
 * @param width - 子窗口宽度
 * @param height - 子窗口高度
 * @returns 子窗口传给父窗口的参数
 */
function openDialog(url,params,width,height){
    var is_opera = /opera/i.test(navigator.userAgent);  
    var is_ie = (/msie/i.test(navigator.userAgent) && !is_opera);
    var is_ie_6 = (is_ie && /msie 6\.0/i.test(navigator.userAgent));
    
    var value = "";
    if(is_ie_6){
        height = height + 50;
        value = window.showModalDialog(url,params,"menubar:no;dialogWidth:"+width+"px;status:no;title:no;help:no;resizable:no;scroll:yes;location:no;toolbar:no;dialogHeight:"+height+"px");
    }else{
        value = window.showModalDialog(url,params,"menubar:no;dialogWidth:"+width+"px;status:no;title:no;help:no;resizable:no;scroll:yes;location:no;toolbar:no;dialogHeight:"+height+"px");
    }
    return value;
}

/**
 * 将xml字符串转换为dom对象
 * @param xmlStr - xml要转换的字符串对象
 * @returns dom对象
 */
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
}

/**
 * 将指定的XML文件转换为dom对象
 * @param file - XML文件
 * @returns dom对象
 */
function loadXMLFile(file){	
	var xmlDoc = null;
	if(window.ActiveXObject){
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	}else if(document.implementation.createDocument){
		xmlDoc = document.implementation.createDocument("","",null);
	}else{
		alert("error");
	}
	if(xmlDoc != null){
		xmlDoc.async = false;
		xmlDoc.load(file);
	}
	return xmlDoc;
}

/**
 * 通过ID查找节点
 * @param xmlData-xml字符串或xml dom对象
 * @param id-要查找的节点的ID
 * @returns 查找到的节点
 */
function lookupNodeById(xmlData,id){
	if (xmlData == undefined || xmlData == null) return null;
	
	var xmlDoc = null;
	if (typeof(xmlData) == "string"){
		xmlDoc = loadXMLStr(xmlData);
	}else{
		xmlDoc = xmlData;
	}
	
	var resultNode = null;	//返回节点
	
	//判断当前元素
	var rootNode = xmlDoc.documentElement;
	
	if (rootNode!=undefined){
		for (var i=0; rootNode.attributes!=null && rootNode.attributes.length>0 && i<rootNode.attributes.length; i++){
			if (rootNode.attributes[i].name=="id" && rootNode.attributes[i].value==id){
				resultNode = rootNode;
				return rootNode;
			}
		}
	}else{
		rootNode = xmlDoc;
	}
	
	for (var i=0; rootNode!=null && i<rootNode.childNodes.length; i++){	
		var node1 = rootNode.childNodes[i];	//子节点
		
		//判断当前元素
		if (node1.attributes!=null && node1.attributes.length>0){
			for (var j=0; j<node1.attributes.length; j++){
				if (node1.attributes[j].name=="id" && node1.attributes[j].value==id){
					resultNode = node1;
					break;
				}
			}
		}
		if (resultNode != null) break;
		
		//判断当前节点下的子元素
		if (node1.childNodes.length > 0){
			resultNode = this.lookupNodeById(node1, id);
			if (resultNode != null) break;
		}
	}
	
	return resultNode;
}

/**
 * 通过Name查找节点
 * @param xmlData-xml字符串或xml dom对象
 * @param name-要查找的节点的Name
 * @returns 查找到的节点
 */
function lookupNodeByName(xmlData,name){
	if (xmlData == undefined || xmlData == null) return null;
	
	var xmlDoc = null;
	if (typeof(xmlData) == "string"){
		xmlDoc = loadXMLStr(xmlData);
	}else{
		xmlDoc = xmlData;
	}
	
	var resultNode = null;	//返回节点
	
	//判断当前元素
	var rootNode = xmlDoc.documentElement;
	
	if (rootNode!=undefined){
		for (var i=0; rootNode.attributes!=null && rootNode.attributes.length>0 && i<rootNode.attributes.length; i++){
			if (rootNode.attributes[i].name=="name" && rootNode.attributes[i].value==name){
				resultNode = rootNode;
				return rootNode;
			}
		}
	}else{
		rootNode = xmlDoc;
	}
	
	for (var i=0; rootNode!=null && i<rootNode.childNodes.length; i++){	
		var node1 = rootNode.childNodes[i];	//子节点
		
		//判断当前元素
		if (node1.attributes!=null && node1.attributes.length>0){
			for (var j=0; j<node1.attributes.length; j++){
				if (node1.attributes[j].name=="name" && node1.attributes[j].value==name){
					resultNode = node1;
					break;
				}
			}
		}
		if (resultNode != null) break;
		
		//判断当前节点下的子元素
		if (node1.childNodes.length > 0){
			resultNode = this.lookupNodeByName(node1, name);
			if (resultNode != null) break;
		}
	}
	
	return resultNode;
}

/**
 * 功能：创建带有属性的Element节点
 * 参数：tagName-标签名；attrArr-属性列表；xmlDoc-添加的dom对象
 * 返回值：Element节点
 */
var createElementNode = function(tagName,attrArr,xmlDoc){
	var elementNode = xmlDoc.createElement(tagName);
	if(attrArr != null){
		for(var i=0; i<attrArr.length; i++){
			var attr = attrArr[i];
			elementNode.setAttribute(attr.name, attr.value);
		}
	}
	return elementNode;
};

/**
 * 功能：创建没有属性的Element节点
 * 参数：tagName-标签名；textValue-节点文字；xmlDoc-添加的dom对象
 * 返回值：Element节点
 */
var createElementText = function(tagName,textValue,xmlDoc){
	var elementNode = xmlDoc.createElement(tagName);
	elementNode.text = textValue;
	return elementNode;
};





//js获取项目根路径，如： http://localhost:8083/uimcardprj
function getRootPath(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return(localhostPaht+projectName);




}

/**
 * 功能：将普通table导出成Excel文档
 * 参数：tableId - 要导出的表对象; columns - 列标题数组
 * 返回：无
 */
 function importExcelByCommonTable (tabObj,columns_label,columns){
    var xls = null;
    try{
        xls = new ActiveXObject("Excel.Application");
    }catch(e){
        alert("无法启动Excel\n\n如果您确信您的电脑中已经安装了Excel, 那么请调整IE的安全级别\n" +
            "具体的操作：\n" +
            "工具 -> Internet选项 -> 安全 -> 自定义级别 -> 对没有标记为安全的ActiveX进行初始化和脚本运行 -> 启用");
        return;
    }
    xls.visible = true;
    try{
    var xlsBook = xls.Workbooks.Add;
    var xlsSheet = xlsBook.WorkSheets(1);

    for(var k=0; k<columns_label.length; k++){
        xlsSheet.Cells(1, k+1).Value = columns_label[k];
    }



    var rows = tabObj.rows;
    for(var i=0; i<rows.length; i++){
         var columslength=  rows[i].cells.length;
        for (var k=0; k<columslength; k++){

                    xlsSheet.Cells(i+2,k+1) = rows[i].cells[k].innerText;

                }

    }
    }
    catch(e){
        alert("导出Excel错误！");
        return;
    }
    xls.UserControl = true;
    alert("成功导出Excel");

}


function getClientPath(){

   var path= earth.RootPath  ;    //如：C:\stampGIS_64\root

    var pos=path.indexOf("root");
    //获取主机地址，如： http://localhost:8083
    var clientpath=path.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    return clientpath;  //如：C:\stampGIS_64




}


function getClientPath2(earth){

    var path= earth.RootPath  ;    //如：C:\stampGIS_64\root

    var pos=path.indexOf("root");
    //获取主机地址，如： http://localhost:8083
    var clientpath=path.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    return clientpath;  //如：C:\stampGIS_64




}
 //cy
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); 
    return null;
}

//cy 取文件全名名称
function GetFileName(filepath) {
    if (filepath != "") {
        var names = filepath.split("/");
        return names[names.length - 1];
    }
}
