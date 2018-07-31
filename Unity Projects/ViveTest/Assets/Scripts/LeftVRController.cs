using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LeftVRController : MonoBehaviour {

	public TextMesh textMesh; 
    
	private SteamVR_TrackedController trackedController;
    private SteamVR_TrackedObject trackedObject;
    private SteamVR_Controller.Device device;

	private string plan = "";

	// planner
	private string plannerPlanTopic = "planner/plan";

	// user
	private string controlMotorTopic = "control/motor";

	private bool isCreatingPlan = false;

    void Start () {
        trackedController = GetComponent<SteamVR_TrackedController>();
        // trackedController.TriggerClicked += Trigger;

        trackedObject = GetComponent<SteamVR_TrackedObject>();

        InvokeRepeating("PublishPosition", 0.25f, 1f);
	}
	
	// Update is called once per frame
	void Update () {
        device = SteamVR_Controller.Input((int)trackedObject.index);

		string directionChar = "";
		
		// VIVE
		if (device.GetPressDown(SteamVR_Controller.ButtonMask.Touchpad)) {
			var touchAxis = device.GetAxis();
			if (touchAxis.x != 0 && touchAxis.y != 0) {
				string viveDirectionChar = directionCharForTouchPadAxis(touchAxis);
				if (viveDirectionChar != "") {
					directionChar = viveDirectionChar;
				}

				// bool isSubmitButtonPressed = device.GetPress(SteamVR_Controller.ButtonMask.Trigger);
				// publishOrPlan(directionChar, isSubmitButtonPressed);

				// PublishTouchPadDirection(touchAxis);			
				//  Debug.Log(touchAxis.x + ", " + touchAxis.y);
			}
		}

		// XBOX Controller
		// Get the direction char if a direction is pressed
		if (Input.GetButtonDown("Fire1")){ // GetButtonDown -- true only on the frame where the button was first pressed down
			directionChar = "B";
        }else if (Input.GetButtonDown("Fire2")){
			directionChar = "R";
		}else if (Input.GetButtonDown("Fire3")){
			directionChar = "L";
		}else if (Input.GetButtonDown("Jump")){
			directionChar = "F";
		}
		
		// Publish or plan with either controller
		bool isSubmitButtonPressed = Input.GetButton("Submit") || device.GetPress(SteamVR_Controller.ButtonMask.Trigger);
		publishOrPlan(directionChar, isSubmitButtonPressed);

        // if (device.GetPressDown(SteamVR_Controller.ButtonMask.Trigger)) { // This doesn't work
        //     Debug.Log("LEFT trigger pressed --- tracked");
        //     device.TriggerHapticPulse(300);
        // }

		// if (trackedController.triggerPressed) { // This works
        //     device.TriggerHapticPulse(300);  // This works
        // }
	}

	void publishOrPlan(string directionChar, bool isSubmitButtonPressed) {
		if (isSubmitButtonPressed) {
			isCreatingPlan = true;

			if (directionChar != "") {
				Debug.Log("Adding plan!!! " + directionChar);
				addPlanLetter(directionChar);
			}
		} else {
			if (isCreatingPlan) {
				isCreatingPlan = false;

				if (plan != "") {
					publishAndResetPlan();
				}
			} else {
				if (directionChar != "") {
					BotMQTT.instance.Publish(directionChar, BotMQTT.instance.controlMotorTopic);
				}
			}
		}
	}

    void PublishPosition() {
		if (trackedController.triggerPressed) { // This works
            Debug.Log("trigger pressed --- tracked controller");
            
            var position = trackedObject.transform.position;   
            // BotMQTT.instance.Publish(positionToJSON(position), controlMotorTopic);
        }
    }
	string directionCharForTouchPadAxis(Vector2 touchPadAxis) {
		string directionChar = "";

		if(Mathf.Abs(touchPadAxis.x) > Mathf.Abs(touchPadAxis.y)){
			if(touchPadAxis.x > 0){
				directionChar = "R";
			}else{
				directionChar = "L";
			}
		}else{
			if(touchPadAxis.y > 0){
				directionChar = "F";
			}else{
				directionChar = "B";
			}
		}

		return directionChar;
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

	// TEXT MESH
	void addPlanLetter(string step) {
		plan = plan + step;

		string stepChar = step;
		if (step == "F") {
			stepChar = "⇧ ";
		} else if (step == "B") {
			stepChar = "⇩ ";
		} else if (step == "L") {
			stepChar = "⇦ ";
		} else if (step == "R") {
			stepChar = "⇨ ";
		}
		textMesh.text = textMesh.text + stepChar;
	}

	void publishAndResetPlan() {
		BotMQTT.instance.Publish(plan, BotMQTT.instance.controlMotorTopic);

		plan = "";
		textMesh.text = plan;
	}
}

