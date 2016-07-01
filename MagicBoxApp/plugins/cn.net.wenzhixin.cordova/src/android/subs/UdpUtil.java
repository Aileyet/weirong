package cn.weirong.vbank.app.subs;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

import android.app.Activity;
import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;

/*
 * udpͨѶ��*/
public class UdpUtil {
	private int iReceivePort = 4322;	//���յ���Ϣ�Ķ˿ں�
	private static final int TIMEOUT = 200;	// ���ó�ʱΪ100ms
	private String udpresult;	//���������ص���Ϣ
	private Activity ac;
	
	public UdpUtil(Activity aa){
		this.ac=aa;
	}
	/*
	 * ��ñ�����ip*/
	public String getLocalIp(){
		//��ȡwifi����  
        WifiManager wifiManager = (WifiManager)ac.getSystemService(Context.WIFI_SERVICE);
        //�ж�wifi�Ƿ���  
        if (!wifiManager.isWifiEnabled()) {  
        wifiManager.setWifiEnabled(true);    
        }  
        WifiInfo wifiInfo = wifiManager.getConnectionInfo();       
        int ipAddress = wifiInfo.getIpAddress();   
        String ip = intToIp(ipAddress);
        return ip;
	}
	/*ת�� ip*/
	private String intToIp(int i) {
        return (i & 0xFF ) + "." +       
      ((i >> 8 ) & 0xFF) + "." +       
      ((i >> 16 ) & 0xFF) + "." +       
      ( i >> 24 & 0xFF) ;  
   }   
	/**
	 * udp�㲥
	 * ������Ϣ
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
			// ��������Ϊ�㲥
			socketSend.setBroadcast(true);
			// ���÷��͵���Ϣ
			String str = BroadcastData;
			// ���ͺͽ��յ����ݰ�
			byte[] dataSend = str.getBytes();
			byte[] dataReceive = new byte[512];
			// ���͵�ַ
			InetAddress address = InetAddress.getByName(BroadcastIP);
			// �����������͵����ݱ�
			DatagramPacket sendPacket = new DatagramPacket(dataSend,
					dataSend.length, address, BroadcastPort);
			int i = 0;
			//�Ƿ���յ�����
			boolean bFindGateway = false;
			while(!bFindGateway && i<5){
				i++;
				// ͨ���׽��ַ�������
				socketSend.send(sendPacket);
				//System.out.println("send message is ok.");
				// �����������͵����ݱ�
				DatagramPacket packetReceive = new DatagramPacket(
						dataReceive, dataReceive.length);
				try {
					// ͨ���׽��ֽ�������
					socketReceive.receive(packetReceive);
					//System.out.println("receive message is ok.");
					// ��÷���ip��ַ
					String ip = packetReceive.getAddress().getHostAddress();
					//���������ص�����
					udpresult = new String(packetReceive.getData(),
							packetReceive.getOffset(),
							packetReceive.getLength());
					//Log.i("", "data:" + udpresult);
					//Log.i("", "ip:" + ip);
					if (udpresult != null && !udpresult.equals("")) {
						bFindGateway = true;
						// �ر��׽���
						socketSend.close();
						socketReceive.close();
					}
				} catch (Exception e) {
					// ������׳����ճ�ʱ�쳣��Ȼ�����ѭ��
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
