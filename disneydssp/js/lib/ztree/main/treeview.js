var availableNodeString = "PolylineLayer,PolygonLayer,Image,buildinglayer,billboardlayer,annotationlayer,PoiLayer,Terrian,Globe";
availableNodeString = availableNodeString + ",Folder,Pipeline";
function dataContent(data)
{
    this.d=data
};
dataContent.prototype=
{
    text:function()
    {
        if (!FireFox)
			return this.d.xml;
        var x = new XMLSerializer();
        return x.serializeToString(this.d)
    }
    ,
    get:function(attname)
    {
        return this.d.getAttribute(attname)
    }
    ,
    exists:function()
    {
        return !!this.d
    }
    ,
    content:function()
    {
		if(this.d.firstChild)
		{
			return this.d.firstChild.data;
		}
		else
		{
			return "";
		}
    }
    ,
    each:function(tname,fo,t,i)
    {
        var aNodes=this.d.childNodes;
        var content=new dataContent();
        if (aNodes.length)
			for (i=i||0;i<aNodes.length;i++)
				if(i >= aNodes.length){
					return;
				}else{
					if(aNodes[i].tagName == null){
						continue;
					}
					if (aNodes[i].tagName.indexOf(tname)>-1 || availableNodeString.toLowerCase().indexOf(aNodes[i].tagName.toLowerCase())>-1)
					{
						content.d=aNodes[i];
						if(fo.apply(t,[content,i])==-1)
							return
					}	
				}
    }
    ,
    listAttribute:function()  //取出所有的属性
    {
        var arr={};
        var attributeList=this.d.attributes;
        for (var i=0;i<attributeList.length;i++)
			arr[attributeList[i].name]=attributeList[i].value;
        return arr
    }
    ,
    sub:function(name)
    {
        var nodeList=this.d.childNodes;
        var point=new dataContent();
        if (nodeList.length)
			for (var i=0;i<nodeList.length;i++)
				if (nodeList[i].tagName==name)
				{
					point.d=nodeList[i];
					return point
				}
    }
    ,
    up:function(name)
    {
        return new dataContent(this.d.parentNode)
    }
    ,
    set:function(name,val)
    {
        this.d.setAttribute(name,val)
    }
    ,
    dataclone:function(name)
    {
        return new dataContent(this.d)
    }
    ,
    hasSub:function(tname)
    {
        var list=this.d.childNodes;
        if (list.length)
			for (var i=0;i<list.length;i++){
				if(list[i].tagName == null){
					continue;
				}
				if (list[i].tagName.indexOf(tname)>-1 || availableNodeString.toLowerCase().indexOf(list[i].tagName.toLowerCase())>-1){
					return true;
				}
			}
        return false;
    }
    ,
	getVisible:function(tname)
    {
        var list=this.d.childNodes;
        if (list.length)
			for (var i=0;i<list.length;i++)
				if (list[i].tagName.indexOf(tname)>-1 || availableNodeString.toLowerCase().indexOf(list[i].tagName.toLowerCase())>-1)
				{
				   var v = list[i].firstChild.nodeValue;
				   if(v == 1 || v == "1" || v == true || v == "true")
					 return true;
			    }
        return false;
    }
    ,
    through:function(nodename,rule,v,f,t)
    {
        var childList=this.d.childNodes;
        if (childList.length)
			for (var i=0;i<childList.length;i++)
			{
				if (childList[i].tagName==nodename && childList[i].getAttribute(rule)!=null && childList[i].getAttribute(rule)!="" && (!v || childList[i].getAttribute(rule)==v ))
				{
					var c=new dataContent(childList[i]);
					f.apply(t,[c,i])
				};
				var w=this.d;
				this.d=childList[i];
				this.through(nodename,rule,v,f,t);
				this.d=w
			}
    }
};

function treeViewObject(htmlElement, w, h, rootId)
{
    if (IE)
		try
		{
			document.execCommand("BackgroundImageCache", false, true)
		}
		catch (e)
		{
		};
    if (typeof(htmlElement)!="object")
		this.superObj=document.getElementById(htmlElement);
    else
		this.superObj=htmlElement;

    this.imagedrag=true;    

	

    //this.dropLower=false;
    this.enableIEImageFix();
    this.xmlstate=0;
    //this.mytype="tree";
    this.smcheck=true;
    this.width=w;
    this.height=h;
	this.tvseparator=",";
    this.rootId=rootId;
    this.childCalc=null;
    this.def_img_x="18px";
    this.def_img_y="18px";
    this.def_line_img_x="18px";
    this.def_line_img_y="18px";
    this._dragged=new Array();
    this._selected=new Array();
    this.style_pointer="pointer";
    if (IE)
		this.style_pointer="hand";
    this._aimgs=true;
    //this.htmlcA=" [";
    //this.htmlcB="]";
    this.lWin=window;
    //this.cMenu=0;
    this.dadmode=0;
    this.lazyLoad=false;
    this.scrollable=true;

	this._openCascade = true; //open super tree item

    this.hfMode=0;
    this.nodeCut=new Array();
    this.XMLsource=0;
    this.dataLoadAlert=0;
    this.dragItems={};
    this._pullSize=0;
    this.treeLinesOn=true;
    this.tscheck=false;
    this.timgen=true;
    this.dpcpy=false;
    this._ld_id=null;
    this._oie_onXLE=[];
    this.imPath="treeGfx/";
    this.checkArray=new Array("iconUncheckAll.gif","iconCheckAll.gif","iconCheckGray.gif","iconUncheckDis.gif","iconCheckDis.gif","iconCheckDis.gif");
    this.radioArray=new Array("radio_off.gif","radio_on.gif","radio_on.gif","radio_off.gif","radio_on.gif","radio_on.gif");
    this.lineArray=new Array("line2.gif","line3.gif","line4.gif","blank.gif","blank.gif","line1.gif");
    this.minusArray=new Array("minus2.gif","minus3.gif","minus4.gif","minus.gif","minus5.gif");
    this.plusArray=new Array("plus2.gif","plus3.gif","plus4.gif","plus.gif","plus5.gif");
    this.imageArray=new Array("leaf.gif","folderOpen.gif","folderClosed.gif");
	
    this.cutImg= new Array(0,0,0);
    this.cutImage="but_cut.gif";

    this.dragger= new treeViewDragObject();
    this.pageLabel=new treeViewItemObject(this.rootId,"",0,this);
    this.pageLabel.pageLabel.childNodes[0].childNodes[0].style.display="none";
    this.pageLabel.pageLabel.childNodes[0].childNodes[0].childNodes[0].className="hiddenRow";
    this.allTree=this._createSelf();
    this.allTree.appendChild(this.pageLabel.pageLabel);
    if(FireFox)
		this.allTree.childNodes[0].width="100%";
    var self=this;
	this.allTree.onselectstart=new Function("return false;");
	this.allTree.onmousedown = function(e)
	{
		return self._doContClick(e||window.event)
	};
	this.XMLLoader=new treeViewDataLoader(this._parseXMLTree,this,true,this.no_cashe);

	if (IE)
		this.preventIECashing(true);

	if (window.addEventListener)
		window.addEventListener("unload",function()
			{
				try
				{
					self.destroy()
				}
				catch(e)
				{
				}
			}
			,false);
	if (window.attachEvent)
		window.attachEvent("onunload",function()
		{
			try
			{
				self.destroy()
			}
			catch(e)
			{
			}
		}
	);
	this.treeviewEvent();
	this._onEventSet=
	{
		onMouseIn:function()
		{
			this.ehlt=true
		}
		,onMouseOut:function()
		{
			this.ehlt=true
		}
		,onSelect:function()
		{
			this._onSSCF=true
		}
	};
	return this
};

