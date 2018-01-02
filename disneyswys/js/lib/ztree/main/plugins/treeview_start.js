var t;
function loadDataFromHTML(obj)
{
    if (typeof(obj)!="object")
    obj=document.getElementById(obj);
    var n=obj;
    var id=n.id;
    var cont="";
    for (var j=0;j<obj.childNodes.length;j++)if (obj.childNodes[j].nodeType=="1")
    {
        if (obj.childNodes[j].tagName=="XMP")
        {
            var cHead=obj.childNodes[j];
            for (var m=0;m<cHead.childNodes.length;m++)cont+=cHead.childNodes[m].data
        }
        else if (obj.childNodes[j].tagName.toLowerCase()=="ul")
        cont=li2trees(obj.childNodes[j],new Array(),0);
        break
    };
    obj.innerHTML="";
    t=new treeViewObject(obj,"100%","100%",0);
	t.enableCheckBoxes(1); //enable checkbox
	t.enableThreeStateCheckboxes(true);  //checkbox cascade

	

    var z_all=new Array();
    for ( b in t )z_all[b.toLowerCase()]=b;
	var atr=obj.attributes;
	for (var a=0;a<atr.length;a++)
		if ((atr[a].name.indexOf("set")==0)||(atr[a].name.indexOf("enable")==0))
		{
			var an=atr[a].name;
			if (!t[an])an=z_all[atr[a].name];
			t[an].apply(t,atr[a].value.split(","))
		};
		if (typeof(cont)=="object")
		{
			t.XMLloadingWarning=1;
			for (var i=0;i<cont.length;i++)
			{
				var n=t.insertNewItem(cont[i][0],cont[i][3],cont[i][1]);
				if (cont[i][2])t._setCheck(n,cont[i][2])
			};
			t.XMLloadingWarning=0;
			t.lastLoadedXMLId=0;
			t._redrawFrom(t)
		}
		else
			t.loadXMLString("<tree id='0'>"+cont+"</tree>");

	t.enableCheckBoxes(1); //enable checkbox
	t.enableThreeStateCheckboxes(true);  //checkbox cascade

	t.setOnCheckHandler(toncheck);

    window[id]=t;
    return t
};
function toncheck(id,state){
	    //alert("id:"+id + "...." + "state:"+state);
		
		var layer = getParentLayerById(id);
		if(layer!=null)
		{
			setLayersVisible(layer,state);
		}
		else
		{
			var subLayer = getSubLayerById(id);
			setLayerVisible(subLayer,state);
		}		
};
/*========================================*/
function getParentLayerById(id)
{
	if(id==1)
	{
		return  control.POILayers;
	}
	if(id==2)
	{
		return control.ModelLayers;
	}
	if(id==3)
	{
		return control.VectorLayers;
	}
    if(id == 4)
	{
		return control.RasterLayers;
	}
	if(id == 5)
	{
		return control.AnnotationLayers;
	}
	if(id == 6)
	{
		return control.BillboardLayers;
	}

	return null;
}
function getSubLayerById(id)
{
	var pid = id.substring(0,1);
	var sid = id.substring(2);

	var parentLayer = getParentLayerById(pid);
	if(parentLayer!=null)
	{
		var temp = parentLayer.Item(sid-1); //由于节点ID从1开始,而item(0)开始,所以-1
		return temp;
	}
	return null;
}

function setLayerVisible(item,isSelect)
{
	item.Visible = isSelect;
}


function setLayersVisible(layer,isSelect)
{
	var len = layer.Count;
	for(i=0;i< len;i++)
	{
		var temp = layer.Item(i);
		if(temp!=null)
		{
			temp.Visible = isSelect;
		}
	}
}
/*========================================*/



function treeview_init()
{
    var z=document.getElementsByTagName("div");
    for (var i=0;i<z.length;i++)
		if (z[i].className=="treeviewLayer")
			loadDataFromHTML(z[i])

		
};
function li2trees(tag,data,ind)
{
    for (var i=0;i<tag.childNodes.length;i++)
    {
        var z=tag.childNodes[i];
        if ((z.nodeType==1)&&(z.tagName.toLowerCase()=="li"))
        {
            var c="";
            var ul=null;
            var check=z.getAttribute("checked");
            for (var j=0;j<z.childNodes.length;j++)
            {
                var zc=z.childNodes[j];
                if (zc.nodeType==3)c+=zc.data;
                else if (zc.tagName.toLowerCase()!="ul") c+=dhx_outer_html(zc);
                else ul=zc
            };
            data[data.length]=[ind,c,check,(z.id||(data.length+1))];
            if (ul)data=li2trees(ul,data,(z.id||data.length))
        }
    };
    return data
};
function dhx_outer_html(node)
{
    if (node.outerHTML)return node.outerHTML;
    var temp=document.createElement("DIV");
    temp.appendChild(node.cloneNode(true));
    temp=temp.innerHTML;
    return temp
};
if (window.addEventListener)window.addEventListener("load",treeview_init,false);
else if (window.attachEvent)window.attachEvent("onload",treeview_init);
