function XmlAccessObject()
{
   this.id = 2121;
   this.xmlDoc = null;
   this.asyncLoad = false;
   this.actionEvent();

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
   this.responseHandler = null;
   return this;
}
XmlAccessObject.prototype.setXmlData = function(xmlData)
{
	this.xmlDoc = xmlData;
}

XmlAccessObject.prototype.loadXml = function(fileName)
{
	if(window.ActiveXObject)
	{
		this.xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
		this.xmlDoc.async = false;
		this.xmlDoc.load(fileName);
	}
	else if (document.implementation&&document.implementation.createDocument)
	{
		this.xmlDoc = document.implementation.createDocument('', '', null);
		this.xmlDoc.load(fileName);
	}
}

XmlAccessObject.prototype.loadXMLString = function (xmlString) {
	var xmlDoc;
	if(window.ActiveXObject) {
		xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
		xmlDoc.async = false;
		xmlDoc.loadXML(xmlString);
	} else if (document.implementation&&document.implementation.createDocument) {
		xmlDoc = document.implementation.createDocument('', '', null);
		xmlDoc.loadXml(xmlString);
	} else {
		return null;
	}
	return xmlDoc;
}

XmlAccessObject.prototype.getTextValueById = function(id,tagName)
{
	var xmlitem = this.xmlDoc.getElementsByTagName("Xml");
	var rootitem = xmlitem[0].childNodes;	
	for(var j=0;j<rootitem.length;j++)
	{
		if(rootitem[j].getAttribute("id") == id)
		{
			var linkitem = rootitem[j].childNodes;
			for(var i=0;i<linkitem.length;i++)
			{				
				if(linkitem[i].nodeName==tagName)
				{
					return (linkitem[i].text);
				}
			}
		}	
	}
	return null;
}

XmlAccessObject.prototype.getSubTextValueById = function(id,tagLevel)
{
	var tagList = tagLevel.split("/");
	var xmlitem = this.xmlDoc.getElementsByTagName("XML");
	var rootitem = xmlitem[0].childNodes;	
	//alert( xmlitem[0].childNodes.length );

	for(var j=0;j<rootitem.length;j++)
	{
		if(rootitem[j].getAttribute("id") == id)
		{
			var linkitem = rootitem[j].childNodes;
			for(var i=0;i<linkitem.length;i++)
			{				
				if(linkitem[i].nodeName==tagList[2])
				{
					var subitems = linkitem[i].childNodes;
					for(var m=0;m<subitems.length;m++)
					{
						if(subitems[m].nodeName == tagList[3])
						{
							return subitems[m].text;
						}
					}
				}
			}
		}	
	}
	
	return "";
}

XmlAccessObject.prototype.replaceTextValueById = function(id,tagName,textData)
{
	var xmlitem = this.xmlDoc.getElementsByTagName("Xml");
	var rootitem = xmlitem[0].childNodes;	
	for(var j=0;j<rootitem.length;j++)
	{
		if(rootitem[j].getAttribute("id") == id)
		{			
			var linkitem = rootitem[j].childNodes;
			for(var i=0;i<linkitem.length;i++)
			{							
				if(linkitem[i].nodeName==tagName)
				{					
					linkitem[i].text = "_true";//textData + "";
				}
				if(tagName == "Visible")
				{
					if(textData == "true")
						rootitem[j].setAttribute("checked","1");
					else
						rootitem[j].setAttribute("checked","");
				}
			}			
		}	
	}
}

XmlAccessObject.prototype.setItemImages = function(id,imagesrc)
{
	var xmlitem = this.xmlDoc.getElementsByTagName("Xml");
	var rootitem = xmlitem[0].childNodes;	
	for(var j=0;j<rootitem.length;j++)
	{
		if(rootitem[j].getAttribute("id") == id)
		{
			var linkitem = rootitem[j].childNodes;
			for(var i=0;i<linkitem.length;i++)
			{				
				
			}
		}	
	}
	return null;
}

XmlAccessObject.prototype._filterText = function(textData)
{
	
}

XmlAccessObject.prototype.replaceTextValueByIdlist = function(ids,tagName,textData)
{
	if(ids == "")
		return;

	var idlist = ids.split(",");

	for(var i =0;i<idlist.length;i++)
	{
		this.replaceTextValueById(idlist[i],tagName,textData);
	}
}

XmlAccessObject.prototype.hasTagById = function(id,tagName)
{
	var xmlitem = this.xmlDoc.getElementsByTagName("Xml");
	var rootitem = xmlitem[0].childNodes;	
	for(var j=0;j<rootitem.length;j++)
	{
		if(rootitem[j].getAttribute("id") == id)
		{
			var linkitem = rootitem[j].childNodes;
			if(linkitem.length > 0)
				return true;
			else
				return false;
		}	
	}
	return false;
}

XmlAccessObject.prototype.sendData = function(url,responseHandlerFunc)
{
	if(!xmlReq) 
	{
		if(window.XMLHttpRequest) 
		{
			xmlReq = new XMLHttpRequest();
		}
		else if(window.ActiveXObject)
		{
			xmlReq=new ActiveXObject("Microsoft.XMLHttp");
		}
	}	
	//xmlReq.open("POST",url,true);
	xmlReq.open("GET",url,true); 
	if(responseHandlerFunc){
		xmlReq.onreadystatechange = responseHandlerFunc;
	}else if(this.responseHandler){
		xmlReq.onreadystatechange = this.responseHandler;
	}else{
		xmlReq.onreadystatechange = onResponseDefault;
	}
	xmlReq.send(null);

}
XmlAccessObject.prototype.sendDataWithRequest = function(url,req,responseHandlerFunc)
{

	if(!req) 
	{
		if(window.XMLHttpRequest) 
		{
			req = new XMLHttpRequest();
		}
		else if(window.ActiveXObject)
		{
			req=new ActiveXObject("Microsoft.XMLHttp");
		}
	}	
	//xmlReq.open("POST",url,true);
	req.open("GET",url,true); 
	if(responseHandlerFunc){
		req.onreadystatechange = responseHandlerFunc;
	}else if(this.responseHandler){
		req.onreadystatechange = this.responseHandler;
	}else{
		req.onreadystatechange = onResponseDefault;
	}
	req.send(null);

}

XmlAccessObject.prototype.getRequest = function()
{
	var req;
	if(window.XMLHttpRequest) 
	{
		req = new XMLHttpRequest();
	}
	else if(window.ActiveXObject)
	{
		req=new ActiveXObject("Microsoft.XMLHttp");
	}
	return req;
}

XmlAccessObject.prototype.onResponseDefault = function()
{
	if(xmlReq.readyState==4) 
	{
		if(xmlReq.status==200) 
		{
		   //alert(xmlReq.responseText);
			var responseDoc = xmlReq.responseXML.documentElement;
		} else 
		{
			alert("Server State:"+ xmlReq.statusText);		
		}
	}
}

XmlAccessObject.prototype.setResponseHandler = function(func)
{
	this.responseHandler = func;
}

XmlAccessObject.prototype.actionEvent=function()
{	
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
		alert(name);
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