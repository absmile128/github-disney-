/**
 * User: wyh
 * Date: 12-11-21
 * Time: 下午11:03
 * Desc:
 */


var CITYPLAN_config = {};

CITYPLAN_config.server = {
    ip: "http://172.26.36.71", // 基础数据服务器地址 184
    screen: 0, // 基础数据配置文件索引
    dataServerIP: "http://172.26.36.71", // 编辑平台数据库服务IP
    serviceIP: "http://172.26.36.71", // 规划服务的IP地址
    stampMgrIp: 'http://172.26.36.71:8080', //StampManager2
    stampMgrUrl: 'http://172.26.36.71:8080/StampManager2' //StampManager2 的网址（cy）
 //   returnDataType: 'xml'
};

CITYPLAN_config.auth = {
    enableAuth: true   //内部权限控制
};
//各子系统用户名、密码
CITYPLAN_config.user = {
    disneysz: {
        username: "guestsz",
        userpwd: "123456"
    },
    disneydssp:{
        username: "guestdssp",
        userpwd: "123456"
    },
    disneydxsp:{
        username: "guestdxsp",
        userpwd: "123456"
    },
    disneyswys:{
        username: "guestswys",
        userpwd: "123456"
    }



};
//各子系统url
CITYPLAN_config.url = {
    disneysz: {
       url: top.location.href.substring(0,top.location.href.lastIndexOf('/')) + '/main.html'
    },
    disneydssp: {
        url: "http://172.26.36.71/disneydssp/main2.html"
    },
    disneydxsp:{
        url: "http://172.26.36.71/disneydxsp/main.html"
    },
    disneyswys:{
        url: "http://172.26.36.71/disneyswys/main2.html"
    }
};
CITYPLAN_config.constant = {

    StartupPositionPath: "temp\\StartupPosition"  // 默认视点保存位置，文件名为StartupPosition.xml

  };

CITYPLAN_config.service = {
     authentication: CITYPLAN_config.server.stampMgrIp + '/StampManager2/functionAction.do?method=webServiceList'

};


CITYPLAN_config.disney = {
    currentPrjGuid:"db6ee0b3-7142-4103-8da7-8bd0f64557c0",//当前工程，用于管线开挖、查询
    // loginUrl : "http://172.26.36.71:8080/DisneyWebService3/islogin.from" , // 代理服务（解决调用宝信跨域问题）
    // moduleAttrserverUrl : "http://172.26.36.71:8080/DisneyWebService/getModuleAttribute.from" , // 调用建筑属性地址
    xfsysUrl:"http://fubangyun.com:10081/center/v1/visualization/map",//消防子系统网址
        cover_layerid : "36dbb5bd-8d04-41b1-af30-ee7d27a77482"   , // 井盖矢量地址
        xfs_layerid : "7911b321-10df-4729-a8db-91fc041660e1"   , // 消防栓矢量地址
        js02_layerid : "7515753f-6b19-4552-a7ce-ee5ef0875840"   , // 管线点服务地址
		
		
		SEVIEWsxt_layerid:"cb78b0d1-2d80-46a3-bc1d-5371e52a052d"   ,
    //   sxt_layerid: "00f7c613-1335-4f48-8cf1-6aa06126b319"   //摄像头图层guid (现状模型，并在StampManager发布到当前项目下（为隐藏） disney_plan下)

      TrackTypeval:1,//选择飞行方式（第一人称:1或跟随:3）   (在 CITYPLAN_config.js里配置)
      FlyObjval:"5bcb4f65-77b0-4b3e-b000-2122d680d4a2",//飞行物体为女人  （cy:飞行路线中强制定义）
      WebServiceUrl:"http://221.214.110.227:12000/coverservice",   //正元的服务地址
      
      xfsServiceUrl:"http://221.214.110.227:12000/coverservice"   //fubang的服务地址
};

CITYPLAN_config.constants = {
    TRACKFILE : "\\track\\trackList",                // 飞行路线
    ANIMFILE : "\\visit\\visit",                  // 动画
    CAMERAFILE : "\\camera\\camera",                  // 摄像机
    VIEWPOINTFILE: '\\viewpoint\\viewpoint',             // 视点
    USERDATA: '\\userdata\\'             // 用户数据
};

CITYPLAN_config.spatial = [] ;   //   所有project图层的spatial文件