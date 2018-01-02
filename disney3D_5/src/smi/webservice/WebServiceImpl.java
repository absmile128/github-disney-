/**
 * WebServiceImpl.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package smi.webservice;

public interface WebServiceImpl extends java.rmi.Remote {
    public java.lang.String getWellCoverHistoryAlarmList3(java.util.Calendar arg0, java.util.Calendar arg1, java.lang.Integer arg2, java.lang.Integer arg3) throws java.rmi.RemoteException;
    public java.lang.String getWellCoverByMachinecode(java.lang.String arg0, java.lang.Integer arg1, java.lang.Integer arg2) throws java.rmi.RemoteException;
    public java.lang.String getAbnormalWellCoverList() throws java.rmi.RemoteException;
}
