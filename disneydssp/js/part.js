/**
 * User: wyh
 * Date: 12-12-18
 * Time: 下午4:10
 * Desc:
 */

var   PoilayerDataArr2=parent.PoilayerDataArr;
if (!PART) {
    var PART = {};
}



PART.PartManager = function(xmlpath) {
    var partmanager = {};

    var parttypelist = [];  //网格部件类型数组
    var partLayerGuidArr=[]; // 网格部件的图层guid数组

    var typenodename="type" ;
    var subtypenodename="subtype";
    var name2="name";
    var code2="code";
    /**
     * 根据图层类型，获取图标路径
     * @param layerType 图层类型
     * @return 图标样式
     */
    var gettypelist = function(currentRrjlayerdata) {

        if(currentRrjlayerdata==undefined){return null;}
        var  xmlDoc= top.loadXMLFile (xmlpath);
        var xmlData =xmlDoc.xml;
        var   xmlJSON = $.xml2json(xmlData);

        for (var i=0;i<xmlJSON[typenodename].length;i++)
        {   var parttype = {};
            var name=xmlJSON[typenodename][i][name2];
            var code=   xmlJSON[typenodename][i][code2];
            parttype.name=name;
            parttype.code=code;

              var partsubtypelist=[];


            if(xmlJSON[typenodename][i][subtypenodename].length==undefined)   //只有一条记录
            {

                var partsubtype={};
                var subtypename=xmlJSON[typenodename][i][subtypenodename][name2];
                var   subtypecode=xmlJSON[typenodename][i][subtypenodename][code2] ;
                partsubtype.name=subtypename;
                partsubtype.code=subtypecode;
                partsubtype.guid=getpartlayerguid (name,subtypename,currentRrjlayerdata,"") ;
                partsubtype.ischecked  =false;
                partsubtypelist.push(partsubtype) ;

                if(partsubtype.guid!=""){partLayerGuidArr.push(partsubtype.guid);}     // 网格部件的图层guid数组

            }
              else{


                    for (var j=0;j<xmlJSON[typenodename][i][subtypenodename].length;j++)
                    {    var partsubtype={};
                        var subtypename=xmlJSON[typenodename][i][subtypenodename][j][name2];
                        var   subtypecode=xmlJSON[typenodename][i][subtypenodename][j][code2] ;
                        partsubtype.name=subtypename;
                        partsubtype.code=subtypecode;
                        partsubtype.guid=getpartlayerguid (name,subtypename,currentRrjlayerdata,"") ;
                        partsubtype.ischecked  =false;
                        partsubtypelist.push(partsubtype) ;

                        if(partsubtype.guid!=""){partLayerGuidArr.push(partsubtype.guid);}     // 网格部件的图层guid数组
                }
            }
            parttype.subtypelist=  partsubtypelist;

            parttypelist.push(parttype) ;

            }

         return    parttypelist;

         };
    var getpartlayerGuidArr=  function( ) {

         return partLayerGuidArr ;

    };


    var getpartlayerguid = function(typename,subtypename,currentRrjlayerdata,pName)
    {


        var partlayerguid = "";
        var childCount=currentRrjlayerdata.length;
//        var pId=currentRrjlayerdata.id;

        for (var i = 0; i < childCount; i++) {


           if( currentRrjlayerdata[i].children!=undefined)    {   //有子节点
               var pName= currentRrjlayerdata[i].name ;//父节点
               partlayerguid= getpartlayerguid(typename,subtypename,currentRrjlayerdata[i].children,pName) ;
           }
           else {
               var CName= currentRrjlayerdata[i].name;
               if(typename==pName&&subtypename==CName)   {

                   partlayerguid= currentRrjlayerdata[i].id;



               }
            }

        }
        return partlayerguid;



    } ;


    var SearchPartdatabyCode = function(PoilayerDataArr,partcode)

    {
        var result=null;

            for(var key in PoilayerDataArr)

            {
            var data= PoilayerDataArr[key];
            for(var pp=0;pp<data.length;pp++)
            {
                var record= data[pp];
                if(   record["标识码"]==partcode   )
                {
                    result=record;
                    break;
                }


            }

        }

     return result;

    } ;

    var SetLayercheckedByGUID = function(partTypeDatalist,guid,ischecked )
    {



        var childCount=partTypeDatalist.length;


        for (var i = 0; i < childCount; i++) {


            if( partTypeDatalist[i].subtypelist!=undefined)    {   //有子节点

                 SetLayercheckedByGUID( partTypeDatalist[i].subtypelist,guid,ischecked ) ;
            }
            else {
                var CGuid= partTypeDatalist[i].guid;
                if(CGuid==guid&&guid!="")   {

                    partTypeDatalist[i].ischecked=ischecked;



                }
            }

        }
        return     partTypeDatalist;



    } ;
    var SetLayerCount = function(partTypeDatalist )
    {

        var earth=parent.earth;
        var search=STAMP.Search(earth);

        var childCount=partTypeDatalist.length;

        for (var i = 0; i < childCount; i++) {


            if( partTypeDatalist[i].subtypelist!=undefined)    {   //有子节点

                SetLayerCount( partTypeDatalist[i].subtypelist ) ;
            }
            else {
                var CGuid= partTypeDatalist[i].guid;
                if(CGuid!="")   {

                     var  searchDataResult=  search.localSearch2(CGuid,"",null);
                    partTypeDatalist[i].count=searchDataResult.RecordCount;

                }
            }

        }

        return   partTypeDatalist;



    } ;

    partmanager.gettypelist = gettypelist; // 得到大类下的小类数组
    partmanager.getpartlayerGuidArr = getpartlayerGuidArr; // 得到大类下的小类数组
    partmanager.SearchPartdatabyCode = SearchPartdatabyCode; // 在已查询过的部件图层下 根据部件标识码 查部件所有数据

    partmanager.SetLayercheckedByGUID = SetLayercheckedByGUID;   //对全局变量      parent.partTypeDatalist 对应的guid 图层设置 图层是否选中
    partmanager.SetLayerCount = SetLayerCount;    //对全局变量      parent.partTypeDatalist 所有图层设置 部件个数

    return partmanager;
};