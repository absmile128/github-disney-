package smi.servlet;

import smi.webservice.WebServiceImpl;
import smi.webservice.WebServiceImplService;
import smi.webservice.WebServiceImplServiceLocator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Calendar;

/**
 * Created by cy on 2017/8/10.
 */
public class CoverServlet extends javax.servlet.http.HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        //获取参数（前台）
        String commdCode=request.getParameter("commdCode");
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        //根据不同参数调用不同函数
        if(commdCode.equals("getWellCoverHistoryAlarmByTimePager")){
            getWellCoverHistoryAlarmByTimePager(request,response);
        }else if (commdCode.equals("getWellCoverByMachinecode")){
            getWellCoverByMachinecode(request,response);
        } else if (commdCode.equals("getAbnormalWellCoverList")){
            getAbnormalWellCoverList(request,response);
        }



    }


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws javax.servlet.ServletException, IOException {

    }


    private void getWellCoverHistoryAlarmByTimePager(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
//        JSONObject jsonObject = new JSONObject();
        //获取参数（前台）
        String startDate=request.getParameter("startDate");

        String[] start=startDate.split( "-");

//    start=start[0]+start[1]+start[2];
        String endDate=request.getParameter("endDate");
        String[] end=endDate.split ( "-");
        Integer pageNo=new  Integer(   request.getParameter("pageNo"));
        Integer pageSize=new  Integer( request.getParameter("pageSize"));


    try{
        //调用后台服务
        //创建一个用于产生WebServiceImpl实例的工厂，WebServiceImplService类是wsimport工具生成的
        WebServiceImplService factory = new WebServiceImplServiceLocator();
        //通过工厂生成一个WebServiceImpl实例，WebServiceImpl是wsimport工具生成的
        WebServiceImpl wsImpl = factory.getWebServiceImplPort();
        //调用WebService的sayHello方法
        Calendar s1 = Calendar.getInstance();//获取一个日历实例
        s1.set(Integer.parseInt(start[0]), Integer.parseInt(start[1]), Integer.parseInt(start[2]),0,0,0);//设定日历的日期
        Calendar s2 = Calendar.getInstance();//获取一个日历实例
        s2.set(Integer.parseInt(end[0]), Integer.parseInt(end[1]), Integer.parseInt(end[2]),0,0,0);//设定日历的日期


        String resResult = wsImpl.getWellCoverHistoryAlarmList3(s1,s2,pageNo,pageSize);



          //输出结果 （返回前台）
//            jsonObject.put("outStr", resResult);
            PrintWriter out;
            out=response.getWriter();
//            out.write(jsonObject.toString());
        out.write( resResult);
        }  catch (javax.xml.rpc.ServiceException e)
         {
        e.printStackTrace();
       }catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    private void getWellCoverByMachinecode(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
//        JSONObject jsonObject = new JSONObject();
        //获取参数（前台）
        String machinecode=request.getParameter("machinecode");
        Integer pageNo=new  Integer(   request.getParameter("pageNo"));
        Integer pageSize=new  Integer( request.getParameter("pageSize"));


        try{
            //调用后台服务
            //创建一个用于产生WebServiceImpl实例的工厂，WebServiceImplService类是wsimport工具生成的
            WebServiceImplService factory = new WebServiceImplServiceLocator();
            //通过工厂生成一个WebServiceImpl实例，WebServiceImpl是wsimport工具生成的
            WebServiceImpl wsImpl = factory.getWebServiceImplPort();
            String resResult = wsImpl.getWellCoverByMachinecode(machinecode,pageNo,pageSize);



            //输出结果 （返回前台）
            PrintWriter out;
            out=response.getWriter();
            out.write( resResult);
        }  catch (javax.xml.rpc.ServiceException e)
        {
            e.printStackTrace();
        }catch (IOException e)
        {
            e.printStackTrace();
        }
    }
//    private void getWellCoverTotalCountByMachinecode(HttpServletRequest request, HttpServletResponse response) {
//        HttpSession session = request.getSession();
//        //获取参数（前台）
//        String machinecode=request.getParameter("machinecode");
//
//
//        try{
//            //调用后台服务
//            //创建一个用于产生WebServiceImpl实例的工厂，WebServiceImplService类是wsimport工具生成的
//            WebServiceImplService factory = new WebServiceImplServiceLocator();
//            //通过工厂生成一个WebServiceImpl实例，WebServiceImpl是wsimport工具生成的
//            WebServiceImpl wsImpl = factory.getWebServiceImplPort();
//            String resResult = wsImpl.getWellCoverTotalCountByMachinecode(machinecode);
//
//
//
//            //输出结果 （返回前台）
//            PrintWriter out;
//            out=response.getWriter();
//            out.write( resResult);
//        }  catch (javax.xml.rpc.ServiceException e)
//        {
//            e.printStackTrace();
//        }catch (IOException e)
//        {
//            e.printStackTrace();
//        }
//    }

    private  void  getAbnormalWellCoverList  (HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
        try{
            //调用后台服务
            //创建一个用于产生WebServiceImpl实例的工厂，WebServiceImplService类是wsimport工具生成的
            WebServiceImplService factory = new WebServiceImplServiceLocator();
            //通过工厂生成一个WebServiceImpl实例，WebServiceImpl是wsimport工具生成的
            WebServiceImpl wsImpl = factory.getWebServiceImplPort();
            String resResult = wsImpl.getAbnormalWellCoverList();
            //输出结果 （返回前台）
            PrintWriter out;
            out=response.getWriter();
            out.write( resResult);
        }  catch (javax.xml.rpc.ServiceException e)
        {
            e.printStackTrace();
        }catch (IOException e)
        {
            e.printStackTrace();
        }
    }
}
