
/**
 * Created by Administrator on 2017/9/3.
 */

//cy
function handlefield(fieldname,fileldvalue) {
    var fieldnamevalue={};
    fieldnamevalue.namealias=fieldname;
    if(fileldvalue==null) {
        fieldnamevalue.valuealias="";
    } else{
    fieldnamevalue.valuealias=fileldvalue;
    }

    switch(fieldname.toUpperCase())
    {
        case "MACHINECODE":
        case  "TRIGGERCODE":
            fieldnamevalue.namealias="触发器编号";
            break;
        case  "EXPNUM"  :
            fieldnamevalue.namealias="井盖编号";
            break;
        case  "EXPNUMALIAS"  :
            fieldnamevalue.namealias="井盖编号";
            //简略字段

            if(fileldvalue.length==18){
            fieldnamevalue.valuealias= fileldvalue.substring(0,2)  + fileldvalue.substring(fileldvalue.length-4,fileldvalue.length)

            // if(fileldvalue.length==5||fileldvalue.length==6){
            //     fieldnamevalue.valuealias="1简略_" +fileldvalue;
            }
            else {
                fieldnamevalue.valuealias=   fileldvalue;
            }
            break;
        case  "ADDRESS":
            fieldnamevalue.namealias="地址描述";
            break;
        case  "MANAGERNAME":
            fieldnamevalue.namealias="派单人员";
            break;
        case  "PICHPATHS":
            fieldnamevalue.namealias="照片(前)";
            break;
        case  "PICHPATHE":
            fieldnamevalue.namealias="照片(后)";
            break
        case      "RECEIVER":
            fieldnamevalue.namealias="巡查人员";
            break;

        case "REPORTSTATE":
            fieldnamevalue.namealias="上报状态";
            switch(fileldvalue)
            {
                case "00":
                    fieldnamevalue.valuealias="正常";
                    break;
                case "01":
                    fieldnamevalue.valuealias="井盖打开";
                    break;
                default:

            }
            break;
        case "STATUS":
            fieldnamevalue.namealias="登录状态";
            switch(fileldvalue)
            {
                case "1":
                    fieldnamevalue.valuealias="在线";
                    break;
                case "0":
                    fieldnamevalue.valuealias="离线";
                    break;
                default:

            }
            break;
        case "ROADINFO":
            fieldnamevalue.namealias="地址描述";

            break;
        case "ALARMSTATE":
            fieldnamevalue.namealias="最新状态";
            switch(fileldvalue)
            {
                case "00":
                    fieldnamevalue.valuealias="正常";
                    break;
                case "01":
                    fieldnamevalue.valuealias="井盖打开";
                    break;
                default:

            }
            break;
        case "HANDLESTATE":
            fieldnamevalue.namealias="处理状态";
            switch(fileldvalue)
            {
                case "0":
                    fieldnamevalue.valuealias="未处理";
                    break;
                case "1":
                    fieldnamevalue.valuealias="已派单";
                    break;
                default:

            }
            break;
        case "ALARMCAUSE":
            fieldnamevalue.namealias="报警原因";

            break;
        case "ALARMTIME":
            fieldnamevalue.namealias="上报时间";
            if(fileldvalue!=null) {
                fieldnamevalue.valuealias =   fileldvalue.replace("T"," ") ;
                }else  {
                fieldnamevalue.valuealias ="";
            }
            break;
        case "REPORTTIME":
            fieldnamevalue.namealias="最新上报时间";
            if(fileldvalue!=null) {
                  fieldnamevalue.valuealias =   fileldvalue.replace("T"," ") ;
            }else  {
                fieldnamevalue.valuealias ="";
            }
            break;
        case "INSTALDATE":
            fieldnamevalue.namealias="安装时间";
            if(fileldvalue!=null) {
                fieldnamevalue.valuealias =   fileldvalue.replace("T"," ") ;
            }else  {
                fieldnamevalue.valuealias ="";
            }
            break;
        case "BATTERYEPLACEDATE":

            fieldnamevalue.namealias="电池更换时间";
            if(fileldvalue!=null) {
                fieldnamevalue.valuealias =   fileldvalue.replace("T"," ") ;
                      }else  {
                fieldnamevalue.valuealias ="";
            }
            break;
        case "REPORTTIME":
            fieldnamevalue.namealias="上报时间";
            if(fileldvalue!=null) {
                fieldnamevalue.valuealias =   fileldvalue.replace("T"," ") ;
                // fieldnamevalue.valuealias = fileldvalue.year + "-" + fileldvalue.month + "-" + fileldvalue.day + " " + fileldvalue.hours + ":" + fileldvalue.minutes + ":" + fileldvalue.seconds;
            }else  {
                fieldnamevalue.valuealias ="";
            }
            break;
        case "RECEIVETIME":
            fieldnamevalue.namealias="派单时间";
            if(fileldvalue!=null) {
                fieldnamevalue.valuealias =   fileldvalue.replace("T"," ") ;
            }else  {
                fieldnamevalue.valuealias ="";
            }
            break;
        case "DISPOSETIME":
            fieldnamevalue.namealias="处理时间";
            if(fileldvalue!=null) {
                fieldnamevalue.valuealias =   fileldvalue.replace("T"," ") ;
            }else  {
                fieldnamevalue.valuealias ="";
            }
            break;
        case "SERVICELIFE":
            fieldnamevalue.namealias="寿命";
            if(fileldvalue!=null&&fileldvalue!="") {
                fieldnamevalue.valuealias=  fileldvalue+"年";
            }

            break;
        case "BATTERYLIFE":
            fieldnamevalue.namealias="电池寿命";
            if(fileldvalue!=null&&fileldvalue!="") {
                fieldnamevalue.valuealias=  fileldvalue+"年";
            }
            break;



        case  "INSTALDATE":
            fieldnamevalue.namealias="安装时间";
            break;
        case  "MANUFACTURE":
            fieldnamevalue.namealias="生产厂家";
            break;
        case  "INSTALLTIONUNIT":
            fieldnamevalue.namealias="安装单位";
            break;
        case  "MANAGEUNIT":
            fieldnamevalue.namealias="管理单位";
            break;
        case  "OWNERSHIPUNIT":
            fieldnamevalue.namealias="权属单位";
            break;
        case  "NOTE":
            fieldnamevalue.namealias="备注";
            break;

        case  "ALARMCOUNT":
            fieldnamevalue.namealias="";
            break;
        case "REPORTTIMEARRAY" :
            fieldnamevalue.namealias="报警时间序列";
            var timestr="";
            for　(var i=0;i<fileldvalue.length;i++){
                timestr=timestr+fileldvalue[i]+";";
            }
            fieldnamevalue.valuealias= timestr;

            break;

        default:

    }
    return fieldnamevalue  ;

}

function displayfield(type,field) {
    var isdisplay = false;
    var fieldarr =[];
    switch (type.toUpperCase())
    {
        case "COVERSITUATIONTABLE":
         fieldarr = ["MACHINECODE","EXPNUMALIAS","ROADINFO","ALARMSTATE" , "REPORTTIME" ,"MANAGEUNIT", "OWNERSHIPUNIT","INSTALDATE","BATTERYLIFE","BATTERYEPLACEDATE","NOTE"] ;
        break;

        case "BASICINFOTABLE":
            fieldarr = ["MACHINECODE","EXPNUMALIAS","ROADINFO","MANAGEUNIT", "OWNERSHIPUNIT","INSTALDATE","BATTERYLIFE","BATTERYEPLACEDATE","NOTE"] ;
            break;
        case "HISTORYALARMINFO":
            fieldarr = ["ALARMCAUSE","ALARMTIME"];
            break;
        default:
    }
    //判断是否在显示字段数组内
    if(fieldarr!=[]){
        for(var i=0;i<fieldarr.length;i++){
            if(field.toUpperCase()==fieldarr[i]) {
                isdisplay=true;
                break;
            }


        }
    }


    return isdisplay  ;

}

