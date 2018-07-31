using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RightVRController : MonoBehaviour {

    private SteamVR_TrackedController trackedController;
    private SteamVR_TrackedObject trackedObject;
    private SteamVR_Controller.Device device;

	// planner
	private string plannerPlanTopic = "planner/plan";

	// user
	private string controlMotorTopic = "control/motor";

    void Start () {
        trackedController = GetComponent<SteamVR_TrackedController>();
        // trackedController.TriggerClicked += Trigger;

        trackedObject = GetComponent<SteamVR_TrackedObject>();

        InvokeRepeating("PublishPosition", 0.25f, 1f);
	}
	
	// Update is called once per frame
	void Update () {
        device = SteamVR_Controller.Input((int)trackedObject.index);

        // if (device.GetPressDown(SteamVR_Controller.ButtonMask.Trigger)) { // This doesn't work
        //     Debug.Log("trigger pressed --- tracked");
        //     device.TriggerHapticPulse(300);
        // }

		// if (trackedController.triggerPressed) { // This works
        //     device.TriggerHapticPulse(300);  // This works
        // }
	}


    void PublishPosition() {
		if (trackedController.triggerPressed) { // This works
            Debug.Log("trigger pressed --- tracked controller");
            
            var position = trackedObject.transform.position;   
            // BotMQTT.instance.Publish(positionToJSON(position), controlMotorTopic);

            

        }
    }



    // void Trigger(object sender, ClickedEventArgs e)
    // {
    //     Debug.Log("Trigger has been pressed!!!");
    // }

    static string positionToJSON(Vector3 vector) {
        var json = "{";
		json += "\"x\": " + vector.x.ToString() + ",";
		json += "\"y\": " + vector.y.ToString() + ",";
		json += "\"z\": " + vector.z.ToString();
		json += "}";
		return json;
    }

}

