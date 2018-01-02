/**
 * User: wyh
 * Date: 12-11-21
 * Time: 下午11:03
 * Desc:
 */

var STAMP_config = {};

STAMP_config.server = {
    ip : "http://10.67.207.138",  // 基础数据服务器地址
    screen : 0                       // 基础数据配置文件索引
};

STAMP_config.constants = {
    TRACKFILE : "\\track\\trackList",                // 飞行路线
    ANIMFILE : "\\visit\\visit",                  // 动画
    CAMERAFILE : "\\camera\\camera",                  // 摄像机
    VIEWPOINTFILE: '\\viewpoint\\viewpoint',             // 视点
    USERDATA: '\\userdata\\'             // 用户数据
};
STAMP_config.spatial = [] ;   //   所有project图层的spatial文件