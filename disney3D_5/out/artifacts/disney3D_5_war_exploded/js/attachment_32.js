/**
 * Created with IntelliJ IDEA.
 * User: chenwei
 * Date: 14-2-14
 * Time: 下午14:13
 */
if (!CITYPLAN) {
    var CITYPLAN = {};
}

CITYPLAN.Attachment = function (earth) {
    var  attachment = {};
    var buildIDs = [];
    var nodes = {id:1, pId:0, name:"附件",open:true,isParent:true};
    //nodes.children =  planNodes;
    
    //附件查看按钮点击事件
    var attachmentLook = function(){
        var eventObj = top.$("#attachmentTag");
//        if(eventObj.hasClass("selected") === false){
//            eventObj.addClass("selected");
//        }else{
//            eventObj.removeClass("selected");
//        }
        window.showLargeDialog("html/view/attachment.html", "附件查看");
    };

    //生成树设置
    var initPlanTree  = function (treeData,treeObj){
        var setting={
            check:{
                enable:false//是否显示checkbox或radio
            }, 
            data: {
                simpleData: {
                    enable: true
                }
            },
            view:{
                dblClickExpand:false, //双击节点时，是否自动展开父节点的标识
                expandSpeed:"", //节点展开、折叠时的动画速度, 可设置("","slow", "normal", or "fast")
                selectedMulti:false //设置是否允许同时选中多个节点
            },
            callback:{
                onCheck:"",
                onClick:clickNode
            }
        };
        var planTree = $.fn.zTree.init(treeObj, setting, treeData);
        planTree.expandAll(true);
    };

    function clickNode(event, treeId, treeNode) {
        var url;
        var type = treeNode.attachmentType;
      var  eventObj=$("#attachmentTag") ;
        if(type){
            type = type.toLowerCase();
        }
        if(treeNode && !treeNode.isParent && treeNode.level === 2){
            //新增type后缀。。。2014.4.16
//            if(eventObj.hasClass("selected") === false){
//                //切换为选中状态
//                eventObj.addClass("selected");
//            }
//            else
//            {   eventObj.removeClass("selected");
//            }
            url = CITYPLAN_config.service.getAttachmentObj + treeNode.id + "&blobtype=" + type;
            //window.open(url, 'newwindow', 'toolbar=no, menubar=no, scrollbars=no, status=no')

            var ifEarthDoc = parent.window.ifEarth.document;
            top.$("#earthDiv0",ifEarthDoc).css("width","50%");
            var earthWidth = ifEarthDoc.body.clientWidth/2;
            var earthHeight = ifEarthDoc.body.clientHeight + 1;
            top.$("#dlgScreen2D").dialog({
                    shadow:false,
                    draggable:false,
                    title:"附件浏览",
                    onClose:closeDialog
                }).panel({width:earthWidth, height:earthHeight})
                    .panel("move", {top:102+"px", left:250 + earthWidth + "px"});
            url += ("&width=" + earthWidth + "&height=" + earthHeight);
            top.$("#ifScreen2D").attr("src", "html/investigate/planCheckImage.html?url=" + url);
        }

            else{

//            var ifEarthDoc = parent.window.ifEarth.document;
//            top.$("#earthDiv0",ifEarthDoc).css("width","50%");
//            var earthWidth = ifEarthDoc.body.clientWidth/2;
//            var earthHeight = ifEarthDoc.body.clientHeight + 1;
//
//            url += ("&width=" + width + "&height=" + height);
//            top.$("#ifScreen2D").attr("src", "html/investigate/planCheckImage.html?url=" + url);




//                //关闭"总评审核"的选中状态
//                var ifEarthDoc = window.ifEarth.document;
//                $("#earthDiv0",ifEarthDoc).css("width","100%");
//                $("#dlgScreen2D").dialog({}).dialog("close");
         }
    };
    var closeDialog = function(){

        var ifEarthDoc = window.ifEarth.document;
        $("#earthDiv0",ifEarthDoc).css("width","100%");
        $("#ifScreen2D").attr("src", "");
    };
    //通过planid查找附件
    var planNodes =[];
    var searchAttachment = function(planId,i,len,node,nodes,treeObj){
        var xml;
        //方案附件与项目附件
        xml ='<QUERY>' +
        '<CONDITION><AND>' +
        '<PLANID  tablename="CPATTACHMENT">=\''+planId+'\'</PLANID>' +
        '</AND></CONDITION>' +
        '<RESULT><CPATTACHMENT><FIELD>ID</FIELD><FIELD>PLANID</FIELD> '+
        '<FIELD>NAME</FIELD><FIELD>TYPE</FIELD></CPATTACHMENT></RESULT>' +
        '</QUERY>';
        
        $.post(CITYPLAN_config.service.query, xml, function(data){
            //alert(data);
            var record = $.xml2json(data).record;
            var isTotal = false;
            if(record){
                
                var attachNodes=[];
                if(record.length){
                    for(var p=0;p<record.length;p++){
                        var recordItem = record[p];
                        if(recordItem["CPATTACHMENT.NAME"] === planId && recordItem["CPATTACHMENT.PLANID"] === planId){
                            //isTotal = true;
                            
                        }else{
                           attachNodes.push({id:recordItem["CPATTACHMENT.ID"],name:recordItem["CPATTACHMENT.NAME"],pId:node.id, attachmentType:recordItem["CPATTACHMENT.TYPE"]});
                       }
                    }
                }else{
                    if(record["CPATTACHMENT.NAME"] === planId && record["CPATTACHMENT.PLANID"] === planId){
                        //isTotal = true;
                        
                    }else{
                        attachNodes.push({id:record["CPATTACHMENT.ID"],name:record["CPATTACHMENT.NAME"],pId:node.id,attachmentType:record["CPATTACHMENT.TYPE"]});
                    }
                }
                node.children = attachNodes;
            }else{
                //如果没有数据 则删除该节点
                var nodeAry = nodes.children;
                //从nodes中移除node
                for(var h = 0; h < nodeAry.length; h++){
                    if(nodeAry[h].id === node.id){
                        nodeAry.splice(h, 1);
                    }
                }
            }
            // if(isTotal){//过滤掉"总平图" 不作为方案附件
            //     var nodeAry = nodes.children;
            //     for(var h = 0; h < nodeAry.length; h++){
            //         if(nodeAry[h].id === node.id){
            //             nodeAry.splice(h, 1);
            //         }
            //     }
            // }
            if(i === len-1){
                initPlanTree(nodes,treeObj) ;
            }
        }, "text");
    };

    var planLoop = 0;
    var searchAttachment2 = function(planIds,len,nodes,treeObj){


        var planId;
        if(planIds && planIds.length && planLoop < len){
            planId = planIds[planLoop];
            //方案附件与项目附件
            var xml ='<QUERY>' +
            '<CONDITION><AND>' +
            '<PLANID  tablename="CPATTACHMENT">=\''+planId.id+'\'</PLANID>' +
            '</AND></CONDITION>' +
            '<RESULT><CPATTACHMENT><FIELD>ID</FIELD><FIELD>PLANID</FIELD> '+
            '<FIELD>NAME</FIELD><FIELD>TYPE</FIELD></CPATTACHMENT></RESULT>' +
            '</QUERY>';
            
            $.post(CITYPLAN_config.service.query, xml, function(data){
                //alert(data);
                var record = $.xml2json(data).record;
                var isTotal = false;
                if(record){
                    var attachNodes=[];
                    if(record.length){
                        for(var p=0;p<record.length;p++){
                            var recordItem = record[p];
                            if(recordItem["CPATTACHMENT.NAME"] === planId.id && recordItem["CPATTACHMENT.PLANID"] === planId.id){
                                //isTotal = true;
                                
                            }else{
                               attachNodes.push({id:recordItem["CPATTACHMENT.ID"],name:recordItem["CPATTACHMENT.NAME"],pId:planId.id, attachmentType:recordItem["CPATTACHMENT.TYPE"]});
                           }
                        }
                    }else{
                        if(record["CPATTACHMENT.NAME"] === planId.id && record["CPATTACHMENT.PLANID"] === planId.id){
                            //isTotal = true;
                            
                        }else{
                            attachNodes.push({id:record["CPATTACHMENT.ID"],name:record["CPATTACHMENT.NAME"],pId:planId.id,attachmentType:record["CPATTACHMENT.TYPE"]});
                        }
                    }
                    planId.children = attachNodes;
                }else{
                    //如果没有数据 则删除该节点
                    var nodeAry = nodes.children;
                    //从nodes中移除node
                    for(var h = 0; h < nodeAry.length; h++){
                        if(nodeAry[h].id === planId.id){
                            nodeAry.splice(h, 1);
                            len = len - 1;
                            planLoop = planLoop - 1;
                        }
                    }
                }
                planLoop++;
                if(planLoop == len){
                    planLoop = 0;
                    initPlanTree(nodes,treeObj);
                    return;
                }
                searchAttachment2(planIds, len, nodes,treeObj);
            }, "text");
        }        
    };

    var searchPlanBuilds = function(node, nodes, buildGuid ,treeObj){

        if(buildGuid && buildGuid.length > 0){//建筑附件查询
            var attachNodes=[];
            var xml = '<QUERY><CONDITION>';
            for(var i = 0; i < buildGuid.length; i++){
                xml += '<OR>' +
                    '<PLANID  tablename="CPATTACHMENT">=\''+buildGuid[i]+'\'</PLANID>' +
                    '</OR>';
            }
            xml += '</CONDITION>' +
                    '<RESULT><CPATTACHMENT><FIELD>ID</FIELD><FIELD>PLANID</FIELD> '+
                    '<FIELD>NAME</FIELD><FIELD>TYPE</FIELD></CPATTACHMENT></RESULT>' +
                    '</QUERY>';
            $.post(CITYPLAN_config.service.query, xml, function(data){
                    var record = $.xml2json(data).record;
                    if(record){
                        if(record.length){
                            for(var p=0;p<record.length;p++){
                                var recordItem = record[p];
                                if(recordItem["CPATTACHMENT.NAME"] === buildGuid[p] && recordItem["CPATTACHMENT.PLANID"] === buildGuid[p]){
                                }else{
                                   attachNodes.push({id:recordItem["CPATTACHMENT.ID"],name:recordItem["CPATTACHMENT.NAME"],pId:"jianzhu"});
                                }
                            }
                        }else{
                            if(record["CPATTACHMENT.NAME"] === buildGuid[p] && record["CPATTACHMENT.PLANID"] === buildGuid[p]){
                            }else{
                                attachNodes.push({id:record["CPATTACHMENT.ID"],name:record["CPATTACHMENT.NAME"],pId:"jianzhu"});
                            }
                        }
                    }
                }, "text");
        }
        node.children = attachNodes;
        initPlanTree(nodes, treeObj);
    };

    /**
     * 获取建筑附件
     * @return {[type]} [description]
     */
    var searchBuilds = function(node, nodes, treeObj){
        if(this.buildIDs && this.buildIDs.length > 0){//建筑附件查询
            var attachNodes=[];
            var isChild = false;
            for(var i = 0; i < this.buildIDs.length; i++){
                var xml ='<QUERY>' +
                    '<CONDITION><AND>' +
                    '<PLANID  tablename="CPATTACHMENT">=\''+this.buildIDs[i]+'\'</PLANID>' +
                    '</AND></CONDITION>' +
                    '<RESULT><CPATTACHMENT><FIELD>ID</FIELD><FIELD>PLANID</FIELD> '+
                    '<FIELD>NAME</FIELD><FIELD>TYPE</FIELD></CPATTACHMENT></RESULT>' +
                    '</QUERY>';
                $.post(CITYPLAN_config.service.query, xml, function(data){
                    var record = $.xml2json(data).record;
                    //把id与树节点绑定起来
                    if(record){
                        isChild = true;
                        //遍历每一个附件
                        for(var p=0;p<record.length;p++){
                           attachNodes.push({id:record[p]["CPATTACHMENT.ID"],name:record[p]["CPATTACHMENT.NAME"],pId:"jianzhu"});
                        }
                    }
                },"text");
            }
            if(!isChild){
                isChild = false;
                var nodeAry = nodes.children;
                for(var g = 0; g < nodeAry.length; g++){
                    if(nodeAry[g].id === "jianzhu"){
                        nodeAry.splice(g, 1);
                    }
                }
            }else{
                node.children = attachNodes;
            }
            initPlanTree(nodes,treeObj);
        }else{
            //移除建筑附件节点
            var nodeAry = nodes.children;
            //从nodes中移除node
            for(var h = 0; h < nodeAry.length; h++){
                if(nodeAry[h].id === "jianzhu"){
                    nodeAry.splice(h, 1);
                }
            }
        }
    };

    /** cy 已看
     * 总评审核 TODO:
     * 必须选中一个方案 才可用
     * @return {[type]} [description]
     */
    var planCheck = function(){
        //从当前选中的树
        var currentNode = parent.currentSelectedNode;
        var planId = currentNode.id;
        var eventObj = top.$("#planCheckTag");
//        if(eventObj.hasClass("selected") === false){
            //切换为选中状态
//            eventObj.addClass("selected");
            var ifEarthDoc = window.ifEarth.document;
            $("#earthDiv0",ifEarthDoc).css("width","50%");
            var earthWidth = ifEarthDoc.body.clientWidth/2;
            var earthHeight = ifEarthDoc.body.clientHeight + 1;
            //请求post
            var projectQueryXml =
            '<QUERY><CONDITION><AND>' +
                '<NAME tablename = "CPATTACHMENT">=\'' + planId + '\'</NAME>' +
                '</AND></CONDITION><RESULT><CPATTACHMENT><FIELD>ID</FIELD><FIELD>PLANID</FIELD><FIELD>NAME</FIELD><FIELD>TYPE</FIELD></CPATTACHMENT></RESULT></QUERY>';
            var res = _queryData(CITYPLAN_config.service.query, projectQueryXml);
            if(res && res[0]){
                var picID = res[0]["CPATTACHMENT.ID"];
                var type = res[0]["CPATTACHMENT.TYPE"].toLowerCase();
                if(picID){
                    //然后根据返回id再拼接一个url进行页面展示
                    var url = CITYPLAN_config.service.getAttachmentObj + picID + "&blobtype=" + type;
                    show2DEarth(url,earthWidth,earthHeight,250,102);
                }
            }else{
//                close2DEarth();
                closeDialog();
                alert("该方案无总平图!");
//                if(eventObj.hasClass("selected") === true){
//                    eventObj.removeClass("selected");
//                }
                return;
//            }
        }
//        else{
////            eventObj.removeClass("selected");
//            //关闭"总评审核"的选中状态
//            var ifEarthDoc = window.ifEarth.document;
//            $("#earthDiv0",ifEarthDoc).css("width","100%");
////            $("#dlgScreen2D").dialog({}).dialog("close");
//            closeDialog();
//        }
    };


    //cy 已看
    var show2DEarth = function(src, width, height, left, top){


//        if(parent.$("#dlgScreen2D").panel("options").closed){

            parent.$("#dlgScreen2D").dialog({
                shadow:false,
                draggable:false,
                title:"总平图查看",
//                onClose:close2DEarth
                onClose: closeDialog
            }).panel({width:width, height:height})
                .panel("move", {top:top+"px", left:left + width + "px"});
            // document.getElementById("ifScreen2D").style.height = width + "px"  ;
            // document.getElementById("ifScreen2D").style.height = height + "px"  ;
            //$("#ifScreen2D").attr("src", src);
            //$("#ifScreen2D").attr("src", "http://192.168.10.63:8080/planCheckImage.html");
            src += ("&width=" + width + "&height=" + height);
            parent.$("#ifScreen2D").attr("src", "html/investigate/planCheckImage.html?url=" + src);
//        }else{
//            debugger;
////            parent.$("#dlgScreen2D").panel("resize", {width:width,height:height})
////                .panel("move", {top:top+"px", left:left + "px"});
//            src += ("&width=" + width + "&height=" + height);
//            parent.$("#ifScreen2D").attr("src", "html/investigate/planCheckImage.html?url=" + src);
//        }
    };

    var close2DEarth = function(){
        var eventObj = $("div.toolbar-item[tag='ViewScreen2DLink']");
        eventObj.removeClass("selected");
        var ifEarthDoc = window.ifEarth.document;
        $("#earthDiv0",ifEarthDoc).css("width","100%");
        $("#ifScreen2D").attr("src", "");
    };

    var closeDialog = function(){
        close2DEarth();
    };

    var closeAttachmentDialog = function(){
        var ifEarthDoc = window.ifEarth.document;
        $("#earthDiv0",ifEarthDoc).css("width","100%");
        $("#ifScreen2D").attr("src", "");
    };

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

    var setBuildNodes = function(nodes){
        this.buildIDs = nodes;
    };

    attachment.searchBuilds = searchBuilds;
    attachment.searchPlanBuilds = searchPlanBuilds;
    attachment.setBuildNodes = setBuildNodes;
    attachment.planCheck = planCheck;
    attachment.attachmentLook=attachmentLook;
    attachment.searchAttachment=searchAttachment;
    attachment.searchAttachment2 =searchAttachment2 ;
    attachment.closeDialog=closeDialog;
    attachment.closeAttachmentDialog = closeAttachmentDialog;
    return  attachment;

};