treeViewObject.prototype.setOpenCascade = function(mode)
{
	this._openCascade = mode;
}
treeViewObject.prototype.setDataMode=function(mode)
{
	this._datamode=mode
};
treeViewObject.prototype._doContClick=function(ev)
{
	if (ev.button!=2)
	{
		if(this._acMenu)
			this.cMenu._contextEnd();
		return true
	};
	var srcObj =(IE?ev.srcElement:ev.target);

	while ((srcObj)&&(srcObj.tagName!="BODY"))
	{
		if (srcObj.superObj)
			break;
		srcObj=srcObj.parentNode
	};
	if ((!srcObj)||(!srcObj.superObj)) 
		return true;
	var obj=srcObj.superObj;
	this._acMenu=(obj.cMenu||this.cMenu);
	if (this._acMenu)
	{
		srcObj.contextMenuId=obj.id;
		srcObj.contextMenu=this._acMenu;
		srcObj.a=this._acMenu._contextStart;
		if (IE)
			ev.srcElement.oncontextmenu = function()
				{
					event.cancelBubble=true;
					return false
				};
		srcObj.a(srcObj,ev);
		srcObj.a=null;
		ev.cancelBubble=true;
		return false
	};
	return true
};
treeViewObject.prototype.enableIEImageFix=function(treemode)
{
	if (!treemode)
	{
		this.getHtmlNodeType=function(id)
		{
			if(id == this.rootId)
			{
				return document.createElement("div");
			}
			else
			{
				return document.createElement("img");
			}
		};
		this._setSrc=function(a,b)
		{
			a.src=b
		};
		this._getSrc=function(a)
		{
			return a.src
		}
	}
	else
	{
		this.getHtmlNodeType=function()
		{
			var divObj=document.createElement("DIV");
			divObj.innerHTML="&nbsp;";
			divObj.className="tv_bg_img_fix";
			return divObj
		};
		this._setSrc=function(obj,imgobj)
		{
			obj.style.backgroundImage="url("+imgobj+")"
		};
		this._getSrc=function(obj)
		{
			var bgImg=obj.style.backgroundImage;
			return bgImg.substr(4,bgImg.length-5)
		}
	}
};
treeViewObject.prototype.destroy=function()
{
	for (var field in this.dragItems)
	{
		var tmpObj=this.dragItems[field];
		if (!tmpObj)
			continue;
		else
		{
			for(var f in tmpObj)
			{
				tmpObj[f] = null;
			}
		}
		this.dragItems[field]=null
	};
	this.allTree.innerHTML="";
	this.XMLLoader.destroy();
	for(var obj in this)
	{
		this[obj]=null
	}
};
function cObject()
{
    return this
};
cObject.prototype= new Object;
cObject.prototype.dataclone = function ()
{
	function _dummy(){};
	_dummy.prototype=this;
	return new _dummy()
};
function treeViewItemObject(itemId,itemText,superObj,treeObject,eventHandler,mode)
{
	this.superObj=superObj;
    this.eventHandler=eventHandler;

    this.pageLabel="";
    this.acolor="";
    this.scolor="";
    this.tr=0;
    this.childsCount=0;
    this.tempDOMM=0;
    this.tempDOMU=0;
    this.dragSpan=0;
    this.dragMove=0;
    this.span=0;
    this.closeble=1;
    this.childNodes=new Array();
    this.userData=new cObject();
    this.checkstate=0;
    this.treeNod=treeObject;
    this.label=itemText;
    
    this.images=new Array(treeObject.imageArray[0],treeObject.imageArray[1],treeObject.imageArray[2]);
    this.id=treeObject.addId2Cache(itemId,this);

    if (this.treeNod.checkBoxOff )
		this.pageLabel=this.treeNod.createNodeElement(1,this,mode);
    else 
		this.pageLabel=this.treeNod.createNodeElement(0,this,mode);
    this.pageLabel.objBelong=this;

    return this
};
treeViewObject.prototype.addId2Cache=function(itemId,itemObject)
{
    if (this._findCacheById(itemId,1,1))
    {
        itemId=itemId +"_"+(new Date()).valueOf();
        return this.addId2Cache(itemId,itemObject)
    };
    this.dragItems[itemId]=itemObject;
    this._pullSize++;
    return itemId
};
treeViewObject.prototype._globalIdStorageSub=function(itemId)
{
    if (this.dragItems[itemId])
    {
        this._unselectItem(this.dragItems[itemId]);
        this.dragItems[itemId]=null;
        this._pullSize--
    };
    if ((this._locker)&&(this._locker[itemId])) 
		this._locker[itemId]=false
};
treeViewObject.prototype._findCacheById=function(itemId,skipXMLSearch,skipParsing,isreparse)
{
    if (this.dragItems[itemId])
    {
        return this.dragItems[itemId]
    };
    return null
};
treeViewObject.prototype._escape=function(str)
{
    switch(this.utfesc)
    {
        case "none":
			return str;
			break;
        case "utf8":
			return encodeURI(str);
			break;
        default:
			return escape(str);
			break
    }
};
treeViewObject.prototype._createTableRow=function(htmlObject,node)
{
    var tr =document.createElement('tr');
    var td1=document.createElement('td');
    var td2=document.createElement('td');
    td1.appendChild(document.createTextNode(" "));
    td2.colSpan=3;
    td2.appendChild(htmlObject);
    tr.appendChild(td1);
    tr.appendChild(td2);
    return tr
};
treeViewObject.prototype.loadXMLString=function(xmlString,afterCall)
{
    var that=this;
    if (!this.parsCount)
		this.callEvent("onXLS",[that,null]);
    this.xmlstate=1;
    if (afterCall)
		this.XMLLoader.waitCall=afterCall;
    this.XMLLoader.loadXMLString(xmlString)
};
treeViewObject.prototype.loadXML=function(file,afterCall)
{
	
    if (this._datamode && this._datamode!="xml")
		return this["load"+this._datamode.toUpperCase()](file,afterCall);
    var that=this;

    if (!this.parsCount)
		this.callEvent("onXLS",[that,this._ld_id]);
    this._ld_id=null;
    this.xmlstate=1;
    this.XMLLoader=new treeViewDataLoader(this._parseXMLTree,this,true,this.no_cashe);
	
    if (afterCall)
		this.XMLLoader.waitCall=afterCall;

    this.XMLLoader.loadXML(file)
	
		
};
treeViewObject.prototype.appendChildNode=function(superObj,itemId,itemText,itemeventHandler,image1,image2,image3,optionStr,childs,bfItem,afterNode)
{
    if (bfItem && bfItem.superObj)
		superObj=bfItem.superObj;
    if (((superObj.XMLload==0)&&(this.XMLsource))&&(!this.dataLoadAlert))
    {
        superObj.XMLload=1;
        this._loadDynXML(superObj.id)
    };
    var Count=superObj.childsCount;
    var Nodes=superObj.childNodes;
    if (afterNode)
    {
        if (afterNode.tr.previousSibling.previousSibling)
        {
            bfItem=afterNode.tr.previousSibling.nodem
        }
        else
			optionStr=optionStr.replace("TOP","")+",TOP"
    };
    if (bfItem)
    {
        var ik,jk;
        for (ik=0;ik<Count;ik++)if (Nodes[ik]==bfItem)
        {
            for (jk=Count;jk!=ik;jk--)Nodes[1+jk]=Nodes[jk];
            break
        };
        ik++;
        Count=ik
    };
    if (optionStr)
    {
        var tempStr=optionStr.split(",");
        for (var i=0;i<tempStr.length;i++)
        {
            switch(tempStr[i])
            {
                case "TOP": if (superObj.childsCount>0)
                {
                    bfItem=new Object;
                    bfItem.tr=superObj.childNodes[0].tr.previousSibling
                };
                superObj._has_top=true;
                for (ik=Count;ik>0;ik--)Nodes[ik]=Nodes[ik-1];
                Count=0;
                break
            }
        }
    };
    var aNode;
    if (!(aNode=this.dragItems[itemId])|| aNode.span!=-1)
    {
        aNode=Nodes[Count]=new treeViewItemObject(itemId,itemText,superObj,this,itemeventHandler,1);
        itemId = Nodes[Count].id;
        superObj.childsCount++
    };
    if(!aNode.pageLabel)
    {
        aNode.label=itemText;
		var checkState = 0;
		if(this.checkBoxOff)
			checkState = 1;
		else
			checkState = 0;
        aNode.pageLabel=this.createNodeElement(checkState,aNode);
        aNode.pageLabel.objBelong=aNode
    };
    if(image1)
		aNode.images[0]=image1;
    if(image2)
		aNode.images[1]=image2;
    if(image3)
		aNode.images[2]=image3;

    var tr=this._createTableRow(aNode.pageLabel);
    if ((this.dataLoadAlert)||(this._hAdI))
		aNode.pageLabel.parentNode.parentNode.style.display="none";
    if ((bfItem)&&(bfItem.tr.nextSibling))
		superObj.pageLabel.childNodes[0].insertBefore(tr,bfItem.tr.nextSibling);
    else
		if (this.parsingOn==superObj.id)
		{
			this.readItems[this.readItems.length]=tr
		}
    else
		superObj.pageLabel.childNodes[0].appendChild(tr);
    if ((bfItem)&&(!bfItem.span)) 
		bfItem=null;
    if (this.XMLsource)
		if ((childs)&&(childs!=0)) 
			aNode.XMLload=0;
    else 
		aNode.XMLload=1;
    aNode.tr=tr;
    tr.nodem=aNode;
    if (superObj.itemId==0)
		tr.childNodes[0].className="hiddenRow";
    if ((superObj._r_logic)||(this._frbtr))
    this._setSrc(n.pageLabel.childNodes[0].childNodes[0].childNodes[1].childNodes[0],this.imPath+this.radioArray[0]);
    if (optionStr)
    {
        var tempStr=optionStr.split(",");
        for (var i=0;i<tempStr.length;i++)
        {
            switch(tempStr[i])
            {
                case "SELECT": 
					this.selectItem(itemId,false);
					break;
                case "CALL": 
					this.selectItem(itemId,true);
					break;
                case "CHILD": 
					aNode.XMLload=0;
					break;
                case "CHECKED":
					if (this.dataLoadAlert)
						this.setCheckList+=this.tvseparator+itemId;
					else
						this.setCheck(itemId,1);
					break;
                case "HCHECKED":
					this._setCheck(aNode,"unsure");
					break;
                case "OPEN": 
					aNode.openMe=1;
					break
            }
        }
    };
    if (!this.dataLoadAlert)
    {
        if ((this._getOpenState(superObj)<0)&&(!this._hAdI)) this.openItem(superObj.id);
        if (bfItem)
        {
            this.adjustStateChar(bfItem);
            this.adjustLineShow(bfItem)
        };
        this.adjustStateChar(superObj);
        this.adjustLineShow(superObj);
        this.adjustStateChar(aNode);
        if (superObj.childsCount>=2)
        {
            this.adjustStateChar(Nodes[superObj.childsCount-2]);
            this.adjustLineShow(Nodes[superObj.childsCount-2])
        };
        if (superObj.childsCount!=2)
			this.adjustStateChar(Nodes[0]);
        if (this.tscheck)
			this.changeCState(superObj);
        if (this._onradh)
        {
            if (this.xmlstate==1)
            {
                var old=this.onXLE;
                this.onXLE=function(id)
                {
                    this._onradh(itemId);
                    if (old)old(id)
                }
            }
            else
				this._onradh(itemId)
        }
    };
    return aNode
};
treeViewObject.prototype.insertNewItem=function(parentId,itemId,itemText,itemeventHandler,image1,image2,image3,optionStr,children)
{
    var superObj=this._findCacheById(parentId);
    if (!superObj)
		return (-1);
    return this.appendChildNode(superObj,itemId,itemText,itemeventHandler,image1,image2,image3,optionStr,children);
};
treeViewObject.prototype.insertNewChild=function(parentId,itemId,itemText,itemeventHandler,image1,image2,image3,optionStr,children)
{
    return this.insertNewItem(parentId,itemId,itemText,itemeventHandler,image1,image2,image3,optionStr,children)
};
treeViewObject.prototype._parseXMLTree=function(attribute,b,c,d,xml)
{
    var topNodeData=new dataContent(xml.getXMLTopNode("Xml"));
    attribute._parse(topNodeData);
    attribute._p=topNodeData
};
treeViewObject.prototype._parseItem=function(c,temp,preNode,befNode)
{
    var id;
	
    if (this._srnd && (!this.dragItems[id=c.get("id")] || !this.dragItems[id].span))
    {
        this._addItemSRND(temp.id,id,c);
        return
    };
    var attributes=c.listAttribute();
    if ((typeof(this.updateFlag)=="object")&&(!this.updateFlag[attributes.id]))
    {
        this._parse(c,attributes.id,1);
        return
    };

    var zST=[];
    if (attributes.select)
		zST.push("SELECT");
    if (attributes.top)
		zST.push("TOP");
    if (attributes.call)
		this.nodeAskingCall=attributes.id;
    if (attributes.checked==-1)
		zST.push("HCHECKED");
    else if (attributes.checked)
		zST.push("CHECKED");

    if (attributes.open)
		zST.push("OPEN");
	attributes.checked = true;

    if (this.updateFlag)
    {		
		
        if (this._findCacheById(attributes.id))
		{
			var nodeForCreate=this.updateItem(attributes.id,attributes.name,attributes.im0,attributes.im1,attributes.im2,attributes.checked);
		}
        else
        {
            if (this.npl==0)
				zST.push("TOP");
            else 
				preNode=temp.childNodes[this.npl];
			
            var nodeForCreate=this.appendChildNode(temp,attributes.id,attributes.name,0,attributes.im0,attributes.im1,attributes.im2,zST.join(","),attributes.child,0,preNode);
            preNode=null
        }
    }
    else
	{
		var nodeForCreate=this.appendChildNode(temp,attributes.id,attributes.name,0,attributes.im0,attributes.im1,attributes.im2,zST.join(","),attributes.child,(befNode||0),preNode);
	}

	
	if(c.hasSub("Visible"))
	{
		this._setCheck(nodeForCreate,c.getVisible("Visible"));
	}


    if (attributes.tooltip)
		nodeForCreate.span.parentNode.parentNode.title=attributes.tooltip;
    if (attributes.style)
		if (nodeForCreate.span.style.cssText)
			nodeForCreate.span.style.cssText+=(";"+attributes.style);
		else
			nodeForCreate.span.setAttribute("style",nodeForCreate.span.getAttribute("style")+";"+attributes.style);

    if (attributes.radio)
		nodeForCreate._r_logic=true;
    if (attributes.nocheckbox)
    {
        nodeForCreate.span.parentNode.previousSibling.previousSibling.childNodes[0].style.display='none';
        nodeForCreate.nocheckbox=true
    };
    if (attributes.disabled)
    {
        if (attributes.checked!=null)
			this._setCheck(nodeForCreate,convertStringToBoolean(attributes.checked));
        this.disableCheckbox(nodeForCreate,1)
    };
    nodeForCreate._acc=attributes.child||0;
    if (this.parserExtension)
		this.parserExtension._parseExtension.call(this,c,attributes,(temp?temp.id:0));
    this.setNodeColor(nodeForCreate,attributes.aCol,attributes.sCol);
    if (attributes.locked=="1")
		this.lockItem(nodeForCreate.id,true,true);
    if ((attributes.imwidth)||(attributes.imheight)) 
		this.setIconSize(a.imwidth,attributes.imheight,nodeForCreate);
    if ((attributes.closeable=="0")||(attributes.closeable=="1")) 
		this.setItemCloseable(nodeForCreate,attributes.closeable);
    var zcall="";
    if (attributes.topoffset)
		this.setItemTopOffset(nodeForCreate,attributes.topoffset);

    if ((!this.lazyLoad)||(typeof(this.updateFlag)=="object"))
    {		
        if (c.hasSub("Element"))
			zcall=this._parse(c,attributes.id,1)
    };
    if (zcall!="")
		this.nodeAskingCall=zcall;

    c.each("userdata",function(u)
    {
        this.setUserData(c.get("id"),u.get("name"),u.content())
    }
    ,this)
};
treeViewObject.prototype._parse=function(p,parentId,level,start)
{
    if (this._srnd && !this.superObj.offsetHeight)
    {
        var self=this;
		return window.setTimeout(function()
		{
			self._parse(p,parentId,level,start)
		}
		,100)
	};
	if (!p.exists()) return;
	this.skipLock=true;
	if(this.parsCount)
	{
		this.parsCount = this.parsCount+1;
	}
	else
	{
		this.parsCount = 1;
	}
	//this.parsCount=this.parsCount?(this.parsCount+1):1;
	this.dataLoadAlert=1;
	if (!parentId)
	{
		parentId=p.get("id");
		if(parentId == null || parentId == ""){
			parentId = "0";
		}
		if (p.get("radio"))
		this.pageLabel._r_logic=true;
		this.parsingOn=parentId;
		this.readItems=new Array();
		this.setCheckList="";
		this.nodeAskingCall=""
	};
	var temp=this._findCacheById(parentId);
	if (!temp) return "";// treeviewError.throwError("DataStructure","XML reffers to not existing parent");
	if ((temp.childsCount)&&(!start)&&(!this._edsbps)&&(!temp._has_top))
		var preNode=temp.childNodes[temp.childsCount-1];
	else
		var preNode=0;
	this.npl=0;
	p.each("Element",function(c,i)
	{
		temp.XMLload=1;
		if ((this._epgps)&&(this._epgpsC==this.npl))
		{
			this._setNextPageSign(temp,this.npl+1*(start||0),level,node);
			return -1
		};
		
		//c.listAttribute().checked = "true";
		this._parseItem(c,temp,preNode);
		this.npl++
	},this,start);

	if (!level)
	{
		p.each("userdata",function(u)
		{
			this.setUserData(p.get("id"),u.get("name"),u.content())
		}
		,this);
		temp.XMLload=1;
		if (this.updateFlag)
		{
			this.updateFlag=false;
			for (var i=temp.childsCount-1;i>=0;i--)
				if (temp.childNodes[i]._dmark)
					this.deleteItem(temp.childNodes[i].id)
		};
		var parsedNodeTop=this._findCacheById(this.parsingOn);
		for (var i=0;i<this.readItems.length;i++)
			temp.pageLabel.childNodes[0].appendChild(this.readItems[i]);
		this.lastLoadedXMLId=parentId;
		this.dataLoadAlert=0;
		var chArr=this.setCheckList.split(this.tvseparator);
		for (var n=0;n<chArr.length;n++)
			if (chArr[n])
				this.setCheck(chArr[n],1);
		if ((this.XMLsource)&&(this.tscheck)&&(this.smcheck)&&(temp.id!=this.rootId))
		{
			if (temp.checkstate===0)
				this._setSubChecked(0,temp);
			else if (temp.checkstate===1)
				this._setSubChecked(1,temp)
		};
		if (this.onXLE)
			this.onXLE(this,parentId);
		this._redrawFrom(this,null,start)

		if (p.get("order")&& p.get("order")!="none")
			this._reorderBranch(temp,p.get("order"),true);
		if (this.nodeAskingCall!="")
			this.selectItem(this.nodeAskingCall,true);
		if (this._branchUpdate)
			this._branchUpdateNext(p)
	};
	if (this.parsCount==1)
	{
		this.parsingOn=null;
		if ((!this._edsbps)||(!this._edsbpsA.length))
		{
			var that=this;
			window.setTimeout( function()
			{
				that.callEvent("onXLE",[that,parentId])
			}
			,1);
			this.xmlstate=0
		};
		this.skipLock=false
	};
	this.parsCount--;
	if ((this._epgps)&&(start))
		this._setPrevPageSign(temp,(start||0),level,node);
		return this.nodeAskingCall
};
treeViewObject.prototype._branchUpdateNext=function(p)
{
	p.each("Element",function(c)
	{
		var nid=c.get("id");
		if (this.dragItems[nid] && (!this.dragItems[nid].XMLload)) 
			return;
		this._branchUpdate++;
		this.smartRefreshItem(c.get("id"),c)
	}
	,this)
	this._branchUpdate--
};
treeViewObject.prototype.checkUserData=function(node,parentId)
{
	if ((node.nodeType==1)&&(node.tagName == "userdata"))
	{
		var name=node.getAttribute("name");
		if ((name)&&(node.childNodes[0]))
			this.setUserData(parentId,name,node.childNodes[0].data)
	}
};
treeViewObject.prototype._redrawFrom=function(ajaxObj,itemObject,start,visMode)
{
	if (!itemObject)
	{
		var tempx=ajaxObj._findCacheById(ajaxObj.lastLoadedXMLId);
		ajaxObj.lastLoadedXMLId=-1;
		if (!tempx)
			return 0
	}
	else 
		tempx=itemObject;

	var acc=0;
	for (var i=(start?start-1:0);i<tempx.childsCount;i++)
	{
		if ((!this._branchUpdate)||(this._getOpenState(tempx)==1))
			if ((!itemObject)||(visMode==1)) tempx.childNodes[i].pageLabel.parentNode.parentNode.style.display="";
				if (tempx.childNodes[i].openMe==1)
				{
					this._openItem(tempx.childNodes[i]);
					tempx.childNodes[i].openMe=0
				};
		ajaxObj._redrawFrom(ajaxObj,tempx.childNodes[i])
	};
	if ((!tempx.unParsed)&&((tempx.XMLload)||(!this.XMLsource)))
		tempx._acc=acc;
		ajaxObj.adjustLineShow(tempx);
		ajaxObj.adjustStateChar(tempx)
};

