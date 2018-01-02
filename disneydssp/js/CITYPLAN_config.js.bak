/**
 * User: wyh
 * Date: 12-11-21
 * Time: 下午11:03
 * Desc:
 */

var CODEMAP = {
    Status: {
        1: '审批',
        2: '待审批',
        3: '已审批'
    },
    Stage: {
        1: '策划阶段',
        2: '设计阶段',
        3: '详规阶段',
        4: '方案' //'单体阶段'
    }
};
var CITYPLAN_config = {};

CITYPLAN_config.server = {
    ip: "http://10.0.1.142", // 基础数据服务器地址 184
    screen: 0, // 基础数据配置文件索引
    dataServerIP: "http://10.0.1.142", // 编辑平台数据库服务IP
    serviceIP: "http://10.0.1.142", // 规划服务的IP地址
    stampMgrIp: 'http://10.0.1.142:8080', //StampManager2
    stampMgrUrl: 'http://10.0.1.142:8080/StampManager2' //StampManager2 的网址（cy）
 //   returnDataType: 'xml'
};

CITYPLAN_config.auth = {
    enableAuth: false,
    loginTitle: '三维城市规划管理审批系统-登录',
    loginCaption: '三维城市规划管理审批系统',
    loginImg: 'image/loginImg.png'
};

CITYPLAN_config.constant = {
    PresentId: "6632bbf5-4939-4ac3-adcf-41beedeb7aee", // 现状模式图层ID
    PlanId: "39950655-0e65-4ffe-8dbf-c1248c35c543", // 设计模式图层ID
    MixedId: "1a6dc550-6c27-452c-a66b-53d81b794c1b", // 混合模式图层ID
    StartupPositionPath: "temp\\StartupPosition", // 默认视点保存位置，文件名为StartupPosition.xml
    SubjectFolderName: "项目专题", // 项目专题文件夹名称
    PlanListFileName: "方案列表.xml", // 方案列表XML文件名
    SpatialRefFileName: "空间参考.spatial", // 空间参考文件名
    BuildingAttributeFileName: "建筑属性.xml", // 建筑属性XML文件名
    PlanAttributeFileName: "方案信息.xml", // 方案属性XML文件名
    BuildingModelFolderName: "建筑模型", // 建筑模型文件夹名称
    GroundModelFolderName: "地面模型", // 地面模型文件夹名称
    AttachmentInfoFileName: "附件信息.xml", // 方案附件信息XML文件名

    g_boxLayerName: "ruleplanbox", // 导入的控规盒图层的名称
    g_roadLayerName: "roadcenline", // 导入的用于道路名显示的图层的名称
    g_boxLayerGuid: "05a80505-5a90-4db0-9bb3-28b43ebc6f2b", // 导入的控规盒图层的GUID
    g_roadLayerGuid: "4073f55f-97f9-4a09-8b35-f7f4713d858a" // 导入的用于道路名显示的图层的GUID
};

