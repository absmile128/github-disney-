/**
 * WebServiceImplServiceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package smi.webservice;

public class WebServiceImplServiceLocator extends org.apache.axis.client.Service implements smi.webservice.WebServiceImplService {

    public WebServiceImplServiceLocator() {
    }


    public WebServiceImplServiceLocator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public WebServiceImplServiceLocator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for WebServiceImplPort
    private java.lang.String WebServiceImplPort_address = "http://localhost:8989/services/Webservice";

    public java.lang.String getWebServiceImplPortAddress() {
        return WebServiceImplPort_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String WebServiceImplPortWSDDServiceName = "WebServiceImplPort";

    public java.lang.String getWebServiceImplPortWSDDServiceName() {
        return WebServiceImplPortWSDDServiceName;
    }

    public void setWebServiceImplPortWSDDServiceName(java.lang.String name) {
        WebServiceImplPortWSDDServiceName = name;
    }

    public smi.webservice.WebServiceImpl getWebServiceImplPort() throws javax.xml.rpc.ServiceException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(WebServiceImplPort_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new javax.xml.rpc.ServiceException(e);
        }
        return getWebServiceImplPort(endpoint);
    }

    public smi.webservice.WebServiceImpl getWebServiceImplPort(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            smi.webservice.WebServiceImplPortBindingStub _stub = new smi.webservice.WebServiceImplPortBindingStub(portAddress, this);
            _stub.setPortName(getWebServiceImplPortWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }

    public void setWebServiceImplPortEndpointAddress(java.lang.String address) {
        WebServiceImplPort_address = address;
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        try {
            if (smi.webservice.WebServiceImpl.class.isAssignableFrom(serviceEndpointInterface)) {
                smi.webservice.WebServiceImplPortBindingStub _stub = new smi.webservice.WebServiceImplPortBindingStub(new java.net.URL(WebServiceImplPort_address), this);
                _stub.setPortName(getWebServiceImplPortWSDDServiceName());
                return _stub;
            }
        }
        catch (java.lang.Throwable t) {
            throw new javax.xml.rpc.ServiceException(t);
        }
        throw new javax.xml.rpc.ServiceException("There is no stub implementation for the interface:  " + (serviceEndpointInterface == null ? "null" : serviceEndpointInterface.getName()));
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(javax.xml.namespace.QName portName, Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        if (portName == null) {
            return getPort(serviceEndpointInterface);
        }
        java.lang.String inputPortName = portName.getLocalPart();
        if ("WebServiceImplPort".equals(inputPortName)) {
            return getWebServiceImplPort();
        }
        else  {
            java.rmi.Remote _stub = getPort(serviceEndpointInterface);
            ((org.apache.axis.client.Stub) _stub).setPortName(portName);
            return _stub;
        }
    }

    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://service.smi/", "WebServiceImplService");
    }

    private java.util.HashSet ports = null;

    public java.util.Iterator getPorts() {
        if (ports == null) {
            ports = new java.util.HashSet();
            ports.add(new javax.xml.namespace.QName("http://service.smi/", "WebServiceImplPort"));
        }
        return ports.iterator();
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(java.lang.String portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        
if ("WebServiceImplPort".equals(portName)) {
            setWebServiceImplPortEndpointAddress(address);
        }
        else 
{ // Unknown Port Name
            throw new javax.xml.rpc.ServiceException(" Cannot set Endpoint Address for Unknown Port" + portName);
        }
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(javax.xml.namespace.QName portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        setEndpointAddress(portName.getLocalPart(), address);
    }

}