treeViewObject.prototype._createSelf=function()
{
	var div=document.createElement('div');
	div.className="containerTableStyle";
	div.style.width=this.width;
	div.style.height=this.height;
	this.superObj.appendChild(div);
	return div
};
treeViewObject.prototype._xcloseAll=function(itemObject)
{
	if (itemObject.unParsed)return;
	if (this.rootId!=itemObject.id)
	{
		var Nodes=itemObject.pageLabel.childNodes[0].childNodes;
		var Count=Nodes.length;
		for (var i=1;i<Count;i++)
			Nodes[i].style.display="none";
			this.adjustStateChar(itemObject)
	};
	for (var i=0;i<itemObject.childsCount;i++)
		if (itemObject.childNodes[i].childsCount)
			this._xcloseAll(itemObject.childNodes[i]);
};
treeViewObject.prototype._xopenAll=function(itemObject)
{
	this._HideShow(itemObject,2);
	for (var i=0;i<itemObject.childsCount;i++)
		this._xopenAll(itemObject.childNodes[i])
};
treeViewObject.prototype.adjustStateChar=function(itemObject)
{
	if (!itemObject.pageLabel)return;
	var imsrc=itemObject.pageLabel.childNodes[0].childNodes[0].childNodes[0].lastChild;
	var imsrc2=itemObject.pageLabel.childNodes[0].childNodes[0].childNodes[2].childNodes[0];
	var workArray=this.lineArray;
	if ((this.XMLsource)&&(!itemObject.XMLload))
	{
		var workArray=this.plusArray;
		this._setSrc(imsrc2,this.imPath+itemObject.images[2]);
		if (this._txtimg)return (imsrc.innerHTML="[+]")
	}
	else
		if ((itemObject.childsCount)||(itemObject.unParsed))
		{
			if ((itemObject.pageLabel.childNodes[0].childNodes[1])&&( itemObject.pageLabel.childNodes[0].childNodes[1].style.display!="none" ))
			{
				if (!itemObject.wsign)
					var workArray=this.minusArray;
			this._setSrc(imsrc2,this.imPath+itemObject.images[1]);
			if (this._txtimg)
				return (imsrc.innerHTML="[-]")
			}
			else
			{
				if (!itemObject.wsign)
					var workArray=this.plusArray;
				this._setSrc(imsrc2,this.imPath+itemObject.images[2]);
				if (this._txtimg)
					return (imsrc.innerHTML="[+]")
			}
		}
		else
		{
			this._setSrc(imsrc2,this.imPath+itemObject.images[0])
		};
		var tempNum=2;
		if (!itemObject.treeNod.treeLinesOn)
			this._setSrc(imsrc,this.imPath+workArray[3]);
		else
		{
			if (itemObject.superObj)
				tempNum=this._getCountStatus(itemObject.id,itemObject.superObj);
			this._setSrc(imsrc,this.imPath+workArray[tempNum])
		}
};
treeViewObject.prototype.adjustLineShow=function(itemObject)
{
	if (!itemObject.pageLabel)
		return;
	var sNode=itemObject.superObj;
	if (sNode)
		if ((this._getLineStatus(itemObject.id,sNode)==0)||(!this.treeLinesOn))
			for(var i=1;i<=itemObject.childsCount;i++)
			{
				if (!itemObject.pageLabel.childNodes[0].childNodes[i])
					break;
				itemObject.pageLabel.childNodes[0].childNodes[i].childNodes[0].style.backgroundImage="";
				itemObject.pageLabel.childNodes[0].childNodes[i].childNodes[0].style.backgroundRepeat=""
			}
		else
			for(var i=1;i<=itemObject.childsCount;i++)
			{
				if (!itemObject.pageLabel.childNodes[0].childNodes[i])
					break;
				itemObject.pageLabel.childNodes[0].childNodes[i].childNodes[0].style.backgroundImage="url("+this.imPath+this.lineArray[5]+")";
				itemObject.pageLabel.childNodes[0].childNodes[i].childNodes[0].style.backgroundRepeat="repeat-y"
			}
};
treeViewObject.prototype._getCountStatus=function(itemId,itemObject)
{
	if (itemObject.childsCount<=1)
	{
		if (itemObject.id==this.rootId)
			return 4;
		else
			return 0
	};
	if (itemObject.childNodes[0].id==itemId)
		if (!itemObject.id)
			return 2;
	else 
		return 1;
	if (itemObject.childNodes[itemObject.childsCount-1].id==itemId)
		return 0;
	return 1
};
treeViewObject.prototype._getLineStatus =function(itemId,itemObject)
{
	if (itemObject.childNodes[itemObject.childsCount-1].id==itemId)
		return 0;
	return 1
};
treeViewObject.prototype._HideShow=function(itemObject,mode)
{
	if ((this.XMLsource)&&(!itemObject.XMLload))
	{
		if (mode==1)
			return;
		itemObject.XMLload=1;
		this._loadDynXML(itemObject.id);
		return
	};
	var Nodes=itemObject.pageLabel.childNodes[0].childNodes;
	var Count=Nodes.length;
	if (Count>1)
	{
		if ( ( (Nodes[1].style.display!="none")|| (mode==1) ) && (mode!=2) )
		{
			this.allTree.childNodes[0].border = "1";
			this.allTree.childNodes[0].border = "0";
			nodestyle="none"
		}
		else 
			nodestyle="";
		for (var i=1;i<Count;i++)
			Nodes[i].style.display=nodestyle
	};
	this.adjustStateChar(itemObject)
};
treeViewObject.prototype._getOpenState=function(itemObject)
{
	var z=itemObject.pageLabel.childNodes[0].childNodes;
	if (z.length<=1)
		return 0;
	if (z[1].style.display!="none")
		return 1;
	else 
		return -1
};

