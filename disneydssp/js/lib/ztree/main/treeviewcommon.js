function treeViewDataLoader(funcObject, ajaxObj,async,rSeed)
{
    this.xmlDoc="";
    if (typeof(async)!= "undefined")
    this.async = async;
    else this.async = true;
    this.onloadAction=funcObject||null;
    this.rootItem=ajaxObj||null;
    this.waitCall=null;
    this.rSeed=rSeed||false;
    return this
};
treeViewDataLoader.prototype.waitLoadFunction=function(ajaxObj)
{
    var firstTime=true;
    this.check=function ()
    {
        if ((ajaxObj)&&(ajaxObj.onloadAction!=null))
        {
            if ((!ajaxObj.xmlDoc.readyState)||(ajaxObj.xmlDoc.readyState == 4))
            {
				
				if(firstTime == true)
				{
					firstTime=false;
	
					ajaxObj.onloadAction(ajaxObj.rootItem,null,null,null,ajaxObj);
					
					if (ajaxObj.waitCall)
					{
						ajaxObj.waitCall();
						ajaxObj.waitCall=null
					}
				}
            }
        }
    };
    return this.check
};
treeViewDataLoader.prototype.getXMLTopNode=function(tagName,oldObj)
{
    if (this.xmlDoc.responseXML)
    {
        var temp=this.xmlDoc.responseXML.getElementsByTagName(tagName);
        var element=temp[0]
    }
    else
		var element=this.xmlDoc.documentElement;
    if (element)
    {
        this.findAgain=false;
        return element
    };
    if ((IE)&&(!this.findAgain))
    {
        var xmlString=this.xmlDoc.responseText;
        var oldObj=this.xmlDoc;
        this.findAgain=true;
        this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        this.xmlDoc.async=false;
        this.xmlDoc["loadXM"+"L"](xmlString);
        return this.getXMLTopNode(tagName,oldObj)
    };
    treeException.throwError("LoadXML","Incorrect XML",[(oldObj||this.xmlDoc),this.rootItem]);
    return document.createElement("DIV")
};
treeViewDataLoader.prototype.loadXMLString=function(xmlString)
{
	
	if (window.preloadXmlString)
	{
		//alert(window.preloadXmlString);
		window.preloadXmlString();
	}
    {
        try
        {
			
            var parser = new DOMParser();
            this.xmlDoc = parser.parseFromString(xmlString,"text/xml")
        }
        catch(e)
        {
            this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            this.xmlDoc.async=this.async;
            this.xmlDoc["loadXM"+"L"](xmlString)
        }
    };
    this.onloadAction(this.rootItem,null,null,null,this);
    if (this.waitCall)
    {
        this.waitCall();
        this.waitCall=null
    }
};
treeViewDataLoader.prototype.loadXML=function(filePath,postMode,postVars,rpc)
{
	
    if (this.rSeed)filePath+=((filePath.indexOf("?")!=-1)?"&":"?")+"a_dhx_rSeed="+(new Date()).valueOf();
    this.filePath=filePath;
    if ((!IE)&&(window.XMLHttpRequest))
		this.xmlDoc = new XMLHttpRequest();
    else
    {		
        if (document.implementation && document.implementation.createDocument)
        {
            this.xmlDoc = document.implementation.createDocument("", "", null);
			
            this.xmlDoc.onload = new this.waitLoadFunction(this);
            this.xmlDoc.load(filePath);
            return
        }
        else
			this.xmlDoc = new ActiveXObject("Microsoft.XMLHTTP")
    };
    if (this.async)
		this.xmlDoc.onreadystatechange=new this.waitLoadFunction(this);

    this.xmlDoc.open(postMode?"POST":"GET",filePath,this.async);

    if (rpc)
    {
        this.xmlDoc.setRequestHeader("User-Agent", "dhtmlxRPC v0.1 (" + navigator.userAgent + ")");
        this.xmlDoc.setRequestHeader("Content-type", "text/xml")
    }
    else
		if (postMode)
			this.xmlDoc.setRequestHeader('Content-type','application/x-www-form-urlencoded');

    this.xmlDoc.send(null||postVars);

    if (!this.async)
	{
		
		(new this.waitLoadFunction(this))()
	}
};
treeViewDataLoader.prototype.destroy=function()
{
    this.onloadAction=null;
    this.rootItem=null;
    this.xmlDoc=null;
    return null
};
function callerFunction(funcObject,ajaxObj)
{
    this.handler=function(e)
    {
        if (!e)e=window.event;
        funcObject(e,ajaxObj);
        return true
    };
    return this.handler
};
function getAbsoluteLeft(htmlObject)
{
    var xPos = htmlObject.offsetLeft;
    var temp = htmlObject.offsetParent;
    while (temp != null)
    {
        xPos += temp.offsetLeft;
        temp = temp.offsetParent
    };
    return xPos
};
function getAbsoluteTop(htmlObject)
{
    var yPos = htmlObject.offsetTop;
    var temp = htmlObject.offsetParent;
    while (temp != null)
    {
        yPos += temp.offsetTop;
        temp = temp.offsetParent
    };
    return yPos
};
function convertStringToBoolean(inputString)
{
    if (typeof(inputString)=="string") inputString=inputString.toLowerCase();
    switch(inputString)
    {
        case "1":
        case "true":
        case "yes":
        case "y":
        case 1:
        case true:
        return true;
        break;
        default: return false
    }
};
function getUrlSymbol(str)
{
    if(str.indexOf("?")!=-1)
    return "&"
    else
    return "?"
};
function treeViewDragObject()
{
    if (window.treeviewDragAndDrop)return window.treeviewDragAndDrop;
    this.lastLanding=0;
    this.dragNode=0;
    this.dragStartNode=0;
    this.dragStartObject=0;
    this.tempDOMU=null;
    this.tempDOMM=null;
    this.waitDrag=0;
    window.treeviewDragAndDrop=this;
    return this
};
treeViewDragObject.prototype.removeDraggableItem=function(htmlNode)
{
    htmlNode.onmousedown=null;
    htmlNode.dragStarter=null;
    htmlNode.dragLanding=null
};
treeViewDragObject.prototype.addDraggableItem=function(htmlNode,ajaxObj)
{
    htmlNode.onmousedown=this.preCreateDragCopy;
    htmlNode.dragStarter=ajaxObj;
    this.addDragLanding(htmlNode,ajaxObj)
};
treeViewDragObject.prototype.addDragLanding=function(htmlNode,ajaxObj)
{
    htmlNode.dragLanding=ajaxObj
};
treeViewDragObject.prototype.preCreateDragCopy=function(e)
{
    if (e && (e||event).button==2) return;
    if (window.treeviewDragAndDrop.waitDrag)
    {
        window.treeviewDragAndDrop.waitDrag=0;
        document.body.onmouseup=window.treeviewDragAndDrop.tempDOMU;
        document.body.onmousemove=window.treeviewDragAndDrop.tempDOMM;
        return false
    };
    window.treeviewDragAndDrop.waitDrag=1;
    window.treeviewDragAndDrop.tempDOMU=document.body.onmouseup;
    window.treeviewDragAndDrop.tempDOMM=document.body.onmousemove;
    window.treeviewDragAndDrop.dragStartNode=this;
    window.treeviewDragAndDrop.dragStartObject=this.dragStarter;
    document.body.onmouseup=window.treeviewDragAndDrop.preCreateDragCopy;
    document.body.onmousemove=window.treeviewDragAndDrop.callDrag;
    if ((e)&&(e.preventDefault))
    {
        e.preventDefault();
        return false
    };
    return false
};
treeViewDragObject.prototype.callDrag=function(e)
{
    if (!e)e=window.event;
    dragger=window.treeviewDragAndDrop;
    if ((e.button==0)&&(IE)) return dragger.stopDrag();
    if (!dragger.dragNode && dragger.waitDrag)
    {
        dragger.dragNode=dragger.dragStartObject._createDragNode(dragger.dragStartNode,e);
        if (!dragger.dragNode)return dragger.stopDrag();
        dragger.gldragNode=dragger.dragNode;
        document.body.appendChild(dragger.dragNode);
        document.body.onmouseup=dragger.stopDrag;
        dragger.waitDrag=0;
        dragger.dragNode.pWindow=window;
        dragger.initFrameRoute()
    };
    if (dragger.dragNode.parentNode!=window.document.body)
    {
        var grd=dragger.gldragNode;
        if (dragger.gldragNode.old)
			grd=dragger.gldragNode.old;
        grd.parentNode.removeChild(grd);
        var oldBody=dragger.dragNode.pWindow;
        if (IE)
        {
            var div=document.createElement("Div");
            div.innerHTML=dragger.dragNode.outerHTML;
            dragger.dragNode=div.childNodes[0]
        }
        else dragger.dragNode=dragger.dragNode.cloneNode(true);
        dragger.dragNode.pWindow=window;
        dragger.gldragNode.old=dragger.dragNode;
        document.body.appendChild(dragger.dragNode);
        oldBody.treeviewDragAndDrop.dragNode=dragger.dragNode
    };
    dragger.dragNode.style.left=e.clientX+15+(dragger.fx?dragger.fx*(-1):0)+(document.body.scrollLeft||document.documentElement.scrollLeft)+"px";
    dragger.dragNode.style.top=e.clientY+3+(dragger.fy?dragger.fy*(-1):0)+(document.body.scrollTop||document.documentElement.scrollTop)+"px";
    if (!e.srcElement)var z=e.target;
    else z=e.srcElement;
    dragger.checkLanding(z,e)
};
treeViewDragObject.prototype.calculateFramePosition=function(n)
{
    if (window.name)
    {
        var el =parent.frames[window.name].frameElement.offsetParent;
        var fx=0;
        var fy=0;
        while (el)
        {
            fx += el.offsetLeft;
            fy += el.offsetTop;
            el = el.offsetParent
        };
        if ((parent.treeviewDragAndDrop))
        {
            var ls=parent.treeviewDragAndDrop.calculateFramePosition(1);
            fx+=ls.split('_')[0]*1;
            fy+=ls.split('_')[1]*1
        };
        if (n)return fx+"_"+fy;
        else this.fx=fx;
        this.fy=fy
    };
    return "0_0"
};
treeViewDragObject.prototype.checkLanding=function(htmlObject,e)
{
    if ((htmlObject)&&(htmlObject.dragLanding))
    {
        if (this.lastLanding)this.lastLanding.dragLanding._dragOut(this.lastLanding);
        this.lastLanding=htmlObject;
        this.lastLanding=this.lastLanding.dragLanding._dragIn(this.lastLanding,this.dragStartNode,e.clientX, e.clientY,e);
        this.lastLanding_scr=(IE?e.srcElement:e.target)
    }
    else
    {
        if ((htmlObject)&&(htmlObject.tagName!="BODY")) this.checkLanding(htmlObject.parentNode,e);
        else
        {
            if (this.lastLanding)this.lastLanding.dragLanding._dragOut(this.lastLanding,e.clientX, e.clientY,e);
            this.lastLanding=0;
            if (this._onNotFound)this._onNotFound()
        }
    }
};
treeViewDragObject.prototype.stopDrag=function(e,mode)
{
    dragger=window.treeviewDragAndDrop;
    if (!mode)
    {
        dragger.stopFrameRoute();
        var temp=dragger.lastLanding;
        dragger.lastLanding=null;
        if (temp)temp.dragLanding._drag(dragger.dragStartNode,dragger.dragStartObject,temp,(IE?event.srcElement:e.target))
    };
    dragger.lastLanding=null;
    if ((dragger.dragNode)&&(dragger.dragNode.parentNode==document.body)) 
		dragger.dragNode.parentNode.removeChild(dragger.dragNode);
    dragger.dragNode=0;
    dragger.gldragNode=0;
    dragger.fx=0;
    dragger.fy=0;
    dragger.dragStartNode=0;
    dragger.dragStartObject=0;
    document.body.onmouseup=dragger.tempDOMU;
    document.body.onmousemove=dragger.tempDOMM;
    dragger.tempDOMU=null;
    dragger.tempDOMM=null;
    dragger.waitDrag=0
};
treeViewDragObject.prototype.stopFrameRoute=function(win)
{
    if (win)window.treeviewDragAndDrop.stopDrag(1,1);
    for (var i=0;i<window.frames.length;i++)if ((window.frames[i]!=win)&&(window.frames[i].treeviewDragAndDrop))
    window.frames[i].treeviewDragAndDrop.stopFrameRoute(window);
    if ((parent.treeviewDragAndDrop)&&(parent!=window)&&(parent!=win))
    parent.treeviewDragAndDrop.stopFrameRoute(window)
};
treeViewDragObject.prototype.initFrameRoute=function(win,mode)
{
    if (win)
    {
        window.treeviewDragAndDrop.preCreateDragCopy();
        window.treeviewDragAndDrop.dragStartNode=win.treeviewDragAndDrop.dragStartNode;
        window.treeviewDragAndDrop.dragStartObject=win.treeviewDragAndDrop.dragStartObject;
        window.treeviewDragAndDrop.dragNode=win.treeviewDragAndDrop.dragNode;
        window.treeviewDragAndDrop.gldragNode=win.treeviewDragAndDrop.dragNode;
        window.document.body.onmouseup=window.treeviewDragAndDrop.stopDrag;
        window.waitDrag=0;
        if (((!IE)&&(mode))&&((!FireFox)||(_FFrv<1.8)))
        window.treeviewDragAndDrop.calculateFramePosition()
    };
    if ((parent.treeviewDragAndDrop)&&(parent!=window)&&(parent!=win))
    parent.treeviewDragAndDrop.initFrameRoute(window);
    for (var i=0;i<window.frames.length;i++)if ((window.frames[i]!=win)&&(window.frames[i].treeviewDragAndDrop))
    window.frames[i].treeviewDragAndDrop.initFrameRoute(window,((!win||mode)?1:0))
};
var FireFox=false;
var IE=false;
var Opera=false;
var Khtml=false;
var _isMacOS=false;
if (navigator.userAgent.indexOf('Macintosh')!= -1) _isMacOS=true;
if ((navigator.userAgent.indexOf('Safari')!= -1)||(navigator.userAgent.indexOf('Konqueror')!= -1))
{
    var _KHTMLrv=parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf('Safari')+7,5));
    if (_KHTMLrv > 525)
    {
        FireFox=true;
        var _FFrv=1.9
    }
    else
    Khtml=true
}
else if (navigator.userAgent.indexOf('Opera')!= -1)
{
    Opera=true;
    _OperaRv=parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf('Opera')+6,3))
}
else if(navigator.appName.indexOf("Microsoft")!=-1)
IE=true;
else
{
    FireFox=true;
    var _FFrv=parseFloat(navigator.userAgent.split("rv:")[1])
};
function isIE()
{
    if(navigator.appName.indexOf("Microsoft")!=-1)
    if (navigator.userAgent.indexOf('Opera')== -1)
    return true;
    return false
};
treeViewDataLoader.prototype.doXPath = function(xpathExp,docObj,namespace,result_type)
{
    if ((Khtml)) return this.doXPathOpera(xpathExp,docObj);
    if(IE)
    {
        if(!docObj)if(!this.xmlDoc.nodeName)docObj = this.xmlDoc.responseXML
        else
        docObj = this.xmlDoc;
        if (!docObj)treeException.throwError("LoadXML","Incorrect XML",[(docObj||this.xmlDoc),this.rootItem]);
        if(namespace!=null)docObj.setProperty("SelectionNamespaces","xmlns:xsl='"+namespace+"'");
        if(result_type=='single')
        {
            return docObj.selectSingleNode(xpathExp)
        }
        else
        {
            return docObj.selectNodes(xpathExp)||new Array(0)
        }
    }
    else
    {
        var nodeObj = docObj;
        if(!docObj)
        {
            if(!this.xmlDoc.nodeName)
            {
                docObj = this.xmlDoc.responseXML
            }
            else
            {
                docObj = this.xmlDoc
            }
        };
        if (!docObj)treeException.throwError("LoadXML","Incorrect XML",[(docObj||this.xmlDoc),this.rootItem]);
        if(docObj.nodeName.indexOf("document")!=-1)
        {
            nodeObj = docObj
        }
        else
        {
            nodeObj = docObj;
            docObj = docObj.ownerDocument
        };
        var retType = XPathResult.ANY_TYPE;
        if(result_type=='single')retType = XPathResult.FIRST_ORDERED_NODE_TYPE
        var rowsCol = new Array();
var col = docObj.evaluate(xpathExp, nodeObj, function(pref)
{
    return namespace
}
, retType,null);
if(retType == XPathResult.FIRST_ORDERED_NODE_TYPE)
{
    return col.singleNodeValue
};
var thisColMemb = col.iterateNext();
while (thisColMemb)
{
    rowsCol[rowsCol.length] = thisColMemb;
    thisColMemb = col.iterateNext()
};
return rowsCol
}
};
function treeviewError(type,name,params)
{
    if (!this.catches)this.catches=new Array();
    return this
};
treeviewError.prototype.catchError=function(type,func_name)
{
    this.catches[type]=func_name
};
treeviewError.prototype.throwError=function(type,name,params)
{
    if (this.catches[type])return this.catches[type](type,name,params);
    if (this.catches["ALL"])return this.catches["ALL"](type,name,params);
    alert("Error type: " + arguments[0]+"\nDescription: " + arguments[1] );
    return null
};
window.treeException=new treeviewError();
treeViewDataLoader.prototype.doXPathOpera = function(xpathExp,docObj)
{
    var z=xpathExp.replace(/[\/]+/gi,"/").split('/');
    var obj=null;
    var i=1;
    if (!z.length)return [];
    if (z[0]==".")obj=[docObj];
    else if (z[0]=="")
    {
        obj=(this.xmlDoc.responseXML||this.xmlDoc).getElementsByTagName(z[i].replace(/\[[^\]]*\]/g,""));
        i++
    }
    else return [];
    for (i;i<z.length;i++)obj=this._getAllNamedChilds(obj,z[i]);
    if (z[i-1].indexOf("[")!=-1)
    obj=this._filterXPath(obj,z[i-1]);
    return obj
};
treeViewDataLoader.prototype._filterXPath = function(a,b)
{
    var c=new Array();
    var b=b.replace(/[^\[]*\[\@/g,"").replace(/[\[\]\@]*/g,"");
    for (var i=0;i<a.length;i++)if (a[i].getAttribute(b))
    c[c.length]=a[i];
    return c
};
treeViewDataLoader.prototype._getAllNamedChilds = function(a,b)
{
    var c=new Array();
    if (Khtml)b=b.toUpperCase();
    for (var i=0;i<a.length;i++)for (var j=0;
    j<a[i].childNodes.length;
    j++)
    {
        if (Khtml)
        {
            if (a[i].childNodes[j].tagName && a[i].childNodes[j].tagName.toUpperCase()==b)
            c[c.length]=a[i].childNodes[j]
        }
        else
        if (a[i].childNodes[j].tagName==b)c[c.length]=a[i].childNodes[j]
    };
    return c
};
function dhtmlXHeir(a,b)
{
    for (var c in b)if (typeof(b[c])=="function") a[c]=b[c];return a
};
function dhtmlxEvent(el,event,handler)
{
    if (el.addEventListener)el.addEventListener(event,handler,false);
    else if (el.attachEvent)el.attachEvent("on"+event,handler)
};
treeViewDataLoader.prototype.xslDoc = null;
treeViewDataLoader.prototype.setXSLParamValue = function(paramName,paramValue,xslDoc)
{
    if(!xslDoc)xslDoc = this.xslDoc
    if(xslDoc.responseXML)xslDoc = xslDoc.responseXML;
    var item = this.doXPath("/xsl:stylesheet/xsl:variable[@name='"+paramName+"']",xslDoc,"http:/\/www.w3.org/1999/XSL/Transform","single");
    if(item!=null)item.firstChild.nodeValue=paramValue
};
treeViewDataLoader.prototype.doXSLTransToObject = function(xslDoc,xmlDoc)
{
    if(!xslDoc)xslDoc = this.xslDoc;
    if(xslDoc.responseXML)xslDoc = xslDoc.responseXML
    if(!xmlDoc)xmlDoc = this.xmlDoc;
    if(xmlDoc.responseXML)xmlDoc = xmlDoc.responseXML
    if(!isIE())
    {
        if(!this.XSLProcessor)
        {
            this.XSLProcessor = new XSLTProcessor();
            this.XSLProcessor.importStylesheet(xslDoc)
        };
        var result = this.XSLProcessor.transformToDocument(xmlDoc)
    }
    else
    {
        var result = new ActiveXObject("Msxml2.DOMDocument.3.0");
        xmlDoc.transformNodeToObject(xslDoc,result)
    };
    return result
};
treeViewDataLoader.prototype.doXSLTransToString = function(xslDoc,xmlDoc)
{
    return this.doSerialization(this.doXSLTransToObject(xslDoc,xmlDoc))
};
treeViewDataLoader.prototype.doSerialization = function(xmlDoc)
{
    if(!isIE())
    {
        var xmlSerializer = new XMLSerializer();
        return xmlSerializer.serializeToString(xmlDoc)
    }
    else
    return xmlDoc.xml
};