CITYPLAN_config.service = {
    add: CITYPLAN_config.server.serviceIP + "/se_city_plan?type=add",
    update: CITYPLAN_config.server.serviceIP + "/se_city_plan?type=update",
    query: CITYPLAN_config.server.serviceIP + "/se_city_plan?type=query",
    remove: CITYPLAN_config.server.serviceIP + "/se_city_plan?type=delete",
    count: CITYPLAN_config.server.serviceIP + "/se_city_plan?type=count",
    addVpPic: CITYPLAN_config.server.serviceIP + "/se_city_plan?type=blob&operation=add&tablename=CPVIEWPOINT&filed=PICTURE&id=",
    getVpPic: CITYPLAN_config.server.serviceIP + "/se_city_plan?type=blob&operation=get&tablename=CPVIEWPOINT&filed=PICTURE&id=",
    addAnimPic: CITYPLAN_config.server.serviceIP + "/se_city_plan?type=blob&operation=add&tablename=CPANIMATION&filed=PICTURE&id=",
    getAnimPic: CITYPLAN_config.server.serviceIP + "/se_city_plan?type=blob&operation=get&tablename=CPANIMATION&filed=PICTURE&id=",
    addAttachmentObj: CITYPLAN_config.server.serviceIP + "/se_city_plan?type=blob&operation=add&tablename=CPATTACHMENT&filed=OBJ&id=",
    getAttachmentObj: CITYPLAN_config.server.serviceIP + "/se_city_plan?type=blob&operation=get&tablename=CPATTACHMENT&filed=OBJ&id=",

 //   authentication: CITYPLAN_config.server.stampMgrIp + '/StampManager2/functionAction.do?method=webServiceList&p=cityplan_b/s'
    authentication: CITYPLAN_config.server.stampMgrIp + '/StampManager2/functionAction.do?method=webServiceList&p=disneysys'

};
CITYPLAN_config.BoxColor = {
    "R": 0x7FF0EE1A, //居住用地
    "R1": 0x7FFAFA99, //一类居住用地
    "R2": 0x7FEBF01B, //二类居住用地
    "R3": 0x7FF8E792, //三类居住用地
    "R4": 0x7FFCC10D, //四类居住用
    "Rx": 0x7FCDA011, //其他类居住用地
    "Re": 0x7FEEBD74, //幼托，中小学用地
    "Rc": 0x7FE47917, //基层社会中心
    "Rb": 0x7FE47917, //住宅混合用地
    "Rn": 0x7FD10013, //居住小区

    "C": 0x7FD10013, //公共设施
    "C1": 0x7FE58AAC, //行政办公
    "C2": 0x7FCE0005, //商业金融
    "C3": 0x7FFCA785, //文化娱乐
    "C4": 0x7FB5D67E, //体育用地
    "C6": 0x7FEF8318, //教育科研
    "C9": 0x7FEA89AF, //公益性设施
    "Cc": 0x7FC3031A, //社区中心
    "Cb": 0x7FC3031A, //商办混合

    "M": 0x7FB48D59, //工业用地
    "M1": 0x7FB48D59, //一类工业
    "M2": 0x7F89430C, //二类工业
    "M3": 0x7F5A3609, //三类工业

    "W": 0x7F582078, //仓储
    "W1": 0x7F582078, //普通仓库
    "W2": 0x7F582078, //危险品仓库
    "W3": 0x7F582078, //堆场

    "T": 0x7F7C7C7C, //对外交通
    "T1": 0x7F7C7C7C, //铁路
    "T2": 0x7FFEFEFE, //公路
    "T3": 0x7F7E7E7E, //管道
    "T4": 0x7F7B7B7B, //港口
    "T5": 0x7F7B7B7B, //机场
    "Tn": 0x7F7B7B7B, //对外交通设施点

    "S": 0x7FFDFDFD, //道路广场
    "S1": 0x7FFDFDFD, //道路
    "S2": 0x7FA0CF6B, //广场
    "S3": 0x7F7F7F7F, //停车场

    "U": 0x7F9EBEE5, //市政公用
    "U1": 0x7F9EBEE5, //供应设施
    "U2": 0x7F9EBEE5, //交通设施
    "U3": 0x7F9EBEE5, //邮电
    "U4": 0x7F9EBEE5, //环境卫生
    "U5": 0x7F9EBEE5, //施工于维护
    "U6": 0x7F9EBEE5, //殡葬
    "U9": 0x7F9EBEE5, //其他市政公用
    "Un": 0x7F9EBEE5, //市政公用设施点

    "G": 0x7F83BA18, //绿地
    "G1": 0x7F83BA18, //公用绿地
    "G2": 0x7F4A9C2C, //生产防护绿地

    "D": 0x7F578A1B, //特殊用地
    "D1": 0x7F578A1B, //军事用地
    "D2": 0x7F578A1B, //外事用地
    "D3": 0x7F578A1B, //保安用地

    "K": 0x7FC1C1C1, //预留地
    "Kc": 0x7FC1C1C1, //公共设施预留地
    "Ku": 0x7FC1C1C1, //市政

    "E": 0x7F93C293, //水域其他
    "E1": 0x7F93CBE6, //水域
    "E2": 0x7FA5C719, //耕地
    "E3": 0x7F96C199, //园地
    "E4": 0x7F96C199, //林地
    "E5": 0x7F96C199, //牧地
    "E6": 0x7FDCE476, //村镇建设
    "E7": 0x7F748F1D, //弃置地
    "E8": 0x7F75910F, //露天采矿
    "Eg": 0x7F2F611F //郊野绿地
};


CITYPLAN_config.disney = {
    loginUrl : "http://172.26.36.71:8080/DisneyWebService3/islogin.from" , // 代理服务（解决调用宝信跨域问题）
    moduleAttrserverUrl : "http://172.26.36.71:8080/DisneyWebService/getModuleAttribute.from" , // 调用建筑属性地址
    //    SEVIEWsxt_layerid: "8e51f997-35f2-45b8-a1d3-36caab18358d"

    //SEVIEWsxt_layerid:"a9941c07-7e18-4e87-85e9-ab6c3dcf7935"
  //  SEVIEWsxt_layerid:"9760ce3a-bed7-4507-bcb5-efb396fe5e24"   ,
		// SEVIEWsxt_layerid:"e0f7bc90-c8af-4ec5-8295-9ceb176eadc6"   ,
   // SEVIEWsxt_layerid:"8e335a20-3495-4da1-a33c-2c746724748a"   ,

		SEVIEWsxt_layerid:"36ade043-44e8-474f-b36f-8d5eaebc0187"   ,
    //   sxt_layerid: "00f7c613-1335-4f48-8cf1-6aa06126b319"   //摄像头图层guid (现状模型，并在StampManager发布到当前项目下（为隐藏） disney_plan下)


 //   TrackTypeval:3,//选择飞行方式（第一人称:1或跟随:3）   (在 CITYPLAN_config.js里配置)
    TrackTypeval:1,//选择飞行方式（第一人称:1或跟随:3）   (在 CITYPLAN_config.js里配置)
 //   FlyObjval:"05306aac-ee93-4faf-85bd-1edbf4569bd3"//飞行物体为摄像机  （cy:飞行路线中强制定义）
      FlyObjval:"5bcb4f65-77b0-4b3e-b000-2122d680d4a2",//飞行物体为女人  （cy:飞行路线中强制定义）
      PartProjectId: "8f1e7ba8-6564-4650-ac28-5c7247391c65"   //网格部件工程ID
};