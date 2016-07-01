package cn.weirong.vbank.app.subs;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

import android.app.Activity;
import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;

/*
 * udp通讯类*/
public class UdpUtil {
	private int iReceivePort = 4322;	//接收到消息的端口号
	private static final int TIMEOUT = 200;	// 设置超时为100ms
	private String udpresult;	//服务器返回的消息
	private Activity ac;
	
	public UdpUtil(Activity aa){
		this.ac=aa;
	}
	/*
	 * 获得本机的ip*/
	public String getLocalIp(){
		//获取wifi服务  
        WifiManager wifiManager = (WifiManager)ac.getSystemService(Context.WIFI_SERVICE);
        //判断wifi是否开启  
        if (!wifiManager.isWifiEnabled()) {  
        wifiManager.setWifiEnabled(true);    
        }  
        WifiInfo wifiInfo = wifiManager.getConnectionInfo();       
        int ipAddress = wifiInfo.getIpAddress();   
        String ip = intToIp(ipAddress);
        return ip;
	}
	/*转换 ip*/
	private String intToIp(int i) {
        return (i & 0xFF ) + "." +       
      ((i >> 8 ) & 0xFF) + "." +       
      ((i >> 16 ) & 0xFF) + "." +       
      ( i >> 24 & 0xFF) ;  
   }   
	/**
	 * udp广播
	 * 发送信息
	 */
	public String sendDataResult(String BroadcastData,String BroadcastIP,int BroadcastPort) {

		try {

			DatagramSocket socketSend = new DatagramSocket();
			DatagramSocket socketReceive;
			if (iReceivePort == 0) {
				socketReceive = socketSend;
				//Log.i("", "socketSend = socketReceive");
			} else {
				socketReceive = new DatagramSocket(iReceivePort);
			}
			socketReceive.setSoTimeout(TIMEOUT);
			// 发送设置为广播
			socketSend.setBroadcast(true);
			// 设置发送的消息
			String str = BroadcastData;
			// 发送和接收的数据包
			byte[] dataSend = str.getBytes();
			byte[] dataReceive = new byte[512];
			// 发送地址
			InetAddress address = InetAddress.getByName(BroadcastIP);
			// 创建发送类型的数据报
			DatagramPacket sendPacket = new DatagramPacket(dataSend,
					dataSend.length, address, BroadcastPort);
			int i = 0;
			//是否接收到数据
			boolean bFindGateway = false;
			while(!bFindGateway && i<5){
				i++;
				// 通过套接字发送数据
				socketSend.send(sendPacket);
				//System.out.println("send message is ok.");
				// 创建接收类型的数据报
				DatagramPacket packetReceive = new DatagramPacket(
						dataReceive, dataReceive.length);
				try {
					// 通过套接字接收数据
					socketReceive.receive(packetReceive);
					//System.out.println("receive message is ok.");
					// 获得反馈ip地址
					String ip = packetReceive.getAddress().getHostAddress();
					//服务器返回的数据
					udpresult = new String(packetReceive.getData(),
							packetReceive.getOffset(),
							packetReceive.getLength());
					//Log.i("", "data:" + udpresult);
					//Log.i("", "ip:" + ip);
					if (udpresult != null && !udpresult.equals("")) {
						bFindGateway = true;
						// 关闭套接字
						socketSend.close();
						socketReceive.close();
					}
				} catch (Exception e) {
					// 这里会抛出接收超时异常，然后继续循环
					e.printStackTrace();
					//Log.i("", "udp receive timeout:");
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return udpresult;
		
	}
}
