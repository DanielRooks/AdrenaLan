using UnityEngine;
using System.Collections;
using System.Net;
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;
using uPLibrary.Networking.M2Mqtt.Utility;
using uPLibrary.Networking.M2Mqtt.Exceptions;

using System;

public class BotMQTT : MonoBehaviour {
	public static BotMQTT instance = null;
	public RobotPlanner robotPlanner = new RobotPlanner();

	private MqttClient client;
	// Use this for initialization

	// planner
	private string plannerPlanTopic = "planner/plan";

	// user
	public string controlMotorTopic = "control/motor";

	void Awake() {
		if (instance == null) {
			instance = this;
		}
	}

	void Start () {
		// create client instance 
		client = new MqttClient(IPAddress.Parse("192.168.1.113"), 1883, false, null); 
		
		// register to message received 
		client.MqttMsgPublishReceived += client_MqttMsgPublishReceived; 
		
		string clientId = Guid.NewGuid().ToString(); 
		client.Connect(clientId); 
		
		// subscribe to the topic "/home/temperature" with QoS 2 
		client.Subscribe(new string[] { plannerPlanTopic }, new byte[] { MqttMsgBase.QOS_LEVEL_AT_LEAST_ONCE });
		//.QOS_LEVEL_EXACTLY_ONCE }); 
	}
	public void Publish(String message, String topic) {
			Debug.Log("Publishing: " + message + " at Topic: " + topic);
			client.Publish(topic, System.Text.Encoding.UTF8.GetBytes(message), MqttMsgBase.QOS_LEVEL_EXACTLY_ONCE, true);
	}
	void client_MqttMsgPublishReceived(object sender, MqttMsgPublishEventArgs e) { 
		var message = System.Text.Encoding.UTF8.GetString(e.Message);
		Debug.Log("Received: " + message + " from: " + e.Topic);
		
		if(e.Topic == plannerPlanTopic) {
			robotPlanner.didReceiveTargetPositions(message);
		}
	} 

	// void OnGUI(){
	// 	if (GUI.Button (new Rect (20,40,80,20), "Level 1")) {
	// 		Debug.Log("level 1 pressed");

	// 	   Publish("6,7.2-1.7,1.4-3.37,4.343-12.23,234.23", plannerPlanTopic);
	// 	}
	// }

	void Update () {
	}
}