treeViewObject.prototype.onRowClick2=function()
{
	var that=this.superObj.treeNod;
	if (!that.callEvent("onDblClick",[this.superObj.id,that])) 
		return 0;
	if ((this.superObj.closeble)&&(this.superObj.closeble!="0"))
		that._HideShow(this.superObj);
	else
		that._HideShow(this.superObj,2);
	if (that.checkEvent("onOpenEnd"))
		if (!that.xmlstate)that.callEvent("onOpenEnd",[this.superObj.id,that._getOpenState(this.superObj)]);
		else
		{
			that._oie_onXLE.push(that.onXLE);
			that.onXLE=that._epnFHe
		}
};
treeViewObject.prototype.onRowClick=function()
{
	var that=this.superObj.treeNod;
	if (!that.callEvent("onOpenStart",[this.superObj.id,that._getOpenState(this.superObj)])) 
		return 0;
	if ((this.superObj.closeble)&&(this.superObj.closeble!="0"))
		that._HideShow(this.superObj);
	else
		that._HideShow(this.superObj,2);
	if (that.checkEvent("onOpenEnd"))
	if (!that.xmlstate)that.callEvent("onOpenEnd",[this.superObj.id,that._getOpenState(this.superObj)]);
	else
	{
		that._oie_onXLE.push(that.onXLE);
		that.onXLE=that._epnFHe
	}
};
treeViewObject.prototype._epnFHe=function(that,id,flag)
{
	if (id!=this.rootId)
		this.callEvent("onOpenEnd",[id,that.getOpenState(id)]);
	that.onXLE=that._oie_onXLE.pop();
	if (!flag && !that._oie_onXLE.length)
		if (that.onXLE)
			that.onXLE(that,id)
};
treeViewObject.prototype.onRowClickDown=function(e)
{
	e=e||window.event;
	var that=this.superObj.treeNod;
	that._selectItem(this.superObj,e)
};
treeViewObject.prototype.getSelectedItemId=function()
{
	var str=new Array();
	for (var i=0;i<this._selected.length;i++)
		str[i]=this._selected[i].id;
	return (str.join(this.tvseparator))
};
treeViewObject.prototype._selectItem=function(node,e)
{
	if (this._onSSCF)
		this._onSSCFold=this.getSelectedItemId();
	this._unselectItems();
	this._markItem(node);
	if (this._onSSCF)
	{
		var z=this.getSelectedItemId();
		if (z!=this._onSSCFold)
			this.callEvent("onSelect",[z])
	}
};
treeViewObject.prototype._markItem=function(node)
{
	if (node.scolor)
		node.span.style.color=node.scolor;
	node.span.className="selectedTreeRow";
	node.i_sel=true;
	this._selected[this._selected.length]=node
};
treeViewObject.prototype.getIndexById=function(itemId)
{
	var it=this._findCacheById(itemId);
	if (!it)
		return null;
	return this._getIndex(it)
};
treeViewObject.prototype._getIndex=function(w)
{
	var z=w.superObj;
	for (var i=0;i<z.childsCount;i++)
		if (z.childNodes[i]==w)
			return i
};
treeViewObject.prototype._unselectItem=function(node)
{
	if ((node)&&(node.i_sel))
	{
		node.span.className="standartTreeRow";
		if (node.acolor)node.span.style.color=node.acolor;
		node.i_sel=false;
		for (var i=0;i<this._selected.length;i++)if (!this._selected[i].i_sel)
		{
			this._selected.splice(i,1);
			break
		}
	}
};
treeViewObject.prototype._unselectItems=function()
{
	for (var i=0;i<this._selected.length;i++)
	{
		var node=this._selected[i];
		node.span.className="standartTreeRow";
		if (node.acolor)
			node.span.style.color=node.acolor;
		node.i_sel=false
	};
	this._selected=new Array()
};
treeViewObject.prototype.onRowSelect=function(e,htmlObject,mode)
{
	e=e||window.event;
	var obj=this.superObj;
	if (htmlObject)
		obj=htmlObject.superObj;
	var that=obj.treeNod;
	var lastId=that.getSelectedItemId();
	if ((!e)||(!e.skipUnSel))
	that._selectItem(obj,e);
	if (!mode)
	{
		if ((e)&&(e.button==2))
			that.callEvent("onRightClick",[obj.id,e]);
		if (obj.eventHandler)
			obj.eventHandler(obj.id,lastId);
		else 
			that.callEvent("onClick",[obj.id,lastId])
	}
};
treeViewObject.prototype.changeCState=function(ajaxObject)
{
	if (!this.tscheck) return;
	if (!ajaxObject) return;
	if (ajaxObject.id==this.rootId)
		return;
	var act=ajaxObject.childNodes;
	var flag1=0;
	var flag2=0;
	if (ajaxObject.childsCount==0)
		return;
	for (var i=0;i<ajaxObject.childsCount;i++)
	{
		if (act[i].dscheck)
			continue;
		if (act[i].checkstate==0)
			flag1=1;
		else if (act[i].checkstate==1)
			flag2=1;
		else
		{
			flag1=1;
			flag2=1;
			break
		}
	};
	if ((flag1)&&(flag2)) 
		this._setCheck(ajaxObject,"unsure");
	else if (flag1)
		this._setCheck(ajaxObject,false);
	else 
		this._setCheck(ajaxObject,true);

	this.changeCState(ajaxObject.superObj)
};
treeViewObject.prototype.onCheckBoxClick=function(e)
{
	if (!this.treeNod.callEvent("onBeforeCheck",[this.superObj.id,this.superObj.checkstate]))
		return;
	if (this.superObj.dscheck)
		return true;
	if (this.treeNod.tscheck)
		if (this.superObj.checkstate==1)
			this.treeNod._setSubChecked(false,this.superObj);
	else 
		this.treeNod._setSubChecked(true,this.superObj);
	else
	if (this.superObj.checkstate==1)
		this.treeNod._setCheck(this.superObj,false);
	else 
		this.treeNod._setCheck(this.superObj,true);
	this.treeNod.changeCState(this.superObj.superObj);
	return this.treeNod.callEvent("onCheck",[this.superObj.id,this.superObj.checkstate])
};
treeViewObject.prototype.createNodeElement=function(acheck,itemObject,mode)
{
	var table=document.createElement('table');
	table.cellSpacing=0;
	table.cellPadding=0;
	table.border=0;
	if(this.hfMode)table.style.tableLayout="fixed";
		table.style.margin=0;
	table.style.padding=0;
	var tbody=document.createElement('tbody');
	var tr=document.createElement('tr');
	var td1=document.createElement('td');
	td1.className="standartTreeImage";
	if(this._txtimg)
	{
		var img0=document.createElement("div");
		td1.appendChild(img0);
		img0.className="tree_textSign"
	}
	else
	{
		var img0=this.getHtmlNodeType(itemObject.id);
		img0.border="0";
		if (img0.tagName=="IMG")
			img0.align="absmiddle";
		td1.appendChild(img0);
		img0.style.padding=0;
		img0.style.margin=0;
		img0.style.width=this.def_line_img_x;
		img0.style.height=this.def_line_img_y
	};
	var td11=document.createElement('td');
	var chckImage=this.getHtmlNodeType(this.cBROf?this.rootId:itemObject.id);
	chckImage.checked=0;
	this._setSrc(chckImage,this.imPath+this.checkArray[0]);
	chckImage.style.width="16px";
	chckImage.style.height="16px";
	if (!acheck)
	{
		if(!IE)
			tdll.style.display="none";
		else
			chckImage.style.display="none";
	}
	td11.appendChild(chckImage);
	if ((!this.cBROf)&&(chckImage.tagName=="IMG")) 
		chckImage.align="absmiddle";

	chckImage.onclick=this.onCheckBoxClick;
	chckImage.treeNod=this;
	chckImage.superObj=itemObject;
	td11.width="20px";
	var td12=document.createElement('td');
	td12.className="standartTreeImage";

	var img=this.getHtmlNodeType(this.timgen?itemObject.id:this.rootId);
	img.onmousedown=this._preventNsDrag;
	img.ondragstart=this._preventNsDrag;
	img.border="0";
	if (this._aimgs)
	{
		img.superObj=itemObject;
		if (img.tagName=="IMG")
			img.align="absmiddle";
		img.onclick=this.onRowSelect
	};
	if (!mode)
		this._setSrc(img,this.imPath+this.imageArray[0]);
	td12.appendChild(img);
	img.style.padding=0;
	img.style.margin=0;
	if (this.timgen)
	{
		td12.style.width=img.style.width=this.def_img_x;
		img.style.height=this.def_img_y
	}
	else
	{
		img.style.width="0px";
		img.style.height="0px";
		if (Opera)
			td12.style.display="none"
	};
	var td2=document.createElement('td');
	td2.className="standartTreeRow";
	itemObject.span=document.createElement('span');
	itemObject.span.className="standartTreeRow";
	
	td2.noWrap=true;

	if (!Khtml)
		td2.style.width="100%";

	itemObject.span.innerHTML=itemObject.label;
	td2.appendChild(itemObject.span);
	td2.superObj=itemObject;
	td1.superObj=itemObject;
	td2.onclick=this.onRowSelect;
	td1.onclick=this.onRowClick;
	td2.ondblclick=this.onRowClick2;
	if (this.ettip)
		tr.title=itemObject.label;
	if (this.dragAndDropFlag)
	{
		if (this._aimgs)
		{
		this.dragger.addDraggableItem(td12,this);
		td12.superObj=itemObject
		};
		this.dragger.addDraggableItem(td2,this)
	};
	itemObject.span.style.paddingLeft="5px";
	itemObject.span.style.paddingRight="5px";
	td2.style.verticalAlign="";
	td2.style.fontSize="10pt";
	td2.style.cursor=this.style_pointer;
	tr.appendChild(td1);
	tr.appendChild(td11);
	tr.appendChild(td12);
	tr.appendChild(td2);
	tbody.appendChild(tr);
	table.appendChild(tbody);
	if (this.ehlt)
	{
		tr.onmousemove=this._itemMouseIn;
		tr[(IE)?"onmouseleave":"onmouseout"]=this._itemMouseOut
	};
	if(this.checkEvent && this.checkEvent("onRightClick"))
		tr.oncontextmenu=Function("e","this.childNodes[0].superObj.treeNod.callEvent('onRightClick',[this.childNodes[0].superObj.id,(e||window.event)]);return false;");
	return table
};
treeViewObject.prototype.setImagePath=function( newPath )
{
	this.imPath=newPath
};
treeViewObject.prototype.setOnRightClickHandler=function(func)
{
	this.attachEvent("onRightClick",func)
};
treeViewObject.prototype.setOnClickHandler=function(func)
{
	this.attachEvent("onClick",func)
};
treeViewObject.prototype.setOnSelectStateChange=function(func)
{
	this.attachEvent("onSelect",func);
	this._onSSCF=true
};
treeViewObject.prototype.setXMLAutoLoading=function(filePath)
{
	this.XMLsource=filePath
};
treeViewObject.prototype.setOnCheckHandler=function(func)
{
	this.attachEvent("onCheck",func)
};
treeViewObject.prototype.setOnOpenHandler=function(func)
{

	this.attachEvent("onOpenStart",func)
};
treeViewObject.prototype.setOnOpenStartHandler=function(func)
{
	this.attachEvent("onOpenStart",func)
};
treeViewObject.prototype.setOnOpenEndHandler=function(func)
{
	this.attachEvent("onOpenEnd",func)
};
treeViewObject.prototype.setOnDblClickHandler=function(func)
{
	this.attachEvent("onDblClick",func)
};
treeViewObject.prototype.openAllItems=function(itemId)
{
	var temp=this._findCacheById(itemId);
	if (!temp)return 0;
	this._xopenAll(temp)
};
treeViewObject.prototype.getOpenState=function(itemId)
{
	var temp=this._findCacheById(itemId);
	if (!temp)return "";
	return this._getOpenState(temp)
};
treeViewObject.prototype.closeAllItems=function(itemId)
{
	if (itemId===window.undefined)itemId=this.rootId;
	var temp=this._findCacheById(itemId);
	if (!temp)return 0;
	this._xcloseAll(temp);
	this.allTree.childNodes[0].border = "1";
	this.allTree.childNodes[0].border = "0"
};
treeViewObject.prototype.setUserData=function(itemId,name,value)
{
	var sNode=this._findCacheById(itemId,0,true);
	if (!sNode)
		return;
	if(name=="hint")
		sNode.pageLabel.childNodes[0].childNodes[0].title=value;
	if (typeof(sNode.userData["t_"+name])=="undefined")
	{
		if (!sNode._userdatalist)
			sNode._userdatalist=name;
		else
			sNode._userdatalist+=","+name
	};
	sNode.userData["t_"+name]=value
};
treeViewObject.prototype.getUserData=function(itemId,name)
{
	var sNode=this._findCacheById(itemId,0,true);
	if (!sNode)
		return;
	return sNode.userData["t_"+name]
};
treeViewObject.prototype.getItemColor=function(itemId)
{
	var temp=this._findCacheById(itemId);
	if (!temp)
		return 0;
	var res= new Object();
	if (temp.acolor)
		res.acolor=temp.acolor;
	if (temp.acolor)
		res.scolor=temp.scolor;
	return res
};

