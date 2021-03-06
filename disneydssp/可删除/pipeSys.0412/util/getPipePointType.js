var  CGetPipePointType={};
(function(){
	var GetPipeAttachmentType=function(rslt){
        var  sType = "";
        sType=rslt.US_ATTACHM;
        var dValue = 0;
        if (isNaN(parseFloat(sType))){
            return "";
        }
        var iType = parseInt(sType);
        if (iType >= 1000 && iType <10000){
            sType =StatisticsMgr.getValueByCode("AttachmentCode",iType);
            return sType;
        }
        return "";
    };
	var GetPipePointType=function(rslt,layerId){
		  StatisticsMgr.initPipeConfigDoc(layerId, true, false); //初始化编码映射文件对象, 不初始化空间坐标转换对象
		  var sType=null;
		  sType=rslt.US_PT_TYPE;
          var dValue = 0;
          if (isNaN(parseFloat(sType))){
              return "";
          }
          var iType = parseInt(dValue);
          if (iType < 100){
              sType = GetPipeAttachmentType(rslt);
              if (sType == ""){
            	  sType=rslt.US_WELL;
            	  var dWell = 0;
                  if (isNaN(parseFloat(sType))){
                      return "普通点";
                  }
                  var wellCode = parseInt(dWell);
                  if (0 == wellCode){
                      return "普通点";
                  }
                  sType = FieldValueStringMap.GetWellTypeString(wellCode);
              }
          }else{
        	  sType = FieldValueStringMap.GetPointTypeString(iType);
          }
          return sType;
	};
	CGetPipePointType.GetPipePointType=GetPipePointType;
})();