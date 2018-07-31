using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RobotPlanner {

private Vector2 currentPosition;
private Vector2 targetPosition;

	private class Plan {
		Vector2 [] targetPositions;
		int currentIndex;
		
	}

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}

	public void didReceiveTargetPositions(string payload) {
		string [] vectStrings = payload.Split('-');
		List<Vector2> allPositions = new List<Vector2>();
		int i = 0;

		foreach (string vectstr in vectStrings) {
			
			string[] xyStrings = vectstr.Split(',');

			if (xyStrings.Length == 2) {
				Vector2 vector = new Vector2();
				vector.x = float.Parse(xyStrings[0]);
				vector.y = float.Parse(xyStrings[1]);
				allPositions.Add(vector);
				i++;
			} else {
				Debug.LogError("WARNING: Was expecting 2 values in the vector, but got " + xyStrings.Length.ToString() + "| Original string " + vectstr);
			}
		}

		Debug.Log("postionArray: " + allPositions[3]);
	}
}