treeViewObject.prototype.setNodeColor=function(itemId,defaultColor,selectedColor)
{
	if ((itemId)&&(itemId.span))
		var temp=itemId;
	else
		var temp=this._findCacheById(itemId);
	if (!temp)
		return 0;
	else
	{
		if (temp.i_sel)
		{
			if (selectedColor)
				temp.span.style.color=selectedColor
		}
		else
		{
		if (defaultColor)temp.span.style.color=defaultColor
		};
		if (selectedColor)
			temp.scolor=selectedColor;
		if (defaultColor)
			temp.acolor=defaultColor
	}
};
treeViewObject.prototype.getItemText=function(itemId)
{
	var temp=this._findCacheById(itemId);
	if (!temp)
		return 0;
	return(temp.pageLabel.childNodes[0].childNodes[0].childNodes[3].childNodes[0].innerHTML)
};
treeViewObject.prototype.getParentId=function(itemId)
{
	var temp=this._findCacheById(itemId);
	if ((!temp)||(!temp.superObj)) return "";
	return temp.superObj.id
};
treeViewObject.prototype.changeItemId=function(itemId,newItemId)
{
	if (itemId==newItemId)return;
	var temp=this._findCacheById(itemId);
	if (!temp)return 0;
	temp.id=newItemId;
	temp.span.contextMenuId=newItemId;
	this.dragItems[newItemId]=this.dragItems[itemId];
	delete this.dragItems[itemId]
};
treeViewObject.prototype.doCut=function()
{
	if (this.nodeCut)this.clearCut();
	this.nodeCut=(new Array()).concat(this._selected);
	for (var i=0;i<this.nodeCut.length;i++)
	{
	var tempa=this.nodeCut[i];
	tempa._cimgs=new Array();
	tempa._cimgs[0]=tempa.images[0];
	tempa._cimgs[1]=tempa.images[1];
	tempa._cimgs[2]=tempa.images[2];
	tempa.images[0]=tempa.images[1]=tempa.images[2]=this.cutImage;
	this.adjustStateChar(tempa)
	}
};
treeViewObject.prototype.doPaste=function(itemId)
{
	var tobj=this._findCacheById(itemId);
	if (!tobj)
		return 0;
	for (var i=0;i<this.nodeCut.length;i++)
	{
		if (this._checkPNodes(tobj,this.nodeCut[i]))
			continue;
		this._moveNode(this.nodeCut[i],tobj)
	};
	this.clearCut()
};
treeViewObject.prototype.clearCut=function()
{
	for (var i=0;i<this.nodeCut.length;i++)
	{
		var tempa=this.nodeCut[i];
		tempa.images[0]=tempa._cimgs[0];
		tempa.images[1]=tempa._cimgs[1];
		tempa.images[2]=tempa._cimgs[2];
		this.adjustStateChar(tempa)
	};
	this.nodeCut=new Array()
};
treeViewObject.prototype._moveNode=function(itemObject,targetObject)
{
	return this._moveNodeTo(itemObject,targetObject)
};
treeViewObject.prototype._fixNodesCollection=function(target,zParent)
{
	var flag=0;
	var icount=0;
	var Nodes=target.childNodes;
	var Count=target.childsCount-1;
	if (zParent==Nodes[Count])return;
	for (var i=0;i<Count;i++)if (Nodes[i]==Nodes[Count])
	{
		Nodes[i]=Nodes[i+1];
		Nodes[i+1]=Nodes[Count]
	};
	for (var i=0;i<Count+1;i++)
	{
		if (flag)
		{
			var temp=Nodes[i];
			Nodes[i]=flag;
			flag=temp
		}
		else
			if (Nodes[i]==zParent)
			{
				flag=Nodes[i];
				Nodes[i]=Nodes[Count]
			}
	}
};
treeViewObject.prototype._recreateBranch=function(itemObject,targetObject,bfItem,level)
{
	var i;
	var st="";
	if (bfItem)
	{
		for (i=0;i<targetObject.childsCount;i++)if (targetObject.childNodes[i]==bfItem)break;
		if (i!=0)bfItem=targetObject.childNodes[i-1];
		else
		{
		st="TOP";
		bfItem=""
		}
		};
		var t2=this._onradh;
		this._onradh=null;
		var nodeForCreate=this.appendChildNode(targetObject,itemObject.id,itemObject.label,0,itemObject.images[0],itemObject.images[1],itemObject.images[2],st,0,bfItem);
		nodeForCreate._userdatalist=itemObject._userdatalist;
		nodeForCreate.userData=itemObject.userData.dataclone();
		nodeForCreate.XMLload=itemObject.XMLload;
		if (t2)
		{
		this._onradh=t2;
		this._onradh(nodeForCreate.id)
	};
	for (var i=0;i<itemObject.childsCount;i++)
		this._recreateBranch(itemObject.childNodes[i],nodeForCreate,0,1);
	return nodeForCreate
};
	//移动节点： 参数说明： itemObject 原始被拖动节点  targetObject 目标位置对象  bfItem 前一个条目
