/*
Script Created by FlatTutorials for "Car Controller kit".
*/

@script AddComponentMenu ("FlatTutorials/Scripts/Destroy Timer Script")
#pragma strict
var destroyAfter : float = 7; 	//Waitin time to destroy a object in seconds
private var timer : float; 	//Counting time

//Calculation

function Update () {
timer += Time.deltaTime;
if (destroyAfter <= timer){
Destroy(gameObject);
}
}