treeViewObject.prototype._moveNodeTo=function(itemObject,targetObject,bfItem)
{
	if (itemObject.treeNod._nonTrivialNode)
		return itemObject.treeNod._nonTrivialNode(this,targetObject,bfItem,itemObject);
	if (targetObject.mytype)
		var framesMove=(itemObject.treeNod.lWin!=targetObject.lWin);
	else
		var framesMove=(itemObject.treeNod.lWin!=targetObject.treeNod.lWin);

	if (!this.callEvent("onDrag",[itemObject.id,targetObject.id,(bfItem?bfItem.id:null),itemObject.treeNod,targetObject.treeNod]))
		return false;
	if ((targetObject.XMLload==0)&&(this.XMLsource))
	{
		targetObject.XMLload=1;
		this._loadDynXML(targetObject.id)
	};

	this.openItem(targetObject.id);
	var pTreeData=itemObject.treeNod;

	//alert(targetObject.id + "::"+itemObject.id);
	var c=itemObject.superObj.childsCount;
	var z=itemObject.superObj;
	if ((framesMove)||(pTreeData.dpcpy))
	{
		var _otiid=itemObject.id;
		itemObject=this._recreateBranch(itemObject,targetObject,bfItem);
		if (!pTreeData.dpcpy)
			pTreeData.deleteItem(_otiid)
	}
	else
	{
		var Count=targetObject.childsCount;
		var Nodes=targetObject.childNodes;
		if (Count==0)
			targetObject._open=true;
		pTreeData._unselectItem(itemObject);
		Nodes[Count]=itemObject;
		itemObject.treeNod=targetObject.treeNod;
		targetObject.childsCount++;
		var tr=this._createTableRow(Nodes[Count].pageLabel);
		if (!bfItem)
		{
			targetObject.pageLabel.childNodes[0].appendChild(tr);
			if (this.dadmode==1)
				this._fixNodesCollection(targetObject,bfItem)
		}
		else
		{
			targetObject.pageLabel.childNodes[0].insertBefore(tr,bfItem.tr);
			this._fixNodesCollection(targetObject,bfItem);
			Nodes=targetObject.childNodes
		}
	};
	if ((!pTreeData.dpcpy)&&(!framesMove))
	{
		var zir=itemObject.tr;
		if ((document.all)&&(navigator.appVersion.search(/MSIE\ 5\.0/gi)!=-1))
		{
			window.setTimeout(function()
			{
				zir.parentNode.removeChild(zir)
			}
			, 250 )
		}
		else
			itemObject.superObj.pageLabel.childNodes[0].removeChild(itemObject.tr);
		if ((!bfItem)||(targetObject!=itemObject.superObj))
		{
			for (var i=0;i<z.childsCount;i++)
			{
				if (z.childNodes[i].id==itemObject.id)
				{
					z.childNodes[i]=0;
					break
				}
			}
		}
		else 
			z.childNodes[z.childsCount-1]=0;
		pTreeData._compressChildList(z.childsCount,z.childNodes);
		z.childsCount--			
	};
	if ((!framesMove)&&(!pTreeData.dpcpy))
	{
		itemObject.tr=tr;
		tr.nodem=itemObject;
		itemObject.superObj=targetObject;
		if (pTreeData!=targetObject.treeNod)
		{
			if(itemObject.treeNod.processBranch(itemObject,pTreeData)) 
				return;
			this._clearStyles(itemObject);
			this._redrawFrom(this,itemObject.superObj)
		};
		this.adjustStateChar(targetObject);
		this.adjustLineShow(targetObject);
		this.adjustLineShow(itemObject);
		this.adjustStateChar(itemObject);
		if (bfItem)
		{
			this.adjustStateChar(bfItem)
		}
		else
			if (targetObject.childsCount>=2)
			{
				this.adjustStateChar(Nodes[targetObject.childsCount-2]);
				this.adjustLineShow(Nodes[targetObject.childsCount-2])
			};
		this.adjustStateChar(Nodes[targetObject.childsCount-1]);
		if (this.tscheck)
			this.changeCState(targetObject);
		if (pTreeData.tscheck)
			pTreeData.changeCState(z)
	};
	if (c>1)
	{
		pTreeData.adjustStateChar(z.childNodes[c-2]);
		pTreeData.adjustLineShow(z.childNodes[c-2])
	};
	pTreeData.adjustStateChar(z);
	pTreeData.adjustLineShow(z);

	this.callEvent("onDrop",[itemObject.id,targetObject.id,(bfItem?bfItem.id:null),pTreeData,targetObject.treeNod]);
	return itemObject.id
};
treeViewObject.prototype._clearStyles=function(itemObject)
{
	if (!itemObject.pageLabel)
		return;
	var td1=itemObject.pageLabel.childNodes[0].childNodes[0].childNodes[1];
	var td3=td1.nextSibling.nextSibling;
	itemObject.span.innerHTML=itemObject.label;
	itemObject.i_sel=false;
	if (itemObject._aimgs)
		this.dragger.removeDraggableItem(td1.nextSibling);
	if (this.checkBoxOff)
	{
		td1.childNodes[0].style.display="";
		td1.childNodes[0].onclick=this.onCheckBoxClick;
		this._setSrc(td1.childNodes[0],this.imPath+this.checkArray[itemObject.checkstate])
	}
	else 
		td1.childNodes[0].style.display="none";
	td1.childNodes[0].treeNod=this;
	this.dragger.removeDraggableItem(td3);
	if (this.dragAndDropFlag)
		this.dragger.addDraggableItem(td3,this);
	if (this._aimgs)
		this.dragger.addDraggableItem(td1.nextSibling,this);
	td3.childNodes[0].className="standartTreeRow";
	td3.onclick=this.onRowSelect;
	td3.ondblclick=this.onRowClick2;
	td1.previousSibling.onclick=this.onRowClick;
	this.adjustLineShow(itemObject);
	this.adjustStateChar(itemObject);
	for (var i=0;i<itemObject.childsCount;i++)
		this._clearStyles(itemObject.childNodes[i])
};
treeViewObject.prototype.processBranch=function(itemObject,pTreeData)
{
	if (pTreeData)pTreeData._globalIdStorageSub(itemObject.id);
	itemObject.id=this.addId2Cache(itemObject.id,itemObject);
	itemObject.treeNod=this;
	for (var i=0;i<itemObject.childsCount;i++)
		this.processBranch(itemObject.childNodes[i],pTreeData);
	return 0
};
treeViewObject.prototype.enableThreeStateCheckboxes=function(mode)
{
	this.tscheck=convertStringToBoolean(mode)
};
treeViewObject.prototype.setOnMouseInHandler=function(func)
{
	this.ehlt=true;
	this.attachEvent("onMouseIn",func)
};
treeViewObject.prototype.setOnMouseOutHandler=function(func)
{
	this.ehlt=true;
	this.attachEvent("onMouseOut",func)
};
treeViewObject.prototype.enableTreeImages=function(mode)
{
	this.timgen=convertStringToBoolean(mode)
};
treeViewObject.prototype.enableFixedMode=function(mode)
{
	this.hfMode=convertStringToBoolean(mode)
};
treeViewObject.prototype.enableCheckBoxes=function(mode, hidden)
{
	this.checkBoxOff=convertStringToBoolean(mode);
	this.cBROf=(!(this.checkBoxOff||convertStringToBoolean(hidden)))
};
treeViewObject.prototype.setStdImages=function(image1,image2,image3)
{
	this.imageArray[0]=image1;
	this.imageArray[1]=image2;
	this.imageArray[2]=image3
};
treeViewObject.prototype.enableTreeLines=function(mode)
{
	this.treeLinesOn=convertStringToBoolean(mode)
};
treeViewObject.prototype.setImageArrays=function(arrayName,image1,image2,image3,image4,image5)
{
	switch(arrayName)
	{
		case "plus":
			this.plusArray[0]=image1;
			this.plusArray[1]=image2;
			this.plusArray[2]=image3;
			this.plusArray[3]=image4;
			this.plusArray[4]=image5;
			break;
		case "minus": 
			this.minusArray[0]=image1;
			this.minusArray[1]=image2;
			this.minusArray[2]=image3;
			this.minusArray[3]=image4;
			this.minusArray[4]=image5;
			break
	}
};
treeViewObject.prototype.openItem=function(itemId)
{
	var temp=this._findCacheById(itemId);
	if (!temp)
		return 0;
	else 
		return this._openItem(temp)
};
treeViewObject.prototype._openItem=function(item)
{
	var state=this._getOpenState(item);
	if ((state<0)||(((this.XMLsource)&&(!item.XMLload))))
	{
		if (!this.callEvent("onOpenStart",[item.id,state])) 
			return 0;
		this._HideShow(item,2);
		if (this.checkEvent("onOpenEnd"))
		{
			if (this.onXLE==this._epnFHe)
				this._epnFHe(this,item.id,true);
			if (!this.xmlstate || !this.XMLsource)
				this.callEvent("onOpenEnd",[item.id,this._getOpenState(item)]);
			else
			{
				this._oie_onXLE.push(this.onXLE);
				this.onXLE=this._epnFHe
			}
		}
	}
	else if (this._srnd)
		this._HideShow(item,2);
	if(this._openCascade==true)
	{
		if (item.superObj)
			this._openItem(item.superObj)
	}
};
treeViewObject.prototype.closeItem=function(itemId)
{
	if (this.rootId==itemId)
		return 0;
	var temp=this._findCacheById(itemId);
	if (!temp)
		return 0;
	if (temp.closeble)
		this._HideShow(temp,1)
};
treeViewObject.prototype.getLevel=function(itemId)
{
	var temp=this._findCacheById(itemId);
	if (!temp)
		return 0;
	return this._getNodeLevel(temp,0)
};
treeViewObject.prototype.setItemCloseable=function(itemId,flag)
{
	flag=convertStringToBoolean(flag);
	if ((itemId)&&(itemId.span))
		var temp=itemId;
	else
		var temp=this._findCacheById(itemId);
	if (!temp)
		return 0;
	temp.closeble=flag
};
treeViewObject.prototype._getNodeLevel=function(itemObject,count)
{
	if (itemObject.superObj)
		return this._getNodeLevel(itemObject.superObj,count+1);
	return(count)
};
treeViewObject.prototype.hasChildren=function(itemId)
{
	var temp=this._findCacheById(itemId);
	if (!temp)
		return 0;
	else
	{
		if ( (this.XMLsource)&&(!temp.XMLload) ) 
			return true;
		else
			return temp.childsCount
	}
};
treeViewObject.prototype._getLeafCount=function(itemNode)
{
	var counter=0;
	for (var b=0;b<itemNode.childsCount;b++)
		if (itemNode.childNodes[b].childsCount==0)
			counter++;
	return counter
};
treeViewObject.prototype.setItemText=function(itemId,newLabel,newTooltip)
{
	var curObj=this._findCacheById(itemId);
	if (!curObj)
		return 0;
	curObj.label=newLabel;
	curObj.span.innerHTML=newLabel;
	curObj.span.parentNode.parentNode.title=newTooltip||""
};
treeViewObject.prototype.getItemTooltip=function(itemId)
{
	var curObj=this._findCacheById(itemId);
	if (!curObj)return "";
	return (curObj.span.parentNode.parentNode._dhx_title||temp.span.parentNode.parentNode.title||"")
};
treeViewObject.prototype.refreshItem=function(itemId)
{
	if (!itemId)itemId=this.rootId;
	var curObj=this._findCacheById(itemId);
	this.deleteChildItems(itemId);
	this._loadDynXML(itemId)
};
treeViewObject.prototype.setItemImage2=function(itemId, image1,image2,image3)
{
	var curObj=this._findCacheById(itemId);
	if (!curObj)return 0;
	curObj.images[1]=image2;
	curObj.images[2]=image3;
	curObj.images[0]=image1;
	this.adjustStateChar(curObj)
};
treeViewObject.prototype.setItemImage=function(itemId,image1,image2)
{
	var curObj=this._findCacheById(itemId);
	if (!curObj)return 0;
	if (image2)
	{
	curObj.images[1]=image1;
	curObj.images[2]=image2
	}
	else curObj.images[0]=image1;
	this.adjustStateChar(curObj)
};
treeViewObject.prototype.getSubItems =function(itemId)
{
	var curObj=this._findCacheById(itemId,0,1);
	if (!curObj)return 0;
	var id="";
	for (i=0;i<curObj.childsCount;i++)
	{
		if (!id)
			id=curObj.childNodes[i].id;
		else 
			id+=this.tvseparator+curObj.childNodes[i].id
	};
	return id
};
treeViewObject.prototype._getAllScraggyItems =function(node)
{
	var id="";
	for (var i=0;i<node.childsCount;i++)
	{
		if ((node.childNodes[i].unParsed)||(node.childNodes[i].childsCount>0))
		{
		if (node.childNodes[i].unParsed)
			var tmpId=this._getAllScraggyItemsXML(node.childNodes[i].unParsed,1);
		else
			var tmpId=this._getAllScraggyItems(node.childNodes[i])
		if (tmpId)
			if (id)id+=this.tvseparator+tmpId;
			else id=tmpId
		}
		else
		if (!id)id=node.childNodes[i].id;
		else id+=this.tvseparator+node.childNodes[i].id
	};
	return id
};
treeViewObject.prototype._getAllFatItems =function(node)
{
	var id="";
	for (var i=0;i<node.childsCount;i++)
	{
		if ((node.childNodes[i].unParsed)||(node.childNodes[i].childsCount>0))
		{
			if (!id)id=node.childNodes[i].id;
			else id+=this.tvseparator+node.childNodes[i].id;
			if (node.childNodes[i].unParsed)
				var tmpId=this._getAllFatItemsXML(node.childNodes[i].unParsed,1);
			else
				var tmpId=this._getAllFatItems(node.childNodes[i])
			if (tmpId)id+=this.tvseparator+tmpId
		}
	};
	return id
};
treeViewObject.prototype._getAllSubItems =function(itemId,z,node)
{
	if (node)
		var curObj=node;
	else
	{
		var curObj=this._findCacheById(itemId)
	};
	if (!curObj)
		return 0;
	var id="";
	for (var i=0;i<curObj.childsCount;i++)
	{
		if (!id)
			id=curObj.childNodes[i].id;
		else 
			id+=this.tvseparator+curObj.childNodes[i].id;
		var tmpId=this._getAllSubItems(0,id,curObj.childNodes[i])
		if (tmpId)
			id+=this.tvseparator+tmpId
	};
	return id
};
treeViewObject.prototype.selectItem=function(itemId,mode,preserve)
{
	mode=convertStringToBoolean(mode);
	var curObj=this._findCacheById(itemId);
	if ((!curObj)||(!curObj.superObj)) return 0;
	if (this.dataLoadAlert)
		curObj.superObj.openMe=1;
	else
		this._openItem(curObj.superObj);
	var ze=null;
	if (preserve)
	{
		ze=new Object;
		ze.ctrlKey=true;
		if (curObj.i_sel)
			ze.skipUnSel=true
	};
	if (mode)
		this.onRowSelect(ze,curObj.pageLabel.childNodes[0].childNodes[0].childNodes[3],false);
	else
		this.onRowSelect(ze,curObj.pageLabel.childNodes[0].childNodes[0].childNodes[3],true)
};
treeViewObject.prototype.getSelectedItemText=function()
{
	var htmlInfo=new Array();
	for (var i=0;i<this._selected.length;i++)
		htmlInfo[i]=this._selected[i].span.innerHTML;
	return (htmlInfo.join(this.tvseparator))
};
treeViewObject.prototype._compressChildList=function(Count,Nodes)
{
	Count--;
	for (var i=0;i<Count;i++)
	{
		if (Nodes[i]==0)
		{
			Nodes[i]=Nodes[i+1];
			Nodes[i+1]=0
		}
	}
};
treeViewObject.prototype._deleteNode=function(itemId,htmlObject,skip)
{
	if ((!htmlObject)||(!htmlObject.superObj)) return 0;
	var tempos=0;
	var tempos2=0;
	if (htmlObject.tr.nextSibling)tempos=htmlObject.tr.nextSibling.nodem;
	if (htmlObject.tr.previousSibling)tempos2=htmlObject.tr.previousSibling.nodem;
	var superObject=htmlObject.superObj;
	var Count=superObject.childsCount;
	var Nodes=superObject.childNodes;
	for (var i=0;i<Count;i++)
	{
		if (Nodes[i].id==itemId)
		{
			if (!skip)
				superObject.pageLabel.childNodes[0].removeChild(Nodes[i].tr);
			Nodes[i]=0;
			break
		}
	};
	this._compressChildList(Count,Nodes);
	if (!skip)
	{
		superObject.childsCount--
	};
	if (tempos)
	{
		this.adjustStateChar(tempos);
		this.adjustLineShow(tempos)
	};
	if (tempos2)
	{
		this.adjustStateChar(tempos2);
		this.adjustLineShow(tempos2)
	};
	if (this.tscheck)
		this.changeCState(sN);
	if (!skip)
	{
		this._globalIdStorageRecSub(htmlObject)
	}
};
treeViewObject.prototype.setCheck=function(itemId,state)
{
	var sNode=this._findCacheById(itemId,0,1);
	if (!sNode)
		return;
	if (state==="unsure")
		this._setCheck(sNode,state);
	else
	{
		state=convertStringToBoolean(state);
		if ((this.tscheck)&&(this.smcheck)) 
			this._setSubChecked(state,sNode);
		else 
			this._setCheck(sNode,state)
	};
	if (this.smcheck)
		this.changeCState(sNode.superObj)
};
treeViewObject.prototype._setCheck=function(sNode,state)
{
	if (!sNode)
		return;
	if (((sNode.superObj._r_logic)||(this._frbtr))&&(state))
	if (this._frbtrs)
	{
		if (this._frbtrL)
			this._setCheck(this._frbtrL,0);
		this._frbtrL=sNode
	}
	else
		for (var i=0;i<sNode.superObj.childsCount;i++)
			this._setCheck(sNode.superObj.childNodes[i],0);
	var z=sNode.pageLabel.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
	if (state=="unsure")
		sNode.checkstate=2;
	else if (state)
		sNode.checkstate=1;
	else 
		sNode.checkstate=0;
	if (sNode.dscheck)
		sNode.checkstate=sNode.dscheck;
	this._setSrc(z,this.imPath+((sNode.superObj._r_logic||this._frbtr)?this.radioArray:this.checkArray)[sNode.checkstate])
};
treeViewObject.prototype.setSubChecked=function(itemId,state)
{
	var sNode=this._findCacheById(itemId);
	this._setSubChecked(state,sNode);
	this.changeCState(sNode.superObj)
};
treeViewObject.prototype._setSubChecked=function(state,currNode)
{
	state=convertStringToBoolean(state);
	if (!currNode)return;
	if (((currNode.superObj._r_logic)||(this._frbtr))&&(state))
	for (var i=0;i<currNode.superObj.childsCount;i++)this._setSubChecked(0,currNode.superObj.childNodes[i]);
	if (currNode._r_logic||this._frbtr)this._setSubChecked(state,currNode.childNodes[0]);
	else
	for (var i=0;i<currNode.childsCount;i++)
	{
	this._setSubChecked(state,currNode.childNodes[i])
	};
	var aNode=currNode.pageLabel.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
	if (state)
		currNode.checkstate=1;
	else 
		currNode.checkstate=0;
	if (currNode.dscheck)
		currNode.checkstate=currNode.dscheck;
	this._setSrc(aNode,this.imPath+((currNode.superObj._r_logic||this._frbtr)?this.radioArray:this.checkArray)[currNode.checkstate])
};
treeViewObject.prototype.isItemChecked=function(itemId)
{
	var currNode=this._findCacheById(itemId);
	if (!currNode)return;
	return currNode.checkstate
};
treeViewObject.prototype.deleteChildItems=function(itemId)
{
	var currNode=this._findCacheById(itemId);
	if (!currNode)
		return;
	var j=currNode.childsCount;
	for (var i=0;i<j;i++)
	{
		this._deleteNode(currNode.childNodes[0].id,currNode.childNodes[0])
	}
};
treeViewObject.prototype.deleteItem=function(itemId,selectParent)
{
	if ((!this._onrdlh)||(this._onrdlh(itemId)))
	{
		var z=this._deleteItem(itemId,selectParent)
	};
	this.allTree.childNodes[0].border = "1";
	this.allTree.childNodes[0].border = "0"
};
treeViewObject.prototype._deleteItem=function(itemId,selectParent,skip)
{
	selectParent=convertStringToBoolean(selectParent);
	var sNode=this._findCacheById(itemId);
	if (!sNode)return;
	var pid=this.getParentId(itemId);
	var zTemp=sNode.superObj;
	this._deleteNode(itemId,sNode,skip);
	this.adjustStateChar(zTemp);
	this.adjustLineShow(zTemp);
	if ((selectParent)&&(pid!=this.rootId)) this.selectItem(pid,1);
	return zTemp
};
treeViewObject.prototype._globalIdStorageRecSub=function(itemObject)
{
	for(var i=0;i<itemObject.childsCount;i++)
	{
		this._globalIdStorageRecSub(itemObject.childNodes[i]);
		this._globalIdStorageSub(itemObject.childNodes[i].id)
	};
	this._globalIdStorageSub(itemObject.id);
	var z=itemObject;
	z.span=null;
	z.tr.nodem=null;
	z.tr=null;
	z.pageLabel=null
};
treeViewObject.prototype.insertNewNext=function(itemId,newItemId,itemText,itemeventHandler,image1,image2,image3,optionStr,children)
{
	var sNode=this._findCacheById(itemId);
	if ((!sNode)||(!sNode.superObj)) 
		return (0);
	return this.appendChildNode(0,newItemId,itemText,itemeventHandler,image1,image2,image3,optionStr,children,sNode);
};
treeViewObject.prototype.getItemIdByIndex=function(itemId,index)
{
	var z=this._findCacheById(itemId);
	if ((!z)||(index>z.childsCount)) 
		return null;
	return z.childNodes[index].id
};
treeViewObject.prototype.getChildItemIdByIndex=function(itemId,index)
{
	var aItem=this._findCacheById(itemId);
	if ((!aItem)||(index>=aItem.childsCount)) 
		return null;
	return aItem.childNodes[index].id
};
treeViewObject.prototype.setDragHandler=function(func)
{
	this.attachEvent("onDrag",func)
};
treeViewObject.prototype._clearMove=function()
{
	if (this._lastMark)
	{
		this._lastMark.className=this._lastMark.className.replace(/dragAndDropRow/g,"");
		this._lastMark=null
	};
	this.allTree.className=this.allTree.className.replace(" selectionBox","")
};
treeViewObject.prototype.enableDragAndDrop=function(mode,rmode)
{
	if (mode=="temporary_disabled")
	{
		this.dADTempOff=false;
		mode=true
	}
	else
		this.dADTempOff=true;
	this.dragAndDropFlag=convertStringToBoolean(mode);
	if (this.dragAndDropFlag)
		this.dragger.addDragLanding(this.allTree,this);
	if (arguments.length>1)
		this._ddronr=(!convertStringToBoolean(rmode))
};
treeViewObject.prototype._setMove=function(pageLabel,x,y)
{
	if (pageLabel.superObj.span)
	{
		var a1=getAbsoluteTop(pageLabel);
		var a2=getAbsoluteTop(this.allTree);
		this.dadmodec=this.dadmode;
		this.dadmodefix=0;
		var zN=pageLabel.superObj.span;
		zN.className+=" dragAndDropRow";
		this._lastMark=zN;
		this._scrollable(null,a1,a2)
	}
};
treeViewObject.prototype._scrollable=function(node,a1,a2)
{
	if (this.scrollable)
	{
		if (node)
		{
			a1=getAbsoluteTop(node);
			a2=getAbsoluteTop(this.allTree)
		};
		if ( (a1-a2-parseInt(this.allTree.scrollTop))>(parseInt(this.allTree.offsetHeight)-50) )
			this.allTree.scrollTop=parseInt(this.allTree.scrollTop)+20;
		if ( (a1-a2)<(parseInt(this.allTree.scrollTop)+30) )
			this.allTree.scrollTop=parseInt(this.allTree.scrollTop)-20
	}
};
treeViewObject.prototype._createDragNode=function(htmlObject,e)
{
	if (!this.dADTempOff)return null;
	var obj=htmlObject.superObj;
	if (!this.callEvent("onBeforeDrag",[obj.id])) 
		return null;
	if (!obj.i_sel)
		this._selectItem(obj,e);
	var dragSpan=document.createElement('div');
	var text=new Array();
	if (this.imagedrag)
		for (var i=0;i<this._selected.length;i++)
			text[i]="<table cellspacing='0' cellpadding='0'><tr><td><img width='18px' height='18px' src='"+this._getSrc(this._selected[i].span.parentNode.previousSibling.childNodes[0])+"'></td><td>"+this._selected[i].span.innerHTML+"</td></tr><table>";
	else
		text=this.getSelectedItemText().split(this.tvseparator);
	dragSpan.innerHTML=text.join("");
	dragSpan.style.position="absolute";
	dragSpan.className="dragSpanDiv";
	this._dragged=(new Array()).concat(this._selected);
	return dragSpan
};
treeViewObject.prototype._focusNode=function(item)
{
	var z=getAbsoluteTop(item.pageLabel)-getAbsoluteTop(this.allTree);
	if ((z>(this.allTree.scrollTop+this.allTree.offsetHeight-30))||(z<this.allTree.scrollTop))
		this.allTree.scrollTop=z
};
treeViewObject.prototype._preventNsDrag=function(e)
{
	if ((e)&&(e.preventDefault))
	{
		e.preventDefault();
		return false
	};
	return false
};
treeViewObject.prototype._drag=function(sourceHtmlObject,ajaxObj,targetHtmlObject)
{
	if (this._autoOpenTimer)
		clearTimeout(this._autoOpenTimer);
	if (!targetHtmlObject.superObj)
	{
		targetHtmlObject=this.pageLabel.pageLabel.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
		this.dadmodec=0
	};
	this._clearMove();
	var aNode=sourceHtmlObject.superObj.treeNod;
	if ((aNode)&&(aNode._clearMove)) 
		aNode._clearMove("");
	if ((!this.dragMove)||(this.dragMove()))
	{
		if ((!aNode)||(!aNode._clearMove)||(!aNode._dragged)) 
			var col=new Array(sourceHtmlObject.superObj);
		else 
			var col=aNode._dragged;
		var trg=targetHtmlObject.superObj;

		for (var i=0;i<col.length;i++)
		{
			var newID=this._moveNode(col[i],trg);
			if ((this.dadmodec)&&(newID!==false)) 
				trg=this._findCacheById(newID,true,true);
			if ((newID)&&(!this._sADnD)) 
				this.selectItem(newID,0,1)
		}
	};
	if (aNode)
		aNode._dragged=new Array()
};
treeViewObject.prototype._dragIn=function(htmlObject,shtmlObject,x,y)
{
	if (!this.dADTempOff)
		return 0;
	var fobj=shtmlObject.superObj;
	var tobj=htmlObject.superObj;
	if ((!tobj)&&(this._ddronr)) 
		return;
	if (!this.callEvent("onDragIn",[fobj.id,tobj?tobj.id:null,fobj.treeNod,this]))
		return 0;
	if (!tobj)
		this.allTree.className+=" selectionBox";
	else
	{
		if (fobj.childNodes==null)
		{
			this._setMove(htmlObject,x,y);
			return htmlObject
		};
		var stree=fobj.treeNod;
		for (var i=0;i<stree._dragged.length;i++)
			if (this._checkPNodes(tobj,stree._dragged[i]))
			{
				this._scrollable(htmlObject);
				return 0
			};
		this._setMove(htmlObject,x,y);
		if (this._getOpenState(tobj)<=0)
		{
			this._autoOpenId=tobj.id;
			this._autoOpenTimer=window.setTimeout(new callerFunction(this._autoOpenItem,this),1000)
		}
	};
	return htmlObject
};
treeViewObject.prototype._autoOpenItem=function(e,treeObject)
{
	treeObject.openItem(treeObject._autoOpenId)
};
treeViewObject.prototype._dragOut=function(htmlObject)
{
	this._clearMove();
	if (this._autoOpenTimer)
		clearTimeout(this._autoOpenTimer)
};
treeViewObject.prototype.moveItem=function(itemId,mode,targetId,targetTree)
{
	var sNode=this._findCacheById(itemId);

	
	if (!sNode)
		return (0);
	switch(mode)
	{
		case "right": alert('Not supported yet');
			break;
		case "item_child":
			var tNode=(targetTree||this)._findCacheById(targetId);
			if (!tNode)
				return (0);
			(targetTree||this)._moveNodeTo(sNode,tNode,0);
			break;
		case "item_sibling":
			var tNode=(targetTree||this)._findCacheById(targetId);
			if (!tNode)
				return (0);
				(targetTree||this)._moveNodeTo(sNode,tNode.superObj,tNode);
			break;
		case "item_sibling_next":
			var tNode=(targetTree||this)._findCacheById(targetId);
			if (!tNode)return (0);
			if ((tNode.tr)&&(tNode.tr.nextSibling)&&(tNode.tr.nextSibling.nodem))
				(targetTree||this)._moveNodeTo(sNode,tNode.superObj,tNode.tr.nextSibling.nodem);
			else
				(targetTree||this)._moveNodeTo(sNode,tNode.superObj);
			break;
		case "left": 
			if (sNode.superObj.superObj)
				this._moveNodeTo(sNode,sNode.superObj.superObj,sNode.superObj);
			break;
		case "up": 
			var z=this._getPrevNode(sNode);
			if ((z==-1)||(!z.superObj)) 
				return;
			this._moveNodeTo(sNode,z.superObj,z);
			break;
		case "up_strict": 
				var z=this._getIndex(sNode);
				if (z!=0)
					this._moveNodeTo(sNode,sNode.superObj,sNode.superObj.childNodes[z-1]);
			break;
		case "down_strict": 
			var z=this._getIndex(sNode);
			var count=sNode.superObj.childsCount-2;
			if (z==count)
				this._moveNodeTo(sNode,sNode.superObj);
			else if (z<count)
				this._moveNodeTo(sNode,sNode.superObj,sNode.superObj.childNodes[z+2]);
			break;
		case "down": 
			var z=this._getNextNode(this._lastChild(sNode));
			if ((z==-1)||(!z.superObj)) 
				return;
			if (z.superObj==sNode.superObj)
				var z=this._getNextNode(z);
			if (z==-1)
			{
				this._moveNodeTo(sNode,sNode.superObj)
			}
			else
			{
				if ((z==-1)||(!z.superObj)) 
					return;
				this._moveNodeTo(sNode,z.superObj,z)
			};
			break
	}
			
	
};
treeViewObject.prototype._loadDynXML=function(id,src)
{
	src=src||this.XMLsource;
	var sn=(new Date()).valueOf();
	this._ld_id=id;
	this.loadXML(src+getUrlSymbol(src)+"uid="+sn+"&id="+this._escape(id))
};
treeViewObject.prototype._checkPNodes=function(item1,item2)
{
	if (item2==item1)
		return 1
	if (item1.superObj)
		return this._checkPNodes(item1.superObj,item2);
	else 
		return 0
};
treeViewObject.prototype.preventIECaching=function(mode)
{
	this.no_cashe = convertStringToBoolean(mode);
	this.XMLLoader.rSeed=this.no_cashe
};
treeViewObject.prototype.preventIECashing=treeViewObject.prototype.preventIECaching;
treeViewObject.prototype.disableCheckbox=function(itemId,mode)
{
	if (typeof(itemId)!="object")
		var sNode=this._findCacheById(itemId,0,1);
	else
		var sNode=itemId;
	if (!sNode)
		return;
	sNode.dscheck=convertStringToBoolean(mode)?(((sNode.checkstate||0)%3)+3):((sNode.checkstate>2)?(sNode.checkstate-3):sNode.checkstate);
	this._setCheck(sNode);
	if (sNode.dscheck<3)
		sNode.dscheck=false
};
treeViewObject.prototype.setEscapingMode=function(mode)
{
	this.utfesc=mode
};
treeViewObject.prototype.enableHighlighting=function(mode)
{
	this.ehlt=true;
	this.ehlta=convertStringToBoolean(mode)
};
treeViewObject.prototype._itemMouseOut=function()
{
	var that=this.childNodes[3].superObj;
	var tree=that.treeNod;
	tree.callEvent("onMouseOut",[that.id]);
	if (that.id==tree._l_onMSI)tree._l_onMSI=null;
	if (!tree.ehlta)return;
	that.span.className=that.span.className.replace("_lor","")
};
treeViewObject.prototype._itemMouseIn=function()
{
	var that=this.childNodes[3].superObj;
	var tree=that.treeNod;
	if (tree._l_onMSI!=that.id)
		tree.callEvent("onMouseIn",[that.id]);
	tree._l_onMSI=that.id;
	if (!tree.ehlta)
		return;
	that.span.className=that.span.className.replace("_lor","");
	that.span.className=that.span.className.replace(/((standart|selected)TreeRow)/,"$1_lor")
};
treeViewObject.prototype.enableActiveImages=function(mode)
{
	this._aimgs=convertStringToBoolean(mode)
};
treeViewObject.prototype.focusItem=function(itemId)
{
	var sNode=this._findCacheById(itemId);
	if (!sNode)return (0);
	this._focusNode(sNode)
};
treeViewObject.prototype.getAllSubItems =function(itemId)
{
	return this._getAllSubItems(itemId)
};
treeViewObject.prototype.getAllChildless =function()
{
	return this._getAllScraggyItems(this.pageLabel)
};
treeViewObject.prototype.getAllLeafs=treeViewObject.prototype.getAllChildless;
treeViewObject.prototype._getAllScraggyItems =function(node)
{
	var z="";
	for (var i=0;i<node.childsCount;i++)
	{
		if ((node.childNodes[i].unParsed)||(node.childNodes[i].childsCount>0))
		{
			if (node.childNodes[i].unParsed)
				var zb=this._getAllScraggyItemsXML(node.childNodes[i].unParsed,1);
			else
				var zb=this._getAllScraggyItems(node.childNodes[i])
			if (zb)
				if (z)
					z+=this.tvseparator+zb;
				else 
					z=zb
		}
		else
			if (!z)
				z=node.childNodes[i].id;
			else 
				z+=this.tvseparator+node.childNodes[i].id
	};
	return z
};
treeViewObject.prototype._getAllFatItems =function(node)
{
	var z="";
	for (var i=0;i<node.childsCount;i++)
	{
		if ((node.childNodes[i].unParsed)||(node.childNodes[i].childsCount>0))
		{
			if (!z)
				z=node.childNodes[i].id;
			else 
				z+=this.tvseparator+node.childNodes[i].id;
			if (node.childNodes[i].unParsed)
				var zb=this._getAllFatItemsXML(node.childNodes[i].unParsed,1);
			else
				var zb=this._getAllFatItems(node.childNodes[i])
			if (zb)
				z+=this.tvseparator+zb
		}
	};
	return z
};
treeViewObject.prototype.getAllItemsWithKids =function()
{
	return this._getAllFatItems(this.pageLabel)
};
treeViewObject.prototype.getAllFatItems=treeViewObject.prototype.getAllItemsWithKids;
treeViewObject.prototype.getAllChecked=function()
{
	return this._getAllChecked("","",1)
};
treeViewObject.prototype.getAllUnchecked=function(itemId)
{
	if (itemId)itemId=this._findCacheById(itemId);
	return this._getAllChecked(itemId,"",0)
};
treeViewObject.prototype.getAllPartiallyChecked=function()
{
return this._getAllChecked("","",2)
};
treeViewObject.prototype.getAllCheckedBranches=function()
{
	var temp= this._getAllChecked("","",1);
	if (temp!="")temp+=this.tvseparator;
	return temp+this._getAllChecked("","",2)
};
treeViewObject.prototype._getAllChecked=function(pageLabel,list,mode)
{
	if (!pageLabel)pageLabel=this.pageLabel;
	if (pageLabel.checkstate==mode)if (!pageLabel.nocheckbox)
	{
	if (list)list+=this.tvseparator+pageLabel.id;
	else list=pageLabel.id
	};
	var j=pageLabel.childsCount;
	for (var i=0;i<j;i++)
	{
	list=this._getAllChecked(pageLabel.childNodes[i],list,mode)
	};
	if (list)return list;
	else return ""
};
treeViewObject.prototype.setItemStyle=function(itemId,style_string)
{
	var temp=this._findCacheById(itemId);
	if (!temp)return 0;
	if (!temp.span.style.cssText)temp.span.setAttribute("style",temp.span.getAttribute("style")+";"+style_string);
	else
	temp.span.style.cssText+=(";"+style_string)
};
treeViewObject.prototype.enableImageDrag=function(mode)
{
	this.imagedrag=convertStringToBoolean(mode)
};
treeViewObject.prototype.setOnDragIn=function(func)
{
	this.attachEvent("onDragIn",func)
};
treeViewObject.prototype.enableDragAndDropScrolling=function(mode)
{
	this.scrollable=convertStringToBoolean(mode)
};
treeViewObject.prototype.treeviewEvent=function()
{
	this.dhx_SeverCatcherPath="";
	this.attachEvent = function(original, catcher, CallObj)
	{
		if (this._onEventSet && this._onEventSet[original])this._onEventSet[original].apply(this,[]);
		CallObj = CallObj||this;
		original = 'ev_'+original;
		if ( ( !this[original] )|| ( !this[original].addEvent ) )
		{
			var z = new this.eventCatcher(CallObj);
			z.addEvent( this[original] );
			this[original] = z
		};
		return ( original + ':' + this[original].addEvent(catcher) )
	};
	this.callEvent=function(name,a)
	{
		if (this["ev_"+name])return this["ev_"+name].apply(this,a);
		return true
	};
	this.checkEvent=function(name)
	{
		if (this["ev_"+name])return true;
		return false
	};
	this.eventCatcher = function(obj)
	{
		var treeviewCatch = new Array();
		var m_obj = obj;
	var func_server = function(catcher,rpc)
	{
		catcher = catcher.split(":");
		var postVar="";
		var postVar2="";
		var target=catcher[1];
		if (catcher[1]=="rpc")
		{
			postVar='<?xml version="1.0"?><methodCall><methodName>'+catcher[2]+'</methodName><params>';
			postVar2="</params></methodCall>";
			target=rpc
		};
			var z = function()
			{
				var loader = new treeViewDataLoader( null, window, false );
				var postData=postVar;
				if (postVar2)
				{
					for (var i=0;i<arguments.length;i++)
					{
						var tmpData = "";
						if(arguments[i])
						{
							tmpData = arguments[i].toString();
						}
						else
						{
							tmpData = "";
						}
						postData += "<param><value><string>" +tmpData+ "</string></value></param>";
					}
					postData+=postVar2
				}
				else
					for (var i=0;i<arguments.length;i++)
						postData += ( '&arg'+i+'='+escape(arguments[i]));

				var postType = false;
				if(postVar2)
					postType = true;
				else
					postType = false;

				loader.loadXML( target, true, postData,postType);

				try
				{
					if (postVar2)
					{
						var dt=loader.doXPath("//methodResponse/params/param/value/string");
						return convertStringToBoolean(dt[0].firstChild.data)
					}
					else 
						return convertStringToBoolean(loader.xmlDoc.responseText)
				}
				catch(e)
				{
					treeviewError.throwError("rpcError",loader.xmlDoc.responseText);
					return false
				}
			};
			return z
		};
		var z = function()
		{
			if (treeviewCatch)
				var res=true;
			for (var i=0;i<treeviewCatch.length;i++)
			{
				if (treeviewCatch[i] != null)
				{
					var zr = treeviewCatch[i].apply( m_obj, arguments );
					res = res && zr
				}
			};
			return res
		};
		z.addEvent = function(ev)
		{
			if ( typeof(ev)!= "function" )
			if (ev && ev.indexOf && ev.indexOf("server:")=== 0)
			ev = new func_server(ev,m_obj.rpcServer);
			else
			ev = eval(ev);
			if (ev)return treeviewCatch.push( ev ) - 1;
			return false
		};
		z.removeEvent = function(id)
		{
			treeviewCatch[id] = null
		};
		return z
	};
	this.detachEvent = function(id)
	{
		if (id != false)
		{
			var list = id.split(':');
			this[ list[0] ].removeEvent( list[1] )
		}
	}
};
